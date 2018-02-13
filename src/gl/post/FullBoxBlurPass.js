import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';

const glslify = require('glslify');

export default class FullBoxBlur {
  constructor(config = {}) {
    const uniforms = {}
    this.uAmount = config.uAmount || 2;

    this.shader = new Shader(glslify('./shaders/boxBlur.vert'), glslify('./shaders/boxBlur.frag'), uniforms);
    this.enable = true;
    this.fbo = null;
  }
  process(composer, cb) {
    if(!this.fboX) {
      this.fboX = new FrameBuffer(gl, composer.width, composer.height);
      this.fboY = new FrameBuffer(gl, composer.width, composer.height);
    }
    this.fboX.bind();
    this.shader.uniforms.uTexture = composer.outputTexture;
    this.shader.uniforms.uResolution = [composer.width, composer.height];
    this.shader.uniforms.uDelta = [this.uAmount, 0];
    composer.bigTriangle.shader = this.shader;
    composer.renderer.render(composer.bigTriangle, composer.camera);
    this.fboX.unbind();

    this.fboY.bind();
    this.shader.uniforms.uTexture = this.fboX.colors;
    this.shader.uniforms.uResolution = [composer.width, composer.height];
    this.shader.uniforms.uDelta = [0, this.uAmount];

    composer.bigTriangle.shader = this.shader;
    composer.renderer.render(composer.bigTriangle, composer.camera);
    this.fboY.unbind();
    cb(this.fboY.colors)
  }
}
