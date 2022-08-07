/**

* (C) 2020 Supergiovane
*/

const knxLog = require('./../KnxLog');

// Structure of DPT 251.600
// Byte 0: R value
// Byte 1: G value
// Byte 2: B value
// Byte 3: W value
// Byte 4: 0x00 (reserved)
// Byte 5:
// Bit 0: W value valid?
// Bit 1: B value valid?
// Bit 2: G value valid?
// Bit 3: R value valid?
// Bit 4-7: 0
// The bitfield which defines whether an value(R, G, B, W) is valid or not should be in the last byte of the array and not at the beginning.This can be verified by trying to send a DPT 251.600 telegram in the BUS monitor of the ETS5 application.
    
exports.formatAPDU = function (value) {
    if (!value) {
        knxLog.get().error("DPT251: cannot write null value");
    } else {
        if (typeof value == 'object' &&
            value.hasOwnProperty('white') && value.white >= 0 && value.white <= 255 &&
            value.hasOwnProperty('red') && value.red >= 0 && value.red <= 255 &&
            value.hasOwnProperty('green') && value.green >= 0 && value.green <= 255 &&
            value.hasOwnProperty('blue') && value.blue >= 0 && value.blue <= 255 && 
            value.hasOwnProperty('mR') && value.hasOwnProperty('mG') && value.hasOwnProperty('mB') && value.hasOwnProperty('mW') ) {
        } else {
            knxLog.get().error("DPT251: Must supply a value payload: {red:0-255, green:0-255, blue:0-255, white:0-255, mR:0-1, mG:0-1, mB:0-1, mW:0-1}");
        }
        var bitVal= parseInt("0000" + value.mR + value.mG + value.mB + value.mW, 2) ;

        return Buffer.from([
            Math.floor(value.red),
            Math.floor(value.green),
            Math.floor(value.blue),
            Math.floor(value.white),
            Math.floor(0),
            Math.floor(bitVal)]);
    }
}

exports.fromBuffer = function (buf) {
    if (buf.length != 6) {
        knxLog.get().error("DPT251: Buffer should be 6 bytes long, got", buf.length);
        return null;
    }
    var valByte = (buf[5]).toString(2); // Get validity bits
    ret = { red: buf[0], green: buf[1], blue: buf[2], white: buf[3], mR: parseInt(valByte[0])|| 0, mG: parseInt(valByte[1])|| 0, mB: parseInt(valByte[2])|| 0, mW: parseInt(valByte[3])|| 0 }
    return ret;
}


exports.basetype = {
    "bitlength": 6 * 8,
    "valuetype": "basic",
    "desc": "RGBW array",
    "help": 
`// Each color + white in a range between 0 and 255, the latest 4 bits in range 0 to 1
// red:0-255, green:0-255, blue:0-255, white:0-255, mR:0-1, mG:0-1, mB:0-1, mW:0-1
msg.payload={red:90, green:200, blue:30, white:120, mR:1, mG:1, mB:1, mW:1};
return msg;`,
  "helplink":"https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White"
}

exports.subtypes = {
    "600": {
        "desc": "RGBW [payload:{red:255, green:200, blue:30, white:50, mR:1, mG:1, mB:1, mW:1}]", "name": "RGB color triplet + White + Validity",
        "unit": "", "scalar_range": [,],
        "range": [,]
    }
}
