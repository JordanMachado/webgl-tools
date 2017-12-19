precision highp float;

uniform sampler2D uTexture;
uniform float uAmount;
uniform float uSpeed;
uniform float uTime;
varying vec2 vUv;

float random(vec2 n, float offset ){
	return .5 - fract(sin(dot(n.xy + vec2( offset, 0. ), vec2(12.9898, 78.233)))* 43758.5453);
}

void main() {

	vec4 color = texture2D(uTexture, vUv);
	color += vec4( vec3( uAmount * random( vUv, .00001 * uSpeed * uTime ) ), 1. );

	gl_FragColor = color;

}
