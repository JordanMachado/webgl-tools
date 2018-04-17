precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = vec2(aUv.x, aUv.y);
  vNormal = aNormal;
  gl_Position = vec4(aPosition, 1.0);
}
