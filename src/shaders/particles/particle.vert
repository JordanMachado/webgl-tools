precision highp float;

attribute vec3 aPosition;
attribute vec4 aOffset;
attribute vec3 aNormal;
attribute vec2 aUv;
attribute vec2 aUv2;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform sampler2D uBuffer;
uniform vec3 mouse;

varying vec2 vUv;
varying vec3 vNormal;

mat3 calcLookAtMatrix(vec3 camPosition, vec3 camTarget, float roll) {
  vec3 ww = normalize(camTarget - camPosition);
  vec3 uu = normalize(cross(ww, vec3(sin(roll), cos(roll), 0.0)));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}


void main() {
  vec4 buffer = texture2D(uBuffer,aUv2);
  vUv = vec2(aUv2);
  vNormal = normalize(aNormal );
  vec4 p = vec4(aPosition + aOffset.xyz, 1.0);
  // mat3 lookat = calcLookAtMatrix(vec3(mouse), vec3(0.0), 0.0);

  p.xyz = (aPosition.xyz) + buffer.xyz * 0.3;
  gl_Position = projectionMatrix * viewMatrix *  worldMatrix * p;

}
