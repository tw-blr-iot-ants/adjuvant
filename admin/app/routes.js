var Menu = require('./models/menuDB')
var Register = require('./models/registerDB')
var Beverage = require('./models/juice.js');


var getDetails= function(res){
	Menu.find(function(err, menu) {
			if (err)
				res.send(err)
			res.json(menu);
		});
};

module.exports = function(app) {

	app.post('/api/setupJuices', function(req, res) {
	  var conditions = {};
	  conditions.Juice = req.body.Juice;
	  var update = {};
	  update.Cost =  req.body.Cost;
	  return Menu.update(conditions, update, {"upsert": true}, function(error, menu) {
	                if(error)
	                    res.send(err);
	              	getDetails(res);
	  })
	})

	app.post('/api/getInvoice', function(req, res) {
	   return Register.find({"Date" : req.body.Date}, function(error, register) {
	                if(error)
	                    res.send(err);
	                res.json(register)
	  })
	})

	app.post("/api/deleteJuice", function(req, res) {
	    console.log("req.body.Juice", req.body);
	    return Menu.remove({"Juice": req.body.juiceToBeDeleted}, function(error, menu) {
	        if (error)
        		res.send(error);

        	getDetails(res);
	    })
	})

	app.get('/api/getJuices', function(req, res) {
	  getDetails(res);
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

