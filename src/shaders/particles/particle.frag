precision highp float;

uniform sampler2D uShadowMap;

varying vec3 vNormal;
varying vec2 vUv;


	float diffuse(vec3 N, vec3 L) {
	    return max(dot(N, normalize(L)), 0.0);
	}


	vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	    return diffuse(N, L) * C;
	}

void main() {

  vec3 light =  diffuse(vNormal, vec3(.0,1.,1.0), vec3(51.0/255.0,255.0/255.0,185.0/255.0 ));

  gl_FragColor = vec4(light, 1.0);
}
