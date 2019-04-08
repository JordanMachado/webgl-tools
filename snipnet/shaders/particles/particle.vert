precision highp float;

attribute vec3 aPosition;
attribute vec4 aOffset;
attribute vec3 aNormal;
attribute vec2 aUv;
attribute vec2 aUv2;
attribute vec3 aColor;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform sampler2D uBuffer;
uniform sampler2D uBufferVel;
uniform sampler2D uPositions;
uniform vec3 mouse;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;


const float density = 0.007;
const float gradient = 5.1;
varying float fogFactor;

mat3 calcLookAtMatrix(vec3 camPosition, vec3 camTarget, float roll) {
  vec3 ww = normalize(camTarget - camPosition);
  vec3 uu = normalize(cross(ww, vec3(sin(roll), cos(roll), 0.0)));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}
varying vec4 vShadowCoord;

uniform mat4 uShadowMatrix;

void main() {
  vec4 buffer = texture2D(uBuffer,aUv2);
  vec4 velo = texture2D(uBufferVel,aUv2);
  vec4 base = texture2D(uPositions,aUv2);
  vUv = vec2(aUv2);
  mat3 lookAt = calcLookAtMatrix(buffer.xyz + velo.xyz, buffer.xyz, 0.0);

  vNormal = normalize( lookAt*aNormal.xyz);
  vec4 p = vec4(aPosition + aOffset.xyz, 1.0);
  vColor = aColor;

  p.xyz =  (aPosition.xyz * base.a * length(buffer.xyz) * 0.007) * lookAt + buffer.xyz * 0.1;
  vec4 postoCam = viewMatrix * worldMatrix * p;


  float dist = length(postoCam.xyz);
  vShadowCoord = uShadowMatrix * vec4(p.xyz, 1.0);

  fogFactor = exp(-pow(dist*density,gradient));
  fogFactor = clamp(fogFactor, 0.0, 1.0);

  gl_Position = projectionMatrix * viewMatrix *  worldMatrix * p;

}
