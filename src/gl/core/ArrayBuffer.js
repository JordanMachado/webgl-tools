//https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
import { ARRAY_BUFFER, STATIC_DRAW, UNSIGNED_SHORT } from '../const/webglConst';
import Debug from '../utils/Debug';

export default class ArrayBuffer {
  constructor({ context, data, usage, divisor }) {
    this.gl = context;
    this.buffer = this.gl.createBuffer();
    this.usage = usage || STATIC_DRAW;
    this.divisor = divisor;
    if(this.divisor) {
      this.instanced = true;
    }

    this.length = -1;
    this.data(data);
  }
  bind() {
    this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
  }
  data(data, usage) {
    this.bind();
    this.gl.bufferData(ARRAY_BUFFER , new Float32Array(data), this.usage);
    this.gl.bindBuffer(ARRAY_BUFFER , null);
    this._data = data;

  }
  attribPointer(attribute) {
    if (attribute === undefined) {
      // console.log(arguments);
      // Debug.error(`Attribute not used in shader`);
      return;
    }
    if(this.length === -1) {
      this.attribute = attribute;
      this.computeLenght(attribute._size);
    }
    this.bind();
    this.gl.vertexAttribPointer(attribute.location, attribute._size, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(attribute.location);
  }
  attribPointerInstanced(attribute, divisor) {
    this.attribPointer(attribute)
    let ext = this.gl.getExtension("ANGLE_instanced_arrays");
    // console.log(ext);
    ext.vertexAttribDivisorANGLE(attribute.location, divisor);
  }
  computeLenght(attribSize) {
    this.length = this._data.length / attribSize;
  }
  draw(mode, count, offset) {
    this.gl.drawArrays(mode, offset, this.length);
  }
}
