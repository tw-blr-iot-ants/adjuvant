var googleSpreadsheet = require('./models/editGoogle')
//
//function getTodos(res){
//	Todo.find(function(err, todos) {
//
//			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
//			if (err)
//				res.send(err)
//
//			res.json(todos); // return all todos in JSON format
//		});
//};

var getResponse = function(data) {

}
module.exports = function(app) {

	app.get('/api/getOrders', function(req, res) {
		return googleSpreadsheet.getSpreadSheetInfo()
			.then(function(data) {
				res.json(data)
			})
	});

	app.post('/api/postOrder', function(req, res) {
		googleSpreadsheet.updateSpreadSheet(req.body)
		return res.json();
	});

//	app.get('*', function(req, res) {
//		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//	});
};