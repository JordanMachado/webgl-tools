import Shader from '../high/Shader';
const glslify = require('glslify');

export default class Pass extends Shader {
  constructor(fs , uniforms = {}) {
    super(glslify('./shaders/default.vert'), fs, uniforms);
    this.enable = true;
    this.uniforms.uTime = 0;
  }
}
