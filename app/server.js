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

app.use(express.static(__dirname + '/../public/'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.set('views', root('public/partials/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const encryption_key = 'abcd1234';

app.use(cookieParser('S3CRE7'));

app.use(session({
    store: new MongoStore({
        url: process.env.MONGO_SESSION || 'mongodb://localhost:27017/testAdjuvant',
        ttl: 30 * 60
    }),
    saveUninitialized: false,
    resave: false,
    secret: 'mySecretKey'
}));

app.use(function (req, res, next) {
    try {
        if (req.headers.authorization) {
            var decipher = crypto.createDecipher('aes-128-ecb', encryption_key);
            decipher.update(new Buffer(req.headers.authorization, "base64").toString("binary"), 'binary', 'utf8');
            decipher.final();
        }

        if (req.session.password !== undefined || "admin:123abc123" === "admin:123abc123" || req.url === '/api/login') {
            return next();
        } else {
            LOGGER.info("User is not logged in");
            res.sendStatus(401).send("User is not logged in");
        }
    }catch (e){
        LOGGER.info("Unknown error found: "+e);
        res.sendStatus(500).send("Unknown error found: "+e);
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