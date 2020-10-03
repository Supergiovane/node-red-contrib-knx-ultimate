/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT9.*: 2-byte floating point value
//

const util = require('util');
// kudos to http://croquetweak.blogspot.gr/2014/08/deconstructing-floats-frexp-and-ldexp.html
function ldexp(mantissa, exponent) {
    return exponent > 1023 // avoid multiplying by infinity
        ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
        : exponent < -1074 // avoid multiplying by zero
            ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
            : mantissa * Math.pow(2, exponent);
}

function frexp(value) {
    if (value === 0) return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = (data.getUint32(0) >>> 20) & 0x7FF;
    if (bits === 0) {
        data.setFloat64(0, value * Math.pow(2, 64));
        bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
    }
    var exponent = bits - 1022,
        mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
}

exports.formatAPDU = function (value) {
    var apdu_data = new Buffer(2);
    if (!isFinite(value)) {
        knxLog.get().warn("DPT9: cannot write non-numeric or undefined value");
    } else {
        var arr = frexp(value);
        var mantissa = arr[0], exponent = arr[1];
        // find the minimum exponent that will upsize the normalized mantissa (0,5 to 1 range)
        // in order to fit in 11 bits ([-2048, 2047])
        max_mantissa = 0;
        for (e = exponent; e >= -15; e--) {
            max_mantissa = ldexp(100 * mantissa, e);
            if (max_mantissa > -2048 && max_mantissa < 2047) break;
        }
        var sign = (mantissa < 0) ? 1 : 0
        var mant = (mantissa < 0) ? ~(max_mantissa ^ 2047) : max_mantissa
        var exp = exponent - e;
        // yucks
        apdu_data[0] = (sign << 7) + (exp << 3) + (mant >> 8);
        apdu_data[1] = mant % 256;
    }
    return apdu_data;
}

exports.fromBuffer = function (buf) {
    if (buf.length != 2) {
        knxLog.get().warn("DPT9.fromBuffer: buf should be 2 bytes long (got %d bytes)", buf.length);
    } else {
        var sign = buf[0] >> 7;
        var exponent = (buf[0] & 0b01111000) >> 3;
        var mantissa = 256 * (buf[0] & 0b00000111) + buf[1];
        mantissa = (sign == 1) ? ~(mantissa ^ 2047) : mantissa;
        return parseFloat(ldexp((0.01 * mantissa), exponent).toPrecision(15));
    }
}

// DPT9 basetype info
exports.basetype = {
    "bitlength": 16,
    "valuetype": "basic",
    "desc": "16-bit floating point value",
    "help": 
  `// Send 16-bit floating point value.
  msg.payload = 25;
  return msg;`
}

// DPT9 subtypes
exports.subtypes = {
    // 9.001 temperature (oC)
    "001": {
        "name": "Temperature (°C)", "desc": "temperature",
        "unit": "°C",
        "range": [-273, 670760]
    },

    // 9.002 temperature difference (oC)
    "002": {
        "name": "Temperature difference (°C)", "desc": "temperature difference",
        "unit": "°C", "range": [-670760, 670760]
    },

    // 9.003 kelvin/hour (K/h)
    "003": {
        "name": "Kelvin/hour (K/h)", "desc": "kelvin/hour",
        "unit": "°K/h", "range": [-670760, 670760]
    },

    // 9.004 lux (Lux)
    "004": {
        "name": "Lux (lux)", "desc": "lux",
        "unit": "lux", "range": [0, 670760]
    },

    // 9.005 speed (m/s)
    "005": {
        "name": "Speed (m/s)", "desc": "wind speed",
        "unit": "m/s", "range": [0, 670760]
    },

    // 9.006 pressure (Pa)
    "006": {
        "name": "Pressure (Pa)", "desc": "pressure",
        "unit": "Pa", "range": [0, 670760]
    },

    // 9.007 humidity (%)
    "007": {
        "name": "Humidity (%)", "desc": "humidity",
        "unit": "%", "range": [0, 670760]
    },

    // 9.008 parts/million (ppm)
    "008": {
        "name": "Parts/million (ppm)", "desc": "air quality",
        "unit": "ppm", "range": [0, 670760]
    },

    // 9.010 time (s)
    "010": {
        "name": "Time (s)", "desc": "time(sec)",
        "unit": "s", "range": [-670760, 670760]
    },

    // 9.011 time (ms)
    "011": {
        "name": "Time (ms)", "desc": "time(msec)",
        "unit": "ms", "range": [-670760, 670760]
    },

    // 9.020 voltage (mV)
    "020": {
        "name": "Voltage (mV)", "desc": "voltage",
        "unit": "mV", "range": [-670760, 670760]
    },

    // 9.021 current (mA)
    "021": {
        "name": "Current (mA)", "desc": "current",
        "unit": "mA", "range": [-670760, 670760]
    },

    // 9.022 power density (W/m2)
    "022": {
        "name": "Power density (W/m²)", "desc": "power density",
        "unit": "W/m²", "range": [-670760, 670760]
    },

    // 9.023 kelvin/percent (K/%)
    "023": {
        "name": "Kelvin/percent (K/%)", "desc": "Kelvin / %",
        "unit": "K/%", "range": [-670760, 670760]
    },

    // 9.024 power (kW)
    "024": {
        "name": "Power (kW)", "desc": "power (kW)",
        "unit": "kW", "range": [-670760, 670760]
    },

    // 9.025 volume flow (l/h)
    "025": {
        "name": "Volume flow (l/h)", "desc": "volume flow",
        "unit": "l/h", "range": [-670760, 670760]
    },

    // 9.026 rain amount (l/m2)
    "026": {
        "name": "Rain amount (l/m²)", "desc": "rain amount",
        "unit": "l/m²", "range": [-670760, 670760]
    },

    // 9.027 temperature (Fahrenheit)
    "027": {
        "name": "Temperature (Fahrenheit)", "desc": "temperature (F)",
        "unit": "°F", "range": -[459.6, 670760]
    },

    // 9.028 wind speed (km/h)
    "028": {
        "name": "Wind speed (km/h)", "desc": "wind speed (km/h)",
        "unit": "km/h", "range": [0, 670760]
    },

    // 9.029 wind speed (km/h)
    "029": {
        "name": "Absolute humidity (g/m3)", "desc": "absolute humidity (g/m3)",
        "unit": "g/m3", "range": [0, 670760]
    },

    // 9.030 concentration (ug/m3)
    "030": {
        "name": "Concentration (ug/m3)", "desc": "concentration (ug/m3)",
        "unit": "ug/m3", "range": [0, 670760]
    }
}
