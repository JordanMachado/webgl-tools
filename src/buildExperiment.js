import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import AllExperiments from './Experiments';

const experimentName = 'particles';

let manifest = [];

if (experimentName && AllExperiments[experimentName])
{
    if (AllExperiments[experimentName].manifest && AllExperiments[experimentName].manifest.length > 0)
    {
        manifest = AllExperiments[experimentName].manifest;
    }
}
const loader = assetsLoader({
    assets: manifest,
});

window.getAsset = function (id)
{
    return loader.get(`assets/${id}`);
};

domready(() =>
{
    if (manifest.length > 0)
    {
        document.body.classList.add('loading');
        loader.on('complete', function (assets)
        {
            document.body.classList.remove('loading');
            window.assets = assets;
            init();
            if (Query.debug)
            { console.table(assets); }
        })
            .start();
    }
    else
    {
        init();
    }
});

let scene;

function init()
{
    scene = new AllExperiments[experimentName].scene();
    Query.init(AllExperiments[experimentName].config);
    SuperConfig.init(AllExperiments[experimentName].config);
    document.title = AllExperiments[experimentName].config.name || 'Experiment';
    render();
    window.addEventListener('resize', resize);
}

function resize()
{
    if (scene)
    { scene.resize(); }
}
function render()
{
    raf(render);
    if (scene)
    { scene.render(); }
}
