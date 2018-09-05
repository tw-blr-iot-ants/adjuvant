var mongoose = require('mongoose');
var databaseConfig = require('./config/database');

var db = mongoose.connection;
mongoose.connect(databaseConfig.testUrl, { useNewUrlParser: true })

db.on('error', console.error);
db.once('open', function() {
  console.log("Mongo connection successful")
});