attribute vec2 aPosition;
attribute vec2 aUv;


varying vec2 vUv;
varying vec2 blurTexCoords[9];

uniform vec2 uResolution;
uniform vec2 uDelta;


void main() {

  vec2 inc = uDelta / uResolution;



  vec4 p = vec4(aPosition,0.0, 1.0);
  gl_Position = p;
  vUv =  aPosition * .5 + .5;

  blurTexCoords[ 0 ] = vUv - inc * 4.;
  blurTexCoords[ 1 ] = vUv - inc * 3.;
  blurTexCoords[ 2 ] = vUv - inc * 2.;
  blurTexCoords[ 3 ] = vUv - inc * 1.;
  blurTexCoords[ 4 ] = vUv;
  blurTexCoords[ 5 ] = vUv + inc * 1.;
  blurTexCoords[ 6 ] = vUv + inc * 2.;
  blurTexCoords[ 7 ] = vUv + inc * 3.;
  blurTexCoords[ 8 ] = vUv + inc * 4.;
}
