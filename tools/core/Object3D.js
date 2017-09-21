import * as glm from 'gl-matrix';

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


let hasCameraUniformSetup = false;
let uniformsCamera;

const useUniformGroup = false;

export default class Object3D {
  constructor() {
    this.visible = true;
    this.uuid = uuid();

    this._needUpdate = true;

    this._position = glm.vec3.create();
    this._rotation = glm.vec3.create();
    this._scale = glm.vec3.fromValues(1, 1, 1);

    this._matrix = glm.mat4.create();
    this._matrixWorld = glm.mat4.create();
    this._matrixRotation = glm.mat4.create();
    this._matrixScale = glm.mat4.create();
    this._matrixTranslation = glm.mat4.create();
    this._matrixIdentity = glm.mat4.create();

    this.parent = null;
    this.children = [];
  }
  _updateMatrix() {
    if(!this.visible) {
      return;
    }

    // glm.mat4.identity(this._matrixTranslation, this._matrixTranslation);
    // glm.mat4.identity(this._matrixScale, this._matrixScale);
    // glm.mat4.identity(this._matrixRotation, this._matrixRotation);

    glm.mat4.rotateX(this._matrixRotation, this._matrixIdentity, this.rotation[0]);
    glm.mat4.rotateY(this._matrixRotation, this._matrixRotation, this.rotation[1]);
    glm.mat4.rotateZ(this._matrixRotation, this._matrixRotation, this.rotation[2]);

    glm.mat4.scale(this._matrixScale, this._matrixIdentity, this._scale);
    glm.mat4.translate(this._matrixTranslation, this._matrixIdentity, this._position);

    glm.mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation);
    glm.mat4.mul(this._matrix, this._matrix, this._matrixScale);
    this._updateMatrixWorld();
    this._needUpdate = false;

  }
  _updateMatrixWorld() {
    if(!this.visible) {
      return;
    }

    if (this.parent) {
      glm.mat4.multiply(this._matrixWorld, this.parent._matrixWorld, this._matrix);
    } else {
      glm.mat4.copy(this._matrixWorld, this._matrix);
    }

    for (let i = 0, l = this.children.length; i < l; i += 1) {
      this.children[i]._updateMatrixWorld();
    }
  }
  set x(value) {
    this._needUpdate = true;
    this._position[0] = value;
  }
  get x() {
    return this._position[0];
  }
  set y(value) {
    this._needUpdate = true;
    this._position[1] = value;
  }
  get y() {
    return this._position[1];
  }
  set z(value) {
    this._needUpdate = true;
    this._position[2] = value;
  }
  get z() {
    return this._position[2];
  }
  set position(value) {
    this._needUpdate = true;
    this._position = value;
  }
  get position() {
    return this._position;
  }
  set rx(value) {
    this._needUpdate = true;
    this._rotation[0] = value;
  }
  get rx() {
    return this._rotation[0];
  }
  set ry(value) {
    this._needUpdate = true;
    this._rotation[1] = value;
  }
  get ry() {
    return this._rotation[1];
  }
  set rz(value) {
    this._needUpdate = true;
    this._rotation[2] = value;
  }
  get rz() {
    return this._rotation[2];
  }
  set rotation(value) {
    this._needUpdate = true;
    this._rotation = value;
  }
  get rotation() {
    return this._rotation;
  }
  set sx(value) {
    this._needUpdate = true;
    this._scale[0] = value;
  }
  get sx() {
    return this._scale[0];
  }
  set sy(value) {
    this._needUpdate = true;
    this._scale[1] = value;
  }
  get sy() {
    return this._scale[1];
  }
  set sz(value) {
    this._needUpdate = true;
    this._scale[2] = value;
  }
  get sz() {
    return this._scale[2];
  }
  set scale(value) {
    this._needUpdate = true;
    this._scale = value;
  }
  get scale() {
    return this._scale;
  }
  // get positionWorld() {
  //   if (!this.parent) return this.position;
  //   return [this.parent.position[0] + this.position[0], this.parent.position[1] + this.position[1], this.parent.position[2] + this.position[2]];
  // }
  get positionWorld() {
    if (!this.parent) return this._position;
    return [this.parent._position[0] + this._position[0], this.parent._position[1] + this._position[1], this.parent._position[2] + this._position[2]];
  }
  get matrixWorld() {
    if (this._needUpdate) this._updateMatrix();
    return this._matrixWorld;
  }
  get matrix() {
    if (this._needUpdate) this._updateMatrix();
    return this._matrix;
  }
  addChild(object) {
    // if has already a parent only one parent
    if(object.parent) {
      const ndx = object.parent.children.indexOf(this);
      if(ndx >= 0) {
        object.parent.children.splice(ndx, 1);
      }
    }
    object.parent = this;
    this.children.push(object);
  }
}
