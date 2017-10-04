precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vDistToLight;

uniform float time;


float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}

void main() {
  vec3 light =  diffuse(vNormal, vec3(-1.0,0.0,0.0), vec3(51.0/255.0,255.0/255.0,185.0/255.0 ));
  vec3 light2 =  diffuse(vNormal, vec3(1.0,0.0,0.0), vec3(255.0/255.0,50.0/255.0,219.0/255.0 ));
  vec3 light3 =  diffuse(vNormal, vec3(0.0,0.0,10.0), vec3(5.0/255.0,5.0/255.0,219.0/255.0 ));
  vec3 lighing = vec3(0.1) + light + light2 + light3;
  float color = cos(vUv.y*50.0);
  color = smoothstep(0.5,0.6, color);
  gl_FragColor = vec4( color + lighing, 1.0);
}
