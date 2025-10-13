; (function (root) {
  const KNXReceiveSnippets = [
    {
      id: 'msg-constructor',
      title: 'Show msg constructor',
      code: `// This is a sample of the msg received from the KNX BUS
msg = {
    topic: '0/0/10',
    devicename: 'Plafoniera soggiorno [switch]',
    payload: false,
    payloadmeasureunit: 'unknown',
    payloadsubtypevalue: 'Off',
    gainfo: {
      maingroupname: 'Attuatori luci',
      middlegroupname: 'Luci primo piano',
      ganame: 'Plafoniera soggiorno [switch]',
      maingroupnumber: '0',
      middlegroupnumber: '0',
      ganumber: '10'
    },
    knx: {
      event: 'GroupValue_Write',
      dpt: '1.001',
      dptdesc: 'Switch',
      source: '15.15.22',
      destination: '0/0/10',
      rawValue: 'bufferValue'
    },
    previouspayload: false
}
return msg`
    },
    {
      id: 'add-property-to-msg',
      title: 'Add property to msg',
      code: `// @ts-nocheck
// The current msg contains the internal temperature in the "msg.payload" property, but we want to emit the external temperature as well.
msg.externalTemperature = getGAValue('0/0/10 Garden temperature sensor'); // In case the ETS file is missing, you must specify the dpt as well: getGAValue('0/0/10','9.001')
return msg;`
    },
    {
      id: 'motion-light-with-lux-check',
      title: 'Turn on a light only if it is dark',
      code: `// @ts-nocheck
// When a motion detector sends a telegram, switch on the corridor light only if
// the outdoor lux sensor reports a value lower than 80 lux.
if (msg.payload === true) {
  const currentLux = getGAValue('0/2/5 Garden lux sensor', '9.004');
  if (typeof currentLux === 'number' && currentLux < 80) {
    return msg;
  }
}
return`
    },
    {
      id: 'pause-hvac-on-window-open',
      title: 'Suspend HVAC when a window is open',
      code: `// @ts-nocheck
// If a window contact reports OPEN, put the HVAC in standby mode and send
// the contact state downstream.
if (msg.payload === true && msg.payloadsubtypevalue === 'Open') {
  setGAValue('3/0/15 HVAC Comfort mode', false, '1.001');
  setGAValue('3/0/16 HVAC Fan speed', 0, '5.010');
}
return msg;`
    },
    {
      id: 'night-door-alert',
      title: 'Raise an alert if a door opens at night',
      code: `// @ts-nocheck
// Between 23:00 and 06:00 send a notification telegram when the main door opens.
const hour = new Date().getHours();
if (msg.payload === true && (hour >= 23 || hour < 6)) {
  setGAValue('4/1/9 Alarm buzzer', true, '1.001');
  msg.nightDoorAlert = true; // expose flag to the flow as well
}
return msg;`
    }
  ]

  if (root) {
    root.KNXReceiveSnippets = KNXReceiveSnippets
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNXReceiveSnippets
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this))
