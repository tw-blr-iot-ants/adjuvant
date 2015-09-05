var express  = require('express');
var app      = express();
var port  	 = process.env.PORT || 8082;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var databaseConfig = require('./config/database');

var db = mongoose.connection;
mongoose.connect(databaseConfig.url);

db.on('error', console.error);
db.once('open', function() {
  console.log("Mongo connection successful")
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));


require('./app/routes.js')(app);

app.listen(port);
console.log("App listening on port " + port);
