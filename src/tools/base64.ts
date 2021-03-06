const ALPHABET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256)
for (let i = 0; i < ALPHABET.length; i++) {
    lookup[ALPHABET.charCodeAt(i)] = i
}

function decode(base64: string): ArrayBuffer {
    const len = base64.length
    let bufferLength = base64.length * 0.75
    if (base64[base64.length - 1] === '=') {
        bufferLength--
        if (base64[base64.length - 2] === '=') {
            bufferLength--
        }
    }
    const arraybuffer = new ArrayBuffer(bufferLength)
    const bytes = new Uint8Array(arraybuffer)
    let ptr = 0
    for (let i = 0; i < len; i += 4) {
        const encoded1 = lookup[base64.charCodeAt(i)]
        const encoded2 = lookup[base64.charCodeAt(i + 1)]
        const encoded3 = lookup[base64.charCodeAt(i + 2)]
        const encoded4 = lookup[base64.charCodeAt(i + 3)]

        bytes[ptr++] = (encoded1 << 2) | (encoded2 >> 4)
        bytes[ptr++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
        bytes[ptr++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
    }
    return arraybuffer
}

function encode(arraybuffer: ArrayBuffer): string {
    const bytes = new Uint8Array(arraybuffer)
    const len = bytes.length
    let base64 = ''
    for (let i = 0; i < len; i += 3) {
        base64 += ALPHABET[bytes[i] >> 2]
        base64 += ALPHABET[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
        base64 += ALPHABET[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
        base64 += ALPHABET[bytes[i + 2] & 63]
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '='
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '=='
    }
    return base64
}

export default { decode, encode }
