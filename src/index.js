import raf from 'raf';
import assetsLoader from 'assets-loader';
import domready from 'domready';
import Query from 'dev/Query';
import SuperConfig from 'dev/SuperConfig';
import AllExperiments from './Experiments';

let manifest = [];

if (Query.experiment && AllExperiments[Query.experiment])
{
    if (AllExperiments[Query.experiment].manifest && AllExperiments[Query.experiment].manifest.length > 0)
    {
        manifest = AllExperiments[Query.experiment].manifest;
    }
}
const loader = assetsLoader({
    assets: manifest,
});

window.getAsset = function getAsset(id)
{
    return loader.get(`assets/${id}`);
};

domready(() =>
{
    if (manifest.length > 0)
    {
        document.body.classList.add('loading');
        loader.on('complete', function loaded(assets)
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
    const container = document.querySelector('#experiments-list');

    if (Query.experiment)
    {
        scene = new AllExperiments[Query.experiment].scene();
        container.style.display = 'none';
        SuperConfig.init(AllExperiments[Query.experiment].config);
        document.title = AllExperiments[Query.experiment].config.name || 'Experiment';
    }
    else
    {
        console.log('LISTINGS All experiments to not forget those');
        container.style.display = 'block';
        for (const id in AllExperiments)
        {
            const btn = document.createElement('button');

            btn.innerHTML = id;
            btn.addEventListener('click', () =>
            {
                const params = `?experiment="${id}"`;

                window.history.pushState('experiment', 'Title',
                    `${window.location.origin + window.location.pathname + params}`);
                window.location.reload();
            });
            container.appendChild(btn);
        }
    }

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
