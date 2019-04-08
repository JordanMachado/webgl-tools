module.exports = function fallback(message)
{
    if (!message) message = 'Webgl 2 not supported by your browser';
    const el = document.createElement('div');

    el.classList = 'fallback';
    el.style.position = 'absolute';
    el.style.backgroundColor = 'black';
    el.style.top = 0;
    el.style.left = 0;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.textAlign = 'center';
    el.style.zIndex = '99';

    const p = document.createElement('p');

    p.style.position = 'absolute';
    p.style.top = '50%';
    p.style.left = '50%';
    p.style.color = 'white';
    p.style.transform = 'translate(-50%,-50%)';
    p.style.color = 'white';
    p.innerHTML = message;
    el.appendChild(p);
    document.body.appendChild(el);
};
