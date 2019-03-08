import G from 'gl';
import OrbitalCameraControl from 'gl/utils/OrbitalCameraControl';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import { mat4, mat3 } from 'gl-matrix';
const glslify = require('glslify');
import PingPong from 'gl/utils/PingPong';
export default class Scene {
  constructor() {
    this.webgl = new G.Webgl();
    this.webgl.clearColor("#ffe1d9", 1)

    this.webgl.append();
    this.camera = new G.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.controls = new OrbitalCameraControl(this.camera, 20, window);
    this.fboHelper = new G.FBOHelper(this.webgl,256);

    this.scene = new G.Object3D();



    let width = 2;
    let height = 3;

    let dataPos = new Float32Array(width * height * 4);
    let pos = new Float32Array(width * height * 3);
    let uvs = new Float32Array(width * height * 2);
    let colors = new Float32Array(width * height * 3);
    let size = new Float32Array(width * height * 1);

    let count = 0;

    for (let i = 0, l = width * height * 4; i < l; i += 4) {



        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const radius = Math.random() * 0.2;
        const x =  (radius * Math.sin(phi) * Math.cos(theta)) ;
        const y =  (radius * Math.sin(phi) * Math.sin(theta));
        const z =  (radius * Math.cos(phi));

        // dataPos[i] = G.utils.random(-0.1, 0.1);
        // dataPos[i + 1] = G.utils.random(-0.1, 0.1);
        // dataPos[i + 2] = G.utils.random(-0.2, 0.2);

        dataPos[i] =x;
        dataPos[i + 1] = y;
        dataPos[i + 2] = z;
      dataPos[i + 3] = Math.random();

      pos[count * 3 + 0] = dataPos[i]
      pos[count * 3 + 1] = dataPos[i + 1]
      pos[count * 3 + 2] = dataPos[i + 2]

      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;


      size[count] = G.utils.random(0.5,1);



    }
    const prim =G.Primitive.cube(1,1,1)
    const geom = new G.Geometry(prim)

    const uvvv = new Float32Array(prim.uvs.length)
    for (var i = 0; i < prim.uvs.length * 2; i+=2) {
      uvvv[count * 2 + 0] = (count % width) / width;
      uvvv[count * 2 + 1] = Math.floor(count / width) / height;
      count++;

    }
    console.log(uvvv.length);
    geom.addAttribute('cuvss',uvvv)

    // console.log(this.sphere.geometry.positions._data.length);
    // console.log(144/2);
    // console.log(Math.pow(Math.floor(Math.log2(this.sphere.geometry.positions._data.length)),2));

    const dataText = new G.Texture(gl);
    dataText.format = gl.RGBA;
    dataText.type = gl.FLOAT;
    // dataText.uploadData(dataPos, 2, 3);
    // console.log(this.sphere.geometry.positions._data.length/3);
    console.log(geom);
    dataText.uploadData(new Float32Array(prim.positions), 2, 2);

    this.gpu = new PingPong({
      data:dataText,
      width,
      height,
      timeAdd: 0.001,

      renderer:this.webgl,
      camera: new G.OrthographicCamera(-1,1,-1,1,0.1,100),
      vs: glslify('./shaders/basic.vert'),
      fs: glslify('./shaders/sim.frag'),
      uniforms: {
        uMouse:[0,0,0]
      }
    });

    this.fboHelper.attach(this.gpu.fboOut.colors);


    this.sphere = new G.Mesh(geom,      new G.Shader(
             `
             attribute vec3 aPosition;
             attribute vec2 aUv;
             attribute vec2 aCuvs;


             uniform mat4 projectionMatrix;
             uniform mat4 viewMatrix;
             uniform mat4 worldMatrix;
             uniform mat3 normalMatrix;

             uniform sampler2D uBuffer;


             void main() {

                 vec4 offset = texture2D(uBuffer, aCuvs);

                 vec4 p = vec4(aPosition + offset.xyz,1.);
                 // vec4 p = vec4(aPosition,1.);
                 vec4 worldPos = projectionMatrix * viewMatrix * worldMatrix * p;
                 gl_Position = worldPos;
                 gl_PointSize = 20.;



             }


             `,
             `
             precision mediump float;

             void main() {
               gl_FragColor = vec4(1.);

             }


             `, {
               uBuffer: this.gpu.fboOutO.colors,
             },
             'Particles'
           ),{
             drawType:gl.POINTS,
           })
    this.scene.addChild(this.sphere);



  }
  render(){
    this.controls.update();
    this.gpu.update();

    this.webgl.render(this.scene,this.camera);
    this.fboHelper.render();

  }
  resize(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }

}
