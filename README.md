
# gocsp-limit

Parallel execution with max concurrency limit.

## Installation

```
$ npm install gocsp-limit
```

## Example

```js
var go = require('gocsp-go')
var limit = require('gocsp-limit')
var thunk = require('gocsp-thunk')
var readFile = thunk.ify(require('fs').readFile)

go(function* () {
    var files = yield [
        'example.js',
        'index.js',
        'package.json',
        'README.md',
        'test.js'
    // parallel execution with max concurrency 3
    ].map(limit.wrap(3, function* (filename) {
        return yield readFile(__dirname + '/' + filename, 'utf8')
    }))
})
```

## API
### `limit( concurrency )`

like `go` in [gocsp-go](), but with max concurrency limit

Example:
```js
var limitGo = limit(5)
for (var i = 0; i < 10; i++) {
    limitGo(function* () {
        // max 5 concurrency
        // ...
    })
}
```
---
### `limit.wrap( concurrency, generatorFunction )`

like `go.wrap` in [gocsp-go](), but with max concurrency limit

Example:
```js
go(function* () {
    var files = yield [
        'example.js',
        'index.js',
        'package.json',
        'README.md',
        'test.js'
    // parallel execution with max concurrency 3
    ].map(limit.wrap(3, function* (filename) {
        return yield readFile(__dirname + '/' + filename, 'utf8')
    }))
})
```
## License

MIT
