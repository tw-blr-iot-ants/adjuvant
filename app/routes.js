var orderHandler = require('./handlers/order');
var beverageHandler = require("./handlers/beverage");
var userHandler = require("./handlers/user");
var newUserHandler = require("./handlers/newUser");
var logHandler = require("./handlers/log");
var loginHandler = require("./handlers/login");
var mkdirp = require('mkdirp');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp('uploads/', function(err) {
            if(err) {
                console.error(err);
            }
            // move cb to here
            cb(null, 'uploads/');
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

var upload = multer({ storage: storage });

function isLoggedIn(req, res, next) {
    if (req.session.authenticate)
        return next();
    res.status(401).send('Invalid request');
}

module.exports = function(app) {
    // app.use(expressSession({secret: 'mySecretKey',saveUninitialized: false,resave:false}));

	app.post('/api/beverages/', isLoggedIn, beverageHandler.create);
	app.put('/api/beverages/:id', isLoggedIn, beverageHandler.update);
	app.get('/api/beverages/',isLoggedIn, beverageHandler.findAll);
	app.get('/api/beverages/juices',isLoggedIn, beverageHandler.findJuices);
	app.get('/api/beverages/fruits', isLoggedIn,beverageHandler.findFruits);
	app.get('/api/beverages/:id', isLoggedIn, beverageHandler.findById);
	app.delete('/api/beverages/:beverageName', isLoggedIn, beverageHandler.deleteBeverage);
	app.post('/api/beverages/updateWithUpsert', isLoggedIn, beverageHandler.updateWithUpsert);

	app.post('/api/createUsers', isLoggedIn, upload.single('users'), userHandler.createUsers);
	app.get('/api/users/', isLoggedIn, userHandler.getAllUsers);
	app.get('/api/users/empId/:empId',isLoggedIn,  userHandler.getUserByEmpId);
    app.get('/api/users/internalNumber/:internalNumber', isLoggedIn, userHandler.getUserByInternalNumber);
	app.delete('/api/users/:empId/', isLoggedIn, userHandler.deleteUser);
    app.post('/api/users/', isLoggedIn, userHandler.addUser);
    app.put('/api/users/:empId/', isLoggedIn,userHandler.updateUser);

	app.post('/api/orders', isLoggedIn, orderHandler.create);
	app.get('/api/orders', isLoggedIn, orderHandler.allOrders);
	app.get('/api/orders/recentOrders', isLoggedIn, orderHandler.lastTenOrders);
	app.get('/api/orders/summary', isLoggedIn, orderHandler.todayOrders);
	app.get('/api/orders/:startDate/:endDate', isLoggedIn, orderHandler.ordersForSelectPeriod);

	app.delete('/api/orders/:id/', isLoggedIn, orderHandler.deleteOrder);

	app.post('/api/register/', isLoggedIn, newUserHandler.register);
	app.get('/api/register/', isLoggedIn, newUserHandler.getAllUsers);
	app.get('/api/register/internalNumber/:internalNumber', isLoggedIn, newUserHandler.getUserByInternalNumber);
	app.put('/api/register/', isLoggedIn, newUserHandler.approve);
	app.delete('/api/register/:empId', isLoggedIn, newUserHandler.delete);

	app.post('/api/log/', isLoggedIn, logHandler.store);

	app.post('/api/login', loginHandler.loginUser);
	app.delete('/api/login', loginHandler.destroyLoginSession);

};