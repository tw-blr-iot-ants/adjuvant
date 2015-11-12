var Order = require("../models/order");
var BeverageHandler = require('../handlers/beverage');

module.exports.allOrders =  function(req, res) {
       return Order.find({}).exec(function(error, orders) {
                   if(error)
                       res.send(error);
                   res.json(orders);
       })
}

module.exports.ordersForSelectPeriod =  function(req, res) {
     return Order.find({"date" : {$gte: new Date(req.params.startDate), $lt: new Date(req.params.endDate)}})
                                               	                    .exec(function(error, orders) {
             if(error)
                  res.send(error);
             res.json(orders);
     })
};

module.exports.lastTenOrders = function(req, res) {
    return Order.find().sort({date: -1}).limit(10).exec(function(error, orders) {
        if(error)
            res.send(error);
        res.send(orders.reverse());
    });
}

module.exports.create = function(req, res) {
        var allDrinksRequest = [];
        var eachDrinkRequest;

        req.body.drinks.forEach(function(drink) {
        	eachDrinkRequest = {
                date: new Date(),
                employeeId: req.body.employeeId,
                employeeName: req.body.employeeName,
                drinkName: drink.name,
                quantity: drink.quantity,
                isSwipe: req.body.isSwipe
            };
            BeverageHandler.updateRelevancy(drink.name, drink.quantity);
            allDrinksRequest.push(eachDrinkRequest);
        })

        return Order.create(allDrinksRequest, function(error) {
      				if(error)
      				  res.send(error);
      				res.json({"orderStatus": "success"});
        })
}

