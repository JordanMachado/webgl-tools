precision highp float;

uniform vec3 uLightColor;
uniform sampler2D uShadowMap;
uniform sampler2D uBuffer;
uniform vec3 fogColor;


varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vShadowCoord;
varying vec3 vColor;

varying float fogFactor;

	float diffuse(vec3 N, vec3 L) {
	    return max(dot(N, normalize(L)), 0.0);
	}


	vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	    return diffuse(N, L) * C;
	}

void main() {
	vec4 buffer = texture2D(uBuffer,vUv);

  vec3 light =  diffuse(vNormal, vec3(0.0,1.,.0),uLightColor);


	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	vec4 shadow = texture2D( uShadowMap, uv.xy );
	float visibility = 1.0;

	if ( shadow.r < shadowCoord.z - 0.005){
		visibility = 0.5;
	}
	gl_FragColor = vec4((visibility * light) + (vColor * visibility), 1.0);

	gl_FragColor.rgb = mix(fogColor, gl_FragColor.rgb, fogFactor);
}
