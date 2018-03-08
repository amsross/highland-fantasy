const { deepEqual } = require('assert')
const h = require('highland')
const { traverse } = require('../index')

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
  .tap(() => console.timeEnd('traverse'))
  .tap(log('traverse'))
  .each(xs => deepEqual(xs, { home: 1, away: 2 }))
