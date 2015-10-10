
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var Users = require('../app/models/users');
var server = require('../app/server').app;
require("../app/testDatabase");

var user1, user2;
var request = require('supertest')(server);

before(function(done) {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
      });
    }
    user1 = new Users({
			empId: "12345",
			internalNumber: "222",
			employeeName: "Employee1"
		});
    user1.save();

    user2 = new Users({
			empId: "12346",
            internalNumber: "444",
            employeeName: "Employee2"
		});
    user2.save();
    return done();
});

describe('GET /api/users/', function() {

  it('should return list of users', function(done){
    request
      .get('/api/users/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.equal(response[0].empId, "12345");
        assert.equal(response.length, 2);

        done();
      });
  });

});

describe('POST /api/users/', function() {

  it('should create a user', function(done){
    request
      .post('/api/users/')
      .send({ empId: "12347", internalNumber: "666", employeeName: "Employee3"})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.notEqual(response._id, undefined);
        assert.equal(response.empId, "12347");
        Users.findOne({ _id: response._id }).exec(function (err, user) {
            assert.notEqual(user, null);
            done();
		    });
      });
  });

});

describe('GET /api/users/empId/:empId', function() {

  it('should return a single user', function(done){
    request
      .get('/api/users/empId/' + user1.empId)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.equal(response.employeeName, "Employee1");

        done();
      });
  });

});

describe('GET /api/users/empId/:empId should return 404 if the user is not present', function() {

  it('should return a single user', function(done){
    request
      .get('/api/users/empId/11111')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

});

describe('GET /api/users/internalNumber/:internalNumber', function() {

  it('should return a single user', function(done){
    request
      .get('/api/users/internalNumber/' + user1.internalNumber)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.equal(response.employeeName, "Employee1");

        done();
      });
  });

});

describe('PUT /api/users/:empId', function() {

  it('should update a single user', function(done){
    request
      .put('/api/users/' + user1.empId)
      .send({employeeName: 'New Employee1', empId: "12345", internalNumber: "222"})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Users.findOne({empId: user1.empId }).exec(function (err, user) {
            assert.equal(user.employeeName, 'New Employee1');
            done();
		    });
      });
  });

});

describe('DELETE /api/users/:empId', function() {

  it('should delete a single user', function(done){
    request
      .delete('/api/users/' + user2.empId)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Users.findOne({ empId: user2.empId }).exec(function (err, user) {
            assert.equal(user, undefined);
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
