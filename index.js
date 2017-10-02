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
import IndexBuffer from './tools/core/IndexBuffer';
import Texture from './tools/core/Texture';
import FBO from './tools/core/FrameBuffer';


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

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
window.camera = camera;
camera.lookAt([0,0,50], [0,0,0])
const controls = new OrbitalCameraControl(camera.view, 50, window)
window.controls = controls;
const gl = window.gl = webgl.context;

webgl.append();

const program = new Program({
  context: gl,
  vertexShader: glslify('./shader/cube.vert'),
  fragmentShader: glslify('./shader/cube.frag'),
  name: 'Basic',
});

const cube = new Cube();

const width = 8;
const height = 8;


let fboIn = new FBO(gl, width, height, {depth:true});
let fboOut = new FBO(gl, width, height,{depth:true});

let dataPos = new Float32Array(width * height * 4);
let uvs = new Float32Array(width * height * 2);

let count = 0;

for ( var i = 0; i < width * height; i++ ) {
  var i2 = i * 2;
  var i4 = i * 4;
  dataPos[ i4 ] =  (i % width) / width;

  dataPos[ i4 + 1] = ( Math.floor( i / width ) / height -.5 ) * height;
  dataPos[ i4 +  2] = 0;
  dataPos[ i4 +  3] = 0;



  uvs[i2 + 0] = (i % width) / width;
  uvs[i2 + 1] = Math.floor(i / width) / height;

}
console.log(dataPos);

const dataText = new Texture(gl);
dataText.format = gl.RGBA;
dataText.uploadData(dataPos, width, height);
dataText.minFilter = gl.NEAREST;
dataText.magFilter = gl.NEAREST;
dataText.wrapS = gl.REPEAT;
dataText.wrapT = gl.REPEAT;


const squareUvs = new ArrayBuffer({
  context: gl,
  data: [
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  ],
});

const squarePositions = new ArrayBuffer({
  context: gl,
  data: [
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
  ],
});

const indicesSquare = new IndexBuffer({
  context: gl,
  data: [ 0, 1, 2, 0, 2, 3],
});


const programSimulation = new Program({
  context: gl,
  vertexShader: glslify('./shader/basic.vert'),
  fragmentShader :glslify('./shader/sim.frag'),
});


programSimulation.bind();
squareUvs.attribPointer(programSimulation.attributes.uv2);
squarePositions.attribPointer(programSimulation.attributes.aPosition);
indicesSquare.bind();

fboIn.bind();
dataText.bind(0);
indicesSquare.draw(gl.TRIANGLES);
fboIn.unbind();
//
fboOut.bind();
dataText.bind(0);
indicesSquare.draw(gl.TRIANGLES);
fboOut.unbind();


const particlesOffset = new ArrayBuffer({
  context: gl,
  data: dataPos,
});
particlesOffset.computeLenght(4);

const particlesUvs = new ArrayBuffer({
  context: gl,
  data: uvs,
});


const ext = gl.getExtension("ANGLE_instanced_arrays");
let sheme = gradients[Math.floor(Math.random() * gradients.length)];
webgl.clearColor(1,1,1,1)
let time = 0;

render();

function render() {
  raf(render);
  controls.update();
  webgl.clear();

  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.ONE, gl.ZERO);


  let temp = fboIn;
  fboIn = fboOut;
  fboOut = temp;

  programSimulation.bind();
  indicesSquare.bind();
  // ext.vertexAttribDivisorANGLE(programSimulation.attributes.uv2.location, 0);
  squarePositions.attribPointer(programSimulation.attributes.aPosition);
  squareUvs.attribPointer(programSimulation.attributes.uv2);

  fboIn.bind();
  fboIn.clear();
    fboOut.colors.bind(0);
    indicesSquare.draw(gl.TRIANGLES);
  fboIn.unbind();
  //
  fboOut.bind();
    indicesSquare.bind();
    fboIn.colors.bind(0);
    indicesSquare.draw(gl.TRIANGLES);
  fboOut.unbind();

  indicesSquare.bind();
  fboIn.colors.bind(0);
  // dataText.bind(0);

  indicesSquare.draw(gl.TRIANGLES);
  //
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ZERO);
  //
  program.bind();
  //
  program.uniforms.worldMatrix = cube.matrix;
  program.uniforms.viewMatrix = camera.view;
  program.uniforms.projectionMatrix = camera.projection;
  // //
  // dataText.bind(0);
  fboOut.colors.bind(0);

  cube.positions.attribPointer(program.attributes.aPosition);
  ext.vertexAttribDivisorANGLE(program.attributes.aUv2.location, 0);
  //
  particlesUvs.attribPointerInstanced(program.attributes.aUv2, 1);
  //
  cube.uvs.attribPointer(program.attributes.aUv);
  cube.normals.attribPointer(program.attributes.aNormal);
  cube.indices.bind();
  // //
  //
  cube.indices.drawInstance(gl.TRIANGLES, particlesOffset.length);
  ext.vertexAttribDivisorANGLE(program.attributes.aUv2.location, 0);




  time += 0.0025;

}

function onResize() {
  webgl.resize();
  camera.aspect = window.innerWidth /window.innerHeight;
  program.bind();
  //
  program.uniforms.projectionMatrix = camera.projection;

}
