const { deepEqual } = require('assert')
const h = require('highland')
const { ap } = require('../index')

const log = msg => (...msgs) => h.log(msg, ...msgs)

const length = x => x.length
h.of(length)
  .through(ap(h([ [ 0, 0 ], [ 0 ] ])))
  .collect()
  .tap(log('length'))
  .each(xs => deepEqual(xs, [ 2, 1 ]))

const toUpperCase = x => x.toUpperCase()
const split = str => x => x.split(str)
const reverse = x => x.reverse()
const join = str => x => x.join(str)

h.of(f => g => h => i => x => f(g(h(i(x)))))
  .through(ap(h.of(toUpperCase)))
  .through(ap(h.of(join(''))))
  .through(ap(h.of(reverse)))
  .through(ap(h.of(split(''))))
  .through(ap(h([ 'ih', 'eyb' ])))
  .collect()
  .tap(log('greetings'))
  .each(xs => deepEqual(xs, [ 'HI', 'BYE' ]))

const add = y => x => x + y
const times = y => x => x * y

h.of(f => g => x => f(g(x)))
  .through(ap(h.of((add(1)))))
  .through(ap(h.of(times(4))))
  .through(ap(h([ 1, 3 ])))
  .collect()
  .tap(log('math'))
  .each(xs => deepEqual(xs, [ 5, 13 ]))
