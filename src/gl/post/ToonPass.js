import Pass from './Pass';
const glslify = require('glslify');

export default class ToonPass extends Pass {
  constructor(config = {}) {
    const uniforms = {}
    uniforms.uAmount = config.uResolution || [1,1];
    super(glslify('./shaders/toon.frag'), uniforms, 'ToonPass');
  }
}
