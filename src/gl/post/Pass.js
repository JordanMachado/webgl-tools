import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';

const glslify = require('glslify');

export default class Pass {
  constructor(fs , uniforms = {}, name ='Postpro pass') {
    this.shader = new Shader(glslify('./shaders/default.vert'), fs, uniforms, name);
    this.shader.uniforms.uTime = 0;
    this.enable = true;
    this.fbo = null;
  }
  initialize(composer) {
    if(!this.fbo) {
      this.fbo = new FrameBuffer(gl, composer.width, composer.height);
    }
    this.composer = composer;
  }
  process(inputTexture, cb) {
    this.shader.uniforms.uTexture = inputTexture;
    this.shader.uniforms.uTime += 0.0025;
    this.composer.pass(this.fbo, this.shader);
    cb(this.fbo.colors)
  }
}
