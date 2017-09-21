
import glm from 'gl-matrix';
import Object3D from '../core/Object3D';

export default class PerspectiveCamera extends Object3D {
  constructor(left, right, bottom, top, zNear, zFar) {
    super();

    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.zNear = zNear;
    this.zFar = zFar;
    this.projection = glm.mat4.create();
    this.projection = glm.mat4.ortho(this.projection,
      left,
      right,
      bottom,
      top,
      zNear,
      zFar,
    );
  }
  lookAt(aEye, aCenter, aUp = [0, 1, 0]) {
    glm.vec3.copy(this.position, aEye);
    glm.mat4.identity(this.matrix);
    glm.mat4.lookAt(this.matrix, aEye, aCenter, aUp);
  }
  updateProjectionMatrix() {
    this.projection = glm.mat4.ortho(this.projection,
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.zNear,
      this.zFar,
    );
  }

}
