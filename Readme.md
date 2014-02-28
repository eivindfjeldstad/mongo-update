
# mongo-update

Diff two objects and return a MongoDB update query. Useful for reducing the size of your queries.

Uses [cloudup/mongo-eql](https://github.com/cloudup/mongo-eql) to compare values and
and [cloudup/mongo-minify](https://github.com/cloudup/mongo-minify) to optionally filter
out disallowed operations.

## Installation

    $ npm install mongo-update

## Example

```js
var update = require('mongo-update');
var query = update({ a: 'hello' }, { b: 'world', a: null });
// => { $set: { b: 'world' }, $unset: { a: 1 }}
```

Or with a filter (see [cloudup/mongo-minify](https://github.com/cloudup/mongo-minify) for more examples)
```js
var query = update({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 });
// => { $set: { a: 2 }}
```

## Note on arrays
By default, arrays will not diffed. This is not ideal when dealing with nested documents.
Instead of trying to implement a complex diffing solution for these cases, `mongo-update`
allows you to define a prefix on your queries.

```js
var child = { age: 10 };
var parent = { children: [child] };

var query = update(child, { age: 20 }, 'children.$');
// => { $set: { 'children.$.age': 20 }}

db.update({ 'children.age': 10 }, query);
```

## License

  MIT
