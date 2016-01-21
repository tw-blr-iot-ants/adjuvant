var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jsonfile = require('jsonfile');
var util = require('util');
var root = require('root-path');


module.exports.loginUser = function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send(info); }
        if (!req.body.region) {
            return res.send({message: "Region is not selected"});
        }
        req.session.password = req.body.password;
        req.session.region = req.body.region;

	    res.status(200).send({redirect: '/#/manageJuices'});

      })(req, res, next);
    }

    passport.use(new LocalStrategy(
          function(username, password, done) {
           jsonfile.readFile(root("app/resources/credentials.json"), function(err, obj) {
             if(obj[username] == undefined) {
                return done(null, false, {message: 'Incorrect username.'});
             }
             if(obj[username] != password) {
                return done(null, false, {message: 'Incorrect password.'})
             }
             return done(null, true, '');
           });
           }
        ));


module.exports.destroyLoginSession = function(req, res) {
    req.session.destroy();

}