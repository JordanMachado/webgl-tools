import Program from '../core/Program';

export default class Shader {
  constructor(vs, fs, uniforms) {
    this.program = new Program({
      context: gl,
      vertexShader: vs,
      fragmentShader: fs,
    });
    this.uniforms = uniforms;
  }
}
