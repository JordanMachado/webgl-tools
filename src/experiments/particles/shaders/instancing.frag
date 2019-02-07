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


void main() {

  if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
  discard;
}
  vec4 colors = texture2D(normalTexture,gl_PointCoord);

  vec3 light = diffuse(colors.xyz, normalize(vec3(0.0,20.0,1.0)), vec3(0.3));


  vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
  vec2 uv = shadowCoord.xy;
  vec4 shadow = texture2D( uShadowMap, uv.xy );
  float visibility = 1.0;

  if ( shadow.r < shadowCoord.z - 0.006){
    visibility = 0.7;
  }

  gl_FragColor = vec4( (vec3(visibility) * vColor) + light , colors.a);
  // gl_FragColor = vec4( vColor,1.);


  // gl_FragColor = vec4(vec3(visibility),1.);
}
