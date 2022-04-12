import * as React from "react"
import Code from "@/view/code"
import Content from "./content.md"
import FragShader from "./basic-perspective.frag"
import MapURL from "./map.webp"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import PinURL from "./pin.png"
import Scene, { PaintFunc } from "@/view/scene"
import Slider from "@/ui/view/slider"
import VertShader from "./basic-perspective.vert"
import "./basic-perspective.css"

export interface BasicPerspectiveProps {
    className?: string
}

interface Reference {
    slope: number
    scale: number
    x: number
    y: number
}

export default function BasicPerspective(props: BasicPerspectiveProps) {
    const ref = React.useRef<Reference>({
        slope: 30,
        scale: 200,
        x: 0,
        y: 0,
    })
    const [slope, setSlope] = React.useState(ref.current.slope)
    const [scale, setScale] = React.useState(ref.current.scale)
    const [x, setX] = React.useState(ref.current.x)
    const [y, setY] = React.useState(ref.current.y)
    React.useEffect(() => {
        ref.current.slope = slope
        ref.current.scale = scale
        ref.current.x = x
        ref.current.y = y
    }, [slope, scale, x, y])
    const render = React.useCallback(makeRender(ref), [ref])
    return (
        <article className={getClassNames(props)}>
            <Slider
                label={`Pente : ${slope} %`}
                wide={true}
                min={0}
                max={100}
                steps={1}
                value={slope}
                onChange={setSlope}
            />
            <Slider
                label={`Échelle : ${scale} %`}
                wide={true}
                min={50}
                max={400}
                steps={1}
                value={scale}
                onChange={setScale}
            />
            <Slider
                label={`X : ${x} %`}
                wide={true}
                min={-100}
                max={100}
                steps={1}
                value={x}
                onChange={setX}
            />
            <Slider
                label={`Y : ${y} %`}
                wide={true}
                min={-100}
                max={100}
                steps={1}
                value={y}
                onChange={setY}
            />
            <Scene className="full-width" play={true} onInit={render} />
            <Markdown>{Content}</Markdown>
            <Code
                className="left"
                label="Vertex Shader"
                lang="glsl"
                value={VertShader}
            />
            <Code
                className="right"
                label="Fragment Shader"
                lang="glsl"
                value={FragShader}
            />
        </article>
    )
}

function getClassNames(props: BasicPerspectiveProps): string {
    const classNames = ["custom", "BasicPerspective"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function makeRender(ref: React.MutableRefObject<Reference>): any {
    return (gl: WebGL2RenderingContext) => {
        const canvas = document.createElement("canvas")
        canvas.width = 1600
        canvas.height = 1600
        const ctx = canvas.getContext("2d")
        if (!ctx) throw Error("Unable to get Canvas 2D context!")

        let hitX = 0
        let hitY = 0
        gl.canvas.addEventListener("click", (evt) => {
            const { left, top, width, height } =
                gl.canvas.getBoundingClientRect()
            const X = (2 * (evt.clientX - left)) / width - 1
            const Y = 1 - (2 * (evt.clientY - top)) / height
            console.log("🚀 [basic-perspective] Y = ", Y) // @FIXME: Remove this line written on 2022-04-11 at 17:28
            const Cx = ref.current.x * 0.01
            const Cy = ref.current.y * 0.01
            const r = gl.drawingBufferWidth / gl.drawingBufferHeight
            const s = ref.current.scale * 0.01
            const p = ref.current.slope * 0.01
            console.log("🚀 [basic-perspective] r = ", r) // @FIXME: Remove this line written on 2022-04-11 at 20:58
            console.log("🚀 [basic-perspective] s = ", s) // @FIXME: Remove this line written on 2022-04-11 at 20:58
            console.log("🚀 [basic-perspective] p = ", p) // @FIXME: Remove this line written on 2022-04-11 at 20:58
            const y = Cy + Y / (s * r * (1 - p * Y))
            const x = Cx + X / s + X * r * p * (y - Cy)
            hitX = x
            hitY = y
            console.log("🚀 [basic-perspective] y = ", y) // @FIXME: Remove this line written on 2022-04-11 at 17:39
            const canvasX = canvas.width * (1 + x) * 0.5
            const canvasY = canvas.height * (1 - y) * 0.5
            console.log("🚀 [basic-perspective] canvasY = ", canvasY) // @FIXME: Remove this line written on 2022-04-11 at 20:55
            ctx.drawImage(img, 0, 0)
            ctx.lineWidth = 16
            ctx.strokeStyle = "#f907"
            ctx.beginPath()
            ctx.moveTo(0, canvasY)
            ctx.lineTo(canvas.width, canvasY)
            ctx.moveTo(canvasX, 0)
            ctx.lineTo(canvasX, canvas.height)
            ctx.stroke()
            gl.bindTexture(gl.TEXTURE_2D, texMap)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                canvas
            )
        })
        ctx.fillStyle = "orange"
        ctx.fillText("Hello World!", 1000, 600)
        const texMap = gl.createTexture()
        if (!texMap) throw Error("Unable to create a texture!")

        gl.bindTexture(gl.TEXTURE_2D, texMap)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            canvas
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        const img = new Image()
        img.src = MapURL
        img.onload = () => {
            ctx.drawImage(img, 0, 0)
            gl.bindTexture(gl.TEXTURE_2D, texMap)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                canvas
            )
        }

        const texPin = gl.createTexture()
        if (!texPin) throw Error("Unable to create a texture!")

        const imgPin = new Image()
        imgPin.src = PinURL
        imgPin.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texPin)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                imgPin
            )
        }

        gl.bindTexture(gl.TEXTURE_2D, texPin)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            imgPin
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        const painterFloor = new Painter(gl, 4)
        painterFloor.pokeVertStaticData(-1, -1, 0, 0, 1)
        painterFloor.pokeVertStaticData(+1, -1, 0, 1, 1)
        painterFloor.pokeVertStaticData(-1, +1, 0, 0, 0)
        painterFloor.pokeVertStaticData(+1, +1, 0, 1, 0)
        painterFloor.pushVertStaticArray()

        const painterVertical = new Painter(gl, 4)
        painterVertical.pokeVertStaticData(-0.1, 0, -0.0, 0, 1)
        painterVertical.pokeVertStaticData(+0.1, 0, -0.0, 1, 1)
        painterVertical.pokeVertStaticData(-0.1, 0, +0.2, 0, 0)
        painterVertical.pokeVertStaticData(+0.1, 0, +0.2, 1, 0)
        painterVertical.pushVertStaticArray()

        gl.clearColor(0, 0.6777, 1, 1)

        return new Promise<PaintFunc>((resolve) => {
            resolve((time) => {
                painterFloor.paint(time, (p: Painter, time: number) => {
                    gl.clear(gl.COLOR_BUFFER_BIT)
                    p.$uniTex(texMap)
                    p.$uniScale(ref.current.scale * 0.01)
                    p.$uniRatio(gl.drawingBufferWidth / gl.drawingBufferHeight)
                    p.$uniCenter(ref.current.x * 0.01, ref.current.y * 0.01)
                    p.$uniSlope(ref.current.slope * 0.01)
                })
                painterVertical.paint(time, (p: Painter, time: number) => {
                    gl.enable(gl.BLEND)
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
                    p.$uniTex(texPin)
                    p.$uniScale(ref.current.scale * 0.01)
                    p.$uniRatio(gl.drawingBufferWidth / gl.drawingBufferHeight)
                    p.$uniCenter(ref.current.x * 0.01-hitX, ref.current.y * 0.01-hitY)
                    p.$uniSlope(ref.current.slope * 0.01)
                })
            })
        })
    }
}
