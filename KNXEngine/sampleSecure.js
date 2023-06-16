
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
        if (knxUltimateClient._getClearToSend()) knxUltimateClient.write("0/1/1", false, "1.001");
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

    knxUltimateClient.Connect();

    // Wait some seconds, just for fun
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    // Disconnects
    if (knxUltimateClient.isConnected()) knxUltimateClient.Disconnect();

}

go();