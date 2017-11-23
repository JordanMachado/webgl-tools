precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uOrigin;

uniform vec3 mouse;
uniform sampler2D uVelocity;




void main() {
      vec4 pos = texture2D(uTexture, vUv);
      vec4 vel = texture2D(uVelocity, vUv);

      float life = pos.a;
      life -= 0.0020;
      if(life < 0.1) {
        life = 1.0;
      }

      pos.xyz += vel.xyz;

      gl_FragColor = vec4(pos.xyz,life);
}
