attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;

// #ifdef NORMAL_MAP
  varying vec3 vViewPosition;
// #endif

#ifdef FOG
  uniform float uDensity;
  uniform float uGradient;
  varying float fogFactor;
#endif

#HOOK_VERTEX_START

void main() {
  vec4 p = vec4(aPosition, 1.0);
  vUv = aUv;
  vNormal = normalize(normalMatrix * aNormal);


  vec4 worldPos = projectionMatrix * viewMatrix * worldMatrix * p;
  vViewPosition = worldPos.xyz;

  #HOOK_VERTEX_MAIN


  gl_Position = worldPos;

  #ifdef FOG
    float dist = length(vViewPosition.xyz);
    fogFactor = exp(-pow(dist * uDensity, uGradient));
    fogFactor = clamp(fogFactor, 0.0, 1.0);
  #endif

  #HOOK_VERTEX_END

}
