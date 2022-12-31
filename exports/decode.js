const MSB = 0x80;
const REST = 0x7F;
const decode = (buf, offset) => {
    offset = offset || 0;
    const l = buf.length;
    let counter = offset;
    let result = 0;
    let shift = 0;
    let b;
    do {
        if (counter >= l || shift > 49) {
            decode.bytes = 0;
            throw new RangeError('Could not decode varint');
        }
        b = buf[counter++];
        result += shift < 28
            ? (b & REST) << shift
            : (b & REST) * Math.pow(2, shift);
        shift += 7;
    } while (b >= MSB);
    decode.bytes = counter - offset;
    return result;
};

export { decode as default };
