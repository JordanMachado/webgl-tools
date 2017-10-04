precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D scene;
uniform sampler2D bloomBlur;
uniform float exposure;

void main()
{

    vec3 hdrColor = texture2D(scene, vUv).rgb;
    vec3 bloomColor = texture2D(bloomBlur, vec2(vUv.x,1.0 - vUv.y)).rgb;
    hdrColor += bloomColor; // additive blending

    gl_FragColor = vec4(hdrColor, 1.0);
}
