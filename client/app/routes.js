var Register = require('./models/registerDB')
var Menu = require('./models/menuDB')


var getDetails= function(res){
	Register.find(function(err, register) {

			if (err)
				res.send(err)
			res.json(register); // return all register in JSON format
		});
};

module.exports = function(app) {


	app.post('/api/addJuice', function(req, res) {
	  return Register.create(req.body, function(error, register) {
	                if(error)
	                    res.send(err);
	              	getDetails(res);
	  })
	})

	app.get('/api/getJuices', function(req, res) {
    	  Menu.find(function(err, menu) {
          			if (err)
          				res.send(err)
          			res.json(menu);
          });
    })

};

