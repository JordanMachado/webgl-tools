import Debug from '../utils/Debug';

class Extension {
  constructor(gl) {

  }
  setGl(gl) {
    this.gl = gl;
  }
  active(name) {
    Debug.info(`Activing: ${name}`)

    let extension = gl.getExtension(name)
    if(extension) {
      Debug.log(`Actived`)

      for (const key in extension) {
        if(typeof extension[key] === 'function') {
          const keyWithoutSuff = key.replace(/OES|MOZ_OES|WEBKIT_OES/g, '');
          this.gl[keyWithoutSuff] = extension[key].bind(extension);
          // console.log(keyWithoutSuff);
        }
      }
    } else {
      Debug.error(`Extension: {name} is not available on this device`);
    }


  }
}

export default new Extension();
