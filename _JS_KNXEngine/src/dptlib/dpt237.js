/**
* knxultimate-api
* (C) 2016-2019 Supergiovane
*/

const knxLog = require('./../KnxLog')

function hex2bin (hex) {
  return (parseInt(hex, 16).toString(2)).padStart(8, '0')
}
function dec2bin (dec) {
  return (dec >>> 0).toString(2)
}

//
// DPT237: DPT_DALI_Control_Gear_Diagnostic
//
exports.formatAPDU = function (value) {
  if (!value) {
    knxLog.get().error('DPT237: cannot write null value')
  } else {
    let apdu_data
    if (typeof value === 'object' &&
            value.hasOwnProperty('convertorError') && value.hasOwnProperty('ballastFailure') && value.hasOwnProperty('lampFailure') &&
            value.hasOwnProperty('readResponse') &&
            value.hasOwnProperty('addressIndicator') &&
            value.hasOwnProperty('daliAddress') && value.daliAddress >= 0 && value.daliAddress <= 64) {
    } else {
      knxLog.get().error('DPT237: Must supply an valid payload. See the WIKI.')
    }

    // LSB
    const LSB = (value.readResponse === false ? '0' : '1') + (value.addressIndicator === false ? '0' : '1') + dec2bin(value.daliAddress).padStart(6, '0')

    // MSB
    const MSB = '00000' + (value.convertorError === false ? '0' : '1') + (value.ballastFailure === false ? '0' : '1') + (value.lampFailure === false ? '0' : '1')

    const bufferTotal = Buffer.alloc(2)
    bufferTotal[0] = parseInt(MSB, 2)
    bufferTotal[1] = parseInt(LSB, 2)
    return bufferTotal
  }
}

exports.fromBuffer = function (buf) {
  if (buf.length != 2) {
    knxLog.get().error('DPT237: Buffer should be 2 byte long, got', buf.length)
    return null
  }

  const bufTotale = buf.toString('hex')
  // console.log(bufTotale)
  const MSB = hex2bin(bufTotale.substring(0, 2)) // Get Binary
  const LSB = hex2bin(bufTotale.substring(2, 4))// Get Binary

  // LSB
  const readResponse = LSB.substring(0, 1) !== '0'
  const addressIndicator = LSB.substring(1, 2) !== '0'
  const daliAddress = parseInt('00' + LSB.substring(2, 8), 2)

  // MSB
  const lampFailure = MSB.substring(7, 8) !== '0'
  const ballastFailure = MSB.substring(6, 7) !== '0'
  const convertorError = MSB.substring(5, 6) !== '0'

  ret = { readResponse, addressIndicator, daliAddress, lampFailure, ballastFailure, convertorError }
  return ret
}

exports.basetype = {
  bitlength: 2 * 8,
  valuetype: 'basic',
  desc: 'PDT_GENERIC_02',
  help:
        `// DALI control gear diagnostic. Properties explanation:
// readResponse: true/false (FALSE means Response or spontaneus sending, TRUE means Read)
// addressIndicator: true/false (Indicates the type of DALI address. FALSE means Device Address, FALSE means Group Address)
// daliAddress: the DALI address
// lampFailure: true/false, ballastFailure: true/false , convertorError: true/false 
msg.payload={readResponse:false, addressIndicator:false, daliAddress:8, lampFailure:false, ballastFailure:false, convertorError:false};
return msg;`
}

exports.subtypes = {
  600: {
    desc: 'DPT_DALI_Control_Gear_Diagnostic',
    name: 'DALI control gear diagnostic',
    unit: '',
    scalar_range: [,],
    range: [,]
  }
}
