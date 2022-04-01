import { CodeOptions } from "./../types"

export function makeBuffersCode(options: CodeOptions) {
    const buffers = ["vert"]
    if (options.drawElements) buffers.push("elem")
    return buffers
        .map(
            (name) =>
                `${
                    options.typescript ? "private readonly" : "//"
                } ${name}Buff: WebGLBuffer`
        )
        .join("\n")
}
