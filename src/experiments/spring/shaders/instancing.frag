precision mediump float;

uniform sampler2D normalTexture;
varying vec2 vUv;
varying vec3 vViewPosition;

uniform sampler2D uShadowMap;
varying vec4 vShadowCoord;
varying vec3 vColor;

float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}

float sampleShadow(vec3 coord) {
	return step(coord.z, texture2D(uShadowMap, coord.xy).r + 0.006);
}



void main() {

  if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
    discard;
  }
  vec4 normals = texture2D(normalTexture,gl_PointCoord);

  vec3 light = diffuse(normals.xyz, normalize(vec3(0.0,20.0,1.0)), vec3(0.2));
  vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
  float shadow = 0.0;
  float offset = 0.0001;

  shadow += sampleShadow(shadowCoord.xyz);
  shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0, -offset, 0.0));
  shadow += sampleShadow(shadowCoord.xyz + vec3(-offset,    0.0, 0.0));
  shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0,    0.0, 0.0));
  shadow += sampleShadow(shadowCoord.xyz + vec3( offset,    0.0, 0.0));
  shadow += sampleShadow(shadowCoord.xyz + vec3(   0.0,  offset, 0.0));
  shadow /= 5.0;



  gl_FragColor = vec4( vColor*0.9 + light , normals.a);
  gl_FragColor.rgb *= vec3(smoothstep(0.0, 1.0, shadow+0.65));
}
