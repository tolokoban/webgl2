import { CodeOptions } from "./../types"

export function makeBuffersCode(options: CodeOptions) {
    const buffers = ["vertData"]
    if (options.drawElements) buffers.push("vertElem")
    return buffers
        .map(
            (name) =>
                `${
                    options.typescript ? "private readonly" : "//"
                } ${name}Buff: WebGLBuffer`
        )
        .join("\n")
}
