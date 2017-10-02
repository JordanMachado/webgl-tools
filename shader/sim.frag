precision mediump float;
// precision highp float;

uniform sampler2D texture;

uniform float time;
varying vec2 vUv;


void main() {
  vec4 pos = texture2D(texture,vUv);

  pos.x += 0.01;

  // float life = pos.a;
  // life -= 0.0030;
  // if(life < 0.1) {
  //   life = 1.0;
  //   pos.xyz = vec3(0.0);
  // }
  gl_FragColor = vec4(pos.xyz, 1.0);
}
