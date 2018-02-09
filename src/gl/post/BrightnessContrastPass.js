import Pass from './Pass';
const glslify = require('glslify');

export default class BrightnessContrastPass extends Pass {
  constructor(config = {}) {
    const uniforms = {}
    uniforms.uBrightness = config.uBrightness || 0;
    uniforms.uContrast = config.uContrast || 0;
    super(glslify('./shaders/brightness-contrast.frag'), uniforms);
  }
}
