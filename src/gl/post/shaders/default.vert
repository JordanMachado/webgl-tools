attribute vec2 aPosition;
attribute vec2 aUv;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec4 p = vec4(aPosition,0.0, 1.0);
  gl_Position = p;
  vUv =  aPosition * .5 + .5;
}
