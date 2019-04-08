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

const float density = 0.02;
const float gradient = 5.1;
varying float fogFactor;

void main() {
  float height = texture2D(uHeightMap, aUv).r;
  vec4 p = vec4(aPosition, 1.0);
  float d = 1.0 - length(vec2(0.5) -aUv);
  p.z += height * 10. * (1.0 -d);
  d  = smoothstep(0.84, 1.0, d);

  p.z -= d * 10.;


  vViewPosition = (projectionMatrix * viewMatrix * p).xyz;
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * p;
  vUv = aUv;
  float dist = length(vViewPosition.xyz);

  vNormal = normalize(normalMatrix * aNormal);

  fogFactor = exp(-pow(dist*density,gradient));
	fogFactor = clamp(fogFactor, 0.0, 1.0);
}
