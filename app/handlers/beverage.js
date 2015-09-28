var Beverage = require("../models/beverage");

var getBeverages = function(res){
	Beverage.find(function(err, beverages) {
			if (err)
				res.send(err)
			res.json(beverages);
		});
};

module.exports.create = function(req, res) {
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

module.exports.updateWithUpsert = function(req, res) {
       var conditions = {};
      conditions.Name = req.body.name;
      return Beverage.update(conditions, req.body, {"upsert": true}, function(error, beverage) {
    	                if(error)
    	                    res.send(error);
    	                getBeverages(res);
   })
}
