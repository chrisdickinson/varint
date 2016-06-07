module.exports = decodeSafe

// implementation taken from google protobuf package https://github.com/google/protobuf/tree/master/js

var MSB = 0x80
  , REST = 0x7F

function join(bitsLow, bitsHigh) {
  var a = (bitsLow >>> 0) & 0xFF
  var b = (bitsLow >>> 8) & 0xFF
  var c = (bitsLow >>> 16) & 0xFF
  var d = (bitsLow >>> 24) & 0xFF
  var e = (bitsHigh >>> 0) & 0xFF
  var f = (bitsHigh >>> 8) & 0xFF
  var g = (bitsHigh >>> 16) & 0xFF
  var h = (bitsHigh >>> 24) & 0xFF

  return new Buffer([a, b, c, d, e, f, g, h])
}

function decodeSafe(buf, offset) {
  offset = offset || 0
  var counter = offset
  var temp
  var lowBits = 0
  var highBits = 0

  // Read the first four bytes of the varint, stopping at the terminator if we
  // see it.
  for (var i = 0; i < 4; i++) {
    temp = buf[counter++]
    lowBits |= (temp & 0x7F) << (i * 7)
    if (temp < 128) {
      decodeSafe.bytes = counter - offset
      return join(lowBits >>> 0, 0)
    }
  }

  // Read the fifth byte, which straddles the low and high dwords.
  temp = buf[counter++]
  lowBits |= (temp & 0x7F) << 28
  highBits |= (temp & 0x7F) >> 4
  if (temp < 128) {
    decodeSafe.bytes = counter - offset
    return join(lowBits >>> 0, highBits >>> 0)
  }

  // Read the sixth through tenth byte.
  for (var i = 0; i < 5; i++) {
    temp = buf[counter++]
    highBits |= (temp & 0x7F) << (i * 7 + 3)
    if (temp < 128) {
      decodeSafe.bytes = counter - offset
      return join(lowBits >>> 0, highBits >>> 0)
    }
  }

  decodeSafe.bytes = 0
  return undefined
}
