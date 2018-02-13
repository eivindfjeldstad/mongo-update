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
    assert(query.$unset.a == '');
    assert(!('$set' in query));
  });
  
  it('should not $unset missing keys', function () {
    var query = diff({ a: 1 }, {});
    assert(!('$set' in query));
    assert(!('$unset' in query));
  });
  
  it('should work with nested keys', function () {
    var query = diff({ a: { b: 1, c: 2 }}, { a: { b: 2, c: null }});
    assert(query.$set['a.b'] == 2);
    assert(query.$unset['a.c'] == '');
  });
  
  describe('when given a filter', function () {
    it('should minify the query', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 });
      assert(query.$set.a == 2);
      assert(!('b' in query.$set));
    });
    
    it('should work with nested keys', function () {
      var query = diff({ a: { b: 1, c: 2 }}, { a: { b: 2, c: null }}, { 'a.b': 1 });
      assert(query.$set['a.b'] == 2);
      assert(!('$unset' in query));
    });
  });
  
  describe('when given a prefix', function () {
    it('should prefix all keys', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, 'prefix.$');
      assert(query.$set['prefix.$.a'] == 2);
      assert(query.$set['prefix.$.b'] == 3);
    });
    
    it('should work with a filter', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 }, 'prefix.$');
      assert(query.$set['prefix.$.a'] == 2);
      assert(!('prefix.$.b' in query.$set));
    });
  })
  
  describe('when given a prefix and a filter', function () {
    it('should prefix all keys in the filter', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 }, 'prefix.$');
      assert(query.$set['prefix.$.a'] == 2);
      assert(!('prefix.$.b' in query.$set));
    });
    
    it('should accept them in any order', function () {
      var query = diff({ a: 1, b: 2 }, { a: 2, b: 3 }, 'prefix.$', { a: 1 });
      assert(query.$set['prefix.$.a'] == 2);
      assert(!('prefix.$.b' in query.$set));
    });
  })
})