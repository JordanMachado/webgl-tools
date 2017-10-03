import * as Vanilla from './tools';
import Geometry from './tools/high/Geometry';
import Mesh from './tools/high/Mesh';
import Shader from './tools/high/Shader';
import Sphere from 'primitive-sphere';
import OrbitalCameraControl from 'orbital-camera-control';
const glslify = require('glslify');

import raf from 'raf';



let webgl = new Vanilla.Webgl();
webgl.append();

const camera = new Vanilla.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.lookAt([0,0,10], [0,0,0])
const controls = new OrbitalCameraControl(camera.view, 5, window)

const primitive = new Sphere(1, {
  segments: 16
});

let mesh = new Mesh(
  new Geometry(primitive),
  new Shader(
    glslify('./shader/base.vert'),
    glslify('./shader/base.frag'),
    {
      time: 0
    }
));

render();


let time = 0;
function render() {
  raf(render);

  controls.update();

  time += 0.01;
  webgl.clear();
  gl.enable(gl.DEPTH_TEST);

  mesh.shader.uniforms.time = Math.cos(time);
  webgl.render(mesh, camera);

}
