precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec2 vUv;




	float diffuse(vec3 N, vec3 L) {
	    return max(dot(N, normalize(L)), 0.0);
	}


	vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	    return diffuse(N, L) * C;
	}

	varying vec3 vNormal2;

void main() {
  vec3 light = diffuse(vNormal, vec3(0.0,1.0,0.0), uLightColor);

  gl_FragColor = vec4(light + uColor, 1.0);
}
