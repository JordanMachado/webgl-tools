import { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } from '../const/webglConst';
import _fallback from '../utils/fallback';
import Debug from '../utils/Debug';
import { mat4, mat3 } from 'gl-matrix';
import Texture from './Texture';
import TextureCube from './TextureCube';
import Ext from './Extension';
import Utils from '../utils/Utils';
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}


let modelViewMatrix = mat4.create();
let inverseModelViewMatrix = mat4.create();
let normalMatrix4 = mat4.create();
let normalMatrix3 = mat3.create();


class Webgl {
/**
  * Constructs a new WebglRenderer
  * @param {object} [params={}]  context type
  * @param {string} [params.type=webgl]  context type
  * @param {object} [params.canvas=null]  canvas to attach the renderer
  * @param {number} [params.width=window.innerWidth]  width of the renderer
  * @param {number} [params.height=window.innerHeight]  height of the renderer
  * @param {object} [params.contextOptions={}]  options to pass to the webgl context
  * @param {function} [params.fallback=null]  function called when webgl is not possible
  */
  constructor({
    type = 'webgl',
    canvas = null,
    width = window.innerWidth,
    height = window.innerHeight,
    contextOptions = {},
    fallback = null,
  } = {}) {
    Debug.print(`Vanilla GL`);
    Debug.print(`https://github.com/JordanMachado/webgl-tools`);

    this.canvas = canvas ? canvas : document.createElement('canvas');
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.width = width * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;
    window.gl = this.context = this.gl = this.canvas.getContext(type, contextOptions);
    Ext.setGl(gl);
    Ext.active('OES_vertex_array_object');
    Ext.active('ANGLE_instanced_arrays');
    Ext.active('OES_standard_derivatives');


    // no webgl2
    if(!!!this.context) {
      console.warn('No Webgl 2');

      if (fallback) {
        if (typeof fallback === 'function') {
          fallback();
        } else {
          console.warn('Fallback is not a function');
        }
      } else {
        _fallback();
      }
    } else {
      this.canvas.width = width * window.devicePixelRatio;
      this.canvas.height = height * window.devicePixelRatio;
      this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.aspect = this.canvas.width / this.canvas.height;


      Debug.info(`${type} created`);

    }
  }
  /**
  * @func  append
  * @description  Append the renderer into an htmlElement
  * @param {object} [container=document.body]  html element to add the canvas
  * @memberof Webgl.prototype
  */
  append(container) {
    if (container) {
      container.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
  }
  /**
  * @func  clearColor
  * @description  Set clearColor of the renderer
  * @param {number} r  red channel
  * @param {number} v  green channel
  * @param {number} b  blue channel
  * @param {number} a  alpha channel
  * @memberof Webgl.prototype
  */
  clearColor(r, g, b, a) {
    if(arguments.length === 2) {
       const color = Utils.hexToRgb(r);
      this.gl.clearColor(color[0], color[1], color[2], g);
    } else if(arguments.length === 4){
      this.gl.clearColor(r, g, b, a);
    } else {
      this.gl.clearColor(r[0],r[1],r[2],1);

    }

  }
  /**
  * @func  clear
  * @description  Clear the color buffer & depth buffer
  * @memberof Webgl.prototype
  */
  clear() {
    this.gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  }
  /**
  * @func  useProgram
  * @description  Set the current program
  * @param {object} program instance of a Shader
  * @memberof Webgl.prototype
  */
  useProgram(program) {
    if (this.shader === shader) return;
    this.shader = shader;
    this.gl.useProgram(shader.program);
  }
  /**
  * @func  setDefaultUniforms
  * @description  Set default uniforms to a mesh
  * @param {object} mesh instance of a Mesh
  * @param {object} camera instance of a Camera
  * @memberof Webgl.prototype
  */
  setDefaultUniforms(mesh, camera) {
    // if container
    if(mesh.parent && !mesh.parent.shader && mesh.parent._needUpdate == true) {
      mesh.parent._updateMatrix()
    }
    mesh.shader.program.uniforms.projectionMatrix = camera.projection;
    mesh.shader.program.uniforms.viewMatrix = camera.view;
    mesh.shader.program.uniforms.worldMatrix = mesh.matrixWorld;
    mesh.shader.program.uniforms.worldMatrix = mesh.matrixWorld;

    if (mesh.geometry.normals) {
      mat4.identity(modelViewMatrix);
      mat4.multiply(modelViewMatrix, camera.view, mesh.matrixWorld);
      mat4.invert(inverseModelViewMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix4, inverseModelViewMatrix);
      mesh.shader.program.uniforms.normalMatrix = mat3.fromMat4(normalMatrix3,normalMatrix4);
    }

  }
  /**
  * @func  setUniforms
  * @description  Set all the uniforms of a mesh
  * @param {object} mesh instance of a Mesh
  * @memberof Webgl.prototype
  */
  setUniforms(mesh) {
    let count = 0;
    for (const key in mesh.shader.uniforms) {
      if(mesh.shader.program.uniforms.hasOwnProperty(key)) {
        if(mesh.shader.uniforms[key] instanceof Texture || mesh.shader.uniforms[key] instanceof TextureCube) {
          mesh.shader.uniforms[key].bindIndex(count)
          mesh.shader.uniforms[key].bind();
          count++
        }
        mesh.shader.program.uniforms[key] = mesh.shader.uniforms[key];
        // console.log(mesh.shader.program.uniforms[key]);

      }
    }
  }
  /**
  * @func  bindBuffer
  * @description  Bind all the buffer of a mesh
  * @param {object} mesh instance of a Mesh
  * @memberof Webgl.prototype
  */
  bindBuffer(mesh) {
    // TODO
    // if(gl.createVertexArray && !mesh.vao && true) {
    //   mesh.vao = gl.createVertexArray();
    //   gl.bindVertexArray(mesh.vao);
    //   this.attr(mesh);
    //   gl.bindVertexArray(null);
    // } else {
    //   if(mesh.vao) {
    //     gl.bindVertexArray(mesh.vao);
    //   } else {
        this.attr(mesh);
      // }
    // }
 }
 /**
 * @func  unbindBuffer
 * @description  Unbind all the buffer of a mesh
 * @param {object} mesh instance of a Mesh
 * @memberof Webgl.prototype
 */
 unbindBuffer(mesh) {
   for (const key in mesh.geometry.attributes) {
     let str = `a ${key}`;

     let aKey = camelize(str.substring(0, str.length - 1));
     if(mesh.geometry.attributes[key].instanced) {
       if(mesh.shader.program.attributes[aKey])

       mesh.geometry.attributes[key].attribPointerInstanced(mesh.shader.program.attributes[aKey], 0);
     }
   }
 }
 /**
 * @func  attr
 * @description  Add all the attributes of a mesh
 * @param {object} mesh instance of a Mesh
 * @memberof Webgl.prototype
 */
 attr(mesh) {
   for (const key in mesh.geometry.attributes) {
     let str = `a ${key}`;
     // console.log(key);

     let aKey = camelize(str.substring(0, str.length - 1));

     if(mesh.geometry.attributes[key].instanced) {
       if(mesh.shader.program.attributes[aKey])
        mesh.geometry.attributes[key].attribPointerInstanced(mesh.shader.program.attributes[aKey], mesh.geometry.attributes[key].divisor);
       else {
         Debug.errorOnce(`Attribute ${aKey} not used in shader : ${mesh.shader.name}`);
       }
     } else {

      if(mesh.shader.program.attributes[aKey])
       mesh.geometry.attributes[key].attribPointer(mesh.shader.program.attributes[aKey]);
     }
   }
 }
 /**
 * @func  render
 * @description  Render to the canvas
 * @param {object|array} mesh instance of a Mesh or array of Mesh
 * @param {object} camera instance of a Camera
 * @memberof Webgl.prototype
 */
 render(mesh, camera) {
   if(mesh.shader) {

     mesh.shader.program.bind();
     if(camera)
      this.setDefaultUniforms(mesh, camera);
     this.setUniforms(mesh);
     this.bindBuffer(mesh);
     if (mesh.geometry.indices) {
       mesh.geometry.indices.bind()
       if(mesh.geometry.instanced) {
         mesh.geometry.indices.drawInstance(mesh.drawType,   mesh.geometry.count);
       } else {
         mesh.geometry.indices.draw(mesh.drawType);
       }
       mesh.geometry.indices.unbind()

     } else {
       mesh.geometry.positions.draw(mesh.drawType);
     }
     this.unbindBuffer(mesh);
   }

    if(mesh.children.length > 0) {
      for (var i = 0; i < mesh.children.length; i++) {
        this.render(mesh.children[i], camera);
      }
    }
  }
  /**
  * @func  resize
  * @description  Resize the canvas
  * @memberof Webgl.prototype
  */
  resize() {

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.aspect = this.canvas.width/this.canvas.height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default Webgl;
