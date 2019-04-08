import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';

const glslify = require('glslify');

export default class BoxBlur
{
    constructor(config = {})
    {
        const uniforms = {};

        uniforms.uDelta = config.uDelta || [0, 0];

        this.shader = new Shader(glslify('./shaders/boxBlur.vert'), glslify('./shaders/boxBlur.frag'), uniforms, 'BoxBlurPass');
        this.enable = true;
        this.fbo = null;
    }
    process(composer, cb)
    {
        if (!this.fbo)
        {
            this.fbo = new FrameBuffer(gl, composer.width, composer.height);
        }
        this.fbo.bind();
        this.shader.uniforms.uTexture = composer.outputTexture;
        this.shader.uniforms.uResolution = [composer.width, composer.height];
        composer.bigTriangle.shader = this.shader;
        composer.renderer.render(composer.bigTriangle, composer.camera);
        this.fbo.unbind();
        cb(this.fbo.colors);
    }
}
