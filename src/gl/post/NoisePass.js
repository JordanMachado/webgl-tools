import Pass from './Pass';
const glslify = require('glslify');

export default class NoisePass extends Pass {
  constructor(config = {}) {
    const uniforms = {}
    uniforms.uAmount = config.uAmount || 0.3;
    uniforms.uSpeed = config.uSpeed || 0;
    super(glslify('./shaders/noise.frag'), uniforms, 'NoisePass');
  }
}
