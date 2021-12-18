/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

//
// DPT8.*: 2-byte signed value
//

// DPT8 basetype info
exports.basetype = {
  "bitlength" : 16,
  "signedness": "signed",
  "valuetype" : "basic",
  "range" : [-32768, 32767],
  "desc" : "16-bit signed value",
  "help": 
`// Send 16 bit value [-32768, 32767].
msg.payload = 1200;
return msg;`
}

// DPT8 subtypes info
exports.subtypes = {
  // 8.001 pulses difference
  "001" : {
      "name" : "Pulses difference",
      "desc" : "pulses",
      "unit" : "pulses"
  },

  // 8.002 time lag (ms)
  "002" : {
      "name" : "Time lag (ms)",
      "desc" : "time lag(ms)",
      "unit" : "milliseconds"
  },

  // 8.003 time lag (10ms)
  "003" : {
      "name" : "Time lag (10ms)",
      "desc" : "time lag(10ms)",
      "unit" : "centiseconds"
  },

  // 8.004 time lag (100ms)
  "004" : {
      "name" : "Time lag(100ms)",
      "desc" : "time lag(100ms)",
      "unit" : "deciseconds"
  },

  // 8.005 time lag (sec)
  "005" : {
      "name" : "Time lag(s)",
      "desc" : "time lag(s)",
      "unit" : "seconds"
  },

  // 8.006 time lag (min)
  "006" : {
      "name" : "Time lag(min)",
      "desc" : "time lag(min)",
      "unit" : "minutes"
  },

  // 8.007 time lag (hour)
  "007" : {
      "name" : "Time lag(hrs)",
      "desc" : "time lag(hrs)",
      "unit" : "hours"
  },

  // 8.010 percentage difference (%)
  "010" : {
      "name" : "Percentage difference (%)",
      "desc" : "percentage difference",
      "unit" : "%"
  },

  // 8.011 rotation angle (deg)
  "011" : {
      "name" : "Rotation angle (°)",
      "desc" : "angle (degrees)",
      "unit" : "°"
    },
  
  // 8.012 length (m)
  "012" : {
      "name" : "Length (m)",
      "desc" : "length (m)",
      "unit" : "m"
  },
}
