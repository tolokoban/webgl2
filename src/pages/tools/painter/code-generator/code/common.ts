export function indent(code: string, indentation: number = 4) {
    const prefix = Array(indentation).fill(" ").join("")
    return code
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n")
}
