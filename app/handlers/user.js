var Users = require('../models/user');
var NewUsers = require('../models/newUser');
var rmdir = require('rimraf');
var xlsxj = require('xlsx2json');
var root = require('root-path');
var internalCardLength = 5;
var path = require('path');
var LOGGER = require(path.resolve('app/services/log'));

module.exports.createUsers = function (req, res) {
    var excelFilePath = root(req.file.path);
    xlsxj(excelFilePath, {
        dataStartingRow: 2,
        mapping: {
            "empId": "A",
            "employeeName": "B",
            "internalNumber": "C"
        }
    }).done(function (jsonArray) {
        Users.collection.insert(jsonArray, function (err, data) {
            rmdir(root('uploads'), function (err) {
                if (err) return LOGGER.error(err);
            });
            if (err) return LOGGER.error(err);
        });
    });

    res.redirect('/#/manageUsers');

};

module.exports.getAllUsers = function (req, res) {
    Users.find().exec(function (err, users) {
        if (err) {
            LOGGER.error("Error in reading users " + err)
            return;
        }
        res.send(users === null ? 404 : users);
    });
};

module.exports.getUserByEmpId = function (req, res) {
    Users.findOne({empId: req.params.empId}).exec(function (err, user) {
        if (user)
            return res.send(user);
        else {
            NewUsers.findOne({empId: req.params.empId}).exec(function (err, newUser) {
                res.send(newUser === null ? 404 : newUser);
            });
        }
    });
};

module.exports.getUserByInternalNumber = function (req, res) {
    var internalNumber = req.params.internalNumber;
    LOGGER.info("Getting user for "+  internalNumber);
    Users.findOne({internalNumber: internalNumber}).exec(function (err, user) {
        if (user == null) {
            res.redirect("/api/register/internalNumber/" + validInternalNumber);
            return;
        }
        res.send(user == null ? 404 : user);
    });
};

module.exports.deleteUser = function (req, res) {
    Users.findOneAndRemove({empId: req.params.empId}).exec(function (err, user) {
        res.send(user == null ? 404 : "success");
    });
};

module.exports.addUser = function (req, res) {
    var user = new Users(req.body)

    user.save(function (err) {
        if (err)
            res.send(err);
    });
    res.json(user);
};

module.exports.updateUser = function (req, res) {

    Users.findOneAndUpdate({empId: req.params.empId}, req.body).exec(function (err, user) {
        if (err) {
            LOGGER.error("Error in updating user " + err);
            return;
        }
        res.send(user == null ? 404 : user);
    });
};