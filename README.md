[highland-fantasy](https://github.com/amsross/highland-fantasy) [![Build Status](https://travis-ci.org/amsross/highland-fantasy.svg?branch=master)](https://travis-ci.org/amsross/highland-fantasy) [![Greenkeeper badge](https://badges.greenkeeper.io/amsross/highland-fantasy.svg)](https://greenkeeper.io/)
======================

### empty
`Monoid m => () -> m`

### contramap
`Contravariant f => (b -> a) -> f a -> f b`

### ap
`Apply f => f (a -> b) -> f a -> f b`

### traverse
`Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)`

### append
`Semigroup a => a -> a -> a`

### lift
`Apply f => f (a... -> b) -> f a... -> f b`
