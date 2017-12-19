precision highp float;

uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 base = texture2D(uTexture,vUv);
  gl_FragColor = vec4(base.rgb, 1.0);
}
