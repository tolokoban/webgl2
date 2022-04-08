import { CodeOptions } from "../types"
import { getDivisorForAttibute } from "../../common"
import { indent } from "./common"
import { makeBindAttributesCode } from "./attribute"

export function makeConstructorCode(options: CodeOptions) {
    const hasInstances =
        options.attributes.filter(
            (att) => getDivisorForAttibute(att.name, options) > 0
        ).length > 0
    return `constructor(
    public readonly gl: WebGL2RenderingContext,
    public vertCount: number${
        hasInstances ? ",\n    public instCount: number" : ""
    }
) {
    const prg = gl.createProgram()
    if (!prg) throw Error("Unable to create a WebGL Program!")
    ${options.className}.createShader(gl, prg, gl.VERTEX_SHADER, ${
        options.className
    }.VERT)
    ${options.className}.createShader(gl, prg, gl.FRAGMENT_SHADER, ${
        options.className
    }.FRAG)
    gl.linkProgram(prg)
    this.prg = prg
    ${makeUniformsLocationsCode(options)}
${indent(makeBindAttributesCode(options))}
}`
}

function makeUniformsLocationsCode(options: CodeOptions) {
    return options.uniforms
        .map(
            (uni) =>
                `this._$${uni.name} = gl.getUniformLocation(prg, "${
                    uni.name
                }") as WebGLUniformLocation`
        )
        .join("\n    ")
}

function makeBuffersCode(options: CodeOptions) {
    const buffers = ["vert"]
    if (options.drawElements) buffers.push("elem")
    return buffers
        .map(
            (name) => `const ${name}Buff = gl.createBuffer()
    if (!${name}Buff) throw Error("Unable to create WebGL Buffer!")
    this.${name}Buff = ${name}Buff`
        )
        .join("\n    ")
}
