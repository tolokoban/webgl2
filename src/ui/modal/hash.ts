export interface ModalHash {
    hash: string
    depth: number
}

const HASH_RX = /\/M\+([0-9]+)$/g

export function parseHash(hash: string): ModalHash {
    HASH_RX.lastIndex = -1
    const suffixIndex = hash.search(HASH_RX)
    if (suffixIndex < 0) return { hash, depth: 0 }

    HASH_RX.lastIndex = -1
    const match = HASH_RX.exec(hash)
    if (!match) return { hash, depth: 0 }

    const [, depthText] = match
    const depth = parseInt(depthText, 10)
    if (isNaN(depth)) return { hash, depth: 0 }
    else return { hash: hash.substr(0, suffixIndex), depth }
}

export function stringifyHash({hash, depth}: ModalHash): string {
    if (depth > 0) return `${hash}/M+${depth}`
    return hash
}
