import Object3D from '../core/Object3D';

export default class Mesh extends Object3D {
  constructor(geometry, shader) {
    super();
    this.drawType = gl.TRIANGLES;
    this.geometry = geometry,
    this.shader = shader;
  }
}
