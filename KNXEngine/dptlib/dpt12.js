/**
* (C) 2020 Supergiovane
*/

//
// DPT12.*:  4-byte unsigned value
//

const knxLog = require('./../KnxLog');



exports.formatAPDU = function (value) {
  if (!value || typeof value != 'number')
    knxLog.get().error('DPT12: Must supply a number value');
  var apdu_data = Buffer.alloc(4);
  apdu_data.writeUIntBE(value, 0, 4);
  return apdu_data;
}

exports.fromBuffer = function (buf) {
  if (buf.length != 4) {
    knxLog.get().warn("DPT12: Buffer should be 4 bytes long, got", buf.length);
    return null;
  } else {
    return buf.readUIntBE(0, 4);
  }
}

// DPT12 base type info
exports.basetype = {
  bitlength: 32,
  signedness: "unsigned",
  valuetype: "basic",
  desc: "4-byte unsigned value",
  "help":
    `// Send 4-byte unsigned value
msg.payload = 12;
return msg;`
}

// DPT12 subtype info
exports.subtypes = {
  // 12.001 counter pulses
  "001": {
    "name": "Counter pulses (unsigned)", "desc": "Counter pulses"
  },
  "100": {
    "name": "Counter timesec (s)", "desc": "Counter timesec (s)"
  },
  "101": {
    "name": "Counter timemin (min)", "desc": "Counter timemin (min)"
  },
  "102": {
    "name": "Counter timehrs (h)", "desc": "Counter timehrs (h)"
  },
  "1200": {
    "name": "Volume liquid (l)", "desc": "Volume liquid (l)"
  },
  "1201": {
    "name": "Volume (m3)", "desc": "Volume m3"
  }
}
