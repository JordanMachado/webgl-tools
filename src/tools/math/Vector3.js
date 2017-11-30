import * as glm from 'gl-matrix';

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this._xyz = glm.vec3.fromValues(x, y, z);
  }
  get() {
    return this._xyz;
  }
  set (x, y, z) {
    this._xyz[0]  = x;
    this._xyz[1]  = y;
    this._xyz[2]  = z;
    this.onChangeFn();
    return this;
  }
  get x() {
    return this._xyz[0];
  }
  set x(value) {
    this._xyz[0] = value;
    this.onChangeFn();
  }
  get y() {
    return this._xyz[1];
  }
  set y(value) {
    this._xyz[1] = value;
    this.onChangeFn();
  }
  get z() {
    return this._xyz[2];
  }
  set z(value) {
    this._xyz[2] = value;
    this.onChangeFn();
  }

}


Object.assign(Vector3.prototype, {
  onChange: function(fn) {
    Vector3.prototype.onChangeFn = fn
    return this;
  },
  onChangeFn: function() {},

});

export default Vector3;
