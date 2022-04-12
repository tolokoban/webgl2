#version 300 es

// (0,0) pour le centre de la carte.
uniform vec2 uniCenter;
// Facteur de zoom.
uniform float uniScale;
// Pente : 0 pour pas de perspective, 1 pour forte pente.
uniform float uniSlope;
// canvasl.width / canvas.height
uniform float uniRatio;

in vec3 attPoint;
in vec2 attUV;

out vec2 varUV;

void main() {
    vec3 point = (attPoint - vec3(uniCenter, 0.0)) * uniScale;
    varUV = attUV;
    point.y *= uniRatio;
    float w = uniSlope * point.y + 1.0;
    float z = 0.0;
    point.y += point.z * uniRatio;
    gl_Position = vec4(point.xy, z, w);
}