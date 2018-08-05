var express = require('express');
var app = express();
var port = process.env.PORT || 8083;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var root = require('root-path');
var cons = require('consolidate');
var crypto = require('crypto');
var path = require('path');
var LOGGER = require(path.resolve('app/services/log'));
var dbConfig = require(path.resolve('app/config/database'));
var helmet = require('helmet');

app.use(express.static(__dirname + '/../public/'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.set('views', root('public/partials/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(helmet());

app.use(function(req, res, next) {
    res.header('X-Frame-Options','DENY');
    res.header('Cache-Control', "no-cache, no-store, must-revalidate");
    res.header('Pragma', "no-cache");
    res.header('X-Content-Type-Options','nosniff');
    res.header('x-xss-protection','1');
    next();
});

const encryption_key = process.env.ENCRYPTION_KEY;

app.use(cookieParser('S3CRE7'));

app.use(session({
    store: new MongoStore({
        url: dbConfig.url || 'mongodb://localhost:27017/testAdjuvant',
        ttl: 30 * 60
    }),
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET_KEY
}));

app.use(function (req, res, next) {
    var decodedAuth = "";
    try {
        if(req.headers.authorization) {
            var decipher = crypto.createDecipher('aes-128-ecb', encryption_key);
            var chunks;
            chunks = [];
            chunks.push( decipher.update( new Buffer(req.headers.authorization, "base64").toString("binary")) );
            chunks.push( decipher.final('binary') );

            decodedAuth = chunks.join("");
            var decodedAuth1 = new Buffer(decodedAuth, "binary").toString("utf-8");
        }

        if(req.session.password !== undefined || decodedAuth === process.env.AUTH_KEY || req.url === '/api/login') {
            res.header('X-Frame-Options','DENY');
            res.header('Cache-Control', "no-cache, no-store, must-revalidate");
            res.header('Pragma', "no-cache");
            res.header('X-Content-Type-Options','nosniff');
            res.header('x-xss-protection','1');
            return next();
        } else {
            res.status(401).send("User is not logged in");
        }
    } catch (e){
        throw e
    }

});

require('./routes.js')(app);

function start() {
    var server = app.listen(port);
    console.log("App listening on port " + port);
}

app.use(function (err, req, res, next) {
    console.error(err.stack);
    LOGGER.error("Unknown error occurs " + err);
    res.status(500).end("Unknown error occurs")
});

exports.start = start;
exports.app = app;