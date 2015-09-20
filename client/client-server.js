var express  = require('express');
var app      = express();
var SerialPort = require("serialport").SerialPort;
var port  	 = process.env.PORT || 8084;
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

var server = app.listen(port);
console.log("App listening on port " + port);

var io = require('socket.io').listen(server);

var serialport = new SerialPort("/dev/tty.usbmodem1411", {
       baudrate: 9600,
       parser: require("serialport").parsers.readline("\n")
});


serialport.on("error", function(err) {
	console.log("error in opening serial connection err: ", err);
});

serialport.on('open', function(){
	console.log('Serial Port Opened');

	io.sockets.on('connection', function (socket) {
		console.log('Socket connected');
		serialport.on('data', function(data){
				socket.emit('data', {msg: data});
		});
	});
});


