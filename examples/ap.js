const { deepStrictEqual } = require('assert')
const h = require('highland')
const { ap, contramap } = require('../index')

const log = msg => (...msgs) => h.log(msg, ...msgs)

const length = x => x.length
h.of(length)
  .through(ap(h([ [ 0, 0 ], [ 0 ] ])))
  .collect()
  .tap(log('length'))
  .each(xs => deepStrictEqual(xs, [ 2, 1 ]))

const toUpperCase = x => x.toUpperCase()
const split = str => x => x.split(str)
const reverse = x => x.reverse()
const join = str => x => x.join(str)

h.of(x => x)
  .through(contramap(toUpperCase))
  .through(contramap(join('')))
  .through(contramap(reverse))
  .through(contramap(split('')))
  .through(ap(h([ 'ih', 'eyb' ])))
  .collect()
  .tap(log('greetings'))
  .each(xs => deepStrictEqual(xs, [ 'HI', 'BYE' ]))

const add = y => x => x + y
const times = y => x => x * y

h.of(g => x => g(x))
  .through(ap(h.of(add(1))))
  .through(contramap(times(4)))
  .through(ap(h([ 1, 3 ])))
  .collect()
  .tap(log('math'))
  .each(xs => deepStrictEqual(xs, [ 5, 13 ]))
