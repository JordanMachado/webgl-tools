precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;


float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}


#ifdef COLOR
uniform vec3 uColor;
#endif

#ifdef TEXTURE
uniform sampler2D uTexture;
#endif
void main() {
  vec4 finalColor = vec4(1.0);
  vec3 light = diffuse(vNormal, vec3(0.0,0.0,1.0), vec3(1.0));

  #ifdef TEXTURE
    finalColor = texture2D(uTexture, vUv);
  #endif

  #ifdef COLOR
    finalColor.rgb *= uColor;
  #endif
  gl_FragColor = vec4(finalColor.rgb, finalColor.a);
}
