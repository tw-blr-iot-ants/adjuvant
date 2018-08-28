require('@babel/register')
require('./app/database.js');
var dbConfig = require('./app/config/database');

console.log("********************************************");
console.log("Mongo db url", dbConfig.url);
var server = require('./app/server.js');
server.start();