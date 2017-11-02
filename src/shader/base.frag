precision mediump float;

uniform sampler2D uShadowMap;

varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vShadowCoord;



void main() {

  vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
  vec2 uv = shadowCoord.xy;
  vec4 shadow = texture2D( uShadowMap, uv.xy );
  // vec4 shadow = texture2D( uShadowMap, vUv );
  float visibility = 1.0;

  if ( shadow.r < shadowCoord.z - 0.005){
    visibility = 0.0;
  }
  gl_FragColor = vec4(vec3(visibility) * vec3(1.0), 1.0);
  // gl_FragColor = vec4(vec3(shadow.rgb), 1.0);
  // gl_FragColor = vec4(vec3(uv, shadow.r), 1.0);
}
