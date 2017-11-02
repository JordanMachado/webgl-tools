attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 normalMatrix;

uniform vec3 uPosition;

varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec2 vUv;


void main() {
  vec4 p = vec4(aPosition, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  vNormal = normalize(normalMatrix * aNormal);
  vShadowCoord = uShadowMatrix * worldMatrix * p;
}
