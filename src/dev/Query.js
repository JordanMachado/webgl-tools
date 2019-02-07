import url from 'fast-url-parser';
import defaultConfig from '../DefaultConfig';
url.queryString = require('querystringparser');

class Query {
  constructor() {
    this.parseQuery();
  }
  init(config) {
    if(!this.config) {
      this.config = config ? config : defaultConfig;
    }
  }
  parseQuery() {

    const parsed = url.parse(window.location.search, true);
    for(const key in parsed.query) {
      if(parsed.query[key] === 'true') {
        this[key] = true;
      } else if(parsed.query[key] === 'false') {
        this[key] = false;
      } else {
        this[key] = JSON.parse(parsed.query[key]);
      }
    }


  }

}
export default new Query();
