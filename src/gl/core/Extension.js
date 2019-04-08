import Debug from '../utils/Debug';

class Extension
{
    /**
  * @func  setGl
  * @description  Set the webgl context
  * @memberof Extension.prototype
  */
    setGl(gl)
    {
        this.gl = gl;
    }
    /**
  * @func  active
  * @description  Active a webgl extension
  * @param {string} name name of the extension
  * @memberof Extension.prototype
  */
    active(name)
    {
        Debug.info(`Activing: ${name}`);

        const extension = gl.getExtension(name);

        if (extension)
        {
            Debug.log(`Actived`);

            for (const key in extension)
            {
                if (typeof extension[key] === 'function')
                {
                    const keyWithoutSuff = key.replace(/OES|MOZ_OES|WEBKIT_OES/g, '');

                    this.gl[keyWithoutSuff] = extension[key].bind(extension);
                    // console.log(keyWithoutSuff);
                }
            }
        }
        else
        {
            Debug.error(`Extension: {name} is not available on this device`);
        }
    }
}

export default new Extension();
