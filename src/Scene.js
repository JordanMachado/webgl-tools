import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';
import Query from './Query';
import PingPong from './PingPong';
import { mat4, mat3 } from 'gl-matrix';
import {readGbo} from 'gbo-reader';
if(!Query.debug) {
  G.debug.verbose = false;
}

let img;
let btn = document.createElement('a');


export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();

    let bgC = G.utils.hexToRgb('#f7f7f7');

    this.webgl.clearColor(bgC[0], bgC[1], bgC[2], 1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);
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

      this.light = {
        position: [0,0,0],
      }
      let s = 8;
      // this.cameraL = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      this.cameraL = new G.OrthographicCamera(-s,s,-s,s, 1, 50);
      this.cameraL.lookAt([0,0,20], [0,0,0], [0,1,0]);

      this.mvpDepth = mat4.create();
      // console.log(this.mvpDepth);
      // console.log(this.cameraL.projection,this.cameraL.view);
      mat4.multiply(this.mvpDepth, this.cameraL.projection, this.cameraL.view)
      // mat4.invert(this.mvpDepth, this.mvpDepth);
      // mat4.multiply(this.mvpDepth, this.mvpDepth, this.dd)
      const biaMatrix = mat4.fromValues(
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.5, 0.5, 0.5, 1.0
      );
      mat4.multiply(this.mvpDepth, biaMatrix, this.mvpDepth);

      this.fbo = new G.FrameBuffer(gl, 1024, 1024 , { depth: true});

      let size = 1;
      this.debug = new G.Mesh(
        new G.Geometry(G.Primitive.plane(size,size)),
        new G.Shader(
          glslify('./shader/debug.vert'),
          glslify('./shader/texture.frag'), {
            uTexture: this.fbo.depth
          }
        ));
        this.debug.x = -size / 2;
        this.debug.y = -size / 2;

        this.floor = new G.Mesh(
          new G.Geometry(G.Primitive.plane(20, 20, 1, 1)),
          new G.Shader(
            glslify('./shader/base.vert'),
            glslify('./shader/base.frag'), {
              uShadowMap: this.fbo.depth,
              uShadowMatrix: this.mvpDepth,
            }
          ));
          // this.floor.drawType = gl.POINTS
          // this.floor.rx = -80 * Math.PI / 180
          this.floor.z = -10;


        this.mesh2 = new G.Mesh(
          new G.Geometry(G.Primitive.sphere()),
          new G.Shader(
            glslify('./shader/base.vert'),
            glslify('./shader/base.frag'), {
              uShadowMap: this.fbo.depth,
              uShadowMatrix: this.mvpDepth,
            }
          ));



        readGbo(getAsset('girl.gbo')).then(o=>{

          const geo = new G.Geometry({
            positions:o.position,
            uvs:o.uv,
            normals:o.normals,
            indices:o.indices,
            flat:true
          });

          this.mesh2 = new G.Mesh(
            geo,
            new G.Shader(
              glslify('./tools/shaders/basic.vert'),
              glslify('./tools/shaders/basic.frag'), {
                uShadowMap: this.fbo.depth,
                uShadowMatrix: this.mvpDepth,
              }
            ));
        this.mesh2.scale = [0.1,0.1,0.1]


        });


          // this.mesh2.drawType = gl.LINES

          // this.mesh2.y = -0.5;



  }
  render() {
    this.time += 0.01;
    this.controls.update();

    // this.mesh2.z = Math.cos(this.time) * 1 ;
    // this.mesh2.y = Math.cos(this.time) * 1 + 1;
    this.mesh2.ry += 0.01;
    //
    // G.State.disable(gl.DEPTH_TEST);

    this.fbo.bind();
      this.fbo.clear();
      // this.webgl.render(this.floor,this.cameraL);
      G.State.disable(gl.CULL_FACE);

      this.webgl.render(this.mesh2,this.cameraL);
    this.fbo.unbind();


    G.State.enable(gl.DEPTH_TEST);
    G.State.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this.floor.shader.uniforms.uShadowMap = this.fbo.depth;
    this.webgl.render(this.floor, this.camera);
    // G.State.disable(gl.CULL_FACE);
    this.webgl.render(this.mesh2, this.camera);
    this.mesh2.shader.uniforms.uTime = this.time;


    // this.webgl.render(this.debug, this.camera);



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
