import * as React from "react"
import Button from "../../../ui/view/button"
import Color from "@/ui/color"
import GenericEvent from "../../../tools/generic-event"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import Slider from "@/ui/view/slider"
import Text from "./text.md"

export interface BasicPerspectiveProps {
    className?: string
}

const SIZE = 1024
const SEA_LEVEL = 0.2
const DETAILS = 1.618

export default function BasicPerspective(props: BasicPerspectiveProps) {
    const refAction = React.useRef(new GenericEvent<string>())
    const render = React.useCallback(makeRender(refAction), [])
    return (
        <article className={getClassNames(props)}>
            <div>
                Utilisez la molette pour zoomer, et Ctrl-Click pour changer le
                terrain.
            </div>
            <Scene play={true} onInit={render} />
            <Button
                label="Regénérer le terrain"
                onClick={() => refAction.current.fire("terrain")}
            />
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

function makeRender(
    refAction: React.MutableRefObject<GenericEvent<string>>
): any {
    return (gl: WebGL2RenderingContext) => {
        let scale = 2
        const texLandscape = gl.createTexture()
        if (!texLandscape) throw Error("Unable to create a texture!")

        const createTerrain = () => {
            gl.bindTexture(gl.TEXTURE_2D, texLandscape)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
            const dataLandscape = makeLandscapeTextureData()
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                SIZE,
                SIZE,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                dataLandscape
            )
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        }

        createTerrain()
        refAction.current.add((action) => {
            switch (action) {
                case "terrain":
                    createTerrain()
                    break
            }
        })
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.canvas.addEventListener("pointerdown", (evt: PointerEvent) => {
            if (evt.ctrlKey) createTerrain()
        })
        gl.canvas.addEventListener("wheel", (evt: WheelEvent) => {
            const FACTOR = 1.05
            if (evt.deltaY > 0) scale *= FACTOR
            else scale /= FACTOR
            if (scale < 0.01) scale = 0.01
            else if (scale > 2) scale = 2
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
                    p.$uniTime(time)
                })
            })
        })
    }
}

function makeColorTextureData(): Uint8Array {
    const colors = [
        ...ramp(["#005", "#00a", "#08f"], 8),
        ...ramp(["#fe9", "#db5"], 8),
        ...ramp(["#db5", "#6d6"], 4),
        ...ramp(["#6d6", "#060"], 16),
        ...ramp(["#060", "#842"], 4),
        ...ramp(["#842", "#a84"], 8),
        ...ramp(["#a84", "#666"], 4),
        ...ramp(["#666", "#bbb"], 8),
        ...ramp(["#bbb", "#def"], 4),
        ...ramp(["#def", "#fff"], 16),
    ]
    const data = new Uint8Array(colors.map((v) => Math.floor(255 * v)))
    console.log("🚀 [voronoi] colors = ", data) // @FIXME: Remove this line written on 2022-04-30 at 15:36
    return data
}

function makeLandscapeTextureData(): Uint8Array {
    const mountains = new Float32Array(SIZE * SIZE)
    fractal(mountains, SIZE, 0, 0, SIZE, SIZE)
    // const w = SIZE / 2
    // const h = SIZE / 2
    // for (let loop = 0; loop < 4; loop++) {
    //     const x = Math.floor(Math.random() * (SIZE - w))
    //     const y = Math.floor(Math.random() * (SIZE - h))
    //     fractal(mountains, SIZE, x, y, w, h, 256)
    // }
    const elevations: Uint8Array = makeElevations(mountains)
    let eleIdx = 0
    const R = 0.82 / 2
    const array = new Uint8Array(SIZE * SIZE * 4)
    let ptr = 0
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
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
    level = 1
) {
    if (w < 5 || h < 5) return

    const scale = 1024 / Math.pow(level, DETAILS)
    const ww = Math.floor(w * rnd(0.5, 1))
    const hh = Math.floor(h * rnd(0.5, 1))
    const xx = x + Math.floor(rnd(0, w - ww))
    const yy = y + Math.floor(rnd(0, h - hh))
    let ptr = xx + yy * side
    const skip = side - ww
    const C = 2 / (ww - 1)
    const R = 2 / (hh - 1)
    let radius = scale * rnd(-0.5, 1)
    for (let row = 0; row < hh; row++) {
        for (let col = 0; col < ww; col++) {
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
    level++
    fractal(data, side, x, y, left, top, level)
    fractal(data, side, cX, y, right, top, level)
    fractal(data, side, x, cY, left, bottom, level)
    fractal(data, side, cX, cY, right, bottom, level)
}

function makeElevations(mountains: Float32Array): Uint8Array {
    const elevations = new Uint8Array(mountains.length)
    const max = mountains.reduce((prv, cur) => Math.max(prv, cur), 0)
    let min = mountains.reduce((prv, cur) => Math.min(prv, cur), max)
    min = min + (max - min) * SEA_LEVEL
    for (let i = 0; i < elevations.length; i++) {
        const h = mountains[i]
        elevations[i] =
            h < min ? 0 : Math.floor((255 * (h - min)) / (max - min))
    }
    console.log("🚀 [voronoi] elevations = ", elevations) // @FIXME: Remove this line written on 2022-04-30 at 15:35
    return elevations
}

function ramp(colors: string[], steps = 8): number[] {
    const data: number[] = []
    Color.interpolate(colors, steps).forEach((color) =>
        data.push(...color.toArrayRGBA())
    )
    return data
}

function rnd(min: number, max: number) {
    return min + Math.random() * (max - min)
}
