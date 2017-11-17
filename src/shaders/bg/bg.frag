precision mediump float;


uniform sampler2D uNormalMap;
uniform sampler2D uHeightMap;
uniform float uTime;

uniform vec3 uColor;
uniform vec2 uNormalScale;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

#extension GL_OES_standard_derivatives : enable
// function from three js
// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {

		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );

		vec3 S = normalize( q0 * st1.t - q1 * st0.t );
		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
		vec3 N = normalize( surf_norm );

		vec3 mapN = texture2D( uNormalMap, vUv ).xyz * 2.0 - 1.0;
		mapN.xy = uNormalScale * mapN.xy;
		mat3 tsn = mat3( S, T, N );
		return normalize( tsn * mapN );

	}


	float diffuse(vec3 N, vec3 L) {
	    return max(dot(N, normalize(L)), 0.0);
	}


	vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	    return diffuse(N, L) * C;
	}

	varying float fogFactor;

	const vec3 fogColor = vec3(.01, 0.0, 0.2);


	#pragma glslify: snoise3 = require(glsl-noise/simplex/2d)

void main() {


	vec3 color = uColor;
	float d = 1.0 - length(vec2(0.5) - vUv);
	d= cos((vUv.x- uTime) * 100. );
	d= cos((vUv.x) * 100. );

	color  = smoothstep(0.5, 0.55, vec3(d));
	color = vec3(0.0,0.0,0.6) * (1.0 - color);
	color = mix(color, vec3(0.0), vUv.y);

  gl_FragColor = vec4(color , 1.0);

}
