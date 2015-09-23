var request = require('supertest');
var express = require('express');
var assert = require('chai').assert;

describe('Sample Test Suite', function() {  
  it('True must never be False', function(done){
    assert.notEqual(true, false);
    done();
  });  
});
