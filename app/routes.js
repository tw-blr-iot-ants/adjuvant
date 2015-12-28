var orderHandler = require('./handlers/order');
var beverageHandler = require("./handlers/beverage");
var userHandler = require("./handlers/user");
var newUserHandler = require("./handlers/newUser")
var logHandler = require("./handlers/log")
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = function(app) {

	app.post('/api/beverages/', beverageHandler.create);
	app.put('/api/beverages/:id', beverageHandler.update);
	app.get('/api/beverages/', beverageHandler.findAll);
	app.get('/api/beverages/juices', beverageHandler.findJuices);
	app.get('/api/beverages/fruits', beverageHandler.findFruits);
	app.get('/api/beverages/:id', beverageHandler.findById);
	app.delete('/api/beverages/:id', beverageHandler.delete);
	app.post('/api/beverages/updateWithUpsert', beverageHandler.updateWithUpsert)

	app.post('/api/createUsers', upload.single('users'), userHandler.createUsers);
	app.get('/api/users/', userHandler.getAllUsers);
	app.get('/api/users/empId/:empId', userHandler.getUserByEmpId);
    app.get('/api/users/internalNumber/:internalNumber', userHandler.getUserByInternalNumber);
	app.delete('/api/users/:empId/', userHandler.deleteUser);
    app.post('/api/users/', userHandler.addUser);
    app.put('/api/users/:empId/', userHandler.updateUser);

	app.post('/api/orders', orderHandler.create);
	app.get('/api/orders', orderHandler.allOrders);
	app.get('/api/orders/recentOrders', orderHandler.lastTenOrders);
	app.get('/api/orders/summary', orderHandler.todayOrders);
	app.get('/api/orders/:startDate/:endDate', orderHandler.ordersForSelectPeriod);

	app.delete('/api/orders/:id/', orderHandler.deleteOrder);

	app.post('/api/register/', newUserHandler.register);
	app.get('/api/register/', newUserHandler.getAllUsers);
	app.get('/api/register/internalNumber/:internalNumber', newUserHandler.getUserByInternalNumber);
	app.put('/api/register/', newUserHandler.approve);
	app.delete('/api/register/:empId', newUserHandler.delete);

	app.post('/api/log/', logHandler.store)
};

