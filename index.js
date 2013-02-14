module.exports = varint

varint.encode = encode

var EE = require('events').EventEmitter
  , MSB = 0x80
  , REST = 0x7F
  , MSBALL = ~REST

function varint() {
  var ee = new EE

  ee.write = write
  ee.accum = []

  return ee
}

function encode(num, out, offset) {
  out = out || []
  offset = offset || 0

  while(num & MSBALL) {
    out[offset++] = (num & 0xFF) | MSB 
    num >>>= 7
  }
  out[offset] = num
  return out
}

function write(byte) {
  var msb = byte & MSB
    , accum = this.accum
    , len
    , out

  accum[accum.length] = byte & REST
  if(msb) {
    return
  }

  len = accum.length
  out = 0

  for(var i = 0; i < len; ++i) {
    out |= accum[i] << (7 * i)
  }

  accum.length = 0
  this.emit('data', out)
  return
}
