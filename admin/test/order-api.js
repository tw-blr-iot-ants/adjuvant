
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var Order = require('../app/models/order');
var server = require('../app/server').app;

var request = require('supertest')(server);
require("../app/database");

before(function(done) {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
      });
    }
    return done();
});

describe("GET /api/orders", function() {

    it.skip("should get all orders", function(done) {
        var firstOrder = {
            Name:"Ravi",
            EmployeeId: 2748,
            Quantity: 1,
            Date: "2011-08-21T18:02:52.249Z",
            DrinkName: "Lime"
        };
        var secondOrder = {
            Name:"Ravi",
            EmployeeId: 2748,
            Quantity: 1,
            Date: "2011-08-21T18:02:52.249Z",
            DrinkName: "Lime"
        };

        Order.create(firstOrder);
        Order.create(secondOrder);

        request
        .get('/api/orders')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            assert.equal(res.body.length, 2);
            done();
        });
    })
})

describe.only("POST /api/orders", function() {

    var req = {employeeId: "15558", drinks: [{name: "apple",quantity: 5}, {name: "orange", quantity: 7}]};

    it("should place an order", function(done) {
        request
        .post('/api/orders')
        .send(req)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, response) {
            if (err) return done(err);

            var res = response.body;
            assert.equal(res.orderStatus,"success");
            Order.find({ EmployeeId: req.employeeId }).exec(function (err, order) {
                        assert.notEqual(order, undefined);
                        assert.equal(order.length, 2);
                        done();
            });
        });
    });
});


after(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].drop( function(err) {
    });
  }
  return done();
});
