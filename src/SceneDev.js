import G from './tools';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

import OrbitalCameraControl from 'orbital-camera-control';
import Query from './Query';
import Screenshot from './dev/Screenshot';
import PingPong from './PingPong';
import { mat4, mat3 } from 'gl-matrix';

if(!Query.verbose) {
  G.debug.verbose = false;
}

export default class Scene {
  constructor() {
    window.scene = this;
    this.webgl = new G.Webgl();

    this.bgC = '#000000';
    this.webgl.clearColor(this.bgC, 1);
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.lookAt([0,0,100],[0,0,0])

    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);



    if(Query.debug) {
      this.screenshot = new Screenshot(this);
    }

    const primitive = G.Primitive.cube(0.5,0.5,0.5);

    this.mesh = new G.Mesh(
      new G.Geometry(primitive),
      new G.Shader(
      glslify('./shaders/base.vert'),
      glslify('./shaders/base.frag'),
      {}
    ));
  }
  render() {
    this.time += 0.1;
    this.frame++;
    this.controls.update();
    this.webgl.clear();
    this.webgl.render(this.mesh, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
