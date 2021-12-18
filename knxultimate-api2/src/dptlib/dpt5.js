/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020 Supergiovane
*/





//
// DPT5: 8-bit unsigned value
//
// DPT5 is the only (AFAIK) DPT with scalar datatypes (5.001 and 5.003)
exports.basetype = {
    "bitlength" : 8,
    "signedness": "unsigned",
    "range" : [0, 255],
    "valuetype" : "basic",
    "desc" : "8-bit unsigned value",
    "help": 
`// Set a percentage. Based on subtype, you can send a range 0-100 or 0-255
// Set blinds to half position
msg.payload = 50;
return msg;`,
  "helplink":"https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming"
}

exports.subtypes = {
    // 5.001 percentage (0=0..ff=100%)
    "001" : {
        "name" : "Percentage (0..100%)", "desc" : "percent",
        "unit" : "%", "scalar_range" : [0, 100]
    },

    // 5.003 angle (degrees 0=0, ff=360)
    "003" : {
        "name" : "Angle, Degrees (0..360)", "desc" : "angle degrees",
        "unit" : "°", "scalar_range" : [0, 360]
    },

    // 5.004 percentage (0..255%)
    "004" : {
        "name" : "Percentage (0..255%)", "desc" : "percent",
        "unit" : "%",
    },

    // 5.005 ratio (0..255)
    "005" : {
        "name" : "Ratio (0..255)", "desc" : "ratio",
        "unit" : "ratio",
    },

    // 5.006 tariff (0..255)
    "006" : {
        "name" : "Tariff (0..255)", "desc" : "tariff",
        "unit" : "tariff",
    },

    // 5.010 counter pulses (0..255)
    "010" : {
        "name" : "Pulses (0..255)", "desc" : "counter pulses",
        "unit" : "pulses",
    },

     // 5.100 Fan Stage (0..255)
     "100" : {
        "name" : "Fan stage (0..255)", "desc" : "Fan Stage",
        "unit" : "",
    }
}
