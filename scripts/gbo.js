const path = require('path');
const gboC = require('gbo-reader').convertObjToGbo;
var argv = require('minimist')(process.argv.slice(2));

const source = path.resolve('public/assets', argv.in);
const dest = path.resolve('public/assets', argv.out);
console.log('source:', source);
console.log('dest:', dest);
gboC(source, dest);
