attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTwouv;
attribute vec2 aUv;

attribute vec4 aOffset;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform sampler2D uBuffer;

varying vec3 vNormal;
varying vec3 vNormal2;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vViewPosition;

mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
              );
}


void main() {
  vec4 p = vec4(aPosition + aOffset.xyz, 1.0);

  vec2 uv2 = aTwouv;
  vec4 buffer = texture2D( uBuffer, uv2);

 mat3 rot = rotationMatrix(vec3(1.0,0.0,0.0), buffer.x * 5.0)* rotationMatrix(vec3(0.0,1.0,0.0),buffer.y * 5.0)* rotationMatrix(vec3(0.0,0.0,1.0),buffer.z * 5.0);
 vec4 pos = vec4((aPosition * buffer.a * rot) + buffer.xyz, 1.0);

  gl_Position = projectionMatrix * viewMatrix *  worldMatrix * pos;

  vUv = aUv;
  // vUv2 = aTwouv;
  vViewPosition =  -(worldMatrix * pos).xyz;
  vNormal = normalMatrix * normalize(aNormal * rot);
  vNormal2 = aNormal;
}
