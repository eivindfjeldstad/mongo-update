var assert = require('assert');
var diff = require('./');

describe('query()', function () {
  it('should $set modified keys', function () {
    var query = diff({ a: 1 }, { a: 2 });
    assert(query.$set.a == 2);
    assert(!('$unset' in query));
  });
  
  it('should $unset null-ish keys', function () {
    var query = diff({ a: 1 }, { a: null });
    assert(query.$unset.a == 1);
    assert(!('$set' in query));
  });
  
  it('should work with nested keys', function () {
    var query = diff({ a: { b: 1, c: 2 }}, { a: { b: 2 }});
    assert(query.$set['a.b'] == 2);
    assert(query.$unset['a.c'] == 1);
  });
  
  describe('when given a filter', function () {
    it('should minify the query', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 });
      assert(query.$set.a == 2);
      assert(!('b' in query.$set));
    });
    
    it('should work with nested keys', function () {
      var query = diff({ a: { b: 1, c: 2 }}, { a: { b: 2 }}, { 'a.b': 1 });
      assert(query.$set['a.b'] == 2);
      assert(!('$unset' in query));
    });
  });
})