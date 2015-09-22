var orderDB = require('./models/orderDB')
var Menu = require('./models/menuDB')


var getDetails= function(res){
	orderDB.find(function(err, orderDB) {
			if (err)
				res.send(err)
			res.json(orderDB); // return all orderDB in JSON format
		});
};

module.exports = function(app) {


	app.post('/api/placeOrder', function(req, res) {
	  return orderDB.create(req.body, function(error, orderDB) {
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

