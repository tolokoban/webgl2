import { CodeOptions } from "../types"
import { UniformDescription } from "@/webgl2/analyse-program/uniforms"

export function makeUniformsCode(options: CodeOptions): string {
    const { uniforms } = options
    const codes = uniforms.map((uniform) => makeUniformCode(uniform))
    return codes.join("\n\n")
}

export function makeUniformsLocationsCode(options: CodeOptions): string {
    return options.uniforms
        .map(
            (uni) =>
                `private readonly _$${
                    uni.name
                }: WebGLUniformLocation`
        )
        .join("\n")
}

function makeUniformCode(uniform: UniformDescription): string {
    if (uniform.size === 1) return makeUniformCodeForAtom(uniform)
    return `/* @TODO: Uniform "${uniform.name}" of type ${uniform.type}[${uniform.size}] */`
}

function makeUniformCodeForAtom(uniform: UniformDescription): string {
    switch (uniform.type) {
        case "FLOAT":
            return makeUniformCodeForFloat(uniform)
        case "FLOAT_VEC2":
            return makeUniformCodeForVector(uniform, 2)
        case "FLOAT_VEC3":
            return makeUniformCodeForVector(uniform, 3)
        case "FLOAT_VEC4":
            return makeUniformCodeForVector(uniform, 4)
        case "SAMPLER_2D":
            return makeUniformCodeForTexture(uniform)
        default:
            return `/* @TODO: Uniform "${uniform.name}" of type ${uniform.type} */`
    }
}

function makeUniformCodeForVector(
    uniform: UniformDescription,
    dimension: number
): string {
    const params = "xyzw".substring(0, dimension).split("")
    return `$${uniform.name}(${params
        .map((name) => `${name}: number`)
        .join(", ")}) {
    this.gl.uniform${params.length}f(this._$${uniform.name}, ${params.join(", ")})
}`
}

function makeUniformCodeForFloat(uniform: UniformDescription) {
    return `$${uniform.name}(value: number) {
    this.gl.uniform1f(this._$${uniform.name}, value)
}`
}

function makeUniformCodeForTexture(uniform: UniformDescription) {
    const { name, slot } = uniform
    return `$${name}(texture: WebGLTexture) {
    const { gl } = this
    gl.activeTexture(gl.TEXTURE${slot})
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1i(this._$${uniform.name}, ${slot})
}`
}
