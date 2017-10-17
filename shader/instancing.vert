attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aPrimnormal;
attribute vec2 aUv;

attribute vec3 aOffset;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vNormal2;
varying vec2 vUv;
varying vec3 vViewPosition;

mat3 calcLookAtMatrix(vec3 camPosition, vec3 camTarget, float roll) {
  vec3 ww = normalize(camTarget - camPosition);
  vec3 uu = normalize(cross(ww, vec3(sin(roll), cos(roll), 0.0)));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)

void main() {
  vec4 p = vec4(aPosition + aOffset, 1.0);

  mat3 lookat = calcLookAtMatrix(vec3(0.0, .0 , .0), aPrimnormal, 0.0);

  float noise = pnoise3(aOffset.xyz + uTime, vec3(80.0,10.0,100.0));

  vec3 pos = lookat * aPosition + aOffset + noise * aPrimnormal;

  gl_Position = projectionMatrix * viewMatrix *  worldMatrix * vec4(pos.xyz, 1.0);

  vUv = aUv;
  vViewPosition =  -(worldMatrix * p).xyz;
  vNormal = normalMatrix * normalize(lookat * normalize(aNormal));
  vNormal2 = aNormal;
}
