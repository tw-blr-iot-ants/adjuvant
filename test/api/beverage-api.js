require('@babel/register')
var assert = require('chai').assert;
var mongoose = require('mongoose');
var Beverage = require('../../app/models/beverage');
var server = require('../../app/server').app;
require("../../app/testDatabase");
const credentials = require('./api-credentials.json')

var beverage, testBeverage;
var request = require('supertest');
var authUser = request.agent(server);

before((done) => {
  authUser
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({"username": credentials.username,"password":credentials.password,"region":"Bangalore"})
      .end(function(err, res){
        assert.equal(res.statusCode,200);
        done();
  });
});

beforeEach((done) => {

    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove( function(err) {
      });
    }
    beverage = new Beverage({
			name: "Tea",
			cost: 10,
      available: true,
      relevancy: 0,
      type: "juice",
      lastUpdated: new Date(),
      isFruit: false
		});
    beverage.save();

    testBeverage = new Beverage({
			name: "TestBeverage",
			cost: 10,
      available: true,
      relevancy: 0,
      type: "juice",
      lastUpdated: new Date(),
      isFruit: false
		});
    testBeverage.save();
    done();
});

describe('GET /api/beverages/', function() {

  it('should return list of beverages', function(done){
    authUser
      .get('/api/beverages')
      .set('Accept', 'application/json')
  
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);

        var response = res.body;
        assert.isTrue(response.map(function(res) {return res.name;}).includes("Tea"));
        assert.equal(response.length, 2);

        done();
      });
  });

});

describe('POST /api/beverages/', function() {

  it('should create a beverage', function(done){
    authUser
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
    authUser
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

  it('should return 404 if not found', function(done){
    authUser
      .get('/api/beverages/56087044770aef8e9a9b08ed')
      .set('Accept', 'application/json')
  
      .expect(404)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

});

describe('PUT /api/beverages/:id', function() {

  it('should update a single beverage', function(done){
    authUser
      .put('/api/beverages/' + beverage.id)
      .send({ name: 'Updated Name', cost: 15, available: true})
      .set('Accept', 'application/json')
  
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        Beverage.findOne({ _id: beverage.id }).exec(function (err, beverage) {
            assert.equal(beverage.name, 'Updated Name');
            done();
		    });
      });
  });

});

describe('DELETE /api/beverages/:beverageName', function() {

  it('should not return the item that is deleted', function(done){
    authUser
      .delete('/api/beverages/' + testBeverage.name)
  
      .end(function(err, res){
        if (err) return done(err);
        Beverage.findOne({ name: testBeverage.name }).exec(function (err, beverage) {
            assert.equal(beverage, undefined);
            done();
		    });
      });
  });

  it('should return 404 if item is not found when deleting', function(done){
    authUser
      .delete('/api/beverages/nonExistingJuiceg')
  
      .expect(404)
      .end(function(err, res){
        if (err) return done(err);
          done();
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