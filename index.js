const h = require('highland')

// Monoid
// empty :: Monoid m => () -> m
const empty = () => h([])

// Contravariant
// contramap :: Contravariant f => f a ~> (b -> a) -> f b
const contramap = f => xs => xs.map(g => x => g(f(x)))

// Apply
// ap :: Apply f => f a ~> f (a -> b) -> f b
const ap = a => u => h([
  a.map(a => ({ a })),
  u.map(u => ({ u }))
]).merge()
  .scan1((x, y) => Object.assign({}, x, y))
  .filter(({ a, u }) => a && u)
  .map(({ a, u }) => u(a))

// Traversable
// traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
const traverse = (of, f) => xs => xs
  .reduce((acc, x) => lift(append)(f(x), acc), of([]))
  .sequence()

const append = y => xs => xs.concat(y)

const lift = f => (...xs) => xs
  .reduce((acc, x) => acc.through(ap(x)), h.of(f))

module.exports = {
  empty,
  contramap,
  ap,
  traverse,
  append,
  lift
}
