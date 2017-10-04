precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D scene;
uniform sampler2D bloomBlur;
uniform float exposure;

void main()
{
    const float gamma = 2.2;
    const float expo = 0.2;
    vec3 hdrColor = texture2D(scene, vUv).rgb;
    vec3 bloomColor = texture2D(bloomBlur, vUv).rgb;
    hdrColor += bloomColor; // additive blending

    gl_FragColor = vec4(hdrColor, 1.0);
}
