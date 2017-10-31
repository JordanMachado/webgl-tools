import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';
import Query from './Query';
import PingPong from './PingPong';

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
    // this.controls.lock(true)
    // this.controls.lockZoom(true)



    let textures = [
      getAsset('cubemap/right.png'),
      getAsset('cubemap/left.png'),
      getAsset('cubemap/top.png'),
      getAsset('cubemap/bottom.png'),
      getAsset('cubemap/back.png'),
      getAsset('cubemap/front.png'),
    ]

    let texturesF = [
      getAsset('cubemap/fake/posx.jpg'),
      getAsset('cubemap/fake/negx.jpg'),
      getAsset('cubemap/fake/posy.jpg'),
      getAsset('cubemap/fake/negy.jpg'),
      getAsset('cubemap/fake/posz.jpg'),
      getAsset('cubemap/fake/negz.jpg'),
    ]


    const textureCube = new G.TextureCube(gl, textures);
    const textureCubeF = new G.TextureCube(gl, texturesF);
    this.mesh = new G.Mesh(
      new G.Geometry(G.Primitive.cube(50, 50, 50)),
      new G.Shader(
        glslify('./shader/textureCube.vert'),
        glslify('./shader/textureCube.frag'), {
          uTexture: textureCube,
        }
      ));

      this.mesh2 = new G.Mesh(
        new G.Geometry(G.Primitive.sphere()),
        new G.Shader(
          glslify('./shader/envMap.vert'),
          glslify('./shader/envMap.frag'), {
            uTexture: textureCube,
            uTextureFake: textureCubeF,
            uTime: 0,
          }
        ));

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
  }
  render() {
    this.time += 0.01;
    this.controls.update();

    G.State.enable(gl.DEPTH_TEST);
    G.State.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    this.webgl.render(this.mesh, this.camera);
    G.State.disable(gl.CULL_FACE);
    this.webgl.render(this.mesh2, this.camera);
    this.mesh2.shader.uniforms.uTime = this.time;



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
