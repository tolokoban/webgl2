#version 300 es

precision mediump float;

uniform sampler2D uniTex;

in vec2 varUV;

out vec4 FragColor;

void main() {
    FragColor = texture(uniTex, varUV);
}