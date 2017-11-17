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

	const vec3 fogColor = vec3(.01);


	#pragma glslify: snoise3 = require(glsl-noise/simplex/2d)

void main() {
	vec3 normal = perturbNormal2Arb(vViewPosition, vNormal);
	vec3 light = diffuse(normal, vec3(1.0, 1.0,cos(uTime*20.)), vec3(0.0, 0.0, 1.));
	float height = texture2D(uHeightMap, vUv).r;
	vec3 color = uColor - vec3(height) * 0.1;
	float d = 1.0 - length(vec2(0.5) - vUv);
	d  = smoothstep(0.6, .55, d);
	// d  = 1.0;
	float noise = snoise3(vUv + uTime);
	color = vec3(cos(vUv.x * (300. * 1.0 - d) * noise));
	color  = smoothstep(0.5, 1.0, color);

  gl_FragColor = vec4(color+ light * (1.0 - d), 1.0);

	gl_FragColor.rgb = mix(fogColor, gl_FragColor.rgb, fogFactor);

}
