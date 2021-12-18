/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT238: 1-byte unsigned value
//
// DPT5 is the only (AFAIK) DPT with scalar datatypes (5.001 and 5.003)
exports.formatAPDU = function(value) {
    var apdu_data = new Buffer.alloc(1);
    apdu_data[0] = value;
    knxLog.get().trace('dpt238.js : input value = ' + value + '   apdu_data = ' + apdu_data);
    return apdu_data;
}

exports.fromBuffer = function(buf) {
    if (buf.length != 1) {
        knxLog.get().error("DPT238: Buffer should be 1 byte long, got", buf.length);
        return null;
    }
	ret = buf[0];
    return ret;
}


exports.basetype = {
    "bitlength" : 8,
    "range" : [ , ],
    "valuetype" : "basic",
    "desc" : "1-byte"
}

exports.subtypes = {
    // 20.102 HVAC mode
    "102" : {
        "name" : "HVAC_Mode", "desc" : "",
        "unit" : "", "scalar_range" : [ , ],
        "range" : [ , ]
    },

    // 5.003 angle (degrees 0=0, ff=360)
    "003" : {
        "desc" : "Angle", "name" : "Angle degrees",
        "unit" : "°", "scalar_range" : [0, 360]
    },

    // 5.004 percentage (0..255%)
    "004" : {
        "desc" : "Percent_U8", "name" : "Percent",
        "unit" : "%",
    },

    // 5.005 ratio (0..255)
    "005" : {
        "desc" : "DecimalFactor", "name" : "Ratio",
        "unit" : "ratio",
    },

    // 5.006 tariff (0..255)
    "006" : {
        "desc" : "Tariff", "name" : "Tariff",
        "unit" : "tariff",
    },

    // 5.010 counter pulses (0..255)
    "010" : {
        "desc" : "Value_1_Ucount", "name" : "Counter pulses",
        "unit" : "pulses",
    },
}
