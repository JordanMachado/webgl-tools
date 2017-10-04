precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D uTexture;
void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = color;
  // gl_FragColor = vec4(vec3(vUv,1.0),1.0);
}
