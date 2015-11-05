var Order = require("../models/order");
var moment = require("../../node_modules/moment");


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
        res.send(parse(orders));
    });
}

module.exports.create = function(req, res) {
        var allDrinksRequest = [];
        var eachDrinkRequest;

        req.body.drinks.forEach(function(drink) {
        	eachDrinkRequest = {
                date: new Date(),
                employeeId: req.body.employeeId,
                drinkName: drink.name,
                quantity: drink.quantity,
                expiresAt: moment(moment(new Date())+moment.duration(6, 'months'))
            };
            allDrinksRequest.push(eachDrinkRequest);
        })

        return Order.create(allDrinksRequest, function(error) {
      				if(error)
      				  res.send(error);
      				res.json({"orderStatus": "success"});
        });
}

var parse = function(orders) {
    var drinkNames = [];
    orders.forEach(function(order) {
        drinkNames.push(order.drinkName);

    });
    return drinkNames.reverse();
}


