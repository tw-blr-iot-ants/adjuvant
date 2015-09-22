var Register = require('./models/registerDB');
var Beverage = require('./models/beverage.js');

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

};

