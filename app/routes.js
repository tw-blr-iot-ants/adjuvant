var Order = require('./models/order');
var beverageHandler = require("./handlers/beverage");
var Users = require('./models/users');
var rmdir = require('rimraf');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var xlsxj = require('xlsx-to-json');
var xlsx = require('xlsx');
var root = require('root-path');
var moment = require('moment');

module.exports = function(app) {

	app.post('/api/beverages/', beverageHandler.create);
	app.put('/api/beverages/:id', beverageHandler.update);
	app.get('/api/beverages/', beverageHandler.findAll);
	app.get('/api/beverages/:id', beverageHandler.findById);
	app.delete('/api/beverages/:id', beverageHandler.delete);
	app.post('/api/beverages/updateWithUpsert', beverageHandler.updateWithUpsert)

	app.post('/api/createUsers', upload.single('users'), function(req, res) {
	    Users.remove({}, function(err) {
	        if(err) return console.error(err);
	    });

	    var excelFilePath = root( req.file.path);
	    var resourcePath = root('admin', 'resources');
	    var workbook = xlsx.readFile(excelFilePath);

        workbook.SheetNames.forEach(function(sheetName, index) {
            xlsxj({
                    input: excelFilePath,
                    output: null,
                    sheet: sheetName
                  }, function(err, result) {
                    if(err) {
                      console.error(err);
                    }
                    Users.collection.insert(result, function(err, data) {
                        if(err) return console.error(err);
                    });

                  });
        });

        rmdir(root('uploads'), function(err) {
            if(err) return console.error(err);
        });

        res.redirect('/#/manageUsers');

	});

	app.get('/api/users/', function(req, res) {
	    Users.find().exec(function(err, users) {
            if(err) {
                console.log("Error in reading users");
                return;
            }
            res.json(users == null ? 404 : users);
        });
	});

	app.get('/api/users/empId/:empId', function(req, res) {
        Users.findOne({empId: req.params.empId}).exec(function (err, user) {
            res.send(user == null ? 404 : user);
        });
    });

    app.get('/api/users/internalNumber/:internalNumber', function(req, res) {
        Users.findOne({internalNumber: req.params.internalNumber}).exec(function (err, user) {
            res.send(user == null ? 404 : user);
        });
    });

	app.delete('/api/users/:empId/', function(req, res) {
    		Users.findOneAndRemove({empId: req.params.empId}).exec(function (err, user) {
            res.send(user == null ? 404 : "success");
    		});
    	});

    app.post('/api/users/', function(req, res) {
        var user = new Users(req.body)

        user.save(function(err) {
            if(err)
                res.send(err);
        });
        res.json(user);
    });

    app.put('/api/users/:empId/', function(req, res) {

  		Users.findOneAndUpdate({empId: req.params.empId}, req.body).exec(function(err, user) {
  			if(err) {
  				console.log("Error in updating user", err);
  				return;
  			}
            res.send(user == null ? 404 : user);
  		});
  	});

	app.post('/api/orders', function(req, res) {
		  var allDrinksRequest = [];
		  var eachDrinkRequest;

		  req.body.drinks.forEach(function(drink) {
		  	eachDrinkRequest = {
            		  	date: new Date(),
            		  	employeeId: req.body.employeeId,
            		  	drinkName: drink.name,
            		  	quantity: drink.quantity,
            		  	expiresAt: moment(moment(new Date())+moment.duration(6, 'months'))
            };
            allDrinksRequest.push(eachDrinkRequest);
		  })

		  return Order.create(allDrinksRequest, function(error) {
						if(error)
						  res.send(error);
						res.json({"orderStatus": "success"});
          });
	})

	app.get('/api/orders/:date/', function(req, res) {
    	  return Order.find({"date" : new Date(req.params.date)}).exec(function(error, orders) {
    	                if(error)
    	                    res.send(error);
						res.json(orders);
    	  })
	})

	app.get('/api/orders/:startDate/:endDate', function(req, res) {
    	  return Order.find({"date" : {$gte: new Date(req.params.startDate), $lt: new Date(req.params.endDate)}})
    	                    .exec(function(error, orders) {
    	                if(error)
    	                    res.send(error);
						res.json(orders);
    	  })
	})

};

