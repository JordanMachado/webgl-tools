attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform sampler2D uHeightMap;



varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

const float density = 0.03;
const float gradient = 5.1;
varying float fogFactor;

void main() {

  vec4 p = vec4(aPosition, 1.0);

  vViewPosition = (projectionMatrix * viewMatrix * p).xyz;
  gl_Position = p;
  vUv = aUv;
  float dist = length(vViewPosition.xyz);

  vNormal = normalize(normalMatrix * aNormal);

  fogFactor = exp(-pow(dist*density,gradient));
	fogFactor = clamp(fogFactor, 0.0, 1.0);
}
