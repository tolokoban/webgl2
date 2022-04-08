import { CodeOptions } from "../types"

export function makeCreateShaderFunctionCode(options: CodeOptions) {
    return `private static createShader(gl: WebGL2RenderingContext, prg: WebGLProgram, type: number, code: string) {
    const shader = gl.createShader(type)
    if (!shader) throw Error("Unable to create WebGL Shader!")

    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    gl.attachShader(prg, shader)
}`
}
