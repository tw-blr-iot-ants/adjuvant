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

var _extractRegisterOrders = function(orders) {
    var totalJuiceCount = 0, totalCoffeeTeaCount = 0;
    var summary = [];
    var juiceChoice = [];
    _.each(orders, function(order) {
      var drinkName = order.drinkName;
      _.times(order.quantity, function() {
          juiceChoice.push(drinkName)
      })
    })
    orders =   _.countBy(juiceChoice , _.identity);

    _.each(orders, function(value, key) {
       var eachOrder = {};
       eachOrder.name = key;
       eachOrder.count = value;
       if(key != "CTL") totalJuiceCount += value;
       summary.push(eachOrder);
    })
    summary.push({name:"Total Juice", count:totalJuiceCount});
    return summary;
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
    return Order.find({"drinkName": {$ne: "CTL"}}).sort({date: -1}).limit(10).exec(function(error, orders) {
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
                res.json(_extractRegisterOrders(orders));
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
                isSwipe: req.body.isSwipe,
                isSugarless: drink.isSugarless,
                region: req.body.region,
                isFruit: drink.isFruit
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

module.exports.deleteOrder = function(req, res) {
	Order.findOneAndRemove({ _id: req.params.id }).exec(function (err, order) {
	res.send(order == null ? 404 : "success");
	});
};