import { CodeOptions } from "./../types"
import { indent } from "./common"
import { makeAttributesGroups } from "./attribute"

export function makePaintFunctionCode(options: CodeOptions) {
    let code = `/**
 * Fonction à appeler dans un \`requestAnimationFrame\`.
 * @param time Temps en millisecondes
 * @param onPaint Fonction à utiliser pour:
 * - mettre à jour des uniforms
 * - activer des fonctionnalité de WebGL (depth test, compisiting, ...)
 * - ...
 */
public readonly paint = (
    time: number,
    onPaint?: (painter: ${options.className}, time: number) => void
) => {
    const { gl, prg } = this
    gl.useProgram(prg)
    if (onPaint) onPaint(this, time)
    gl.bindVertexArray(this.vertArray)
`
    if (options.drawElements) {
        if (hasInstances(options)) {
            code += `    gl.drawElements(gl.${options.primitive}, this.elemCount, gl.${options.elementsSize}, 0)`
        } else {
            code += `    gl.drawElements(gl.${options.primitive}, this.elemCount, gl.${options.elementsSize}, 0)`
        }
    } else {
        if (hasInstances(options)) {
            code += `    gl.drawArraysInstanced(gl.${options.primitive}, 0, this.vertCount, this.instCount)`
        } else {
            code += `    gl.drawArrays(gl.${options.primitive}, 0, this.vertCount)`
        }
    }
    code += `
    gl.bindVertexArray(null)
}`
    return code
}

function hasInstances(options: CodeOptions) {
    const groups = makeAttributesGroups(options)
    const instances = groups.filter(grp => grp.divisor > 0)
    return instances.length > 0
}

