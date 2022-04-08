import * as React from "react"
import Checkbox from "@/ui/view/checkbox"
import Code from "@/view/code"
import Combo from "@/ui/view/simple-combo"
import InputInteger from "@/ui/view/input/integer"
import { CodeOptions } from "../code-generator/types"
import { UniformDescription } from "@/webgl2/analyse-program/uniforms"
import "./code-options-view.css"
import {
    getDivisorForAttibute,
    getDynamicModeForAttibute,
    setDivisorForAttibute,
    setDynamicModeForAttibute,
} from "../common"

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
            <h1>Attributes</h1>
            <div className="grid-3">
                <div
                    className="hint"
                    title="Les attributes dynamiques sont susceptibles d'être mis à jour souvent"
                >
                    Dynamique
                </div>
                <div className="hint">Nom</div>
                <div className="hint">Diviseur</div>
                {options.attributes.map((att) => (
                    <>
                        <div key={`${att.name}-1`}>
                            <Checkbox
                                value={getDynamicModeForAttibute(
                                    att.name,
                                    options
                                )}
                                onChange={(dynamic) => {
                                    setDynamicModeForAttibute(
                                        att.name,
                                        options,
                                        dynamic
                                    )
                                    update({ ...options })
                                }}
                            />
                        </div>
                        <div key={`${att.name}-2`}>
                            <b>{att.name}</b>
                        </div>
                        <div key={`${att.name}-3`} title={att.type}>
                            <InputInteger
                                className="small-input"
                                value={getDivisorForAttibute(att.name, options)}
                                onChange={(divisor) => {
                                    setDivisorForAttibute(
                                        att.name,
                                        options,
                                        divisor
                                    )
                                    update({ ...options })
                                }}
                            />
                        </div>
                    </>
                ))}
            </div>
            <h1>Uniforms</h1>
            <div>
                {options.uniforms.map((uni) => (
                    <Code
                        key={`${uni.name}`}
                        label={`${uni.type} ${uni.name}`}
                        expanded={false}
                        lang="typescript"
                        value={getExampleCodeForUniform(uni)}
                    />
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

function getExampleCodeForUniform(uni: UniformDescription): string {
    switch (uni.type) {
        case "SAMPLER_2D":
            return `const texture: WebGLTexture = gl.createTexture()
...
painter.$${uni.name}(texture)`
        case "FLOAT":
            return `painter.$${uni.name}(${100 * Math.random()})`
        case "FLOAT_VEC2":
            return `painter.$${uni.name}(${100 * Math.random()}, ${
                100 * Math.random()
            })`
        case "FLOAT_VEC3":
            return `painter.$${uni.name}(${100 * Math.random()}, ${
                100 * Math.random()
            }, ${100 * Math.random()})`
        case "FLOAT_VEC4":
            return `painter.$${uni.name}(${100 * Math.random()}, ${
                100 * Math.random()
            }, ${100 * Math.random()}, ${100 * Math.random()})`
        default:
            return `// Pas encore supporté : ${uni.type}`
    }
}
