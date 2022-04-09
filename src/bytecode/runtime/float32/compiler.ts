import { InstructionWriter } from "./types"

export function build(instructions: InstructionWriter[]): ArrayBuffer {
    const program= new ArrayBuffer(computeProgramSize(instructions))
    const data = new DataView(program)
    let pointer = 0
    for (const instr of instructions) {
        pointer += instr(data, pointer)
    }
    return program
}

function computeProgramSize(instructions: InstructionWriter[]): number {
    const buffer = new ArrayBuffer(32)
    const data = new DataView(buffer)
    let size = 0
    for (const instr of instructions) {
        size += instr(data, 0)
    }
    return size
}
