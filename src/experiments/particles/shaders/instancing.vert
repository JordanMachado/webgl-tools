attribute vec3 aPosition;
attribute vec2 aTwouv;
attribute vec3 aColor;
attribute float aSize;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform sampler2D uBuffer;
uniform vec3 toLook;


uniform mat4 uShadowMatrix;
varying vec4 vShadowCoord;

varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vColor;
varying vec3 vViewPosition;

void main() {
    vec4 offset = texture2D(uBuffer, aTwouv);

    vec4 p = vec4(aPosition + offset.xyz,1.);
    vec4 worldPos = projectionMatrix * viewMatrix * worldMatrix * p;
    vViewPosition = worldPos.xyz;
    vShadowCoord = uShadowMatrix * worldMatrix * p;

    gl_Position = worldPos;
    gl_PointSize = 20.  * (aSize * clamp(offset.a,0.2,1.));
    // gl_PointSize = 20.;
    vColor = aColor;




}
