import * as React from "react"
import Code from "@/view/code"
import Content from "./content.md"
import FragShader from "./basic-perspective.frag"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import VertShader from "./basic-perspective.vert"
import "./basic-perspective.css"

export interface BasicPerspectiveProps {
    className?: string
}

export default function BasicPerspective(props: BasicPerspectiveProps) {
    return (
        <article className={getClassNames(props)}>
            <Scene className="full-width" play={true} onInit={render} />
            <Markdown>{Content}</Markdown>
            <Code className="left" label="Vertex Shader" lang="glsl" value={VertShader} />
            <Code className="right" label="Fragment Shader" lang="glsl" value={FragShader} />
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
