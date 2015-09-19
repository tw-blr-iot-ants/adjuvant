var Menu = require('./models/menuDB')
var Register = require('./models/registerDB')


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

};

