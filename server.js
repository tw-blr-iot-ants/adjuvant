var express  = require('express');
var app      = express();
var port  	 = process.env.PORT || 8082;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));


require('./app/routes.js')(app);

app.listen(port);
console.log("App listening on port " + port);
