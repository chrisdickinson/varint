module.exports = read

var MSB = 0x80
  , REST = 0x7F
  , TWO_POWER_SEVEN = Math.pow(2, 7)

function read(buf, offset) {
  var res    = 0
    , offset = offset || 0
    , shift  = 1
    , counter = offset
    , b
    , l = Math.pow(TWO_POWER_SEVEN, buf.length - offset < 8 ? (buf.length - offset) * 7 : 49)

  do {
    if (shift > l) {
      read.bytes = 0
      throw new RangeError('Could not decode varint')
    }
    b = buf[counter++]
    res += (b & REST) * shift
    shift = shift * TWO_POWER_SEVEN
  } while (b >= MSB)

  read.bytes = counter - offset

  return res
}
