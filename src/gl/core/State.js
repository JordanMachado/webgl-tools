class State {
  /**
    * Instance of the State Mananger
    * @property {object} capabilities
    */
  constructor() {
    // all state
    this.capabilities = {};
  }
  /**
  * @func  enable
  * @description  Enable gl state
  * @param {string} id
  * @memberof State.prototype
  */
  enable(id) {
    if (this.capabilities[id] !== true) {
      gl.enable(id);
      this.capabilities[id] = true;
    }
  }
  /**
  * @func  disable
  * @description  Disable gl state
  * @param {string} id
  * @memberof State.prototype
  */
  disable(id) {
    if (this.capabilities[id] !== false) {
      gl.disable(id);
      this.capabilities[id] = false;
    }
  }
}

const state = new State();
export default state;
