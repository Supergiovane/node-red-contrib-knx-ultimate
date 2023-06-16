/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const fs = require('fs')
const path = require('path')
const util = require('util')
const knxLog = require('./../KnxLog')

let matches
const dirEntries = fs.readdirSync(__dirname)
const dpts = {}
for (let i = 0; i < dirEntries.length; i++) {
  if (matches = dirEntries[i].match(/(dpt.*)\.js/)) {
    const dptid = matches[1].toUpperCase() // DPT1..DPTxxx
    const mod = require(__dirname + path.sep + dirEntries[i])
    if (!mod.hasOwnProperty('basetype') ||
      !mod.basetype.hasOwnProperty('bitlength')) {
      throw 'incomplete ' + dptid + ', missing basetype and/or bitlength!'
    }
    mod.id = dptid
    dpts[dptid] = mod
    // knxLog.get().trace('DPT library: loaded %s (%s)', dptid, dpts[dptid].basetype.desc);
  }
}

// a generic DPT resolution function
// DPTs might come in as 9/"9"/"9.001"/"DPT9.001"
dpts.resolve = function (dptid) {
  const m = dptid.toString().toUpperCase().match(/^(?:DPT)?(\d+)(\.(\d+))?$/)
  if (m === null) { throw 'Invalid DPT format: ' + dptid }

  const dpt = dpts[util.format('DPT%s', m[1])]
  if (!dpt) { throw 'Unsupported DPT: ' + dptid }

  const cloned_dpt = cloneDpt(dpt)
  if (m[3]) {
    cloned_dpt.subtypeid = m[3]
    cloned_dpt.subtype = cloned_dpt.subtypes[m[3]]
  }

  return cloned_dpt
}

/* POPULATE an APDU object from a given Javascript value for the given DPT
 * - either by a custom DPT formatAPDU function
 * - or by this generic version, which:
 * --  1) checks if the value adheres to the range set from the DPT's bitlength
 *
 */
dpts.populateAPDU = function (value, apdu, dptid) {
  // console.log ("BANANA " + dptid)
  const dpt = dpts.resolve(dptid || 'DPT1')
  const nbytes = Math.ceil(dpt.basetype.bitlength / 8)
  // apdu.data = new Buffer(nbytes); // 14/09/2020 Supregiovane: Deprecated. Replaced with below.
  apdu.data = Buffer.alloc(nbytes)
  apdu.bitlength = dpt.basetype && dpt.basetype.bitlength || 1
  let tgtvalue = value
  // get the raw APDU data for the given JS value
  if (typeof dpt.formatAPDU === 'function') {
    // nothing to do here, DPT-specific formatAPDU implementation will handle everything
    // knxLog.get().trace('>>> custom formatAPDU(%s): %j', dptid, value);
    apdu.data = dpt.formatAPDU(value)
    // knxLog.get().trace('<<< custom formatAPDU(%s): %j', dptid, apdu.data);
  } else {
    if (!isFinite(value)) {
      throw util.format('Invalid value, expected a %s',
        dpt.desc)
    }
    // check if value is in range, be it explicitly defined or implied from bitlength
    const range = (dpt.basetype.hasOwnProperty('range'))
      ? dpt.basetype.range
      : [0, Math.pow(2, dpt.basetype.bitlength) - 1]
    // is there a scalar range? eg. DPT5.003 angle degrees (0=0, ff=360)
    if (dpt.hasOwnProperty('subtype') && dpt.subtype.hasOwnProperty(
      'scalar_range')) {
      const scalar = dpt.subtype.scalar_range
      if (value < scalar[0] || value > scalar[1]) {
        knxLog.get().trace(
          'Value %j(%s) out of scalar range(%j) for %s',
          value, (typeof value), scalar, dpt.id)
      } else {
        // convert value from its scalar representation
        // e.g. in DPT5.001, 50(%) => 0x7F , 100(%) => 0xFF
        const a = (scalar[1] - scalar[0]) / (range[1] - range[0])
        const b = (scalar[0] - range[0])
        tgtvalue = Math.round((value - b) / a)
      }
    } else {
      // just a plain numeric value, only check if within bounds
      if (value < range[0] || value > range[1]) {
        knxLog.get().trace('Value %j(%s) out of bounds(%j) for %s.%s',
          value, (typeof value), range, dpt.id, dpt.subtypeid)
      }
    }
    // generic APDU is assumed to convey an unsigned integer of arbitrary bitlength
    if (dpt.basetype.hasOwnProperty('signedness') && dpt.basetype.signedness === 'signed') {
      apdu.data.writeIntBE(tgtvalue, 0, nbytes)
    } else {
      apdu.data.writeUIntBE(tgtvalue, 0, nbytes)
    }
  }
  // knxLog.get().trace('generic populateAPDU tgtvalue=%j(%s) nbytes=%d => apdu=%j', tgtvalue, typeof tgtvalue, nbytes, apdu);
  return apdu
}

/* get the correct Javascript value from a APDU buffer for the given DPT
 * - either by a custom DPT formatAPDU function
 * - or by this generic version, which:
 * --  1) checks if the value adheres to the range set from the DPT's bitlength
 */
dpts.fromBuffer = function (buf, dpt) {
  // sanity check
  if (!dpt) throw util.format('DPT %s not found', dpt)
  let value = 0
  // get the raw APDU data for the given JS value
  if (typeof dpt.fromBuffer === 'function') {
    // nothing to do here, DPT-specific fromBuffer implementation will handle everything
    value = dpt.fromBuffer(buf)
  } else {
    // knxLog.get().trace('%s buflength == %d => %j', typeof buf, buf.length, JSON.stringify(buf) );
    // get a raw unsigned integer from the buffer
    if (buf.length > 6) {
      throw 'cannot handle unsigned integers more then 6 bytes in length'
    }
    if (dpt.basetype.hasOwnProperty('signedness') && dpt.basetype.signedness == 'signed') {
      value = buf.readIntBE(0, buf.length)
    } else {
      value = buf.readUIntBE(0, buf.length)
    }
    // knxLog.get().trace(' ../knx/src/index.js : DPT : ' + JSON.stringify(dpt));   // for exploring dpt and implementing description
    if (dpt.hasOwnProperty('subtype') && dpt.subtype.hasOwnProperty(
      'scalar_range')) {
      const range = (dpt.basetype.hasOwnProperty('range'))
        ? dpt.basetype.range
        : [0, Math.pow(2, dpt.basetype.bitlength) - 1]
      const scalar = dpt.subtype.scalar_range
      // convert value from its scalar representation
      // e.g. in DPT5.001, 50(%) => 0x7F , 100(%) => 0xFF
      const a = (scalar[1] - scalar[0]) / (range[1] - range[0])
      const b = (scalar[0] - range[0])
      value = Math.round(a * value + b)
      // knxLog.get().trace('fromBuffer scalar a=%j b=%j %j', a,b, value);
    }
  }
  //  knxLog.get().trace('generic fromBuffer buf=%j, value=%j', buf, value);
  return value
}

function cloneDpt (d) {
  let result = {}
  result = JSON.parse(JSON.stringify(d))
  result.fromBuffer = d.fromBuffer
  result.formatAPDU = d.formatAPDU
  return result
}

module.exports = dpts
