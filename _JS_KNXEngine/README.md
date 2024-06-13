![Logo](img/logo-big.png)

<br/>

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Youtube][youtube-image]][youtube-url]
[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) 

<br/>

Control your KNX intallation via Node.js!

> This is the official engine of Node-Red node KNX-Ultimate (https://flows.nodered.org/node/node-red-contrib-knx-ultimate)
> I had many users asking for a node.js release of that engine, so here is it.
> The node will be KNX Secure compatible. I'm already working on that.

<br/>
<br/>

## CHANGELOG

* See <a href="https://github.com/Supergiovane/knxultimate/blob/master/CHANGELOG.md">here the changelog</a>

<br/>
<br/>

## VOLUNTEER NEEDED FOR KNX SECURE

**************************************************
**************************************************

KNX-Secure is under development and **should** be ready by mid 2022.<br/>
Many users requested me to "extract" the baseline KNX API from Node-Red KNX-Ultimate node and make it accessible via npmjs. Here is it.<br/>
I need volunteer helping in development of KNX Secure.<br/>
High knowledge of cryptography and KNX is needed.
**************************************************
**************************************************

<br/>
<br/>

**Properties to be passed to the connection(see the knxUltimateClientProperties variable below)**

|Property|Description|
|--|--|
| ipAddr (string) | The IP of your KNX router/interface (for Routers, use "224.0.23.12") |
| ipPort (string) | The port, default is "3671" |
| physAddr (string) | The physical address to be identified in the KNX bus |
| suppress_ack_ldatareq (bool) | Avoid sending/receive the ACK telegram. Leave false. If you encounter issues with old interface, set it to true |
| loglevel (string) | The log level. "info", "error", "debug" or "trace" |
| localEchoInTunneling (bool) | Leave true forever. This is used only in Node-Red KNX-Ultimate node |
| hostProtocol (string) | "Multicast" if you're connecting to a KNX Router. "TunnelUDP" for KNX Interfaces, or "TunnelTCP" for secure KNX Interfaces (not yet implemented)|
| isSecureKNXEnabled (bool) | True: Enables the secure connection. Leave false until KNX-Secure has been released. |
| jKNXSecureKeyring (string) | ETS Keyring JSON file content (leave blank until KNX-Secure has been released) |
| localIPAddress (string) | The local IP address to be used to connect to the KNX/IP Bus. Leave blank, will be automatically filled by KNXUltimate |
| KNXEthInterface (string) | "Auto": Bind to the first avaiable local interfavce. "Manual": if you wish to specify the interface (for example eth1); in this case, set the property **interface** to the interface name (interface:"eth1") |
| interface (string) | Specifies the local eth interface to be used to connect to the KNX Bus. **Do not add** this parameter if you've set **KNXEthInterface** to "Auto"|

<br/>
<br/>

**Supported Datapoints**

For each Datapoint, there is a sample on how to format the payload (telegram) to be passed.<br/>
For example, pass a *true* for datapoint "1.001", or *{ red: 125, green: 0, blue: 0 }* for datapoint "232.600".<br/>
It support a massive number of Datapoints. Please run the **sample.js** file to view all datapoints in the console window.<br/>
Be aware, that the descriptions you'll see, are taken from Node-Red KNX-Ultimate node, so there is more code than you need here. Please take only the *msg.payload* part in consideration.<br/>
You should see something like this in the console window (the **msg.payload** is what you need to pass as payload):

<img src='https://raw.githubusercontent.com/Supergiovane/knxultimate/master/img/dpt.png' width='60%'>

<br/>
<br/>

## CONTROL THE CLIENT

|Method|Description|
|--|--|
| .Connect() | Connects to the KNX Gateway |
| .Disconnect() | Gracefully disconnects from the KNX Gateway |
| .write (GA, payload, datapoint) | Sends a WRITE telegram to the BUS. **GA** is the group address (for example "0/0/1"), **payload** is the value you want to send (for example true), **datapoint** is a string representing the datapoint (for example "5.001") |
| .respond (GA, payload, datapoint) | Sends a RESPONSE telegram to the BUS. **GA** is the group address (for example "0/0/1"), **payload** is the value you want to send (for example true), **datapoint** is a string representing the datapoint (for example "5.001") |
| .read (GA) | Sends a READ telegram to the BUS. **GA** is the group address (for example "0/0/1").|

<br/>
<br/>

|Properties|Description|
|--|--|
| .isConnected() | Returns **true** if you the client is connected to the KNX Gateway Router/Interface, **false** if not connected. |
| .clearToSend | Returns **true** if you can send a telegram, **false** if the client is still waiting for the last telegram's ACK or whenever the client cannot temporary send the telegram. In tunneling mode, you could also refer to the event **KNXClientEvents.ackReceived**, that is fired everytime a telegram has been succesfully acknowledge or not acknowledge. See the sample.js file. |

<br/>
<br/>

## EVENTS

Please see the sample.js file. This sample contains all events triggered by KNXUltimate.



<br/>
<br/>

## DECONDING THE TELEGRAMS FROM BUS
Decoding is very simple.
Just require the dptlib and use it to decode the RAW telegram
```javascript
const dptlib = require('./src/dptlib');
let dpt = dptlib.resolve("1.001");
let jsValue = dptlib.fromBuffer(RAW VALUE (SEE SAMPLES), dpt); // THIS IS THE DECODED VALUE
```

<br/>
<br/>


## Simple sample (you can find this sample in the "simpleSample.js" file):

```javascript
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
```


<br/>
<br/>

## Full featured sample (you can find this sample in the "sample.js" file):

```javascript
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
```

<br/>
<br/>

# KNX Secure connection sample (you can find this sample in the "sampleSecure.js" file):

The knx secure is under development. You can see this sample as reference, if you wish to contribute to the project.<br/>
KNX Secure is not ready and it still in pre alfa.<br/>
Loading, decrypting and validating Keyring file has been done.<br/>
I'm working on the first secure handshake now.<br/>

```javascript
const knx = require("./index.js");
const KNXsecureKeyring = require("./src/KNXsecureKeyring.js");
const dptlib = require('./src/dptlib');

// This is the content of the ETS Keyring file obtained doing this: https://www.youtube.com/watch?v=OpR7ZQTlMRU
let rawjKNXSecureKeyring = `<?xml version="1.0" encoding="utf-8"?>
<Keyring Project="KNX Secure" CreatedBy="ETS 5.7.6 (Build 1398)" Created="2021-11-17T07:43:08" Signature="V279vCe6oJXL/6a06Ys2yQ==" xmlns="http://knx.org/xml/keyring/1">
  <Backbone MulticastAddress="224.0.23.12" Latency="2000" Key="CRL14M51oI9pKhzMGGjO1g==" />
  <Interface IndividualAddress="3.1.2" Type="Tunneling" Host="3.1.1" UserID="2" Password="gF8N8lKGU9cD3TNMLEvu50SbI48qI5EeC8WeciL53Zg=" Authentication="jHW6k+R/b+GOfdaNzXXildWI4BrqHkAoa6lUtWCGGDI=" />
  <Interface IndividualAddress="3.1.3" Type="Tunneling" Host="3.1.1" UserID="3" Password="HbvdOCahzdmjhSaMBeFb/2x8+CwYxF1865N3Nrg485o=" Authentication="XtQMiHSX7cwgB3SJL+CZuCePx434JL1p9cZfjLiGfg4=" />
  <Interface IndividualAddress="3.1.4" Type="Tunneling" Host="3.1.1" UserID="4" Password="VPlMEqpC/COz/szs1qsGLg63giJ/E5DbN8MIBgsLYyQ=" Authentication="zmn+tKNmoO+5jiKXeqeDruvC/OA/zNbOdhiWPFQ1+0g=" />
  <Interface IndividualAddress="3.1.5" Type="Tunneling" Host="3.1.1" UserID="5" Password="Dqeea+bKaoe7pk/czGgKdLT5ucuOfwMJmpJ/0Q32woY=" Authentication="glxFMw43J7cUAklu38GVga2AjEcz4PgOc2aTEKpjXEI=" />
  <Interface IndividualAddress="3.1.6" Type="Tunneling" Host="3.1.1" UserID="6" Password="teB74cgZdQL6CR81pyrWmSHUR8wlDw6PXM5oLlAPLyM=" Authentication="vRKBbWxwF1jsvi5oS64YGT3HaPog9Dcg+cVelgay3vY=" />
  <Interface IndividualAddress="3.1.7" Type="Tunneling" Host="3.1.1" UserID="7" Password="BbGlEV5JGosOs2bl6d63rnYDax8S1pMqf5pKluV0l54=" Authentication="3U49RFQAM7pFD40y5zJg2ebcXKCh1cgx41DGzzAZzZE=" />
  <Interface IndividualAddress="3.1.8" Type="Tunneling" Host="3.1.1" UserID="8" Password="8O2/pOsUgxQuTtspPZ2wIo4HQxvcrECaHLtoyUY0CZk=" Authentication="/4XvMBmc60edJUKUzpCrpy+MRfQJR5jN673I/Qa5V5o=" />
  <Interface IndividualAddress="3.1.9" Type="Tunneling" Host="3.1.1" UserID="9" Password="8hIlqwHsQjRGd8sYRiXG/OyPDQObevIDuKRhVQcXxoc=" Authentication="USfsg+wsH0hwoeLq/GqLcPtfGk5XPW3aAjVgwQjYpQs=" />
  <GroupAddresses>
    <Group Address="16384" Key="CreHKeXp+5U2qMLVU0XWxw==" />
    <Group Address="16385" Key="4N4QIW0wJiRitgxvX4s7ow==" />
    <Group Address="16386" Key="AOqADeC4y2u4kYCtBclCtg==" />
  </GroupAddresses>
  <Devices>
    <Device IndividualAddress="3.1.1" ToolKey="T770+Sebf2zpx3X3A0S64A==" ManagementPassword="6LPLJeu+XxuGpn6tOqt9fw4NuSa/jIQCYXzFVDwPUiU=" Authentication="rywptqDB0/UNF/5VmlTs5YnrIqO9FJ3YGGEIm08Z1UQ=" SequenceNumber="121960556295" />
    <Device IndividualAddress="3.1.10" ToolKey="t8SSY7LxrVgNvXwLqus4Pg==" SequenceNumber="121960675276" />
    <Device IndividualAddress="3.1.11" ToolKey="VMpB+1fIuP4UFaDVQSjNHQ==" SequenceNumber="121960725775" />
  </Devices>
</Keyring>`;

// Set the properties
let knxUltimateClientProperties = {
    ipAddr: "192.168.1.54",
    ipPort: "3671",
    physAddr: "1.1.100",
    suppress_ack_ldatareq: false,
    loglevel: "debug", // or "debug" is the default
    localEchoInTunneling: true, // Leave true, forever.
    hostProtocol: "TunnelTCP", // "Multicast" in case you use a KNX/IP Router, "TunnelUDP" in case of KNX/IP Interface, "TunnelTCP" in case of secure KNX/IP Interface (not yet implemented)
    isSecureKNXEnabled: true, // Leave "false" until KNX-Secure has been released
    KNXEthInterface: "Auto", // Bind to the first avaiable local interfavce. "Manual" if you wish to specify the interface (for example eth1); in this case, set the property interface to the interface name (interface:"eth1")
    localIPAddress: "", // Leave blank, will be automatically filled by KNXUltimate
    jKNXSecureKeyring: "", // This is the unencrypted Keyring file content (see below)
};

async function LoadKeyringFile(_keyring, _password) {
    return KNXsecureKeyring.keyring.load(_keyring, _password);
}

async function go() {

    // Load the Keyring, decrypt it and put it in the jKNXSecureKeyring property.
    // The password "banana" has been used to encrypt the keyring file during export form ETS.
    // Again, see this https://www.youtube.com/watch?v=OpR7ZQTlMRU
    knxUltimateClientProperties.jKNXSecureKeyring = await LoadKeyringFile(rawjKNXSecureKeyring, "banana");


    // Log some infos
    console.log("KNX-Secure: Keyring for ETS proj " + knxUltimateClientProperties.jKNXSecureKeyring.ETSProjectName + ", created by " + knxUltimateClientProperties.jKNXSecureKeyring.ETSCreatedBy + " on " + knxUltimateClientProperties.jKNXSecureKeyring.ETSCreated + " succesfully validated with provided password");

    // Instantiate the client
    var knxUltimateClient = new knx.KNXClient(knxUltimateClientProperties);

    // This contains the decrypted keyring file, accessible to all .js files referencing the "index.js" module.
    console.log(knx.getDecodedKeyring());

    // Setting handlers
    // ######################################
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.indication, handleBusEvents);
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.error, err => {
        // Error event
        console.log("Error", err)
    });
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.ackReceived, (knxMessage, info) => {
        // In -->tunneling mode<-- (in ROUTING mode there is no ACK event), signals wether the last KNX telegram has been acknowledge or not
        // knxMessage: contains the telegram sent.
        // info is true it the last telegram has been acknowledge, otherwise false.
        console.log("Last telegram acknowledge", knxMessage, info)
    });
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.disconnected, info => {
        // The client is cisconnected
        console.log("Disconnected", info)
    });
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.close, info => {
         // The client physical net socket has been closed
        console.log("Closed", info)
    });
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.connected, info => {
        // The client is connected
        console.log("Connected. On Duty", info)
        // Write something to the BUS
        if (knxUltimateClient.clearToSend) knxUltimateClient.write("0/1/1", false, "1.001");
    });
    knxUltimateClient.on(knx.KNXClient.KNXClientEvents.connecting, info => {
        // The client is setting up the connection
        console.log("Connecting...", info)
    });
    // ######################################

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
    }
    console.log("src: " + _src + " dest: " + _dst, " event: " + _evt, " value: " + jsValue);


    }

    knxUltimateClient.Connect();

    // Wait some seconds, just for fun
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    // Disconnects
    if (knxUltimateClient.isConnected()) knxUltimateClient.Disconnect();

}

go();
```

<br/>
<br/>


## SUGGESTION
> Why not to try Node-Red https://nodered.org and the awesome KNX-Ultimate node https://flows.nodered.org/node/node-red-contrib-knx-ultimate ?

<br/>

<img src='https://raw.githubusercontent.com/Supergiovane/knxultimate/master/img/nodered.png' width='90%'>

<br/>
<br/>

![Logo](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/madeinitaly.png)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/Supergiovane/knxultimate/master/LICENSE
[npm-url]: https://npmjs.org/package/knxultimate
[npm-version-image]: https://img.shields.io/npm/v/knxultimate.svg
[npm-downloads-month-image]: https://img.shields.io/npm/dm/knxultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/knxultimate.svg
[youtube-image]: https://img.shields.io/badge/Visit%20me-Youtube-red
[youtube-url]: https://www.youtube.com/channel/UCA9RsLps1IthT7fDSeUbRZw/playlists