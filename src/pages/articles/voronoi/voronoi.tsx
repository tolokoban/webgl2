import * as React from "react"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import Slider from "@/ui/view/slider"
import Text from "./text.md"
export interface BasicPerspectiveProps {
    className?: string
}

export default function BasicPerspective(props: BasicPerspectiveProps) {
    const render = React.useCallback(makeRender(), [])
    return (
        <article className={getClassNames(props)}>
            <div>
                Utilisez la molette pour zoomer, et Ctrl-Click pour changer le
                terrain.
            </div>
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

function makeRender(): any {
    return (gl: WebGL2RenderingContext) => {
        let scale = 1
        const texLandscape = gl.createTexture()
        if (!texLandscape) throw Error("Unable to create a texture!")

        gl.bindTexture(gl.TEXTURE_2D, texLandscape)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        const dataLandscape = makeLandscapeTextureData()
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            512,
            512,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            dataLandscape
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

        const texColors = gl.createTexture()
        if (!texColors) throw Error("Unable to create a texture!")

        gl.bindTexture(gl.TEXTURE_2D, texColors)
        const dataColors = makeColorTextureData()
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            dataColors.length >> 2,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            dataColors
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

        gl.canvas.addEventListener("pointerdown", (evt: PointerEvent) => {
            if (evt.ctrlKey) {
                gl.bindTexture(gl.TEXTURE_2D, texLandscape)
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
                const dataLandscape = makeLandscapeTextureData()
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    512,
                    512,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    dataLandscape
                )
                evt.stopPropagation()
                evt.preventDefault()
            }
        })
        gl.canvas.addEventListener("wheel", (evt: WheelEvent) => {
            const FACTOR = 1.05
            if (evt.deltaY < 0) scale *= FACTOR
            else scale /= FACTOR
            if (scale < 1) scale = 1
            else if (scale > 100) scale = 100
        })
        const painter = new Painter(gl, 4)
        painter.pokeVertStaticData(0, 0)
        painter.pokeVertStaticData(1, 0)
        painter.pokeVertStaticData(0, 1)
        painter.pokeVertStaticData(1, 1)
        painter.pushVertStaticArray()
        gl.clearColor(0, 0, 0, 1)
        return new Promise<PaintFunc>((resolve) => {
            resolve((time) => {
                painter.paint(time, (p, t) => {
                    gl.clear(gl.COLOR_BUFFER_BIT)
                    p.$uniCenter(0.5, 0.5)
                    p.$uniScale(scale)
                    const w = gl.drawingBufferWidth
                    const h = gl.drawingBufferHeight
                    p.$uniRatio(w / h)
                    p.$uniTexCells(texLandscape)
                    p.$uniTexColors(texColors)
                })
            })
        })
    }
}

function makeColorTextureData(): Uint8Array {
    const colors = [
        "#009",
        "#02b",
        "#05d",
        "#06f",
        "#fe9",
        "#db5",
        "#6d6",
        "#5a5",
        "#292",
        "#070",
        "#842",
        "#852",
        "#953",
        "#963",
        "#777",
        "#888",
        "#999",
        "#aaa",
        "#def",
        "#fff",
    ]
    const data = new Uint8Array(4 * colors.length)
    let ptr = 0
    const alpha = "0123456789abcdef"
    const scale = 255 / 15
    for (const color of colors) {
        const R = Math.floor(scale * alpha.indexOf(color.charAt(1)))
        const G = Math.floor(scale * alpha.indexOf(color.charAt(2)))
        const B = Math.floor(scale * alpha.indexOf(color.charAt(3)))
        data[ptr++] = R
        data[ptr++] = G
        data[ptr++] = B
        data[ptr++] = 255
    }
    console.log("🚀 [voronoi] colors = ", data) // @FIXME: Remove this line written on 2022-04-30 at 10:15
    return data
}

function makeLandscapeTextureData(): Uint8Array {
    const mountains = new Float32Array(512 * 512)
    fractal(mountains, 512, 0, 0, 512, 512, 512)
    const w = 128
    const h = 128
    for (let loop = 0; loop < 4; loop++) {
        const x = Math.floor(Math.random() * (512 - w))
        const y = Math.floor(Math.random() * (512 - h))
        fractal(mountains, 512, x, y, w, h, 256)
    }
    const elevations: Uint8Array = makeElevations(mountains)
    let eleIdx = 0
    const R = 0.82 / 2
    const array = new Uint8Array(512 * 512 * 4)
    let ptr = 0
    for (let row = 0; row < 512; row++) {
        for (let col = 0; col < 512; col++) {
            const ang = 2 * Math.PI * Math.random()
            const r = R * Math.random()
            array[ptr++] = Math.floor(255 * (0.5 + r * Math.cos(ang)))
            array[ptr++] = Math.floor(255 * (0.5 + r * Math.sin(ang)))
            array[ptr++] = elevations[eleIdx++]
            array[ptr++] = 0
        }
    }
    return array
}

function fractal(
    data: Float32Array,
    side: number,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number
) {
    if (w < 3 || h < 3) return

    let ptr = x + y * side
    const skip = side - w
    const R = 2 / (h - 1)
    const C = 2 / (w - 1)
    const radius = scale * (Math.random() - 0.5)
    for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
            const X = col * C - 1
            const Y = row * R - 1
            const Z = 1 - Math.min(1, X * X + Y * Y)
            const elevation = radius * Z
            data[ptr++] += elevation
        }
        ptr += skip
    }
    const cX = Math.floor(x + w * 0.5)
    const cY = Math.floor(y + h * 0.5)
    const left = cX - x
    const right = w - left
    const top = cY - y
    const bottom = h - top
    scale *= 0.5
    fractal(data, side, x, y, left, top, scale)
    fractal(data, side, cX, y, right, top, scale)
    fractal(data, side, x, cY, left, bottom, scale)
    fractal(data, side, cX, cY, right, bottom, scale)
}

function makeElevations(mountains: Float32Array): Uint8Array {
    const elevations = new Uint8Array(mountains.length)
    const max = mountains.reduce((prv, cur) => Math.max(prv, cur), 0)
    let min = mountains.reduce((prv, cur) => Math.min(prv, cur), max)
    console.log("🚀 [voronoi] min,max = ", min, max) // @FIXME: Remove this line written on 2022-04-30 at 09:56
    min = min + (max - min) * 0.5
    for (let i = 0; i < elevations.length; i++) {
        const h = mountains[i]
        elevations[i] =
            h < min ? 0 : Math.floor((255 * (h - min)) / (max - min))
    }
    return elevations
}
