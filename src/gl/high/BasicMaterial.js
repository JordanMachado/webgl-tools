import Shader from './Shader';
const glslify = require('glslify');

function filterEmptyLine( string ) {

	return string !== '';

}

export default class Material extends Shader {
  constructor(options = {}) {
    // console.log(glslify('../shaders/basic.vert'));
    let vs = glslify('../shaders/basic.vert');
    let fs = glslify('../shaders/basic.frag');
    // console.log(vs);
    let prefixVs = [
      options.color ? '#define COLOR' : '',
    ].filter( filterEmptyLine ).join('\n');

    let prefixFs = [
      options.color ? '#define COLOR' : '',
      options.texture ? '#define TEXTURE' : '',
    ].filter( filterEmptyLine ).join('\n');

    const vertex = prefixVs + '\n' + vs;
    const fragment = prefixFs + '\n' + fs;
    // console.log(vertex);
    // console.log(options.color);
    super(vertex, fragment,  {
      uColor: options.color || [0,0,0],
      texture: options.texture || null
    }, 'BasicMaterial');
  }
}
