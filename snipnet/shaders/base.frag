precision mediump float;
varying vec2 vUv;
varying vec3 vCenter;
varying vec3 vNormal;
varying vec3 vVel;

float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}


void main() {
  vec3 color = vCenter;
  vec3 light =  diffuse(vNormal, vec3(0.0,1.0,1.0), vec3(1.0));

  // color = vVel;
  gl_FragColor = vec4( vNormal - light + vVel * 0.05, 1.0);
}
