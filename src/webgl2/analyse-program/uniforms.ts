import { lookupConstantName } from "../lookup-const-name"

export interface UniformDescription {
    name: string
    size: number
    type: string
    /** Used for textures */
    slot: number
}

export function listUniforms(gl: WebGL2RenderingContext, prg: WebGLProgram) {
    const uniforms: UniformDescription[] = []
    const count = gl.getProgramParameter(prg, gl.ACTIVE_UNIFORMS) as number
    let slot = 0
    for (let index = 0; index < count; index++) {
        const uniform = gl.getActiveUniform(prg, index)
        if (!uniform) continue

        const location = gl.getUniformLocation(prg, uniform.name)
        if (location === null) continue

        uniforms.push({
            name: uniform.name,
            size: uniform.size,
            type: lookupConstantName(gl, uniform.type),
            slot,
        })
        if (uniform.type === gl.SAMPLER_2D) {
            slot += uniform.size
        }
    }
    console.log('🚀 [hooks] uniforms = ', uniforms) // @FIXME: Remove this line written on 2022-01-27 at 09:24
    return uniforms
}
