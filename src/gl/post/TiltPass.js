import Pass from './Pass';
const glslify = require('glslify');

export default class TiltPass extends Pass
{
    constructor(config = {})
    {
        const uniforms = {};

        uniforms.uBlurAmount = config.uBlurAmount || 1.0;
        uniforms.uCenter = config.uCenter || 1.1;
        uniforms.uStepSize = config.uStepSize || 0.0005;
        super(glslify('./shaders/tilt.frag'), uniforms, 'TiltPass');
    }
}
