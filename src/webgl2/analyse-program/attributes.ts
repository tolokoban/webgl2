import { lookupConstantName } from "../lookup-const-name"

export interface AttributeDescription {
    name: string
    size: number
    length: number
    type: string
    index: number
}

export function listAttributes(
    gl: WebGL2RenderingContext,
    prg: WebGLProgram
): AttributeDescription[] {
    const attributes: AttributeDescription[] = []
    const count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES) as number
    for (let index = 0; index < count; index++) {
        const attribute = gl.getActiveAttrib(prg, index)
        if (!attribute || ["gl_InstanceID"].includes(attribute.name)) continue

        const atomicSize = figureOutAttributeSize(gl, attribute)
        if (atomicSize === 0)
            throw Error(
                `Don't know how to deal with type "${lookupConstantName(
                    gl,
                    attribute.type
                )}" for attribute "${attribute.name}"!`
            )
        attributes.push({
            name: attribute.name,
            size: atomicSize,
            length: attribute.size,
            type: lookupConstantName(gl, attribute.type),
            index: gl.getAttribLocation(prg, attribute.name),
        })
    }
    attributes.sort((att1, att2) => att1.index - att2.index)
    console.log("🚀 attributes = ", attributes) // @FIXME: Remove this line written on 2022-01-27 at 17:33
    return attributes
}

function figureOutAttributeSize(
    gl: WebGLRenderingContext,
    attribute: WebGLActiveInfo
) {
    switch (attribute.type) {
        case gl.FLOAT:
            return 1
        case gl.FLOAT_VEC2:
            return 2
        case gl.FLOAT_VEC3:
            return 3
        case gl.FLOAT_VEC4:
            return 4
        default:
            return 0
    }
}
