var Order = require("../models/order");


module.exports.ordersForSingleDay =  function(req, res) {
       return Order.find({"date" : new Date(req.params.date)}).exec(function(error, orders) {
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


