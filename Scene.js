import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';
import PingPong from './PingPong';
// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    window.webgl = this.webgl;
    let bgC = G.utils.hexToRgb('#f7f7f7');

    this.webgl.clearColor(bgC[0], bgC[1], bgC[2], 1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);
    // this.controls.lock(true)
    // this.controls.lockZoom(true)

    window.addEventListener('click', ()=>{
      // this.screen = true;
      // var img = new Image();
      // img.src = this.webgl.canvas.toDataURL();
      // window.document.body.appendChild(img);
    })
    let textures = [
      window.assets['cubemap/right'],
      window.assets['cubemap/left'],
      window.assets['cubemap/top'],
      window.assets['cubemap/bottom'],
      window.assets['cubemap/back'],
      window.assets['cubemap/front'],
    ]

    const textureCube = new G.TextureCube(gl, textures);
    this.mesh = new G.Mesh(
      new G.Geometry(G.Primitive.cube(50, 50, 50)),
      new G.Shader(
        glslify('./shader/textureCube.vert'),
        glslify('./shader/textureCube.frag'), {
          uTexture: textureCube
        }
      ));


  }
  render() {
    this.time += 0.01;
    this.controls.update();

    G.State.enable(gl.DEPTH_TEST);
    G.State.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    this.webgl.render(this.mesh, this.camera);


    if(this.screen) {
      // this.screen = false;
      // var img = new Image();
      // img.src = this.webgl.canvas.toDataURL();
      // window.document.body.appendChild(img);
    }


  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
