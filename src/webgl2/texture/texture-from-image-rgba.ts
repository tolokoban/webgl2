import Texture2D from "./texture-2d"

export interface TextureFromImageOptions {
    width: number
    height: number
}

export class TextureFromImageRGBA extends Texture2D {
    constructor(
        gl: WebGL2RenderingContext,
        private readonly options: TextureFromImageOptions
    ) {
        super(gl)
        const { width, height } = options
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
        )
    }

    update(url: string) {
        const img = new Image()
        img.src = url
        img.onload = () => {
            const { gl, options, texture } = this
            const { width, height } = options
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                img
            )
        }
        img.onerror = () => {
            console.error("Unable to load image from URL:", url)
        }
    }
}
