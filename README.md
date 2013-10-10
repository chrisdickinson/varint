# varint

encode whole numbers to an array of [protobuf-style varint bytes](https://developers.google.com/protocol-buffers/docs/encoding#varints) and also decode them.

```javascript
var varint = require('varint')

var bytes = varint.encode(300) // === [0xAC, 0x02]
varint.decode(bytes) // 300
varint.decode.bytesRead // 2 (the last decode() call required 2 bytes)
```

## api

### varint = require('varint')

### varint.encode(num[, output=[], offset=0]) -> array

encodes `num` into either the array given by `offset` or a new array at `offset`
and returns that array filled with integers.

### varint.decode(data[, offset=0]) -> number

decodes `data`, which can be either a buffer or array of integers, from position `offset` or default 0 and returns the decoded original integer.

### varint.decode.bytesRead

if you also require the length (number of bytes) that were required to decode the integer you can access it via `varint.decode.bytesRead`. this is an integer property that will tell you the number of bytes that the last .decode() call had to use to decode.

## usage notes

if you are using this to decode buffers from a streaming source it's up to you to make sure that you send 'complete' buffers into `varint.decode`. the maximum number of bytes that varint will need to decode is 8, so all you have to do is make sure you are sending buffers that are at least 8 bytes long from the point at which you know a varint range begins.

for example, if you are reading buffers from a `fs.createReadStream`,
imagine the first buffer contains one full varint range and half of a second one, and the second buffer contains the second half of the second varint range. in order to be safe across the buffer boundaries you'd just have to make sure the buffer you give to `varint.decode` contains the full varint range (8 bytes), otherwise you'll get an error.

# License

MIT
