class State {
  constructor() {
    // all state
    this.capabilities = {};
  }
  enable(id) {
    if (this.capabilities[id] !== true) {
      gl.enable(id);
      this.capabilities[id] = true;
    }
  }
  disable(id) {
    if (this.capabilities[id] !== false) {
      gl.disable(id);
      this.capabilities[id] = false;
    }
  }
}

const state = new State();
export default state;
