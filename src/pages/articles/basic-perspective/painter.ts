/**
 * Code généré automatiquement le 01/04/2022
 */
 export default class Painter {
    private readonly vertBuff: WebGLBuffer
    private readonly _attPos: number
    private readonly _attUV: number    
    private readonly _$uniAspectRatio: WebGLUniformLocation
    private readonly _$uniShift: WebGLUniformLocation
    private readonly _$uniScale: WebGLUniformLocation    
    private static ATTRIBS_COUNT = 4
    private vertData = new Float32Array()
    private vertCount = 0
    private readonly prg: WebGLProgram

    constructor(
        public readonly gl: WebGL2RenderingContext,
        private readonly onPaint: (painter: Painter, time: number) => void
    ) {
        const prg = gl.createProgram()
        if (!prg) throw Error("Unable to create a WebGL Program!")
        Painter.createShader(gl, prg, gl.VERTEX_SHADER, Painter.VERT)
        Painter.createShader(gl, prg, gl.FRAGMENT_SHADER, Painter.FRAG)
        gl.linkProgram(prg)
        this.prg = prg
        const vertBuff = gl.createBuffer()
        if (!vertBuff) throw Error("Unable to create WebGL Buffer!")
        this.vertBuff = vertBuff
        this._attPos = gl.getAttribLocation(prg, "attPos")
        this._attUV = gl.getAttribLocation(prg, "attUV")
        this._$uniAspectRatio = gl.getUniformLocation(prg, "uniAspectRatio") as WebGLUniformLocation
        this._$uniShift = gl.getUniformLocation(prg, "uniShift") as WebGLUniformLocation
        this._$uniScale = gl.getUniformLocation(prg, "uniScale") as WebGLUniformLocation
    }

    public createVertDataArray(vertCount: number): void {
        this.vertCount = vertCount
        this.vertData = new Float32Array(vertCount * 4)
    }
    public pushVertData() {
        const { gl } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuff)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertData, gl.STATIC_DRAW)
    }

    public pokeVertData(
        vertexIndex: number,
        attPos_X: number,
        attPos_Y: number,
        attUV_X: number,
        attUV_Y: number
    ) {
        let index = vertexIndex * Painter.ATTRIBS_COUNT
        const data = this.vertData
        data[index++] = attPos_X,
        data[index++] = attPos_Y,
        data[index++] = attUV_X,
        data[index++] = attUV_Y
    }

    public destroy() {
        const { gl, prg, vertBuff } = this
        gl.deleteBuffer(vertBuff)
        gl.deleteProgram( prg )
    }

    public readonly paint = (time: number) => {
        const { gl, prg } = this
        gl.useProgram(prg)
        this.onPaint(this, time)
        const BPE = Float32Array.BYTES_PER_ELEMENT
        const stride = Painter.ATTRIBS_COUNT * BPE
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuff)
        const idx0 = this._attPos
        gl.enableVertexAttribArray(idx0)
        gl.vertexAttribPointer(idx0, 2, gl.FLOAT, false, stride, 0 * BPE)
        const idx1 = this._attUV
        gl.enableVertexAttribArray(idx1)
        gl.vertexAttribPointer(idx1, 2, gl.FLOAT, false, stride, 2 * BPE)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertCount)
    }

    $uniAspectRatio(value: number) {
        this.gl.uniform1f(this._$uniAspectRatio, value)
    }
    
    $uniShift(value: number) {
        this.gl.uniform1f(this._$uniShift, value)
    }
    
    $uniScale(value: number) {
        this.gl.uniform1f(this._$uniScale, value)
    }

    private static createShader(gl: WebGL2RenderingContext, prg: WebGLProgram, type: number, code: string) {
        const shader = gl.createShader(type)
        if (!shader) throw Error("Unable to create WebGL Shader!")
    
        gl.shaderSource(shader, code)
        gl.compileShader(shader)
        gl.attachShader(prg, shader)
    }

    static readonly VERT = `uniform float uniScale;
uniform float uniAspectRatio;
uniform float uniShift;
attribute vec2 attPos;
attribute vec2 attUV;
varying vec2 varUV;
varying float varLight;
void main(){varUV=attUV+vec2(uniShift,0.0);
varLight=attUV.y < 0.5 ? 1.0/(uniScale*uniScale*uniScale): 1.0;
gl_Position=vec4(attPos.x*uniScale,attPos.y*uniAspectRatio,1.0,attUV.y < 0.5 ? uniScale : 1.0);}`
    static readonly FRAG = `precision mediump float;
const float MIN=0.1;
const float MAX=0.9;
const float CELLS=8.0;
const vec3 ORANGE=vec3(1.0,0.5,0.0);
const vec3 BLUE=vec3(0.0,0.6,1.0);
varying vec2 varUV;
varying float varLight;
void main(){float u=fract(varUV.x*CELLS)-0.5;
float v=fract(varUV.y*CELLS)-0.5;
float r=4.0*(u*u+v*v);
float a=smoothstep(0.8,0.9,r);
gl_FragColor=vec4(mix(BLUE,ORANGE,a)*varLight,1.0);}`
}
