// 31/03/2020 Search Helper

const KNXFunctionSnippetOne = `// @ts-nocheck
// Replace 'x/x/x' with the real status group address.
const statusGA = getGAValue('x/x/x','1.001');
if (msg.payload !== statusGA){ // " !==" means " not equal"
    return msg;
 }else{
// Both values are identical, so i don't send the msg.
    node.status({fill:"grey",shape:"dot",text:"Not sent"}); 
    return; 
}`;

const KNXFunctionSnippetTwo = `// This is a sample of the msg received from the KNX BUS
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
return msg`;

const KNXFunctionSnippetThree = `// @ts-nocheck
// The current msg contains the internal temperature in the "msg.payload" property, but we want to emit the external temperature as well.
msg.externalTemperature = getGAValue('0/0/10 Garden temperature sensor'); // In case the ETS file is missing, you must specify the dpt as well: getGAValue('0/0/10','9.001')
return msg;`;