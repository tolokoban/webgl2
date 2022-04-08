import * as React from "react"
import Code from "@/view/code"
import CodeContent from "./context.code"
import CodeHTML from "./html.code"
import Markdown from "@/view/markdown"
import Scene, { PaintFunc } from "@/view/scene"
import Text1 from "./text.1.md"
import "./webgl2context-view.css"

export interface Webgl2contextViewProps {
    className?: string
}

export default function Webgl2contextView(props: Webgl2contextViewProps) {
    return (
        <article className={getClassNames(props)}>
            <Scene className="small margin-left" onInit={render} />
            <Markdown
                ts={{
                    code: CodeContent
                }}
            >
                {Text1}
            </Markdown>
            <Code
                expanded={false}
                lang="html"
                label="Le code complet dans une page HTML"
                value={CodeHTML}
            />
        </article>
    )
}

function getClassNames(props: Webgl2contextViewProps): string {
    const classNames = ["custom", "pages-articles-Webgl2contextView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

async function render(gl: WebGL2RenderingContext): Promise<PaintFunc> {
    return (time: number) => {
        const red = Math.abs(Math.cos(time * 0.0005115))
        const green = Math.abs(Math.cos(time * 0.0008172))
        const blue = Math.abs(Math.cos(time * 0.0006131))
        const alpha = 1
        gl.clearColor(red, green, blue, alpha)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }
}
