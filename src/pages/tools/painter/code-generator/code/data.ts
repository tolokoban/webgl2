import { CodeOptions } from "./../types"
import { computeAttributesTotalLength } from "./attribute"

export function makeCreateDataArrayFunctionCode(options: CodeOptions) {
    const { attributes } = options
    if (attributes.length < 1) return '// No attributes.'

    const attributesLength = computeAttributesTotalLength(options)
    return `public static createDataArray(vertexCount: number): Float32Array {
    return new Float32Array(vertexCount * ${attributesLength})
}`
}

export function makePokeDataFunctionCode(options: CodeOptions) {
    const { attributes } = options
    if (attributes.length < 1) return '// No attributes.'

    const varNames: string[] = []
    for (const att of attributes) {
        const { name, size } = att
        if (size === 1) varNames.push(name)
        else if (size === 2) varNames.push(`${name}_X`, `${name}_Y`)
        else if (size === 3)
            varNames.push(`${name}_X`, `${name}_Y`, `${name}_Z`)
        else if (size === 4)
            varNames.push(`${name}_X`, `${name}_Y`, `${name}_Z`, `${name}_W`)
        else throw Error(`Unexpected size ${size} for attribute "${name}"!`)
    }
    return `public static pokeData(
    data: Float32Array,
    vertexIndex: number,
    ${varNames.map((name) => `${name}: number`).join(',\n    ')}
) {
    let index = vertexIndex * BasePainter.ATTRIBS_COUNT
    ${varNames.map((name) => `data[index++] = ${name}`).join(',\n    ')}
}`
}

export function makeSwapDataFunctionCode(options: CodeOptions) {
    const { attributes } = options
    if (attributes.length < 1) return '// No attributes.'

    const attributesLength = computeAttributesTotalLength(options)
    return `public static swapData(
    data: Float32Array,
    indexA: number,
    indexB: number        
) {
    let ptrA = indexA * BasePainter.ATTRIBS_COUNT
    let ptrB = indexB * BasePainter.ATTRIBS_COUNT
    let tmp: number = 0
    ${repeat(
        attributesLength,
        `tmp = data[ptrA]
    data[ptrA++] = data[ptrB]
    data[ptrB++] = tmp`
    ).join('\n    ')}
}`
}

export function makePushData(dynamicArray: boolean) {
    return `public pushDataArray(data: Float32Array) {
    const { gl, vertBuff } = this
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuff)
    gl.bufferData(gl.ARRAY_BUFFER, data, ${
        dynamicArray ? 'gl.DYNAMIC_DRAW' : 'gl.STATIC_DRAW'
    })
}

/**
 * @param start First vertex index to push
 * @param end First vertex index to NOT push.
 */
public pushDataSubArray(data: Float32Array, start: number, end: number) {
    const { gl, vertBuff } = this
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuff)
    const N = BasePainter.ATTRIBS_COUNT
    const subData = data.subarray(start * N, end * N)
    gl.bufferSubData(
        gl.ARRAY_BUFFER, 
        start * Float32Array.BYTES_PER_ELEMENT * N,
        subData
    )
}`
}

function repeat(count: number, text: string) {
    const arr: string[] = []
    for (let i = 0; i < count; i++) arr.push(text)
    return arr
}
