/**
 * Code généré automatiquement le 04/04/2022
 */
export default class Painter {
    private readonly vertBuff: WebGLBuffer
    private readonly vertArray: WebGLVertexArrayObject

    private static ATTRIBS_COUNT = 2
    private vertData = new Float32Array()
    private vertCount = 0
    private readonly prg: WebGLProgram

    constructor(public readonly gl: WebGL2RenderingContext) {
        const prg = gl.createProgram()
        if (!prg) throw Error("Unable to create a WebGL Program!")
        Painter.createShader(gl, prg, gl.VERTEX_SHADER, Painter.VERT)
        Painter.createShader(gl, prg, gl.FRAGMENT_SHADER, Painter.FRAG)
        gl.linkProgram(prg)
        this.prg = prg
        const vertBuff = gl.createBuffer()
        if (!vertBuff) throw Error("Unable to create WebGL Buffer!")
        this.vertBuff = vertBuff

        const vertArray = gl.createVertexArray()
        if (!vertArray) throw Error("Unable to create Vertex Array Object!")
        this.vertArray = vertArray
        gl.bindVertexArray(vertArray)
        const BPE = Float32Array.BYTES_PER_ELEMENT
        const stride = Painter.ATTRIBS_COUNT * BPE
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuff)
        const _attPos = gl.getAttribLocation(prg, "attPos")
        gl.enableVertexAttribArray(_attPos)
        gl.vertexAttribPointer(_attPos, 2, gl.FLOAT, false, stride, 0 * BPE)
    }

    public createVertDataArray(vertCount: number): void {
        this.vertCount = vertCount
        this.vertData = new Float32Array(vertCount * 2)
    }
    public pushVertData() {
        const { gl } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuff)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertData, gl.STATIC_DRAW)
    }

    public pokeVertData(
        vertexIndex: number,
        attPos_X: number,
        attPos_Y: number
    ) {
        let index = vertexIndex * Painter.ATTRIBS_COUNT
        const data = this.vertData
        ;(data[index++] = attPos_X), (data[index++] = attPos_Y)
    }

    public destroy() {
        const { gl, prg, vertBuff } = this
        gl.deleteBuffer(vertBuff)
        gl.deleteProgram(prg)
        gl.deleteVertexArray(this.vertArray)
    }

    public readonly paint = (
        time: number,
        onPaint?: (painter: Painter, time: number) => void
    ) => {
        const { gl, prg } = this
        gl.useProgram(prg)
        if (onPaint) onPaint(this, time)
        gl.bindVertexArray(this.vertArray)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertCount)
    }

    private static createShader(
        gl: WebGL2RenderingContext,
        prg: WebGLProgram,
        type: number,
        code: string
    ) {
        const shader = gl.createShader(type)
        if (!shader) throw Error("Unable to create WebGL Shader!")

        gl.shaderSource(shader, code)
        gl.compileShader(shader)
        gl.attachShader(prg, shader)
    }

    static readonly VERT = `#version 300 es
in vec2 attPos;
void main(){gl_Position=vec4(attPos,0.0,1.0);}`
    static readonly FRAG = `#version 300 es
precision mediump float;
out vec4 FragColor;
void main(){FragColor=vec4(1.0,0.5,0.0,1.0);}`
}
