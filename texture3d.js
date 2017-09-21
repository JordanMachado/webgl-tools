import createWebgl from './tools/webgl';
import Program from './tools/program';
import Debug from './tools/Debug';
import ArrayBuffer from './tools/ArrayBuffer';
import IndexBuffer from './tools/IndexBuffer';
import PerspectiveCamera from './tools/PerspectiveCamera';
import Object3D from './tools/Object3D';
import {Texture} from './tools/Texture';
import Texture3D from './tools/Texture3D';
import Loader from './tools/Loader';
import ObjParser from './tools/ObjParser';
import FBO from './tools/FBO';
import raf from 'raf';
import glm from 'gl-matrix';
import gsap from 'gsap/TweenLite';
import simplex from 'simplex-noise'


import ArrayUtils from './tools/ArrayUtils'
import OrbitalCameraControl from 'orbital-camera-control';
const glslify = require('glslify');

Debug.verbose = true;

const webgl = new createWebgl({
  type: 'webgl2',
  contextOptions:  {
  premultipliedAlpha: false
}
});

const gl = window.gl = webgl.context;

webgl.append();
webgl.clearColor(4/255,4/255,4/255,1);
// webgl.clearColor(0.90,0.90,0.90,1);

const camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 300)
camera.z = -1;

var controller = new OrbitalCameraControl(camera.matrix, 1, webgl.canvas);

var simplexN = new simplex(Math.random);
// const image = new Image();
// image.onload = () =>{
//   console.log('cc');
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d');
//   canvas.width = image.width;
//   canvas.height = image.height;
// }
// image.src = 'bonsai.raw.png'
var SIZE = 128;

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d');
canvas.width = SIZE;
canvas.height = SIZE;
    ctx.fillStyle = 	'#' + (Math.random()*0xffffff).toString(16);
    ctx.fillStyle = 	'#' + (0xffffff * 0.1).toString(16);

ctx.fillRect(10,10,10,10);
for (var i = 0; i < SIZE; i++) {
  for (var j = 0; j < SIZE; j++) {

    let c = simplexN.noise2D(i/40, j/40) * 255;

    // console.log(c);
    ctx.fillStyle = 'hsl(' + c  + ', 50%, 50%)';

    // ctx.fillStyle = 	Math.random();

    ctx.fillRect(i,j,1,1);
    // simplexN.noise2D(k, j) * 255* Math.random();
  }

}
// document.body.appendChild(canvas)
const scale = 0.035;
let count = 0;
      var data = new Uint8Array(SIZE * SIZE * SIZE);
      for (var k = 0; k < SIZE; ++k) {
          for (var j = 0; j < SIZE; ++j) {
              for (var i = 0; i < SIZE; ++i) {
                // for (var l = 0; l < 3; l++) {
                  // var value3d = simplexN.noise3D(i, j, k) * 255;
                  // data[count * 3 + 0] =  value3d;
                  // data[count * 3 + 1] =  value3d;
                  // data[count * 3 + 2] =  value3d;
                  // count ++


                  data[i + j * SIZE + k * SIZE * SIZE] = simplexN.noise3D(i * 0.04, j * 0.04, k * 0.01) * 255;

                // }
              }
          }
      }


      // var data = new Uint8Array(SIZE * SIZE * SIZE * 3);
      //   let count = 0;
      //
      //       for (var k = 0; k < SIZE * SIZE * SIZE * 3; k+=3) {
      //         var n = simplexN.noise2D(k,k/2)
      //         data[count * 3 + 0] = n * 255;
      //         data[count * 3 + 1] = n * 255;
      //         data[count * 3 + 2] =n * 255;
      //         count++;
      //
      //       }

const texture3d = new Texture3D(gl);
texture3d.uploadData(data, SIZE, SIZE, SIZE);
console.log('Texture3D', texture3d.width, texture3d.height, texture3d.depth, texture3d.internalformat,
texture3d.format, texture3d.type, texture3d.minFilter,texture3d.magFilter,texture3d.wrapS,texture3d.wrapT );



const square = new Object3D();



const uvs = new ArrayBuffer({
  context: gl,
  data: [
    // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
  ],
});


let vertices = [    // Front face
   -1.0, -1.0, 1.0,
   1.0, -1.0, 1.0,
   1.0, 1.0, 1.0,
   -1.0, 1.0, 1.0,

   // Back face
   -1.0, -1.0, -1.0,
   -1.0, 1.0, -1.0,
   1.0, 1.0, -1.0,
   1.0, -1.0, -1.0,

   // Top face
   -1.0, 1.0, -1.0,
   -1.0, 1.0, 1.0,
   1.0, 1.0, 1.0,
   1.0, 1.0, -1.0,

   // Bottom face
   -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0, 1.0,
   -1.0, -1.0, 1.0,

   // Right face
   1.0, -1.0, -1.0,
   1.0, 1.0, -1.0,
   1.0, 1.0, 1.0,
   1.0, -1.0, 1.0,

   // Left face
   -1.0, -1.0, -1.0,
   -1.0, -1.0, 1.0,
   -1.0, 1.0, 1.0,
   -1.0, 1.0, -1.0,]
   const width = 0.1;
   const height = 0.1;
   const depth = 0.1;
   for (let i = 0; i < vertices.length; i += 3) {
     vertices[i] *= width;
     vertices[i + 1] *= height;
     vertices[i + 2] *= depth;
   }
const positions = new ArrayBuffer({
  context: gl,
  data: vertices,
});


const indicesSquare = new IndexBuffer({
  context: gl,
  data:  [
   0, 1, 2, 0, 2, 3,    // front
   4, 5, 6, 4, 6, 7,    // back
   8, 9, 10, 8, 10, 11,   // top
   12, 13, 14, 12, 14, 15,   // bottom
   16, 17, 18, 16, 18, 19,   // right
   20, 21, 22, 20, 22, 23,    // left
  ],
});



const program = window.program = new Program({
  context: gl,
  vertexShader: glslify('./shader/3d/base.vert'),
  fragmentShader: glslify('./shader/3d/base.frag'),
});

program.bind();
texture3d.bind();
program.uniforms.projectionMatrix = camera.projection;
program.uniforms.viewMatrix = camera.matrix;

uvs.attribPointer(program.attributes.uv);
positions.attribPointer(program.attributes.position);


const loader = new Loader(gl);
loader.load('fire.png', (text) => {
  render();
});

let time = 0;
let inverse = glm.mat4.create();
function render() {
  raf(render);
  time += 0.002;
  // square.rz = time;
  // square.ry = time;
  // canvas.width = canvas.width
  // for (var i = 0; i < SIZE; i++) {
  //   for (var j = 0; j < SIZE; j++) {
  //
  //     let c = simplexN.noise3D(i/120, j/12 , (time* 100)) * 255;
  //     // console.log(c);
  //     ctx.fillStyle = 'hsl(' + c * Math.random() + ', 50%, 50%)';
  //
  //     // ctx.fillStyle = 	Math.random();
  //
  //     ctx.fillRect(i,j,1,1);
  //     // simplexN.noise3D(k, j, i) * 255* Math.random();
  //   }
  // }

  controller.update();

  glm.mat4.multiply(inverse, camera.projection, camera.matrix);
  glm.mat4.invert(inverse, inverse);

  webgl.clear();
  // gl.enable(gl.CULL_FACE);
  // gl.enable(gl.DEPTH_TEST);

  gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.blendFunc(gl.ONE, gl.SRC_ALPHA);
  program.uniforms.worldMatrix = square.matrix;
  program.uniforms.invertMat = inverse;
  program.uniforms.time = time;

  program.uniforms.viewMatrix = camera.matrix;

  indicesSquare.bind();
  indicesSquare.draw(gl.TRIANGLES);


}


window.addEventListener('resize',()=> {
  webgl.resize();
  camera.aspect = window.innerWidth/window.innerHeight;
  program.bind();
  program.uniforms.projectionMatrix = camera.projection;
  // viewPort = gl.getParameter(gl.VIEWPORT);
});
