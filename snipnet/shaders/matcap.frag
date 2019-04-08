precision mediump float;

uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;
varying vec3 vEye;

const float PI = 3.141592653589793;
const float TwoPI = PI * 2.0;


vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

void main() {

  if(vNoise < 0.1) {
    discard;
  }
  // vec2 uv = envMapEquirect(vNormal).xy;


  // vec3 finalNormal = tsb * normalMap;
  vec2 uv = matcap(vEye, vNormal).xy;
  vec4 color = texture2D(uTexture,uv);

  gl_FragColor = vec4(color.rgb, 1.0);
  // gl_FragColor = vec4(vTangent, 1.0);
}
