// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
import { ARRAY_BUFFER, STATIC_DRAW } from '../const/webglConst';

class ArrayBuffer
{
    /**
    * Constructs a new ArrayBuffer
    * @param {object} [params={}]  options
    * @param {string} params.context  context webgl
    * @param {object} [params.data=null]  data of the buffer
    * @param {number} [params.usage=STATIC_DRAW]  webgl draw usage
    * @param {number} [params.divisor=null]  divisor for instancing
    */
    constructor({ context, data, usage, divisor })
    {
        this.gl = context;
        this.buffer = this.gl.createBuffer();
        this.usage = usage || STATIC_DRAW;
        this.divisor = divisor;
        if (this.divisor)
        {
            this.instanced = true;
        }

        this.length = -1;
        this.data(data);
    }
    /**
  * @func  bind
  * @description  Bind the arrayBuffer
  * @memberof ArrayBuffer.prototype
  */
    bind()
    {
        this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
    }
    /**
  * @func  unbind
  * @description  Unbind the arrayBuffer
  * @memberof ArrayBuffer.prototype
  */
    unbind()
    {
        this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
    }
    /**
  * @func  data
  * @description  add data to the arrayBuffer
  * @param {Float32Array} data  data
  * @memberof ArrayBuffer.prototype
  */
    data(data)
    {
        this.bind();
        this.gl.bufferData(ARRAY_BUFFER, new Float32Array(data), this.usage);
        this.gl.bindBuffer(ARRAY_BUFFER, null);
        this._data = new Float32Array(data);
    }
    /**
  * @func  attribPointer
  * @description  set the attribute pointer
  * @param {object} attribute  attribute
  * @memberof ArrayBuffer.prototype
  */
    attribPointer(attribute)
    {
        if (attribute === undefined)
        {
            // console.log(arguments);
            // Debug.error(`Attribute not used in shader`);
            return;
        }
        if (this.length === -1)
        {
            this.attribute = attribute;
            this.computeLenght(attribute._size);
        }
        this.bind();
        this.gl.vertexAttribPointer(attribute.location, attribute._size, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attribute.location);
    }
    /**
  * @func  attribPointerInstanced
  * @description  set the attribute pointer
  * @param {object} attribute  attribute
  * @param {number} divisor  divisor
  * @memberof ArrayBuffer.prototype
  */
    attribPointerInstanced(attribute, divisor)
    {
        this.attribPointer(attribute);
        const ext = this.gl.getExtension('ANGLE_instanced_arrays');
        // console.log(ext);

        ext.vertexAttribDivisorANGLE(attribute.location, divisor);
    }
    /**
  * @func  computeLenght
  * @description  compute the length of the buffer depending of the data type
  * @param {number} attribSize  attribSize
  * @memberof ArrayBuffer.prototype
  */
    computeLenght(attribSize)
    {
        this.length = Math.floor(this._data.length / attribSize);
    }
    /**
  * @func  draw
  * @description  draw the arrayBuffer
  * @param {object} mode  webgl mode gl.TRIANGLES...
  * @param {number} [offset=0]  offset for strided data
  * @memberof ArrayBuffer.prototype
  */
    draw(mode, offset = 0)
    {
        this.gl.drawArrays(mode, offset, this.length);
    }
}

export default ArrayBuffer;
