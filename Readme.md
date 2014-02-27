
# mongo-query

Get object diff as a MongoDB update query.

Useful for reducing the size of your queries.
Uses (cloudup/mongo-eql)[https://github.com/cloudup/mongo-eql] to compare values and
and (cloudup/mongo-minify)[https://github.com/cloudup/mongo-minify] to optionally filter
out disallowed operations.

## Installation

    $ npm install mongo-update

## Example

```js
var update = require('mongo-update');
var query = update({ a: 'hello' }, { b: 'world' });
// => { $set: { b: 'hello' }, $unset: { a: 1 }}
```

Or with a filter (see (cloudup/mongo-minify)[https://github.com/cloudup/mongo-minify] for more examples)
```js
var query = update({ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 1 });
// => { $set: { a: 2 }}
```

## License

  MIT
