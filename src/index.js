import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from './Query';
import Scene from './Scene';

const loader = assetsLoader({
  assets: [
    'assets/cubemap/back.png',
    'assets/cubemap/bottom.png',
    'assets/cubemap/front.png',
    'assets/cubemap/left.png',
    'assets/cubemap/right.png',
    'assets/cubemap/top.png',
  ]
});

window.getAsset = function(id) {
  return loader.get(`assets/${id}`);
}

domready(()=> {
  loader.on('complete', function(assets) {
   document.body.classList.remove('loading');
   window.assets = assets;
   if(Query.debug)
    console.table(assets);
   init();
 })
 .start();
});

let scene;

function init() {
  scene = new Scene();
  render();
  window.addEventListener('resize', resize);

}

function resize() {
  scene.resize();
}
function render() {
  raf(render);
  scene.render();
}
