attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
attribute vec4 offset;
attribute float rotationSpeed;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;

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
#define PI  3.141592653589793
void main() {
  vec3 p = rotate(aPosition.xyz, vec3(0.0, 1.0, 0.0), 45.0 * PI/180.0 + (rotationSpeed * time));

  gl_Position =  projectionMatrix * viewMatrix * worldMatrix * vec4(p + offset.xyz,1.0);
  vUv = aUv;
  vNormal = aNormal;
}
