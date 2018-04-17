import IndexBuffer from '../core/IndexBuffer';
import ArrayBuffer from '../core/ArrayBuffer';
import ArrayUtils from '../utils/ArrayUtils';
export default class Geometry {
  constructor(data = {}) {
    this.attributes = {};
    const flat = data.flat || false;
    if(data.positions) {
      this.addAttribute('positions', data.positions, flat)
    }
    if(data.uvs) {
      this.addAttribute('uvs', data.uvs, flat)
    }
    if(data.normals) {
      this.addAttribute('normals', data.normals, flat)
    }
    if(data.indices || data.cells) {
      this.addIndices(data.indices || data.cells, flat);
    }
  }
  addInstancedAttribute(name, data, divisor, flat) {
    this.instanced = true;
    this.count = 1;

    this.attributes[name] = new ArrayBuffer({
      context: gl,
      data: flat ? data : ArrayUtils.flatten(data),
      divisor,
    });
    this[name] = this.attributes[name];
    return this;
  }
  addCount(count) {
    this.count = count;
  }
  addAttribute(name, data, flat) {
    this.attributes[name] = new ArrayBuffer({
      context: gl,
      data: flat ? data : ArrayUtils.flatten(data),
    });
    this[name] = this.attributes[name];
    return this;
  }
  addIndices(data, flat) {
    this.indices = new IndexBuffer({
      context: gl,
      data: flat ? data : ArrayUtils.flatten(data),
    });
    return this;
  }
  generateFaces() {
    const faces = ArrayUtils.generateFaces(this.positions._data, this.indices._data);
    this.faces = faces;
    return this.faces;
  }
}
