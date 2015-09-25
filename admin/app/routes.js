var Order = require('./models/order');
var Beverage = require('./models/beverage');
var Users = require('./models/users');
var rmdir = require('rimraf');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var xlsxj = require('xlsx-to-json');
var xlsx = require('xlsx');
var root = require('root-path');

module.exports = function(app) {
	
	app.post('/api/getInvoice', function(req, res) {
	   return Order.find({"Date" : req.body.Date}, function(error, register) {
	                if(error)
	                    res.send(err);
	                res.json(register)
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

	    var excelFilePath = root('admin', req.file.path);
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

        res.send("success")

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

	app.post('/api/orders', function(req, res) {
    	  return Order.create(req.body, function(error) {
    	                if(error)
    	                    res.send(error);
						res.json(req.body);
    	  })
	})

	app.get('/api/orders', function(req, res) {
    	  return Order.find({}).exec(function(error, orders) {
    	                if(error)
    	                    res.send(error);
						res.json(orders);
    	  })
	})
};

