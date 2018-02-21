//https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
import { ELEMENT_ARRAY_BUFFER, STATIC_DRAW, UNSIGNED_SHORT } from '../const/webglConst';
export default class IndexBuffer {
  constructor({ context, data, usage }) {
    this.gl = context;
    this.buffer = this.gl.createBuffer();
    this.usage = usage || STATIC_DRAW;
    this.length = data.length;
    this.data(data);
  }
  bind() {
    this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, null);
  }
  data(data, usage) {
    this.bind();
    this.gl.bufferData(ELEMENT_ARRAY_BUFFER , new Uint16Array(data), this.usage);
    this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER , null);
    this._data = data;
    
  }
  draw(mode, offset) {
    // console.log(this.length);
    this.gl.drawElements(mode, this.length, UNSIGNED_SHORT, 0);
  }
  drawInstance(mode, count) {
    // console.log(this.length);
    var ext = this.gl.getExtension("ANGLE_instanced_arrays");
    ext.drawElementsInstancedANGLE(mode, this.length, UNSIGNED_SHORT, 0, count);
  }
}
