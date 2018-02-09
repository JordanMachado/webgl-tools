precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDepth;
uniform float uFocalDistance;
uniform float uAperture;
uniform vec2 uDelta;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

float unpack_depth(const in vec4 color) {
  return ( color.r * 256. * 256. * 256. + color.g * 256. * 256. + color.b * 256. + color.a ) / ( 256. * 256. * 256. );
}

float sampleBias( vec2 uv ) {
  float d = abs( texture2D( uDepth, uv ).r - uFocalDistance );
  return min( d * uAperture, .005 );
  //return unpack_depth( texture2D( uDepth, uv ) );
}

void main() {

  vec4 sum = vec4( 0. );
  float bias = sampleBias( vUv );

  sum += texture2D( uTexture, ( vUv - bias * uDelta * 4. ) ) * 0.051;
  sum += texture2D( uTexture, ( vUv - bias * uDelta * 3. ) ) * 0.0918;
  sum += texture2D( uTexture, ( vUv - bias * uDelta * 2. ) ) * 0.12245;
  sum += texture2D( uTexture, ( vUv - bias * uDelta * 1. ) ) * 0.1531;
  sum += texture2D( uTexture, ( vUv + bias * uDelta * 0. ) ) * 0.1633;
  sum += texture2D( uTexture, ( vUv + bias * uDelta * 1. ) ) * 0.1531;
  sum += texture2D( uTexture, ( vUv + bias * uDelta * 2. ) ) * 0.12245;
  sum += texture2D( uTexture, ( vUv + bias * uDelta * 3. ) ) * 0.0918;
  sum += texture2D( uTexture, ( vUv + bias * uDelta * 4. ) ) * 0.051;

  gl_FragColor = sum;

}
