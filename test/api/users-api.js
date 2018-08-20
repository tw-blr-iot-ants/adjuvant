var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var Users = require('../../app/models/user');
var NewUsers = require('../../app/models/newUser');
var server = require('../../app/server').app;
require("../../app/testDatabase");
var user1, user2, user3, userNotInMasterDB;
var request = require('supertest');
var authUser = request.agent(server);
before((done) => {
  authUser
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({"username":"admin","password":"d+Lp:dBT8**zKSd","region":"Bangalore"})
      .end(function(err, res){
        assert.equal(res.statusCode,200);
        done();
  });
});
beforeEach(function(done) {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove( function(err) {
      });
    }
    var today = new Date();
    user1 = new Users({
			empId: "12345",
			internalNumber: "00222",
			employeeName: "Employee1"
		});
    user1.save();
    user2 = new Users({
			empId: "12346",
            internalNumber: "444",
            employeeName: "Employee2"
		});
    user2.save();
    user3 = new NewUsers({
            empId: "56789",
            internalNumber: "44411",
            employeeName: "Employee3",
            date: today
    });
    user3.save();
    userNotInMasterDB = new NewUsers({
                empId: "11111",
                internalNumber: "77777",
                employeeName: "SoemOne",
                date: today
         })
    userNotInMasterDB.save();
    return done();
});
describe('GET /api/users/', function() {
  it('should return list of users', function(done){
    authUser
      .get('/api/users/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var response = res.body;
        assert.equal(response.length, 2);
        done();
      });
  });
});
describe('POST /api/users/', function() {
  it('should create a user', function(done){
    authUser
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
    authUser
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
  it('should return a single newly registered user', function(done){
    authUser
      .get('/api/users/empId/' + user3.empId)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var response = res.body;
        assert.equal(response.employeeName, "Employee3");
        done();
      });
  });
});
describe('GET /api/users/empId/:empId should return 404 if the user is not present in both users and new users', function() {
  it('should return a single user', function(done){
    authUser
      .get('/api/users/empId/99999')
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
    authUser
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
describe('GET /api/users/internalNumber/:internalNumber from newUsers', function() {
  it('should get user from registerDB(newUsersDB) if not present in usersDB', function(done) {
    authUser
            .get('/api/users/internalNumber/' + userNotInMasterDB.internalNumber)
            .set('Accept', 'application/json')
            .expect(302, done) //redirection to newUserDB
    })
});
describe('PUT /api/users/:empId', function() {
  it('should update a single user', function(done){
    authUser
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
    authUser
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
afterEach(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove( function(err) {
    });
  }
  return done();
});