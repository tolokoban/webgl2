import * as React from "react"
import ShaderCodeEditor from "@/view/shader-code-editor"
import { analyseProgram, ProgramAnalyse } from "@/webgl2/analyse-program"
import { isString } from "@/tools/type-guards"
import { usePersistentState } from "@/tools/persistence"
import "./program-code-editor-view.css"

export interface ProgramCodeEditorViewProps {
    className?: string
    project: string
    onAnalyse(analyse: ProgramAnalyse): void
}

export default function ProgramCodeEditorView(
    props: ProgramCodeEditorViewProps
) {
    const [vertCode, setVertCode] = usePersistentState(
        "vert-code",
        props.project,
        "",
        isString
    )
    const [vertError, setVertError] = React.useState<null | string>("")
    const [fragCode, setFragCode] = usePersistentState(
        "frag-code",
        props.project,
        "",
        isString
    )
    const [fragError, setFragError] = React.useState<null | string>("")
    React.useEffect(() => {
        const analyse = analyseProgram({
            vert: ensureGLSL300(vertCode),
            frag: ensureGLSL300(fragCode),
        })
        setVertError(analyse.vertError)
        setFragError(analyse.fragError)
        if (!analyse.vertError && !analyse.fragError) {
            props.onAnalyse(analyse)
        }
    }, [vertCode, fragCode])
    return (
        <div className={getClassNames(props)}>
            <ShaderCodeEditor
                label="Vertex Shader"
                error={vertError}
                value={ensureGLSL300(vertCode)}
                onChange={setVertCode}
            />
            <ShaderCodeEditor
                label="Fragment Shader"
                error={fragError}
                value={ensureGLSL300(fragCode)}
                onChange={setFragCode}
            />
        </div>
    )
}

function getClassNames(props: ProgramCodeEditorViewProps): string {
    const classNames = ["custom", "pages-tools-painter-ProgramCodeEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function ensureGLSL300(fragCode: string): string {
    if (fragCode.startsWith("#version 300 es\n")) return fragCode
    return `#version 300 es\n\n${fragCode}`
}

