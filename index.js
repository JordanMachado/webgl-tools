import createWebgl from './tools/core/webgl';
import Program from './tools/core/program';
import Debug from './tools/utils/Debug';
import PerspectiveCamera from './tools/camera/PerspectiveCamera';
import OrthographicCamera from './tools/camera/OrthographicCamera';
import Object3D from './tools/core/Object3D';
import Loader from './tools/Loader';
import ArrayUtils from './tools/utils/ArrayUtils';
import raf from 'raf';
import glm from 'gl-matrix';
import gsap from 'gsap/TweenMax';
import OrbitalCameraControl from 'orbital-camera-control';
const glslify = require('glslify');
import gradients from './gradients';
import Cube from './Cube';
import ArrayBuffer from './tools/core/ArrayBuffer';

Debug.verbose = true;
window.addEventListener('resize', onResize)

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : null;
}

const webgl = new createWebgl({
  width: window.innerWidth,
  height: window.innerHeight,

});

// const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
const s = 5;

const scale = .01;
const w = window.innerWidth/2 * scale;
const h = window.innerHeight/2 * scale;
const camera = new OrthographicCamera(-w, w, h, -h, 0.1, 1000);
window.camera = camera;
camera.lookAt([0,0,50], [0,0,0])
const controls = new OrbitalCameraControl(camera.view, 50, window)
window.controls = controls;
controls.lock(1)
const gl = window.gl = webgl.context;

webgl.append();

const program = new Program({
  context: gl,
  vertexShader: glslify('./cube.vert'),
  fragmentShader: glslify('./cube.frag'),
  name: 'Basic',
});

const cube = new Cube();

const width = 16;
const height = 16;

let dataPos = new Float32Array(width * height * 4);
let count = 0;

for ( var i = 0; i < width * height; i++ ) {
  var i4 = i * 4;
  dataPos[ i4 ] =  ( ( i % width ) / width  -.5 ) * width;
  dataPos[ i4 + 1] = ( Math.floor( i / width ) / height -.5 ) * height;
  dataPos[ i4 +  2] = 0;

  if(i%2 === 0) {
    dataPos[ i4 + 2] += 1;
  }
  if( dataPos[ i4 + 1]%2 === 0) {
    dataPos[ i4 + 2] -= 1.5;
  }

}


const particlesOffset = new ArrayBuffer({
  context: gl,
  data: dataPos,
});

const ext = gl.getExtension("ANGLE_instanced_arrays");
let sheme = gradients[Math.floor(Math.random() * gradients.length)];
let color0 = hexToRgb(sheme.colors[0]);
let color1 = hexToRgb(sheme.colors[1]);
webgl.clearColor(color0[0]+0.01,color0[1]+0.01,color0[2]+0.01,1)
let time = 0;
TweenMax.to(controls, 1, {
  _rx: 0.4,
  _ry: 0.6,
  repeatDelay: 3,
  repeat: -1,
  ease: Quad.easeOut
})
TweenMax.to(cube, 1, {
  rz: Math.PI/180 * 90,
  repeatDelay: 3,
  repeat: -1,
  ease: Sine.easeInOut
})
render();

function render() {
  raf(render);
  controls.update();
  gl.enable(gl.DEPTH_TEST);
  webgl.clear();
  program.bind();
  // cube.rz += 0.001;
  program.uniforms.worldMatrix = cube.matrix;
  program.uniforms.viewMatrix = camera.view;
  program.uniforms.color0 = color0;
  program.uniforms.color1 = color1;
  program.uniforms.projectionMatrix = camera.projection;
  ext.vertexAttribDivisorANGLE(program.attributes.offset.location, 0);
  particlesOffset.attribPointerInstanced(program.attributes.offset, 1);

  cube.positions.attribPointer(program.attributes.aPosition);
  cube.uvs.attribPointer(program.attributes.aUv);
  cube.normals.attribPointer(program.attributes.aNormal);
  cube.indices.bind();

  cube.indices.drawInstance(gl.TRIANGLES, particlesOffset.length);




  time += 0.0025;

}

function onResize() {
  webgl.resize();


  const scale = .01;
  const w = window.innerWidth/2 * scale;
  const h = window.innerHeight/2 * scale;

  camera.left = -w;
  camera.right = w;
  camera.bottom = h;
  camera.top = -h;
  camera.updateProjectionMatrix()
  program.bind();
  //
  program.uniforms.projectionMatrix = camera.projection;

}
