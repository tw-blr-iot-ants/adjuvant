var Beverage = require("../models/beverage");

module.exports.create = function(req, res) {
	var beverage = new Beverage({
		Name: req.body.Name,
		Cost: req.body.Cost,
		Available: true
	});
	
	beverage.save(function(err){
		if(err){
			console.log("Error in saving the beverage", err);
			return;
		}		
	});
	res.json(beverage);
};

module.exports.update = function (req, res) {
	Beverage.findOneAndUpdate({ _id: req.params.id }, req.body).exec(function (err, beverage) {
		if (err) {
			console.log("Error in updating beverage", err);
			return;
		}
		res.json(beverage);
	});
};

module.exports.findAll = function(req, res) {
	Beverage.find().exec(function (error, beverages) {
		if (error) {
			console.log("Error in reading beverages");
			return;
		}
		res.json(beverages);
	});
};

module.exports.findById = function(req, res) {
	Beverage.findOne({ _id: req.params.id }).exec(function (err, beverage) {
		if(beverage)
			res.json(beverage);
		else {
			res.status(404).send("");	
		}
	});
};

module.exports.delete = function(req, res) {
	Beverage.findOneAndRemove({ _id: req.params.id }).exec(function (err, beverage) {
		if(beverage)
			res.status(204).send();
		else
			res.status(404).send();
	});
};