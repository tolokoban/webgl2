import * as React from "react"
import MarkdownToJsx from "markdown-to-jsx"
import "./markdown-view.css"

export interface MarkdownViewProps {
    className?: string
    children: string & React.ReactNode
}

export default function MarkdownView(props: MarkdownViewProps) {
    return (
        <div className={getClassNames(props)}>
            <MarkdownToJsx
                options={{
                    overrides: {
                        
                    }
                }}
            >{props.children}</MarkdownToJsx>
        </div>
    )
}

function getClassNames(props: MarkdownViewProps): string {
    const classNames = ["custom", "view-MarkdownView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
