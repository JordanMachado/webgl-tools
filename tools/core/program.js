import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  LINK_STATUS,
  COMPILE_STATUS,
  ACTIVE_UNIFORMS
} from '../const/webglConst';
import webglNumber from '../const/webglNumber';
import Debug from '../utils/Debug';
const uniformMap = {
 FLOAT: 'uniform1f',
 FLOAT_VEC2: 'uniform2f',
 FLOAT_VEC3: 'uniform3f',
 SAMPLER_2D: 'uniform1i',
 FLOAT_MAT3: 'uniformMatrix3fv',
 FLOAT_MAT4: 'uniformMatrix4fv'
 }

 const attributesMapSize = {
  FLOAT: 1,
  FLOAT_VEC2: 2,
  FLOAT_VEC3: 3,
  FLOAT_VEC4: 4,
}


 String.prototype.capitalizeFirstLetter = function() {
     return this.charAt(0).toUpperCase() + this.slice(1);
 }
export default class Program {
  constructor({
    context,
    vertexShader,
    fragmentShader,
    name = '',
  } = {}) {
    this.gl = context;
    this.vs = this.createShader(vertexShader, VERTEX_SHADER);
    this.fs = this.createShader(fragmentShader, FRAGMENT_SHADER);
    this.program = this.createProgram(this.vs, this.fs);
    this.uniforms = this.u = {};
    this.attributes = this.a = {};

    Debug.group(`Program: ${name}`);
    this.buildAttributeGetter();
    this.buildUniformsGetterSetter();
    Debug.groupEnd()


  }
  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    const success = this.gl.getProgramParameter(program, LINK_STATUS);
    if (success) return program;

    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
    return null;
  }
  createShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    const success = this.gl.getShaderParameter(shader, COMPILE_STATUS);
    if (success) return shader;

    console.log(this.gl.getShaderInfoLog(shader));
    console.log(source);

    this.gl.deleteShader(shader);
    return null;
  }
  buildAttributeGetter() {
    var numAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
    Debug.log(`Number of active attributes: ${numAttributes}`);


    for (var i = 0; i < numAttributes; ++i) {
      var attribute = this.gl.getActiveAttrib(this.program, i);
      var aLocation = this.gl.getAttribLocation(this.program, attribute.name);
      attribute.location = aLocation;
      const Afn = `get${attribute.name.capitalizeFirstLetter()}Location`;
      attribute._size = attributesMapSize[webglNumber[attribute.type]];
      this.attributes[attribute.name] = attribute;
      Debug.log(`Attribute generated: ${attribute.name}`)

      // console.log(attributesMapSize[webglNumber[attribute.type]]);
    }

  }
  buildUniformsGetterSetter() {

    const nbActiveUniforms = this.gl.getProgramParameter(this.program, ACTIVE_UNIFORMS);
    Debug.log(`Number of active uniforms: ${nbActiveUniforms}`);

    for (let i = 0; i < nbActiveUniforms; ++i)  {
      let uniform = this.gl.getActiveUniform(this.program, i);
      let uLocation = this.gl.getUniformLocation( this.program, uniform.name );

      let uFunction = uniformMap[webglNumber[uniform.type]];
      Debug.log(`Uniform generated: ${uniform.name}`)
      this.uniforms[uniform.name] = null;
      // console.log('cc');
      Object.defineProperty(this.uniforms, uniform.name, {
        get: () => {
           return uniform.value;
         },
         set: (value) => {
            uniform.value = value;

            if (uFunction.indexOf('Matrix') === -1) {
              if(!value.length) {
                if(uFunction === 'uniform1i') {
                  // console.log(value);
                  this.gl[uFunction](uLocation, value._bindIndex);

                  // console.log(value.id, uLocation);

                  // value.bind();
                } else {
                  this.gl[uFunction](uLocation, value);

                }
              }
              else
                this.gl[uFunction].apply( this.gl, Array.prototype.concat.apply( uLocation, value) );

            } else {
              this.gl[uFunction](uLocation, this.gl.FALSE, value);
            }
         }
       });

    }

  }
  bind() {
    this.gl.useProgram(this.program);
  }
  destroy() {
    this.gl.deleteProgram(this.program);
    this.gl.deleteShader(this.vs);
    this.gl.deleteShader(this.fs);
  }
}
