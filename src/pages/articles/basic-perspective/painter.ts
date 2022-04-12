/**
 * Code généré automatiquement le 11/04/2022
 */
export default class Painter {
    private readonly vertStaticBuff: WebGLBuffer
    private readonly vertArray: WebGLVertexArrayObject
    private readonly _$uniRatio: WebGLUniformLocation
    private readonly _$uniCenter: WebGLUniformLocation
    private readonly _$uniSlope: WebGLUniformLocation
    private readonly _$uniTex: WebGLUniformLocation
    private readonly _$uniScale: WebGLUniformLocation
    private readonly vertStaticData: Float32Array
    /**
     * Détermine quelle instance la fonction
     * `pokeVertStaticData()` met à jour.
     * Il s'incrémente à chaque appel de `pokeVertStaticData()`
     */
    public vertStaticCursor = 0
    private readonly prg: WebGLProgram

    constructor(
        public readonly gl: WebGL2RenderingContext,
        public vertCount: number
    ) {
        const prg = gl.createProgram()
        if (!prg) throw Error("Unable to create a WebGL Program!")
        Painter.createShader(gl, prg, gl.VERTEX_SHADER, Painter.VERT)
        Painter.createShader(gl, prg, gl.FRAGMENT_SHADER, Painter.FRAG)
        gl.linkProgram(prg)
        this.prg = prg
        this._$uniRatio = gl.getUniformLocation(
            prg,
            "uniRatio"
        ) as WebGLUniformLocation
        this._$uniCenter = gl.getUniformLocation(
            prg,
            "uniCenter"
        ) as WebGLUniformLocation
        this._$uniSlope = gl.getUniformLocation(
            prg,
            "uniSlope"
        ) as WebGLUniformLocation
        this._$uniTex = gl.getUniformLocation(
            prg,
            "uniTex"
        ) as WebGLUniformLocation
        this._$uniScale = gl.getUniformLocation(
            prg,
            "uniScale"
        ) as WebGLUniformLocation
        const vertArray = gl.createVertexArray()
        if (!vertArray) throw Error("Unable to create Vertex Array Object!")
        this.vertArray = vertArray
        gl.bindVertexArray(vertArray)
        const BPE = Float32Array.BYTES_PER_ELEMENT
        const strideVertStatic = 4 * BPE
        const vertStaticBuff = gl.createBuffer()
        if (!vertStaticBuff)
            throw Error("Unable to create WebGL Buffer (vertStatic)!")
        this.vertStaticBuff = vertStaticBuff
        gl.bindBuffer(gl.ARRAY_BUFFER, vertStaticBuff)
        this.vertStaticData = new Float32Array(4 * vertCount)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertStaticData, gl.STATIC_DRAW)
        const _attPoint = gl.getAttribLocation(prg, "attPoint")
        gl.enableVertexAttribArray(_attPoint)
        gl.vertexAttribPointer(
            _attPoint,
            2,
            gl.FLOAT,
            false,
            strideVertStatic,
            0 * BPE
        )
        gl.vertexAttribDivisor(_attPoint, 0)
        const _attUV = gl.getAttribLocation(prg, "attUV")
        gl.enableVertexAttribArray(_attUV)
        gl.vertexAttribPointer(
            _attUV,
            2,
            gl.FLOAT,
            false,
            strideVertStatic,
            2 * BPE
        )
        gl.vertexAttribDivisor(_attUV, 0)
        gl.bindVertexArray(null)
    }

    public pushVertStaticArray() {
        const { gl, vertStaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, vertStaticBuff)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertStaticData, gl.STATIC_DRAW)
    }

    /**
     * @param start First vertex index to push
     * @param end First vertex index to NOT push.
     */
    public pushVertStaticSubArray(start: number, end: number) {
        const { gl, vertStaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, vertStaticBuff)
        const subData = this.vertStaticData.subarray(start * 4, end * 4)
        gl.bufferSubData(
            gl.ARRAY_BUFFER,
            start * Float32Array.BYTES_PER_ELEMENT * 4,
            subData
        )
    }

    public pokeVertStaticData(
        attPoint_X: number,
        attPoint_Y: number,
        attUV_X: number,
        attUV_Y: number
    ) {
        const vertIndex = this.vertStaticCursor
        if (vertIndex < 0 || vertIndex >= this.vertCount)
            throw Error(
                `[pokeVertStaticData] Cursor out of range: vertStaticCursor = ${vertIndex}`
            )
        const data = this.vertStaticData
        let index = vertIndex * 4
        ;(data[index++] = attPoint_X),
            (data[index++] = attPoint_Y),
            (data[index++] = attUV_X),
            (data[index++] = attUV_Y)
        this.vertStaticCursor++
    }

    public destroy() {
        const { gl, prg, vertStaticBuff } = this
        gl.deleteBuffer(vertStaticBuff)
        gl.deleteProgram(prg)
        gl.deleteVertexArray(this.vertArray)
    }

    /**
     * Fonction à appeler dans un `requestAnimationFrame`.
     * @param time Temps en millisecondes
     * @param onPaint Fonction à utiliser pour:
     * - mettre à jour des uniforms
     * - activer des fonctionnalité de WebGL (depth test, compisiting, ...)
     * - ...
     */
    public readonly paint = (
        time: number,
        onPaint?: (painter: Painter, time: number) => void
    ) => {
        const { gl, prg } = this
        gl.useProgram(prg)
        if (onPaint) onPaint(this, time)
        gl.bindVertexArray(this.vertArray)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertCount)
        gl.bindVertexArray(null)
    }

    $uniRatio(value: number) {
        this.gl.uniform1f(this._$uniRatio, value)
    }

    $uniCenter(x: number, y: number) {
        this.gl.uniform2f(this._$uniCenter, x, y)
    }

    $uniSlope(value: number) {
        this.gl.uniform1f(this._$uniSlope, value)
    }

    $uniTex(texture: WebGLTexture) {
        const { gl } = this
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(this._$uniTex, 0)
    }

    $uniScale(value: number) {
        this.gl.uniform1f(this._$uniScale, value)
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

// (0,0) pour le centre de la carte.
uniform vec2 uniCenter;
// Facteur de zoom.
uniform float uniScale;
// Pente : 0 pour pas de perspective, 1 pour forte pente.
uniform float uniSlope;
// canvasl.width / canvas.height
uniform float uniRatio;

in vec2 attPoint;
in vec2 attUV;

out vec2 varUV;

void main() {
    vec2 point = (attPoint - uniCenter) * uniScale;
    varUV = attUV;
    point.y *= uniRatio;
    float w = uniSlope * point.y + 1.0;
    float z = 0.0;
    gl_Position = vec4(point, z, w);
}`
    static readonly FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTex;

in vec2 varUV;

out vec4 FragColor;

void main() {
    FragColor = texture(uniTex, varUV);
    if (FragColor.a < 0.1) discard;
}`
}
