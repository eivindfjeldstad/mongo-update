var minify = require('mongo-minify');
var is = require('component-type');
var eql = require('mongo-eql');

/**
 * Diff two objects and return a MongoDB update query
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Object} [filter]
 * @param {String} [prefix]
 * @return {Object}
 * @api public
 */

module.exports = function (a, b, filter, prefix) {
  var ret = {};
  
  if (typeof filter == 'string') {
    prefix = filter;
    filter = {};
  }
  
  if (prefix) {
    for (var key in filter) {
      filter[join(key, prefix)] = prefix[key];
      delete prefix[key];
    }
  }
  
  filter = filter || {};
  diff(a, b, ret, prefix);
  
  return minify(ret, filter);
}

/**
 * Traverse both objects and put ops on the `query` object
 */

function diff (a, b, query, prefix) {
  for (var key in b) {
    var path = join(key, prefix);
    
    // removed
    if (b[key] == null) {
      unset(query, path);
      continue;
    }
    
    // no change
    if (eql(a[key], b[key])) continue;
    
    // new type
    if (is(a[key]) != is(b[key])) {
      set(query, path, b[key]);
      continue;
    }
    
    // object
    if (is(a[key]) == 'object') {
      diff(a[key], b[key], query, path);
      continue;
    }
    
    // default
    set(query, path, b[key]);
  }
}

/**
 * $set `field` to `val`
 */

function set (query, field, val) {
  query['$set'] = query['$set'] || {};
  query['$set'][field] = val;
}

/**
 * $unset `field`
 */

function unset (query, field) {
  query['$unset'] = query['$unset'] || {};
  query['$unset'][field] = 1;
};

/**
 * Join `key` with `prefix` using dot-notation
 */

function join (key, prefix) {
  return prefix
    ? prefix + '.' + key
    : key;
}