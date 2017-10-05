import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    this.webgl.clearColor(0.1, 0.1, 0.1,1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.lookAt([0,0,5],[0,0,0])
    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);

    const primitive = new G.Primitive.sphere();
    this.time = 0;

    this.mesh = new G.Mesh(
      new G.Geometry(primitive),
      new G.Shader(
        glslify('./shader/sphere.vert'),
        glslify('./shader/sphere.frag'), {
          uTime: this.time,

        }
    ));

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
      new G.Geometry(G.Primitive.quad(5,5)),
      new G.Shader(
        glslify('./shader/floor.vert'),
        glslify('./shader/floor.frag'),
        {
          uReflection: this.fbo.colors,
          uTime: this.time,
        }
    ));
    this.floor.rx = -Math.PI/180 * 80;
    this.floor.y = -2;


  }
  render() {
    this.time += 0.01;
    this.mesh.shader.uniforms.uTime = this.time;
    this.floor.shader.uniforms.uTime = this.time;
    this.webgl.clear();
    G.State.enable(gl.DEPTH_TEST)
    this.fbo.bind();
      this.fbo.clear();
      this.camera.lookAt([0, -5, 5], [0,0,0])
      this.webgl.render(this.mesh, this.camera);
    this.fbo.unbind();

    this.controls.update();



    // G.State.disable(gl.DEPTH_TEST);
    // this.webgl.render(this.fboDebug, this.camera);

    G.State.enable(gl.DEPTH_TEST)
    this.webgl.render(this.mesh, this.camera);
    this.webgl.render(this.floor, this.camera);




  }
  resize() {
    this.camera.aspect = window.innerWidth/ window.innerHeight;
    this.webgl.resize();
  }
}
