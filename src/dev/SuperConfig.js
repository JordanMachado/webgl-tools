import Query from './Query';
import dat from 'dat.gui/build/dat.gui.min.js';

 class SuperConfig {
  constructor() {
    if(!Query.debug) return;
    this.gui = new dat.GUI();
    this.gui.folders = {};
    this.gui.folders.root = this.gui.addFolder('experiment');
    this.gui.folders.root.open();
    this.gui.folders.root.add(this, 'reload');
    this.gui.folders.root.add(this, 'save');
    this.controls = {}

    if(Query.config) {
      this.gui.folders.config = this.gui.addFolder('config');
      this.gui.folders.config.open();
      this.config = Query.config;

      this.parseConfig(this.config,this.gui.folders.config, 'config');

    }
  }
  updateConfig() {

    let params = '?';
    if(Query.develop)
      params += 'develop=true&';
    if(Query.debug)
      params += 'debug=true&';
    if(Query.verbose)
      params += 'verbose=true&';
    window.history.pushState('experiment', 'Title', '/' + params + 'config=' + JSON.stringify(this.config));

  }
  save() {
    this.updateConfig();
    console.log('Should save the config');
  }
  reload() {
    this.updateConfig();
    location.reload()
  }
  parseConfig(object, folder, name, parent) {

    for (const key in object) {
     const obj = object[key];
     if(typeof obj !== 'object') {
        if(!folder.controllers) {
          folder.controllers = {}
        }
        if(parent) {
          if(!this.controls[parent][name]) this.controls[parent][name] = {};
          this.controls[parent][name][key] = folder.add(object, key);
          this.addChange(this.controls[parent][name][key],()=>{
            this.updateConfig();
          })
        } else {
          if(!this.controls[name]) this.controls[name] = {};
          this.controls[name][key] = folder.add(object, key);
          this.addChange(this.controls[name][key],()=>{
            this.updateConfig();
          })

        }
     } else {
       this.gui.folders[key] = this.gui.folders.config.addFolder(key)
       this.parseConfig(object[key], this.gui.folders[key], key, name)
     }
    }
  }
  addChange(obj, fn) {
    console.log(obj);
    if(!obj.__changeFns) {
      obj.__changeFns = [];
    }
    obj.__changeFns.push(fn);
    obj.onFinishChange(()=> {
      for (var i = 0; i < obj.__changeFns.length; i++) {
        obj.__changeFns[i]();
      }
    })
  }
}
export default new SuperConfig();