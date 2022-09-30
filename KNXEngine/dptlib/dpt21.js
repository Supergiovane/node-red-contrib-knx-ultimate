/**

* (C) 2022 Supergiovane
*/

const knxLog = require('./../KnxLog')

// Structure of DPT 21.xxx: b7b6b5b4b3b2b1b0
// Bit 0: outOfService
// Bit 1: fault
// Bit 2: overridden
// Bit 3: inAlarm
// Bit 4: alarmUnAck
// Bit 5: reserved (0)
// Bit 6: reserved (0)
// Bit 7: reserved (0)

exports.formatAPDU = function (value) {
  if (!value) {
    knxLog.get().error('DPT21: cannot write null value')
  } else {
    if (typeof value === 'object' &&
      value.hasOwnProperty('outOfService') && typeof value.outOfService === 'boolean' &&
      value.hasOwnProperty('fault') && typeof value.fault === 'boolean' &&
      value.hasOwnProperty('overridden') && typeof value.overridden === 'boolean' &&
      value.hasOwnProperty('inAlarm') && typeof value.inAlarm === 'boolean' &&
      value.hasOwnProperty('alarmUnAck') && typeof value.alarmUnAck === 'boolean') {
    } else {
      knxLog.get().error('DPT21: Must supply a right payload: {outOfService:true-false, fault:true-false, overridden:true-false, inAlarm:true-false, alarmUnAck:true-false}')
    }
    const bitVal = parseInt('0000' + (value.alarmUnAck ? '1' : '0') + (value.inAlarm ? '1' : '0') + (value.overridden ? '1' : '0') + (value.fault ? '1' : '0') + (value.outOfService ? '1' : '0'), 2)
    return Buffer.from([bitVal])
  }
}

exports.fromBuffer = function (buf) {
  if (buf.length !== 1) {
    knxLog.get().error('DPT21: Buffer should be 8 bit long, got', buf.length)
    return null
  }
  const sBit =Array.from((parseInt(buf.toString('hex').toUpperCase(), 16).toString(2)).padStart(8, '0')) // Get bit from hex
  const ret = { outOfService: sBit[7] ==='1' ? true : false, fault: sBit[6]==='1' ? true : false, overridden: sBit[5]==='1' ? true : false, inAlarm: sBit[4]==='1' ? true : false, alarmUnAck: sBit[3] ==='1' ? true : false }
  return ret
}

exports.basetype = {
  bitlength: 8,
  valuetype: 'basic',
  desc: 'General Status',
  help:
    `// This represents a general status
// outOfService:true-false, fault:true-false, overridden:true-false, inAlarm:true-false, alarmUnAck:true-false
msg.payload={outOfService:false, fault:false, overridden:false, inAlarm:true, alarmUnAck:false};
return msg;`,
  helplink: ''
}

exports.subtypes = {
  '001': {
    desc: 'outOfService:true-false, fault:true-false, overridden:true-false, inAlarm:true-false, alarmUnAck:true-false',
    name: 'General Status',
    unit: '',
    scalar_range: [,],
    range: [,]
  }
}
