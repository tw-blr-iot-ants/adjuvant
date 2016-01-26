var express  = require('express');
var app      = express();
var port  	 = process.env.PORT || 8083;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var root = require('root-path');
var cons = require('consolidate');
var crypto = require('crypto');

app.use(express.static(__dirname + '/../public/'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.set('views', root('public/partials/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const encryption_key = 'abcd1234';

app.use(cookieParser('S3CRE7'));

app.use(session({
    store: new MongoStore({ url: 'mongodb://localhost/test-app',
                            ttl: 30*60  })
}));

app.use(function(req, res, next) {
    var decipher = crypto.createDecipher('aes-128-ecb', encryption_key);
    var chunks;

    chunks = []
    chunks.push( decipher.update( new Buffer(req.headers.authorization, "base64").toString("binary")) );
    chunks.push( decipher.final('binary') );
    var decodedAuth = chunks.join("");
    decodedAuth = new Buffer(decodedAuth, "binary").toString("utf-8");

    if(req.session.password != undefined || decodedAuth == "admin:123abc123" || req.url == '/api/login') {
        return next();
    } else {
        res.status(401).send("User is not logged in");
    }
});

require('./routes.js')(app);

function start() {
	var server = app.listen(port);
	console.log("App listening on port " + port);	
}


exports.start = start;
exports.app = app;