import { CodeOptions } from "./../types"
import { indent } from "./common"
import { makeBindAttributesCode } from "./attribute"

export function makePaintFunctionCode(options: CodeOptions) {
return `public paint(time: number) {
    const { gl, prg } = this
    gl.useProgram(prg)
    this.onPaint.call(this, time)
${indent(makeBindAttributesCode(options))}
}
`    
}