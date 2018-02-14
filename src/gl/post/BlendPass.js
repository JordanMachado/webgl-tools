import Pass from './Pass';
const glslify = require('glslify');

export default class BlendPass extends Pass {
  constructor(config = {}) {
    const uniforms = {}

    uniforms.mode = config.mode || 1;
    uniforms.opacity = config.opacity || 1;
    uniforms.tInput2 = config.tInput2 || null;
    uniforms.resolution2 = config.resolution2 || [0,0];
    uniforms.sizeMode = config.sizeMode || 1;
    uniforms.aspectRatio = config.aspectRatio || 1;
    uniforms.aspectRatio2 = config.aspectRatio2 || 1;

    super(glslify('./shaders/blend.frag'), uniforms, 'BlendPass');
  }
}
