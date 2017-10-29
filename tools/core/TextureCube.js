import Texture from './Texture';
export default class CubeMapTexture {
  constructor(context, textures) {
    this.gl = context;
    this._bindIndex = 0;

    this.id = this.gl.createTexture();
    this.bind();
    if(textures.length < 6) {
      console.warn('Need at leat 6 textures');
    }
    console.log(textures.length);
    for (var i = 0; i < textures.length; i++) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
      this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textures[i]);
      // gl.texImage2D(targets[j], i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[index]);
    }
    this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

  }
  bind() {
    this.gl.activeTexture(this.gl.TEXTURE0 + this._bindIndex);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);

  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
  }
}
