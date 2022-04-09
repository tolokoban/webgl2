/**
 * Write the code for an instruction into `data` from position `pointer`.
 * @returns The number of bytes used.
 */
export type InstructionWriter = (data: DataView, pointer: number) => number
