import Texture2D from "./texture-2d"

export interface TextureFromUint8ArrayOptions {
    width: number
    height: number
}

export class TextureFromUint8ArrayRGBA extends Texture2D {
    private readonly expectedDataLength: number

    constructor(
        gl: WebGL2RenderingContext,
        private readonly options: TextureFromUint8ArrayOptions
    ) {
        super(gl)
        this.expectedDataLength = 4 * options.width * options.height
    }

    update(data: Uint8Array): boolean {
        if (data.length !== this.expectedDataLength) {
            console.error(
                `[TextureFromUint8Array] Expected dat.length to be ${this.expectedDataLength} but we got ${data.length}!`
            )
            return false
        }

        const { gl, options, texture } = this
        const { width, height } = options
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            data
        )
        return true
    }
}
