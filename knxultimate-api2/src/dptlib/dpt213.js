/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT213: Data Type 4x 16-Signed Value
//

const util = require('util');

function ldexp(mantissa, exponent) {
    return exponent > 1023 // avoid multiplying by infinity
        ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
        : exponent < -1074 // avoid multiplying by zero
            ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
            : mantissa * Math.pow(2, exponent);
}

function frexp(value) {
    try {
        if (value === 0) return [value, 0];
        var data = new DataView(new ArrayBuffer(8));
        data.setFloat64(0, value);
        var bits = (data.getUint32(0) >>> 20) & 0x7FF;
        if (bits === 0) {
            data.setFloat64(0, value * Math.pow(2, 64));
            bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
        }
        var exponent = bits - 1022, mantissa = ldexp(value, -exponent);
        return [mantissa, exponent];
    } catch (error) {

    }

}

function GetHex(_value) {
    try {
        var arr = frexp(_value);
        var mantissa = arr[0], exponent = arr[1];
        // find the minimum exponent that will upsize the normalized mantissa (0,5 to 1 range)
        // in order to fit in 11 bits ([-2048, 2047])
        var max_mantissa = 0;
        for (e = exponent; e >= -15; e--) {
            max_mantissa = ldexp(100 * mantissa, e);
            if (max_mantissa > -2048 && max_mantissa < 2047) break;
        }
        var sign = (mantissa < 0) ? 1 : 0
        var mant = (mantissa < 0) ? ~(max_mantissa ^ 2047) : max_mantissa
        var exp = exponent - e;
        return [((sign << 7) + (exp << 3) + (mant >> 8)), (mant % 256)];
    } catch (error) {

    }

}
function GetFloat(_value0, _value1) {

    var sign = _value0 >> 7;
    var exponent = (_value0 & 0b01111000) >> 3;
    var mantissa = 256 * (_value0 & 0b00000111) + _value1;
    mantissa = (sign == 1) ? ~(mantissa ^ 2047) : mantissa;
    return parseFloat(ldexp((0.01 * mantissa), exponent).toPrecision(15));
}

// 07/01/2021 Supergiovane
// Send to BUS
exports.formatAPDU = function (value) {
    var apdu_data = new Buffer.alloc(8); // 4 x 2 bytes

    if (typeof value == 'object' &&
        value.hasOwnProperty('Comfort') && value.Comfort >= -272 && value.Comfort <= 655.34 &&
        value.hasOwnProperty('Standby') && value.Standby >= -272 && value.Standby <= 655.34 &&
        value.hasOwnProperty('Economy') && value.Economy >= -272 && value.Economy <= 655.34 &&
        value.hasOwnProperty('BuildingProtection') && value.BuildingProtection >= -272 && value.BuildingProtection <= 655.34) {

        // Comfort
        var ArrComfort = GetHex(value.Comfort);
        apdu_data[0] = ArrComfort[0];
        apdu_data[1] = ArrComfort[1];

        // Standby
        var ArrStandby = GetHex(value.Standby);
        apdu_data[2] = ArrStandby[0];
        apdu_data[3] = ArrStandby[1];

        // Economy
        var ArrEconomy = GetHex(value.Economy);
        apdu_data[4] = ArrEconomy[0];
        apdu_data[5] = ArrEconomy[1];

        // BuildingProtection
        var ArrBuildingProtection = GetHex(value.BuildingProtection);
        apdu_data[6] = ArrBuildingProtection[0];
        apdu_data[7] = ArrBuildingProtection[1];
        //console.log(apdu_data);
        return apdu_data;

    } else {
        knxLog.get().error("DPT213: Must supply a payload like, for example: {Comfort:21, Standby:20, Economy:14, BuildingProtection:8}");
    }
}

// RX from BUS
exports.fromBuffer = function (buf) {
    
    if (buf.length != 8) {
        knxLog.get().warn("DPT213.fromBuffer: buf should be 4x2 bytes long (got %d bytes)", buf.length);
        return null;
    } else {
        // Preparo per l'avvento di Gozer il gozeriano.
        var nComfort = GetFloat(buf[0] , buf[1]);
        var nStandby = GetFloat(buf[2] , buf[3]);
        var nEconomy = GetFloat(buf[4] , buf[5]);
        var nbProt = GetFloat(buf[6] , buf[7]);
        return { Comfort: nComfort, Standby: nStandby, Economy: nEconomy, BuildingProtection: nbProt };

    }
}

// DPT213 basetype info
exports.basetype = {
    "bitlength": 4 * 16,
    "valuetype": "basic",
    "desc": "4x 16-Bit Signed Value",
    "help":
        `// Sample of 213.100.
// Set the temperatures between -272°C and 655.34°C with 0,02°C of resolution.
// These 4 property names, are valid for 213.101, 213.102 etc... as well.
// For example, for 213.101, LegioProtect is the "Comfort" property, Normal is "Standby", etc...
msg.payload = {Comfort:21.4, Standby:20, Economy:18.2, BuildingProtection:-1};
return msg;`,
    "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213"
}

// DPT213 subtypes
exports.subtypes = {
    "100": {
        "desc": "DPT_TempRoomSetpSet[4]", "name": "Room temperature setpoint (Comfort, Standby, Economy, Building protection)",
        "unit": "°C",
        "range": [-272, 655.34]
    },
    "101": {
        "desc": "DPT_TempDHWSetpSet[4]", "name": "Room temperature setpoint DHW (LegioProtect, Normal, Reduced, Off/FrostProtect)",
        "unit": "°C",
        "range": [-272, 655.34]
    },
    "102": {
        "desc": "DPT_TempRoomSetpSetShift[4]", "name": "Room temperature setpoint shift (Comfort, Standby, Economy, Building protection)",
        "unit": "°C",
        "range": [-272, 655.34]
    }
}
