const h = require('highland')

// Monoid
// empty :: Monoid m => () -> m
const empty = () => h([])

// Contravariant
// contramap :: Contravariant f => f a ~> (b -> a) -> f b
const contramap = f => xs => xs.map(g => x => g(f(x)))

// Apply
// ap :: Apply f => f a ~> f (a -> b) -> f b
const ap = xs => fns => fns
  .map(fn => xs.fork().map(fn))
  .parallel(Infinity)

const append = y => xs => xs.concat(y)

const lift = f => (...xs) => xs
  .reduce((acc, x) => acc.through(ap(x)), h.of(f))

module.exports = {
  empty,
  contramap,
  ap,
  append,
  lift
}
