const { deepEqual } = require('assert')
const h = require('highland')
const { ap, contramap, traverse } = require('../index')

const log = msg => (...msgs) => h.log(`${msg}:`, ...msgs)

const delay = ms => x => h(push => setTimeout(() => {
  push(null, x)
  push(null, h.nil)
}, ms))

const toPairs = x => Object.keys(x)
  .reduce((acc, key) => acc.concat([[key, x[key]]]), [])

const getTeam = ([name, id]) => h.of(id)
  .map(id => ({ [name]: id }))
  .flatMap(delay(100))

console.time('traverse')
h.of({ home: 1, away: 2 })
  .flatMap(toPairs)
  .through(traverse(h.of, getTeam))
  .sequence()
  .reduce1((x, y) => Object.assign({}, x, y))
  .tap(xs => console.timeEnd('traverse', xs))
  .tap(log('traverse'))
  .each(xs => deepEqual(xs, { home: 1, away: 2 }))

// const toUpperCase = x => x.toUpperCase()
// const split = str => x => x.split(str)
// const reverse = x => x.reverse()
// const join = str => x => x.join(str)

// h.of(f => g => h => i => x => f(g(h(i(x)))))
//   .through(ap(h.of(toUpperCase)))
//   .through(ap(h.of(join(''))))
//   .through(ap(h.of(reverse)))
//   .through(ap(h.of(split(''))))
//   .through(ap(h([ 'ih', 'eyb' ])))
//   .collect()
//   .tap(log('greetings'))
//   .each(xs => deepEqual(xs, [ 'HI', 'BYE' ]))

// const add = y => x => x + y
// const times = y => x => x * y

// h.of(f => g => x => f(g(x)))
//   .through(ap(h.of((add(1)))))
//   .through(ap(h.of(times(4))))
//   .through(ap(h([ 1, 3 ])))
//   .collect()
//   .tap(log('math'))
//   .each(xs => deepEqual(xs, [ 5, 13 ]))
