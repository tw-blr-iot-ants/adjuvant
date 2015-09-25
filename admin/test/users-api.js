
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var databaseConfig = require('../app/config/database-test');
var Users = require('../app/models/users');
var server = require('../app/server').app;

var user1, user2;
var request = require('supertest')(server);

before(function(done) {
    mongoose.createConnection(databaseConfig.url);
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
      });
    }
    user1 = new Users({
			EmpId: "12345",
			SNo: "1",
			ExternalNumber: "111",
			InternalNumber: "222",
			EmployeeName: "Employee1"
		});
    user1.save();
    
    user2 = new Users({
			EmpId: "12346",
            SNo: "2",
            ExternalNumber: "333",
            InternalNumber: "444",
            EmployeeName: "Employee2"
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
        assert.equal(response[0].EmpId, "12345");
        assert.equal(response.length, 2);
        
        done();
      });
  });  
  
});

describe('POST /api/users/', function() {

  it('should create a user', function(done){
    request
      .post('/api/users/')
      .send({ EmpId: "12347", SNo: "3", ExternalNumber: "555", InternalNumber: "666", EmployeeName: "Employee3"})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.notEqual(response._id, undefined);
        assert.equal(response.EmpId, "12347");
        Users.findOne({ _id: response._id }).exec(function (err, user) {
            assert.notEqual(user, undefined);
            done();
		    });
      });
  });

});

describe('GET /api/users/:empId/:internalNumber', function() {

  it('should return a single user', function(done){
    request
      .get('/api/users/' + user1.EmpId + '/' + user1.InternalNumber)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.equal(response.EmployeeName, "Employee1");

        done();
      });
  });

});

describe('PUT /api/users/:empId/:internalNumber', function() {

  it('should update a single user', function(done){
    request
      .put('/api/users/' + user1.EmpId + '/' + user1.InternalNumber)
      .send({EmployeeName: 'New Employee1', EmpId: "12345", SNo: "1", ExternalNumber: "111", InternalNumber: "222"})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Users.findOne({EmpId: user1.EmpId }).exec(function (err, user) {
            assert.equal(user.EmployeeName, 'New Employee1');
            done();
		    });
      });
  });

});

describe('DELETE /api/users/:empId/:internalNumber', function() {

  it('should delete a single user', function(done){
    request
      .delete('/api/users/' + user2.EmpId + '/' + user2.InternalNumber)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Users.findOne({ EmpId: user2.EmpId }).exec(function (err, user) {
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
  mongoose.disconnect();
  return done();
});
