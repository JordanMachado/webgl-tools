import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';

const glslify = require('glslify');

export default class Pass {
  constructor(fs , uniforms = {}) {
    this.shader = new Shader(glslify('./shaders/default.vert'), fs, uniforms);
    this.enable = true;
    this.fbo = null;
  }
  process(composer, cb) {
    if(!this.fbo) {
      this.fbo = new FrameBuffer(gl, composer.width, composer.height);
    }
    this.fbo.bind();
    this.shader.uniforms.uTexture = composer.outputTexture;
    composer.bigTriangle.shader = this.shader;
    composer.renderer.render(composer.bigTriangle, composer.camera);
    this.fbo.unbind();
    cb(this.fbo.colors)
  }
}
