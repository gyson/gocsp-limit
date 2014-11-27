
var limit = require('./index')
var go = require('gocsp-go')
var thunk = require('gocsp-thunk')
var readFile = thunk.ify(require('fs').readFile)

// limit, like go, but with max concurrency
var limitGo = limit(5)
var index = 0
for (var i = 0; i < 10; i++) {
    limitGo(function* () {
        // max 5 concurrency
        // ...
        // ...
    })
}

// limit.wrap, like go.wrap, but with max concurrency
go(function* () {
    var files = yield [
        'example.js',
        'index.js',
        'package.json',
        'README.md',
        'test.js'
    ].map(limit.wrap(3, function* (filename) {
        return yield readFile(__dirname + '/' + filename, 'utf8')
    }))
})
