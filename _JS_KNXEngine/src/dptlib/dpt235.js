/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT235: DPT_Tariff_ActiveEnergy
//

const util = require('util')

function hex2bin (hex) {
  return (parseInt(hex, 16).toString(2)).padStart(8, '0')
}

function ldexp (mantissa, exponent) {
  return exponent > 1023 // avoid multiplying by infinity
    ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
    : exponent < -1074 // avoid multiplying by zero
      ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
      : mantissa * Math.pow(2, exponent)
}

function frexp (value) {
  try {
    if (value === 0) return [value, 0]
    const data = new DataView(new ArrayBuffer(8))
    data.setFloat64(0, value)
    let bits = (data.getUint32(0) >>> 20) & 0x7FF
    if (bits === 0) {
      data.setFloat64(0, value * Math.pow(2, 64))
      bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64
    }
    const exponent = bits - 1022; const mantissa = ldexp(value, -exponent)
    return [mantissa, exponent]
  } catch (error) {

  }
}

function GetHex (_value) {
  try {
    const arr = frexp(_value)
    const mantissa = arr[0]; const exponent = arr[1]
    // find the minimum exponent that will upsize the normalized mantissa (0,5 to 1 range)
    // in order to fit in 11 bits ([-2048, 2047])
    let max_mantissa = 0
    for (e = exponent; e >= -15; e--) {
      max_mantissa = ldexp(100 * mantissa, e)
      if (max_mantissa > -2048 && max_mantissa < 2047) break
    }
    const sign = (mantissa < 0) ? 1 : 0
    const mant = (mantissa < 0) ? ~(max_mantissa ^ 2047) : max_mantissa
    const exp = exponent - e
    return [((sign << 7) + (exp << 3) + (mant >> 8)), (mant % 256)]
  } catch (error) {

  }
}

// 08/09/2020 Supergiovane
// Send to BUS
exports.formatAPDU = function (value) {
  try {
    const apdu_data = Buffer.alloc(6) // 3 x 2 bytes

    if (typeof value === 'object' &&
      value.hasOwnProperty('activeElectricalEnergy') &&
      value.hasOwnProperty('tariff') &&
      value.hasOwnProperty('validityTariff') &&
      value.hasOwnProperty('validityEnergy')) {
      // activeElectricalEnergy
      const nbuff = Buffer.alloc(4)
      nbuff.writeInt32BE(value.activeElectricalEnergy)
      apdu_data[0] = nbuff[0]
      apdu_data[1] = nbuff[1]
      apdu_data[2] = nbuff[2]
      apdu_data[3] = nbuff[3]

      // tariff
      const tariff = parseInt(value.tariff)
      apdu_data[4] = tariff

      // Validity
      const validity = parseInt('000000' + (value.validityTariff ? '1' : '0') + (value.validityEnergy ? '1' : '0'), 2)
      apdu_data[5] = validity
      return apdu_data
    } else {
      knxLog.get().error('DPT235: Must supply a payload like, for example: {activeElectricalEnergy:1540, tariff:20, validityTariff:true, validityEnergy:true}')
    }
  } catch (error) {
    knxLog.get().error('DPT235: exports.formatAPDU error ' + error.message)
  }
}

// RX from BUS
exports.fromBuffer = function (buf) {
  try {
    // Preparo per l'avvento di Gozer il gozeriano.
    const activeElectricalEnergy = buf.slice(0, 4).readInt32BE() // First 4x8 bits signed integer
    const tariff = parseInt(buf.slice(4, 5)[0]) // next 8 bit unsigned value
    const validity = hex2bin(buf.slice(5, 6)[0].toString(16)) // Next 8 bit, only the latest 2 bits are used.
    const validityTariff = validity.substring(6, 7) === '1'
    const validityEnergy = validity.substring(7, 8) === '1'
    return { activeElectricalEnergy, tariff, validityTariff, validityEnergy }
  } catch (error) {
    knxLog.get().error('DPT235: exports.fromBuffer error ' + error.message)
  }
}

// DPT basetype info
exports.basetype = {
  bitlength: 48,
  valuetype: 'basic',
  desc: '6 octect Tariff_ActiveEnergy',
  help:
    `// Set the ActiveElectricalEnergy, Tariff and Validity of Tariff and Validity of Energy
msg.payload = {
  activeElectricalEnergy:1540, 
  tariff:20,
  validityTariff:true,
  validityEnergy:true 
  };
return msg;`,
  helplink: ''
}

// DPT subtypes
exports.subtypes = {
  '001': {
    desc: 'DPT_Tariff_ActiveEnergy',
    name: 'Tariff of active Energy (Energy+Tariff+Validity)',
    unit: 'Tariff'
  }
}
