# couchdb-view-tester

> Your friendly helper to quickly iterate on CouchDB views

## CLI usage

```
# npm install -g couchdb-view-tester
couchdb-view-tester <db url> [--watch] --map=<path to map function> --reduce=<path to reduce function> <view options>
```

### Example

Give your CouchDB database you want to test your map/reduce function on
is accessible at http://localhost:5984/mydb, do

```
couchdb-view-tester http://localhost:5984/mydb --map=./path/to/map.js --reduce=./path/to/reduce.js --limit=3
```

Both, `map.js` and `reduce.js` must return an anonymous function, for example

```js
// map.js
module.exports = function(doc) {
  if (doc.Type == "customer") {
    emit(doc._id, doc.LastName);
  }
}
```

```js
// reduce.js
function (key, values, rereduce) {
  return sum(values);
}
```

### View options

Options are equal to PouchDB's `db.query` options:
http://pouchdb.com/api.html#query_database

## Future plans / ideas

- add support for built in reduce functions
- add support for map functions only
- add docs for usage via `require('couchdb-view-tester')`
- add yours™
