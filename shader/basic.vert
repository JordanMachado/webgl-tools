precision mediump float;

attribute vec3 aPosition;
attribute vec2 uv2;

varying vec2 vUv;

void main() {
  vUv = vec2(uv2.x, uv2.y);
  gl_Position = vec4(aPosition, 1.0);
}
