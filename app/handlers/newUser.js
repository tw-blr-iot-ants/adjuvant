var NewUser = require('../models/newUser');
var User = require('../models/user');
var internalCardLength = 5;


var transform = function(internalNumber) {
    while (internalNumber.length < internalCardLength) {
        internalNumber = '0' + internalNumber;
    }
    return internalNumber;
}

module.exports.register = function(req, res) {
       req.body.date = new Date();
       req.body.internalNumber = transform(req.body.internalNumber);
	   return NewUser.create(req.body , function(error) {
             				if(error) {
             				    res.send(error);
                                return;
             				}
             res.json({"newUserRegistration": "success"});
       });
};

module.exports.getAllUsers = function(req, res) {
    return NewUser.find().exec(function(error, newUsers) {
        if(error) {
            res.send(error);
            return;
        }
        res.json(newUsers);
    })
}

module.exports.approve = function(req, res) {
    var conditions = {};
    conditions.empId = req.body.empId;
    return User.update(conditions, req.body, {"upsert": true}, function(error, user) {
       	 if(error) {
       	     res.send(error);
       	     return;
       	 }
       	 res.json(req.body);
      })
}

module.exports.delete = function(req, res) {
    NewUser.findOneAndRemove({empId: req.params.empId}).exec(function (err, user) {
        res.send(user == null ? 404 : "success");
    });
};

 module.exports.getUserByInternalNumber = function(req, res) {
    NewUser.findOne({internalNumber: req.params.internalNumber}).exec(function (err, user) {
        res.send(user == null ? 404 : user);
    });
};
