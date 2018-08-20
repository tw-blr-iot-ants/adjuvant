var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jsonfile = require('jsonfile');
var util = require('util');
var root = require('root-path');
var lodash = require('lodash');
var crypto = require('crypto');

const validate = (validCredentials, username, password) => {
  return lodash.findIndex(validCredentials, { username, password });
}
module.exports.loginUser = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send(info); }
    if (!req.body.region) {
      return res.send({ message: "Region is not selected" });
    }
    req.session.password = req.body.password;
    req.session.region = req.body.region;
    req.session.authenticate = true;

    res.status(200).send({ redirect: '/#/manageJuices' });

  })(req, res, next);
};

passport.use(new LocalStrategy(
  function (username, password, done) {
    jsonfile.readFile(root("app/resources/credentials.json"), function (err, obj) {
      const hashedCredentials = obj.map((e) => (
        {
          userName: e.userName,
          password: crypto.createHmac('sha256', e.password).update('I love cupcakes').digest('hex')
        }));
      if (validate(hashedCredentials, username, password)) {
        done(null, true, '');
      }
      else {
        done(null, false, 'Invalid');
      }
    });
  }
));


module.exports.destroyLoginSession = function (req, res) {
  req.session.destroy();

}