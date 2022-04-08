import { CodeOptions } from "./../types"
import { makeAttributesGroups } from "./attribute"

export function makeBuffersCode(options: CodeOptions) {
    const buffers: string[] = []
    const groups = makeAttributesGroups(options)
    for (const group of groups) {
        buffers.push(group.baseName)
    }
    if (options.drawElements) buffers.push("elem")
    return buffers
        .map(
            (name) =>
                `private readonly ${name}Buff: WebGLBuffer`
        )
        .join("\n")
}
