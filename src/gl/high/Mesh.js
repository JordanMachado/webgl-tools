import Object3D from '../core/Object3D';

export default class Mesh extends Object3D {
  constructor(geometry, shader, options = {}) {
    super();
    // console.log(options);
    this.drawType = options.drawType !== undefined ? options.drawType : gl.TRIANGLES;
    this.depthTest = options.depthTest !== undefined ? options.depthTest : true;
    this.geometry = geometry,
    this.shader = shader;
  }
}
