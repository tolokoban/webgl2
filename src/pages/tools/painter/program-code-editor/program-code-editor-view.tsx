import * as React from "react"
import DB, { usePersistentState } from "@/tools/persistence"
import ShaderCodeEditor from "@/view/shader-code-editor"
import { analyseProgram, ProgramAnalyse } from "@/webgl2/analyse-program"
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
        ""
    )
    const [vertError, setVertError] = React.useState<null | string>("")
    const [fragCode, setFragCode] = usePersistentState(
        "frag-code",
        props.project,
        ""
    )
    const [fragError, setFragError] = React.useState<null | string>("")
    React.useEffect(() => {
        const analyse = analyseProgram({
            vert: vertCode,
            frag: fragCode,
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
                value={vertCode}
                onChange={setVertCode}
            />
            <ShaderCodeEditor
                label="Fragment Shader"
                error={fragError}
                value={fragCode}
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
