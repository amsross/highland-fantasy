const { deepStrictEqual } = require('assert')
const h = require('highland')
const { ap, contramap } = require('../index')

const log = msg => (...msgs) => h.log(msg, ...msgs)

const length = x => x.length
h.of(x => x % 2 === 0)
  .through(contramap(length))
  .through(ap(h([ [ 0, 0 ], [ 0 ] ])))
  .collect()
  .tap(log('x % 2 === 0'))
  .each(xs => deepStrictEqual(xs, [ true, false ]))

const toUpperCase = x => x.toUpperCase()
const split = str => x => x.split(str)
const reverse = x => x.reverse()
const join = str => x => x.join(str)

h.of(x => x === 'HELLO')
  .through(contramap(join('')))
  .through(contramap(reverse))
  .through(contramap(split('')))
  .through(contramap(toUpperCase))
  .through(ap(h([ 'olleh', 'tnereffid' ])))
  .collect()
  .tap(log('x === HELLO'))
  .each(xs => deepStrictEqual(xs, [ true, false ]))

const add = y => x => x + y
const times = y => x => x * y

h.of(x => x === 5)
  .through(contramap(add(1)))
  .through(contramap(times(4)))
  .through(ap(h([ 1, 3 ])))
  .collect()
  .tap(log('x === 5'))
  .each(xs => deepStrictEqual(xs, [ true, false ]))
