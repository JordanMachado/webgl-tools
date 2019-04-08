// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
import { ELEMENT_ARRAY_BUFFER, STATIC_DRAW, UNSIGNED_SHORT } from '../const/webglConst';
class IndexBuffer
{
    /**
    * Constructs a new ArrayBuffer
    * @param {object} [params={}]  options
    * @param {string} params.context  context webgl
    * @param {object} [params.data=null]  data of the buffer
    * @param {number} [params.usage=STATIC_DRAW]  webgl draw usage
    * @param {number} [params.divisor=null]  divisor for instancing
    */
    constructor({ context, data, usage })
    {
        this.gl = context;
        this.buffer = this.gl.createBuffer();
        this.usage = usage || STATIC_DRAW;
        this.length = data.length;
        this.data(data);
    }
    /**
  * @func  bind
  * @description  Bind the indexBuffer
  * @memberof IndexBuffer.prototype
  */
    bind()
    {
        this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, this.buffer);
    }
    /**
  * @func  unbind
  * @description  Unbind the indexBuffer
  * @memberof IndexBuffer.prototype
  */
    unbind()
    {
        this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, null);
    }
    /**
  * @func  data
  * @description  add data to the indexBuffer
  * @param {Uint16Array} data  data
  * @memberof IndexBuffer.prototype
  */
    data(data)
    {
        this.bind();
        this.gl.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.usage);
        this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, null);
        this._data = data;
    }
    /**
  * @func  draw
  * @description  draw the indexBuffer
  * @param {object} mode  webgl mode gl.TRIANGLES...
  * @param {offset} offset  offset for strided data
  * @memberof IndexBuffer.prototype
  */
    draw(mode, offset = 0)
    {
    // console.log(this.length);
        this.gl.drawElements(mode, this.length, UNSIGNED_SHORT, offset);
    }
    /**
  * @func  drawInstance
  * @description  draw the indexBuffer
  * @param {object} mode  webgl mode gl.TRIANGLES...
  * @param {number} count  number of instances
  * @memberof IndexBuffer.prototype
  */
    drawInstance(mode, count)
    {
    // console.log(this.length);
        const ext = this.gl.getExtension('ANGLE_instanced_arrays');

        ext.drawElementsInstancedANGLE(mode, this.length, UNSIGNED_SHORT, 0, count);
    }
}
export default IndexBuffer;
