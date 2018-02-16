precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 normalMatrix;

uniform sampler2D uPosition;
uniform float uPointSize;
uniform vec2 uUVpos;

varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec2 vUv;


void main() {
  vec3 pos = texture2D(uPosition, uUVpos).xyz;
  vec4 p = vec4(aPosition + pos * 3., 1.0);

  gl_Position = projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  vNormal = normalize(normalMatrix * aNormal);
  vShadowCoord = uShadowMatrix * worldMatrix * p;
}
