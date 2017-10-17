import G from './tools';
const glslify = require('glslify');


export default class Pingpong {
  constructor(width, height, renderer, camera, startData) {
    this.renderer = renderer;
    this.camera = camera;
    this.quad = new G.Mesh(
      new G.Geometry(G.Primitive.quad(1, 1)),
      new G.Shader(
        glslify('./shader/particles/base.vert'),
        glslify('./shader/particles/sim.frag'), {
          uTexture: startData,
          uOrigin: startData,
          uTime: 0
        },
        'Simulation'
      ));

    this.fboIn = new G.FrameBuffer(gl, width, height);
    this.fboOut = new G.FrameBuffer(gl, width, height);
    this.fboOutO = this.fboOut;

    // this.fboDebug = new G.Mesh(
    //   new G.Geometry(G.Primitive.quad(0.3, 0.3)),
    //   new G.Shader(
    //     glslify('./shader/debug.vert'),
    //     glslify('./shader/texture.frag'), {
    //       uTexture: this.fboOut.colors
    //     }
    //   ));
    //   this.fboDebug.x = -0.7;
    //   this.fboDebug.y = -0.7;

      this.fboIn.bind();
        this.renderer.render(this.quad,this.camera);
      this.fboIn.unbind();
      //
      this.fboOut.bind();
        this.renderer.render(this.quad,this.camera);
      this.fboOut.unbind();


      this.time = 0;
  }
  update() {
    this.time += 0.01;
    this.quad.shader.uniforms.uTime = this.time
    // this.renderer.render(this.fboDebug, this.camera)

    let temp = this.fboIn;
     this.fboIn = this.fboOut;
     this.fboOut = temp;

    this.fboOut.bind()
    this.quad.shader.uniforms.uTexture = this.fboIn.colors;
      this.renderer.render(this.quad,this.camera);
    this.fboOut.unbind()



  }

}
