import IndexBuffer from '../core/IndexBuffer';
import ArrayBuffer from '../core/ArrayBuffer';
import ArrayUtils from '../utils/ArrayUtils';
export default class Geometry {
  constructor(data = {}) {
    this.attributes = {};
    if(data.positions) {
      this.addAttribute('positions', data.positions)
    }
    if(data.uvs) {
      this.addAttribute('uvs', data.uvs)
    }
    if(data.normals) {
      this.addAttribute('normals', data.normals)
    }
    if(data.indices || data.cells) {
      this.addIndices(data.indices || data.cells);
    }
  }
  addInstancedAttribute(name, data, divisor) {
    this.instanced = true;
    this.attributes[name] = new ArrayBuffer({
      context: gl,
      data: ArrayUtils.flatten(data),
      divisor,
    });
    this[name] = this.attributes[name];
    return this;
  }
  addAttribute(name, data) {

    this.attributes[name] = new ArrayBuffer({
      context: gl,
      data: ArrayUtils.flatten(data),
    });
    this[name] = this.attributes[name];
    return this;
  }
  addIndices(data) {
    this.indices = new IndexBuffer({
      context: gl,
      data:  ArrayUtils.flatten(data),
    });
    return this;
  }
}
