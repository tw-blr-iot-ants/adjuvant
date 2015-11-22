var Order = require("../models/order");
var BeverageHandler = require('../handlers/beverage');
var _ = require('../../node_modules/underscore/underscore')

var _setStartOfDate = function(startDate) {
    startDate.setSeconds(0);
    startDate.setHours(0);
    startDate.setMinutes(0);
    return startDate;
}

var _setEndOfDate = function(endDate) {
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    return endDate;
}

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

module.exports.todayOrders = function(req, res) {
   var today = new Date();
   return Order.find({"date": {$gte: new Date(_setStartOfDate(today)),
                               $lt: new Date(_setEndOfDate(today))}}).exec(function(error, orders) {
        if(error)
             res.send(error);
        else {
            var mapReduceRequest = {};
            mapReduceRequest.map = function() { emit(this.drinkName, this.quantity)}
            mapReduceRequest.reduce = function(key, values) { return Array.sum(values);}
            mapReduceRequest.out = {inline: 1}
            Order.mapReduce(mapReduceRequest, function (err, orderGroups) {
              if(err)
                 res.send(error);
              res.send(orderGroups);
            })
        }
   })
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

