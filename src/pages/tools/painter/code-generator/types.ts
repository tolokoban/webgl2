import { AttributeDescription } from "@/webgl2/analyse-program/attributes"
import { UniformDescription } from "@/webgl2/analyse-program/uniforms"

export interface CodeOptions {
    vertCode: string
    fragCode: string
    uniforms: UniformDescription[]
    attributes: AttributeDescription[]
    className: string
    minifyShaderCode: boolean
    typescript: boolean
    drawElements: boolean
}