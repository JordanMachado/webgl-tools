import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import AssetManifest from './AssetManifest';
import Scene from './Scene';
import SceneDev from './SceneDev';
import AllExperiments from './Experiments';

let manifest = AssetManifest;
if(Query.experiment && AllExperiments[Query.experiment]) {
  if(AllExperiments[Query.experiment].manifest && AllExperiments[Query.experiment].manifest.length > 0) {
    manifest = AllExperiments[Query.experiment].manifest;
  }
}
const loader = assetsLoader({
  assets: manifest
});

window.getAsset = function(id) {
  return loader.get(`assets/${id}`);
}

domready(()=> {

  if(manifest.length > 0) {
    document.body.classList.add('loading');
    loader.on('complete', function(assets) {
     document.body.classList.remove('loading');
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
  const container = document.querySelector("#experiments-list");


  if(Query.experiment) {
      scene = new AllExperiments[Query.experiment].scene;
      container.style.display = 'none';
      SuperConfig.init(AllExperiments[Query.experiment].config);
      document.title= AllExperiments[Query.experiment].config.name || 'Experiment';

  } else {
    console.log('LISTINGS All experiments to not forget those');
    container.style.display = 'block';
    for(const id in AllExperiments) {
      let btn = document.createElement('button');
      btn.innerHTML = id;
      btn.addEventListener('click', ()=>{
        let params = `?experiment="${id}"`;
        window.history.pushState('experiment', 'Title', `${window.location.origin + window.location.pathname + params}`);
        window.location.reload()

      })
      container.appendChild(btn);

    }
    // if(Query.develop) {
    //   scene = new SceneDev()
    // } else {
    //   scene = new Scene();
    // }
  }

  render();
  window.addEventListener('resize', resize);

}

function resize() {
  if(scene)
  scene.resize();
}
function render() {
  raf(render);
  if(scene)
  scene.render();
}
