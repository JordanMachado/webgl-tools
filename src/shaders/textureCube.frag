precision mediump float;

uniform samplerCube uTexture;
varying vec3 vNormal;
varying vec3 vUv;



void main() {
  vec4 colors = textureCube(uTexture, vUv);
  gl_FragColor = vec4(colors, 1.0);
}
