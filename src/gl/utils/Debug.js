const cache = {}
class Debug {
  constructor() {
    this.verbose = false;
  }
  group(message) {
    if (!this.verbose) return;
    console.group(`%c ${message} `, 'color: #262626');
  }
  groupEnd() {
    if (!this.verbose) return;
    console.groupEnd();
  }
  print(message) {
    console.log(`%c ${message} `, 'background: #222; color: #ffffff');
  }
  info(message) {
    if (!this.verbose) return;
    console.log(`%c ${message} `, 'color: #106bba');
  }
  log(message) {
    if (!this.verbose) return;
    console.log(`%c ${message} `, 'color: #1ca51c');
  }
  error(message, obj = '') {
    // if (!this.verbose) return;
    console.log(`%c ${message} `,'background: #f65959; color: #ffffff', obj);
  }
  errorOnce(message, obj = '') {
    // if (!this.verbose) return;
    const id = message.replace(/ /g,'');
    if(!cache[id]) {
      cache[id] = true;
      console.log(`%c ${message} `,'background: #f65959; color: #ffffff', obj);
    }
  }
}
const debug = new Debug();
export default debug;
