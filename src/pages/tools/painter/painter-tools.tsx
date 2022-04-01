import * as React from "react"
import CodeGenerator from "./code-generator"
import ProgramCodeEditor from "./program-code-editor"
import { ProgramAnalyse } from "@/webgl2/analyse-program"
import "./painter-tools.css"

export default function PainterTools() {
    const [project, setProject] = React.useState("main")
    const [analyse, setAnalyse] = React.useState<null | ProgramAnalyse>(null)
    return (
        <div className="pages-tools-painter-PainterTools">
            <ProgramCodeEditor project={project} onAnalyse={setAnalyse} />
            <CodeGenerator project={project} analyse={analyse} />
        </div>
    )
}
