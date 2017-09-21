precision mediump float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;
uniform vec3 color0;
uniform vec3 color1;
varying float vNoise;
void main() {
  vec3 gradient = mix(color0, color1, vUv.y);
  if(vNoise < 0.1) {
    discard;
  }
  gl_FragColor = vec4(gradient, 1.0);
}
