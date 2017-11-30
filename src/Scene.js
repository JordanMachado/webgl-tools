import G from './tools';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

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

    this.bgC = '#f7e0ff';
    this.webgl.clearColor(this.bgC, 1);
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.lookAt([0,0,100],[0,0,0])
    let s = 50;
    this.cameraShadow = new G.OrthographicCamera(-s,s,-s,s, 0.1 ,300);
    this.cameraShadow.lookAt([0,50,0.1],[0,0,0])
    // console.log(this.cameraShadow.projection,this.cameraShadow.view);

    this.mvpDepth = mat4.create();
		mat4.multiply(this.mvpDepth, this.cameraShadow.projection, this.cameraShadow.view)
		const biaMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);
		mat4.multiply(this.mvpDepth, biaMatrix, this.mvpDepth);
		// mat4.multiply(this.mvpDepth,  this.mvpDepth,biaMatrix);

    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);
    this.mouse = [0.1,0.1,1];
    // this.mouse = [1,1,1];
    window.addEventListener('mousemove', (e)=>{
      this.mouse[0] = (e.clientX/window.innerWidth) * 70
      this.mouse[1] = -(e.clientY/window.innerHeight) * 100 + 100
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


      const width = ddevice ==='desktop'? 256 : 128;
      const height = ddevice ==='desktop' ? 256 : 128;
      const offsets = new Float32Array(width * height * 4)
      const velocity = new Float32Array(width * height * 4)
      const colors = new Float32Array(width * height * 3)
      const uvs = new Float32Array(width * height * 2);
      // A684EE	8775AD	492593	BEA2F6	CCB7F6
      this.colors = [
        G.Utils.hexToRgb('#A684EE'),
        G.Utils.hexToRgb('#8775AD'),
        G.Utils.hexToRgb('#492593'),
        G.Utils.hexToRgb('#BEA2F6'),
        G.Utils.hexToRgb('#CCB7F6'),
      ]

      let count = 0;
      for (var i = 0; i < width * height * 4; i+=4) {
        const r = Math.random() * (Math.PI*2);
        // console.log( Math.cos(r));
        offsets[i] = Math.cos(r) *( Math.random() * (4 + 4) - 4)
        offsets[i + 1] = Math.sin(r) * (Math.random() * (4 + 4) - 4)
        offsets[i + 2] = Math.random() * (4 + 4) - 4
        offsets[i + 3] = Math.random();
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        // console.log(color,Math.floor(Math.random() * this.colors.length-1));
        colors[count * 3 + 0] = color[0];
        colors[count * 3 + 1] = color[1];
        colors[count * 3 + 2] = color[2];

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
      // console.log(G.Utils.hexToRgb('#ff4470'));


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


      // const primitive = G.Primitive.cube(1,0.2,0.2);
      // const primitive = G.Primitive.cube(0.1,1,0.1);
      // const primitive = G.Primitive.cube(0.1,0.1,1);
      const primitive = G.Primitive.cube(1,1,1);
      const geometry = new G.Geometry(primitive);
      geometry.addInstancedAttribute('offsets', offsets, 1, true);
      geometry.addInstancedAttribute('uv2s', uvs, 1, true);
      geometry.addInstancedAttribute('colors', colors, 1, true);
      // console.log(geometry);
      let shadowMapSize = ddevice ==='desktop' ? 512 : 256;
      this.fbo = new G.FrameBuffer(gl, shadowMapSize, shadowMapSize, {
        depth:true,
      });

      this.particles = new G.Mesh(
        geometry,
        new G.Shader(
        glslify('./shaders/particles/particle.vert'),
        glslify('./shaders/particles/particle.frag'),
        {
          uPositions:dataText,
          uBuffer:this.gpgpu.fboOutO.colors,
          uBufferVel:this.gpgpuVel.fboOutO.colors,
          uShadowMap: this.fbo.depth,
          uShadowMatrix:this.mvpDepth,
          uLightColor:G.Utils.hexToRgb('#fd003c'),
          fogColor: G.Utils.hexToRgb(this.bgC),

          // uLightColor:G.Utils.hexToRgb('#fffc00'),

        }
      ));





      this.floor = new G.Mesh(
        new G.Geometry(G.Primitive.plane(500,500, 10,10)),
        new G.Shader(
        glslify('./shaders/floor.vert'),
        glslify('./shaders/floor.frag'),
        {
          uShadowMap: this.fbo.depth,
          fogColor: G.Utils.hexToRgb(this.bgC),
          floorColor: G.Utils.hexToRgb('#dac9ff'),
			    uShadowMatrix:this.mvpDepth
        }
      ));
      this.floor.y = -30;
      this.floor.rx = 90 * Math.PI/180;



          this.fboDebug = new G.Mesh(
            new G.Geometry(G.Primitive.quad(0.3, 0.3)),
            new G.Shader(
              glslify('./shaders/debug.vert'),
              glslify('./shaders/texture.frag'), {
                uTexture: this.fbo.depth
              }
            ));
            this.fboDebug.x = -0.7;
            // this.fboDebug.y = -0.7;




            this.frame = 0;


            // this.position = new G.Vector3();

            // console.log(this.position.x,this.position.y,this.position.z);
            // this.position.x = 10;
            // this.position.y = 10;
            // this.position.z = 10;
            // this.position.set(1,1,1)
            // console.log(this.position.get());

            this.mesh = new G.Mesh(
              new G.Geometry(primitive),
              new G.Shader(
              glslify('./shaders/base.vert'),
              glslify('./shaders/base.frag'),
              {}
            ));
            console.log(this.mesh);
  }
  render() {
    this.time += 0.1;
    this.frame++;
    this.controls.update();
    this.webgl.clear();
    // G.State.enable(gl.CULL_FACE);
    //
    // this.fbo.bind();
    // this.fbo.clear();
    // // FRONT
    // gl.cullFace(gl.FRONT);
    // this.webgl.render(this.particles, this.cameraShadow);
    // this.fbo.unbind();
    //
    // G.State.disable(gl.CULL_FACE);
    //
    // this.gpgpuVel.quad.shader.uniforms.uPositions = this.gpgpu.fboOutO.colors;
    // this.gpgpu.quad.shader.uniforms.uVelocity = this.gpgpuVel.fboOutO.colors;
    //
    // this.gpgpuVel.update();
    // this.gpgpu.update();
    // // console.log(this.gpgpuVel.quad.shader.uniforms.mouse);
    // this.gpgpuVel.quad.shader.uniforms.mouse = this.mouse
    //
    // this.particles.shader.uniforms.mouse = this.mouse
    //
    //
    // this.particles.shader.uniforms.uBuffer = this.gpgpu.fboOutO.colors;
    // G.State.enable(gl.DEPTH_TEST);
    // G.State.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    // this.webgl.render(this.particles, this.camera);
    // G.State.disable(gl.CULL_FACE);
    //
    //
    // this.webgl.render(this.floor, this.camera);
    // // this.webgl.render(this.fboDebug, this.camera);
    //
    // if(this.screen) {
    //   this.screen = false;
    //   img.src = this.webgl.canvas.toDataURL();
    //   btn.href = img.src;
    // }

    this.webgl.render(this.mesh, this.camera);



  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
