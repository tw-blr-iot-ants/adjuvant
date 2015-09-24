var Register = require('./models/registerDB');
var Beverage = require('./models/beverage');
var Users = require('./models/usersDB');
var fs = require('fs');
var rmdir = require('rimraf');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var xlsxj = require('xlsx-to-json');
var xlsx = require('xlsx');
var root = require('root-path');

module.exports = function(app) {
	
	app.post('/api/getInvoice', function(req, res) {
	   return Register.find({"Date" : req.body.Date}, function(error, register) {
	                if(error)
	                    res.send(err);
	                res.json(register)
	  })
	})

	app.post('/api/beverages/', function(req, res) {
		console.log(req.body.name);
		
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
			
			console.log("Beverage saved successfully");
		});
		
		res.json(beverage);
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

        fs.mkdir(resourcePath, function(err) {
            if(err) return console.error(err);
        });


        workbook.SheetNames.forEach(function(sheetName, index) {
            xlsxj({
                    input: excelFilePath,
                    output: resourcePath + "/output" + index + ".json",
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

        rmdir(resourcePath, function(err) {
            if(err) return console.error(err);
        });
        rmdir(root('admin', 'uploads'), function(err) {
            if(err) return console.error(err);
        });

        res.send("success")

	});

};

