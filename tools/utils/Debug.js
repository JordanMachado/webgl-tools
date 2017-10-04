class Debug {
  constructor() {
    this.verbose = true;
  }
  group(message) {
    if (!this.verbose) return;
    console.group(`%c ${message} `, 'background: #222; color: #ffffff');
  }
  groupEnd() {
    if (!this.verbose) return;
    console.groupEnd();
  }
  print(message) {
    console.log(`%c ${message} `, 'background: #222; color: #ffffff');
  }
  log(message) {
    if (!this.verbose) return;
    console.log(`%c ${message} `, 'background: #222; color: #ffffff');
  }
  error(message, obj = '') {
    if (!this.verbose) return;
    console.log(`%c ${message} `,'background: #f65959; color: #ffffff', obj);
  }
}
const debug = new Debug();
export default debug;
