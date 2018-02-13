import Mesh from '../high/Mesh';
import Geometry from '../high/Geometry';
import Shader from '../high/Shader';
import Primitive from '../high/Primitive';
import FrameBuffer from '../core/FrameBuffer';
import FBOHelper from '../utils/FBOHelper';
const glslify = require('glslify');

export default class Composer {
  constructor(renderer, width, height) {
    this.renderer = renderer;
    this.passes = [];
    this.helper = new FBOHelper(renderer);

    this.shader = new Shader(glslify('./shaders/default.vert'),glslify('./shaders/default.frag'))
    this.geo = new Geometry(Primitive.bigTriangle(1, 1))
    this.bigTriangle = new Mesh(this.geo, this.shader);
    this.setSize(width, height);

  }
  add(pass) {
    this.passes.push(pass);
  }
  render(scene, camera) {
    this.camera = camera;
    this.fboIn.bind();
      this.fboIn.clear();
      this.renderer.render(scene, camera);
    this.fboIn.unbind();

    this.outputTexture = this.fboIn.colors;
    this.outputTextureDepth = this.fboIn.depth;
    let count = 0;

    this.passes.forEach( pass => {
      pass.process(this,(ouput)=>{
        this.outputTexture = ouput;
        count++;
        this.helper.renderImediate(ouput,count)

      });
    });
  }
  toScreen() {
    this.bigTriangle.shader = this.shader;
    this.shader.uniforms.uTexture = this.outputTexture;
    this.renderer.render(this.bigTriangle)
  }
  swap() {
    const tmp = this.fboIn;
    this.fboIn = this.fboOut;
    this.fboOut = tmp;
  }
  setSize(width, height) {
    this.fboIn = new FrameBuffer(gl, width, height, { depth: true});
    this.fboOut = new FrameBuffer(gl, width, height, { depth: true});
    this.width = width;
    this.height = height;
    this.outputTexture = this.fboIn.colors;

  }
}
