import Pass from './Pass';
const glslify = require('glslify');

export default class DofPass extends Pass {
  constructor(config = {}) {
    const uniforms = {}
    uniforms.uFocalDistance = config.uFocalDistance || 0.01;
    uniforms.uAperture = config.uAperture || 0.005;
    uniforms.uDelta = config.uDelta || [1,0];
    super(glslify('./shaders/dof.frag'), uniforms);
  }
}
