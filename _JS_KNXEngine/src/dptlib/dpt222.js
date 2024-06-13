/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT222: Data Type 3x 16-Float Value
//

const util = require('util')

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
function GetFloat (_value0, _value1) {
  const sign = _value0 >> 7
  const exponent = (_value0 & 0b01111000) >> 3
  let mantissa = 256 * (_value0 & 0b00000111) + _value1
  mantissa = (sign == 1) ? ~(mantissa ^ 2047) : mantissa
  return parseFloat(ldexp((0.01 * mantissa), exponent).toPrecision(15))
  // var buf = new Buffer(2);
  // buf[0] = _value0;
  // buf[1] = _value1;
  // let value = buf.readUInt16BE(0);
  // let sign = (value & 0x8000) >> 15;
  // let exp = (value & 0x7800) >> 11;
  // let mant = (value & 0x07ff);
  // if (sign !== 0) {
  //     mant = -(~(mant - 1) & 0x07ff);
  // }
  // return Math.round(0.01 * mant * Math.pow(2, exp) * 100) / 100;
}

// 08/09/2020 Supergiovane
// Send to BUS
exports.formatAPDU = function (value) {
  const apdu_data = Buffer.alloc(6) // 3 x 2 bytes

  if (typeof value === 'object' &&
        value.hasOwnProperty('Comfort') && value.Comfort >= -273 && value.Comfort <= 670760 &&
        value.hasOwnProperty('Standby') && value.Standby >= -273 && value.Standby <= 670760 &&
        value.hasOwnProperty('Economy') && value.Economy >= -273 && value.Economy <= 670760) {
    // Comfort
    const ArrComfort = GetHex(value.Comfort)
    apdu_data[0] = ArrComfort[0]
    apdu_data[1] = ArrComfort[1]

    // Standby
    const ArrStandby = GetHex(value.Standby)
    apdu_data[2] = ArrStandby[0]
    apdu_data[3] = ArrStandby[1]

    // Economy
    const ArrEconomy = GetHex(value.Economy)
    apdu_data[4] = ArrEconomy[0]
    apdu_data[5] = ArrEconomy[1]
    // console.log(apdu_data);
    return apdu_data
  } else {
    knxLog.get().error('DPT222: Must supply a payload like, for example: {Comfort:21, Standby:20, Economy:14}')
  }
}

// RX from BUS
exports.fromBuffer = function (buf) {
  if (buf.length != 6) {
    knxLog.get().warn('DPT222.fromBuffer: buf should be 3x2 bytes long (got %d bytes)', buf.length)
    return null
  } else {
    // Preparo per l'avvento di Gozer il gozeriano.
    const fComfort = GetFloat(buf[0], buf[1])
    const fStandby = GetFloat(buf[2], buf[3])
    const fEconomy = GetFloat(buf[4], buf[5])
    return { Comfort: fComfort, Standby: fStandby, Economy: fEconomy }
  }
}

// DPT222 basetype info
exports.basetype = {
  bitlength: 48,
  valuetype: 'basic',
  desc: '3x16-bit floating point value',
  help:
        `// Set the temperature setpoints or setpoint shift
msg.payload = {Comfort:21.4, Standby:20, Economy:18.2};
return msg;`,
  helplink: 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222'
}

// DPT222 subtypes
exports.subtypes = {
  // 222.100 RoomTemperature Setpoint Values
  100: {
    desc: 'DPT_TempRoomSetpSetF16[3]',
    name: 'Room temperature setpoint (Comfort, Standby and Economy)',
    unit: '°C',
    range: [-273, 670760]

  },

  // 222.101 RoomTemperature Setpoint Shift Values
  101: {
    desc: 'DPT_TempRoomSetpSetShiftF16[3]',
    name: 'Room temperature setpoint shift (Comfort, Standby and Economy)',
    unit: 'K',
    range: [-670760, 670760]
  }
}
