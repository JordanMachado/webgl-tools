precision highp float;
// simulation
varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uPositions;

uniform vec3 mouse;



void main() {


      vec4 pos = texture2D(uPositions, vUv);
      vec4 vel = texture2D(uTexture, vUv);

      vec3 force = mouse - pos.xyz;
      vec3 nForce = normalize(force);
      vel.xyz *= 0.993;
      vel.xyz += nForce * 0.1;


      gl_FragColor = vec4(vel.xyz,1.0);
}
