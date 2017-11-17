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
    this.webgl = new G.Webgl();

    let bgC = G.utils.hexToRgb('#0a0254');

    this.webgl.clearColor(bgC[0], bgC[1], bgC[2], 1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.controls = new OrbitalCameraControl(this.camera.view, 25, window);
    this.controls.lock(true)
    this.controls.lockZoom(true)
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


      const floorNormal = new G.Texture(gl);
      floorNormal.upload(window.getAsset('img/ground_asphalt_05_normal.jpg'));

      const heightMap = new G.Texture(gl);
      heightMap.upload(window.getAsset('img/height.png'));

      this.floor = new G.Mesh(
        new G.Geometry(G.Primitive.plane(60, 60, 100, 100)),
        new G.Shader(
        glslify('./shaders/floor/floor.vert'),
        glslify('./shaders/floor/floor.frag'),
        {
          uHeightMap: heightMap,
          uNormalMap: floorNormal,
          uNormalScale: [1,1],
          uColor: G.utils.hexToRgb('#ffffff')
        }
      ));
      // this.floor.drawType = gl.LINES;
      this.floor.rx = -80 * Math.PI / 180
      this.floor.y = -5

      this.bg = new G.Mesh(
        new G.Geometry(G.Primitive.quad()),
        new G.Shader(
        glslify('./shaders/bg/bg.vert'),
        glslify('./shaders/bg/bg.frag'),
        {
          uHeightMap: heightMap,
          uNormalMap: floorNormal,
          uNormalScale: [1,1],
          uColor: G.utils.hexToRgb('#ffffff')
        }
      ));


            this.sphere = new G.Mesh(
              new G.Geometry(G.Primitive.sphere(2)),
              new G.Shader(
              glslify('./shaders/floor/floor.vert'),
              glslify('./shaders/bg/bg.frag'),
              {
                uHeightMap: heightMap,
                uNormalMap: floorNormal,
                uNormalScale: [1,1],
                uColor: G.utils.hexToRgb('#ffffff')
              }
            ));







  }
  render() {
    this.time += 0.001;
    this.controls.update();
    this.webgl.clear();
    G.State.disable(gl.DEPTH_TEST);
    this.webgl.render(this.bg, this.camera);

    G.State.enable(gl.DEPTH_TEST);
    this.webgl.render(this.floor, this.camera);
    // this.webgl.render(this.sphere, this.camera);

    this.bg.shader.uniforms.uTime = this.time;
    this.floor.shader.uniforms.uTime = this.time;

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
