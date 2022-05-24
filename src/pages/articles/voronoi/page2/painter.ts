/**
 * Code généré automatiquement le 09/05/2022
 */
export default class Painter {
    private readonly vertStaticBuff: WebGLBuffer
    private readonly vertArray: WebGLVertexArrayObject
    private readonly _$uniTexColors: WebGLUniformLocation
    private readonly _$uniDistortion: WebGLUniformLocation
    private readonly _$uniAnimation: WebGLUniformLocation
    private readonly _$uniRatio: WebGLUniformLocation
    private readonly _$uniInvGrid: WebGLUniformLocation
    private readonly _$uniTexCells: WebGLUniformLocation
    private readonly _$uniGrid: WebGLUniformLocation
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
        this._$uniDistortion = gl.getUniformLocation(
            prg,
            "uniDistortion"
        ) as WebGLUniformLocation
        this._$uniAnimation = gl.getUniformLocation(
            prg,
            "uniAnimation"
        ) as WebGLUniformLocation
        this._$uniRatio = gl.getUniformLocation(
            prg,
            "uniRatio"
        ) as WebGLUniformLocation
        this._$uniInvGrid = gl.getUniformLocation(
            prg,
            "uniInvGrid"
        ) as WebGLUniformLocation
        this._$uniTexCells = gl.getUniformLocation(
            prg,
            "uniTexCells"
        ) as WebGLUniformLocation
        this._$uniGrid = gl.getUniformLocation(
            prg,
            "uniGrid"
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

    $uniDistortion(value: number) {
        this.gl.uniform1f(this._$uniDistortion, value)
    }

    $uniAnimation(value: number) {
        this.gl.uniform1f(this._$uniAnimation, value)
    }

    $uniRatio(value: number) {
        this.gl.uniform1f(this._$uniRatio, value)
    }

    $uniInvGrid(value: number) {
        this.gl.uniform1f(this._$uniInvGrid, value)
    }

    $uniTexCells(texture: WebGLTexture) {
        const { gl } = this
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(this._$uniTexCells, 1)
    }

    $uniGrid(value: number) {
        this.gl.uniform1f(this._$uniGrid, value)
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

uniform float uniRatio;

in vec2 attPoint;

out vec2 varVoronoiUV;

void main() {
  varVoronoiUV = attPoint;
  varVoronoiUV.x = 0.5 + (varVoronoiUV.x - 0.5) * uniRatio;
  gl_Position = vec4(2.0 * (attPoint - vec2(0.5, 0.5)), 0.0, 1.0);
}`
    static readonly FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexCells;
uniform sampler2D uniTexColors;
uniform float uniTime;
uniform float uniGrid;
uniform float uniInvGrid;
uniform float uniDistortion;
uniform float uniScale;
uniform float uniAnimation;

in vec2 varVoronoiUV;

out vec4 FragColor;

struct Cell {
    vec4 color;
    float distance;
};

float dist(vec2 vec) {
  return vec.x * vec.x + vec.y * vec.y;
}

Cell best(Cell cell1, Cell cell2) {
  if (cell1.distance < cell2.distance) return cell1;
  return cell2;
}

/**
 * uvI: Coordonnées du coin inférieur gauche de la case.
 * uvF: Coordonnées du pixel dans la case.
 * shiftX, shiftY: décallage de la case courante.
 */
Cell makeCell(vec2 uvI, vec2 uvF, float shiftX, float shiftY) {
  vec2 shift = vec2(shiftX, shiftY);
  vec2 uv = uvI + uniInvGrid * shift;
  vec4 cell = texture(uniTexCells, uv);
  vec2 origin = shift - vec2(0.5, 0.5) + cell.xy - uvF;
  origin += uniAnimation * 0.5 * vec2(cos(cell.z * 0.00103 * uniTime), sin(cell.z * 0.000577 * uniTime));
  origin /= 1.0 + uniAnimation;
  return Cell(texture(uniTexColors, uv * uniScale + 0.5 * vec2(1.0 - uniScale)), dist(origin) * (1.0 + cell.z * uniDistortion));
}

void main() {
  float x = (varVoronoiUV.x - 0.5) * 2.0;
  float y = (varVoronoiUV.y - 0.5) * 2.0;
  float p = 0.25;
  x = x < 0.0 ? -pow(-x, p) : pow(x, p);
  y = y < 0.0 ? -pow(-y, p) : pow(y, p);
  vec2 uv = vec2(x, y) * 0.5 + vec2(0.5);
  vec2 integralUV = floor(uv * uniGrid) * uniInvGrid;
  vec2 fractionalUV = fract(uv * uniGrid);
  Cell cell1 = makeCell(integralUV, fractionalUV, 0.0, 0.0);
  Cell cell2 = makeCell(integralUV, fractionalUV, 1.0, 0.0);
  Cell cell3 = makeCell(integralUV, fractionalUV, 1.0, 1.0);
  Cell cell4 = makeCell(integralUV, fractionalUV, 0.0, 1.0);
  Cell cell = best(
      best(cell1, cell2),
      best(cell3, cell4)
  );
  FragColor = cell.color;
}`
}
