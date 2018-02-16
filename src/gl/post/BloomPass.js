import Shader from '../high/Shader';
import FrameBuffer from '../core/FrameBuffer';
import FullBoxBlurPass from './FullBoxBlurPass';
import BlendPass from './BlendPass';
const glslify = require('glslify');

var BlendMode = {
	Normal: 1,
	Dissolve: 2,
	Darken: 3,
	Multiply: 4,
	ColorBurn: 5,
	LinearBurn: 6,
	DarkerColor: 7,
	Lighten: 8,
	Screen: 9,
	ColorDodge: 10,
	LinearDodge: 11,
	LighterColor: 12,
	Overlay: 13,
	SoftLight: 14,
	HardLight: 15,
	VividLight: 16,
	LinearLight: 17,
	PinLight: 18,
	HardMix: 19,
	Difference: 20,
	Exclusion: 21,
	Substract: 22,
	Divide: 23
};


export default class Pass {
  constructor(config = {}) {
		this.amount = config.amount || 2;
  }
  initialize(composer) {
    if(!this.fbo) {
      this.fbo = new FrameBuffer(gl, composer.width, composer.height);
    }
    this.composer = composer;

    this.fullBoxBlurPass = new FullBoxBlurPass({
			uAmount:this.amount
		});
    this.fullBoxBlurPass.initialize(composer);

    this.blendPass = new BlendPass();
    this.blendPass.initialize(composer);
  }
  process(inputTexture, cb) {
    let touput;
    this.fullBoxBlurPass.process(inputTexture, (ouput) =>{
      touput = ouput;
    });

    this.blendPass.shader.uniforms.mode = 9;
    this.blendPass.shader.uniforms.resolution = [this.composer.width,this.composer.height];
    this.blendPass.shader.uniforms.resolution2 = [this.composer.width,this.composer.height];
    this.blendPass.shader.uniforms.tInput2 = inputTexture;
    this.blendPass.process(touput, (ouput) =>{
      cb(ouput)

    })
    // this.shader.uniforms.uTexture = inputTexture;
    // this.composer.pass(this.fbo, this.shader);
  }
}
