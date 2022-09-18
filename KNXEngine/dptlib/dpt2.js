/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog')

// DPT2 frame description.
// Always 8-bit aligned.
exports.formatAPDU = function (value) {
  if (!value) {
    knxLog.get().error('DPT2: cannot write null value')
  } else {
    let apdu_data
    if (typeof value === 'object' &&
      value.hasOwnProperty('priority') &&
      value.hasOwnProperty('data')) {
      apdu_data = (value.priority << 1) + (value.data & 0b00000001)
    } else {
      knxLog.get().error('DPT2: Must supply an value {priority:<bool>, data:<bool>}')
    }
    return Buffer.from([apdu_data])
  }
}

exports.fromBuffer = function (buf) {
  if (buf.length != 1) {
    knxLog.get().error('DPT2: Buffer should be 1 byte long, got', buf.length)
    return null
  } else {
    return {
      priority: (buf[0] & 0b00000011) >> 1,
      data: (buf[0] & 0b00000001)
    }
  }
}

// DPT basetype info hash
exports.basetype = {
  bitlength: 2,
  valuetype: 'composite',
  desc: '1-bit value with priority',
  help:
`// Send a true/false with priority
// priority = true or false
// data = true or false
msg.payload = {priority:false, data:true};
return msg;`,
  helplink: 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2'
}

// DPT subtypes info hash
exports.subtypes = {
  // 2.001 switch control
  '001': {
    use: 'G',
    name: 'Switch control',
    desc: 'switch with priority',
    enc: { 0: 'Off', 1: 'On' }
  },
  // 2.002 boolean control
  '002': {
    use: 'G',
    name: 'Bool control',
    desc: 'boolean with priority',
    enc: { 0: 'false', 1: 'true' }
  },
  // 2.003 enable control
  '003': {
    use: 'FB',
    name: 'Emable control',
    desc: 'enable with priority',
    enc: { 0: 'Disabled', 1: 'Enabled' }
  },

  // 2.004 ramp control
  '004': {
    use: 'FB',
    name: 'Ramp control',
    desc: 'ramp with priority',
    enc: { 0: 'No ramp', 1: 'Ramp' }
  },

  // 2.005 alarm control
  '005': {
    use: 'FB',
    name: 'Alarm control',
    desc: 'alarm with priority',
    enc: { 0: 'No alarm', 1: 'Alarm' }
  },

  // 2.006 binary value control
  '006': {
    use: 'FB',
    name: 'Binary value control',
    desc: 'binary value with priority',
    enc: { 0: 'Off', 1: 'On' }
  },

  // 2.007 step control
  '007': {
    use: 'FB',
    name: 'Step control',
    desc: 'step with priority',
    enc: { 0: 'Off', 1: 'On' }
  },

  // 2.008 Direction1 control
  '008': {
    use: 'FB',
    name: 'Direction1 control',
    desc: 'direction 1 with priority',
    enc: { 0: 'Off', 1: 'On' }
  },

  // 2.009 Direction2 control
  '009': {
    use: 'FB',
    name: 'Direction2 control',
    desc: 'direction 2 with priority',
    enc: { 0: 'Off', 1: 'On' }
  },

  // 2.010 start control
  '001': {
    use: 'FB',
    name: 'Start control',
    desc: 'start with priority',
    enc: { 0: 'No control', 1: 'No control', 2: 'Off', 3: 'On' }
  },

  // 2.011 state control
  '001': {
    use: 'FB',
    name: 'Switch control',
    desc: 'switch',
    enc: { 0: 'No control', 1: 'No control', 2: 'Off', 3: 'On' }
  },

  // 2.012 invert control
  '001': {
    use: 'FB',
    name: 'Switch control',
    desc: 'switch',
    enc: { 0: 'No control', 1: 'No control', 2: 'Off', 3: 'On' }
  }
}
