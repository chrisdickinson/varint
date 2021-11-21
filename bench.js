var N = 1e7
var M = 10
/*
  benchmark encoding and decoding N random integers.

  A number is encoded into a buffer, (the buffer is reused so
  that allocation does not affect the benchmark)

  to test the effect on performance of invalid records
  (i.e. too short, with the Most Significant Byte missing)
  every M items, attempt to decode from a shorter slice of the buffer.
  This will probably be produce an invalid result. We do not
  need to write into that buffer - because it refurs to the same memory as
  the full size buffer.

  run with INVALID=1 to include N/M invalid decodes.

  results:
    with no invalid decodes, I get about 2428 decodes/ms
    with invalid decodes:
      old code that overruns buffer: 1122 decodes/ms
      check length & return undefined: 2439 decodecs/ms
      check length & return NaN: 2434 d/ms
      check length & return -1: 2400 d/ms

  conclusion, it doesn't make a significant difference whether
  what is returned to show an invalid read,
  but if you overrun the buffer the cost is considerable.

  recomendation: return undefined
*/

var buffer = new Buffer.alloc(8)
var _buffer = buffer.slice(0, 4)
var varint = require('./')
var l = N
var invalid = 0

includeInvalid = !!process.env.INVALID

var start
var decoded
var totalEncodeMs = 0
var totalDecodeMs = 0
while (l--) {
  var int = Math.floor(Math.random()*0x01fffffffffffff)
  start = Date.now()
  varint.encode(int, buffer, 0)
  totalEncodeMs += Date.now() - start
  //console.log(int, varint.decode(buffer, 0))
  //every 1000 varints, do one that will be too short,
  //measure
  if (includeInvalid && !(l%M)) {
    start = Date.now()
    decoded = varint.decode(_buffer, 0)
    totalDecodeMs += Date.now() - start
    if (decoded === undefined)
      invalid ++
  } else {
    start = Date.now()
    decoded = varint.decode(buffer, 0)
    totalDecodeMs += Date.now() - start
    if(decoded !== int)
      throw new Error('decode was incorrect')
  }
}
console.log('encode/ms')
console.log(N/totalEncodeMs)
console.log()
console.log('decode/ms, invalidDecodes')
console.log(N/totalDecodeMs + ',', invalid)
