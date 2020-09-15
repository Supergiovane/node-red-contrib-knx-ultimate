/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT14.*: 4-byte floating point value
//

/* In sharp contrast to DPT9 (16-bit floating point - JS spec does not support),
*  the case for 32-bit floating point is simple...
*/

exports.formatAPDU = function(value) {
  if (!value || typeof value != 'number')
    knxLog.get().error('DPT14: Must supply a number value');
  var apdu_data = new Buffer(4);
  apdu_data.writeFloatBE(value,0);
  return apdu_data;
}

exports.fromBuffer = function(buf) {
  if (buf.length != 4) knxLog.get().warn("DPT14: Buffer should be 4 bytes long");
  return buf.readFloatBE(0);
}

// DPT14 base type info
exports.basetype = {
  "bitlength" : 32,
  "valuetype" : "basic",
  "range" : [0, Math.pow(2, 32)],
  "desc" : "32-bit floating point value"
}

// DPT14 subtypes info
exports.subtypes = {
  // TODO
  "007" : {
    "name" : "DPT_Value_AngleDeg°",
    "desc" : "angle, degree",
    "unit" : "°"
  },

  "019" : {
    "name" : "DPT_Value_Electric_Current",
    "desc" : "electric current",
    "unit" : "A"
  },

  "027" : {
    "name" : "DPT_Value_Electric_Potential",
    "desc" : "electric potential",
    "unit" : "V"
  },

  "028" : {
    "name" : "DPT_Value_Electric_PotentialDifference",
    "desc" : "electric potential difference",
    "unit" : "V"
  },

  "031" : {
    "name" : "DPT_Value_Energ",
    "desc" : "energy",
    "unit" : "J"
  },

  "032" : {
    "name" : "DPT_Value_Force",
    "desc" : "force",
    "unit" : "N"
  },

  "033" : {
    "name" : "DPT_Value_Frequency",
    "desc" : "frequency",
    "unit" : "Hz"
  },

  "036" : {
    "name" : "DPT_Value_Heat_FlowRate",
    "desc" : "heat flow rate",
    "unit" : "W"
  },

  "037" : {
    "name" : "DPT_Value_Heat_Quantity",
    "desc" : "heat, quantity of",
    "unit" : "J"
  },

  "038" : {
    "name" : "DPT_Value_Impedance",
    "desc" : "impedance",
    "unit" : "Ω"
  },

  "039" : {
    "name" : "DPT_Value_Length",
    "desc" : "length",
    "unit" : "m"
  },

  "051" : {
    "name" : "DPT_Value_Mass",
    "desc" : "mass",
    "unit" : "kg"
  },

  "056" : {
    "name" : "DPT_Value_Power",
    "desc" : "power",
    "unit" : "W"
  },

  "065" : {
    "name" : "DPT_Value_Speed",
    "desc" : "speed",
    "unit" : "m/s"
  },

  "066" : {
    "name" : "DPT_Value_Stress",
    "desc" : "stress",
    "unit" : "Pa"
  },

  "067" : {
    "name" : "DPT_Value_Surface_Tension",
    "desc" : "surface tension",
    "unit" : "1/Nm"
  },

  "068" : {
    "name" : "DPT_Value_Common_Temperature",
    "desc" : "temperature, common",
    "unit" : "°C"
  },

  "069" : {
    "name" : "DPT_Value_Absolute_Temperature",
    "desc" : "temperature (absolute)",
    "unit" : "K"
  },

  "070" : {
    "name" : "DPT_Value_TemperatureDifference",
    "desc" : "temperature difference",
    "unit" : "K"
  },

  "078" : {
    "name" : "DPT_Value_Weight",
    "desc" : "weight",
    "unit" : "N"
  },

  "079" : {
    "name" : "DPT_Value_Work",
    "desc" : "work",
    "unit" : "J"
  }
}
