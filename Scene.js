import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    // this.webgl.clearColor(0.1, 0.1, 0.1,1)
    this.webgl.clearColor(1, 1, 1,1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.camera.lookAt([0,0,5],[0,0,0])
    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);
    this.controls.lock(true)
    window.controls = this.controls;
    const primitive = new G.Primitive.sphere();
    // const primitive = new G.Primitive.plane(1,1,10,1);
    this.time = 0;
    this.matcap = new G.Texture(gl);
    this.matcap.upload(window.assets['matcap3']);
    this.mesh = new G.Mesh(
      new G.Geometry(primitive),
      new G.Shader(
        glslify('./shader/matcap.vert'),
        glslify('./shader/matcap.frag'), {
          uTime: this.time,
          uTexture: this.matcap

        }
    ));
    this.mesh.y = 1;

    this.fbo = new G.FrameBuffer(gl, window.innerWidth,window.innerHeight, { depth: true });
    this.fboDebug = new G.Mesh(
      new G.Geometry(G.Primitive.quad(0.5,0.5)),
      new G.Shader(
        glslify('./shader/debug.vert'),
        glslify('./shader/texture.frag'),{
          uTexture: this.fbo.colors
        }
    ));
    this.fboDebug.x = -0.5;
    this.fboDebug.y = 0.5;


    this.floor = new G.Mesh(
      new G.Geometry(G.Primitive.plane(40, 40, 20, 20)),
      new G.Shader(
        glslify('./shader/floor.vert'),
        glslify('./shader/floor.frag'),
        {
          uReflection: this.fbo.colors,
          uTime: this.time,
        }
    ));
    // this.floor.drawType = gl.POINTS;

    this.floor.rx = -Math.PI/180 * 80;
    this.floor.y = -1.5;

    this.bg = new G.Mesh(
      new G.Geometry(G.Primitive.quad(1,1)),
      new G.Shader(
        glslify('./shader/bg.vert'),
        glslify('./shader/bg.frag'),
    ));



  }
  render() {
    this.time += 0.01;
    this.mesh.x = Math.cos(this.time) * 0.1
    this.mesh.y = 1+Math.sin(this.time) * 0.5
    this.mesh.shader.uniforms.uTime = this.time * 0.8;
    this.floor.shader.uniforms.uTime = this.time * 0.8;
    this.webgl.clear();
    G.State.enable(gl.DEPTH_TEST)
    this.fbo.bind();
      this.fbo.clear();
      // console.log(this.controls.rx);
      this.camera.lookAt([0, -7, -5], [0,0,0])
      this.webgl.render(this.mesh, this.camera);
    this.fbo.unbind();

    this.controls.update();



    G.State.disable(gl.DEPTH_TEST);
    this.webgl.render(this.bg, this.camera);

    G.State.enable(gl.DEPTH_TEST)
    this.webgl.render(this.mesh, this.camera);
    this.webgl.render(this.floor, this.camera);

    // G.State.disable(gl.DEPTH_TEST);
    // this.webgl.render(this.fboDebug, this.camera);




  }
  resize() {
    this.camera.aspect = window.innerWidth/ window.innerHeight;
    this.webgl.resize();
  }
}
