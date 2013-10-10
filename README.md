# varint

encode whole numbers to an array of [protobuf-style varint bytes](https://developers.google.com/protocol-buffers/docs/encoding#varints) and also decode them.

```javascript
var varint = require('varint')

var bytes = varint.encode(300) // === [0xAC, 0x02]
varint.decode(bytes) // [300, 2]
```

## api

### varint = require('varint')

### varint.encode(num[, output=[], offset=0]) -> array

encodes `num` into either the array given by `offset` or a new array at `offset`
and returns that array filled with integers.

### varint.decode(data[, offset=0]) -> [number, length]

decodes `data`, which can be either a buffer or array of integers, from position `offset` or default 0 and returns an array containing `[number, length]` where number is the original integer and length is the amount of bytes that were consumed in order to decode the number

# License

MIT
