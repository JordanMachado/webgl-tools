import { vec3, mat4, glMatrix }from 'gl-matrix';
import Object3D from '../core/Object3D';

export default class PerspectiveCamera extends Object3D {
  constructor(fieldOfViewDegree, aspect, zNear, zFar) {
    super();
    this.fieldOfView = fieldOfViewDegree;
    this._apsect = aspect;
    this.zNear = zNear;
    this.zFar = zFar;

    this._view = mat4.create();
    this._projection = mat4.create();
    this._projection = mat4.perspective(this._projection,
      glMatrix.toRadian(fieldOfViewDegree),
      aspect,
      zNear,
      zFar,
    );
  }
  lookAt(aEye, aCenter, aUp = [0, 1, 0]) {
    vec3.copy(this.position, aEye);
    mat4.identity(this._view);
    mat4.lookAt(this._view, aEye, aCenter, aUp);
  }
  updateProjectionMatrix() {
    this._projection = mat4.perspective(this._projection,
      glMatrix.toRadian(this.fieldOfView),
      this._apsect,
      this.zNear,
      this.zFar,
    );
  }
  get aspect() {
    return this._apsect;
  }
  set aspect(value) {
    this._apsect = value;
    this.updateProjectionMatrix();
  }

  get view() {	return this._view;	}

	get projection() {	return this._projection;	}

}
