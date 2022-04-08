/**
 * Code généré automatiquement le 08/04/2022
 */
 export default class Painter {
    private readonly vertStaticBuff: WebGLBuffer
    private readonly instEvery7StaticBuff: WebGLBuffer
    private readonly instStaticBuff: WebGLBuffer
    private readonly vertArray: WebGLVertexArrayObject
    private readonly _$uniTrianglesScale: WebGLUniformLocation
    private readonly _$uniAngleStep: WebGLUniformLocation
    private readonly _$uniScreenScale: WebGLUniformLocation
    private readonly _$uniOpacity: WebGLUniformLocation
    private readonly vertStaticData: Float32Array
    /**
     * Détermine quelle instance la fonction
     * `pokeVertStaticData()` met à jour.
     * Il s'incrémente à chaque appel de `pokeVertStaticData()`
     */
    public vertStaticCursor = 0
    private readonly instEvery7StaticData: Float32Array
    /**
     * Détermine quel vertex la fonction
     * `pokeInstEvery7StaticData()` met à jour.
     * Il s'incrémente à chaque appel de `pokeInstEvery7StaticData()`
     */
    public instEvery7StaticCursor = 0
    private readonly instStaticData: Float32Array
    /**
     * Détermine quel vertex la fonction
     * `pokeInstStaticData()` met à jour.
     * Il s'incrémente à chaque appel de `pokeInstStaticData()`
     */
    public instStaticCursor = 0
    private readonly prg: WebGLProgram

    constructor(
        public readonly gl: WebGL2RenderingContext,
        public vertCount: number,
        public instCount: number
    ) {
        const prg = gl.createProgram()
        if (!prg) throw Error("Unable to create a WebGL Program!")
        Painter.createShader(gl, prg, gl.VERTEX_SHADER, Painter.VERT)
        Painter.createShader(gl, prg, gl.FRAGMENT_SHADER, Painter.FRAG)
        gl.linkProgram(prg)
        this.prg = prg
        this._$uniTrianglesScale = gl.getUniformLocation(prg, "uniTrianglesScale") as WebGLUniformLocation
        this._$uniAngleStep = gl.getUniformLocation(prg, "uniAngleStep") as WebGLUniformLocation
        this._$uniScreenScale = gl.getUniformLocation(prg, "uniScreenScale") as WebGLUniformLocation
        this._$uniOpacity = gl.getUniformLocation(prg, "uniOpacity") as WebGLUniformLocation
        const vertArray = gl.createVertexArray()
        if (!vertArray) throw Error("Unable to create Vertex Array Object!")
        this.vertArray = vertArray
        gl.bindVertexArray(vertArray)
        const BPE = Float32Array.BYTES_PER_ELEMENT
        const strideVertStatic = 3 * BPE
        const vertStaticBuff = gl.createBuffer()
        if (!vertStaticBuff) throw Error("Unable to create WebGL Buffer (vertStatic)!")
        this.vertStaticBuff = vertStaticBuff
        gl.bindBuffer(gl.ARRAY_BUFFER, vertStaticBuff)
        this.vertStaticData = new Float32Array(3 * vertCount)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertStaticData, gl.STATIC_DRAW)
        const _attVertexPolarCoords = gl.getAttribLocation(prg, "attVertexPolarCoords")
        gl.enableVertexAttribArray(_attVertexPolarCoords)
        gl.vertexAttribPointer(_attVertexPolarCoords, 3, gl.FLOAT, false, strideVertStatic, 0 * BPE)
        gl.vertexAttribDivisor(_attVertexPolarCoords, 0)
        const strideInstEvery7Static = 3 * BPE
        const instEvery7StaticBuff = gl.createBuffer()
        if (!instEvery7StaticBuff) throw Error("Unable to create WebGL Buffer (instEvery7Static)!")
        this.instEvery7StaticBuff = instEvery7StaticBuff
        gl.bindBuffer(gl.ARRAY_BUFFER, instEvery7StaticBuff)
        this.instEvery7StaticData = new Float32Array(3 * Math.floor(instCount / 7))
        gl.bufferData(gl.ARRAY_BUFFER, this.instEvery7StaticData, gl.STATIC_DRAW)
        const _attInstanceColor = gl.getAttribLocation(prg, "attInstanceColor")
        gl.enableVertexAttribArray(_attInstanceColor)
        gl.vertexAttribPointer(_attInstanceColor, 3, gl.FLOAT, false, strideInstEvery7Static, 0 * BPE)
        gl.vertexAttribDivisor(_attInstanceColor, 7)
        const strideInstStatic = 1 * BPE
        const instStaticBuff = gl.createBuffer()
        if (!instStaticBuff) throw Error("Unable to create WebGL Buffer (instStatic)!")
        this.instStaticBuff = instStaticBuff
        gl.bindBuffer(gl.ARRAY_BUFFER, instStaticBuff)
        this.instStaticData = new Float32Array(1 * instCount)
        gl.bufferData(gl.ARRAY_BUFFER, this.instStaticData, gl.STATIC_DRAW)
        const _attInstanceAngle = gl.getAttribLocation(prg, "attInstanceAngle")
        gl.enableVertexAttribArray(_attInstanceAngle)
        gl.vertexAttribPointer(_attInstanceAngle, 1, gl.FLOAT, false, strideInstStatic, 0 * BPE)
        gl.vertexAttribDivisor(_attInstanceAngle, 1)
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
        const subData = this.vertStaticData.subarray(start * 3, end * 3)
        gl.bufferSubData(
            gl.ARRAY_BUFFER, 
            start * Float32Array.BYTES_PER_ELEMENT * 3,
            subData
        )
    }
    
    public pushInstEvery7StaticArray() {
        const { gl, instEvery7StaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, instEvery7StaticBuff)
        gl.bufferData(gl.ARRAY_BUFFER, this.instEvery7StaticData, gl.STATIC_DRAW)
    }
    
    /**
     * @param start First vertex index to push
     * @param end First vertex index to NOT push.
     */
    public pushInstEvery7StaticSubArray(start: number, end: number) {
        const { gl, instEvery7StaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, instEvery7StaticBuff)
        const subData = this.instEvery7StaticData.subarray(start * 3, end * 3)
        gl.bufferSubData(
            gl.ARRAY_BUFFER, 
            start * Float32Array.BYTES_PER_ELEMENT * 3,
            subData
        )
    }
    
    public pushInstStaticArray() {
        const { gl, instStaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, instStaticBuff)
        gl.bufferData(gl.ARRAY_BUFFER, this.instStaticData, gl.STATIC_DRAW)
    }
    
    /**
     * @param start First vertex index to push
     * @param end First vertex index to NOT push.
     */
    public pushInstStaticSubArray(start: number, end: number) {
        const { gl, instStaticBuff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, instStaticBuff)
        const subData = this.instStaticData.subarray(start * 1, end * 1)
        gl.bufferSubData(
            gl.ARRAY_BUFFER, 
            start * Float32Array.BYTES_PER_ELEMENT * 1,
            subData
        )
    }

    public pokeVertStaticData(
        attVertexPolarCoords_X: number,
        attVertexPolarCoords_Y: number,
        attVertexPolarCoords_Z: number
    ) {
        const vertIndex = this.vertStaticCursor
        if (vertIndex < 0 || vertIndex >= this.vertCount) throw Error(`[pokeVertStaticData] Cursor out of range: vertStaticCursor = ${vertIndex}`)
        const data = this.vertStaticData
        let index = vertIndex * 3
        data[index++] = attVertexPolarCoords_X,
        data[index++] = attVertexPolarCoords_Y,
        data[index++] = attVertexPolarCoords_Z
        this.vertStaticCursor++
    }
    public pokeInstEvery7StaticData(
        attInstanceColor_X: number,
        attInstanceColor_Y: number,
        attInstanceColor_Z: number
    ) {
        const vertIndex = this.instEvery7StaticCursor
        if (vertIndex < 0 || vertIndex >= Math.floor(this.instCount / 7)) throw Error(`[pokeInstEvery7StaticData] Cursor out of range: instEvery7StaticCursor = ${vertIndex}`)
        const data = this.instEvery7StaticData
        let index = vertIndex * 3
        data[index++] = attInstanceColor_X,
        data[index++] = attInstanceColor_Y,
        data[index++] = attInstanceColor_Z
        this.instEvery7StaticCursor++
    }
    public pokeInstStaticData(
        attInstanceAngle: number
    ) {
        const vertIndex = this.instStaticCursor
        if (vertIndex < 0 || vertIndex >= this.instCount) throw Error(`[pokeInstStaticData] Cursor out of range: instStaticCursor = ${vertIndex}`)
        const data = this.instStaticData
        let index = vertIndex * 1
        data[index++] = attInstanceAngle
        this.instStaticCursor++
    }

    

    public destroy() {
        const { gl, prg, vertStaticBuff, instEvery7StaticBuff, instStaticBuff } = this
        gl.deleteBuffer(vertStaticBuff)
        gl.deleteBuffer(instEvery7StaticBuff)
        gl.deleteBuffer(instStaticBuff)
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
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.vertCount, this.instCount)
        gl.bindVertexArray(null)
    }

    $uniTrianglesScale(value: number) {
        this.gl.uniform1f(this._$uniTrianglesScale, value)
    }
    
    $uniAngleStep(value: number) {
        this.gl.uniform1f(this._$uniAngleStep, value)
    }
    
    $uniScreenScale(x: number, y: number) {
        this.gl.uniform2f(this._$uniScreenScale, x, y)
    }
    
    $uniOpacity(value: number) {
        this.gl.uniform1f(this._$uniOpacity, value)
    }

    private static createShader(gl: WebGL2RenderingContext, prg: WebGLProgram, type: number, code: string) {
        const shader = gl.createShader(type)
        if (!shader) throw Error("Unable to create WebGL Shader!")
    
        gl.shaderSource(shader, code)
        gl.compileShader(shader)
        gl.attachShader(prg, shader)
    }

    static readonly VERT = `#version 300 es
uniform vec2 uniScreenScale;
uniform float uniAngleStep;
uniform float uniTrianglesScale;
in vec3 attVertexPolarCoords;
in vec3 attInstanceColor;
in float attInstanceAngle;
out vec3 varColor;
const float RAD_PER_DEG=0.017453292519943295;
void main(){varColor=attInstanceColor*vec3(attVertexPolarCoords.z);
float instAng=uniAngleStep*float(1+gl_InstanceID)*RAD_PER_DEG;
float instDis=0.75-float(gl_InstanceID)*0.0138888888889;
float vertAng=instAng+(attVertexPolarCoords.x+attInstanceAngle)*RAD_PER_DEG;
float vertDis=attVertexPolarCoords.y*instDis*uniTrianglesScale;
float x=vertDis*cos(vertAng);
float y=vertDis*sin(vertAng);
float cx=instDis*cos(instAng);
float cy=instDis*sin(instAng);
gl_Position=vec4(uniScreenScale*vec2(cx+x,cy+y),0.0,1.0);}`
    static readonly FRAG = `#version 300 es
precision mediump float;
uniform float uniOpacity;
in vec3 varColor;
out vec4 FragColor;
void main(){FragColor=vec4(varColor,uniOpacity);}`
}
