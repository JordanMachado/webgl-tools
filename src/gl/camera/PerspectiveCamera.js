import { vec3, mat4, glMatrix }from 'gl-matrix';
import Object3D from '../core/Object3D';
import Ray from '../math/Ray';

const mInverseViewProj = mat4.create();
let cameraDir = vec3.create();


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
    this.position.x = aEye[0];
    this.position.y = aEye[1];
    this.position.z = aEye[2];
    this.pp = aEye;
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
  generateRay(mScreenPosition, mRay) {
    const proj = this.projection;
    const view = this.view;
    const camPos = vec3.fromValues(this.position.x,this.position.y,this.position.z)

    mat4.multiply(mInverseViewProj, proj, view);
    mat4.invert(mInverseViewProj, mInverseViewProj);
    // console.log(this.view);


    vec3.transformMat4(cameraDir, mScreenPosition, mInverseViewProj);
    vec3.sub(cameraDir, cameraDir, camPos);
    vec3.normalize(cameraDir, cameraDir);


    if (!mRay) {
      mRay = new Ray(camPos, cameraDir);
    } else {
      mRay.origin = camPos;
      mRay.direction = cameraDir;



    }


    return mRay;
  }

  get view() {	return this._view;	}

	get projection() {	return this._projection;	}

}
