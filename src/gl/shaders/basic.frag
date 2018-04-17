precision highp float;

varying vec3 vNormal;
varying vec2 vUv;


#ifdef COLOR
uniform vec3 uColor;
#endif

#ifdef TEXTURE
uniform sampler2D uTexture;
#endif

#ifdef NORMAL_MAP
varying vec3 vViewPosition;
uniform sampler2D uNormalMap;
uniform vec2 uNormalScale;
uniform vec2 uNormalUVRepeat;


#extension GL_OES_standard_derivatives : enable
// function from three js
// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {

		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.xy  * uNormalUVRepeat);
		vec2 st1 = dFdy( vUv.xy * uNormalUVRepeat);

		vec3 S = normalize( q0 * st1.t - q1 * st0.t );
		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
		vec3 N = normalize( surf_norm );

		vec3 mapN = texture2D( uNormalMap, vUv * uNormalUVRepeat).xyz * 2.0 - 1.0;
		mapN.xy = uNormalScale * mapN.xy;
		mat3 tsn = mat3( S, T, N );
		return normalize( tsn * mapN );

}


#endif


#ifdef FOG
  varying float fogFactor;
  uniform vec3 uFogColor;
#endif

float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}


#HOOK_FRAGMENT_START


void main() {
  vec4 finalColor = vec4(1.0);
  vec3 normal = vNormal;

  #ifdef TEXTURE
    finalColor = texture2D(uTexture, vUv);
  #endif

  #ifdef COLOR
    finalColor.rgb *= uColor;
  #endif

  #ifdef NORMAL_MAP
    normal = perturbNormal2Arb(vViewPosition, vNormal);
  #endif

  vec3 light = diffuse(normal, vec3(0.0,10.0,1.0), vec3(0.1));


	#HOOK_FRAGMENT_MAIN

  gl_FragColor = vec4(finalColor.rgb + light, finalColor.a);

	#HOOK_FRAGMENT_END


  #ifdef FOG
    gl_FragColor.rgb = mix(uFogColor, gl_FragColor.rgb, fogFactor);
  #endif

}
