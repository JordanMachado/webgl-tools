import Debug from '../utils/Debug';

class Extension {
  constructor(gl) {
    // const available_extensions = gl.getSupportedExtensions();
    // // console.log(available_extensions);
    //
    // var vao = (
    //   gl.getExtension('OES_vertex_array_object') ||
    //   gl.getExtension('MOZ_OES_vertex_array_object') ||
    //   gl.getExtension('WEBKIT_OES_vertex_array_object')
    // );
    //
    // if(vao) {
    //
    //     for(const key in vao) {
    //       if(key.indexOf('OES'))
    //       gl.vao = true;
    //       if(typeof vao[key] === 'function') {
    //         const keyWithoutSuff = key.replace(/OES|MOZ_OES|WEBKIT_OES/g, '')
    //         console.log(keyWithoutSuff);
    //         gl[keyWithoutSuff] = vao[key].bind(vao);
    //       }
    //     }
    // }

  }
  setGl(gl) {
    this.gl = gl;
  }
  active(name) {
    Debug.log(`Activing: ${name}`)

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
