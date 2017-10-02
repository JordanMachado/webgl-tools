attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
attribute vec2 aUv2;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform sampler2D texture;

uniform float time;

varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vNormal;

void main() {
  vec4 buffer = texture2D(texture,aUv2);

  vec3 p = aPosition.xyz + buffer.xyz;

  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * vec4(p,1.0);
  vUv = aUv;
  vUv2 = aUv2;

  vNormal = aNormal;
}
