attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

uniform float time;

varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;
varying float vNoise;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  float noise = snoise3(aPosition.xyz/2. + vec3(0.0,time, 0.0));
  vec4 p = vec4(aPosition, 1.0);
  p.xyz += noise * aNormal * 0.1;
  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  vNoise = noise;
  vNormal = aNormal;
  vColor = aColor;
}
