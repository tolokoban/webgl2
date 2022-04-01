import * as React from "react"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import "./test.css"

export interface TestProps {
    className?: string
}

export default function Test(props: TestProps) {
    return (
        <div className={getClassNames(props)}>
            <Scene onInit={render} />
        </div>
    )
}

function getClassNames(props: TestProps): string {
    const classNames = ["custom", "Test"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function render(gl: WebGL2RenderingContext) {
    const painter = new Painter(gl, (painter: Painter, time: number) => {
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        painter.$uniShift(time * 0.0001)
        painter.$uniScale(1 + 3 * (1 + Math.cos(time * 0.0005)))
        painter.$uniAspectRatio(gl.drawingBufferWidth / gl.drawingBufferHeight)
    })
    painter.createVertDataArray(4)
    painter.pokeVertData(0, -1, -1, 0, 1)
    painter.pokeVertData(1, +1, -1, 1, 1)
    painter.pokeVertData(2, -1, +1, 0, 0)
    painter.pokeVertData(3, +1, +1, 1, 0)
    painter.pushVertData()
    return new Promise<PaintFunc>((resolve) => {
        resolve(time => painter.paint(time))
    })
}
