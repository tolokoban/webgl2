export function isUndefined(data: unknown): data is undefined {
    return typeof data === "undefined"
}

export function isObject(data: unknown): data is { [key: string]: unknown } {
    if (Array.isArray(data)) return false
    if (data === null) return false
    return typeof data === "object"
}

export function assertObject(
    data: unknown,
    name = "data"
): asserts data is { [key: string]: unknown } {
    if (!isObject(data))
        throw Error(
            `${name} was expected to be an object but we got ${typeof data}!`
        )
}

export function isString(data: unknown): data is string {
    return typeof data === "string"
}

export function assertString(
    data: unknown,
    name = "data"
): asserts data is string {
    if (!isString(data)) {
        throw Error(
            `${name} was expected to be a string but we got ${typeof data}!`
        )
    }
}

export function assertStringOrNumber(
    data: unknown,
    name = ""
): asserts data is string | number {
    if (!isString(data) && !isNumber(data)) {
        throw Error(
            `${name} was expected to be a string or a number but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a string, otherwise return `defaultValue`.
 */
export function ensureString(data: unknown, defaultValue: string): string {
    return isString(data) ? data : defaultValue
}

export function isStringOrIUndefined(
    data: unknown
): data is string | undefined {
    return typeof data === "string" || typeof data === "undefined"
}

export function assertStringOrIUndefined(
    data: unknown,
    name = "data"
): asserts data is string | undefined {
    if (!isStringOrIUndefined(data)) {
        throw Error(
            `${name} was expected to ba a string or undefined but we got ${typeof data}!`
        )
    }
}

export function isNumber(data: unknown): data is number {
    return typeof data === "number"
}

export function assertNumber(
    data: unknown,
    name = "data"
): asserts data is number {
    if (!isNumber(data)) {
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

export function assertNumberOrUndefined(
    data: unknown,
    name = "data"
): asserts data is number|undefined {
    if (!isNumber(data) && !isUndefined(data)) {
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a number, otherwise return `defaultValue`.
 */
export function ensureNumber(data: unknown, defaultValue: number): number {
    return isNumber(data) ? data : defaultValue
}

export function isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean"
}

export function assertBoolean(
    data: unknown,
    name = "data"
): asserts data is boolean {
    if (!isBoolean(data)) {
        throw Error(
            `${name} was expected to be a boolean but we got ${typeof data}!`
        )
    }
}

export function isArrayBuffer(data: unknown): data is ArrayBuffer {
    if (!data) return false
    return data instanceof ArrayBuffer
}

export function isStringArray(data: unknown): data is string[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isString(item)) return false
    }
    return true
}

export function isNumberArray(data: unknown): data is number[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isNumber(item)) return false
    }
    return true
}

export function assertStringArray(
    data: unknown,
    name = "data"
): asserts data is string[] {
    if (!isStringArray(data)) {
        throw Error(
            `${name} was expected to be an array of strings but we got ${typeof data}!`
        )
    }
}

export function assertNumberArray(
    data: unknown,
    name = "data"
): asserts data is number[] {
    assertArray(data, name)
    for (let i = 0; i < data.length; i++) {
        const value = data[i]
        assertNumber(value, `${name}[${i}]`)
    }
}

export function ensureNumberArray(
    data: unknown,
    defaultValue: number[] = []
): number[] {
    return isNumberArray(data) ? data : defaultValue
}

export function isArray(data: unknown): data is unknown[] {
    return Array.isArray(data)
}

export function ensureArray<T>(data: unknown, defaultValue: T[] = []): T[] {
    return isArray(data) ? (data as T[]) : defaultValue
}

export function assertArray(
    data: unknown,
    name = "data"
): asserts data is unknown[] {
    if (!isArray(data)) {
        throw Error(
            `${name} was expected to be an array but we got ${typeof data}!`
        )
    }
}

const RX_EMAIL = /^[^@ \t\n\r]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/gi

export function isEMail(email: unknown): email is string {
    if (!isString(email)) return false
    if (email === "admin" || email === "test") return true

    RX_EMAIL.lastIndex = -1
    return RX_EMAIL.test(email)
}
