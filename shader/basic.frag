precision mediump float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;
uniform vec3 color0;
uniform vec3 color1;
uniform sampler2D uTexture;
uniform sampler2D uNormal;
varying float vNoise;
varying vec3 vEye;
varying vec3 vTangent;
varying vec3 vBinormal;

const float PI = 3.141592653589793;
const float TwoPI = PI * 2.0;


vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  //I assume envMap texture has been flipped the WebGL way (pixel 0,0 is a the bottom)
  //therefore we flip wcNorma.y as acos(1) = 0
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    //-1.0 for left handed coordinate system oriented texture (usual case)
    return envMapEquirect(wcNormal, -1.0);
}

float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}



void main() {

  // if(vNoise < 0.1) {
    // discard;
  // }
  // vec2 uv = envMapEquirect(vNormal).xy;

  // mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );
  vec3 normalMap = normalize(texture2D( uNormal, vUv ).rgb * 2.0 - 1.0);

  vec3 diff = diffuse(normalMap,vec3(0.0, 1., 1.0), vec3(.0,1.0,1.0)) ;


  // vec3 finalNormal = tsb * normalMap;
  vec2 uv = matcap(vEye, vNormal).xy;
  vec4 color = texture2D(uTexture,uv);

  gl_FragColor = vec4(color.rgb, 1.0);
  // gl_FragColor = vec4(vTangent, 1.0);
}
