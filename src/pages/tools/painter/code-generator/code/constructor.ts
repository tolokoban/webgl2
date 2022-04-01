import { CodeOptions } from "../types"
import { UniformDescription } from "@/webgl2/analyse-program/uniforms"

export function makeConstructorCode(options: CodeOptions) {
    return `${
        options.typescript
            ? `constructor(
    public readonly gl: WebGL2RenderingContext,
    private readonly onPaint: (painter: ${options.className}, time: number) => void
) {`
            : `/**
 * @param {WebGL2RenderingContext} gl
 * @param {(painter: ${options.className}, time: number) => void} painter
 */
constructor(gl, onPaint) {
    this.gl = gl
    this.onPaint = onPaint`
    }
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
    ${makeBuffersCode(options)}
    ${makeAttributesLocationsCode(options)}
    ${makeUniformsLocationsCode(options)}
}`
}

function makeUniformsLocationsCode(options: CodeOptions) {
    return options.uniforms
        .map(
            (uni) =>
                `this._$${uni.name} = gl.getUniformLocation(prg, "${
                    uni.name
                }")${options.typescript ? " as WebGLUniformLocation" : ""}`
        )
        .join("\n    ")
}

function makeAttributesLocationsCode(options: CodeOptions) {
    return options.attributes
        .map(
            (att) =>
                `this._${att.name} = gl.getAttribLocation(prg, "${att.name}")`
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
