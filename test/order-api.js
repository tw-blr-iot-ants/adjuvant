
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var Order = require('../app/models/order');
var server = require('../app/server').app;

var request = require('supertest')(server);
require("../app/testDatabase");

beforeEach(function(done) {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
      });
    }
    return done();
});

describe("GET /api/orders", function() {

    it("should get all orders", function(done) {
        var firstOrder = {
            date: "2011-08-21T18:02:52.249Z",
            employeeName: "Ram",
            employeeId: 2748,
            drinkName: "Lime",
            quantity: 1,
            isSwipe: true,
            region: "Bangalore"
        };
        var secondOrder = {
            date: "2011-08-21T18:02:52.249Z",
            employeeName: "Ram",
            employeeId: 2748,
            drinkName: "Lime",
            quantity: 1,
            isSwipe: true,
            region: "Bangalore"
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

describe("POST /api/orders", function() {

    var req = {employeeId: "15558", employeeName: "Ravi", drinks: [{name: "apple",quantity: 5}, {name: "orange", quantity: 7}], isSwipe: false, region: "Bangalore"};

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
            Order.find({ employeeId: req.employeeId }).exec(function (err, order) {
                        assert.notEqual(order, undefined);
                        assert.equal(order.length, 2);
                        done();
            });
        });
    });
});


afterEach(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].drop( function(err) {
    });
  }
  return done();
});
