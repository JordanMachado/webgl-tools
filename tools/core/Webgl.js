import { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } from '../const/webglConst';
import _fallback from '../utils/fallback';
import Debug from '../utils/Debug';
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
    this.context = this.gl = this.canvas.getContext(type, contextOptions);

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
      Debug.log(`Vanilla`);
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
  resize() {

    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CreateContextWebgl;
