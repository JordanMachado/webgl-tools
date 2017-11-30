let img;
let btn = document.createElement('a');

export default class Screenshot {
  constructor(scene) {
    this.scene = scene;
    const debug = document.createElement('div');
    debug.id = 'debug';

    btn.id = 'screenshot'
    btn.innerHTML = 'screenshot';

    img = new Image();

    debug.appendChild(btn);
    document.body.appendChild(debug);
    btn.addEventListener('mousedown', ()=>{
      this.capture();
    });
    btn.addEventListener('mouseup', ()=>{
      btn.download = 'screen';
    });
  }
  capture() {
      this.scene.render();
      img.src = this.scene.webgl.canvas.toDataURL();
      btn.href = img.src;
  }
}
