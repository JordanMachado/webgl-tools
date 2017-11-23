attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

uniform mat4 uShadowMatrix;

varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vShadowCoord;

// fog chunk
const float density = 0.003;
const float gradient = 5.1;
varying float fogFactor;


void main() {
  vec4 p = vec4(aPosition, 1.0);
  vUv= aUv;
  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * p;
  vShadowCoord = uShadowMatrix * vec4(aPosition, 1.0);

  vec4 postoCam = viewMatrix * worldMatrix * p;
  // postoCam.z = 5.;
  float dist = length(postoCam.xyz);


  fogFactor = exp(-pow(dist*density,gradient));
  fogFactor = clamp(fogFactor, 0.0, 1.0);


}
