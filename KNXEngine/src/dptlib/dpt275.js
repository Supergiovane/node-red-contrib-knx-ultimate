/* eslint-disable no-prototype-builtins */
/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2024 Supergiovane
*/

const knxLog = require("../KnxLog");
const dpt9 = require("./dpt9");

//
// 4x DPT9.* 2-byte floating point value
//

exports.formatAPDU = function (value) {
  // Get the javascript object and create a telegram for the KNX bus.
  if (typeof value === 'object' && value.hasOwnProperty('comfort') && value.hasOwnProperty('standby') && value.hasOwnProperty('economy') && value.hasOwnProperty('buildingProtection')) {
    const comfort = dpt9.formatAPDU(value.comfort);
    const standby = dpt9.formatAPDU(value.standby);
    const economy = dpt9.formatAPDU(value.economy);
    const buildingProtection = dpt9.formatAPDU(value.buildingProtection);
    return Buffer.concat([comfort, standby, economy, buildingProtection]);
  } else {
    knxLog.get().error('DPT275.formatAPDU: Must supply all values, for example {comfort:22, standby:21.5, economy:21, buildingProtection:15}');
  }
}

exports.fromBuffer = function (buf) {
  // Get the telegram from the KNX bus and create a javascript object.
  if (buf.length !== 8) {
    knxLog.get().warn('DPT275.fromBuffer: buf should be 8 bytes long (got %d bytes)', buf.length);
    return null;
  }
  const comfort = dpt9.fromBuffer(buf.slice(0, 2));
  const standby = dpt9.fromBuffer(buf.slice(2, 4));
  const economy = dpt9.fromBuffer(buf.slice(4, 6));
  const buildingProtection = dpt9.fromBuffer(buf.slice(6, 8));
  return { comfort: comfort, standby: standby, economy: economy, buildingProtection: buildingProtection }
}
}

// DPT275 basetype info
exports.basetype = {
  bitlength: 64,
  valuetype: 'basic',
  desc: 'Quadruple setpoints (comfort,standby,economy,buildingProtection) (4 float with 16 Bit)',
  help:
    `// Send comfort, standby, economy mode and buildingProtection temperatures, as n.4 DPT9.001.
  msg.payload = {comfort:22, standby:21.5, economy:21, buildingProtection:15};
  return msg;`
}

// DPT9 subtypes
exports.subtypes = {
  // 9.001 temperature (oC)
  '100': {
    name: 'Quadruple setpoints (comfort,standby,economy,buildingProtection) (4 float with 16 Bit)',
    desc: 'DPT_TempRoomSetpSetF16[4]',
    unit: '°C',
    range: [-273, 670760]
  }
}
