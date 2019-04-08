import Numbers from '../const/webglNumber';

export default class Texture3D
{
    constructor(context, width, height, depth)
    {
        this.gl = context;
        this.id = this.gl.createTexture();

        this.width = width || -1;
        this.height = height || -1;
        this.depth = depth || -1;

        // this.format = this.gl.RGB;
        this.format = this.gl.RED;
        // this.internalformat = this.gl.RGB;
        this.internalformat = this.gl.R8;
        this.type = this.gl.UNSIGNED_BYTE;

        this.minFilter = this.gl.LINEAR;
        this.magFilter = this.gl.LINEAR;
        this.wrapS = this.gl.CLAMP_TO_EDGE;
        this.wrapT = this.gl.CLAMP_TO_EDGE;
    }
    upload(image, width, height, depth)
    {
        this.gl.bindTexture(this.gl.TEXTURE_3D, this.id);

        this.gl.texImage3D(this.gl.TEXTURE_3D, 0, this._internalformat,
            image.width, image.height, depth, 0, this._format, this._type, image);
    }
    uploadData(data, width, height, depth)
    {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.gl.bindTexture(this.gl.TEXTURE_3D, this.id);
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_BASE_LEVEL, 0);
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAX_LEVEL, Math.log2(depth));

        if (data instanceof Float32Array)
        {
            // get extension check
            this.gl.getExtension('OES_texture_float');

            this.type = this.gl.FLOAT;
        }

        this.gl.texImage3D(this.gl.TEXTURE_3D, 0, this._internalformat,
            width, height, depth, 0, this._format, this._type, data || null);

        this.unbind();
    }
    set magFilter(value)
    {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAG_FILTER, value);
        this._magFilter = value;
    }
    get magFilter()
    {
        return Numbers[this._magFilter];
    }
    set minFilter(value)
    {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MIN_FILTER, value);
        this._minFilter = value;
    }
    get minFilter()
    {
        return Numbers[this._minFilter];
    }
    set wrapS(value)
    {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_S, value);

        this._wrapS = value;
    }
    get wrapS()
    {
        return Numbers[this._wrapS];
    }
    set wrapT(value)
    {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_T, value);

        this._wrapT = value;
    }
    get wrapT()
    {
        return Numbers[this._wrapT];
    }
    set type(value)
    {
        this._type = value;
    }
    get type()
    {
        return Numbers[this._type];
    }
    set format(value)
    {
        this._format = value;
    }
    get format()
    {
        return Numbers[this._format];
    }
    set internalformat(value)
    {
        this._internalformat = value;
    }
    get internalformat()
    {
        return Numbers[this._internalformat];
    }
    bind(unit)
    {
        if (unit)
        { this.gl.activeTexture(this.gl.TEXTURE0 + unit); }
        this.gl.bindTexture(this.gl.TEXTURE_3D, this.id);
    }
    unbind()
    {
        this.gl.bindTexture(this.gl.TEXTURE_3D, null);
    }
}
