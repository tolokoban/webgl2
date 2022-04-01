import { CodeOptions } from "./../types"
import { indent } from "./common"
import { makeBindAttributesCode } from "./attribute"

export function makePaintFunctionCode(options: CodeOptions) {
    return `public readonly paint = (time: number) => {
    const { gl, prg } = this
    gl.useProgram(prg)
    this.onPaint(this, time)
${indent(makeBindAttributesCode(options))}
${indent(
    options.drawElements
        ? `gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuff)
gl.drawElements(gl.${options.primitive}, this.elemCount, gl.UNSIGNED_SHORT, 0)`
        : `gl.drawArrays(gl.${options.primitive}, 0, this.vertCount)`
)}
}`
}
