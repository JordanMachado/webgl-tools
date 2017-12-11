import url from 'fast-url-parser';
import defaultConfig from '../DefaultConfig';
url.queryString = require('querystringparser');

class Query {
  constructor() {
    this.parseQuery();
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

    if(!this.config) {
      this.config = defaultConfig;
    }
  }

}
export default new Query();
