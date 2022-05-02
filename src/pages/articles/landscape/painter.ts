/**
 * Code généré automatiquement le 30/04/2022
 */
export default class Painter {
    private readonly vertStaticBuff: WebGLBuffer
    private readonly vertArray: WebGLVertexArrayObject
    private readonly _$uniTexColors: WebGLUniformLocation
    private readonly _$uniRatio: WebGLUniformLocation
    private readonly _$uniCenter: WebGLUniformLocation
    private readonly _$uniTexCells: WebGLUniformLocation
    private readonly _$uniScale: WebGLUniformLocation
    private readonly _$uniTime: WebGLUniformLocation
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
        this._$uniTexColors = gl.getUniformLocation(
            prg,
            "uniTexColors"
        ) as WebGLUniformLocation
        this._$uniRatio = gl.getUniformLocation(
            prg,
            "uniRatio"
        ) as WebGLUniformLocation
        this._$uniCenter = gl.getUniformLocation(
            prg,
            "uniCenter"
        ) as WebGLUniformLocation
        this._$uniTexCells = gl.getUniformLocation(
            prg,
            "uniTexCells"
        ) as WebGLUniformLocation
        this._$uniScale = gl.getUniformLocation(
            prg,
            "uniScale"
        ) as WebGLUniformLocation
        this._$uniTime = gl.getUniformLocation(
            prg,
            "uniTime"
        ) as WebGLUniformLocation
        const vertArray = gl.createVertexArray()
        if (!vertArray) throw Error("Unable to create Vertex Array Object!")
        this.vertArray = vertArray
        gl.bindVertexArray(vertArray)
        const BPE = Float32Array.BYTES_PER_ELEMENT
        const strideVertStatic = 2 * BPE
        const vertStaticBuff = gl.createBuffer()
        if (!vertStaticBuff)
            throw Error("Unable to create WebGL Buffer (vertStatic)!")
        this.vertStaticBuff = vertStaticBuff
        gl.bindBuffer(gl.ARRAY_BUFFER, vertStaticBuff)
        this.vertStaticData = new Float32Array(2 * vertCount)
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
        const subData = this.vertStaticData.subarray(start * 2, end * 2)
        gl.bufferSubData(
            gl.ARRAY_BUFFER,
            start * Float32Array.BYTES_PER_ELEMENT * 2,
            subData
        )
    }

    public pokeVertStaticData(attPoint_X: number, attPoint_Y: number) {
        const vertIndex = this.vertStaticCursor
        if (vertIndex < 0 || vertIndex >= this.vertCount)
            throw Error(
                `[pokeVertStaticData] Cursor out of range: vertStaticCursor = ${vertIndex}`
            )
        const data = this.vertStaticData
        let index = vertIndex * 2
        ;(data[index++] = attPoint_X), (data[index++] = attPoint_Y)
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

    $uniTexColors(texture: WebGLTexture) {
        const { gl } = this
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(this._$uniTexColors, 0)
    }

    $uniRatio(value: number) {
        this.gl.uniform1f(this._$uniRatio, value)
    }

    $uniCenter(x: number, y: number) {
        this.gl.uniform2f(this._$uniCenter, x, y)
    }

    $uniTexCells(texture: WebGLTexture) {
        const { gl } = this
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(this._$uniTexCells, 1)
    }

    $uniScale(value: number) {
        this.gl.uniform1f(this._$uniScale, value)
    }

    $uniTime(value: number) {
        this.gl.uniform1f(this._$uniTime, value)
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

uniform vec2 uniCenter;
uniform float uniScale;
uniform float uniRatio;
uniform float uniTime;

in vec2 attPoint;

out vec2 varUV;
out vec2 varPoint;

void main() {
  varPoint = attPoint * vec2(1, uniRatio);
  vec2 point = (attPoint - uniCenter + vec2(uniTime * 0.000079141, uniTime * 0.000010348)) * uniScale;
  point.x *= uniRatio;
  varUV = point;
  gl_Position = vec4(2.0 * (attPoint - vec2(0.5, 0.5)), 0.0, 1.0);
}`
    static readonly FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexCells;
uniform sampler2D uniTexColors;

in vec2 varUV;
in vec2 varPoint;

out vec4 FragColor;

const float SIZE = 1024.0;
const float W = SIZE;
const float H = SIZE;
const float X = 1.0 / W;
const float Y = 1.0 / H;
const float A = 1.0;

float dist(vec3 vec) {
  return vec.x * vec.x + vec.y * vec.y;
}

vec3 best(vec3 p1, vec3 p2) {
  float d1 = dist(p1);
  float d2 = dist(p2);
  return d1 < d2 ? p1 : p2;
}

void main() {
  vec3 center = vec3(fract(varUV.x * W) + 0.5, fract(varUV.y * H) + 0.5, 0);
  vec3 cell1 = texture(uniTexCells, varUV).xyz - center;
  vec3 cell2 = texture(uniTexCells, varUV + vec2(X, 0)).xyz + vec3(A, 0, 0) - center;
  vec3 cell3 = texture(uniTexCells, varUV + vec2(X, Y)).xyz + vec3(A, A, 0) - center;
  vec3 cell4 = texture(uniTexCells, varUV + vec2(0, Y)).xyz + vec3(0, A, 0) - center;
  vec3 cell = best(
    best(cell1, cell2),
    best(cell3, cell4)
  );
  float height = cell.z;
  /*
  vec3 u = normalize(vec3(1, 0, 8.0 * (cell2.z - cell1.z)));
  vec3 v = normalize(vec3(0, 1, 8.0 * (cell4.z - cell1.z)));
  vec3 n = cross(v, u);
  float d = 1.0 + dot(n, normalize(vec3(varSun, height)));
  */
  vec3 color = texture(uniTexColors, vec2(height, 0.5)).rgb;
  FragColor = vec4(color, 1);
}`
}
