/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

//
// DPT12.*:  4-byte unsigned value
//


// DPT12 base type info
exports.basetype = {
  bitlength : 32,
  signedness: "unsigned",
  valuetype : "basic",
  desc : "4-byte unsigned value"
}

// DPT12 subtype info
exports.subtypes = {
  // 12.001 counter pulses
  "001" : {
    "name" : "DPT_Value_4_Ucount", "desc" : "counter pulses"
  }
}
