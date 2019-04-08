precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
attribute vec2 aOffset;
attribute vec3 aCenter;
attribute vec2 aUvsCenter;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 normalMatrix;
uniform float uForce;
uniform sampler2D uTexture;


varying vec3 vNormal;
varying vec3 vCenter;
varying vec3 vVel;
varying vec2 vUv;



void main() {
  vec4 p = vec4(aPosition, 1.0);
  vec4 off = texture2D(uTexture, aUv);
  p.xyz += off.xyz * uForce;
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * p;
  gl_PointSize = 10.0;
  vUv = aUv;
  vNormal = aNormal;
  vCenter = vec3(aUvsCenter,1.0);
  vVel = vec3(off);
}
