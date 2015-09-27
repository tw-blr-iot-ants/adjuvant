
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

describe("POST /api/orders", function() {

    it("should place an order", function(done) {
        request
        .post('/api/orders')
        .send({Name: "Jack",EmployeeId:"1048",DrinkName:"Amla",Date:"2011-08-21T18:02:52.249Z",Quantity:1})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, response) {
            if (err) return done(err);

            var res = response.body;
            assert.equal(res.Name,"Jack");
            assert.equal(res.EmployeeId,"1048");
            assert.equal(res.Date,"2011-08-21T18:02:52.249Z");
            assert.equal(res.Quantity,1);
            assert.equal(res.DrinkName,"Amla");
            Order.findOne({ EmployeeId: res.EmployeeId }).exec(function (err, order) {
                        assert.notEqual(order, undefined);
                        done();
            });
        });
    })
})


after(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].drop( function(err) {
    });
  }
  return done();
});
