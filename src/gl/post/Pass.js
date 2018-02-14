import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';

const glslify = require('glslify');

export default class Pass {
  constructor(fs , uniforms = {}, name ='Postpro pass') {
    this.shader = new Shader(glslify('./shaders/default.vert'), fs, uniforms, name);
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
    this.composer.pass(this.fbo, this.shader);
    cb(this.fbo.colors)
  }
}
