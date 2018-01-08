import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from './dev/Query';
import SuperConfig from './dev/SuperConfig';
import AssetManifest from './AssetManifest';
import Scene from './Scene';
import SceneDev from './SceneDev';

const loader = assetsLoader({
  assets: AssetManifest
});

window.getAsset = function(id) {
  return loader.get(`assets/${id}`);
}

domready(()=> {

  if(AssetManifest.length > 0) {
    document.body.classList.add('loading');
    loader.on('complete', function(assets) {
     document.body.classList.remove('loading');
     document.title = SuperConfig.config.name;

     window.assets = assets;
     init();
     
     if(Query.debug)
      console.table(assets);
   })
   .start();
  } else {
    init();
  }

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
