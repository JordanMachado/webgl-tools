import Pass from './Pass';
const glslify = require('glslify');

import FrameBuffer from '../core/FrameBuffer';

export default class DofPass extends Pass
{
    constructor(config = {})
    {
        const uniforms = {};

        uniforms.uFocalDistance = config.uFocalDistance || 0.01;
        uniforms.uAperture = config.uAperture || 0.005;
        super(glslify('./shaders/dof.frag'), uniforms, 'DofPass');
    }
    process(composer, cb)
    {
        if (!this.fboX)
        {
            this.fboX = new FrameBuffer(gl, composer.width, composer.height);
            this.fboY = new FrameBuffer(gl, composer.width, composer.height);
        }
        this.fboX.bind();
        this.shader.uniforms.uTexture = composer.outputTexture;
        this.shader.uniforms.uDelta = [1, 0];
        composer.bigTriangle.shader = this.shader;
        composer.renderer.render(composer.bigTriangle, composer.camera);
        this.fboX.unbind();

        this.fboY.bind();
        this.shader.uniforms.uTexture = this.fboX.colors;
        this.shader.uniforms.uDelta = [0, 1];
        composer.bigTriangle.shader = this.shader;
        composer.renderer.render(composer.bigTriangle, composer.camera);
        this.fboY.unbind();

        cb(this.fboY.colors);
    }
}
