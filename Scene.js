import * as Vanilla from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

export default class Scene {
  constructor() {

    this.webgl = new Vanilla.Webgl();
    this.webgl.append();

    this.camera = new Vanilla.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.controls = new OrbitalCameraControl(this.camera.view, 5, window);

    const primitive = new Vanilla.Primitive.sphere();

    this.hdrText = new Vanilla.Texture(gl);
    this.hdrText.upload(window.assets['hdr'])
    this.mesh = new Vanilla.Mesh(
      new Vanilla.Geometry(primitive),
      new Vanilla.Shader(
        glslify('./shader/base.vert'),
        glslify('./shader/base.frag'),
        {

        }
    ));
    this.fbo = new Vanilla.FrameBuffer(gl, window.innerWidth, window.innerHeight, { depth:true })
    this.fboHDR = new Vanilla.FrameBuffer(gl, window.innerWidth, window.innerHeight, { depth:true })
    this.fboA = new Vanilla.FrameBuffer(gl, window.innerWidth, window.innerHeight, { depth:true })
    this.fboB = new Vanilla.FrameBuffer(gl, window.innerWidth, window.innerHeight, { depth:true })

    this.blurryPass = new Vanilla.Mesh(
      new Vanilla.Geometry(new Vanilla.Primitive.quad()),
      new Vanilla.Shader(
        glslify('./shader/post.vert'),
        glslify('./shader/blur.frag'),
        {
          uTexture: this.fboB.colors,
          resolution: [window.innerWidth/5, window.innerHeight/5]
        }
    ));

    this.hdrPass = new Vanilla.Mesh(
      new Vanilla.Geometry(new Vanilla.Primitive.quad()),
      new Vanilla.Shader(
        glslify('./shader/post.vert'),
        glslify('./shader/hdr.frag'),
        {
          uTexture: this.fbo.colors,
          resolution: [window.innerWidth/5, window.innerHeight/5]
        }
    ));


    this.final = new Vanilla.Mesh(
      new Vanilla.Geometry(new Vanilla.Primitive.quad()),
      new Vanilla.Shader(
        glslify('./shader/post.vert'),
        glslify('./shader/post.frag'),
        {
          scene: this.fbo.colors,
          bloomBlur: this.fboB.colors,
        }
    ));
  }
  render() {
    this.controls.update();

    var writeBuffer = this.fboA
    var readBuffer = this.fboB

    this.webgl.clear();
    // this.mesh.y -= 0.01;

    // classique scene
    this.fbo.bind();
      this.fbo.clear();
      gl.enable(gl.DEPTH_TEST);
      this.webgl.render(this.mesh, this.camera);
    this.fbo.unbind();

    this.hdrPass.shader.uniforms.uTexture = this.fbo.colors;
    //
    this.fboHDR.bind();
      this.fboHDR.clear();
      gl.enable(gl.DEPTH_TEST);
      this.webgl.render(this.hdrPass, this.camera);
    this.fboHDR.unbind();


    gl.disable(gl.DEPTH_TEST);
    // blurry scene
    for (var i = 0; i < 8; i++) {
      writeBuffer.bind()
      if(i===0) {
          this.blurryPass.shader.uniforms.uTexture = this.fboHDR.colors;
      } else {
        this.blurryPass.shader.uniforms.uTexture = readBuffer.colors;
        readBuffer.colors.bind()
      }
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.blurryPass.shader.uniforms.direction = i % 2 === 0 ? [3, 0] : [0, 3]
      this.webgl.render(this.blurryPass, this.camera);

      writeBuffer.unbind()

      var t = writeBuffer
      writeBuffer = readBuffer
      readBuffer = t;
    }

    gl.bindTexture(gl.TEXTURE_2D, null);
    // console.log(this.fboHDR.colors.id);
    // console.log(this.fbo.colors.id);
    this.final.shader.uniforms.scene = this.fbo.colors;
    this.final.shader.uniforms.bloomBlur = this.fboB.colors;


    this.webgl.render(this.final, this.camera);
    // this.final.shader.uniforms.scene = this.fboB.colors;

  }
}
