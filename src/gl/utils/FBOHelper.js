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
    this.size = size;
    this.camera = new OrthographicCamera(-1,1,-1,1,0.1,100);
    this.textures = [];

    this.shader = new Shader(`
      attribute vec2 aPosition;
      attribute vec2 aUv;

      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vec4 p = vec4(aPosition,0.0, 1.0);
        gl_Position = p;
        vUv =  aPosition * .5 + .5;
      }


      `,`
        precision highp float;

        uniform sampler2D uTexture;
        varying vec2 vUv;

        void main() {
          vec4 base = texture2D(uTexture,vec2(vUv.x, 1.0-vUv.y));
          gl_FragColor = vec4(base.rgb, 1.0);
        }
      `, {},'FBO helper');
    this.geo = new Geometry(Primitive.bigTriangle(1, 1))
    this.mesh = new Mesh(this.geo, this.shader);
  }
  attach(texture) {
    this.textures.push(texture);
  }
  render() {
    if(this.textures.length<1) return;

    for (var i = 0; i < this.textures.length; i++) {
      this.shader.uniforms.uTexture = this.textures[i];
      this.renderer.gl.viewport(0, i * this.size , this.size, this.size );
      this.renderer.render(this.mesh,this.camera)
    }

    this.renderer.gl.viewport(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);

  }
}
