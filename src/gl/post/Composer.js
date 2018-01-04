import Mesh from '../high/Mesh';
import Geometry from '../high/Geometry';
import Shader from '../high/Shader';
import Primitive from '../high/Primitive';
import FrameBuffer from '../core/FrameBuffer';
const glslify = require('glslify');

export default class Composer {
  constructor(renderer, width, height) {
    this.renderer = renderer;
    this.passes = [];

    this.shader = new Shader(glslify('./shaders/default.vert'),glslify('./shaders/default.frag'))
    this.geo = new Geometry(Primitive.bigTriangle(1, 1))
    this.mesh = new Mesh(this.geo, this.shader);
    this.setSize(width, height);

  }
  add(pass) {
    this.passes.push(pass);
  }
  render(scene, camera) {
    // render the scene in the fboIn
    this.fboIn.bind();
      this.fboIn.clear();
      this.renderer.render(scene, camera);
    this.fboIn.unbind();
    // apply passes
    this.passes.forEach( pass => {
      if(pass.enable) {
        this.fboOut.bind();
          this.fboOut.clear();
          pass.uniforms.uTexture = this.fboIn.colors;
          pass.uniforms.uTime += 0.0025;
          this.mesh.shader = pass;
          this.renderer.render(this.mesh, camera);
        this.fboOut.unbind();
        this.swap();
      }
      this.outputTexture = this.fboIn.colors;
    });

  }
  toScreen() {
    this.mesh.shader = this.shader;
    this.shader.uniforms.uTexture = this.outputTexture;
    this.renderer.render(this.mesh)
  }
  swap() {
    const tmp = this.fboIn;
    this.fboIn = this.fboOut;
    this.fboOut = tmp;
  }
  setSize(width, height) {
    this.fboIn = new FrameBuffer(gl, width, height, { depth: true});
    this.fboOut = new FrameBuffer(gl, width, height, { depth: true});
    this.outputTexture = this.fboIn.colors;

  }
}
