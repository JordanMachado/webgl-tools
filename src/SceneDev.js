import G from './gl';
const glslify = require('glslify');
import deviceType from 'ua-device-type';
window.ddevice = deviceType(navigator.userAgent);

import OrbitalCameraControl from './gl/utils/OrbitalCameraControl';
import Query from './dev/Query';
import SuperConfig from './dev/SuperConfig';

import Screenshot from './dev/Screenshot';
import PingPong from './gl/utils/PingPong';
import { mat4, mat3 } from 'gl-matrix';
import colorsPalette from 'nice-color-palettes'
import LSystem from './LSystem'


if(Query.verbose) {
  G.debug.verbose = true;
}




export default class Scene {
  constructor() {

    window.scene = this;
    this.webgl = new G.Webgl();
    this.webgl.append();
    this.webgl.clearColor(0.03,0.03,0.03,1);

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

    this.controls = new OrbitalCameraControl(this.camera, 30, window);
    this.initComposer();

    const system = new LSystem();
    this.scene = new G.Object3D();
    this.scene.system = system
    this.scene.position.y = -6;
    const fog = {
      density:0.03,
      gradient:2,
      color:[0.03,0.03,0.03]
    }

    // console.log(system.positions);
    // console.log(system.rotations);
    // console.log(system.scales);
    const geom =  new G.Geometry(G.Primitive.cube(1,1, 1, 1));

    geom.addInstancedAttribute('offsets', system.positions, 1);
    geom.addInstancedAttribute('rotations', system.rotations, 1);
    geom.addInstancedAttribute('scales', system.scales, 1);
    geom.addCount(system.positions.length/3);
    const shader = new G.BasicMaterial({
        fog,
        color: G.utils.hexToRgb('#ffffff'),
        vertex: {
          start:`
            attribute vec3 aOffset;
            attribute vec4 aRotation;
            attribute vec3 aScale;

          `,
          main:`
            p = vec4(aPosition,1.0);
            vNormal = normalize(normalMatrix * aNormal +2.0 * cross( aRotation.xyz, cross( aRotation.xyz, p.xyz ) + aRotation.w * p.xyz ));

            p.xyz *= aScale;
            p.xyz += 2.0 * cross( aRotation.xyz, cross( aRotation.xyz, p.xyz ) + aRotation.w * p.xyz );
            p.xyz = p.xyz + aOffset;


          `
        }
      })

    const tree = new G.Mesh(geom,shader);
    tree.scale.set(0.6)
    this.scene.addChild(tree);

    const floor = new G.Mesh(new G.Geometry(G.Primitive.plane(100,100, 30, 30)), new G.BasicMaterial({
      fog,
      color: G.utils.hexToRgb('#ffffff'),
    }))
    floor.rotation.x = 90 * Math.PI/180
    this.scene.addChild(floor);
    const l = 300;
    const offset = new Float32Array(l*3)
    let count = 0;
    for (var i = 0; i < l * 3; i+=3) {
      offset[count * 3] = Math.random() * (30 + 30 )- 30
      offset[count * 3 + 1] = -Math.random() * 0.9
      offset[count * 3 + 2] = Math.random() * (40 + 40 )- 40
      count ++;
    }

    const geomFloor =  new G.Geometry(G.Primitive.cube(4,0.4, 4, 1));

    geomFloor.addInstancedAttribute('offsets', offset, 1);
    geomFloor.addCount(offset.length/3);
    const shader2 = new G.BasicMaterial({
      fog,
      color: G.utils.hexToRgb('#ffffff'),
      vertex: {
        start:`attribute vec3 aOffset;`,
        main:`p = vec4(aPosition + aOffset, 1.0);`
      }
    })
    const floor2 = new G.Mesh(geomFloor,shader2);
    floor2.scale.set(0.5);
    this.scene.addChild(floor2);






  }
  initComposer() {
    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, !!Query.debug);
    this.bloom = new G.BloomPass({amount:3})
    this.bloom.enable = true;
    // this.composer.add(this.bloom)

    this.invert = new G.InvertPass({amount:3})
    this.invert.enable = true;
    // this.composer.add(this.invert)
  }

  render() {

    if(this.controls)
    this.controls.update();

    this.webgl.clear();

    G.State.enable(gl.DEPTH_TEST);

    if(Query.config.postPro || true) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.webgl.render(this.scene, this.camera);
    }


  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
