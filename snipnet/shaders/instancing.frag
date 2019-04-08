precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uColor;
uniform vec3 uColor1;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vViewPosition;

uniform sampler2D uBuffer;



	float diffuse(vec3 N, vec3 L) {
	    return max(dot(N, normalize(L)), 0.0);
	}


	vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	    return diffuse(N, L) * C;
	}

	varying vec3 vNormal2;

void main() {
  vec3 light = diffuse(vNormal, vec3(0.0,1.0,0.), uLightColor);
	vec4 buffer = texture2D(uBuffer, vUv2);
	vec3 color = mix(uColor, uColor1, vViewPosition.y + 1.4);
  gl_FragColor = vec4(color + light, 1.0);
  // gl_FragColor = vec4(vec3(buffer.a), 1.0);
}
