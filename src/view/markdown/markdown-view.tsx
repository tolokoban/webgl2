import * as React from "react"
import Code from "./code"
import MarkdownToJsx from "markdown-to-jsx"
import "./markdown-view.css"

export interface MarkdownViewProps {
    className?: string
    children: string & React.ReactNode
    region?: string
    ts?: {[key: string]: string}
    glsl?: {[key: string]: string}
}

interface InlineCodeProps {
    label?: string
    region?: string
    children: string
}

export default function MarkdownView(props: MarkdownViewProps) {
    const InlineCode = (inlineprops: InlineCodeProps) => {
        return <Code
            children={`${inlineprops.children}`}
            label={inlineprops.label}
            region={inlineprops.region}
            glsl={props.glsl}
            ts={props.ts}
        />
    }
    return (
        <div className={getClassNames(props)}>
            <MarkdownToJsx
                options={{
                    overrides: {
                        Code: InlineCode
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
