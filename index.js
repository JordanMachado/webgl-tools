import raf from 'raf';
import Scene from './Scene';
window.assets = {};
let count = 0;


loaderImg();
function loaderImg() {

  let images = [
    'ice-normal.jpg',
    'brick-map.jpg',
    'brick-normal.png',
  ];
  for (var i = 0; i < images.length; i++) {
    let img = new Image();
    let id  = images[i];
    img.src = id;
    img.onload = () => {
      window.assets[id.slice(0, -4)] = img;
      count++;
      if(count === images.length)
        init();
    }
  }
}
let scene;
function init() {
  scene = new Scene();
  render();
}
window.addEventListener('resize', resize);
function resize() {
  scene.resize();

}
function render() {
  raf(render);
  scene.render();
}
