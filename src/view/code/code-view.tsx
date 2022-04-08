import * as React from "react"
import glsl from "highlight.js/lib/languages/glsl"
import Highlight from "highlight.js/lib/core"
import html from "highlight.js/lib/languages/xml"
import Icon from "@/ui/view/icon"
import typescript from "highlight.js/lib/languages/typescript"
import { copyToClipboard } from "../../tools/copy-to-clipboard"
import { ModuleKind, transpileModule } from "typescript"
import "./code-view.css"
import "highlight.js/styles/github.css"

Highlight.registerLanguage("typescript", typescript)
Highlight.registerLanguage("glsl", glsl)
Highlight.registerLanguage("html", html)

export interface CodeViewProps {
    className?: string
    label?: string
    expanded?: boolean
    /**
     * There are special comments that define regions in the code.
     * You can use `"//#region my-region"` and `"//#endregion my-region"`
     * on a full line to define a region.
     *
     * Such lines will be removed from the displayed code.
     * And it `region` property is defined, only code of such region
     * will be displayed.
     */
    region?: string
    value: string
    lang: "typescript" | "glsl" | "html"
}

export default function CodeView(props: CodeViewProps) {
    const [expanded, setExpanded] = React.useState(props.expanded ?? true)
    const [transpile, setTranspile] = React.useState(false)
    const toggle = () => setExpanded(!expanded)
    const ref = React.useRef<null | HTMLElement>(null)
    React.useEffect(() => {
        if (!ref.current) return

        Highlight.highlightElement(ref.current)
    }, [props.value, ref, transpile])
    const code = transpileIfNeeded(
        extractRegion(props.value, props.region),
        transpile,
        props.lang
    )
    return (
        <div className={getClassNames(props, expanded)}>
            <header className="theme-color-primary-dark">
                <Icon
                    name={`chevron-${expanded ? "down" : "right"}`}
                    onClick={toggle}
                />
                <div className="label" onClick={toggle}>
                    {props.label ?? ""}
                </div>
                <Icon
                    name={transpile ? "ts" : "js"}
                    onClick={() => setTranspile(!transpile)}
                />
                <div style={{width: "1em"}}></div>
                <Icon name="copy" onClick={() => copyToClipboard(code)} />
            </header>
            <pre>
                <code ref={ref} className={`language-${props.lang}`}>
                    {code}
                    </code>
            </pre>
        </div>
    )
}

function getClassNames(props: CodeViewProps, expanded: boolean): string {
    const classNames = ["custom", "view-CodeView", "theme-shadow-button"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (expanded) classNames.push("expanded")

    return classNames.join(" ")
}

const START = "//#region"
const END = "//#endregion"

function extractRegion(value: string, region: string | undefined): string {
    const lines: Array<{
        line: string
        regions: string[]
    }> = []
    let regions: string[] = []
    for (const line of value.split("\n")) {
        if (line.startsWith(START)) {
            const name = line.substring(START.length).trim()
            if (!regions.includes(name)) regions.push(name)
            continue
        }
        if (line.startsWith(END)) {
            const name = line.substring(END.length).trim()
            regions = regions.filter((item) => item != name)
            continue
        }
        lines.push({
            line,
            regions: [...regions],
        })
    }
    if (!region) return lines.map((item) => item.line).join("\n")
    return lines
        .filter((item) => item.regions.includes(region))
        .map((item) => item.line)
        .join("\n")
}

function transpileIfNeeded(
    code: string,
    transpile: boolean,
    lang: string
): string {
    if (!transpile || lang !== "typescript") return code

    return transpileModule(code, {
        compilerOptions: {
            module: ModuleKind.ES2020,
            experimentalDecorators: true,
        },
    }).outputText
}
