uniform float uniScale;
uniform float uniAspectRatio;
uniform float uniShift;

attribute vec2 attPos;
attribute vec2 attUV;

varying vec2 varUV;
varying float varLight;

void main() {
    varUV = attUV + vec2(uniShift, 0.0);
    varLight = attUV.y < 0.5 ? 1.0 / (uniScale * uniScale) : 1.0;
    gl_Position = vec4( 
        attPos.x * uniScale, 
        attPos.y * uniAspectRatio, 
        1.0, 
        attUV.y < 0.5 ? uniScale : 1.0
    );
}