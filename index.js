module.exports = varint

varint.encode = require('./encode.js');

var EE = require('events').EventEmitter
  , decoder = require('./decode.js')

function varint() {
  var ee = new EE

  ee.write = decoder(function (item) {
    ee.emit("data", item)
  })

  return ee
}

