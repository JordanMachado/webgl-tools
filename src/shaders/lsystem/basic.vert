attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

attribute vec3 aOffset;
attribute vec4 aRotation;
attribute vec3 aScale;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;

// 3D
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



void main() {

  vec3 p = aPosition;
  p *= aScale;
  p += 2.0 * cross( aRotation.xyz, cross( aRotation.xyz, p ) + aRotation.w * p );
  p = p + aOffset;

  vec4 worldPos = projectionMatrix * viewMatrix * worldMatrix * vec4(p,1.0);
  // vec4 worldPos = projectionMatrix * viewMatrix * worldMatrix * pp;




  gl_Position = worldPos;

}
