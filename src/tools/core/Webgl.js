import { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } from '../const/webglConst';
import _fallback from '../utils/fallback';
import Debug from '../utils/Debug';
import { mat4, mat3 } from 'gl-matrix';
import Texture from './Texture';
import TextureCube from './TextureCube';
import Ext from './Extension';
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
class CreateContextWebgl {
  constructor({
    type = 'webgl',
    canvas = null,
    width = window.innerWidth,
    height = window.innerHeight,
    contextOptions = {},
    fallback = null,
  } = {}) {
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
      Debug.print(`Vanilla GL`);
      Debug.print(`https://github.com/JordanMachado/webgl-tools`);
      Debug.log(`${type} created`);

    }
  }
  append(container) {
    if (container) {
      container.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
  }
  clearColor(r, v, b, a) {
    this.gl.clearColor(r, v, b, a);
  }
  clear(r, v, b, a) {
    this.gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  }
  useProgram(program) {
    if (this.shader === shader) return;
    this.shader = shader;
    this.gl.useProgram(shader.program);
  }
  setDefaultUniforms(mesh, camera) {
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
 unbindBuffer(mesh) {
   for (const key in mesh.geometry.attributes) {
     let str = `a ${key}`;

     let aKey = camelize(str.substring(0, str.length - 1));
     if(mesh.geometry.attributes[key].instanced) {
       mesh.geometry.attributes[key].attribPointerInstanced(mesh.shader.program.attributes[aKey], 0);
     }
   }
 }
 attr(mesh) {
   for (const key in mesh.geometry.attributes) {
     let str = `a ${key}`;

     let aKey = camelize(str.substring(0, str.length - 1));
     if(mesh.geometry.attributes[key].instanced) {
       mesh.geometry.attributes[key].attribPointerInstanced(mesh.shader.program.attributes[aKey], mesh.geometry.attributes[key].divisor);
     } else {
       mesh.geometry.attributes[key].attribPointer(mesh.shader.program.attributes[aKey]);
     }
   }


 }
 render(mesh, camera) {

    mesh.shader.program.bind();
    this.setDefaultUniforms(mesh, camera);
    this.setUniforms(mesh);
    this.bindBuffer(mesh);
    mesh.geometry.indices.bind()

    if(mesh.geometry.instanced) {
      mesh.geometry.indices.drawInstance(mesh.drawType,   mesh.geometry.attributes.offsets._data.length/4);
    } else {
      mesh.geometry.indices.draw(mesh.drawType);
    }
    this.unbindBuffer(mesh);

    if(mesh.children.length > 0) {
      for (var i = 0; i < mesh.children.length; i++) {
        this.render(mesh.children[i], camera);
      }
    }

  }
  resize() {

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CreateContextWebgl;
