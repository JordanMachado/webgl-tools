import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';
const glslify = require('glslify');

export default class Pass
{
    constructor(config = {})
    {
        const uniforms = {};

        this.uAmount = config.uAmount || 2;

        this.shader = new Shader(glslify('./shaders/boxBlur.vert'), glslify('./shaders/boxBlur.frag'), uniforms, 'FullBoxBlurPass');
        this.enable = true;
        this.fbo = null;
    }
    initialize(composer)
    {
        if (!this.fboX)
        {
            this.fboX = new FrameBuffer(gl, composer.width, composer.height);
            this.fboY = new FrameBuffer(gl, composer.width, composer.height);
        }
        this.composer = composer;
    }
    process(inputTexture, cb)
    {
        this.shader.uniforms.uTexture = inputTexture;
        this.shader.uniforms.uResolution = [this.composer.width, this.composer.height];
        this.shader.uniforms.uDelta = [this.uAmount, 0];
        this.composer.pass(this.fboX, this.shader);

        this.shader.uniforms.uTexture = this.fboX.colors;
        this.shader.uniforms.uResolution = [this.composer.width, this.composer.height];
        this.shader.uniforms.uDelta = [0, this.uAmount];
        this.composer.pass(this.fboY, this.shader);

        cb(this.fboY.colors);
    }
}
