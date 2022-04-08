import * as React from "react"
import Button from "@/ui/view/button"
import Checkbox from "@/ui/view/checkbox"
import Code from "@/view/code"
import Combo from "@/ui/view/simple-combo"
import { CodeOptions } from "./types"
import { makePainterClassCode } from "./code/class"
import { ProgramAnalyse } from "@/webgl2/analyse-program"
import { usePersistentState } from "@/tools/persistence"
import "./code-generator-view.css"

export interface CodeGeneratorViewProps {
    className?: string
    project: string
    options: CodeOptions
}

export default function CodeGeneratorView(props: CodeGeneratorViewProps) {
    const code = makePainterClassCode(props.options)
    return (
        <div className={getClassNames(props)}>
            <Code
                label={`Code du Painter (${code.length} octets)`}
                value={code}
                lang="typescript"
            />
        </div>
    )
}

function getClassNames(props: CodeGeneratorViewProps): string {
    const classNames = ["custom", "pages-tools-painter-CodeGeneratorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

async function copy(code: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(code)
    } catch (ex) {
        console.error("Unable to copy to the clipboard:", ex)
    }
}
