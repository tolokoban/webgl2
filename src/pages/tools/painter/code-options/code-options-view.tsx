import * as React from "react"
import Checkbox from "@/ui/view/checkbox"
import Combo from "@/ui/view/simple-combo"
import InputInteger from "@/ui/view/input/integer"
import { CodeOptions } from "../code-generator/types"
import { getDivisorForAttibute, setDivisorForAttibute } from "../common"
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
    const options = props.value
    const update = (value: Partial<CodeOptions>) => {
        props.onChange({
            ...options,
            ...value,
        })
    }
    return (
        <div className={getClassNames(props)}>
            <Combo
                options={PRIMITIVES}
                value={options.primitive}
                onChange={(primitive) => update({ primitive })}
            />
            <Checkbox
                label="drawElements"
                value={options.drawElements}
                onChange={(drawElements) => update({ drawElements })}
            />
            {options.drawElements && (
                <Combo
                    options={{
                        UNSIGNED_BYTE: "Byte (256)",
                        UNSIGNED_SHORT: "Short (65'535)",
                        UNSIGNED_INT: "Int (4'294'967'297)",
                    }}
                    value={options.elementsSize}
                    onChange={(elementsSize) => update({ elementsSize })}
                />
            )}
            <Checkbox
                label="Minifier"
                value={options.minifyShaderCode}
                onChange={(minifyShaderCode) => update({ minifyShaderCode })}
            />
            <Checkbox
                label="Typescript"
                value={options.typescript}
                onChange={(typescript) => update({ typescript })}
            />
            <h1>Attributes</h1>
            <div className="grid-3">
                <div className="hint">Type</div>
                <div className="hint">Nom</div>
                <div className="hint">Diviseur</div>
                {options.attributes.map((att) => (
                    <>
                        <div key={`${att.name}-1`}>{att.type}</div>
                        <div key={`${att.name}-2`}>
                            <b>{att.name}</b>
                        </div>
                        <div key={`${att.name}-3`}>
                            <InputInteger
                                value={getDivisorForAttibute(att.name, options)}
                                onChange={(divisor) =>
                                    setDivisorForAttibute(
                                        att.name,
                                        options,
                                        divisor
                                    )
                                }
                            />
                        </div>
                    </>
                ))}
            </div>
            <h1>Uniforms</h1>
            <div className="grid-3">
                <div className="hint">Type</div>
                <div className="hint">Nom</div>
                <div className="hint">Valeur</div>
                {options.uniforms.map((uni) => (
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
