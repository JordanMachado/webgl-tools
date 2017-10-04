import * as Vanilla from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

export default class Scene {
  constructor() {

    this.webgl = new Vanilla.Webgl();
    this.webgl.clearColor(1,1,1,1)
    this.webgl.append();

    this.camera = new Vanilla.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.lookAt([0,0,5],[0,0,0])
    this.controls = new OrbitalCameraControl(this.camera.view, 5, window);

    const primitive = new Vanilla.Primitive.sphere();

    this.mesh = new Vanilla.Mesh(
      new Vanilla.Geometry(primitive),
      new Vanilla.Shader(
        glslify('./shader/base.vert'),
        glslify('./shader/base.frag'),
    ));

    this.mesh2 = new Vanilla.Mesh(
      new Vanilla.Geometry(primitive),
      new Vanilla.Shader(
        glslify('./shader/base.vert'),
        glslify('./shader/base.frag'),
    ));
    this.mesh2.x = 0.5;
    this.mesh.addChild(this.mesh2)

  }
  render() {
    this.controls.update();
    Vanilla.State.enable(gl.DEPTH_TEST)
    this.webgl.render(this.mesh, this.camera);
  }
  resize() {
    this.camera.aspect = window.innerWidth/ window.innerHeight;
    this.webgl.resize();
  }
}
