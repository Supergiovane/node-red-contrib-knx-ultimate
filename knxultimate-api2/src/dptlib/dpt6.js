/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

// Bitstruct to parse a DPT6 frame (8-bit signed integer)
// Always 8-bit aligned.

// DPT Basetype info
exports.basetype = {
    "bitlength" : 8,
    "signedness": "signed",
    "valuetype" : "basic",
    "desc" : "8-bit signed value",
    "range" : [-128, 127],
    "help": 
`// Send value -128 to 127
msg.payload = -24;
return msg;`
}

// DPT subtypes info
exports.subtypes = {
    // 6.001 percentage (-128%..127%)
    "001" : {
        "name" : "Percent (-128..127%)", "desc" : "percent",
        "unit" : "%",
    },

    // 6.002 counter pulses (-128..127)
    "010" : {
        "name" : "Counter pulses (-128..127%)", "desc" : "counter pulses",
        "unit" : "pulses"
    },
    // 6.02 Status with mode
    "020" : {
        "name" : "Status with mode (-128..127%)", "desc" : "status with mode",
        "unit" : "status"
    },

    //
}
