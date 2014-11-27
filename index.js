
module.exports = exports = limit

var go = require('gocsp-go')
var thunk = require('gocsp-thunk')
var LinkList = require('link-list')

function Task(gen, done) {
    this.gen = gen
    this.done = done
}

function limit(max) {
    if (!isPositiveInteger(max)) {
        throw new TypeError(max + ' is not positive integer')
    }

    var count = 0
    var list = new LinkList()

    function check() {
        if (!list.isEmpty() && count < max) {
            var task = list.shift()
            count += 1
            go(task.gen)(function (err, val) {
                count -= 1
                task.done(err, val)
                check()
            })
            check()
        }
    }

    return function (gen) {
        return thunk(function (done) {
            list.push(new Task(gen, done))
            check()
        })
    }
}
exports.limit = limit

function wrap(max, fn) {
    if (!isGeneratorFunction(fn)) {
        throw new TypeError(fn + ' is not generator function')
    }
    var limitGo = limit(max)
    return function () {
        return limitGo(fn.apply(this, arguments))
    }
}
exports.wrap = wrap

// es7 async function
function async(max, fn) {
    if (!Promise) {
        throw new Error('Cannot find Promise')
    }
    if (!isGeneratorFunction(fn)) {
        throw new TypeError(fn + ' is not generator function')
    }
    var limitGo = limit(max)
    return function () {
        return new Promise(limitGo(fn.apply(this, arguments)))
    }
}
exports.async = async

function isPositiveInteger(obj) {
    return obj === (~~obj) && obj > 0
}

function isGeneratorFunction(obj) {
    return obj && obj.constructor
        && obj.constructor.name === 'GeneratorFunction'
}
