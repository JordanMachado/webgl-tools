import G from '../';
const glslify = require('glslify');


export default class Pingpong {
  constructor({
    data,
    width,
    height,
    renderer,
    camera,
    fs,
    vs,
    uniforms
  }) {
    this.renderer = renderer;
    this.camera = camera;
    this.uniforms = uniforms;
    this.uniforms.uTime = 0;
    this.uniforms.uTexture = data;
    this.uniforms.uOrigin = data;
    this.quad = new G.Mesh(
      new G.Geometry(G.Primitive.quad(1, 1)),
      new G.Shader(
        vs,
        fs,
        this.uniforms,
        'Simulation'
      ));

    this.fboIn = new G.FrameBuffer(gl, width, height);
    this.fboOut = new G.FrameBuffer(gl, width, height);
    this.fboOutO = this.fboOut;

    // this.fboDebug = new G.Mesh(
    //   new G.Geometry(G.Primitive.quad(0.3, 0.3)),
    //   new G.Shader(
    //     glslify('./shaders/debug.vert'),
    //     glslify('./shaders/texture.frag'), {
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

      this.width = width;
      this.height = height;


      this.time = 0;
  }
  update() {
    this.time += 0.01;
    this.quad.shader.uniforms.uTime = this.time
    this.quad.shader.uniforms.width = this.width
    this.quad.shader.uniforms.height = this.height
    // this.renderer.render(this.fboDebug, this.camera)


    this.fboOut.bind()
    this.quad.shader.uniforms.uTexture = this.fboIn.colors;
    this.quad.shader.uniforms.uTextureOld = this.fboOut.colors;
      this.renderer.render(this.quad,this.camera);
    this.fboOut.unbind()

    let temp = this.fboIn;
     this.fboIn = this.fboOut;
     this.fboOut = temp;


  }

}
