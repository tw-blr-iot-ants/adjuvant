var express = require('express');
var app = express();
var port = process.env.PORT || 8083;
const basicAuth = require('express-basic-auth')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var root = require('root-path');
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

const unauthorizedResponseBody = () => ("User is not logged in");

app.use(function (req, res, next) {
    if(req.session.password !== undefined || req.url === '/api/login') {
        return next();
    }
    let basicAuthHandler = basicAuth({
        users: {'admin': '123abc123'},
        unauthorizedResponse: unauthorizedResponseBody
    });
    const onSuccess = () => {
        req.session.basicAuthenticated = true;
        next()
    };
    basicAuthHandler(req, res, onSuccess);

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