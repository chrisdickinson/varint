module.exports = encodeSafe

// implementation taken from google protobuf package https://github.com/google/protobuf/tree/master/js

var MSB = 0x80
  , REST = 0x7F

function split(hash) {
  var a = hash[0]
  var b = hash[1]
  var c = hash[2]
  var d = hash[3]
  var e = hash[4]
  var f = hash[5]
  var g = hash[6]
  var h = hash[7]

  var low = (a + (b << 8) + (c << 16) + (d << 24)) >>> 0
  var high = (e + (f << 8) + (g << 16) + (h << 24)) >>> 0

  return [low, high]
}

function encodeSafe(num, out, offset) {
  out = out || []
  offset = offset || 0
  var oldOffset = offset
  var splited = split(num)
  var lowBits = splited[0]
  var highBits = splited[1]

  while (highBits > 0 || lowBits > 127) {
    out[offset++] = (lowBits & REST) | MSB
    lowBits = ((lowBits >>> 7) | (highBits << 25)) >>> 0
    highBits = highBits >>> 7
  }
  out[offset++] = lowBits

  encodeSafe.bytes = offset - oldOffset + 1

  return out
}
