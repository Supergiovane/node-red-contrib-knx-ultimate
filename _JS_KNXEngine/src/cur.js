const KNXClient = require("./KNXClient");
const KNXAddress = require("./protocol/KNXAddress").KNXAddress;
const DPTLib = require('./dptlib');
const KNXDataBuffer = require("./protocol/KNXDataBuffer").KNXDataBuffer;

// Create tunnel socket with source knx address 1.1.100
const optionsDefaults = {
    physAddr: '15.15.21',
    connectionKeepAliveTimeout: 60,

    //ipAddr: "224.0.23.12",
    //hostProtocol: "Multicast", // TunnelUDP, TunnelTCP, Multicast
    //isSecureKNXEnabled: false,

    ipAddr: "192.168.1.15",
    hostProtocol: "TunnelUDP", // TunnelUDP, TunnelTCP, Multicast
    isSecureKNXEnabled: false,

    //ipAddr: "192.168.1.54",
    //hostProtocol: "TunnelTCP", // TunnelUDP, TunnelTCP, Multicast
    //isSecureKNXEnabled: true,

    ipPort: 3671,
    suppress_ack_ldatareq: false,
    loglevel: "info",
    localEchoInTunneling: true,
    //localIPAddress: "", // Riempito da KNXEngine
    interface: "" // en3
};
const knxClient = new KNXClient.KNXClient(optionsDefaults);

knxClient.on(KNXClient.KNXClientEvents.error, err => {

    console.log("BANANA ERRORE", err);

});

// Call discoverCB when a knx gateway has been discovered.
knxClient.on(KNXClient.KNXClientEvents.discover, info => {
    const [ip, port] = info.split(":");
    discoverCB(ip, port);
});

knxClient.on(KNXClient.KNXClientEvents.disconnected, info => {

    console.log("BANANA DISCONNESSO", info);

});

knxClient.on(KNXClient.KNXClientEvents.close, info => {

    console.log("BANANA CHIUSO", info);

});

knxClient.on(KNXClient.KNXClientEvents.connected, info => {

    console.log("CONNESSO CON CHANNEL ID ", knxClient.channelID);

});

knxClient.on(KNXClient.KNXClientEvents.connecting, info => {

    console.log("CONNECTING ", info);

});


// start auto discovery on interface with ip 192.168.1.99
//knxClient.startDiscovery("192.168.1.157");

const wait = (t = 3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const handleBusEvent = function (_datagram, _echoed, rawCEMISocketMessage) {
    //console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
    try {
        var dpt = DPTLib.resolve("DPT1.001");
        var jsvalue = DPTLib.fromBuffer(_datagram.cEMIMessage.npdu.dataValue, dpt)
    } catch (error) {
        console.log(error);
    }

    let sType = "";
    if (_datagram.cEMIMessage.npdu.isGroupRead) sType = "GroupValue_Read";
    if (_datagram.cEMIMessage.npdu.isGroupResponse) sType = "GroupValue_Response";
    if (_datagram.cEMIMessage.npdu.isGroupWrite) sType = "GroupValue_Write";

    let srcAddress = _datagram.cEMIMessage.srcAddress.toString();
    let dstAddress = _datagram.cEMIMessage.dstAddress.toString();

    let isRepeated = _datagram.cEMIMessage.control.repeat === 1 ? false : true;


    // 23/03/2021 Supergiovane: Added the CEMI telegram for ETS Diagnostic
    // #####################################################################
    let cemiETS = "";

    if (rawCEMISocketMessage !== undefined) {
        try {
            var iStart = _datagram._header._headerLength + 4;
            cemiETS = rawCEMISocketMessage.toString("hex").substring(iStart * 2);
        } catch (error) { cemiETS = ""; }
    }


    // #####################################################################

    console.log("BANANA", srcAddress, dstAddress, jsvalue, "Echoed", _echoed, "Type", sType, "Repeat", isRepeated, "cemiETS", cemiETS)

};

try {
    console.log("INIZIO CONNESSIONE") 
    knxClient.Connect();

} catch (error) {
    console.log("ORRORE CONNESSIONE",error);
    return;
}


knxClient.on(KNXClient.KNXClientEvents.indication, handleBusEvent);

setTimeout(() => {
    try {

        console.log("ACCENDEO")
        knxClient.write("0/1/1", true, "DPT1.001");
    } catch (error) {
        console.log("ORRORE", error)
    }

}, 5000);

setTimeout(() => {

    //grpaddr, value, bitlength

    // Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
    let writeraw = Buffer.from('01', 'hex'); // Put '00' instead of '01' to switch off the light.
    let bitlenght = 1;

    try {
        console.log("RAWEO", writeraw);
        knxClient.writeRaw("0/1/1", writeraw, bitlenght);

    } catch (error) {
        console.log("ORRORE", error)
    }

}, 8000);

setTimeout(() => {

    console.log("DISCONNETTO");
    knxClient.Disconnect();
   
 
}, 10000);

setTimeout(() => {

      
    console.log("CONNETTO");
    knxClient.Connect();

}, 12000);

// setInterval(() => {
//     try {
//         let adpu = {};
//         let knxDataBuff
//         let addr
//         adpu = DPTLib.populateAPDU(false, adpu, "DPT1.001");
//         knxDataBuff = new KNXDataBuffer(adpu.data)
//         addr = KNXAddress.createFromString("0/1/1", KNXAddress.TYPE_GROUP); // 257
//         console.log("BANANA SOENGO)")
//         knxEngine.writeAsync(addr, knxDataBuff);
//     } catch (error) {
//         console.log("ORRORE", error)
//     }
// }, 3000);

// setTimeout(() => {
//     knxClient.readAsync(addr);

// }, 10000);
// setTimeout(() => {
//     knxClient.respondAsync(addr, knxDataBuff);
// }, 5000);





// Actions to perform when a KNX gateway has been discovered.
const discoverCB = (ip, port) => {
    // console.log("Connecting to ", ip, port);

    // // Connect to the knx gateway on ip:port
    // knxClient.connectAsync(ip, port)
    //     .then(() => {
    //         console.log("Connected through channel id ", knxClient.channelID);

    //         var dpt = DPTLib.resolve("DPT1.001");
    //         let adpu = {};

    //         console.log("SENT", DPTLib.populateAPDU(false, adpu, dpt))
    //         //knxClient.sendWriteRequest("15.15.0", "0/1/1", DPTLib.populateAPDU(false, "", dpt));

    //     });

};
