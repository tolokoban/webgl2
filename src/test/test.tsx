import * as React from "react"
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
    const classNames = ["custom", "-Test"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function render(gl: WebGL2RenderingContext) {
    return new Promise<PaintFunc>((resolve) => {
        resolve((time: number) => {
            const red = Math.abs(Math.cos(time * 0.001134))
            const green = Math.abs(Math.cos(time * 0.001712))
            const blue = Math.abs(Math.cos(time * 0.000807))
            gl.clearColor(red, green, blue, 1)
            gl.clear(gl.COLOR_BUFFER_BIT)
        })
    })
}
