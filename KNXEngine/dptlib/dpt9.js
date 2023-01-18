/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog')

//
// DPT9.*: 2-byte floating point value
//

const util = require('util')
// kudos to http://croquetweak.blogspot.gr/2014/08/deconstructing-floats-frexp-and-ldexp.html
// function ldexp(mantissa, exponent) {
//   return exponent > 1023 // avoid multiplying by infinity
//     ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
//     : exponent < -1074 // avoid multiplying by zero
//       ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
//       : mantissa * Math.pow(2, exponent)
// }

// function frexp(value) {
//   if (value === 0) return [value, 0]
//   const data = new DataView(new ArrayBuffer(8))
//   data.setFloat64(0, value)
//   let bits = (data.getUint32(0) >>> 20) & 0x7FF
//   if (bits === 0) {
//     data.setFloat64(0, value * Math.pow(2, 64))
//     bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64
//   }
//   const exponent = bits - 1022
//   const mantissa = ldexp(value, -exponent)
//   return [mantissa, exponent]
// }

function ldexp(mantissa, exponent) {
  return exponent > 1023
      ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
      : exponent < -1074
          ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
          : mantissa * Math.pow(2, exponent);
}
function frexp(value) {
  if (value === 0) {
      return [value, 0];
  }
  const data = new DataView(new ArrayBuffer(8));
  data.setFloat64(0, value);
  let bits = (data.getUint32(0) >>> 20) & 0x7FF;
  if (bits === 0) {
      data.setFloat64(0, value * Math.pow(2, 64));
      bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
  }
  const exponent = bits - 1022, mantissa = ldexp(value, -exponent);
  return [mantissa, exponent];
}

exports.formatAPDU = function (value) {
  const apdu_data = Buffer.alloc(2)
  const buf = Buffer.alloc(2);
  let [mant, exp] = frexp(value);
  const sign = mant < 0 ? 1 : 0;
  let max_mantissa = 0;
  let e;
  for (e = exp; e >= -15; e--) {
    max_mantissa = ldexp(100 * mant, e);
    if (max_mantissa > -2048 && max_mantissa < 2047) {
      break;
    }
  }
  mant = (mant < 0) ? ~(max_mantissa ^ 2047) : max_mantissa;
  exp = exp - e;
  buf.writeUInt8((sign << 7) + (exp << 3) + (mant >> 8), 0);
  buf.writeUInt8(mant % 256, 1);
  return buf;
  // if (!isFinite(value)) {
  //   knxLog.get().warn('DPT9: cannot write non-numeric or undefined value')
  // } else {
  //   const arr = frexp(value)
  //   const mantissa = arr[0]; const exponent = arr[1]
  //   // find the minimum exponent that will upsize the normalized mantissa (0,5 to 1 range)
  //   // in order to fit in 11 bits ([-2048, 2047])
  //   max_mantissa = 0
  //   for (e = exponent; e >= -15; e--) {
  //     max_mantissa = ldexp(100 * mantissa, e)
  //     if (max_mantissa > -2048 && max_mantissa < 2047) break
  //   }
  //   const sign = (mantissa < 0) ? 1 : 0
  //   const mant = (mantissa < 0) ? ~(max_mantissa ^ 2047) : max_mantissa
  //   const exp = exponent - e
  //   // yucks
  //   apdu_data[0] = (sign << 7) + (exp << 3) + (mant >> 8)
  //   apdu_data[1] = mant % 256
  // }
  // return apdu_data
}

exports.fromBuffer = function (buffer) {
  if (buffer.length !== 2) {
    knxLog.get().warn('DPT9: cannot write non-numeric or undefined value')
  }
  const val = buffer.readUInt8(0);
  const sign = val >> 7;
  const exp = (val & 0b01111000) >> 3;
  const mant = ((val & 0x07) << 8) + buffer.readUInt8(1);
  const signedMant = sign === 1 ? ~(mant ^ 2047) : mant;
  return ldexp((0.01 * signedMant), exp);
  // if (buf.length != 2) {
  //   knxLog.get().warn('DPT9.fromBuffer: buf should be 2 bytes long (got %d bytes)', buf.length)
  //   return null
  // } else {
  //   const sign = buf[0] >> 7
  //   const exponent = (buf[0] & 0b01111000) >> 3
  //   let mantissa = 256 * (buf[0] & 0b00000111) + buf[1]
  //   mantissa = (sign == 1) ? ~(mantissa ^ 2047) : mantissa
  //   return parseFloat(ldexp((0.01 * mantissa), exponent).toPrecision(15))
  // }
}

// DPT9 basetype info
exports.basetype = {
  bitlength: 16,
  valuetype: 'basic',
  desc: '16-bit floating point value',
  help:
    `// Send 16-bit floating point value.
  msg.payload = 25;
  return msg;`
}

// DPT9 subtypes
exports.subtypes = {
  // 9.001 temperature (oC)
  '001': {
    name: 'Temperature (°C)',
    desc: 'temperature',
    unit: '°C',
    range: [-273, 670760]
  },

  // 9.002 temperature difference (oC)
  '002': {
    name: 'Temperature difference (°C)',
    desc: 'temperature difference',
    unit: '°C',
    range: [-670760, 670760]
  },

  // 9.003 kelvin/hour (K/h)
  '003': {
    name: 'Kelvin/hour (K/h)',
    desc: 'kelvin/hour',
    unit: '°K/h',
    range: [-670760, 670760]
  },

  // 9.004 lux (Lux)
  '004': {
    name: 'Lux (lux)',
    desc: 'lux',
    unit: 'lux',
    range: [0, 670760]
  },

  // 9.005 speed (m/s)
  '005': {
    name: 'Speed (m/s)',
    desc: 'wind speed',
    unit: 'm/s',
    range: [0, 670760]
  },

  // 9.006 pressure (Pa)
  '006': {
    name: 'Pressure (Pa)',
    desc: 'pressure',
    unit: 'Pa',
    range: [0, 670760]
  },

  // 9.007 humidity (%)
  '007': {
    name: 'Humidity (%)',
    desc: 'humidity',
    unit: '%',
    range: [0, 670760]
  },

  // 9.008 parts/million (ppm)
  '008': {
    name: 'Parts/million (ppm)',
    desc: 'air quality',
    unit: 'ppm',
    range: [0, 670760]
  },

  // 9.009 Airflow (ppm)
  '009': {
    name: 'Airflow (m3/h)',
    desc: 'Airflow',
    unit: 'm3/h',
    range: [-671088.64, 670433.28]
  },

  // 9.010 time (s)
  '010': {
    name: 'Time (s)',
    desc: 'time(sec)',
    unit: 's',
    range: [-670760, 670760]
  },

  // 9.011 time (ms)
  '011': {
    name: 'Time (ms)',
    desc: 'time(msec)',
    unit: 'ms',
    range: [-670760, 670760]
  },

  // 9.020 voltage (mV)
  '020': {
    name: 'Voltage (mV)',
    desc: 'voltage',
    unit: 'mV',
    range: [-670760, 670760]
  },

  // 9.021 current (mA)
  '021': {
    name: 'Current (mA)',
    desc: 'current',
    unit: 'mA',
    range: [-670760, 670760]
  },

  // 9.022 power density (W/m2)
  '022': {
    name: 'Power density (W/m²)',
    desc: 'power density',
    unit: 'W/m²',
    range: [-670760, 670760]
  },

  // 9.023 kelvin/percent (K/%)
  '023': {
    name: 'Kelvin/percent (K/%)',
    desc: 'Kelvin / %',
    unit: 'K/%',
    range: [-670760, 670760]
  },

  // 9.024 power (kW)
  '024': {
    name: 'Power (kW)',
    desc: 'power (kW)',
    unit: 'kW',
    range: [-670760, 670760]
  },

  // 9.025 volume flow (l/h)
  '025': {
    name: 'Volume flow (l/h)',
    desc: 'volume flow',
    unit: 'l/h',
    range: [-670760, 670760]
  },

  // 9.026 rain amount (l/m2)
  '026': {
    name: 'Rain amount (l/m²)',
    desc: 'rain amount',
    unit: 'l/m²',
    range: [-670760, 670760]
  },

  // 9.027 temperature (Fahrenheit)
  '027': {
    name: 'Temperature (Fahrenheit)',
    desc: 'temperature (F)',
    unit: '°F',
    range: -[459.6, 670760]
  },

  // 9.028 wind speed (km/h)
  '028': {
    name: 'Wind speed (km/h)',
    desc: 'wind speed (km/h)',
    unit: 'km/h',
    range: [0, 670760]
  },

  // 9.029 wind speed (km/h)
  '029': {
    name: 'Absolute humidity (g/m3)',
    desc: 'absolute humidity (g/m3)',
    unit: 'g/m3',
    range: [0, 670760]
  },

  // 9.030 concentration (ug/m3)
  '030': {
    name: 'Concentration (ug/m3)',
    desc: 'concentration (ug/m3)',
    unit: 'ug/m3',
    range: [0, 670760]
  }
}
