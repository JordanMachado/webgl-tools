import Texture from './core/Texture';

let index = 0;

export default class TextureLoader
{
    constructor(gl)
    {
        this.gl = gl;
        this.textures = {};
        index = 0;
    }
    load(src, cb)
    {
        if (typeof src === 'object')
        {
            const imagesToLoad = src.length;
            let imagesLoaded = 0;

            for (let i = 0; i < src.length; i += 1)
            {
                const img = new Image();

                img.addEventListener('load', () =>
                {
                    const tex = new Texture(this.gl);

                    tex.upload(img);
                    const name = this.getTextureName(src[i]);

                    this.textures[name] = tex;
                    imagesLoaded++;
                    if (imagesLoaded === imagesToLoad && cb)
                    {
                        cb(this.textures);
                    }
                });
                img.src = src[i];
            }
        }
        else
        {
            const img = new Image();

            img.addEventListener('load', () =>
            {
                const tex = new Texture(this.gl);

                tex.upload(img);
                const name = this.getTextureName(src);

                this.textures[name] = tex;
                if (cb) cb(tex);
            });
            img.src = src;
        }
    }
    getTextureName(src)
    {
        const ary = src.split('/');
        let str = ary[ary.length - 1];
        const lastIndex = str.lastIndexOf('.');

        str = str.substring(0, lastIndex);

        return str;
    }
}
