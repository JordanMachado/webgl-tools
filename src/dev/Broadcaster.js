// Broadcaster.js
import { EventEmitter } from 'events';
import SuperConfig from './SuperConfig';

class Broadcaster extends EventEmitter
{
    constructor()
    {
        super();
        window.broadcaster = this;
    }
    emit(...args)
    {
        super.emit(...args);
        if (SuperConfig.query.debug)
        {
            console.log('Broadcaster emit:', ...args);
        }
    }
}

const instance = new Broadcaster();

export default instance;
