import F from "./instructions-factory"
import Runtime from "./runtime"
import { build } from "./compiler"
import { runInThisContext } from "vm"

const memory = new Float32Array(32)

describe("bytecode/runtime/float32/runtime.ts", () => {
    describe("Single instructions", () => {
        it("should ADD 7 and 3", () => {
            const runtime = new Runtime(build([F.push(7), F.push(3), F.add()]))
            runtime.run(memory)
            expect(runtime.pop()).toEqual(10)
        })
        it("should MUL 7 and 3", () => {
            const runtime = new Runtime(build([F.push(7), F.push(3), F.mul()]))
            runtime.run(memory)
            expect(runtime.pop()).toEqual(21)
        })
        it("should DIV 7 by 3", () => {
            const runtime = new Runtime(build([F.push(3), F.push(7), F.div()]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(7 / 3)
        })
        it("should PUSH 3.14159...", () => {
            const runtime = new Runtime(build([F.push(Math.PI)]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(Math.PI)
        })
        it("should SUD 3 from 7", () => {
            const runtime = new Runtime(build([F.push(3), F.push(7), F.sub()]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(4)
        })
        it("should GET 3.141592 from memory cell 2", () => {
            memory[2] = Math.PI
            const runtime = new Runtime(build([F.get(2)]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(Math.PI)
        })
        it("should POW 7^3", () => {
            const runtime = new Runtime(build([F.push(3), F.push(7), F.pow()]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(7 ** 3)
        })
        it("should MAX 3, 7", () => {
            const runtime = new Runtime(build([F.push(3), F.push(7), F.max()]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(7)
        })
        it("should MIN 3, 7", () => {
            const runtime = new Runtime(build([F.push(3), F.push(7), F.min()]))
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(3)
        })
        it("should IIF(+1, 7, 3) be 7", () => {
            const runtime = new Runtime(
                build([F.push(3), F.push(7), F.push(+1), F.iff()])
            )
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(7)
        })
        it("should IIF(-1, 7, 3) be 3", () => {
            const runtime = new Runtime(
                build([F.push(3), F.push(7), F.push(-1), F.iff()])
            )
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(3)
        })
        it("should ABS(-7) be 7", () => {
            const runtime = new Runtime(
                build([F.push(-7), F.abs()])
            )
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(7)
        })
        it("should SQR(9) be 3", () => {
            const runtime = new Runtime(
                build([F.push(9), F.sqr()])
            )
            runtime.run(memory)
            expect(runtime.pop()).toBeCloseTo(3)
        })
    })
})
