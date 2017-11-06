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
    this.controls.lock(true)
    this.controls.lockZoom(true)

    window.addEventListener('click', ()=>{
      // this.screen = true;
      // var img = new Image();
      // img.src = this.webgl.canvas.toDataURL();
      // window.document.body.appendChild(img);
    })

    const primitive = new G.Primitive.sphere(2.5);

    let geometry = new G.Geometry(new G.Primitive.cube(0.2, 0.01, 0.1))

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

    this.gpgpu = new PingPong(width, height, this.webgl, this.camera, dataText)


    geometry.addInstancedAttribute('offsets', dataPos, 1);
    geometry.addInstancedAttribute('twouvs', G.ArrayUtils.flatten(uvs), 1);


    this.mesh = new G.Mesh(
      geometry,
      new G.Shader(
        glslify('./shader/instancing.vert'),
        glslify('./shader/instancing.frag'), {
          uTime: 0,
          // uLightColor: G.utils.hexToRgb('#f9f239'),
          uLightColor: G.utils.hexToRgb('#19b409'),
          uColor: G.utils.hexToRgb('#ff1b2b'),
          uColor1: G.utils.hexToRgb('#1b45ff'),
          uBuffer: dataText
        },
        'Particles'
      ));

    this.bg = new G.Mesh(
      new G.Geometry(G.Primitive.quad(1, 1)),
      new G.Shader(
        glslify('./shader/bg.vert'),
        glslify('./shader/bg.frag'),{},
        'Background'
      ));
    this.fbo = new G.FrameBuffer(gl, window.innerWidth, window.innerHeight, {
      depth: true
    });


    this.floor = new G.Mesh(
      new G.Geometry(G.Primitive.plane(40, 40, 20, 20)),
      new G.Shader(
        glslify('./shader/floor.vert'),
        glslify('./shader/floor.frag'), {
          uReflection: this.fbo.colors,
          uTime: this.time,
        },
        'Floor'
      ));
    this.floor.rx = -Math.PI / 180 * 80;
    this.floor.y = -1.5;

    this.time = 0;

    // this.fboDebug = new G.Mesh(
    //   new G.Geometry(G.Primitive.quad(0.5, 0.5)),
    //   new G.Shader(
    //     glslify('./shader/debug.vert'),
    //     glslify('./shader/texture.frag'), {
    //       uTexture: this.fbo.colors
    //     }
    //   ));
    // this.fboDebug.x = -0.5;
    // this.fboDebug.y = 0.5;

  }
  render() {
    this.time += 0.01;
    this.mesh.shader.uniforms.uTime += 0.01;
    this.floor.shader.uniforms.uTime = this.time * 0.8;
    this.webgl.clear();

    G.State.enable(gl.DEPTH_TEST)
    this.fbo.bind();
    this.fbo.clear();
    this.camera.lookAt([0, -9, 0.1], [0, 0, 0])
      this.webgl.render(this.mesh, this.camera);
    this.fbo.unbind();

    G.State.disable(gl.DEPTH_TEST);
    this.webgl.render(this.bg, this.camera);

    this.controls.update();

    G.State.enable(gl.DEPTH_TEST);
    this.gpgpu.update();
    this.mesh.shader.uniforms.uBuffer = this.gpgpu.fboOutO.colors;


    this.webgl.render(this.mesh, this.camera);
    this.webgl.render(this.floor, this.camera);

    if(this.screen) {
      // this.screen = false;
      // var img = new Image();
      // img.src = this.webgl.canvas.toDataURL();
      // window.document.body.appendChild(img);
    }


    // G.State.disable(gl.DEPTH_TEST);
    // this.webgl.render(this.fboDebug, this.camera);

  }
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.webgl.resize();
  }
}
