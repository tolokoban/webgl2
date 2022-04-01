import { CodeOptions } from "../types"

export function makeAttribsCountStaticCode(options: CodeOptions) {
    return `${
        options.typescript ? "private " : ""
    }static ATTRIBS_COUNT = ${computeAttributesTotalLength(options)}`
}

export function makeAttributesLocationsCode(options: CodeOptions): string {
    return options.attributes
        .map(
            (att) =>
                `${options.typescript ? "private readonly" : "//"} _${
                    att.name
                }: number`
        )
        .join("\n")
}

export function makeBindAttributesCode(props: CodeOptions): string {
    const code = [
        "const BPE = Float32Array.BYTES_PER_ELEMENT",
        `const stride = BasePainter.ATTRIBS_COUNT * BPE`,
        "gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuff)",
    ]
    const { attributes } = props
    let offset = 0
    for (const att of attributes) {
        code.push(
            `const idx${att.index} = this._${att.name}`,
            `gl.enableVertexAttribArray(idx${att.index})`,
            `gl.vertexAttribPointer(idx${att.index}, ${att.size}, gl.FLOAT, false, stride, ${offset} * BPE)`
        )
        offset += att.size * att.length
    }
    return code.join("\n")
}

export function computeAttributesTotalLength(props: CodeOptions): number {
    const { attributes } = props
    let length = 0
    for (const att of attributes) {
        length += att.length * att.size
    }
    return length
}
