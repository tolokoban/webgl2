import * as React from "react"
import CodeEditor from "../code-editor"
import { useDebouncedEffect } from "../../ui/hooks"
import "./shader-code-editor-view.css"

const DEFAULT_DEBOUNCING = 1000

export interface ShaderCodeEditorViewProps {
    className?: string
    label: string
    value: string
    onChange(value: string): void
    error: string | null
    /** Default to 1000 */
    debouncing?: number
}

export default function ShaderCodeEditorView(props: ShaderCodeEditorViewProps) {
    const [code, setCode] = React.useState(props.value)
    useDebouncedEffect(
        () => {
            if (code !== props.value) props.onChange(code)
        },
        props.debouncing ?? DEFAULT_DEBOUNCING,
        [code]
    )
    React.useEffect(() => setCode(props.value), [props.value])
    return (
        <div className={getClassNames(props)}>
            <header className="theme-color-primary-dark">{props.label}</header>
            <CodeEditor language="glsl" value={code} onChange={setCode} />
            {props.error && (
                <pre className="theme-color-error">{props.error}</pre>
            )}
        </div>
    )
}

function getClassNames(props: ShaderCodeEditorViewProps): string {
    const classNames = ["custom", "view-ShaderCodeEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
