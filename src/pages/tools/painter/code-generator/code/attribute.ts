import { AttributeDescription } from "@/webgl2/analyse-program/attributes"
import { capitalize } from "@/tools/strings"
import { CodeOptions } from "../types"
import { getDivisorForAttibute, getDynamicModeForAttibute } from "../../common"

export interface AttributesGroup {
    attributes: AttributeDescription[]
    /** Will be updated often. */
    dynamic: boolean
    /** Integer. If more than 0, this is an instance attribute. */
    divisor: number
    /**
     * Examples of base names for:
     * - a static vertex attribute: "vert"
     * - a dynamic vertex attribute: "vertDyn"
     * - a static instance attribute: "inst"
     * - a dynamic instance attribute: "instDyn"
     * - a static instance attribute with divisor 3: "instEvery3"
     * - a dynamic instance attribute with divisor 3: "instEvery3Dyn"
     */
    baseName: string
}

export function makeAttributesLocationsCode(options: CodeOptions): string {
    return options.attributes
        .map(
            (att) =>
                `private readonly _${
                    att.name
                }: number`
        )
        .join("\n")
}

export function makeBindAttributesCode(options: CodeOptions): string {
    const code = [
        "const vertArray = gl.createVertexArray()",
        'if (!vertArray) throw Error("Unable to create Vertex Array Object!")',
        "this.vertArray = vertArray",
        "gl.bindVertexArray(vertArray)",
        "const BPE = Float32Array.BYTES_PER_ELEMENT",
    ]
    const groups = makeAttributesGroups(options)
    for (const group of groups) {
        const { attributes } = group
        const attributesLength = computeAttributesTotalLength(attributes)
        const base = group.baseName
        const Base = capitalize(base)
        code.push(
            `const stride${Base} = ${attributesLength} * BPE`,
            `const ${base}Buff = gl.createBuffer()`,
            `if (!${base}Buff) throw Error("Unable to create WebGL Buffer (${base})!")`,
            `this.${base}Buff = ${base}Buff`,
            `gl.bindBuffer(gl.ARRAY_BUFFER, ${base}Buff)`,
            `this.${base}Data = new Float32Array(${attributesLength} * ${getVertOrInstCount(
                group
            )})`,
            `gl.bufferData(gl.ARRAY_BUFFER, this.${base}Data, gl.${
                group.dynamic ? "DYNAMIC" : "STATIC"
            }_DRAW)`
        )
        let offset = 0
        for (const att of attributes) {
            code.push(
                `const _${att.name} = gl.getAttribLocation(prg, "${att.name}")`,
                `gl.enableVertexAttribArray(_${att.name})`,
                `gl.vertexAttribPointer(_${att.name}, ${att.size}, gl.FLOAT, false, stride${Base}, ${offset} * BPE)`,
                `gl.vertexAttribDivisor(_${att.name}, ${getDivisorForAttibute(
                    att.name,
                    options
                )})`
            )
            offset += att.size * att.length
        }
    }
    if (options.drawElements) {
        code.push(
            `const elemBuff = gl.createBuffer()`,
            `if (!elemBuff) throw Error("Unable to create WebGL Buffer (elem)!")`,
            `this.elemBuff = elemBuff`,
            "gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuff)"
        )
    }
    code.push("gl.bindVertexArray(null)")
    return code.join("\n")
}

export function computeAttributesTotalLength(
    attributes: AttributeDescription[]
): number {
    let length = 0
    for (const att of attributes) {
        length += att.length * att.size
    }
    return length
}

export function makeAttributesGroups(options: CodeOptions): AttributesGroup[] {
    const map = new Map<string, AttributesGroup>()
    for (const att of options.attributes) {
        const divisor = getDivisorForAttibute(att.name, options)
        const dynamic = getDynamicModeForAttibute(att.name, options)
        const key = `${divisor}${dynamic}`
        if (!map.has(key))
            map.set(key, {
                attributes: [],
                baseName: makeGroupBaseName(divisor, dynamic),
                dynamic,
                divisor,
            })
        const group = map.get(key)
        if (!group) continue

        group.attributes.push(att)
    }
    return Array.from(map.values())
}

function makeGroupBaseName(divisor: number, dynamic: boolean) {
    const suffix = dynamic ? "Dynamic" : "Static"
    if (divisor === 1) return `inst${suffix}`
    if (divisor > 1) return `instEvery${divisor}${suffix}`
    return `vert${suffix}`
}

function getVertOrInstCount(group: AttributesGroup) {
    const { divisor } = group
    switch (divisor) {
        case 0:
            return "vertCount"
        case 1:
            return "instCount"
        default:
            return `Math.floor(instCount / ${divisor})`
    }
}
