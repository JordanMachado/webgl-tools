precision mediump float;
uniform vec3 color0;
uniform vec3 color1;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
   vec3 gradient = mix(color0, color1, vUv.x);
  float color = cos(vUv.x * 15.0);
  // color = 1.0;
  color = smoothstep(0.1, 0.2, color)  ;
  gl_FragColor = vec4(vec3(gradient * color), 1.0);
}
