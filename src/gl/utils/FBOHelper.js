import Mesh from '../high/Mesh';
import Geometry from '../high/Geometry';
import Shader from '../high/Shader';
import Primitive from '../high/Primitive';
import FrameBuffer from '../core/FrameBuffer';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';
const glslify = require('glslify');

export default class FBOHelper {
  constructor(renderer, size = 256) {
    this.renderer = renderer;
    this.size = 256;
    this.camera = new OrthographicCamera(-1,1,-1,1,0.1,100);
    this.textures = [];

    this.shader = new Shader(`
      attribute vec3 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;

      void main() {
        vec4 p = vec4(aPosition, 1.0);
        gl_Position =   p;
        vUv = aUv;
      }

      `,`
        precision highp float;

        uniform sampler2D uTexture;
        varying vec2 vUv;

        void main() {
          vec4 base = texture2D(uTexture,vUv);
          gl_FragColor = vec4(base.rgb, 1.0);
        }
      `);
    this.geo = new Geometry(Primitive.quad(1, 1))
    this.mesh = new Mesh(this.geo, this.shader);
    console.log(this.geo);
  }
  attach(texture) {
    this.textures.push(texture);
  }
  render() {
    if(this.textures.length<1) return;

    // console.log(this.textures[0]);
    for (var i = 0; i < this.textures.length; i++) {
      this.shader.uniforms.uTexture = this.textures[i]
      this.renderer.gl.viewport(this.size*i, 0, this.size, this.size / this.renderer.aspect);
      this.renderer.render(this.mesh,this.camera)
    }

    this.renderer.gl.viewport(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);

  }
}
