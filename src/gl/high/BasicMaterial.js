import Shader from './Shader';
const glslify = require('glslify');

export default class Material extends Shader {
  constructor(uniforms = {}) {
    super(glslify('../shaders/basic.vert'), glslify('../shaders/basic.frag'), uniforms = {}, 'BasicMaterial');
  }
}
