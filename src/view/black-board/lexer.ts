const TOKENS: { [key: string]: RegExp } = {
    SPACE: /^[ \n\t,]+/,
    NUMBER: /^-?[0-9]+(\.[0-9]+)?/,
    NAME: /^[A-Z][0-9]*'*/,
    STRING: /^"[^"]*"/,
    OPEN_PAR: /^\(/,
    CLOSE_PAR: /^\)/,
    OPEN_BRA: /^\[/,
    CLOSE_BRA: /^\]/,
    OPEN_CUR: /^\{/,
    CLOSE_CUR: /^\}/,
    COLOR: /^#[0-9A-Za-z][0-9A-Za-z]/,
    PIPE: /^\|/,
    AT: /^@/,
    PERCENT: /^%/,
    DOLLAR: /^\$/,
}

export interface Token {
    name: string
    value: string
    pos: number
}

export function getTokensList(content: string): Token[] {
    let cursor = 0
    const tokens: Token[] = []
    while (cursor < content.length) {
        const section = content.substring(cursor)
        let found = false
        for (const name of Object.keys(TOKENS)) {
            const rx = TOKENS[name]
            rx.lastIndex = -1
            const m = rx.exec(section)
            if (m) {
                const value = m[0]
                if (name !== "SPACE") tokens.push({ name, value, pos: cursor })
                cursor += value.length
                found = true
                break
            }
        }
        if (!found) {
            throw Error(`Unknown token: "${section.substring(0, 32)}"`)
        }
    }
    return tokens
}
