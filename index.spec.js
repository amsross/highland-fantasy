const test = require('tape')
const h = require('highland')

test('highland-fantasy', assert => {
  test('empty', assert => {
    const { empty } = require('./index')

    assert.equal(typeof empty, 'function', 'is a function')
    assert.ok(h.isStream(empty()), 'returns a stream')

    const rightIdentity = h.of('right-identity')
      .concat(empty())
      .collect()
      .tap(xs => assert.deepEqual(xs, ['right-identity'], 'right identity'))
      .errors(err => assert.ifError(err))

    const leftIdentity = empty()
      .concat(h.of('left-identity'))
      .collect()
      .tap(xs => assert.deepEqual(xs, ['left-identity'], 'left identity'))
      .errors(err => assert.ifError(err))

    h([rightIdentity, leftIdentity])
      .merge()
      .errors(err => assert.ifError(err))
      .done(assert.end)
  })

  test('contramap', assert => {
    const { contramap } = require('./index')

    assert.equal(typeof contramap, 'function', 'is a function')

    const identity = h.of(x => x)
      .through(contramap(x => x))
      .map(f => f(1))
      .collect()
      .tap(xs => assert.deepEqual(xs, [1], 'identity'))
      .errors(err => assert.ifError(err))

    const f = x => x + 2
    const g = x => x / 2
    const composition = h.of(x => x)
      .through(contramap(x => f(x)))
      .through(contramap(x => g(x)))
      .map(f => f(1))
      .collect()
      .tap(xs => assert.deepEqual(xs, [f(g(1))], 'composition'))
      .errors(err => assert.ifError(err))

    h([identity, composition])
      .merge()
      .errors(err => assert.ifError(err))
      .done(assert.end)
  })

  test('ap', assert => {
    const { ap } = require('./index')

    assert.equal(typeof ap, 'function', 'is a function')

    const f = x => y => x / y
    const composition = h.of(f)
      .through(ap(h.of(1)))
      .through(ap(h.of(2)))
      .collect()
      .tap(xs => assert.deepEqual(xs, [f(1)(2)], 'composition'))
      .errors(err => assert.ifError(err))

    h([composition])
      .merge()
      .errors(err => assert.ifError(err))
      .done(assert.end)
  })

  test('traverse', assert => {
    const { traverse } = require('./index')

    assert.equal(typeof traverse, 'function', 'is a function')

    const t = x => h.of(x + 1)
    const naturality = h([ 0, 1, 2 ])
      .through(traverse(h.of, t))
      .tap(xs => assert.deepEqual(xs, [ 1, 2, 3 ], 'naturality'))
      .errors(err => assert.ifError(err))

    const identity = h([ 0, 1, 2 ])
      .through(traverse(h.of, h.of))
      .tap(xs => assert.deepEqual(xs, [ 0, 1, 2 ], 'identity'))
      .errors(err => assert.ifError(err))

    const composition = h.of({})
      .errors(err => assert.ifError(err))
      // .collect()
      // .tap(xs => assert.deepEqual(xs, [1], 'composition'))

    h([naturality, identity, composition])
      .merge()
      .errors(err => assert.ifError(err))
      .done(assert.end)
  })

  assert.end()
})
