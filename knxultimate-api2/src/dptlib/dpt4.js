/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT4: 8-bit character
//
exports.formatAPDU = function (value) {
  if (!value) {
    knxLog.get().warn("DPT4: cannot write null value");
  } else {
    if (typeof value == 'string') {
      var apdu_data = value.charCodeAt(0);
      if (apdu_data > 255) knxLog.get().warn("DPT4: must supply an ASCII character");
      return new Buffer.from([apdu_data]);
    }
    else knxLog.get().warn("DPT4: Must supply a character or string");
  }
}

exports.fromBuffer = function (buf) {
  if (buf.length != 1) {
    knxLog.get().warn("DPT4: Buffer should be 1 byte long, got", buf.length);
    return null;
  } else {
    return String.fromCharCode(buf[0]);
  }
}

exports.basetype = {
  "bitlength": 8,
  "valuetype": "basic",
  "desc": "8-bit character",
  "help":
    `// Send a single character in ascii or ISO
msg.payload = "A";
return msg;`,
  "helplink": ""
}

exports.subtypes = {
  // 4.001 character (ASCII)
  "001": {
    "name": "Char ASCII",
    "desc": "ASCII character (0-127)",
    "range": [0, 127],
    "use": "G",
  },
  // 4.002 character (ISO-8859-1)
  "002": {
    "name": "Char 8859 1",
    "desc": "ISO-8859-1 character (0..255)",
    "use": "G",
  }
}
