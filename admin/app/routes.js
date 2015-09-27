var Order = require('./models/order');
var Beverage = require('./models/beverage');
var Users = require('./models/users');
var rmdir = require('rimraf');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var xlsxj = require('xlsx-to-json');
var xlsx = require('xlsx');
var root = require('root-path');


var getBeverages = function(res){
	Beverage.find(function(err, beverages) {
			if (err)
				res.send(err)
			res.json(beverages);
		});
};

module.exports = function(app) {

	app.post('/api/updateBeverage', function(req, res) {
    	  var conditions = {};
    	  conditions.Name = req.body.Name;
    	  return Beverage.update(conditions, req.body, {"upsert": true}, function(error, beverage) {
    	                if(error)
    	                    res.send(error);
    	                getBeverages(res);
    	  })
    })

	app.post('/api/beverages/', function(req, res) {

		var beverage = new Beverage({
			name: req.body.name,
			cost: req.body.cost,
			available: true
		});
		
		beverage.save(function(err){
			if(err){
				console.log("Error in saving the beverage", err);
				return;
			}
			
		});
		
		res.json(beverage);
	});
	
	app.put('/api/beverages/:id', function(req, res) {
		
		Beverage.findOneAndUpdate({ _id: req.params.id }, req.body).exec(function(err, beverage) {
			if(err) {
				console.log("Error in updating beverage", err);
				return;
			}
			res.json(beverage);
		});
	});
	
	app.get('/api/beverages/', function(req, res) {
		Beverage.find().exec(function(error, beverages) {
			if(error) {
				console.log("Error in reading beverages");
				return;
			}
			res.json(beverages);
		});
	});
	
	app.get('/api/beverages/:id', function(req, res) {
		Beverage.findOne({ _id: req.params.id }).exec(function (err, beverage) {
			res.json(beverage);
		});
	});
	
	app.delete('/api/beverages/:id', function(req, res) {
		Beverage.findOneAndRemove({ _id: req.params.id }).exec(function (err, beverage) {
			res.json("");
		});
	});

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

        rmdir(root('admin', 'uploads'), function(err) {
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
            res.json(users);
        });
	});

	app.get('/api/users/:empId/:internalNumber', function(req, res) {
        Users.findOne({EmpId: req.params.empId, InternalNumber: req.params.internalNumber}).exec(function (err, user) {
            res.json(user);
        });
    });

	app.delete('/api/users/:empId/:internalNumber', function(req, res) {
    		Users.findOneAndRemove({EmpId: req.params.empId, InternalNumber: req.params.internalNumber}).exec(function (err, user) {
    			res.json("");
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

    app.put('/api/users/:empId/:internalNumber', function(req, res) {

  		Users.findOneAndUpdate({EmpId: req.params.empId, InternalNumber: req.params.internalNumber}, req.body).exec(function(err, user) {
  			if(err) {
  				console.log("Error in updating user", err);
  				return;
  			}
  			res.json(user);
  		});
  	});

	app.post('/api/addUser', function(req, res) {

	  console.log("req.body", req.body)
	  return Users.create(req.body, function(err, data) {
                                     if(err) return res.send(err);
                                     res.json(req.body)
      });
    })

    app.post('/api/deleteUser', function(req, res) {
      console.log("re", req.body.EmpId)
	  return Users.remove({"EmpId": req.body.EmpId }, function(err, data) {
                        if(err) return res.send(err);
                        res.json(req.body)
      });
    })

	app.post('/api/orders', function(req, res) {
    	  return Order.create(req.body, function(error) {
    	                if(error)
    	                    res.send(error);
						res.json(req.body);
    	  })
	})

	app.put('/api/orders', function(req, res) {
    	  return Order.find({"Date" : new Date(req.body.Date)}).exec(function(error, orders) {
    	                if(error)
    	                    res.send(error);
						res.json(orders);
    	  })
	})

	app.put('/api/ordersWithInRange', function(req, res) {
    	  return Order.find({"Date" : {$gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate)}})
    	                    .exec(function(error, orders) {
    	                if(error)
    	                    res.send(error);
						res.json(orders);
    	  })
	})

};

