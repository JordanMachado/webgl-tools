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


// fog chunk
const float density = 0.05;
const float gradient = 5.1;
varying float fogFactor;


void main() {
  vec4 p = vec4(aPosition, 1.0);
  clipSpace = projectionMatrix * viewMatrix * p;
  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;

  vec4 postoCam = viewMatrix * worldMatrix * p;
	float dist = length(postoCam.xyz);
  gl_PointSize = 20.0;
  fogFactor = exp(-pow(dist*density,gradient));
	fogFactor = clamp(fogFactor, 0.0, 1.0);

  vNormal = normalize(normalMatrix * aNormal);
}
