import * as React from "react"
import glsl from "highlight.js/lib/languages/glsl"
import Highlight from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import "./code-view.css"
import "highlight.js/styles/github.css"

Highlight.registerLanguage("typescript", typescript)
Highlight.registerLanguage("glsl", glsl)

export interface CodeViewProps {
    className?: string
    value: string
    lang: "typescript" | "glsl"
}

export default function CodeView(props: CodeViewProps) {
    const ref = React.useRef<null | HTMLElement>(null)  
    React.useEffect(()=>{
        if (!ref.current) return

        Highlight.highlightElement(ref.current)
    }, [props.value, ref])
    return <div className={getClassNames(props)}>
        <pre>
            <code ref={ref} className={`language-${props.lang}`}>{props.value}</code>
        </pre>
    </div>
}

function getClassNames(props: CodeViewProps): string {
    const classNames = ["custom", "view-CodeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
