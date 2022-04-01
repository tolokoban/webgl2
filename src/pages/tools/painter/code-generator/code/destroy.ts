export function makeDestroyFunctionCode() {
    return `public destroy() {
    const { gl, prg, vertBuff } = this
    gl.deleteBuffer( vertBuff )
    gl.deleteProgram( prg )
    this.actualDestroy()
}`
}