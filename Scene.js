import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    this.webgl.clearColor(1,1,1,1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.lookAt([0,0,5],[0,0,0])
    this.controls = new OrbitalCameraControl(this.camera.view, 5, window);

    const primitive = new G.Primitive.sphere();

    this.mesh = new G.Mesh(
      new G.Geometry(primitive),
      new G.Shader(
        glslify('./shader/base.vert'),
        glslify('./shader/base.frag'),
    ));

  }
  render() {
    this.controls.update();
    G.State.enable(gl.DEPTH_TEST)
    // this.webgl.render(this.mesh, this.camera);
  }
  resize() {
    this.camera.aspect = window.innerWidth/ window.innerHeight;
    this.webgl.resize();
  }
}
