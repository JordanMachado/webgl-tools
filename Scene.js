import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    this.webgl.clearColor(0.1, 0.1, 0.1,1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new OrbitalCameraControl(this.camera.view, 10, window);
    window.controls = this.controls;
    const primitive = new G.Primitive.cube();
    this.time = 0;
    let geometry = new G.Geometry(primitive)
    let map = new G.Texture(gl);
    map.upload(assets['brick-map']);
    map.linear();

    console.log(G.ArrayUtils.randomPointInGeometry);
    let normal = new G.Texture(gl);
    normal.upload(assets['brick-normal']);
    normal.linear();
    gl.getExtension('OES_standard_derivatives');
    this.mesh = new G.Mesh(
      geometry,
      new G.Shader(
        glslify('./shader/base.vert'),
        glslify('./shader/base.frag'), {
          uTime: this.time,
          uMap: map,
          uNormalMap: normal,
          uNormalScale: [1,1]
        }
    ));




  }
  render() {
    this.time += 0.01;

    this.mesh.shader.uniforms.uTime = this.time * 0.8;
    this.webgl.clear();
    G.State.enable(gl.DEPTH_TEST)
    this.controls.update();

    this.webgl.render(this.mesh, this.camera);


  }
  resize() {
    this.camera.aspect = window.innerWidth/ window.innerHeight;
    this.webgl.resize();
  }
}
