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



if(Query.verbose) {
  G.debug.verbose = true;
}
export default class Scene {
  constructor() {


    window.scene = this;
    this.webgl = new G.Webgl();
    let bgC = G.utils.hexToRgb('#f7f7f7');
    this.webgl.clearColor(bgC[0], bgC[1], bgC[2], 1)
    this.webgl.append();

    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.controls = new OrbitalCameraControl(this.camera, 10, window);
    this.scene = new G.Object3D();
    this.fboHelper = new G.FBOHelper(this.webgl);


    this.bg = new G.Mesh(
      new G.Geometry(G.Primitive.quad(1, 1)),
      new G.Shader(
        glslify('./shaders/bg.vert'),
        glslify('./shaders/bg.frag'),{},
        'Background'
      ));
    this.fbo = new G.FrameBuffer(gl, window.innerWidth, window.innerHeight, {
      depth: true
    });



    let width = 48;
    let height = 48;
    let dataPos = new Float32Array(width * height * 4);
    let uvs = new Float32Array(width * height * 2);
    let count = 0;
    for (let i = 0, l = width * height * 4; i < l; i += 4) {
      dataPos[i] = Math.random() * 0.1;
      dataPos[i + 1] = Math.random() * 0.1;
      dataPos[i + 2] = Math.random() * 0.1;
      dataPos[i + 3] = Math.random();

      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;

      count++;

    }
    const dataText = new G.Texture(gl);
    dataText.format = gl.RGBA;
    dataText.type = gl.FLOAT;
    dataText.uploadData(dataPos, width, height);

    let geometry = new G.Geometry(new G.Primitive.cube(0.2, 0.01, 0.1));
    geometry.addInstancedAttribute('offsets', dataPos, 1);
    geometry.addInstancedAttribute('twouvs', G.ArrayUtils.flatten(uvs), 1);
    geometry.addCount(dataPos.length/4)



    const mesh = this.mesh = new G.Mesh(
      geometry,
      new G.Shader(
          glslify('./shaders/instancing.vert'),
          glslify('./shaders/instancing.frag'), {
            uTime: 0,
            // uLightColor: G.utils.hexToRgb('#f9f239'),
            uLightColor: G.utils.hexToRgb('#19b409'),
            uColor: G.utils.hexToRgb('#ff1b2b'),
            uColor1: G.utils.hexToRgb('#1b45ff'),
            uBuffer: dataText
          },
          'Particles'
        ));
      this.scene.addChild(this.bg);

    this.fboHelper.attach(dataText);


    this.gpgpu = new PingPong({
      width,
      height,
      renderer:this.webgl,
      camera:this.camera,
      data:dataText,
      vs:glslify('./shaders/particles/base.vert'),
      fs:glslify('./shaders/particles/sim.frag'),
    })
    this.fboHelper.attach(this.gpgpu.fboOut.colors);

    this.fbo = new G.FrameBuffer(gl, window.innerWidth, window.innerHeight, {
       depth: true
     });



    this.floor = new G.Mesh(
     new G.Geometry(G.Primitive.plane(40, 40, 20, 20)),
     new G.Shader(
       glslify('./shaders/floor.vert'),
       glslify('./shaders/floor.frag'), {
         uReflection: this.fbo.colors,
         uTime: 0,
       },
       'Floor'
     ));
   this.floor.rotation.x = -Math.PI / 180 * 80;
   this.floor.position.y = -1.5;
   this.scene.addChild(this.floor);
   this.scene.addChild(mesh);





    this.initComposer();
  }
  initComposer() {
    this.composer = new G.Composer(this.webgl, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, !!Query.debug);
    this.bloom = new G.BloomPass({amount:3})
    this.bloom.enable = true;
    this.composer.add(this.bloom)

    this.invert = new G.InvertPass({amount:3})
    this.invert.enable = true;
    this.composer.add(this.invert)
  }

  render() {


    this.gpgpu.update();
    this.floor.shader.uniforms.uTime += 0.01;
    this.mesh.shader.uniforms.uBuffer = this.gpgpu.fboOutO.colors;


    this.fbo.bind();
   this.fbo.clear();
   this.camera.lookAt([0, -9, 1], [0, 0, 0])
     this.webgl.render(this.mesh, this.camera);
   this.fbo.unbind();

   if(this.controls)
   this.controls.update();


    this.webgl.clear();

    if(Query.config.postPro) {
      this.composer.render(this.scene, this.camera);
    } else {
      this.webgl.render(this.scene, this.camera);
    }


    // this.fboHelper.render();



  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
