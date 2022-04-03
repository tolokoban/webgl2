import * as React from "react"
import glsl from "highlight.js/lib/languages/glsl"
import Highlight from "highlight.js/lib/core"
import Icon from "@/ui/view/icon"
import typescript from "highlight.js/lib/languages/typescript"
import { copyToClipboard } from "../../tools/copy-to-clipboard"
import "./code-view.css"
import "highlight.js/styles/github.css"

Highlight.registerLanguage("typescript", typescript)
Highlight.registerLanguage("glsl", glsl)

export interface CodeViewProps {
    className?: string
    label?: string
    expanded?: boolean
    value: string
    lang: "typescript" | "glsl"
}

export default function CodeView(props: CodeViewProps) {
    const [expanded, setExpanded] = React.useState(props.expanded ?? true)
    const toggle = () => setExpanded(!expanded)
    const ref = React.useRef<null | HTMLElement>(null)
    React.useEffect(() => {
        if (!ref.current) return

        Highlight.highlightElement(ref.current)
    }, [props.value, ref])
    return (
        <div className={getClassNames(props, expanded)}>
            <header className="theme-color-primary-dark">
                <Icon
                    name={`chevron-${expanded ? "down" : "right"}`}
                    onClick={toggle}
                />
                <div className="label" onClick={toggle}>{props.label ?? ""}</div>
                <Icon
                    name="copy"
                    onClick={() => copyToClipboard(props.value)}
                />
            </header>
            <pre>
                <code ref={ref} className={`language-${props.lang}`}>
                    {props.value}
                </code>
            </pre>
        </div>
    )
}

function getClassNames(props: CodeViewProps, expanded: boolean): string {
    const classNames = ["custom", "view-CodeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (expanded) classNames.push("expanded")

    return classNames.join(" ")
}
