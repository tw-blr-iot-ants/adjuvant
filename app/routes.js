var googleSpreadsheet = require('./models/editGoogle')

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

//	app.get('*', function(req, res) {
//		res.sendfile('./public/index.html');
//	});
};