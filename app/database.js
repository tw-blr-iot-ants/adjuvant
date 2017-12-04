var mongoose = require('mongoose');
var databaseConfig = require('./config/database');

var db = mongoose.connection;
console.log(databaseConfig.url);
mongoose.connect(databaseConfig.url);

db.on('error', console.error);
db.once('open', function() {
  console.log("Mongo connection successful " + databaseConfig.url);
});