import * as React from "react"
import * as ReactDOM from "react-dom"
import BlackBoardView from "@/view/black-board/black-board-view"
import Code from "./code"
import CodeView from "@/view/code"
import MarkdownToJsx from "markdown-to-jsx"
import { JsxEmit } from "typescript"
import "./markdown-view.css"

export interface MarkdownViewProps {
    className?: string
    children: string & React.ReactNode
    region?: string
    ts?: { [key: string]: string }
    glsl?: { [key: string]: string }
}

interface InlineCodeProps {
    label?: string
    region?: string
    children: string
}

export default function MarkdownView(props: MarkdownViewProps) {
    const InlineCode = (inlineprops: InlineCodeProps) => {
        return (
            <Code
                children={`${inlineprops.children}`}
                label={inlineprops.label}
                region={inlineprops.region}
                glsl={props.glsl}
                ts={props.ts}
            />
        )
    }
    const onEnhance = (div: HTMLDivElement) => {
        if (!div) return

        replaceCode(div, "bb", (code) => (
            <BlackBoardView>{code}</BlackBoardView>
        ))
        replaceCode(div, "glsl", (code) => (
            <CodeView lang="glsl" value={code} />
        ))
    }
    return (
        <div className={getClassNames(props)} ref={onEnhance}>
            <MarkdownToJsx
                options={{
                    overrides: {
                        Code: { component: InlineCode },
                    },
                    disableParsingRawHTML: false,
                }}
            >
                {props.children}
            </MarkdownToJsx>
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

function replaceCode(
    div: HTMLDivElement,
    className: string,
    maker: (code: string) => JSX.Element
) {
    const elements = div.querySelectorAll(`pre > code.lang-${className}`)
    for (const elem of elements) {
        const parent = elem.parentElement
        if (!parent) continue

        const code = elem.textContent ?? ""
        const div = document.createElement("div")
        parent.replaceWith(div)
        ReactDOM.render(maker(code), div)
    }
}
