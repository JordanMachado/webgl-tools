export default class Extension {
  constructor(gl) {

    const available_extensions = gl.getSupportedExtensions();
    // console.log(available_extensions);

    var vao = (
      gl.getExtension('OES_vertex_array_object') ||
      gl.getExtension('MOZ_OES_vertex_array_object') ||
      gl.getExtension('WEBKIT_OES_vertex_array_object')
    );

    if(vao) {

        for(const key in vao) {
          if(key.indexOf('OES'))
          gl.vao = true;
          if(typeof vao[key] === 'function') {
            const keyWithoutSuff = key.replace(/OES|MOZ_OES|WEBKIT_OES/g, '')
            console.log(keyWithoutSuff);
            gl[keyWithoutSuff] = vao[key].bind(vao);
          }
        }
    }

  }
}
