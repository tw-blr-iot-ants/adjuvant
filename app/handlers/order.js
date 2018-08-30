import {
    default as Order
} from "../models/order";
import {
    default as User
} from "../models/user";
import {
    default as NewUser
} from "../models/newUser";
import {
    default as BeverageHandler
} from '../handlers/beverage';
import {
    each,
    times,
    countBy,
    identity
} from 'underscore';
import {
    resolve
} from 'path';

var LOGGER = require(resolve('app/services/log'));

var _setStartOfDate = function (startDate) {
    startDate.setSeconds(0);
    startDate.setHours(0);
    startDate.setMinutes(0);
    return startDate;
};

var _setEndOfDate = function (endDate) {
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    return endDate;
};

var _extractRegisterOrders = function (orders) {
    var totalJuiceCount = 0
    var summary = [];
    var juiceChoice = [];
    each(orders, function (order) {
        var drinkName = order.drinkName;
        times(order.quantity, function () {
            juiceChoice.push(drinkName)
        });
    });
    orders = countBy(juiceChoice, identity);

    each(orders, function (value, key) {
        var eachOrder = {};
        eachOrder.name = key;
        eachOrder.count = value;
        if (key != "CTL") totalJuiceCount += value;
        summary.push(eachOrder);
    })
    summary.push({
        name: "Total Juice",
        count: totalJuiceCount
    });
    return summary;
};

module.exports.allOrders = function (req, res) {
    return Order.find({}).exec(function (error, orders) {
        if (error)
            res.send(error);
        res.json(orders);
    })
}

export function ordersForSelectPeriod(req, res) {
    return Order.find({
            "date": {
                $gte: new Date(req.params.startDate),
                $lt: new Date(req.params.endDate)
            }
        })
        .exec(function (error, orders) {
            if (error)
                res.send(error);
            res.json(orders);
        })
}

export function lastTenOrders(req, res) {
    return Order.find({
        "drinkName": {
            $ne: "CTL"
        }
    }).sort({
        date: -1
    }).limit(10).exec(function (error, orders) {
        if (error)
            res.send(error);
        res.send(orders.reverse());
    });
}

export function todayOrders(req, res) {
    var today = new Date();
    return find({
        "date": {
            $gte: new Date(_setStartOfDate(today)),
            $lt: new Date(_setEndOfDate(today))
        }
    }).exec(function (error, orders) {
        if (error)
            res.send(error);
        res.json(_extractRegisterOrders(orders));
    })
}

export function create(req, res) {
    var allDrinksRequest = [];
    var eachDrinkRequest;

    var selector = {
        empId: req.body.employeeId
    };

    Promise.all([
        User.find(selector),
        NewUser.find(selector)
    ]).then(function (response) {
        if (response.map(function (res) {
                return res.length;
            }).some(function (value) {
                return !!value;
            })) {
            req.body.drinks.forEach(function (drink) {
                eachDrinkRequest = {
                    date: new Date(),
                    employeeId: req.body.employeeId,
                    employeeName: req.body.employeeName,
                    drinkName: drink.name,
                    quantity: drink.quantity,
                    isSwipe: req.body.isSwipe,
                    isSugarless: drink.isSugarless,
                    region: req.body.region,
                    isFruit: drink.isFruit,
                    type: drink.type
                };
                BeverageHandler.updateRelevancy(drink.name, drink.quantity);
                allDrinksRequest.push(eachDrinkRequest);
            });
            Order.create(allDrinksRequest, function (error) {
                if (error) {
                    LOGGER.error("Error while ordering drink:" + error);
                    res.send(error);
                    return;
                }
                LOGGER.info("Order created successfully");
                res.status(200).json({
                    orderStatus: "success"
                });
            });
        } else {
            res.status(403).json({
                orderStatus: 'No such user'
            });
        }

    });
}

export function deleteOrder(req, res) {
    Order.findOneAndRemove({
        _id: req.params.id
    }).exec(function (err, order) {
        res.send(order == null ? 404 : "success");
    });
}