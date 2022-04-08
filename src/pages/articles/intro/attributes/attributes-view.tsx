import * as React from "react"
import Code from "@/view/code"
import CodeContent from "./context.code"
import CodeHTML from "./html.code"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import Text1 from "./text.1.md"
import "./attributes-view.css"

export interface AttributesViewProps {
    className?: string
}

export default function AttributesView(props: AttributesViewProps) {
    return (
        <article className={getClassNames(props)}>
            <Scene className="margin-left" onInit={render} />
            <Markdown
                ts={{
                    code: CodeContent
                }}
            >
                {Text1}
            </Markdown>
        </article>
    )
}

function getClassNames(props: AttributesViewProps): string {
    const classNames = ["custom", "pages-articles-AttributesView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

async function render(gl: WebGL2RenderingContext): Promise<PaintFunc> {
    const painter = new Painter(gl)
    painter.createVertDataArray(6)
    painter.pokeVertData(0, -0.8, -0.6)
    painter.pokeVertData(1, +0.2, -0.6)
    painter.pokeVertData(2, -0.3, +0.6)
    painter.pokeVertData(3, +0.8, +0.6)
    painter.pokeVertData(4, -0.2, +0.6)
    painter.pokeVertData(5, +0.3, -0.6)
    painter.pushVertData()
    gl.clearColor(0,0.4, 0.86667, 1)
    return (time: number) => {
        gl.clear(gl.COLOR_BUFFER_BIT)
        painter.paint(time)
    }
}
