import Pass from './Pass';
const glslify = require('glslify');

export default class NoisePass extends Pass {
  constructor() {
    super(glslify('./shaders/invert.frag'), {}, 'InvertPass');
  }
}
