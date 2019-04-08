attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aColor;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 normalMatrix;


uniform float uPointSize;
uniform sampler2D uPosition;

varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec2 vUv;
varying vec3 vColor;


void main() {
  vec4 p = vec4(aPosition, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * p;
  gl_PointSize = uPointSize;
  vUv = aUv;
  vColor = aColor;
  vShadowCoord = uShadowMatrix * worldMatrix * p;
}
