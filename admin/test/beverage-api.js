var request = require('supertest');
var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var databaseConfig = require('../app/config/database-test');
var Beverage = require('../app/models/beverage.js');

before(function(done) {
    mongoose.connect(databaseConfig.url);
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].drop( function(err) {
        console.log('collection dropped');
      });
    }
    var beverage = new Beverage({
			name: "Tea",
			cost: 10,
			available: true
		});		
    beverage.save();					
    return done();
});
  
describe('Sample Test Suite', function() {  
  it('One beverage should be there in DB', function(done){
    Beverage.find().exec(function(error, beverages) {
			if(error) {
				console.log("Error in reading beverages");
				return;
			}
			assert.equal(beverages.length, 1);
      done();
		});
  });  
});

after(function(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].drop( function(err) {
      console.log('collection dropped');
    });
  }
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.disconnect();
  return done();
});
