import { CodeOptions } from "../types"
export function makeDestroyFunctionCode(options: CodeOptions) {
    const buffers = ["vert"]
    if (options.drawElements) buffers.push("elem")
    return `public destroy() {
    const { gl, prg, ${buffers.map((name) => `${name}Buff`).join(", ")} } = this
    ${buffers.map((name) => `gl.deleteBuffer(${name}Buff)`).join("\n    ")}
    gl.deleteProgram( prg )
}`
}
