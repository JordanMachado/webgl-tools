precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 resolution;
uniform vec2 direction;

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}

void main() {
  vec4 blurry = blur5(uTexture,vUv, resolution, direction);
  gl_FragColor = vec4(blurry.rgb, 1.0);

}

    // reinhard tone mapping
    // gamma correction
