
var test = require('tape')
var assert = require('assert')
var limit = require('./index')
var go = require('gocsp-go')
var thunk = require('gocsp-thunk')
var timeout = require('gocsp-timeout')

test('limit()', function (t) {
    var max = 5
    var count = 0
    var highest = 0
    function check() {
        t.assert(count <= max)
        highest = highest > count ? highest : count
    }
    var limitGo = limit(max)

    go(function* () {
        var list = []
        for (var i = 0; i < 20; i++) {
            list.push(limitGo(function* () {
                count += 1
                check()
                while (Math.random() > 0.5) {
                    yield timeout(5)
                }
                check()
                count -= 1
            }))
        }
        yield list
        t.equal(highest, max)
        t.end()
    })
})

// test('limit.wrap()', function (t) {
//
// })
//
// test('limit.async()', function (t) {
//
// })
