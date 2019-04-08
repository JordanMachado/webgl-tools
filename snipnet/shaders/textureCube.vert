attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec3 vUv;
varying vec3 vViewPosition;

void main() {
  vec4 p = vec4(aPosition, 1.0);
  gl_Position = projectionMatrix * viewMatrix *  worldMatrix * p;
  vUv = aPosition;
  vViewPosition =  -(worldMatrix * p).xyz;
  vNormal = normalize(normalMatrix * aNormal);
}
