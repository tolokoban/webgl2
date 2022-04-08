import { CodeOptions } from "../types"
import { makeAttributesGroups } from "./attribute"
export function makeDestroyFunctionCode(options: CodeOptions) {
    const buffers = makeAttributesGroups(options).map(
        (group) => `${group.baseName}Buff`
    )
    if (options.drawElements) buffers.push("elemBuff")
    return `public destroy() {
    const { gl, prg, ${buffers.map((name) => `${name}`).join(", ")} } = this
    ${buffers.map((name) => `gl.deleteBuffer(${name})`).join("\n    ")}
    gl.deleteProgram(prg)
    gl.deleteVertexArray(this.vertArray)
}`
}
