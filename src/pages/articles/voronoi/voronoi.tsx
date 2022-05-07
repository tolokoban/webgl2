import * as React from "react"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import SkullImageURL from "@/gfx/skull.jpg"
import Slider from "@/ui/view/slider"
import Text from "./text.md"
import { TextureFromImageRGBA } from "@/webgl2/texture/texture-from-image-rgba"
import { TextureFromUint8ArrayRGB } from "@/webgl2/texture/texture-from-uint8array-rgb"

export interface BasicPerspectiveProps {
    className?: string
}

const SIZE = 1024
const SEA_LEVEL = 0.2
const DETAILS = 1.618

interface State {
    distortion: number
    zoom: number
    animation: number
}

export default function BasicPerspective(props: BasicPerspectiveProps) {
    const [distortion, setDistortion] = React.useState(0)
    const [zoom, setZoom] = React.useState(100)
    const [animation, setAnimation] = React.useState(0)
    const refState = React.useRef<State>({
        distortion,
        zoom,
        animation,
    })
    const render = React.useCallback(makeRender(refState), [])
    React.useEffect(() => {
        refState.current.distortion = distortion
        refState.current.zoom = zoom
        refState.current.animation = animation
    }, [distortion, zoom, animation])
    return (
        <article className={getClassNames(props)}>
            <div>Utilisez la molette pour changer la résolution.</div>
            <Slider
                label={`Zoom (${zoom} %)`}
                value={zoom}
                onChange={setZoom}
                min={20}
                max={1000}
                steps={1}
            />
            <Slider
                label={`Distortion (${distortion} %)`}
                value={distortion}
                onChange={setDistortion}
                min={0}
                max={100}
                steps={1}
            />
            <Slider
                label={`Animation (${animation} %)`}
                value={animation}
                onChange={setAnimation}
                min={0}
                max={100}
                steps={1}
            />
            <Scene play={true} onInit={render} />
            <Markdown>{Text}</Markdown>
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

function makeRender(refState: React.MutableRefObject<State>): any {
    const state = refState.current
    const MIN_SCALE = 2
    const MAX_SCALE = 1000
    return (gl: WebGL2RenderingContext) => {
        let scale = 32
        const texLandscape = new TextureFromUint8ArrayRGB(gl, {
            width: SIZE,
            height: SIZE,
        })
        texLandscape.applyNearest()
        texLandscape.applyRepeat()
        const dataLandscape = makeLandscapeTextureData()
        texLandscape.update(dataLandscape)
        const texColors = new TextureFromImageRGBA(gl, {
            width: 1024,
            height: 1024,
        })
        texColors.update(SkullImageURL)
        texColors.applyLinear()
        texColors.applyRepeat()
        gl.canvas.addEventListener("wheel", (evt: WheelEvent) => {
            evt.preventDefault()
            const FACTOR = 1.05
            if (evt.deltaY > 0) scale *= FACTOR
            else scale /= FACTOR
            if (scale < MIN_SCALE) scale = MIN_SCALE
            else if (scale > MAX_SCALE) scale = MAX_SCALE
        })
        const painter = new Painter(gl, 4)
        painter.pokeVertStaticData(0, 0)
        painter.pokeVertStaticData(1, 0)
        painter.pokeVertStaticData(0, 1)
        painter.pokeVertStaticData(1, 1)
        painter.pushVertStaticArray()
        gl.clearColor(0, 0, 0, 1)
        console.log("🚀 [voronoi] texColors.texture = ", texColors.texture) // @FIXME: Remove this line written on 2022-05-02 at 17:05
        return new Promise<PaintFunc>((resolve) => {
            resolve((time) => {
                painter.paint(time, (p, t) => {
                    gl.clear(gl.COLOR_BUFFER_BIT)
                    p.$uniGrid(scale)
                    p.$uniInvGrid(1 / scale)
                    p.$uniDistortion(state.distortion * 0.1)
                    p.$uniScale(100 / state.zoom)
                    const w = gl.drawingBufferWidth
                    const h = gl.drawingBufferHeight
                    p.$uniRatio(w / h)
                    p.$uniTexCells(texLandscape.texture)
                    p.$uniTexColors(texColors.texture)
                    p.$uniAnimation(state.animation * 0.01)
                    p.$uniTime(time)
                })
            })
        })
    }
}

function makeLandscapeTextureData(): Uint8Array {
    const R = 0.5
    const array = new Uint8Array(SIZE * SIZE * 3)
    let ptr = 0
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const ang = 2 * Math.PI * Math.random()
            const r = R * Math.random()
            array[ptr++] = Math.floor(255 * (0.5 + r * Math.cos(ang)))
            array[ptr++] = Math.floor(255 * (0.5 + r * Math.sin(ang)))
            array[ptr++] = Math.floor(255 * Math.random())
        }
    }
    return array
}
