import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';
import Query from './Query';
import PingPong from './PingPong';
import { mat4, mat3 } from 'gl-matrix';
// import {readGbo} from 'gbo-reader';
if(!Query.verbose) {
  G.debug.verbose = false;
}

let img;
let btn = document.createElement('a');


export default class Scene {
  constructor() {
    window.scene = this;
    this.webgl = new G.Webgl();

    this.webgl.clearColor('#000000', 1);
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.lookAt([0,0,1000],[0,0,0])

    this.controls = new OrbitalCameraControl(this.camera.view, 100, window);
    this.mouse = [0,0,0];
    window.addEventListener('mousemove', (e)=>{
      this.mouse[0] = (e.clientX/window.innerWidth) * 100
      this.mouse[1] = -(e.clientY/window.innerHeight) * 100
    })
    // this.controls.lock(true)
    // this.controls.lockZoom(true)
    this.time = 0;


      if(Query.debug) {

        const debug = document.createElement('div');
        debug.id = 'debug';

        btn.id = 'screenshot'
        btn.innerHTML = 'screenshot';

        img = new Image();

        debug.appendChild(btn);
        document.body.appendChild(debug);
        btn.addEventListener('mousedown', ()=>{
          this.screen = true;
        })
        btn.addEventListener('mouseup', ()=>{
          btn.download = 'screen';
        })
      }
      const width = 128;
      const height = 128;
      const offsets = new Float32Array(width * height * 4)
      const velocity = new Float32Array(width * height * 4)
      const uvs = new Float32Array(width * height * 2);
      let count = 0;
      for (var i = 0; i < width * height * 4; i+=4) {
        offsets[i] = Math.random() * (4 + 4) - 4
        offsets[i + 1] = Math.random() * (4 + 4) - 4
        offsets[i + 2] = Math.random() * (4 + 4) - 4

        uvs[count * 2 + 0] = (count % width) / width;
        uvs[count * 2 + 1] = Math.floor(count / width) / height;

        velocity[i] =Math.random();
        velocity[i + 1] =Math.random();
        velocity[i + 2] =Math.random();

         count++;
      }

      const dataText = new G.Texture(gl);
      dataText.format = gl.RGBA;
      dataText.type = gl.FLOAT;
      dataText.uploadData(offsets, width, height);

      const dataVel = new G.Texture(gl);
      dataVel.format = gl.RGBA;
      dataVel.type = gl.FLOAT;
      dataVel.uploadData(velocity, width, height);


      this.gpgpu = new PingPong({
        data: dataText,
        width: width,
        height: height,
        renderer: this.webgl,
        camera: this.camera,
        vs: glslify('./shaders/particles/base.vert'),
        fs: glslify('./shaders/particles/position.frag'),
        uniforms: {
          uVelocity:dataVel,
        }
      });



      this.gpgpuVel = new PingPong({
        data: dataText,
        width: width,
        height: height,
        renderer: this.webgl,
        camera: this.camera,
        vs: glslify('./shaders/particles/base.vert'),
        fs: glslify('./shaders/particles/velocity.frag'),
        uniforms: {
          mouse: [0,0,0],
          uPositions:dataText,
        }
      });


      const primitive = G.Primitive.cube(0.5,0.1,0.5);
      const geometry = new G.Geometry(primitive);
      geometry.addInstancedAttribute('offsets', offsets, 1, true);
      geometry.addInstancedAttribute('uv2s', uvs, 1, true);
      // console.log(geometry);
      this.particles = new G.Mesh(
        geometry,
        new G.Shader(
        glslify('./shaders/particles/particle.vert'),
        glslify('./shaders/particles/particle.frag'),
        {
          uBuffer:this.gpgpu.fboOutO.colors
        }
      ));





  }
  render() {
    this.time += 0.1;
    this.controls.update();
    this.webgl.clear();


    this.gpgpuVel.quad.shader.uniforms.uPositions = this.gpgpu.fboOutO.colors;
    this.gpgpu.quad.shader.uniforms.uVelocity = this.gpgpuVel.fboOutO.colors;

    this.gpgpuVel.update();

    this.gpgpu.update();
    // console.log(this.gpgpuVel.quad.shader.uniforms.mouse);
    this.gpgpuVel.quad.shader.uniforms.mouse = this.mouse

    this.particles.shader.uniforms.mouse = this.mouse


    this.particles.shader.uniforms.uBuffer = this.gpgpu.fboOutO.colors;
    G.State.enable(gl.DEPTH_TEST);
    this.webgl.render(this.particles, this.camera);

    if(this.screen) {
      this.screen = false;
      img.src = this.webgl.canvas.toDataURL();
      btn.href = img.src;
    }


  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
