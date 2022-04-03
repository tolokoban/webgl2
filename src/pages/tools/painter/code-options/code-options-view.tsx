import * as React from "react"
import Checkbox from "@/ui/view/checkbox"
import Combo from "@/ui/view/simple-combo"
import InputInteger from "@/ui/view/input/integer"
import options from "../../../../ui/view/options"
import { CodeOptions } from "../code-generator/types"
import "./code-options-view.css"

const PRIMITIVES = {
    POINTS: "POINTS",
    LINE_STRIP: "LINE_STRIP",
    LINE_LOOP: "LINE_LOOP",
    LINES: "LINES",
    TRIANGLE_STRIP: "TRIANGLE_STRIP",
    TRIANGLE_FAN: "TRIANGLE_FAN",
    TRIANGLES: "TRIANGLES",
}

export interface CodeOptionsViewProps {
    className?: string
    value: CodeOptions
    onChange(value: CodeOptions): void
}

export default function CodeOptionsView(props: CodeOptionsViewProps) {
    const update = (value: Partial<CodeOptions>) => {
        props.onChange({
            ...props.value,
            ...value,
        })
    }
    return (
        <div className={getClassNames(props)}>
            <Combo
                options={PRIMITIVES}
                value={props.value.primitive}
                onChange={(primitive) => update({ primitive })}
            />
            <Checkbox
                label="drawElements"
                value={props.value.drawElements}
                onChange={(drawElements) => update({ drawElements })}
            />
            <Checkbox
                label="Minifier"
                value={props.value.minifyShaderCode}
                onChange={(minifyShaderCode) => update({ minifyShaderCode })}
            />
            <Checkbox
                label="Typescript"
                value={props.value.typescript}
                onChange={(typescript) => update({ typescript })}
            />
            <h1>Attributes</h1>
            <div className="grid-3">
                <div className="hint">Type</div>
                <div className="hint">Nom</div>
                <div className="hint">Diviseur</div>
                {props.value.attributes.map((att) => (
                    <>
                        <div key={`${att.name}-1`}>{att.type}</div>
                        <div key={`${att.name}-2`}>
                            <b>{att.name}</b>
                        </div>
                        <div key={`${att.name}-3`}>
                            <InputInteger value={2} />
                        </div>
                    </>
                ))}
            </div>
            <h1>Uniforms</h1>
            <div className="grid-3">
                <div className="hint">Type</div>
                <div className="hint">Nom</div>
                <div className="hint">Valeur</div>
                {props.value.uniforms.map((uni) => (
                    <>
                        <div key={`${uni.name}-1`}>{uni.type}</div>
                        <div key={`${uni.name}-2`}>
                            <b>{uni.name}</b>
                        </div>
                        <div key={`${uni.name}-3`}>...</div>
                    </>
                ))}
            </div>
        </div>
    )
}

function getClassNames(props: CodeOptionsViewProps): string {
    const classNames = ["custom", "pages-tools-painter-CodeOptionsView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
