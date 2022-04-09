import * as Code from "./codes"
import { InstructionWriter } from "./types"

const FACTORY = {
    /**
     * Push a Float32 to the stack.
     */
    push: (value: number) => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.PUSH_F32)
        data.setFloat32(pointer + 1, value)
        return 5
    },
    /**
     * Read a Float32 from memory and push it to the stack.
     */
    get: (memoryAddress: number) => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.GET_F32)
        data.setUint16(pointer + 1, memoryAddress)
        return 3
    },
    /**
     * Pop two Float32 from the stack and push their sum.
     */
    add: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.ADD_F32)
        return 1
    },
    /**
     * Pop two Float32 from the stack and push their difference.
     */
    sub: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.SUB_F32)
        return 1
    },
    /**
     * Pop two Float32 from the stack and push their product.
     */
    mul: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.MUL_F32)
        return 1
    },
    /**
     * Pop two Float32 A and B from the stack and push A / B.
     */
    div: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.DIV_F32)
        return 1
    },
    /**
     * Pop two Float32 from the stack and push the greatest.
     */
    max: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.MAX_F32)
        return 1
    },
    /**
     * Pop two Float32 from the stack and push the lowest.
     */
    min: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.MIN_F32)
        return 1
    },
    /**
     * Pop two Float32 A and B from the stack and push A^B.
     */
    pow: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.POW_F32)
        return 1
    },
    /**
     * Pop a Float32 from the stack and push its square root.
     */
    sqr: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.SQR_F32)
        return 1
    },
    /**
     * Pop a Float32 from the stack and push its absolute value.
     */
    abs: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.ABS_F32)
        return 1
    },
    /**
     * Pop 3 Float32 T, P, N from the stack and push P if T >= 0, and N if T < 0.
     */
    iff: () => (data: DataView, pointer: number) => {
        data.setUint8(pointer, Code.IFF_F32)
        return 1
    },
}

export default FACTORY
