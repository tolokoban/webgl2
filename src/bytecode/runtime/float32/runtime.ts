import * as Code from "./codes"

export default class Runtime {
    private readonly stack = new Float32Array(256)
    private stackPointer = 0
    private programPointer = 0
    private program: DataView
    private memory: Float32Array
    private readonly instructions: Array<() => number> = []

    constructor(program: ArrayBuffer) {
        this.program = new DataView(program)
        const i = this.instructions
        i[Code.ABS_F32] = () => this.push(Math.abs(this.pop()))
        i[Code.ADD_F32] = () => this.push(this.pop() + this.pop())
        i[Code.DIV_F32] = () => this.push(this.pop() / this.pop())
        i[Code.GET_F32] = () => this.push(this.memory[this.nextUint16()])
        i[Code.IFF_F32] = () => {
            const test = this.pop()
            const pos = this.pop()
            const neg = this.pop()
            return this.push(test < 0 ? neg : pos)
        }
        i[Code.MAX_F32] = () => this.push(Math.max(this.pop(), this.pop()))
        i[Code.MIN_F32] = () => this.push(Math.min(this.pop(), this.pop()))
        i[Code.MUL_F32] = () => this.push(this.pop() * this.pop())
        i[Code.POW_F32] = () => this.push(this.pop() ** this.pop())
        i[Code.PUSH_F32] = () => this.push(this.nextFloat32())
        i[Code.SQR_F32] = () => this.push(Math.sqrt(Math.abs(this.pop())))
        i[Code.SUB_F32] = () => this.push(this.pop() - this.pop())
    }

    run(memory: Float32Array) {
        this.memory = memory
        const limit = this.program.byteLength
        while (this.programPointer < limit) {
            const bytecode = this.nextUint8()
            const instruction = this.instructions[bytecode]
            if (!instruction)
                throw Error(
                    `No instruction for bytecode ${bytecode} at position ${this.programPointer}!`
                )
            const shift = instruction()
            this.programPointer += shift
        }
    }

    private nextUint8(): number {
        return this.program.getUint8(this.programPointer++)
    }

    private nextUint16(): number {
        const value = this.program.getUint16(this.programPointer)
        this.programPointer += 2
        return value
    }

    private nextFloat32(): number {
        const value = this.program.getFloat32(this.programPointer)
        this.programPointer += 4
        return value
    }

    private push(...values: number[]): number {
        for (const value of values) {
            this.stack[this.stackPointer++] = value
        }
        return 0
    }

    pop(): number {
        return this.stack[--this.stackPointer]
    }
}
