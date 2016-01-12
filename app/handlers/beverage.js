var Beverage = require("../models/beverage");

var compare = function (filter) {
    return function (a,b) {
        var a = a[filter],
            b = b[filter];

        if (a < b) {
            return -1;
        }else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    };
};


var getBeverages = function(res){
	Beverage.find(function(err, beverages) {
			if (err)
				res.send(err)
			res.json(beverages);
		});
};

var checkJuicesLastUpdated = function() {
    var today = new Date();
    Beverage.findOne(function(err, beverage) {
        if(beverage.lastUpdated.setHours(0,0,0,0) != today.setHours(0,0,0,0)) {
              Beverage.update({}, {lastUpdated: today, relevancy: 0}, {multi: true}, function(err, beverages) {
          })
        }
    })
}

var sort = function(beverages) {
    filter = compare('relevancy');
    return beverages.sort(filter);
}

module.exports.create = function(req, res) {
    var today = new Date();
	var beverage = new Beverage({
		name: req.body.name,
		cost: req.body.cost,
		available: true,
		relevancy: 0,
		lastUpdated: today
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

module.exports.findJuices = function(req, res) {
        checkJuicesLastUpdated();
	    Beverage.find({name: {$ne: "CTL"}, isFruit: {$eq: false}}).exec(function (error, beverages) {
	    	if (error) {
	    		console.log("Error in reading beverages");
	    		return;
	    	}
	    	res.json(sort(beverages).reverse());
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

module.exports.deleteBeverage = function(req, res) {
	Beverage.findOneAndRemove({ name: req.params.beverageName }).exec(function (err, beverage) {
		if(beverage)
		    getBeverages(res);
		else
			res.status(404).send();
	});
};

module.exports.updateWithUpsert = function(req, res) {
      var conditions = {};
      conditions.name = req.body.name;
      conditions.isFruit = req.body.isFruit || false;
      var today = new Date();
      req.body.relevancy = 0;
      req.body.lastUpdated = today;

      return Beverage.update(conditions, req.body, {"upsert": true}, function(error, beverage) {
    	                if(error){
    	                        console.log("error", error);
                                res.send(error);
    	                }
    	                else {
    	                    getBeverages(res);
    	                }
   })
}

module.exports.updateRelevancy = function(drinkName, quantity) {
     var conditions = {};
     conditions.name = drinkName;
    Beverage.findOneAndUpdate(conditions, {$inc: { relevancy: quantity }}, {"upsert": true}, function(err, beverage) {
    })
}

module.exports.findFruits = function(req, res) {
        checkJuicesLastUpdated();
	    Beverage.find({isFruit: {$eq: true}, available: {$eq: true}}).exec(function (error, beverages) {
	    	if (error) {
	    		console.log("Error in reading beverages");
	    		return;
	    	}
	    	res.json(sort(beverages).reverse());
	    });
};
