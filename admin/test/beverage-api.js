
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var databaseConfig = require('../app/config/database-test');
var Beverage = require('../app/models/beverage');
var server = require('../app/server').app;

var beverage, testBeverage;
var request = require('supertest')(server);

before(function(done) {
    mongoose.connect(databaseConfig.url);
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
      });
    }
    beverage = new Beverage({
			name: "Tea",
			cost: 10,
			available: true
		});		
    beverage.save();	
    
    testBeverage = new Beverage({
			name: "TestBeverage",
			cost: 10,
			available: true
		});
    testBeverage.save();		
    return done();
});
  
describe('GET /api/beverages/', function() {
  
  it('should return list of beverages', function(done){
    request
      .get('/api/beverages/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        
        var response = res.body;
        assert.equal(response[0].name, "Tea");
        assert.equal(response.length, 2);
        
        done();
      });
  });  
  
});

describe('POST /api/beverages/', function() {
  
  it('should create a beverage', function(done){
    request
      .post('/api/beverages/')
      .send({ name: 'Lime Juice', cost: 15, available: true})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        
        var response = res.body;
        assert.notEqual(response._id, undefined);
        assert.equal(response.name, "Lime Juice");
        Beverage.findOne({ _id: response._id }).exec(function (err, beverage) {
            assert.notEqual(beverage, undefined);
            done();
		    });
      });
  });  
  
});

describe('GET /api/beverages/:id', function() {
  
  it('should return a single beverage', function(done){
    request
      .get('/api/beverages/' + beverage.id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        
        var response = res.body;
        assert.equal(response.name, "Tea");
        
        done();
      });
  });  
  
});

describe('DELETE /api/beverages/:id', function() {

  it('should delete a single beverage', function(done){
    request
      .delete('/api/beverages/' + testBeverage.id)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Beverage.findOne({ _id: testBeverage.id }).exec(function (err, beverage) {
            assert.equal(beverage, undefined);
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
