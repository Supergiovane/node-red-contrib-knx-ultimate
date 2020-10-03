const knx = require('./../knxultimate-api');
const dptlib = require('./../knxultimate-api/src/dptlib');
const oOS = require('os');

//Helpers
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
    let value = `${baseType.base}.${kv[0]}`
    return {
        value: value
        , text: value + ` ${kv[1].name}`
    }
}

// 06/02/2020 To be tested
// convertSubtype = (baseType) => (kv) => {
//     let value = `${baseType.base}.${kv[0]}`
//     return {
//         value: value
//         , text: value + ` (${kv[1].name}${kv[1].unit !== undefined?" - " + kv[1].unit:""})`
//     }
// }


toConcattedSubtypes = (acc, baseType) => {
    let subtypes =
        Object.entries(baseType.subtypes)
            .sort(sortBy(0))
            .map(convertSubtype(baseType))

    return acc.concat(subtypes)
};


module.exports = (RED) => {


    RED.httpAdmin.get("/knxUltimateDpts", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
        const dpts =
            Object.entries(dptlib)
                .filter(onlyDptKeys)
                .map(extractBaseNo)
                .sort(sortBy("base"))
                .reduce(toConcattedSubtypes, [])

        res.json(dpts)
        // Utilità per visualizzare i datapoints, da copiare in README
        // var stringa = "";
        // for (let index = 0; index < dpts.length; index++) {
        //     const element = dpts[index];
        //     stringa += element.text + "<br/>\n";
        // }
        // RED.log.warn(stringa)
    });

    // 15/09/2020 Supergiovane, read datapoint help usage
    RED.httpAdmin.get("/knxUltimateDptsGetHelp", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
        var sDPT = req.query.dpt.split(".")[0]; // Takes only the main type
        var jRet;
        if (sDPT == "0") { // Special fake datapoint, meaning "Universal Mode"
            jRet = {
                "help":
                    `// KNX-Ultimate set as UNIVERSAL NODE
// Example of a function that sends a message to the KNX-Ultimate
msg.destination = "0/0/1"; // Set the destination 
msg.payload = false; // issues a write or response (based on the options Output Type above) to the KNX bus
msg.event = "GroupValue_Write"; // "GroupValue_Write" or "GroupValue_Response", overrides the option Output Type above.
msg.dpt = "1.001"; // for example "1.001", overrides the Datapoint option. (Datapoints can be sent as 9 , "9" , "9.001" or "DPT9.001")
return msg;`, "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki"
            };
            res.json(jRet);
            return;
        }
        jRet = { "help": "NO", "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki" };
        const dpts =
            Object.entries(dptlib)
                .filter(onlyDptKeys)
        for (let index = 0; index < dpts.length; index++) {
            if (dpts[index][0].toUpperCase() === "DPT" + sDPT) {
                jRet = { "help": (dpts[index][1].basetype.hasOwnProperty("help") ? dpts[index][1].basetype.help : "NO"), "helplink": (dpts[index][1].basetype.hasOwnProperty("helplink") ? dpts[index][1].basetype.helplink : "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki") };
                break;
            }
        }
        res.json(jRet);
    });



    function knxUltimateConfigNode(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.host = config.host
        node.port = config.port
        node.physAddr = config.physAddr || "15.15.22"; // the KNX physical address we'd like to use
        node.suppressACKRequest = typeof config.suppressACKRequest === "undefined" ? false : config.suppressACKRequest; // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
        node.linkStatus = "disconnected";
        node.nodeClients = [] // Stores the registered clients
        node.KNXEthInterface = typeof config.KNXEthInterface === "undefined" ? "Auto" : config.KNXEthInterface;
        node.KNXEthInterfaceManuallyInput = typeof config.KNXEthInterfaceManuallyInput === "undefined" ? "" : config.KNXEthInterfaceManuallyInput; // If you manually set the interface name, it will be wrote here
        node.statusDisplayLastUpdate = typeof config.statusDisplayLastUpdate === "undefined" ? true : config.statusDisplayLastUpdate;
        node.statusDisplayDeviceNameWhenALL = typeof config.statusDisplayDeviceNameWhenALL === "undefined" ? false : config.statusDisplayDeviceNameWhenALL;
        node.statusDisplayDataPoint = typeof config.statusDisplayDataPoint === "undefined" ? false : config.statusDisplayDataPoint;
        node.telegramsQueue = [];  // 02/01/2020 Queue containing telegrams 
        node.timerSendTelegramFromQueue = setInterval(handleTelegramQueue, (typeof config.delaybetweentelegrams === "undefined" || config.delaybetweentelegrams < 5) ? 40 : config.delaybetweentelegrams); // 02/01/2020 Start the timer that handles the queue of telegrams
        node.delaybetweentelegramsfurtherdelayREAD = (typeof config.delaybetweentelegramsfurtherdelayREAD === "undefined" || config.delaybetweentelegramsfurtherdelayREAD < 1) ? 1 : config.delaybetweentelegramsfurtherdelayREAD; // 18/05/2020 delay multiplicator only for "read" telegrams.
        node.delaybetweentelegramsREADCount = 0;// 18/05/2020 delay multiplicator only for "read" telegrams.
        node.timerDoInitialRead = null; // 17/02/2020 Timer (timeout) to do initial read of all nodes requesting initial read, after all nodes have been registered to the sercer
        node.stopETSImportIfNoDatapoint = typeof config.stopETSImportIfNoDatapoint === "undefined" ? "stop" : config.stopETSImportIfNoDatapoint; // 09/01/2020 Stop, Import Fake or Skip the import if a group address has unset datapoint
        node.csv = readCSV(config.csv); // Array from ETS CSV Group Addresses {ga:group address, dpt: datapoint, devicename: full device name with main and subgroups}
        node.loglevel = config.loglevel !== undefined ? config.loglevel : "error"; // 18/02/2020 Loglevel default error
        node.localEchoInTunneling = typeof config.localEchoInTunneling !== "undefined" ? config.localEchoInTunneling : true;

        // 29/07/2020 Create YAML for Homeassistant
        // node.yamlHomeAssistant = CreateYamlForHomeAssistant();

        // Endpoint for reading csv from the other nodes
        RED.httpAdmin.get("/knxUltimatecsv", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
            if (typeof req.query.nodeID !== "undefined" && req.query.nodeID !== null && req.query.nodeID !== "") {
                var _node = RED.nodes.getNode(req.query.nodeID);// Retrieve node.id of the config node.
                if (_node !== null) res.json(RED.nodes.getNode(_node.id).csv);
            } else {
                // Get the first knxultimate-config having a valid csv
                try {
                    RED.log.info("knxUltimate-config: Requested csv maybe from visu-ultimate?");
                    RED.nodes.eachNode(function (_node) {
                        if (_node.hasOwnProperty("csv") && _node.type == "knxUltimate-config" && _node.csv !== "") {
                            res.json(RED.nodes.getNode(_node.id).csv);
                            return;
                        }
                    });
                } catch (error) { }
            }
        });

        // 14/08/2019 Endpoint for retrieving the ethernet interfaces
        RED.httpAdmin.get("/knxUltimateETHInterfaces", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
            var oiFaces = oOS.networkInterfaces();
            var jListInterfaces = [];
            try {
                Object.keys(oiFaces).forEach(ifname => {
                    // Interface with single IP
                    if (Object.keys(oiFaces[ifname]).length === 1) {
                        if (Object.keys(oiFaces[ifname])[0].internal == false) jListInterfaces.push({ name: ifname, address: Object.keys(oiFaces[ifname])[0].address });
                    } else {
                        var sAddresses = "";
                        oiFaces[ifname].forEach(function (iface) {
                            if (iface.internal == false) sAddresses += "+" + iface.address;
                        });
                        if (sAddresses !== "") jListInterfaces.push({ name: ifname, address: sAddresses });
                    }
                })
            } catch (error) { }
            res.json(jListInterfaces)
        });

        // 14/02/2020 Endpoint for retrieving all nodes in all flows
        RED.httpAdmin.get("/nodeList", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
            var sNodeID = req.query.nodeID; // Retrieve node.id of the config node.
            var _node = RED.nodes.getNode(sNodeID);
            if (_node === null) {
                // 27/09/2020 Something wrong
                return;
            }
            var sNodes = "\"Group Address\"\t\"Datapoint\"\t\"Node ID\"\t\"Device Name\"\n"; // Contains the text with nodes
            var sGA = "";
            var sDPT = "";
            var sName = "";
            var sNodeID = "";
            try {
                RED.log.info("KNXUltimate-config: Total knx-ultimate nodes: " + _node.nodeClients.length || 0);
                _node.nodeClients
                    //.map( a => a.topic.indexOf("/") !== -1 ? a.topic.split('/').map( n => +n+100000 ).join('/'):0 ).sort().map( a => a.topic.indexOf("/") !== -1 ? a.topic.split('/').map( n => +n-100000 ).join('/'):0 )
                    .sort((a, b) => {
                        if (typeof a.topic !== "undefined" && b.topic !== "undefined") {
                            if (a.topic.indexOf("/") === -1) return -1;
                            if (b.topic.indexOf("/") === -1) return -1;
                            var date1 = a.topic.split("/");
                            var date2 = b.topic.split("/");
                            date1 = date1[0].padStart(2, "0") + date1[1].padStart(2, "0") + date1[2].padStart(2, "0");
                            date2 = date2[0].padStart(2, "0") + date2[1].padStart(2, "0") + date2[2].padStart(2, "0");
                            return date1.localeCompare(date2);
                        } else { return -1; }
                    })
                    .forEach(input => {
                        sNodeID = "\"" + input.id + "\"";
                        sName = "\"" + (typeof input.name !== "undefined" ? input.name : "") + "\"";
                        if (input.listenallga == true) {
                            if (input.hasOwnProperty("isSceneController")) {
                                // Is a Scene Controller
                                sGA = "\"Scene Controller\"";
                                sDPT = "\"Any\"";
                            } else if (input.hasOwnProperty("isLogger")) {
                                // Is a Scene Controller
                                sGA = "\"Logger\"";
                                sDPT = "\"Any\"";
                            } else {
                                // Is a ListenallGA
                                sGA = "\"Universal Node\"";
                                sDPT = "\"Any\"";
                            }

                        } else {
                            sGA = "\"" + (typeof input.topic !== "undefined" ? input.topic : "") + "\"";
                            sDPT = "\"" + (typeof input.dpt !== "undefined" ? input.dpt : "") + "\"";
                            if (input.hasOwnProperty("isWatchDog")) {
                                // Is a watchdog node

                            } else {
                                // Is a device node

                            };
                        };
                        sNodes += sGA + "\t" + sDPT + "\t" + sNodeID + "\t" + sName + "\n";
                    });
                res.json(sNodes)
            } catch (error) {
                RED.log.warn("D " + error)
            }
        });

        node.setAllClientsStatus = (_status, _color, _text) => {
            function nextStatus(oClient) {
                oClient.setNodeStatus({ fill: _color, shape: "dot", text: _status + " " + _text, payload: "", GA: oClient.topic, dpt: "", devicename: "" })
            }
            node.nodeClients.map(nextStatus);
        }

        // 16/02/2020 KNX-Ultimate nodes calls this function, then this funcion calls the same function on the Watchdog
        node.reportToWatchdogCalledByKNXUltimateNode = (_oError) => {
            var readHistory = [];
            let delay = 0;
            node.nodeClients
                .filter(oClient => (oClient.isWatchDog !== undefined && oClient.isWatchDog === true))
                .forEach(oClient => {
                    oClient.signalNodeErrorCalledByConfigNode(_oError);
                })
        }

        node.Disconnect = () => {
            if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead); // 17/02/2020 Stop the initial read timer
            node.telegramsQueue = []; // 02/01/2020 clear the telegram queue
            node.setAllClientsStatus("Waiting", "grey", "")
            // Remove listener
            try {
                node.knxConnection.removeListener("event");
            } catch (error) {

            }
            try {
                node.knxConnection.off("event");
            } catch (error) {

            }
            node.linkStatus = "disconnected"; // 29/08/2019 signal disconnection
            try {
                node.knxConnection.Disconnect();
            } catch (error) {
            }
            node.knxConnection = null;
        }


        node.addClient = (_Node) => {
            // Check if node already exists
            if (node.nodeClients.filter(x => x.id === _Node.id).length === 0) {
                // Check if the node has a valid topic and dpt
                if (_Node.listenallga == false) {
                    if (typeof _Node.topic == "undefined" || typeof _Node.dpt == "undefined") {
                        _Node.setNodeStatus({ fill: "red", shape: "dot", text: "Empty Group Addr. or datapoint.", payload: "", GA: "", dpt: "", devicename: "" })
                        return;
                    } else {
                        // topic must be in formar x/x/x
                        if (_Node.topic.split("\/").length < 3) {
                            _Node.setNodeStatus({ fill: "red", shape: "dot", text: "Wrong group address (topic: " + _Node.topic + ") format.", payload: "", GA: "", dpt: "", devicename: "" })
                            return;
                        }
                    }
                }
                // Add _Node to the clients array
                node.nodeClients.push(_Node)
            }
            // At first node client connection, this node connects to the bus
            if (node.nodeClients.length === 1) {
                // 14/08/2018 Initialize the connection
                try {
                    node.initKNXConnection();
                } catch (error) {

                }
            }
        }

        node.removeClient = (_Node) => {
            // Remove the client node from the clients array
            //RED.log.info( "BEFORE Node " + _Node.id + " has been unsubscribed from receiving KNX messages. " + node.nodeClients.length);
            try {
                node.nodeClients = node.nodeClients.filter(x => x.id !== _Node.id)
            } catch (error) { }
            //RED.log.info("AFTER Node " + _Node.id + " has been unsubscribed from receiving KNX messages. " + node.nodeClients.length);

            // If no clien nodes, disconnect from bus.
            if (node.nodeClients.length === 0) {
                node.Disconnect();
            }
        }


        // 17/02/2020 Do initial read (called by node.timerDoInitialRead timer)
        function readInitialValues() {
            if (node.linkStatus !== "connected") return; // 29/08/2019 If not connected, exit
            RED.log.info("KNXUltimate-config: Do readInitialValues");
            if (node.knxConnection) {
                var readHistory = [];
                node.nodeClients
                    .filter(oClient => oClient.initialread)
                    .filter(oClient => oClient.hasOwnProperty("isWatchDog") === false)
                    .forEach(oClient => {
                        if (oClient.listenallga == true) {
                            for (let index = 0; index < node.csv.length; index++) {
                                const element = node.csv[index];
                                if (readHistory.includes(element.ga)) return;
                                node.writeQueueAdd({ grpaddr: element.ga, payload: "", dpt: "", outputtype: "read", nodecallerid: element.id });
                                readHistory.push(element.ga)
                            }
                        } else {
                            if (readHistory.includes(oClient.topic)) return;
                            node.writeQueueAdd({ grpaddr: oClient.topic, payload: "", dpt: "", outputtype: "read", nodecallerid: oClient.id });
                            readHistory.push(oClient.topic)
                        }
                    })
            }
        }


        // 01/02/2020 Dinamic change of the KNX Gateway IP, Port and Physical Address
        // This new thing has been requested by proServ RealKNX staff.
        node.setGatewayConfig = (_sIP, _iPort, _sPhysicalAddress, _sBindToEthernetInterface) => {
            if (typeof _sIP !== "undefined" && _sIP !== "") node.host = _sIP;
            if (typeof _iPort !== "undefined" && _iPort !== 0) node.port = _iPort;
            if (typeof _sPhysicalAddress !== "undefined" && _sPhysicalAddress !== "") node.physAddr = _sPhysicalAddress;
            if (typeof _sBindToEthernetInterface !== "undefined") node.KNXEthInterface = _sBindToEthernetInterface;
            RED.log.info("Node's main config setting has been changed. New config: IP " + node.host + " Port " + node.port + " PhysicalAddress " + node.physAddr + " BindToInterface " + node.KNXEthInterface);
            if (node.knxConnection) {
                try {
                    node.Disconnect();
                    if (node.tempDiscoTimer !== null) clearTimeout(node.tempDiscoTimer)
                    node.tempDiscoTimer = setTimeout(() => {
                        setTimeout(() => node.setAllClientsStatus("CONFIG", "yellow", "Node's main config setting has been changed."), 1000);
                        setTimeout(() => node.setAllClientsStatus("CONFIG", "yellow", "New config: IP " + node.host + " Port " + node.port + " PhysicalAddress " + node.physAddr + " BindToInterface " + node.KNXEthInterface), 2000)
                        node.initKNXConnection();
                    }, 5000);
                } catch (error) { }
            };
        };

        node.initKNXConnection = () => {
            node.Disconnect();
            node.setAllClientsStatus("Waiting", "grey", "")

            var knxConnectionProperties = {
                ipAddr: node.host,
                ipPort: node.port,
                physAddr: node.physAddr, // the KNX physical address we'd like to use
                suppress_ack_ldatareq: node.suppressACKRequest,
                loglevel: node.loglevel,
                localEchoInTunneling: node.localEchoInTunneling, // 14/03/2020 local echo in tunneling mode (see API Supergiovane)
                // wait at least 60 millisec between each datagram
                //minimumDelay: 60, // 02/01/2020 Removed becuse it doesn't respect the message sequence, it sends messages random.
                handlers: {
                    connected: () => {
                        node.telegramsQueue = []; // 01/10/2020 Supergiovane: clear the telegram queue
                        node.linkStatus = "connected";
                        node.setAllClientsStatus("Connected", "green", "Waiting for telegram.")
                        // Start the timer to do initial read.
                        if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
                        node.timerDoInitialRead = setTimeout(readInitialValues, 5000); // 17/02/2020 Do initial read of all nodes requesting initial read, after all nodes have been registered to the sercer
                    },
                    disconnected: function () {
                        node.setAllClientsStatus("Disconnected", "grey", "");
                        node.linkStatus = "disconnected";
                    },
                    error: function (connstatus) {
                        // Coming from api requestingConnState: {
                        // NO_ERROR: 0x00, // E_NO_ERROR - The connection was established succesfully
                        // E_HOST_PROTOCOL_TYPE: 0x01,
                        // E_VERSION_NOT_SUPPORTED: 0x02,
                        // E_SEQUENCE_NUMBER: 0x04,
                        // E_CONNSTATE_LOST: 0x15, // typo in eibd/libserver/eibnetserver.cpp:394, forgot 0x prefix ??? "uchar res = 21;"
                        // E_CONNECTION_ID: 0x21, // - The KNXnet/IP server device could not find an active data connection with the given ID
                        // E_CONNECTION_TYPE: 0x22, // - The requested connection type is not supported by the KNXnet/IP server device
                        // E_CONNECTION_OPTION: 0x23, // - The requested connection options is not supported by the KNXnet/IP server device
                        // E_NO_MORE_CONNECTIONS: 0x24, //  - The KNXnet/IP server could not accept the new data connection (Maximum reached)
                        // E_DATA_CONNECTION: 0x26,// - The KNXnet/IP server device detected an erro concerning the Dat connection with the given ID
                        // E_KNX_CONNECTION: 0x27,  // - The KNXnet/IP server device detected an error concerning the KNX Bus with the given ID
                        // E_TUNNELING_LAYER: 0x29,
                        //node.linkStatus = "disconnected"; 01/10/2020 Removed.
                        
                        if (connstatus == "E_KNX_CONNECTION") {
                            setTimeout(() => node.setAllClientsStatus(connstatus, "grey", "Error on KNX BUS. Check KNX red/black connector and cable."), 1000)
                            RED.log.error("knxUltimate-config: Bind KNX Bus to interface error: " + connstatus);
                        } else if (connstatus == "E_NO_MORE_CONNECTIONS") {
                            setTimeout(() => node.setAllClientsStatus(connstatus, "grey", "Error on KNX BUS. No more avaiable tunnels."), 1000);
                            RED.log.error("knxUltimate-config: Error on KNX BUS. No more avaiable tunnels: " + connstatus);
                        } else if (connstatus == "timed out waiting for CONNECTIONSTATE_RESPONSE") {
                            // The KNX/IP Interface is not responding to connection state request.
                            // It can be normal, if it's not strictly adhering to knx standards.
                            RED.log.warn("knxUltimate-config: knxConnection warning: " + connstatus);
                        } else if (connstatus == "E_CONNECTION_ID") {
                            //RED.log.warn("BANANA RED :" +  connstatus);
                       
                        } else {
                            setTimeout(() => node.setAllClientsStatus(connstatus, "grey", "Error"), 2000)
                            RED.log.error("knxUltimate-config: knxConnection error: " + connstatus);
                        }
                        
                    },
                    // get notified for all KNX events:
                    event: function (evt, src, dest, rawValue, cemiETS) {
                        handleBusEvents(evt, src, dest, rawValue, cemiETS);
                    }
                }
            };

            if (node.KNXEthInterface !== "Auto") {
                var sIfaceName = "";
                if (node.KNXEthInterface === "Manual") {
                    sIfaceName = node.KNXEthInterfaceManuallyInput;
                    RED.log.info("KNXUltimate-config: Bind KNX Bus to interface : " + sIfaceName + " (Interface's name entered by hand). Node " + node.name);
                } else {
                    sIfaceName = node.KNXEthInterface;
                    RED.log.info("KNXUltimate-config: Bind KNX Bus to interface : " + sIfaceName + " (Interface's name selected from dropdown list). Node " + node.name);
                }
                knxConnectionProperties.interface = sIfaceName;
            } else {
                RED.log.info("KNXUltimate-config: Bind KNX Bus to interface (Auto). Node " + node.name);
            }
            try {
                node.knxConnection = knx.Connection(knxConnectionProperties);
            } catch (error) {
                RED.log.error("KNXUltimate-config: Error in instantiating knxConnection " + error + ". Node " + node.name);
                node.linkStatus = "disconnected";
                setTimeout(() => node.setAllClientsStatus("Error in instantiating knxConnection " + error, "red", "Error"), 1000);
                if (node.timerRiavviaDopoInstanziazione != null) clearTimeout(node.timerRiavviaDopoInstanziazione);
                // 20/04/2020 Retry
                node.timerRiavviaDopoInstanziazione = setTimeout(() => {
                    node.setAllClientsStatus("Trying again to connect..", "grey", "");
                    try {
                        node.initKNXConnection();
                    } catch (error) {
                    }
                }, 5000);
            }
        };
        // Handle BUS events
        // ---------------------------------------------------------------------------------------
        function handleBusEvents(evt, src, dest, rawValue, cemiETS) {
            switch (evt) {
                case "GroupValue_Write": {
                    node.linkStatus = "connected"; // 01/10/2020 The connection must be alive, if womething comes from the bus!
                    node.nodeClients
                        .filter(input => input.notifywrite == true)
                        .forEach(input => {

                            // 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
                            if (input.hasOwnProperty("isSceneController")) {

                                // 12/08/2020 Check wether is a learn (save) command or a activate (play) command.
                                if (dest === input.topic || dest === input.topicSave) {
                                   
                                    // Prepare the two messages to be evaluated directly into the Scene Controller node.
                                    new Promise((resolve, reject) => {
                                        if (dest === input.topic) {
                                            try {
                                                let msgRecall = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: null });
                                                input.RecallScene(msgRecall.payload, false);
                                            } catch (error) { }
                                        } // 12/08/2020 Do NOT use "else", because both topics must be evaluated in case both recall and save have same group address.
                                        if (dest === input.topicSave) {
                                            try {
                                                let msgSave = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: input.dptSave, _devicename: input.name ? input.name : "", _outputtopic: dest, _oNode: null });
                                                input.SaveScene(msgSave.payload, false);
                                            } catch (error) { }
                                        }
                                        resolve(true); // fulfilled
                                        //reject("error"); // rejected
                                    }).then(function () { }).catch(function () { });

                                } else {

                                    // 19/03/2020 Check and Update value if the input is part of a scene controller
                                    new Promise((resolve, reject) => {
                                        // Check and update the values of each device in the scene and update the rule array accordingly.
                                        for (var i = 0; i < input.rules.length; i++) {
                                            // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                                            var oDevice = input.rules[i];
                                            if (typeof oDevice !== "undefined" && oDevice.topic == dest) {
                                                let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: oDevice.dpt, _devicename: oDevice.name ? input.name : "", _outputtopic: oDevice.outputtopic, _oNode: null })
                                                oDevice.currentPayload = msg.payload;
                                                input.setNodeStatus({ fill: "grey", shape: "dot", text: "Update dev in scene", payload: oDevice.currentPayload, GA: oDevice.topic, dpt: oDevice.dpt, devicename: oDevice.devicename || "" });
                                                break;
                                            }
                                        }
                                        resolve(true); // fulfilled
                                        //reject("error"); // rejected
                                    }).then(function () { }).catch(function () { });

                                }

                            } else if (input.hasOwnProperty("isLogger")) { // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node

                                // 26/03/2020 Logger Node, i'll pass everythings
                                new Promise((resolve, reject) => {
                                    // Get the GA from CVS
                                    let oGA;
                                    try {
                                        oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                    } catch (error) { }
                                    // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                    msg.knx.cemiETS = cemiETS; // Adding CEMI ETS string
                                    input.handleSend(msg);
                                    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                }).then(function () { }).catch(function () { });

                            } else if (input.listenallga == true) {

                                // Get the GA from CVS
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                } catch (error) { }
                                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                input.setNodeStatus({ fill: "green", shape: "dot", text: (typeof oGA === "undefined") ? "Try to decode" : "", payload: msg.payload, GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg);

                            } else if (input.topic == dest) {

                                if (input.hasOwnProperty("isWatchDog")) { // 04/02/2020 Watchdog implementation
                                    // Is a watchdog node

                                } else {
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
                                    // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                                    if (!checkRBEInputFromKNXBusAllowSend(input, msg.payload)) {
                                        input.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block (" + msg.payload + ") from KNX", payload: "", GA: "", dpt: "", devicename: "" })
                                        return;
                                    };
                                    msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Added previous payload
                                    input.currentPayload = msg.payload;// Set the current value for the RBE input
                                    input.setNodeStatus({ fill: "green", shape: "dot", text: "", payload: msg.payload, GA: input.topic, dpt: input.dpt, devicename: "" });
                                    input.handleSend(msg);
                                };
                            };
                        });
                    break;
                };
                case "GroupValue_Response": {

                    node.nodeClients
                        .filter(input => input.notifyresponse == true)
                        .forEach(input => {

                            if (input.hasOwnProperty("isLogger")) { // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node

                                // 26/03/2020 Logger Node, i'll pass everythings
                                new Promise((resolve, reject) => {
                                    // Get the GA from CVS
                                    let oGA;
                                    try {
                                        oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                    } catch (error) { }
                                    // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                    msg.knx.cemiETS = cemiETS; // Adding CEMI ETS string
                                    input.handleSend(msg);
                                    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                }).then(function () { }).catch(function () { });

                            } else if (input.listenallga == true) {
                                // Get the DPT
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                } catch (error) { }

                                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                input.setNodeStatus({ fill: "green", shape: "dot", text: (typeof oGA === "undefined") ? "Try to decode" : "", payload: msg.payload, GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg)

                            } else if (input.topic == dest) {
                                // 04/02/2020 Watchdog implementation
                                if (input.hasOwnProperty("isWatchDog")) {
                                    // Is a watchdog node
                                    input.watchDogTimerReset();
                                } else {
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
                                    // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                                    if (!checkRBEInputFromKNXBusAllowSend(input, msg.payload)) {
                                        input.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe INPUT filter applied on " + msg.payload })
                                        return;
                                    };
                                    msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Added previous payload
                                    input.currentPayload = msg.payload; // Set the current value for the RBE input
                                    input.setNodeStatus({ fill: "blue", shape: "dot", text: "", payload: msg.payload, GA: input.topic, dpt: msg.knx.dpt, devicename: msg.devicename });
                                    input.handleSend(msg)
                                };
                            };
                        });
                    break;
                };
                case "GroupValue_Read": {

                    node.nodeClients
                        .filter(input => input.notifyreadrequest == true)
                        .forEach(input => {

                            if (input.hasOwnProperty("isLogger")) { // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node

                                // 26/03/2020 Logger Node, i'll pass everythings
                                new Promise((resolve, reject) => {
                                    // Get the GA from CVS
                                    let oGA;
                                    try {
                                        oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                    } catch (error) { }
                                    // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                    msg.knx.cemiETS = cemiETS; // Adding CEMI ETS string
                                    input.handleSend(msg);
                                    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                }).then(function () { }).catch(function () { });

                            } else if (input.listenallga == true) {
                                // Get the DPT
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == dest)[0];
                                } catch (error) { }

                                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: null, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: dest, _oNode: input });
                                input.setNodeStatus({ fill: "grey", shape: "dot", text: "Read", payload: "", GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg)

                            } else if (input.topic == dest) {

                                // 04/02/2020 Watchdog implementation
                                if (input.hasOwnProperty("isWatchDog")) {
                                    // Is a watchdog node

                                } else {
                                    let msg = buildInputMessage({ _srcGA: src, _destGA: dest, _event: evt, _Rawvalue: null, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
                                    msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Reset previous payload
                                    // 24/09/2019 Autorespond to BUS
                                    if (input.notifyreadrequestalsorespondtobus === true) {
                                        if (typeof input.currentPayload === "undefined" || input.currentPayload === "") {
                                            setTimeout(() => {
                                                node.knxConnection.respond(dest, input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized, input.dpt);
                                                input.setNodeStatus({ fill: "blue", shape: "ring", text: "Read & Autorespond with default", payload: input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized, GA: input.topic, dpt: msg.knx.dpt, devicename: "" });
                                            }, 200);
                                        } else {
                                            setTimeout(() => {
                                                node.knxConnection.respond(dest, input.currentPayload, input.dpt);
                                                input.setNodeStatus({ fill: "blue", shape: "ring", text: "Read & Autorespond", payload: input.currentPayload, GA: input.topic, dpt: msg.knx.dpt, devicename: "" });
                                            }, 200);
                                        };
                                    } else {
                                        input.setNodeStatus({ fill: "grey", shape: "dot", text: "Read", payload: msg.payload, GA: input.topic, dpt: msg.knx.dpt, devicename: "" });
                                    };
                                    input.handleSend(msg);
                                };
                            };
                        });
                    break;
                };
                default: return
            };
        };
        // END Handle BUS events---------------------------------------------------------------------------------------


        // 02/01/2020 All sent messages are queued, to allow at least 50 milliseconds between each telegram sent to the bus
        node.writeQueueAdd = _oKNXMessage => {
            if (node.linkStatus !== "connected") return;
            // _oKNXMessage is { grpaddr, payload,dpt,outputtype (write or response),nodecallerid (id of the node sending adding the telegram to the queue)}
            node.telegramsQueue.unshift(_oKNXMessage); // Add _oKNXMessage as first in the queue pile
        }

        function handleTelegramQueue() {

            if (node.knxConnection) {

                if (typeof node.lockHandleTelegramQueue !== "undefined" && node.lockHandleTelegramQueue === true) return; // Exits if the funtion is busy
                node.lockHandleTelegramQueue = true; // Lock the function. It cannot be called again until finished.

                // Retrieving oKNXMessage  { grpaddr, payload,dpt,outputtype (write or response),nodecallerid (node caller)}. 06/03/2020 "Read" request does have the lower priority in the queue, so firstly, i search for "read" telegrams and i move it on the top of the queue pile.
                var aTelegramsFiltered = [];
                aTelegramsFiltered = node.telegramsQueue.filter(a => a.outputtype !== "read");

                if (aTelegramsFiltered.length == 0) {
                    // There are no write nor response telegrams, handle the remaining "read", if any
                    if (node.delaybetweentelegramsREADCount >= node.delaybetweentelegramsfurtherdelayREAD) { // 18/05/2020 delay multiplicator only for "read" telegrams.
                        node.delaybetweentelegramsREADCount = 0;
                        aTelegramsFiltered = node.telegramsQueue;
                    } else { node.delaybetweentelegramsREADCount += 1 }
                }
                if (aTelegramsFiltered.length == 0) {
                    node.lockHandleTelegramQueue = false; // Unlock the function
                    return;
                }

                var oKNXMessage = aTelegramsFiltered[aTelegramsFiltered.length - 1]; // Get the last message in the queue
                if (oKNXMessage.outputtype === "response") {
                    try {
                        node.knxConnection.respond(oKNXMessage.grpaddr, oKNXMessage.payload, oKNXMessage.dpt);
                    } catch (error) {
                        try {
                            node.nodeClients.find(a => a.id === oKNXMessage.nodecallerid).setNodeStatus({ fill: "red", shape: "dot", text: "Send response " + error, payload: oKNXMessage.payload, GA: oKNXMessage.grpaddr, dpt: oKNXMessage.dpt, devicename: "" })
                        } catch (error) { }
                    }
                } else if (oKNXMessage.outputtype === "read") {
                    try {
                        node.knxConnection.read(oKNXMessage.grpaddr);
                    } catch (error) { }
                } else {
                    try {
                        node.knxConnection.write(oKNXMessage.grpaddr, oKNXMessage.payload, oKNXMessage.dpt);
                    } catch (error) {
                        try {
                            node.nodeClients.find(a => a.id === oKNXMessage.nodecallerid).setNodeStatus({ fill: "red", shape: "dot", text: "Send write " + error, payload: oKNXMessage.payload, GA: oKNXMessage.grpaddr, dpt: oKNXMessage.dpt, devicename: "" })
                        } catch (error) { }
                    }
                }
                // Remove current item in the main node.telegramsQueue array
                try {
                    node.telegramsQueue = node.telegramsQueue.filter(item => {
                        if (item !== oKNXMessage) {
                            return item;
                        }
                    });
                } catch (error) { }
                node.lockHandleTelegramQueue = false; // Unlock the function
            }
        }

        // 14/08/2019 If the node has payload same as the received telegram, return false
        checkRBEInputFromKNXBusAllowSend = (_node, _KNXTelegramPayload) => {
            if (_node.inputRBE !== true) return true;
            if (typeof _node.currentPayload === "undefined") return true;
            var curVal = _node.currentPayload.toString().toLowerCase();
            var newVal = _KNXTelegramPayload.toString().toLowerCase();
            if (curVal === "false") {
                curVal = "0";
            }
            if (curVal === "true") {
                curVal = "1";
            }
            if (newVal === "false") {
                newVal = "0";
            }
            if (newVal === "true") {
                newVal = "1";
            }
            if (curVal === newVal) {
                return false;
            }
            return true;
        }

        // 26/10/2019 Try to figure out the datapoint type from raw value
        function tryToFigureOutDataPointFromRawValue(_rawValue) {
            // 25/10/2019 Try some Datapoints
            if (_rawValue === null) return "1.001";
            if (_rawValue.length == 1) {
                if (_rawValue[0].toString() == "0" || _rawValue[0].toString() == "1") {
                    return "1.001"; // True/False?
                } else {
                    return "5.001"; // Absolute Brightness ?
                }
            } else if (_rawValue.length == 4) {
                return "14.056"; // Watt ?
            } else if (_rawValue.length == 2) {
                return "9.001";
            } else if (_rawValue.length == 14) {
                return "16.001"; // Text ?
            } else {
                // Dont' know, try until no errors
                let dpts =
                    Object.entries(dptlib)
                        .filter(onlyDptKeys)
                        .map(extractBaseNo)
                        .sort(sortBy("base"))
                        .reduce(toConcattedSubtypes, []);
                for (let index = 0; index < dpts.length; index++) {
                    const element = dpts[index];
                    try {
                        //dpt.value)
                        //dpt.text))
                        var dpt = dptlib.resolve(element.value);
                        if (typeof dpt !== "undefined") {
                            var jsValue = dptlib.fromBuffer(_rawValue, dpt)
                            if (typeof jsValue !== "undefined") {
                                //RED.log.info("Trying for " + dest + ". FOUND " + element.value);
                                return element.value;
                            }
                        }
                    } catch (error) {

                    }
                }
            }
        }

        function buildInputMessage({ _srcGA, _destGA, _event, _Rawvalue, _inputDpt, _devicename, _outputtopic, _oNode }) {
            var sPayloadmeasureunit = "unknown";
            var sDptdesc = "unknown";
            var sPayloadsubtypevalue = "unknown";
            var jsValue = null;

            // Resolve DPT and convert value if available
            if (_Rawvalue !== null) {
                sInputDpt = (_inputDpt === null) ? tryToFigureOutDataPointFromRawValue(_Rawvalue) : _inputDpt;
                var dpt = dptlib.resolve(sInputDpt);
                if (dpt && _Rawvalue !== null) {
                    var jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
                }

                // Formatting the msg output value
                if (_oNode !== null && jsValue !== null) {
                    if (typeof jsValue === "number") {
                        // multiplier
                        jsValue = jsValue * _oNode.formatmultiplyvalue;
                        // Number of decimals
                        if (_oNode.formatdecimalsvalue == 999) {
                            // Leave as is
                        } else {
                            // Round
                            jsValue = +(Math.round(jsValue + "e+" + _oNode.formatdecimalsvalue) + "e-" + _oNode.formatdecimalsvalue);
                        }
                        // leave, zero or abs
                        if (jsValue < 0) {
                            if (_oNode.formatnegativevalue == "zero") {
                                jsValue = 0;
                            } else if (_oNode.formatnegativevalue == "abs") {
                                jsValue = Math.abs(jsValue);
                            }
                        }
                    }
                }

                if (dpt.subtype !== undefined) {
                    sPayloadmeasureunit = dpt.subtype.unit !== undefined ? dpt.subtype.unit : "unknown";
                    sDptdesc = dpt.subtype.desc !== undefined ? dpt.subtype.desc.charAt(0).toUpperCase() + dpt.subtype.desc.slice(1) : "unknown";
                    if (dpt.subtype.enc !== undefined) {
                        try {
                            if (!Boolean(jsValue)) sPayloadsubtypevalue = dpt.subtype.enc[0];
                            if (Boolean(jsValue)) sPayloadsubtypevalue = dpt.subtype.enc[1];
                        } catch (error) {
                        }
                    }
                };
            }

            // Build final input message object
            return {
                topic: _outputtopic
                , payload: jsValue
                , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
                , payloadmeasureunit: sPayloadmeasureunit
                , payloadsubtypevalue: sPayloadsubtypevalue
                , knx:
                {
                    event: _event
                    , dpt: sInputDpt
                    //, details: dpt
                    , dptdesc: sDptdesc
                    , source: _srcGA
                    , destination: _destGA
                    , rawValue: _Rawvalue
                }
            };
        };


        node.on("close", function () {
            if (node.timerSendTelegramFromQueue !== undefined) clearInterval(node.timerSendTelegramFromQueue); // 02/01/2020 Stop queue timer
            node.Disconnect();
        })

        function readCSV(_csvText) {
            // 24/02/2020, in the middle of Coronavirus emergency in Italy. Check if it a CSV ETS Export of group addresses, or if it's an EFS
            if (_csvText.split("\n")[0].toUpperCase().indexOf("\"") == -1) return readESF(_csvText);

            var ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red

            if (_csvText == "") {
                RED.log.info('KNXUltimate-config: no csv ETS found');
                return;
            } else {
                RED.log.info('KNXUltimate-config: csv ETS found !');
                // 23/08/2019 Delete inwanted CRLF in the GA description
                let sTemp = correctCRLFInCSV(_csvText);

                // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
                let fileGA = sTemp.split("\n");
                // Controllo se le righe dei gruppi contengono il separatore di tabulazione
                if (fileGA[0].search("\t") == -1) {
                    RED.log.error('KNXUltimate-config: ERROR: the csv ETS file must have the tabulation as separator')
                    return;
                }

                var sFirstGroupName = "";
                var sSecondGroupName = "";
                var sFather = "";
                for (let index = 0; index < fileGA.length; index++) {
                    var element = fileGA[index];
                    element = element.replace(/\"/g, ""); // Rimuovo le virgolette
                    element = element.replace(/\#/g, ""); // Rimuovo evetuali #

                    if (element !== "") {

                        // Main and secondary group names
                        if ((element.split("\t")[1].match(/-/g) || []).length == 2) {
                            // Found main group family name (Example Light Actuators)
                            sFirstGroupName = element.split("\t")[0] || "";
                            sSecondGroupName = "";
                        }
                        if ((element.split("\t")[1].match(/-/g) || []).length == 1) {
                            // Found second group family name (Example First Floor light)
                            sSecondGroupName = element.split("\t")[0] || "";
                        }
                        if (sFirstGroupName !== "" && sSecondGroupName !== "") { sFather = "(" + sFirstGroupName + "->" + sSecondGroupName + ") " }

                        if (element.split("\t")[1].search("-") == -1 && element.split("\t")[1].search("/") !== -1) {
                            // Ho trovato una riga contenente un GA valido, cioè con 2 "/"
                            if (element.split("\t")[5] == "") {
                                if (node.stopETSImportIfNoDatapoint === "stop") {
                                    RED.log.error("KNXUltimate-config: ABORT IMPORT OF ETS CSV FILE. To skip the invalid datapoint and continue import, change the related setting, located in the config node in the ETS import section.");
                                    return;
                                } if (node.stopETSImportIfNoDatapoint === "fake") {
                                    // 02/03/2020 Whould you like to continue without datapoint? Good. Here a totally fake datapoint
                                    RED.log.warn("KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to continue import with a fake datapoint 1.001. -> " + element.split("\t")[0] + " " + element.split("\t")[1]);
                                    ajsonOutput.push({ ga: element.split("\t")[1], dpt: "1.001", devicename: sFather + element.split("\t")[0] + " (DPT NOT SET IN ETS - FAKE DPT USED)" });
                                } else {
                                    // 31/03/2020 Skip import
                                    RED.log.warn("KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to skip -> " + element.split("\t")[0] + " " + element.split("\t")[1]);
                                }
                            } else {
                                var DPTa = element.split("\t")[5].split("-")[1];
                                var DPTb = element.split("\t")[5].split("-")[2];
                                if (typeof DPTb == "undefined") {
                                    RED.log.warn("KNXUltimate-config: WARNING: Datapoint not fully set (there is only the main type). I applied a default .001, but please check if i'ts ok ->" + element.split("\t")[0] + " " + element.split("\t")[1] + " Datapoint: " + element.split("\t")[5]);
                                    DPTb = "001"; // default
                                }
                                // Trailing zeroes
                                if (DPTb.length == 1) {
                                    DPTb = "00" + DPTb;
                                } else if (DPTb.length == 2) {
                                    DPTb = "0" + DPTb;
                                } if (DPTb.length == 3) {
                                    DPTb = "" + DPTb; // stupid, but for readability
                                }
                                ajsonOutput.push({ ga: element.split("\t")[1], dpt: DPTa + "." + DPTb, devicename: sFather + element.split("\t")[0] });
                            }
                        }
                    }
                }

                return ajsonOutput;
            }

        }

        function readESF(_esfText) {
            // 24/02/2020 must do an EIS to DPT conversion.
            // https://www.loxone.com/dede/kb/eibknx-datentypen/
            // Format: Attuatori luci.Luci primo piano.0/0/1	Luce camera da letto	EIS 1 'Switching' (1 Bit)	Low
            var ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red

            if (_esfText == "") {
                RED.log.info('KNXUltimate-config: no ESF found');
                return;
            } else {
                RED.log.info('KNXUltimate-config: esf ETS found !');
                // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
                let fileGA = _esfText.split("\n");
                var sGA = "";
                var sFirstGroupName = "";
                var sSecondGroupName = ""; // Fake, because EIS datapoints are unprecise.
                var sDeviceName = "";
                var sEIS = "";
                var sDPT = "";

                for (let index = 1; index < fileGA.length; index++) {
                    var element = fileGA[index];
                    element = element.replace(/\"/g, ""); // Rimuovo evetuali virgolette
                    element = element.replace(/\#/g, ""); // Rimuovo evetuali #
                    element = element.replace(/[^\x00-\x7F]/g, ""); // Remove non ascii chars

                    if (element !== "") {

                        sFirstGroupName = element.split("\t")[0].split(".")[0] || "";
                        sSecondGroupName = element.split("\t")[0].split(".")[1] || "";
                        sGA = element.split("\t")[0].split(".")[2] || "";
                        sDeviceName = element.split("\t")[1] || "";
                        sEIS = element.split("\t")[2] || "";
                        // Transform EIS to DPT
                        if (sEIS.toUpperCase().includes("EIS 1")) {
                            sDPT = "1.001";
                        } else if (sEIS.toUpperCase().includes("EIS 2")) {
                            sDPT = "3.007";
                        } else if (sEIS.toUpperCase().includes("EIS 3")) {
                            sDPT = "10.001";
                        } else if (sEIS.toUpperCase().includes("EIS 4")) {
                            sDPT = "11.001";
                        } else if (sEIS.toUpperCase().includes("EIS 5")) {
                            sDPT = "9.001";
                        } else if (sEIS.toUpperCase().includes("EIS 6")) {
                            sDPT = "5.001";
                        } else if (sEIS.toUpperCase().includes("EIS 7")) {
                            sDPT = "1.001";
                        } else if (sEIS.toUpperCase().includes("EIS 8")) {
                            sDPT = "2.001";
                        } else if (sEIS.toUpperCase().includes("EIS 9")) {
                            sDPT = "14.007";
                        } else if (sEIS.toUpperCase().includes("EIS 10")) {
                            sDPT = "7.001";
                        } else if (sEIS.toUpperCase().includes("EIS 11")) {
                            sDPT = "12.001";
                        } else if (sEIS.toUpperCase().includes("EIS 12")) {
                            sDPT = "15.000";
                        } else if (sEIS.toUpperCase().includes("EIS 13")) {
                            sDPT = "4.001";
                        } else if (sEIS.toUpperCase().includes("EIS 14")) {
                            sDPT = "5.001";
                        } else if (sEIS.toUpperCase().includes("EIS 15")) {
                            sDPT = "16.001";
                        } else if (sEIS.toUpperCase().includes("UNCERTAIN")) {
                            if (sEIS.toUpperCase().includes("4 BYTE")) {
                                sDPT = "14.056";
                            } else if (sEIS.toUpperCase().includes("2 BYTE")) {
                                sDPT = "9.001";
                            } else if (sEIS.toUpperCase().includes("3 BYTE")) {
                                sDPT = "10.001"; // Date
                            } else if (sEIS.toUpperCase().includes("1 BYTE")) {
                                sDPT = "20.102"; // RTC
                            } else {
                                sDPT = "5.004"; // Maybe.
                            }
                        } else {
                            if (node.stopETSImportIfNoDatapoint === "stop") {
                                RED.log.error("KNXUltimate-config: ABORT IMPORT OF ETS ESF FILE. To continue import, change the related setting, located in the config node in the ETS import section.");
                                return;
                            } else if (node.stopETSImportIfNoDatapoint === "fake") {
                                sDPT = "5.004"; // Maybe.
                                RED.log.error("KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to fake the datapoint -> " + sGA + ". An fake datapoint has been set: " + sDPT);
                            } else {
                                sDPT = "SKIP";
                                RED.log.error("KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to skip -> " + sGA);
                            }
                        }
                        if (sDPT !== "SKIP") ajsonOutput.push({ ga: sGA, dpt: sDPT, devicename: "(" + sFirstGroupName + "->" + sSecondGroupName + ") " + sDeviceName });
                    }
                }
            }

            return ajsonOutput;

        }

        // // 29/07/2020 Create YAML for homeassistant
        // function CreateYamlForHomeAssistant() {
        //     // Node.CSV : {ga:group address, dpt: datapoint, devicename: full device name with main and subgroups}
        //     sOut = "light:\n";
        //     const sCercaLuci = ["luce", "plafoniera", "applique"];
        //     node.csv.forEach(element => {
        //         if (sCercaLuci.some(element.devicename.includes.bind(element.devicename))) {
        //             // There's at least one
        //             sOut += "\t- platform: knx\n";
        //             sOut += "\t\tname:" + + "\n";
        //         }


        //     });
        // }

        // 23/08/2019 Delete unwanted CRLF in the GA description
        function correctCRLFInCSV(_csv) {

            var sOut = ""; // fixed output text to return
            var sChar = "";
            var bStart = false;
            for (let index = 0; index < _csv.length; index++) {
                sChar = _csv.substr(index, 1);
                if (sChar == "\"") {
                    if (!bStart) {
                        bStart = true;
                    } else {
                        bStart = false;
                    }
                    sOut += sChar;

                } else {
                    if (bStart) {
                        // i'm in the phrase, delimited by "". No CRLF should be there
                        if (sChar !== "\n" && sChar !== "\r") {
                            sOut += sChar;
                        } else {
                            sOut += " "; // Where it was a CRLF, i put a space
                        }
                    } else {
                        sOut += sChar;
                    }

                }
            }

            // Replace all parenthesis with []
            sOut = sOut.replace(/\(/g, "[").replace(/\)/g, "]");
            return sOut;
        }

    }



    RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode);
}
