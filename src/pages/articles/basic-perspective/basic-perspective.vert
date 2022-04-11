#version 300 es

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
}