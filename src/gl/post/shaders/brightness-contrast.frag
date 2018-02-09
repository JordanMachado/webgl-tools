precision highp float;

uniform float uBrightness;
uniform float uContrast;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {

  vec3 color = texture2D(uTexture, vUv).rgb;
  vec3 colorContrasted = (color) * uContrast;
  vec3 bright = colorContrasted + vec3(uBrightness,uBrightness,uBrightness);
  gl_FragColor.rgb = bright;
  gl_FragColor.a = 1.;

}
