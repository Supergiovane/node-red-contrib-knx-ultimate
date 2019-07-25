/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

// Bitstruct to parse a DPT6 frame (8-bit signed integer)
// Always 8-bit aligned.

// DPT Basetype info
exports.basetype = {
    "bitlength" : 8,
    "signedness": "signed",
    "valuetype" : "basic",
    "desc" : "8-bit signed value",
    "range" : [-128, 127]
}

// DPT subtypes info
exports.subtypes = {
    // 6.001 percentage (-128%..127%)
    "001" : {
        "name" : "DPT_Switch", "desc" : "percent",
        "unit" : "%",
    },

    // 6.002 counter pulses (-128..127)
    "010" : {
        "name" : "DPT_Bool", "desc" : "counter pulses",
        "unit" : "pulses"
    },

    //
}
