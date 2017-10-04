precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
  const float gamma = 2.2;
  const float exposure = 0.1;
  vec3 hdrColor = texture2D(uTexture, vUv).rgb;
   vec3 mapped = vec3(1.0) - exp(-hdrColor * exposure);
  mapped = pow(mapped, vec3(1.0 / gamma));

  gl_FragColor = vec4(mapped.rgb, 1.0);

}
