/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
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
  "desc" : "16-bit signed value"
}

// DPT8 subtypes info
exports.subtypes = {
  // 8.001 pulses difference
  "001" : {
      "name" : "DPT_Value_2_Count",
      "desc" : "pulses",
      "unit" : "pulses"
  },

  // 8.002 time lag (ms)
  "002" : {
      "name" : "DPT_DeltaTimeMsec",
      "desc" : "time lag(ms)",
      "unit" : "milliseconds"
  },

  // 8.003 time lag (10ms)
  "003" : {
      "name" : "DPT_DeltaTime10Msec",
      "desc" : "time lag(10ms)",
      "unit" : "centiseconds"
  },

  // 8.004 time lag (100ms)
  "004" : {
      "name" : "DPT_DeltaTime100Msec",
      "desc" : "time lag(100ms)",
      "unit" : "deciseconds"
  },

  // 8.005 time lag (sec)
  "005" : {
      "name" : "DPT_DeltaTimeSec",
      "desc" : "time lag(s)",
      "unit" : "seconds"
  },

  // 8.006 time lag (min)
  "006" : {
      "name" : "DPT_DeltaTimeMin",
      "desc" : "time lag(min)",
      "unit" : "minutes"
  },

  // 8.007 time lag (hour)
  "007" : {
      "name" : "DPT_DeltaTimeHrs",
      "desc" : "time lag(hrs)",
      "unit" : "hours"
  },

  // 8.010 percentage difference (%)
  "010" : {
      "name" : "DPT_Percent_V16",
      "desc" : "percentage difference",
      "unit" : "%"
  },

  // 8.011 rotation angle (deg)
  "011" : {
      "name" : "DPT_RotationAngle",
      "desc" : "angle(degrees)",
      "unit" : "°"
  },
}
