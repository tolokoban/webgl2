import * as React from "react"
import BlackBoard from "@/view/black-board"
import MarkdownView from "@/view/markdown/markdown-view"
import Text from "./text.md"
import { useDebouncedEffect, useLocalStorageState } from "@/ui/hooks"
import "./black-board-tools.css"

export interface BlackBoardToolsProps {
    className?: string
}

export default function BlackBoardTools(props: BlackBoardToolsProps) {
    const [content, setContent] = useLocalStorageState(
        "",
        "tools/black-board/content"
    )
    const [code, setCode] = React.useState(content)
    const [error, setError] = React.useState("")
    useDebouncedEffect(() => setCode(content), 500, [content])
    return (
        <div className={getClassNames(props)}>
            <div className="view">
                <textarea
                    cols={60}
                    rows={8}
                    value={content}
                    onChange={(evt) => setContent(evt.target.value)}
                />
                <div>
                    <BlackBoard onError={setError}>{code}</BlackBoard>
                    {error && <pre className="theme-color-error">{error}</pre>}
                </div>
            </div>
            <MarkdownView>{Text}</MarkdownView>
        </div>
    )
}

function getClassNames(props: BlackBoardToolsProps): string {
    const classNames = ["custom", "pages-tools-BlackBoardTools"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
