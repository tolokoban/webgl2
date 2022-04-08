import * as React from "react"
import Code from "@/view/code"
import "./code-view.css"

export interface CodeViewProps {
    className?: string
    label?: string
    region?: string
    ts?: { [key: string]: string }
    glsl?: { [key: string]: string }
    children: string
}

export default function CodeView(props: CodeViewProps) {
    const [content, lang] = getContentAndLang(props)
    if (!lang) {
        return (
            <div className="theme-color-error">
                Error!
                <br />
                Code "{content}" does not exist.
            </div>
        )
    }
    return (
        <Code
            className={getClassNames(props)}
            lang={lang}
            region={props.region}
            label={props.label}
            value={content}
        />
    )
}

function getClassNames(props: CodeViewProps): string {
    const classNames = ["custom", "view-markdown-CodeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function getContentAndLang(
    props: CodeViewProps
): [string, null | "typescript" | "glsl"] {
    const content = props.children.trim()
    const ts = (props.ts ?? {})[content]
    if (ts) return [ts, "typescript"]
    const glsl = (props.glsl ?? {})[content]
    if (glsl) return [glsl, "glsl"]
    return [content, null]
}
