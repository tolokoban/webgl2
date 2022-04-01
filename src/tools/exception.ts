import JSON5 from "json5"

export function getExceptionMessage(ex: unknown): string {
    if (ex instanceof Error) return ex.message
    if (typeof ex === "string") return ex
    return JSON5.stringify(ex, null, "  ")
}