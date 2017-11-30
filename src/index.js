import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from './Query';
import Scene from './Scene';
import SceneDev from './SceneDev';

const loader = assetsLoader({
  assets: [
    // 'assets/img/ground_asphalt_05_normal.jpg',
    // 'assets/img/height.png',
  ]
});

window.getAsset = function(id) {
  return loader.get(`assets/${id}`);
}

domready(()=> {
  // if()
  // loader.on('complete', function(assets) {
   // document.body.classList.remove('loading');
   // window.assets = assets;
   // if(Query.debug)
    // console.table(assets);
   init();
 // })
 // .start();
});

let scene;

function init() {
  if(Query.develop) {
    scene = new SceneDev()
  } else {
    scene = new Scene();    
  }

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
