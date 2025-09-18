;(function (root) {
  const KNXReceiveSnippets = [
    {
      id: 'msg-constructor',
      title: 'Show msg constructor',
      code: `// This is a sample of the msg received from the KNX BUS
const inputMSG = {
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
    }
  ];

  if (root) {
    root.KNXReceiveSnippets = KNXReceiveSnippets;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNXReceiveSnippets;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
