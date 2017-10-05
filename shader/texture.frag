precision mediump float;

uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color);
}
