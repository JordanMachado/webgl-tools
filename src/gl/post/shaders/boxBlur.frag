precision highp float;

uniform sampler2D uTexture;
varying vec2 blurTexCoords[9];

void main() {

  vec4 sum = vec4( 0. );

  sum += texture2D( uTexture, blurTexCoords[0] ) * 0.051;
  sum += texture2D( uTexture, blurTexCoords[1] ) * 0.0918;
  sum += texture2D( uTexture, blurTexCoords[2] ) * 0.12245;
  sum += texture2D( uTexture, blurTexCoords[3] ) * 0.1531;
  sum += texture2D( uTexture, blurTexCoords[4] ) * 0.1633;
  sum += texture2D( uTexture, blurTexCoords[5] ) * 0.1531;
  sum += texture2D( uTexture, blurTexCoords[6] ) * 0.12245;
  sum += texture2D( uTexture, blurTexCoords[7] ) * 0.0918;
  sum += texture2D( uTexture, blurTexCoords[8] ) * 0.051;

  gl_FragColor = sum;

}
