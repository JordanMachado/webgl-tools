attribute vec3 aPosition;
attribute vec3 aTangent;
attribute vec3 aBitangent;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

uniform float uTime;

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;
varying vec3 vEye;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  float noise = snoise3(aPosition.xyz/2. + vec3(0.0,uTime, 0.0));
  vec4 p = vec4(aPosition, 1.0);
  p.xyz += noise * aNormal * 0.1;
  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  vNoise = noise;
  vEye = normalize( vec3(viewMatrix * worldMatrix * p ) );
  vNormal = normalize(normalMatrix * aNormal);
}
