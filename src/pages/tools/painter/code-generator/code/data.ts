import { capitalize } from "@/tools/strings"
import { CodeOptions } from "./../types"
import { computeAttributesTotalLength, makeAttributesGroups } from "./attribute"
import { getArrayTypeForElement } from "../../common"

export function makeCreateDataArrayFunctionCode(options: CodeOptions) {
    const code: string[] = []
    if (options.drawElements) {
        code.push(`public setElemData(elemData: ${getArrayTypeForElement(options)}): void {
    this.vertCount = elemData.length
    const { gl, vertCount } = this
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuff)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elemData, gl.STATIC_DRAW)
}`)
    }
    return code.join("\n")
}

export function makePokeDataFunctionCode(options: CodeOptions) {
    const code: string[] = []
    const groups = makeAttributesGroups(options)
    for (const group of groups) {
        const { attributes } = group
        const base = group.baseName
        const attributesLength = computeAttributesTotalLength(attributes)
        const varNames: string[] = []
        for (const att of attributes) {
            const { name, size } = att
            if (size === 1) varNames.push(name)
            else if (size === 2) varNames.push(`${name}_X`, `${name}_Y`)
            else if (size === 3)
                varNames.push(`${name}_X`, `${name}_Y`, `${name}_Z`)
            else if (size === 4)
                varNames.push(
                    `${name}_X`,
                    `${name}_Y`,
                    `${name}_Z`,
                    `${name}_W`
                )
            else throw Error(`Unexpected size ${size} for attribute "${name}"!`)
        }
        code.push(`public poke${capitalize(base)}Data(
    ${varNames.map((name) => `${name}: number`).join(",\n    ")}
) {
    const vertIndex = this.${base}Cursor
    if (vertIndex < 0 || vertIndex >= ${
        group.divisor === 0 ?
        "this.vertCount" : (
            group.divisor === 1 ?
            "this.instCount" :
            `Math.floor(this.instCount / ${group.divisor})`
        )
    }) throw Error(\`[poke${capitalize(base)}Data] Cursor out of range: ${base}Cursor = \${vertIndex}\`)
    const data = this.${base}Data
    let index = vertIndex * ${attributesLength}
    ${varNames.map((name) => `data[index++] = ${name}`).join(",\n    ")}
    this.${base}Cursor++
}`)
    }
    return code.join("\n")
}

export function makeSwapDataFunctionCode(options: CodeOptions) {
    const code: string[] = []
    const groups = makeAttributesGroups(options)
    for (const group of groups) {
        // We provide swap only for dynamic attributes.
        if (!group.dynamic) continue

        const { attributes } = group
        const attributesLength = computeAttributesTotalLength(attributes)
        code.push(`public static swap${capitalize(group.baseName)}Data(
    data: Float32Array,
    indexA: number,
    indexB: number        
) {
    let ptrA = indexA * ${attributesLength}
    let ptrB = indexB * ${attributesLength}
    let tmp: number = 0
    ${repeat(
        attributesLength,
        `tmp = data[ptrA]
    data[ptrA++] = data[ptrB]
    data[ptrB++] = tmp`
    ).join("\n    ")}
}`)
    }
    return code.join("\n")
}

export function makePushData(options: CodeOptions) {
    return makeAttributesGroups(options)
        .map((grp) => {
            const attributesLength = computeAttributesTotalLength(grp.attributes)
            return `public push${capitalize(
                grp.baseName
            )}Array() {
    const { gl, ${grp.baseName}Buff } = this
    gl.bindBuffer(gl.ARRAY_BUFFER, ${grp.baseName}Buff)
    gl.bufferData(gl.ARRAY_BUFFER, this.${grp.baseName}Data, ${
        grp.dynamic ? "gl.DYNAMIC_DRAW" : "gl.STATIC_DRAW"
    })
}

/**
 * @param start First vertex index to push
 * @param end First vertex index to NOT push.
 */
public push${capitalize(
                grp.baseName
            )}SubArray(start: number, end: number) {
    const { gl, ${grp.baseName}Buff } = this
    gl.bindBuffer(gl.ARRAY_BUFFER, ${grp.baseName}Buff)
    const subData = this.${grp.baseName}Data.subarray(start * ${attributesLength}, end * ${attributesLength})
    gl.bufferSubData(
        gl.ARRAY_BUFFER, 
        start * Float32Array.BYTES_PER_ELEMENT * ${attributesLength},
        subData
    )
}`
        })
        .join("\n\n")
}

function repeat(count: number, text: string) {
    const arr: string[] = []
    for (let i = 0; i < count; i++) arr.push(text)
    return arr
}
