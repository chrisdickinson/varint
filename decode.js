module.exports = decoder

var MSB = 0x80
  , REST = 0x7F


function decoder(emit) {
  var accum = []
  return function (byte) {
    var msb = byte & MSB
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
    emit(out)
    return
    
  }
}