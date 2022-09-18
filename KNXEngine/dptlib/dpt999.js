/**
* KNXEngine - a KNX protocol stack in Javascript
* 08/04/2020 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT999: 10 Bytes (RFID keypad style)
//
function hexToDec (hex) {
  let result = 0; let digitValue
  hex = hex.toLowerCase()
  for (let i = 0; i < hex.length; i++) {
    digitValue = '0123456789abcdefgh'.indexOf(hex[i])
    result = result * 16 + digitValue
  }
  return result
}

exports.formatAPDU = function (value) {
  if (typeof value !== 'string' || value.length < 10) knxLog.get().warn("Must supply an HEX string value of 10 bytes. Please don't add '$' nor '0x' Example 12340000000000000000")
  else {
    value = value.toUpperCase().replace(/\$/g, '').replace(/0X/g, '').replace(/ /g, '') // Remove the $ and 0x
    const apdu_data = Buffer.alloc(10)
    let i = 0
    const iSlice = 2
    for (let index = 0; index < value.length; index += iSlice) {
      const sHex = value.substring(index, iSlice + index)
      const int = hexToDec(sHex)
      apdu_data[i] = int
      i++
    }
    return apdu_data
  }
}

exports.fromBuffer = function (buf) {
  return buf.toString('hex')
}

// basetype info
exports.basetype = {
  bitlength: 80,
  valuetype: 'basic',
  desc: '10-bytes',
  help:
`// Send a code to an alarm keypad
msg.payload = '123400000000000000'; // Or  msg.payload = '$12 $34 $00 $00 $00 $00 $00 $00 $00';
return msg;`,
  helplink: ''
}

// DPT999 subtypes
exports.subtypes = {
  // 10 Bytes string hex value
  '001': {
    use: 'G',
    desc: '10Bytes HEX',
    name: '10 Bytes'
  }
}
