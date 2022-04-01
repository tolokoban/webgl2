import * as React from "react"
import Button from "@/ui/view/button"
import Checkbox from "@/ui/view/checkbox"
import Code from "@/view/code"
import { makePainterClassCode } from "./code/class"
import { ProgramAnalyse } from "@/webgl2/analyse-program"
import { usePersistentState } from "@/tools/persistence"
import "./code-generator-view.css"

export interface CodeGeneratorViewProps {
    className?: string
    project: string
    analyse: null | ProgramAnalyse
}

export default function CodeGeneratorView(props: CodeGeneratorViewProps) {
    const [code, setCode] = React.useState("")
    const [minify, setMinify] = usePersistentState(
        "painter-options",
        "minify",
        true
    )
    const [typescript, setTypescript] = usePersistentState(
        "painter-options",
        "typescript",
        true
    )
    const [drawElements, setDrawElements] = usePersistentState(
        "painter-options",
        "drawElements",
        false
    )
    React.useEffect(() => {
        if (!props.analyse) return

        const { vertCode, fragCode, uniforms, attributes } = props.analyse
        setCode(
            makePainterClassCode({
                vertCode,
                fragCode,
                uniforms,
                attributes,
                className: "Painter",
                minifyShaderCode: minify,
                typescript,
                drawElements,
            })
        )
    }, [props.analyse, minify, typescript, drawElements])
    return (
        <div className={getClassNames(props)}>
            <header className="theme-color-frame">
                <Checkbox
                    label="drawElements"
                    value={drawElements}
                    onChange={setDrawElements}
                />
                <Checkbox
                    label="Compresser le code des shaders"
                    value={minify}
                    onChange={setMinify}
                />
                <Checkbox
                    label="Générer du Typescript"
                    value={typescript}
                    onChange={setTypescript}
                />
                <Button label="Copier" onClick={() => copy(code)} />
                <div>Ce code pèse <b>{code.length}</b> octets.</div>
            </header>
            <Code value={code} lang="typescript" />
        </div>
    )
}

function getClassNames(props: CodeGeneratorViewProps): string {
    const classNames = [
        "custom",
        "pages-tools-painter-CodeGeneratorView",
    ]
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
