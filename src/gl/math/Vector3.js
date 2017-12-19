import * as glm from 'gl-matrix';

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this._xyz = glm.vec3.fromValues(x, y, z);
    // this._x =
  }
  get() {
    return this._xyz;
  }
  set (x, y, z) {
    if(arguments > 1) {
      this._xyz[0]  = x;
      this._xyz[1]  = y;
      this._xyz[2]  = z;
    } else {
      this._xyz[0]  = x;
      this._xyz[1]  = x;
      this._xyz[2]  = x;
    }

    this.onChangeCallback();
    return this;
  }
  get x() {
    return this._xyz[0];
  }
  set x(value) {
    this._xyz[0] = value;
    this.onChangeCallback();
  }
  get y() {
    return this._xyz[1];
  }
  set y(value) {
    this._xyz[1] = value;
    this.onChangeCallback();
  }
  get z() {
    return this._xyz[2];
  }
  set z(value) {
    this._xyz[2] = value;
    this.onChangeCallback();
  }


}


Object.assign(Vector3.prototype, {
  onChange: function(fn) {
    this.onChangeCallback = fn
  },
  onChangeCallback: function() {},

});

export default Vector3;
