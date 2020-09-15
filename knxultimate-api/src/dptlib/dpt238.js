/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT238: 1-byte unsigned value
//
// DPT5 is the only (AFAIK) DPT with scalar datatypes (5.001 and 5.003)
exports.formatAPDU = function(value) {
    var apdu_data = new Buffer(1);
    apdu_data[0] = value;
    knxLog.get().trace('dpt238.js : input value = ' + value + '   apdu_data = ' + apdu_data);
    return apdu_data;
}

exports.fromBuffer = function(buf) {
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
        "name" : "DPT_Angle", "desc" : "angle degrees",
        "unit" : "°", "scalar_range" : [0, 360]
    },

    // 5.004 percentage (0..255%)
    "004" : {
        "name" : "DPT_Percent_U8", "desc" : "percent",
        "unit" : "%",
    },

    // 5.005 ratio (0..255)
    "005" : {
        "name" : "DPT_DecimalFactor", "desc" : "ratio",
        "unit" : "ratio",
    },

    // 5.006 tariff (0..255)
    "006" : {
        "name" : "DPT_Tariff", "desc" : "tariff",
        "unit" : "tariff",
    },

    // 5.010 counter pulses (0..255)
    "010" : {
        "name" : "DPT_Value_1_Ucount", "desc" : "counter pulses",
        "unit" : "pulses",
    },
}
