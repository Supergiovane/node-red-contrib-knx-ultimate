/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* 08/04/2020 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT999: 10 Bytes (RFID keypad style)
//
function hexToDec(hex) {
  var result = 0, digitValue;
  hex = hex.toLowerCase();
  for (var i = 0; i < hex.length; i++) {
    digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
    result = result * 16 + digitValue;
  }
  return result;
}

exports.formatAPDU = function (value) {
  if (typeof value != 'string' || value.length < 10) knxLog.get().warn("Must supply an HEX string value of 10 bytes. Please don't add '$' nor '0x' Example 12340000000000000000")
  else {
    value = value.toUpperCase().replace(/\$/g, "").replace(/0X/g, "").replace(/ /g, ""); // Remove the $ and 0x
    var apdu_data = new Buffer.alloc(10);
    var i = 0;
    var iSlice = 2;
    for (let index = 0; index < value.length; index += iSlice) {
      var sHex = value.substring(index, iSlice + index);
      var int = hexToDec(sHex);
      apdu_data[i] = int;
      i++;
    }
    return apdu_data;
  }
}

exports.fromBuffer = function (buf) {
  return buf.toString('hex');
}

// basetype info
exports.basetype = {
  bitlength: 80,
  valuetype: 'basic',
  desc: "10-bytes",
  "help": 
`// Send a code to an alarm keypad
msg.payload = '123400000000000000'; // Or  msg.payload = '$12 $34 $00 $00 $00 $00 $00 $00 $00';
return msg;`,
"helplink":""
}

// DPT999 subtypes
exports.subtypes = {
  // 10 Bytes string hex value
  "001": {
    use: "G",
    "desc": "10Bytes HEX", "name": "10 Bytes"
  }
}
