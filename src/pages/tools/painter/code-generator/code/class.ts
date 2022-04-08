import { capitalize } from "@/tools/strings"
import { CodeOptions } from "../types"
import { getArrayTypeForElement } from "../../common"
import { indent } from "./common"
import { makeAttributesGroups } from "./attribute"
import { makeBuffersCode } from "./buffer"
import { makeConstructorCode } from "./constructor"
import { makeCreateShaderFunctionCode } from "./create"
import { makeDestroyFunctionCode } from "./destroy"
import { makePaintFunctionCode } from "./paint"
import { makeUniformsCode, makeUniformsLocationsCode } from "./uniform"
import {
    makeCreateDataArrayFunctionCode,
    makePokeDataFunctionCode,
    makePushData,
    makeSwapDataFunctionCode,
} from "./data"

export function makePainterClassCode(options: CodeOptions): string {
    const dateFormatter = new Intl.DateTimeFormat("fr")
    return `/**
 * Code généré automatiquement le ${dateFormatter.format(new Date())}
 */
export default class ${options.className} {
${indent(makeBuffersCode(options))}
${indent(makeVertexArrayObject(options))}
${indent(makeUniformsLocationsCode(options))}
${indent(makeVertexAndInstanceFloat32Arrays(options))}
    private readonly prg: WebGLProgram

${indent(makeConstructorCode(options))}

${indent(makeCreateDataArrayFunctionCode(options))}

${indent(makePushData(options))}

${indent(makePokeDataFunctionCode(options))}

${indent(makeSwapDataFunctionCode(options))}

${indent(makeDestroyFunctionCode(options))}

${indent(makePaintFunctionCode(options))}

${indent(makeUniformsCode(options))}

${indent(makeCreateShaderFunctionCode(options))}

    static readonly VERT = \`${
        options.minifyShaderCode
            ? compressGLSL(options.vertCode)
            : options.vertCode
    }\`
    static readonly FRAG = \`${
        options.minifyShaderCode
            ? compressGLSL(options.fragCode)
            : options.fragCode
    }\`
}
`
}

/**
 * Minify GLSL code.
 */
export function compressGLSL(code: string): string {
    let text = code
    text = replaceAll(text, /\/\/[^\n\r]*\n/g, "")
    text = replaceAll(text, /\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, "")
    text = text.split(/[ \t]*\n[ \t\n\r]*/).join("\n")
    text = replaceAll(text, /\s*\+\s*/g, "+")
    text = replaceAll(text, /\s*\*\s*/g, "*")
    text = replaceAll(text, /\s*\/\s*/g, "/")
    text = replaceAll(text, /\s*-\s*/g, "-")
    text = replaceAll(text, /\s*=\s*/g, "=")
    text = replaceAll(text, /\s*,\s*/g, ",")
    text = replaceAll(text, /\s*\(\s*/g, "(")
    text = replaceAll(text, /\s*\)\s*/g, ")")
    text = replaceAll(text, /\s*\{\s*/g, "{")
    text = replaceAll(text, /\s*\}\s*/g, "}")
    return text
}

function replaceAll(text: string, source: RegExp, destination: string): string {
    return text.split(source).join(destination)
}

function makeVertexAndInstanceFloat32Arrays(options: CodeOptions): string {
    const code: string[] = []
    const groups = makeAttributesGroups(options)
    for (const group of groups) {
        code.push(
            `private readonly ${group.baseName}Data: Float32Array`, 
            `/**`,
            ` * Détermine quel${group.divisor>0 ? " vertex": "le instance"} la fonction`,
            ` * \`poke${capitalize(group.baseName)}Data()\` met à jour.`,
            ` * Il s'incrémente à chaque appel de \`poke${capitalize(group.baseName)}Data()\``,
            ` */`,
            `public ${group.baseName}Cursor = 0`)
    }
    if (options.drawElements)
        code.push(
            `private readonly elemData: ${getArrayTypeForElement(options)}`
        )
    return code.join("\n")
}

function makeVertexArrayObject(options: CodeOptions): string {
    return "private readonly vertArray: WebGLVertexArrayObject"
}
