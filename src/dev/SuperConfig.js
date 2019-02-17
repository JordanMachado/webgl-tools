import Query from './Query';
import dat from 'dat.gui/build/dat.gui.min.js';
import DefaultConfig from '../DefaultConfig';
import Broadcaster from './Broadcaster';
class SuperConfig
{
    constructor()
    {
        window.superConf = this;
        this.query = Query;

    }
    init(conf) {
      const configggg =conf ? conf: DefaultConfig
      Query.init(conf);
      if (!Query.debug)
      {
          this.config = configggg;
          return;
      }
      this.gui = new dat.GUI();
      this.gui.folders = {};

      this.controls = {};

      console.log(this.config);

      if (Query.config)
      {
          this.gui.folders.config = this.gui.addFolder('config');
          this.gui.folders.config.open();
          this.config = Query.config;


          for (const key in configggg)
          {
              if (!Query.config.hasOwnProperty(key))
              {
                  this.config = configggg;
              }
          }
          for (const key in Query.config)
          {
              if (!configggg.hasOwnProperty(key))
              {
                  this.config = configggg;
              }
          }
          this.parseConfig(this.config, this.gui.folders.config);
          this.updateConfig();
      }

      this.gui.folders.root = this.gui.addFolder('experiment');
      this.gui.folders.root.open();
      this.gui.folders.root.add(this, 'reload');
      this.gui.folders.root.add(this, 'log');
    }
    updateConfig()
    {
        let params = '?';

        if (Query.develop)
        { params += 'develop=true&'; }
        console.log(Query.experiment);
        if (Query.experiment)
        { params += `experiment="${Query.experiment}"&`; }
        if (Query.debug)
        { params += 'debug=true&'; }
        if (Query.verbose)
        { params += 'verbose=true&'; }
        window.history.pushState('experiment', 'Title', `${window.location.origin + window.location.pathname + params}config=${JSON.stringify(this.config)}`);
    }
    log()
    {
        this.updateConfig();
        console.log('Current Config:');
        console.log(this.config);
        console.log(JSON.stringify(this.config));
    }
    reload()
    {
        this.updateConfig();
        location.reload();
    }
    parseConfig(object, folder, parent)
    {
        parent = parent ? parent : 'config';
        const broad = parent === 'config' ? '' : parent;

        for (const key in object)
        {
            const obj = object[key];

            if (typeof obj !== 'object' && key.indexOf('range') === -1)
            {
                if (key.indexOf('color') !== -1 || key.indexOf('Color') !== -1)
                {
                    object[key] = object[key].replace('hexa', '#');
                    folder.addColor(object, key).onChange(() =>
                    {
                        this.updateConfig();
                        Broadcaster.emit(`gui_${broad}_${key}`);
                    });
                }
                else
                {
                    folder.add(object, key).onChange(() =>
                    {
                        this.updateConfig();
                        Broadcaster.emit(`gui_${broad}_${key}`);
                    });
                }
            }
            else if (typeof obj === 'object' && obj.min)
            {
                this.gui.folders[key] = this.gui.folders[parent].addFolder(key);
                this.gui.folders[key].open();
                this.gui.folders[key].add(obj, 'value').min(obj.min).max(obj.max).onChange(() =>
                {
                    Broadcaster.emit(`gui_${broad}_${key}`);
                    this.updateConfig();
                });
            }
            else if (typeof obj === 'object' && obj.options)
            {
                this.gui.folders[key] = this.gui.folders[parent].addFolder(key);
                this.gui.folders[key].open();

                this.gui.folders[key].add(obj, 'value', obj.options).onChange(() =>
                {
                    Broadcaster.emit(`gui_${broad}_${key}`);

                    this.updateConfig();
                });
            }
            else if (typeof obj === 'object')
            {
                if (!parent)
                {
                    this.gui.folders[key] = this.gui.folders.config.addFolder(key);
                }
                else
                {
                    this.gui.folders[key] = this.gui.folders[parent].addFolder(key);
                }
                this.gui.folders[key].open();
                this.parseConfig(obj, this.gui.folders[key], key, parent ? parent : 'config');
            }
        }
    }
    addChange(obj, fn)
    {
        if (!Query.debug) return;
        if (!obj.__changeFns)
        {
            obj.__changeFns = [];
        }
        obj.__changeFns.push(fn);
        obj.onFinishChange(() =>
        {
            for (let i = 0; i < obj.__changeFns.length; i++)
            {
                obj.__changeFns[i]();
            }
        });
    }
}
export default new SuperConfig();
