require('@babel/register')
var assert = require("chai").assert;
var mongoose = require("mongoose");
var Order = require("../../app/models/order");
var Users = require("../../app/models/user");
var server = require("../../app/server").app;

require("../../app/testDatabase");

var request = require("supertest");
var authUser = request.agent(server);

before(function (done) {
    authUser
        .post("/api/login")
        .set("Accept", "application/json")
        .send({
            username: "admin",
            password: "d+Lp:dBT8**zKSd",
            region: "Bangalore"
        })
        .end(function (err, res) {
            assert.equal(res.statusCode, 200);
            done();
        });
});

beforeEach(function (done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function (err) {});
    }
    return done();
});

describe("GET /api/orders", function () {
    it("should get all orders", function (done) {
        var firstOrder = {
            date: "2011-08-21T18:02:52.249Z",
            employeeName: "Ram",
            employeeId: "2748",
            drinkName: "Lime",
            quantity: 1,
            isSwipe: true,
            region: "Bangalore"
        };
        var secondOrder = {
            date: "2011-08-21T18:02:52.249Z",
            employeeName: "Ram",
            employeeId: "2748",
            drinkName: "Lime",
            quantity: 1,
            isSwipe: true,
            region: "Bangalore"
        };

        Promise.all([
            Order.create(firstOrder),
            Order.create(secondOrder)
        ]).then(function () {
            authUser
                .get("/api/orders")
                .set("Accept", "application/json")
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.equal(res.body.length, 2);
                    done();
                });
        });
    });
});

describe("POST /api/orders", function () {
    var req = {
        employeeId: "15558",
        employeeName: "Ravi",
        drinks: [{
            name: "apple",
            quantity: 5
        }, {
            name: "orange",
            quantity: 7
        }],
        isSwipe: false,
        region: "Bangalore"
    };

    it("should place an order", function (done) {
        Users.collection.insert({
            empId: "15558",
            internalNumber: "00222",
            employeeName: "Ravi"
        }).then(function () {
            authUser
                .post("/api/orders")
                .set("Accept", "application/json")
                .send(req)
                .expect(200)
                .end(function (err, response) {
                    if (err) return done(err);
                    var res = response.body;
                    assert.equal(res.orderStatus, "success");
                    Order.find({
                        employeeId: req.employeeId
                    }).exec(function (err, order) {
                        assert.notEqual(order, undefined);
                        assert.equal(order.length, 2);
                        done();
                    });
                });
        });
    });
});

afterEach(function (done) {
    for (var i in mongoose.connection.collections) {
        Users.collection.remove();
        Order.collection.remove();
        mongoose.connection.collections[i].remove(function (err) {});
    }
    return done();
});