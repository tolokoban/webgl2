/**
 * @returns The name of a WebGL2 constant value.
 */
export function lookupConstantName(gl: WebGL2RenderingContext, value: number): string {
    for (const key in gl) {
        if (gl[key] === value) return key
    }
    return `${value}?`
}