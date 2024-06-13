const knx = require("./index.js");
const dptlib = require('./src/dptlib');

// Get a list of supported datapoints
// With this function, you can see what datapoints are supported and a sample on how you need to format the payload to be sent.
// ######################################
// Helpers
sortBy = (field) => (a, b) => {
    if (a[field] > b[field]) { return 1 } else { return -1 }
};
onlyDptKeys = (kv) => {
    return kv[0].startsWith("DPT")
};
extractBaseNo = (kv) => {
    return {
        subtypes: kv[1].subtypes,
        base: parseInt(kv[1].id.replace("DPT", ""))
    }
};
convertSubtype = (baseType) => (kv) => {
    let value = `${baseType.base}.${kv[0]}`;
    //let sRet = value + " " + kv[1].name + (kv[1].unit === undefined ? "" : " (" + kv[1].unit + ")");
    let sRet = value + " " + kv[1].name;
    return {
        value: value
        , text: sRet
    }
}
toConcattedSubtypes = (acc, baseType) => {
    let subtypes =
        Object.entries(baseType.subtypes)
            .sort(sortBy(0))
            .map(convertSubtype(baseType))

    return acc.concat(subtypes)
};
dptGetHelp = dpt => {
    var sDPT = dpt.split(".")[0]; // Takes only the main type
    var jRet;
    if (sDPT == "0") { // Special fake datapoint, meaning "Universal Mode"
        jRet = {
            "help":
                ``, "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki"
        };
        return (jRet);
    }
    jRet = { "help": "No sample currently avaiable", "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome" };
    const dpts =
        Object.entries(dptlib)
            .filter(onlyDptKeys)
    for (let index = 0; index < dpts.length; index++) {
        if (dpts[index][0].toUpperCase() === "DPT" + sDPT) {
            jRet = { "help": (dpts[index][1].basetype.hasOwnProperty("help") ? dpts[index][1].basetype.help : "No sample currently avaiable, just pass the payload as is it"), "helplink": (dpts[index][1].basetype.hasOwnProperty("helplink") ? dpts[index][1].basetype.helplink : "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome") };
            break;
        }
    }
    return (jRet);
}
const dpts =
    Object.entries(dptlib)
        .filter(onlyDptKeys)
        .map(extractBaseNo)
        .sort(sortBy("base"))
        .reduce(toConcattedSubtypes, [])
dpts.forEach(element => {
    console.log(element.text + " USAGE: " + dptGetHelp(element.value).help);
    console.log(" ");
});
// ######################################

// Let's connect and turn on your appliance.
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

var knxUltimateClient;

// If you're reinstantiating a new knxUltimateClient object, you must remove all listeners.
// If this is the first time you instantiate tne knxUltimateClient object, this part of code throws an error into the try...catch.
try {
    if (knxUltimateClient !== null) knxUltimateClient.removeAllListeners();
} catch (error) {
    // New connection, do nothing.
}

// Let's go
knxUltimateClient = new knx.KNXClient(knxUltimateClientProperties);

// Setting handlers
// ######################################
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.indication, handleBusEvents);
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.error, err => {
    // Error event
    console.log("Error", err)
});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.disconnected, info => {
    // The client is disconnected. Here you can handle the reconnection
    console.log("Disconnected", info)
});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.close, info => {
    // The client physical net socket has been closed
    console.log("Closed", info)
});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.ackReceived, (knxMessage, info) => {
    // In -->tunneling mode<-- (in ROUTING mode there is no ACK event), signals wether the last KNX telegram has been acknowledge or not
    // knxMessage: contains the telegram sent.
    // info is true it the last telegram has been acknowledge, otherwise false.
    console.log("Last telegram acknowledge", knxMessage, info)
});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.connected, info => {
    // The client is connected
    console.log("Connected. On Duty", info)

    // Check wether knxUltimateClient is clear to send the next telegram.
    // This should be called bevore any .write, .response, and .read request.
    // If not clear to send, retry later because the knxUltimateClient is busy in sending another telegram.
    console.log("Clear to send: " + knxUltimateClient.clearToSend)

    // // Send a WRITE telegram to the KNX BUS
    // // You need: group address, payload (true/false/or any message), datapoint as string
    let payload = false;
    if (knxUltimateClient.clearToSend) knxUltimateClient.write("0/1/1", payload, "1.001");

    // Send a color RED to an RGB datapoint
    payload = { red: 125, green: 0, blue: 0 };
    if (knxUltimateClient.clearToSend) knxUltimateClient.write("0/1/2", payload, "232.600");

    // // Send a READ request to the KNX BUS
    if (knxUltimateClient.clearToSend) knxUltimateClient.read("0/0/1");

    // Send a RESPONSE telegram to the KNX BUS
    // You need: group address, payload (true/false/or any message), datapoint as string
    payload = false;
    if (knxUltimateClient.clearToSend) knxUltimateClient.respond("0/0/1", payload, "1.001");

});
knxUltimateClient.on(knx.KNXClient.KNXClientEvents.connecting, info => {
    // The client is setting up the connection
    console.log("Connecting...", info)
});
// ######################################

knxUltimateClient.Connect();

// Handle BUS events
// ---------------------------------------------------------------------------------------
function handleBusEvents(_datagram, _echoed) {

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
        // We know that 0/1/1 is a boolean DPT 1.001
        dpt = dptlib.resolve("1.001");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
    } else if (_dst === "0/1/2") {
        // We know that 0/1/2 is a boolean DPT 232.600 Color RGB
        dpt = dptlib.resolve("232.600");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
    } else {
        // All others... assume they are boolean
        dpt = dptlib.resolve("1.001");
        jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
        if (jsValue === null) {
            // Is null, try if it's a numerical value
            dpt = dptlib.resolve("5.001");
            jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
        }
    }
    console.log("src: " + _src + " dest: " + _dst, " event: " + _evt, " value: " + jsValue);

}

// Disconnect after 20 secs.
setTimeout(() => {
    if (knxUltimateClient.isConnected()) knxUltimateClient.Disconnect();
}, 20000);
