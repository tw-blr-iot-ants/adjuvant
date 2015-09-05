var googleSpreadsheet = require('./models/editGoogle')
var Register = require('./models/mongooseDB')


var getDetails= function(res){
	Register.find(function(err, register) {

			if (err)
				res.send(err)
            console.log("register", register)
			res.json(register); // return all register in JSON format
		});
};

module.exports = function(app) {

	app.get('/api/getOrders', function(req, res) {
		return googleSpreadsheet.getSpreadSheetInfo()
			.then(function(data) {
				res.json(data)
			})
	});

	app.post('/api/postOrder', function(req, res) {
        return googleSpreadsheet.updateSpreadSheet(req.body)
			.then(function(data) {
				res.json(data)
			})
	});

    app.post('/api/cleanSheet', function(req, res) {
        return googleSpreadsheet.deleteContents()
			.then(function(data) {
			     res.json(data)
			})
	});

	app.post('/api/updateDB', function(req, res) {
	  return Register.create(req.body, function(error, register) {
	                if(error)
	                    res.send(err);

	              	getDetails(res);
	  })
	})

};

