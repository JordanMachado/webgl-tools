import url from 'fast-url-parser';
url.queryString = require('querystringparser');

class Query {
  constructor() {
    this.parseQuery();
  }
  parseQuery() {
    const parsed = url.parse(window.location.search, true);
    for(const key in parsed.query) {
      this[key] = parsed.query[key] === 'true';
    }
  }

}
export default new Query();
