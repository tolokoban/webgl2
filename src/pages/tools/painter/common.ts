import { CodeOptions } from "./code-generator/types"

export function getDivisorForAttibute(
    attName: string,
    options: CodeOptions
): number {
    return Math.max(0, options.attributesDivisors[attName] ?? 0)
}

export function setDivisorForAttibute(
    attName: string,
    options: CodeOptions,
    divisor: number
) {
    options.attributesDivisors[attName] = divisor
}

export function getArrayTypeForElement(options: CodeOptions): string {
    const { elementsSize}=options
    if (elementsSize.endsWith("BYTE")) return "Uint8Array"
    if (elementsSize.endsWith("SHORT")) return "Uint16Array"
    return "Uint32Array"
}