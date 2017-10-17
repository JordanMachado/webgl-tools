import G from './tools';
const glslify = require('glslify');
import OrbitalCameraControl from 'orbital-camera-control';

// G.debug.verbose = false;

export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    let bgC = G.utils.hexToRgb('#080808');

    this.webgl.clearColor(bgC[0], bgC[1], bgC[2],1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.controls = new OrbitalCameraControl(this.camera.view, 20, window);
    window.controls = this.controls;

    const primitive = new G.Primitive.sphere(5);
    // console.log(primitive);

    let geometry = new G.Geometry(new G.Primitive.cube(0.05,0.05,0.3))
    // console.log(window.assets.skull.positions);
    // for (var i = 0; i < array.length; i++) {
    //   array[i]
    // }
    geometry.addInstancedAttribute('offsets', G.ArrayUtils.flatten(primitive.positions), 1);
    geometry.addInstancedAttribute('primnormals', G.ArrayUtils.flatten(primitive.normals), 1);


    this.mesh = new G.Mesh(
      geometry,
      new G.Shader(
        glslify('./shader/instancing.vert'),
        glslify('./shader/instancing.frag'), {
          uTime: 0,
          uLightColor: G.utils.hexToRgb('#03176c'),
          uColor: G.utils.hexToRgb('#0a0a0a')
        }
    ));





  }
  render() {
    this.mesh.shader.uniforms.uTime += 0.01;
    this.mesh.ry += 0.002;
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
