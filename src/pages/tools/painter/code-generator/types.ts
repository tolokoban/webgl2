import { AttributeDescription } from "@/webgl2/analyse-program/attributes"
import { UniformDescription } from "@/webgl2/analyse-program/uniforms"
import {
    assertBoolean,
    assertObject,
    assertString,
    assertArray,
} from "@/tools/type-guards"

export interface CodeOptions {
    vertCode: string
    fragCode: string
    uniforms: UniformDescription[]
    attributes: AttributeDescription[]
    attributesDivisors: { [attName: string]: number }
    className: string
    minifyShaderCode: boolean
    typescript: boolean
    drawElements: boolean
    elementsSize: string // "UNSIGNED_BYTE" | "UNSIGNED_SHORT" | "UNSIGNED_INT"
    primitive: string
}

export function isCodeOptions(data: unknown): data is CodeOptions {
    try {
        assertObject(data)
        assertString(data.vertCode, "data.vertCode")
        assertString(data.fragCode, "data.fragCode")
        assertString(data.className, "data.className")
        assertString(data.primitive, "data.primitive")
        assertBoolean(data.minifyShaderCode, "data.minifyShaderCode")
        assertBoolean(data.typescript, "data.typescript")
        assertBoolean(data.drawElements, "data.drawElements")
        assertArray(data.uniforms, "data.uniforms")
        assertArray(data.attributes, "data.attributes")
        assertObject(data.attributesDivisors, "data.attributesDivisors")
        assertString(data.elementsSize, "data.elementsSize")
        if (!["UNSIGNED_BYTE", "UNSIGNED_SHORT" ,"UNSIGNED_INT"].includes(data.elementsSize)) {
            throw Error("Invalid data.elementsSize!")
        }
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}
