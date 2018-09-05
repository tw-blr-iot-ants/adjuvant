var express = require('express');
var app = express();
var port = process.env.PORT || 8083;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var root = require('root-path');
var crypto = require('crypto');
var path = require('path');
var LOGGER = require(path.resolve('app/services/log'));
var dbConfig = require(path.resolve('app/config/database'));
const helmet = require('helmet')

app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use((req, res, next) => {
    res.set('X-XSS-Protection', '1; mode=block');
    next();
})
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
        url: process.env.TEST ? dbConfig.testUrl : dbConfig.url,
        ttl: 30 * 60
    }),
    saveUninitialized: false,
    resave: false,
    secret: 'mySecretKey'
}));

app.use(function (req, res, next) {
    var decodedAuth = "";
    try {
        if(req.headers.authorization) {
            var decipher = crypto.createDecipher('aes-128-ecb', encryption_key);
            var chunks;
            chunks = [];
            chunks.push( decipher.update( new Buffer(req.headers.authorization, "base64").toString("binary"), 'binary') );
            chunks.push( decipher.final("binary") );
            decodedAuth = chunks.join("");
        }
        if(req.session.password !== undefined || decodedAuth === "admin:123abc123" || req.url === '/api/login') {
            return next();
        } else {
            res.status(401).send("User is not logged in");
        }
    } catch (e) {
        throw e
    }

});

require('./routes.js')(app);

function start() {
    app.listen(port);
    console.log("App listening on port " + port);
}

app.use(function (err, req, res, next) {
    console.error(err.stack);
    LOGGER.error("Unknown error occurs " + err);
    res.status(500).end("Unknown error occurs")
});

exports.start = start;
exports.app = app;