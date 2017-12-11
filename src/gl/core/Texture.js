import Numbers from '../const/webglNumber';
export default class Texture {
  constructor(context, width, height, format, type) {
    this.gl = context;
    this.id = this.gl.createTexture();
    this._bindIndex = 0;

    this.width = width || -1;
    this.height = height || -1;
    this.format = this.gl.RGB;
    this.type =  this.gl.UNSIGNED_BYTE;

    this.minFilter = this.gl.NEAREST;
    this.magFilter = this.gl.NEAREST;
    this.wrapS = this.gl.CLAMP_TO_EDGE;
    this.wrapT = this.gl.CLAMP_TO_EDGE;
    this._bindIndex = null;

  }
  upload(image) {

    if (this.width !== image.width) {
      this.width = image.width
    }
    if (this.height !== image.height) {
      this.height = image.height
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this._type, image);
  }
  uploadData(data, width, height, depth) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);

    if (data instanceof Float32Array) {
      // get extension check
      var ext = this.gl.getExtension("OES_texture_float");
      this.type = this.gl.FLOAT;
    }
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this._format, width, height, 0, this._format, this._type, data || null);
      this.unbind();
  }
  set magFilter(value) {
    this.bind();
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, value);
    this._magFilter = value;
    this.unbind();
  }
  get magFilter() {
    return Numbers[this._magFilter];
  }
  set minFilter(value) {
    this.bind();
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, value);
    this._minFilter = value;
    this.unbind();
  }
  get minFilter() {
    return Numbers[this._minFilter];
  }
  set wrapS(value) {
    this.bind();
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, value);
    this._wrapS = value;
    this.unbind();
  }
  get wrapS() {
    return Numbers[this._wrapS];
  }
  set wrapT(value) {
    this.bind();
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, value);
    this._wrapT = value;
    this.unbind();
  }
  get wrapT() {
    return Numbers[this._wrapT];
  }
  set type(value) {
    this._type = value;
  }
  get type() {
    return Numbers[this._type];
  }
  set format(value) {
    this._format = value;
  }
  get format() {
    return Numbers[this._format];
  }
  bindIndex(index) {
    this._bindIndex = index;
  }
  bind() {
    this.gl.activeTexture(this.gl.TEXTURE0 + this._bindIndex);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    // this.unbind();
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  // shortcuts
  nearest() {
    this.minFilter = this.gl.NEAREST;
    this.magFilter = this.gl.NEAREST;
  }
  linear() {
    this.minFilter = this.gl.LINEAR;
    this.magFilter = this.gl.LINEAR;
  }
  repeat() {
    this.wrapS = this.gl.REPEAT;
    this.wrapT = this.gl.REPEAT;
  }
  clamp() {
    this.wrapS = this.gl.CLAMP_TO_EDGE;
    this.wrapT = this.gl.CLAMP_TO_EDGE;
  }
}
