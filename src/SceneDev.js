import G from './gl';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

import OrbitalCameraControl from 'orbital-camera-control';
import Query from './dev/Query';
import SuperConfig from './dev/SuperConfig';

import Screenshot from './dev/Screenshot';
import PingPong from './gl/utils/PingPong';
import { mat4, mat3 } from 'gl-matrix';


if(Query.verbose) {
  G.debug.verbose = true;
}

export default class Scene {
  constructor() {
    window.scene = this;
    this.webgl = new G.Webgl();
    this.time = 0
    this.bgC = '#000000';
    this.webgl.clearColor(this.bgC, 1);
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.lookAt([0,0,100],[0,0,0])

    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);

    if(Query.debug) {
      this.screenshot = new Screenshot(this);
    }
    // this.composer = new G.Composer(this.webgl, window.innerWidth, window.innerHeight);
    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

    this.fxaa = new G.FXAAPass({
      uResolution: [window.innerWidth * 2, window.innerHeight * 2]
    });
    this.composer.add(this.fxaa)

    //
    this.toon = new G.ToonPass({
      uResolution: [window.innerWidth * 2, window.innerHeight * 2]
    });
    this.composer.add(this.toon)
    this.invert = new G.InvertPass();
    // this.composer.add(this.invert)

    this.noise = new G.NoisePass();
    // this.composer.add(this.noise)
    const primitive = G.Primitive.sphere();
    const geo = new G.Geometry(primitive);
    const mat = new G.Shader(
    glslify('./shaders/base.vert'),
    glslify('./shaders/base.frag'),
    {})
    this.mesh = new G.Mesh(geo, mat);
    this.mesh.scale.set(SuperConfig.config.size)

    this.fboHelper = new G.FBOHelper(this.webgl);
    console.log(this.fboHelper);

    this.fboHelper.attach(this.composer.fboIn.colors);
    this.fboHelper.attach(this.composer.fboIn.colors);
    this.fboHelper.attach(this.composer.fboIn.colors);
    this.fboHelper.attach(this.composer.fboIn.colors);
    this.fboHelper.attach(this.composer.fboIn.colors);
    this.fboHelper.attach(this.composer.fboIn.colors);


    let s = 256;

    this.webgl.gl.viewport(0, 0, s, s);


  }

  render() {
    this.time += 0.05;
    this.frame++;
    this.controls.update();
    this.noise.uniforms.uAmount = Math.cos(this.time)

    this.webgl.clear();
    G.State.enable(gl.DEPTH_TEST);
    if(Query.config.postPro) {
      this.composer.render(this.mesh, this.camera);
      this.composer.toScreen();
    } else {
      this.webgl.render(this.mesh, this.camera);
    }
    G.State.disable(gl.DEPTH_TEST);
    this.fboHelper.render();



  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
