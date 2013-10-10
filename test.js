var varint = require('./index')
  , test = require('tape')
  , decode = varint.decode
  , encode = varint.encode

test('fuzz test', function(assert) {
  var expect
    , encoded

  for(var i = 0, len = 100; i < len; ++i) {
    expect = randint(0x7FFFFFFF)
    encoded = encode(expect)
    var data = decode(encoded)
    assert.equal(expect, data, 'fuzz test: ' + expect.toString())
    assert.equal(decode.bytesRead, encoded.length)
  }

  assert.end()
})

test('test single byte works as expected', function(assert) {
  var buf = new Uint8Array(2)
  buf[0] = 172
  buf[1] = 2
  var data = decode(buf)
  assert.equal(data, 300, 'should equal 300')
  assert.equal(decode.bytesRead, 2)
  assert.end()
})

test('test encode works as expected', function(assert) {
  var out = []

  assert.deepEqual(encode(300), [0xAC, 0x02])

  assert.end()
})

test('test decode single bytes', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  var buf = new Uint8Array(1)
  buf[0] = expected
  var data = decode(buf)
  assert.equal(data, expected)
  assert.equal(decode.bytesRead, 1)
  assert.end()
})

test('test decode multiple bytes with zero', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  var buf = new Uint8Array(2)
  buf[0] = 128
  buf[1] = expected
  var data = decode(buf)
  assert.equal(data, expected << 7)
  assert.equal(decode.bytesRead, 2)
  assert.end()
})

test('encode single byte', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  assert.deepEqual(encode(expected), [expected])
  assert.end()
})

test('encode multiple byte with zero first byte', function(assert) {
  var expected = 0x0F00
  assert.deepEqual(encode(expected), [0x80, 0x1E])
  assert.end()
})

function randint(range) {
  return ~~(Math.random() * range)  
}
