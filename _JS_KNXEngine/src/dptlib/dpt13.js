/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

//
// DPT13: 4-byte signed value
//

// DPT13 base type info
exports.basetype = {
  bitlength: 32,
  signedness: 'signed',
  valuetype: 'basic',
  desc: '4-byte signed value',
  range: [-Math.pow(2, 31), Math.pow(2, 31) - 1],
  help:
`// Send 4-byte signed value. Range [-Math.pow(2, 31), Math.pow(2, 31)-1].
msg.payload = 22;
return msg;`
}

// DPT13 subtypes
exports.subtypes = {
  // 13.001 counter pulses (signed)
  '001': {
    desc: 'Value_4_Count',
    name: 'Counter pulses (signed)',
    unit: 'pulses'
  },

  '002': {
    desc: 'DPT_FlowRate_m3/h',
    name: 'Flow Rate in m³/h',
    unit: 'm³/h'
  },

  // 13.010 active energy (Wh)
  '010': {
    desc: 'ActiveEnergy',
    name: 'Active energy (Wh)',
    unit: 'Wh'
  },

  // 13.011 apparent energy (VAh)
  '011': {
    desc: 'ApparentEnergy',
    name: 'Apparent energy (VAh)',
    unit: 'VAh'
  },

  // 13.012 reactive energy (VARh)
  '012': {
    desc: 'ReactiveEnergy',
    name: 'Reactive energy (VARh)',
    unit: 'VARh'
  },

  // 13.013 active energy (KWh)
  '013': {
    desc: 'ActiveEnergy_kWh',
    name: 'Active energy (kWh)',
    unit: 'kWh'
  },

  // 13.014 apparent energy (kVAh)
  '014': {
    desc: 'ApparantEnergy_kVAh',
    name: 'Apparent energy (kVAh)',
    unit: 'VAh'
  },

  // 13.015 reactive energy (kVARh)
  '015': {
    desc: 'ReactiveEnergy_kVARh',
    name: 'Reactive energy (kVARh)',
    unit: 'kVARh'
  },

  // 13.016 ActiveEnergy_MWh
  '016': {
    desc: 'ActiveEnergy_MWh',
    name: 'Active Energy (MWh)',
    unit: 'MWh'
  },

  // 13.100 time lag(s)
  100: {
    desc: 'LongDeltaTimeSec',
    name: 'Time lag(s)',
    unit: 's'
  },

  // 13.1200 DeltaVolumeLiquid_Litre
  1200: {
    desc: 'DeltaVolumeLiquid_Litre',
    name: 'Delta Volume Liquid (litre)',
    unit: 'l'
  },

  // 13.1201 DeltaVolume_m3
  1201: {
    desc: 'DeltaVolume_m3',
    name: 'Delta Volume m3',
    unit: 'm3'
  }
}
