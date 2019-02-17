import PingPong from 'gl/utils/PingPong';
import G from 'gl';
const glslify = require('glslify');

export default class System {
  constructor(_size, scene) {

    let width = _size;
    let height = _size;

    let dataPos = new Float32Array(width * height * 4);
    let pos = new Float32Array(width * height * 3);
    let uvs = new Float32Array(width * height * 2);
    let colors = new Float32Array(width * height * 3);
    let size = new Float32Array(width * height * 1);

    // const _colors = ["#0d543f", "#09424b", "#09424b", "#09424b", "#09424b", "#b0bfc8"];
    const _colors =   ["#d3e9ff", "#ffd5d5", "#ffa0ad", "#509be1", "#ff71b2"];
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

      const mycolor = G.utils.hexToRgb(_colors[Math.floor(Math.random()* _colors.length)]);
      colors[count * 3 + 0] = mycolor[0];
      colors[count * 3 + 1] = mycolor[1];
      colors[count * 3 + 2] = mycolor[2];
      size[count] = G.utils.random(0.5,1);


      count++;

    }

    const dataText = new G.Texture(gl);
    dataText.format = gl.RGBA;
    dataText.type = gl.FLOAT;
    dataText.uploadData(dataPos, width, height);


    this.gpu = new PingPong({
      data:dataText,
      width,
      height,
      timeAdd: 0.001,

      renderer:scene.webgl,
      camera: new G.OrthographicCamera(-1,1,-1,1,0.1,100),
      vs: glslify('./shaders/basic.vert'),
      fs: glslify('./shaders/sim.frag'),
      uniforms: {
        uMouse:[0,0,0]
      }
    });



       let geometry = new G.Geometry();
        geometry.addAttribute('positions', pos, true);

        geometry.addAttribute('colors', colors, true);
        geometry.addAttribute('twouvs', uvs, true);
        geometry.addAttribute('sizes', size, true);

        const normal = this.normal = new G.Texture(gl);
       normal.format = gl.RGBA;
       normal.upload(window.getAsset('img/normal.png'));


       const mesh = this.mesh = new G.Mesh(
       geometry,
       new G.Shader(
           glslify('./shaders/instancing.vert'),
           glslify('./shaders/instancing.frag'), {
             uBuffer: dataText,
             normalTexture: normal,
             uShadowMap: scene.fbo.depth,
             uShadowMatrix: scene.mvpDepth,
             toLook:[0,0,1]
           },
           'Particles'
         ),{
           drawType:gl.POINTS,
         });

        scene.fboHelper.attach(this.gpu.fboOut.colors);
        scene.fboHelper.attach(this.normal);

  }
  update(mouse) {
    this.mesh.shader.uniforms.uBuffer = this.gpu.fboOutO.colors;

    this.gpu.quad.shader.uniforms.uMouse = mouse;

    this.mesh.shader.uniforms.uBuffer = this.gpu.fboOutO.colors;
    this.gpu.update();


  }
}
