attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;
varying vec4 clipSpace;

void main() {
  vec4 p = vec4(aPosition, 1.0);
  clipSpace = projectionMatrix * viewMatrix * p;
  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  vNormal = normalize(normalMatrix * aNormal);
}
