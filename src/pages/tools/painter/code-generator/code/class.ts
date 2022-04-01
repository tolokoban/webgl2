import { CodeOptions } from "../types"
import { indent } from "./common"
import { makeBuffersCode } from "./buffer"
import { makeConstructorCode } from "./constructor"
import { makeCreateDataArrayFunctionCode, makePokeDataFunctionCode } from "./data"
import { makeCreateShaderFunctionCode } from "./create"
import { makeDestroyFunctionCode } from "./destroy"
import { makePaintFunctionCode } from "./paint"
import { makeUniformsCode, makeUniformsLocationsCode } from "./uniform"
import {
    makeAttribsCountStaticCode,
    makeAttributesLocationsCode,
} from "./attribute"

export function makePainterClassCode(options: CodeOptions): string {
    const dateFormatter = new Intl.DateTimeFormat("fr")
    return `/**
 * Code généré automatiquement le ${dateFormatter.format(new Date())}
 */
export default class ${options.className} {
${indent(makeBuffersCode(options))}
${indent(makeAttributesLocationsCode(options))}    
${indent(makeUniformsLocationsCode(options))}    
${indent(makeAttribsCountStaticCode(options))}
${indent(makeVertexCount(options))}
${
    options.typescript
        ? `    private readonly prg: WebGLProgram
`
        : ""
}
${indent(makeConstructorCode(options))}

${indent(makeCreateDataArrayFunctionCode(options))}

${indent(makePokeDataFunctionCode(options))}

${indent(makeDestroyFunctionCode(options))}

${indent(makePaintFunctionCode(options))}

${indent(makeUniformsCode(options))}

${indent(makeCreateShaderFunctionCode(options))}

    static ${options.typescript ? "readonly " : ""}VERT = \`${
        options.minifyShaderCode
            ? compressGLSL(options.vertCode)
            : options.vertCode
    }\`
    static ${options.typescript ? "readonly " : ""}FRAG = \`${
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

function makeVertexCount(options: CodeOptions): string {
    if (!options.typescript) return ""
    const code = [`private vertData = new Float32Array()
private vertCount = 0`]
    if (options.drawElements) code.push(`private elemData = new Uint16Array()
private elemCount = 0`)
    return code.join("\n")
}
