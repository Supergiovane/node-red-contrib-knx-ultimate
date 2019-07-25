/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const log = require('log-driver').logger;

//
// DPT16: ASCII string (max 14 chars)
//

exports.formatAPDU = function(value) {
  if (typeof value != 'string') log.warn("Must supply a string value")
  else {
    var buf = new Buffer(14);
    buf.write(value, 'ascii')
    return buf;
  }
}

exports.fromBuffer = function(buf) {
  return buf.toString('ascii');
}

// DPT16 basetype info
exports.basetype = {
  bitlength : 14*8,
  valuetype : 'basic',
  desc : "14-character string"
}

// DPT9 subtypes
exports.subtypes = {
  // 16.000 ASCII string
  "000" : { use : "G",
    name : "DPT_String_ASCII", desc : "ASCII string",
    force_encoding : "US-ASCII"
  },

  // 16.001 ISO-8859-1 string
  "001" : { use : "G",
    name : "DPT_String_8859_1", desc : "ISO-8859-1 string",
    force_encoding : "ISO-8859-1"
  },
}
