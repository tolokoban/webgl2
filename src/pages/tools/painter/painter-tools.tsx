import * as React from "react"
import CodeGenerator from "./code-generator"
import CodeOptionsView from "./code-options"
import ProgramCodeEditor from "./program-code-editor"
import TabStrip from "@/ui/view/tabstrip"
import { CodeOptions } from "./code-generator/types"
import { ProgramAnalyse } from "@/webgl2/analyse-program"
import { usePersistentState } from "@/tools/persistence"
import "./painter-tools.css"

const DEFAULT_CODE_OPTIONS: CodeOptions = {
    attributes: [],
    className: "Painter",
    drawElements: false,
    fragCode: "",
    minifyShaderCode: true,
    primitive: "TRIANGLES",
    typescript: true,
    uniforms: [],
    vertCode: "",
}

export default function PainterTools() {
    const [project, setProject] = React.useState("main")
    const [options, setOptions] = usePersistentState<CodeOptions>(
        "code-options",
        "project",
        DEFAULT_CODE_OPTIONS
    )
    const [analyse, setAnalyse] = React.useState<null | ProgramAnalyse>(null)
    React.useEffect(()=>{
        if (!analyse) return

        setOptions({
            ...options,
            vertCode: analyse.vertCode,
            fragCode: analyse.fragCode,
            attributes: analyse.attributes,
            uniforms: analyse.uniforms,            
        })
    }, [analyse])
    return (
        <div className="pages-tools-painter-PainterTools">
            <TabStrip className="tab-strip" headers={["Shaders", "Résultat"]}>
                <div>
                    <ProgramCodeEditor
                        project={project}
                        onAnalyse={setAnalyse}
                    />
                    <CodeOptionsView value={options} onChange={setOptions} />
                </div>
                <div>
                    <CodeGenerator project={project} options={options} />
                </div>
            </TabStrip>
        </div>
    )
}
