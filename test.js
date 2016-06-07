var varint = require('./index')
  , test = require('tape')
  , decode = varint.decode
  , encode = varint.encode
  , encodeSafe = varint.encodeSafe
  , decodeSafe = varint.decodeSafe
  , encodingLength = varint.encodingLength

test('fuzz test', function(assert) {
  var expect
    , encoded

  for(var i = 0, len = 100; i < len; ++i) {
    expect = randint(0x7FFFFFFF)
    encoded = encode(expect)
    var data = decode(encoded)
    assert.equal(expect, data, 'fuzz test: ' + expect.toString())
    assert.equal(decode.bytes, encoded.length)
  }

  assert.end()
})

test('test single byte works as expected', function(assert) {
  var buf = new Uint8Array(2)
  buf[0] = 172
  buf[1] = 2
  var data = decode(buf)
  assert.equal(data, 300, 'should equal 300')
  assert.equal(decode.bytes, 2)
  assert.end()
})

test('test encode works as expected', function(assert) {
  var out = []

  assert.deepEqual(encode(300), [0xAC, 0x02])

  assert.end()
})

test('test encodeSafe works as expected', function(assert) {
  assert.deepEqual(encodeSafe(intToBuffer(300)), encode(300))

  assert.end()
})

test('test decode single bytes', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  var buf = new Uint8Array(1)
  buf[0] = expected
  var data = decode(buf)
  assert.equal(data, expected)
  assert.equal(decode.bytes, 1)
  assert.end()
})

test('test decode multiple bytes with zero', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  var buf = new Uint8Array(2)
  buf[0] = 128
  buf[1] = expected
  var data = decode(buf)
  assert.equal(data, expected << 7)
  assert.equal(decode.bytes, 2)
  assert.end()
})

test('encode single byte', function(assert) {
  var expected = randint(parseInt('1111111', '2'))
  assert.deepEqual(encode(expected), [expected])
  assert.equal(encode.bytes, 1)
  assert.end()
})

test('encode multiple byte with zero first byte', function(assert) {
  var expected = 0x0F00
  assert.deepEqual(encode(expected), [0x80, 0x1E])
  assert.equal(encode.bytes, 2)
  assert.end()
})

test('big integers', function (assert) {

  var bigs = []
  for(var i = 32; i <= 53; i++) (function (i) {
    bigs.push(Math.pow(2, i) - 1)
    bigs.push(Math.pow(2, i))
  })(i)

  bigs.forEach(function (n) {
    var data = encode(n)
    console.error(n, '->', data)
    assert.equal(decode(data), n)
    assert.notEqual(decode(data), n - 1)
  })
  assert.end()
})

test('big integers safe', function (assert) {
  var bigs = []
  for(var i = 32; i <= 53; i++) (function (i) {
    bigs.push(Math.pow(2, i) - 1)
    bigs.push(Math.pow(2, i))
  })(i)

  bigs.forEach(function (n) {
    console.error(n, '->', data)
    var data = encode(n)
    assert.equal(bufferToInt(decodeSafe(data)), n)

    var safeData = encodeSafe(intToBuffer(n))
    assert.equal(bufferToInt(decodeSafe(safeData)), n)
  })
  assert.end()
})

test('unsafe numbers', function(assert) {
  var unsafes = []
  unsafes.push(new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x0f]));
  unsafes.push(new Buffer([0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x0f]));
  unsafes.push(new Buffer([0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x0f]));

  unsafes.forEach(function (n) {
    var data = encodeSafe(n)
    console.error(n, '->', data)
    assert.equal(decodeSafe(data).toString(), n.toString())
  })
  assert.end()
});

test('fuzz test - big', function(assert) {
  var expect
    , encoded

  var MAX_INTD = Math.pow(2, 55)
  var MAX_INT = Math.pow(2, 31)

  for(var i = 0, len = 100; i < len; ++i) {
    expect = randint(MAX_INTD - MAX_INT) + MAX_INT
    encoded = encode(expect)
    var data = decode(encoded)
    assert.equal(expect, data, 'fuzz test: ' + expect.toString())
    assert.equal(decode.bytes, encoded.length)
  }

  assert.end()
})

test('fuzz test - safe', function(assert) {
  var expect
    , encoded

  var MAX_INT = Math.pow(2, 63) - 1

  for(var i = 0, len = 100; i < len; ++i) {
    expect = randbuf(MAX_INT)
    encoded = encodeSafe(expect)
    var data = decodeSafe(encoded)
    assert.equal(expect.toString(), data.toString(), 'fuzz test: ' + expect.toJSON().data)
    assert.equal(decodeSafe.bytes, encoded.length)
  }

  assert.end()
})

test('encodingLength', function (assert) {

  for(var i = 0; i <= 53; i++) {
    var n = Math.pow(2, i)
    assert.equal(encode(n).length, encodingLength(n))
  }

  assert.end()
})

test('encodingLength - safe', function (assert) {
  for(var i = 0; i <= 53; i++) {
    var n = intToBuffer(Math.pow(2, i))
    assert.equal(encodingLength(n), encodeSafe(n).length)
  }

  assert.end()
})

test('buffer too short', function (assert) {

  var value = encode(9812938912312)
  var buffer = encode(value)

  var l = buffer.length
  while(l--) {
    var val = decode(buffer.slice(0, l))
    assert.equal(val, undefined)
    assert.equal(decode.bytesRead, 0)
  }
  assert.end()
})

test('buffer too short - safe', function (assert) {
  var value = encode(9812938912312)
  var buffer = encode(value)

  var l = buffer.length
  while(l--) {
    var val = decodeSafe(buffer.slice(0, l))
    assert.equal(val, undefined)
    assert.equal(decodeSafe.bytes, 0)
  }
  assert.end()
})

function randint(range) {
  return Math.floor(Math.random() * range)
}

function randbuf(range) {
  return intToBuffer(randint(range))
}

function intToBuffer(int) {
  var buffer = new Buffer(8)

  for(var index = 0; index < 8; index++) {
    var byte = int & 0xff
    buffer[index] = byte
    int = (int - byte) / 256
  }

  return buffer
}

function bufferToInt(buffer) {
  var value = 0
  for(var i = buffer.length - 1; i >= 0; i--) {
    value = (value * 256) + buffer[i]
  }

  return value
}
