precision mediump float;

const float MIN = 0.1;
const float MAX = 0.9;
const float CELLS = 8.0;
const vec3 ORANGE = vec3(1.0, 0.5, 0.0);
const vec3 BLUE = vec3(0.0, 0.6, 1.0);

varying vec2 varUV;
varying float varLight;

void main() {
    float u = fract(varUV.x * CELLS) - 0.5;
    float v = fract(varUV.y * CELLS) - 0.5;
    float r = 4.0 * (u*u + v*v);
    float a = smoothstep(0.8, 0.9, r);
    gl_FragColor = vec4(mix(BLUE, ORANGE, a) * varLight, 1.0);
}
