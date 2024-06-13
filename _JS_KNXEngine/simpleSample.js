const knx = require("./index.js");
const dptlib = require('./src/dptlib');

// Set the properties
let knxUltimateClientProperties = {
    ipAddr: "224.0.23.12",
    ipPort: "3671",
    physAddr: "1.1.100",
    suppress_ack_ldatareq: false,
    loglevel: "error", // or "debug" is the default
    localEchoInTunneling: true, // Leave true, forever.
    hostProtocol: "Multicast", // "Multicast" in case you use a KNX/IP Router, "TunnelUDP" in case of KNX/IP Interface, "TunnelTCP" in case of secure KNX/IP Interface (not yet implemented)
    isSecureKNXEnabled: false, // Leave "false" until KNX-Secure has been released
    jKNXSecureKeyring: "", // ETS Keyring JSON file (leave blank until KNX-Secure has been released)
    localIPAddress: "", // Leave blank, will be automatically filled by KNXUltimate
    KNXEthInterface: "Auto", // Bind to the first avaiable local interfavce. "Manual" if you wish to specify the interface (for example eth1); in this case, set the property interface to the interface name (interface:"eth1")
};

// Instantiate the client
const knxUltimateClient = new knx.KNXClient(knxUltimateClientProperties);

// Setting handlers
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.indication, function (_datagram, _echoed) {

    // This function is called whenever a KNX telegram arrives from BUS

    // Get the event
    let _evt = "";
    let dpt = "";
    let jsValue;
    if (_datagram.cEMIMessage.npdu.isGroupRead) _evt = "GroupValue_Read";
    if (_datagram.cEMIMessage.npdu.isGroupResponse) _evt = "GroupValue_Response";
    if (_datagram.cEMIMessage.npdu.isGroupWrite) _evt = "GroupValue_Write";
    // Get the source Address
    let _src = _datagram.cEMIMessage.srcAddress.toString();
    // Get the destination GA
    let _dst = _datagram.cEMIMessage.dstAddress.toString()
    // Get the RAW Value
    let _Rawvalue = _datagram.cEMIMessage.npdu.dataValue;

    // Decode the telegram. 
    if (_dst === "0/1/1") {
        // We know, for example, that 0/1/1 is a boolean DPT 1.001
        dpt = dptlib.resolve("1.001");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
    } else if (_dst === "0/1/2") {
        // We know , for example, that 0/1/2 is a DPT 232.600 Color RGB
        dpt = dptlib.resolve("232.600");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
    } else {
        // All others... assume they are boolean
        dpt = dptlib.resolve("1.001");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
        if (jsValue === null) {
            // Opppsss, it's null. It means that the datapoint isn't 1.001
            // Raise whatever error you want.
        }
    }
    console.log("src: " + _src + " dest: " + _dst, " event: " + _evt, " value: " + jsValue);


});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.connected, info => {
    // The client is connected
    console.log("Connected. On Duty", info);
    // WARNING, THIS WILL WRITE ON YOUR KNX BUS!
    knxUltimateClient.write("0/1/1", false, "1.001");
});

// Connect
try {
    knxUltimateClient.removeAllListeners();
} catch (error) {
}
knxUltimateClient.Connect();

