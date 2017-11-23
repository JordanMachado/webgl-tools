precision highp float;
uniform sampler2D uShadowMap;

varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vShadowCoord;
varying float fogFactor;

void main() {

  vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
  vec2 uv = shadowCoord.xy;
  vec4 shadow = texture2D( uShadowMap, uv.xy );
  float visibility = 1.0;

  if ( shadow.r < shadowCoord.z - 0.005){
    visibility = 0.5;
  }
  gl_FragColor = vec4(vec3(visibility) * vec3(0.9), 1.0);
  // gl_FragColor = vec4(vec3(vUv,1.0), 1.0);
  gl_FragColor.rgb = mix(vec3(0.7), gl_FragColor.rgb, fogFactor);

}
