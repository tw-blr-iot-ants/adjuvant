var request = require('supertest');
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var databaseConfig = require('../app/config/database-test');
var Beverage = require('../app/models/beverage');
var server = require('../app/server').app;

var beverage;

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
    return done();
});
  
describe('GET /api/beverages/', function() {
  
  it('should return list of beverages', function(done){
    request(server)
      .get('/api/beverages/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        
        var response = res.body;
        assert.equal(response[0].name, "Tea");
        assert.equal(response.length, 1);
        
        done();
      });
  });  
  
});

describe('GET /api/beverages/:id', function() {
  
  it('should return a single beverage', function(done){
    request(server)
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

after(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].drop( function(err) {
    });
  }
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.disconnect();
  return done();
});
