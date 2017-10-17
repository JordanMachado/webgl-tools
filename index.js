import raf from 'raf';
import Scene from './Scene';
import ObjParser from './tools/ObjParser'
window.assets = {};
let count = 0;


loaderImg();
function loaderImg() {
  let loaded = 0;

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
      if(count === images.length) {
        loaded++
      }
      if(loaded ===2)
        init();
    }
  }

    var client = new XMLHttpRequest();
    client.open('GET', 'skull.obj');
    client.onload = function(e) {
      loaded++

      // parseObj
      window.assets['skull'] = ObjParser(client.responseText);
      // console.log(client.responseText);
      if(loaded ===2)
        init();
    }

    client.onreadystatechange = function() {
    }
    client.send();
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
