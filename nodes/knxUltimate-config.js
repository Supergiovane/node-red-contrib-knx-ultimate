// const knx = require('./../knxultimate-api2');
// const dptlib = require('./../knxultimate-api2/src/dptlib');
const knx = require("./../KNXEngine");
const dptlib = require('./../KNXEngine/dptlib');

const oOS = require('os');
const net = require("net");
const _ = require("lodash");
const path = require("path");
var fs = require('fs');


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
        // if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn(stringa)
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
        jRet = { "help": "NO", "helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome" };
        const dpts =
            Object.entries(dptlib)
                .filter(onlyDptKeys)
        for (let index = 0; index < dpts.length; index++) {
            if (dpts[index][0].toUpperCase() === "DPT" + sDPT) {
                jRet = { "help": (dpts[index][1].basetype.hasOwnProperty("help") ? dpts[index][1].basetype.help : "NO"), "helplink": (dpts[index][1].basetype.hasOwnProperty("helplink") ? dpts[index][1].basetype.helplink : "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome") };
                break;
            }
        }
        res.json(jRet);
    });



    function knxUltimateConfigNode(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.host = config.host
        node.port = parseInt(config.port);
        node.physAddr = config.physAddr || "15.15.22"; // the KNX physical address we'd like to use
        node.suppressACKRequest = typeof config.suppressACKRequest === "undefined" ? true : config.suppressACKRequest; // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
        node.linkStatus = "disconnected"; // Can be: connected or disconnected
        node.nodeClients = [] // Stores the registered clients
        node.KNXEthInterface = typeof config.KNXEthInterface === "undefined" ? "Auto" : config.KNXEthInterface;
        node.KNXEthInterfaceManuallyInput = typeof config.KNXEthInterfaceManuallyInput === "undefined" ? "" : config.KNXEthInterfaceManuallyInput; // If you manually set the interface name, it will be wrote here
        node.statusDisplayLastUpdate = typeof config.statusDisplayLastUpdate === "undefined" ? true : config.statusDisplayLastUpdate;
        node.statusDisplayDeviceNameWhenALL = typeof config.statusDisplayDeviceNameWhenALL === "undefined" ? false : config.statusDisplayDeviceNameWhenALL;
        node.statusDisplayDataPoint = typeof config.statusDisplayDataPoint === "undefined" ? false : config.statusDisplayDataPoint;
        node.telegramsQueue = [];  // 02/01/2020 Queue containing telegrams 
        node.timerSendTelegramFromQueue;
        node.delaybetweentelegramsfurtherdelayREAD = (typeof config.delaybetweentelegramsfurtherdelayREAD === "undefined" || config.delaybetweentelegramsfurtherdelayREAD < 1) ? 1 : config.delaybetweentelegramsfurtherdelayREAD; // 18/05/2020 delay multiplicator only for "read" telegrams.
        node.delaybetweentelegramsREADCount = 0;// 18/05/2020 delay multiplicator only for "read" telegrams.
        node.timerDoInitialRead = null; // 17/02/2020 Timer (timeout) to do initial read of all nodes requesting initial read, after all nodes have been registered to the sercer
        node.stopETSImportIfNoDatapoint = typeof config.stopETSImportIfNoDatapoint === "undefined" ? "stop" : config.stopETSImportIfNoDatapoint; // 09/01/2020 Stop, Import Fake or Skip the import if a group address has unset datapoint
        node.csv = readCSV(config.csv); // Array from ETS CSV Group Addresses {ga:group address, dpt: datapoint, devicename: full device name with main and subgroups}
        node.localEchoInTunneling = typeof config.localEchoInTunneling !== "undefined" ? config.localEchoInTunneling : true;
        node.userDir = path.join(RED.settings.userDir, "knxultimatestorage"); // 04/04/2021 Supergiovane: Storage for service files
        node.exposedGAs = [];
        node.loglevel = config.loglevel !== undefined ? config.loglevel : "error"; // 18/02/2020 Loglevel default error
        try {
            node.sysLogger = null;
            node.sysLogger = require("./utils/sysLogger.js").get({ loglevel: node.loglevel }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window            
        } catch (error) { }
        // 12/11/2021 Connect at start delay
        if (config.autoReconnect === "no") node.autoReconnect = 0;
        if (config.autoReconnect === undefined) node.autoReconnect = 5;
        if (config.autoReconnect === "yes") node.autoReconnect = 5;
        if (config.autoReconnect === "yes30") node.autoReconnect = 30;
        if (config.autoReconnect === "yes60") node.autoReconnect = 60;
        if (config.autoReconnect === "yes120") node.autoReconnect = 120;
        node.ignoreTelegramsWithRepeatedFlag = (config.ignoreTelegramsWithRepeatedFlag === undefined ? false : config.ignoreTelegramsWithRepeatedFlag);
        // 24/07/2021 KNX Secure checks...
        node.keyringFileXML = (typeof config.keyringFileXML === "undefined" || config.keyringFileXML.trim() === "") ? "" : config.keyringFileXML;
        node.knxSecureSelected = typeof config.knxSecureSelected === "undefined" ? false : config.knxSecureSelected;
        node.name = (config.name === undefined || config.name === "") ? node.host : config.name; // 12/08/2021
        node.timerKNXUltimateCheckState = null; // 08/10/2021 Check the state. If not connected and autoreconnect is true, retrig the connetion attempt.
        node.lockHandleTelegramQueue = false; // 12/11/2021 Lock sending telegrams if node disconnected or if already handling the queue
        node.knxConnectionProperties = null; // Retains the connection properties

        // 05/12/2021 Set the protocol (this is undefined if coming from ild versions
        if (config.hostProtocol === undefined) {
            // Auto set protocol based on IP            
            if (node.host.startsWith("224.") ||
                node.host.startsWith("225.") ||
                node.host.startsWith("232.") ||
                node.host.startsWith("233.") ||
                node.host.startsWith("234.") ||
                node.host.startsWith("235.") ||
                node.host.startsWith("239.")) {
                node.hostProtocol = "Multicast";
            } else {
                node.hostProtocol = "TunnelUDP";
            }
        } else {
            node.hostProtocol = config.hostProtocol;
        }


        node.setAllClientsStatus = (_status, _color, _text) => {
            function nextStatus(oClient) {
                oClient.setNodeStatus({ fill: _color, shape: "dot", text: _status + " " + _text, payload: "", GA: oClient.topic, dpt: "", devicename: "" })
            }
            node.nodeClients.map(nextStatus);
        }

        // 
        // KNX-SECURE
        // 15/11/2021 Function to load the keyring file exported from ETS
        //
        //
        try {
            (async () => {
                if (node.knxSecureSelected) {
                    node.jKNXSecureKeyring = await knx.KNXSecureKeyring.load(node.keyringFileXML, node.credentials.keyringFilePassword);
                    RED.log.info("KNX-Secure: Keyring for ETS proj " + node.jKNXSecureKeyring.ETSProjectName + ", created by " + node.jKNXSecureKeyring.ETSCreatedBy + " on " + node.jKNXSecureKeyring.ETSCreated + " succesfully validated with provided password, using node " + node.name || node.id);
                } else {
                    RED.log.info("KNX-Unsecure: connection to insecure interface/router using node " + node.name || node.id);
                }
            })();
        } catch (error) {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("KNXUltimate-config: KNX Secure: error parsing the keyring XML: " + error.message);
            node.jKNXSecureKeyring = null;
            node.knxSecureSelected = false;
            setTimeout(() => node.setAllClientsStatus("Error", "red", "KNX Secure " + error.message), 2000);
        }


        // 04/04/2021 Supergiovane, creates the service paths where the persistent files are created.
        // The values file is stored only upon disconnection/close
        // ************************
        function setupDirectory(_aPath) {

            if (!fs.existsSync(_aPath)) {
                // Create the path
                try {
                    fs.mkdirSync(_aPath);
                    return true;
                } catch (error) { return false; }
            } else {
                return true;
            }
        }
        if (!setupDirectory(node.userDir)) {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('KNXUltimate-config: Unable to set up MAIN directory: ' + node.userDir);
        }
        if (!setupDirectory(path.join(node.userDir, "knxpersistvalues"))) {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('KNXUltimate-config: Unable to set up cache directory: ' + path.join(node.userDir, "knxpersistvalues"));
        } else {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: payload cache set to ' + path.join(node.userDir, "knxpersistvalues"));
        }

        function saveExposedGAs() {
            let sFile = path.join(node.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
            try {
                if (node.exposedGAs.length > 0) {
                    fs.writeFileSync(sFile, JSON.stringify(node.exposedGAs));
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: wrote peristent values to the file ' + sFile);
                }
            } catch (err) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('KNXUltimate-config: unable to write peristent values to the file ' + sFile + " " + err.message);
            }
        }
        function loadExposedGAs() {
            let sFile = path.join(node.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
            try {
                node.exposedGAs = JSON.parse(fs.readFileSync(sFile, 'utf8'));
            } catch (err) {
                node.exposedGAs = [];
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn('KNXUltimate-config: unable to read peristent file ' + sFile + " " + err.message);
            }
        }

        // ************************

        // Endpoint for reading csv from the other nodes
        RED.httpAdmin.get("/knxUltimatecsv", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
            if (typeof req.query.nodeID !== "undefined" && req.query.nodeID !== null && req.query.nodeID !== "") {
                var _node = RED.nodes.getNode(req.query.nodeID);// Retrieve node.id of the config node.
                if (_node !== null) res.json(RED.nodes.getNode(_node.id).csv);
            } else {
                // Get the first knxultimate-config having a valid csv
                try {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Requested csv maybe from visu-ultimate?");
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
            var sNodes = "\"Group Address\"\t\"Datapoint\"\t\"Node ID\"\t\"Device Name\"\t\"Options\"\n"; // Contains the text with nodes
            var sGA = "";
            var sDPT = "";
            var sName = "";
            var sNodeID = "";
            let sOptions = "";
            try {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Total knx-ultimate nodes: " + _node.nodeClients.length || 0);
                _node.nodeClients
                    //.map( a => a.topic.indexOf("/") !== -1 ? a.topic.split('/').map( n => +n+100000 ).join('/'):0 ).sort().map( a => a.topic.indexOf("/") !== -1 ? a.topic.split('/').map( n => +n-100000 ).join('/'):0 )
                    .sort((a, b) => {
                        if (a.topic !== undefined && b.topic !== undefined) {
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
                        sName = "\"" + (input.name !== undefined ? input.name : "") + "\"";
                        sOptions = "\"" + "\"";
                        if (input.listenallga == true) {
                            if (input.hasOwnProperty("isSceneController")) {
                                // Is a Scene Controller
                                sGA = "\"Scene Controller\"";
                                sDPT = "\"Any\"";
                            } else if (input.hasOwnProperty("isLogger")) {
                                // Is a Scene Controller
                                sGA = "\"Logger\"";
                                sDPT = "\"Any\"";
                            } else if (input.hasOwnProperty("isalertnode")) {
                                // Is a Scene Controller
                                sGA = "\"Alerter\"";
                                sDPT = "\"Any\"";
                            } else {
                                // Is a ListenallGA
                                sGA = "\"Universal Node\"";
                                sDPT = "\"Any\"";
                                sOptions = "\"" + "No Initial Read" + ", ";

                                sOptions += (input.notifywrite === true ? "React to Write" : "No React to Write") + ", ";
                                sOptions += (input.notifyresponse === true ? "React to Response" : "No React to Response") + ", ";
                                sOptions += (input.notifyreadrequest === true ? "React to Read" : "No React to Read") + ", ";
                                sOptions += "No Autorespond to Read Requests" + ", ";

                                sOptions += "Output type " + input.outputtype + ", ";
                                sOptions += "No RBE on Output to Bus" + ", ";
                                sOptions += "No RBE on Input from Bus" + "\"";
                            }

                        } else {
                            sGA = "\"" + (input.topic !== undefined ? input.topic : "") + "\"";
                            sDPT = "\"" + (input.dpt !== undefined ? input.dpt : "") + "\"";

                            if (input.hasOwnProperty("isWatchDog")) {
                                // Is a watchdog node

                            } else {
                                // Is a device node
                                sOptions = "\"" + (Number(input.initialread) > 0 ? "Initial Read" : "No Initial Read") + ", ";
                                sOptions += (input.notifywrite === true ? "React to Write" : "No React to Write") + ", ";
                                sOptions += (input.notifyresponse === true ? "React to Response" : "No React to Response") + ", ";
                                sOptions += (input.notifyreadrequest === true ? "React to Read" : "No React to Read") + ", ";
                                sOptions += (input.notifyreadrequestalsorespondtobus === true ? "Autorespond to Read Requests" : "No Autorespond to Read Requests") + ", ";

                                sOptions += "Output type " + input.outputtype + ", ";
                                sOptions += (input.outputRBE === true ? "RBE on Output to Bus" : "No RBE on Output to Bus") + ", ";
                                sOptions += (input.inputRBE === true ? "RBE on Input from Bus" : "No RBE on Input from Bus") + "\"";
                            };
                        };
                        sNodes += sGA + "\t" + sDPT + "\t" + sNodeID + "\t" + sName + "\t" + sOptions + "\n";
                    });
                res.json(sNodes)
            } catch (error) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn("D " + error)
            }
        });

        // 12/08/2021 Endpoint for deleting the GA persistent file for the current gateway
        RED.httpAdmin.get("/deletePersistGAFile", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
            if (typeof req.query.nodeID !== "undefined" && req.query.nodeID !== null && req.query.nodeID !== "") {
                let sFile = path.join(node.userDir, "knxpersistvalues", "knxpersist" + req.query.nodeID + ".json");
                try {
                    fs.unlinkSync(sFile);
                } catch (error) { }
                res.json({ error: "No error" });
            } else {
                res.json({ error: "No NodeID specified" });
            }
        });


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
            try {
                if (node.knxConnection !== null) node.knxConnection.Disconnect();
                if (node.knxConnection !== null) node.knxConnection.removeAllListeners();
            } catch (error) { }

            node.telegramsQueue = []; // 02/01/2020 clear the telegram queue
            node.setAllClientsStatus("Disconnected", "grey", "")
            node.linkStatus = "disconnected"; // 29/08/2019 signal disconnection

            saveExposedGAs(); // 04/04/2021 save the current values of GA payload
        }

        node.addClient = (_Node) => {
            // Check if node already exists
            if (node.nodeClients.filter(x => x.id === _Node.id).length === 0) {
                // Check if the node has a valid topic and dpt
                if (_Node.listenallga === false) {
                    if (_Node.topic === undefined || _Node.dpt === undefined) {
                        _Node.setNodeStatus({ fill: "red", shape: "dot", text: "Empty Group Addr. or datapoint.", payload: "", GA: "", dpt: "", devicename: "" })
                        return;
                    } else {
                        // topic must be in format x/x/x
                        if (_Node.topic.split("\/").length < 3) {
                            _Node.setNodeStatus({ fill: "red", shape: "dot", text: "Wrong group address (topic: " + _Node.topic + ") format.", payload: "", GA: "", dpt: "", devicename: "" })
                            return;
                        }
                    }
                }
                // Add _Node to the clients array
                if (node.autoReconnect > 0) {
                    _Node.setNodeStatus({ fill: "grey", shape: "ring", text: "Node initialized.", payload: "", GA: "", dpt: "", devicename: "" });
                } else {
                    _Node.setNodeStatus({ fill: "red", shape: "ring", text: "Autoconnect disabled. Please manually connect.", payload: "", GA: "", dpt: "", devicename: "" });
                }
                node.nodeClients.push(_Node);
            }

        }

        node.removeClient = (_Node) => {
            // Remove the client node from the clients array
            //if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info( "BEFORE Node " + _Node.id + " has been unsubscribed from receiving KNX messages. " + node.nodeClients.length);
            try {
                node.nodeClients = node.nodeClients.filter(x => x.id !== _Node.id)
            } catch (error) { }
            //if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("AFTER Node " + _Node.id + " has been unsubscribed from receiving KNX messages. " + node.nodeClients.length);

            // If no clien nodes, disconnect from bus.
            if (node.nodeClients.length === 0) {
                try {
                    node.Disconnect();
                } catch (error) {

                }
            }
        }


        // 17/02/2020 Do initial read (called by node.timerDoInitialRead timer)
        function DoInitialReadFromKNXBusOrFile() {
            if (node.linkStatus !== "connected") return; // 29/08/2019 If not connected, exit
            loadExposedGAs(); // 04/04/2021 load the current values of GA payload
            try {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Loaded saved GA values", node.exposedGAs.length);
            } catch (error) {
            }
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Do DoInitialReadFromKNXBusOrFile");
            try {
                var readHistory = [];

                // First, read from file. This allow all virtual devices to get their values from file.
                node.nodeClients
                    .filter(oClient => oClient.initialread == 2 || oClient.initialread == 3)
                    .filter(oClient => oClient.hasOwnProperty("isWatchDog") === false)
                    .forEach(oClient => {

                        if (node.linkStatus !== "connected") return; // 16/08/2021 If not connected, exit

                        // 04/04/2020 selected READ FROM FILE 2 or from file then from bus 3
                        if (oClient.listenallga == true) {
                            // 13/12/2021 DA FARE
                        } else {
                            try {
                                if (node.exposedGAs.length > 0) {
                                    let oExposedGA = node.exposedGAs.find(a => a.ga === oClient.topic);
                                    if (oExposedGA !== undefined) {

                                        // Retrieve the value from exposedGAs
                                        let msg = buildInputMessage({ _srcGA: "", _destGA: oClient.topic, _event: "GroupValue_Response", _Rawvalue: new Buffer.from(oExposedGA.rawValue.data), _inputDpt: oClient.dpt, _devicename: oClient.name ? oClient.name : "", _outputtopic: oClient.outputtopic, _oNode: oClient })
                                        oClient.previouspayload = ""; // 05/04/2021 Added previous payload
                                        oClient.currentPayload = msg.payload;
                                        oClient.setNodeStatus({ fill: "grey", shape: "dot", text: "Update value from persist file", payload: oClient.currentPayload, GA: oClient.topic, dpt: oClient.dpt, devicename: oClient.name || "" });
                                        // 06/05/2021 If, after the rawdata has been savad to file, the user changes the datapoint, the buildInputMessage returns payload null, because it's unable to convert the value
                                        if (msg.payload === null) {
                                            // Delete the exposedGA
                                            node.exposedGAs = node.exposedGAs.filter((item) => item.ga !== oClient.topic);
                                            oClient.setNodeStatus({ fill: "yellow", shape: "dot", text: "Datapoint has been changed, remove the value from persist file", payload: oClient.currentPayload, GA: oClient.topic, dpt: oClient.dpt, devicename: oClient.devicename || "" });
                                            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: DoInitialReadFromKNXBusOrFile: Datapoint may have been changed, remove the value from persist file of " + oClient.topic + " Devicename " + oClient.name + " Currend DPT " + oClient.dpt + " Node.id " + oClient.id);
                                        } else {
                                            if (oClient.notifyresponse) oClient.handleSend(msg);
                                        }

                                    } else {
                                        if (oClient.initialread === 3) {
                                            // Not found, issue a READ to the bus
                                            if (!readHistory.includes(oClient.topic)) {
                                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("KNXUltimate-config: DoInitialReadFromKNXBusOrFile 3: sent read request to GA " + oClient.topic);
                                                oClient.setNodeStatus({ fill: "grey", shape: "dot", text: "Persist value not found, issuing READ request to BUS", payload: oClient.currentPayload, GA: oClient.topic, dpt: oClient.dpt, devicename: oClient.devicename || "" });
                                                node.writeQueueAdd({ grpaddr: oClient.topic, payload: "", dpt: "", outputtype: "read", nodecallerid: oClient.id });
                                                readHistory.push(oClient.topic);
                                            };
                                        };
                                    };
                                }
                            } catch (error) {

                            }

                        }
                    })

                // Then, after all values have been read from file, read from BUS
                // This allow the virtual devices to get their values before this will be readed from bus
                node.nodeClients
                    .filter(oClient => oClient.initialread == 1)
                    .filter(oClient => oClient.hasOwnProperty("isWatchDog") === false)
                    .forEach(oClient => {

                        if (node.linkStatus !== "connected") return; // 16/08/2021 If not connected, exit

                        // 04/04/2020 selected READ FROM BUS 1
                        if (oClient.hasOwnProperty("isalertnode") && oClient.isalertnode) {
                            oClient.initialReadAllDevicesInRules();
                        } else if (oClient.listenallga == true) {
                            for (let index = 0; index < node.csv.length; index++) {
                                const element = node.csv[index];
                                if (!readHistory.includes(element.ga)) {
                                    node.writeQueueAdd({ grpaddr: element.ga, payload: "", dpt: "", outputtype: "read", nodecallerid: element.id });
                                    readHistory.push(element.ga);
                                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("KNXUltimate-config: DoInitialReadFromKNXBusOrFile from Universal Node: sent read request to GA " + element.ga);
                                };
                            }
                        } else {
                            if (!readHistory.includes(oClient.topic)) {
                                node.writeQueueAdd({ grpaddr: oClient.topic, payload: "", dpt: "", outputtype: "read", nodecallerid: oClient.id });
                                readHistory.push(oClient.topic);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("KNXUltimate-config: DoInitialReadFromKNXBusOrFile: sent read request to GA " + oClient.topic);
                            };
                        }
                    })


            } catch (error) {

            }
        }


        // 01/02/2020 Dinamic change of the KNX Gateway IP, Port and Physical Address
        // This new thing has been requested by proServ RealKNX staff.
        node.setGatewayConfig = (_sIP, _iPort, _sPhysicalAddress, _sBindToEthernetInterface, _Protocol) => {

            if (typeof _sIP !== "undefined" && _sIP !== "") node.host = _sIP;
            if (typeof _iPort !== "undefined" && _iPort !== 0) node.port = _iPort;
            if (typeof _sPhysicalAddress !== "undefined" && _sPhysicalAddress !== "") node.physAddr = _sPhysicalAddress;
            if (typeof _sBindToEthernetInterface !== "undefined") node.KNXEthInterface = _sBindToEthernetInterface;
            if (typeof _Protocol !== "undefined") node.hostProtocol = _Protocol;
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("Node's main config setting has been changed. New config: IP " + node.host + " Port " + node.port + " PhysicalAddress " + node.physAddr + " BindToInterface " + node.KNXEthInterface);

            try {
                var oldReconnect = node.autoReconnect;
                node.autoReconnect = 0; // Disable Autoreconnect
                node.Disconnect();
                node.setKnxConnectionProperties();
                node.setAllClientsStatus("CONFIG", "yellow", "KNXUltimage-config:setGatewayConfig: disconnected by new setting...");
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("KNXUltimage-config:setGatewayConfig: disconnected by setGatewayConfig. AutoReconnect = " + oldReconnect);

                // 08/10/2021 Adjust the connection properties as well
                setTimeout(() => {
                    node.setAllClientsStatus("CONFIG", "yellow", "Reconnecting after setGatewayConfig");
                    setTimeout(() => node.setAllClientsStatus("CONFIG", "yellow", "New config: IP " + node.host + " Port " + node.port + " PhysicalAddress " + node.physAddr + " BindToInterface " + node.KNXEthInterface), 1000)
                    node.autoReconnect = oldReconnect; // Disable Autoreconnect
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("KNXUltimage-config:setGatewayConfig: reconnected from AutoReconnect = " + node.autoReconnect);
                }, 10000);

            } catch (error) { }

        };


        // 05/05/2021 force connection or disconnection from the KNX BUS and disable the autoreconenctions attempts.
        // This new thing has been requested by proServ RealKNX staff.
        node.connectGateway = (_bConnection) => {
            if (_bConnection === undefined) return;
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info((_bConnection === true ? "Forced connection from watchdog" : "Forced disconnection from watchdog") + node.host + " Port " + node.port + " PhysicalAddress " + node.physAddr + " BindToInterface " + node.KNXEthInterface);
            if (_bConnection === true) {
                // CONNECT AND ENABLE RECONNECTION ATTEMPTS
                try {
                    node.Disconnect();
                    node.setAllClientsStatus("CONFIG", "yellow", "Forced GW connection from watchdog.");
                    node.autoReconnect = 5;
                } catch (error) { }
            } else {
                // DISCONNECT AND DISABLE RECONNECTION ATTEMPTS
                try {
                    node.autoReconnect = 0;
                    node.Disconnect();
                    setTimeout(() => {
                        node.setAllClientsStatus("CONFIG", "yellow", "Forced GW disconnection and stop reconnection attempts, from watchdog.");
                    }, 2000);
                } catch (error) { }
            }

        };


        // 08/10/2021 
        // node.knxConnectionProperties must be:
        // const optionsDefaults = {
        //     physAddr: '15.15.200',
        //     connectionKeepAliveTimeout: KNXConstants.KNX_CONSTANTS.CONNECTION_ALIVE_TIME,
        //     ipAddr: "224.0.23.12",
        //     ipPort: 3671,
        //     hostProtocol: "TunnelUDP", // TunnelUDP, TunnelTCP, Multicast
        //     isSecureKNXEnabled: false,
        //     suppress_ack_ldatareq: false,
        //     loglevel: "info",
        //     localEchoInTunneling: true,
        //     localIPAddress: "",
        //     interface: ""
        // };

        node.setKnxConnectionProperties = () => {
            // 25/08/2021 Moved out of node.initKNXConnection 
            node.knxConnectionProperties = {
                ipAddr: node.host,
                ipPort: node.port,
                physAddr: node.physAddr, // the KNX physical address we'd like to use
                suppress_ack_ldatareq: node.suppressACKRequest,
                loglevel: node.loglevel,
                localEchoInTunneling: node.localEchoInTunneling, // 14/03/2020 local echo in tunneling mode (see API Supergiovane)
                hostProtocol: node.hostProtocol,
                isSecureKNXEnabled: node.knxSecureSelected,
                localIPAddress: "" // Riempito da KNXEngine
            };

            if (node.KNXEthInterface !== "Auto") {
                var sIfaceName = "";
                if (node.KNXEthInterface === "Manual") {
                    sIfaceName = node.KNXEthInterfaceManuallyInput;
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Bind KNX Bus to interface : " + sIfaceName + " (Interface's name entered by hand). Node " + node.name);
                } else {
                    sIfaceName = node.KNXEthInterface;
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Bind KNX Bus to interface : " + sIfaceName + " (Interface's name selected from dropdown list). Node " + node.name);
                }
                node.knxConnectionProperties.interface = sIfaceName;
            } else {
                // 08/10/2021 Delete the interface
                try {
                    delete (node.knxConnectionProperties.interface);
                } catch (error) {
                }
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Bind KNX Bus to interface (Auto). Node " + node.name);
            }
        }
        node.setKnxConnectionProperties();

        node.initKNXConnection = () => {

            // 12/08/2021 Avoid start connection if there are no knx-ultimate nodes linked to this gateway
            // At start, initKNXConnection is already called only if the gateway has clients, but in the successive calls from the error handler, this check is not done.
            if (node.nodeClients.length === 0) {
                try {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimate-config: No nodes linked to this gateway " + node.name);
                    try {
                        if (node.linkStatus !== "disconnected") node.Disconnect();
                    } catch (error) {
                    }
                    return
                } catch (error) { }
            }

            // 26/01/2021 Emulation mode
            if (node.host.toUpperCase() === "EMULATE") {
                node.knxConnection = true; // Must not be null
                node.telegramsQueue = []; // 01/10/2020 Supergiovane: clear the telegram queue
                node.linkStatus = "connected";
                node.setAllClientsStatus("Emulation", "green", "Waiting for telegram.")
                // Start the timer to do initial read.
                if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
                node.timerDoInitialRead = setTimeout(DoInitialReadFromKNXBusOrFile, 3000); // 17/02/2020 Do initial read of all nodes requesting initial read, after all nodes have been registered to the sercer
                return;
            }

            try {
                node.Disconnect();
            } catch (error) {
                //console.log(error)
            }


            try {
                // 01/12/2020 Test if the IP is a valid one
                switch (net.isIP(node.host)) {
                    case 0:
                        // Invalid IP
                        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: net.isIP: INVALID IP. Check the IP in Config node " + node.name);
                        throw ("INVALID IP. Check the IP in Config node.");
                    case 4:
                        // It's an IPv4
                        break;
                    case 6:
                        // It's an IPv6
                        break;
                    default:
                        break;
                }

                // node.knxConnectionProperties must be:
                // const optionsDefaults = {
                //     physAddr: '15.15.200',
                //     connectionKeepAliveTimeout: KNXConstants.KNX_CONSTANTS.CONNECTION_ALIVE_TIME,
                //     ipAddr: "224.0.23.12",
                //     ipPort: 3671,
                //     hostProtocol: "TunnelUDP", // TunnelUDP, TunnelTCP, Multicast
                //     isSecureKNXEnabled: false,
                //     suppress_ack_ldatareq: false,
                //     loglevel: "info",
                //     localEchoInTunneling: true,
                //     localIPAddress: "",
                //     interface: ""
                // };
                node.knxConnection = new knx.KNXClient(node.knxConnectionProperties);

                // Unsetting handlers
                try {
                    node.knxConnection.removeAllListeners();
                } catch (error) {
                    console.log("BANANA ERRORINO", error);
                }

                // Setting handlers
                // ######################################
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.indication, handleBusEvents);
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.error, err => {
                    saveExposedGAs(); // 13/12/2021 save the current values of GA payload
                    node.setAllClientsStatus("Disconnected by " + (err.message === undefined ? err : err.message), "red", "");
                    node.telegramsQueue = [];
                    node.linkStatus = "disconnected";
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: Disconnected by " + (err.message === undefined ? err : err.message));
                });
                // Call discoverCB when a knx gateway has been discovered.
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.discover, info => {
                    const [ip, port] = info.split(":");
                    discoverCB(ip, port);
                });
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.disconnected, info => {
                    saveExposedGAs(); // 13/12/2021 save the current values of GA payload
                    node.telegramsQueue = [];
                    if (node.linkStatus !== "disconnected") {
                        node.linkStatus = "disconnected";
                        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn("knxUltimate-config: Disconnected event %s", info);
                    }
                });
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.close, info => {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("knxUltimate-config: KNXClient socket closed.");
                });
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.connected, info => {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimate-config: Connected to %o", info);
                    node.telegramsQueue = []; // 01/10/2020 Supergiovane: clear the telegram queue
                    node.linkStatus = "connected";
                    // Start the timer to do initial read.
                    if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
                    node.timerDoInitialRead = setTimeout(DoInitialReadFromKNXBusOrFile, 6000); // 17/02/2020 Do initial read of all nodes requesting initial read
                    node.setAllClientsStatus(node.linkStatus.charAt(0).toUpperCase() + node.linkStatus.slice(1) || "", "green", "Wait for telegrams.")
                });
                node.knxConnection.on(knx.KNXClient.KNXClientEvents.connecting, info => {
                    node.telegramsQueue = []; // 01/10/2020 Supergiovane: clear the telegram queue
                    node.linkStatus = "connecting";
                    // Start the timer to do initial read.
                    if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.debug("knxUltimate-config: Connecting to" + info.ipAddr || "");
                    node.setAllClientsStatus(info.ipAddr || "", "grey", "Connecting...")
                });
                // ######################################

                node.setAllClientsStatus("Connecting... ", "grey", "");
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimate-config: connecting... " + node.name);
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimate-config: perform websocket connection on " + node.name);
                try {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Connecting... " + node.name);
                    node.knxConnection.Connect();
                } catch (error) {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("KNXUltimate-config: node.knxConnection.Connect() " + node.name + ": " + error.message);
                    node.linkStatus = "disconnected";
                    throw (error);
                }

            } catch (error) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("KNXUltimate-config: Error in instantiating knxConnection " + error.message + ". Node " + node.name);
                node.linkStatus = "disconnected";
                setTimeout(() => node.setAllClientsStatus("Error in instantiating knxConnection " + error, "red", "Error"), 200);
            }

        };


        // Handle BUS events
        // ---------------------------------------------------------------------------------------
        //function handleBusEvents(_evt, _src, _dest, _rawValue, _datagram, _isRepeated) {
        function handleBusEvents(_datagram, _echoed, _CEMI) {

            // try {
            //     var dpt = DPTLib.resolve("DPT1.001");
            //     var jsvalue = DPTLib.fromBuffer(_datagram.cEMIMessage.npdu.dataValue, dpt)
            // } catch (error) {
            //     console.log(error);
            // }

            // _rawValue
            _rawValue = _datagram.cEMIMessage.npdu.dataValue;

            // _evt
            if (_datagram.cEMIMessage.npdu.isGroupRead) _evt = "GroupValue_Read";
            if (_datagram.cEMIMessage.npdu.isGroupResponse) _evt = "GroupValue_Response";
            if (_datagram.cEMIMessage.npdu.isGroupWrite) _evt = "GroupValue_Write";

            // _src
            _src = _datagram.cEMIMessage.srcAddress.toString();

            // _dest
            _dest = _datagram.cEMIMessage.dstAddress.toString();

            let isRepeated = _datagram.cEMIMessage.control.repeat === 1 ? false : true;
            // 06/06/2021 Supergiovane: check if i can handle the telegrams with "Repeated" flag
            if (node.ignoreTelegramsWithRepeatedFlag === true && isRepeated) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn("KNXUltimate-config: Ignored telegram with Repeated Flag " + _evt + " Src:" + _src + " Dest:" + _dest);
                return;
            }

            // 23/03/2021 Supergiovane: Added the CEMI telegram for ETS Diagnostic
            // #####################################################################
            let _cemiETS = "";
            if (_CEMI !== undefined && _CEMI !== null) {
                try {
                    var iStart = _datagram._header._headerLength + 4;
                    _cemiETS = _CEMI.toString("hex").substring(iStart * 2);
                } catch (error) { _cemiETS = ""; }
            }
            // #####################################################################


            // 04/04/2021 Supergiovane: save value to node.exposedGAs
            if (typeof _dest === "string" && _rawValue !== undefined && (_evt === "GroupValue_Write" || _evt === "GroupValue_Response")) {
                try {
                    node.exposedGAs = node.exposedGAs.filter((item) => item.ga !== _dest); // Remove previous
                    node.exposedGAs.push({ ga: _dest, rawValue: _rawValue }); // add the new
                } catch (error) {
                }
            }
            switch (_evt) {
                case "GroupValue_Write": {
                    //console.log("BANANA FIGA ARRIVA ROBA", node.linkStatus)
                    //node.linkStatus = "connected"; // 01/10/2020 The connection must be alive, if womething comes from the bus!
                    //console.log("BANANA HO ATTIVATO FORZATAMENTE LA CONNESSIONE", node.linkStatus)
                    node.nodeClients
                        .filter(input => input.notifywrite == true)
                        .forEach(input => {

                            // 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
                            if (input.hasOwnProperty("isSceneController")) {

                                // 12/08/2020 Check wether is a learn (save) command or a activate (play) command.
                                if (_dest === input.topic || _dest === input.topicSave) {

                                    // Prepare the two messages to be evaluated directly into the Scene Controller node.
                                    new Promise((resolve, reject) => {
                                        if (_dest === input.topic) {
                                            try {
                                                let msgRecall = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: null });
                                                input.RecallScene(msgRecall.payload, false);
                                            } catch (error) { }
                                        } // 12/08/2020 Do NOT use "else", because both topics must be evaluated in case both recall and save have same group address.
                                        if (_dest === input.topicSave) {
                                            try {
                                                let msgSave = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: input.dptSave, _devicename: input.name ? input.name : "", _outputtopic: _dest, _oNode: null });
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
                                            if (typeof oDevice !== "undefined" && oDevice.topic == _dest) {
                                                let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: oDevice.dpt, _devicename: oDevice.name ? input.name : "", _outputtopic: oDevice.outputtopic, _oNode: null })
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

                                // 24/03/2021 Logger Node, i'll pass cemiETS
                                if (_cemiETS !== undefined) {
                                    //new Promise((resolve, reject) => {
                                    input.handleSend(_cemiETS);
                                    //    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                    //}).then(function () { }).catch(function () { });
                                }

                            } else if (input.listenallga == true) {

                                // Get the GA from CVS
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == _dest)[0];
                                } catch (error) { }
                                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: _dest, _oNode: input });
                                input.setNodeStatus({ fill: "green", shape: "dot", text: (typeof oGA === "undefined") ? "Try to decode" : "", payload: msg.payload, GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg);

                            } else if (input.topic == _dest) {

                                if (input.hasOwnProperty("isWatchDog")) { // 04/02/2020 Watchdog implementation
                                    // Is a watchdog node

                                } else {
                                    let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
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

                                // 24/03/2021 Logger Node, i'll pass cemiETS
                                if (_cemiETS !== undefined) {
                                    //new Promise((resolve, reject) => {
                                    input.handleSend(_cemiETS);
                                    //    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                    //}).then(function () { }).catch(function () { });
                                }

                            } else if (input.listenallga == true) {
                                // Get the DPT
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == _dest)[0];
                                } catch (error) { }

                                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                                let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: _dest, _oNode: input });
                                input.setNodeStatus({ fill: "blue", shape: "dot", text: (typeof oGA === "undefined") ? "Try to decode" : "", payload: msg.payload, GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg)

                            } else if (input.topic == _dest) {
                                // 04/02/2020 Watchdog implementation
                                if (input.hasOwnProperty("isWatchDog")) {
                                    // Is a watchdog node
                                    input.watchDogTimerReset();
                                } else {
                                    let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: _rawValue, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
                                    // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                                    if (!checkRBEInputFromKNXBusAllowSend(input, msg.payload)) {
                                        input.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe INPUT filter applied on " + msg.payload, payload: msg.payload, GA: _dest })
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

                                //console.log("BANANA isLogger", _evt, _src, _dest, _rawValue, _cemiETS);
                                // 24/03/2021 Logger Node, i'll pass cemiETS
                                if (_cemiETS !== undefined) {
                                    //new Promise((resolve, reject) => {
                                    input.handleSend(_cemiETS);
                                    //    resolve(true); // fulfilled
                                    //reject("error"); // rejected
                                    //}).then(function () { }).catch(function () { });
                                }

                            } else if (input.listenallga == true) {
                                // Get the DPT
                                let oGA;
                                try {
                                    oGA = node.csv.filter(sga => sga.ga == _dest)[0];
                                } catch (error) { }

                                // Read Request
                                let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: null, _inputDpt: (typeof oGA === "undefined") ? null : oGA.dpt, _devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename, _outputtopic: _dest, _oNode: input });
                                input.setNodeStatus({ fill: "grey", shape: "dot", text: "Read", payload: "", GA: msg.knx.destination, dpt: msg.knx.dpt, devicename: msg.devicename });
                                input.handleSend(msg)

                            } else if (input.topic == _dest) {

                                // 04/02/2020 Watchdog implementation
                                if (input.hasOwnProperty("isWatchDog")) {
                                    // Is a watchdog node

                                } else {
                                    // Read Request
                                    let msg = buildInputMessage({ _srcGA: _src, _destGA: _dest, _event: _evt, _Rawvalue: null, _inputDpt: input.dpt, _devicename: input.name ? input.name : "", _outputtopic: input.outputtopic, _oNode: input })
                                    msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Reset previous payload
                                    // 24/09/2019 Autorespond to BUS
                                    if (input.hasOwnProperty("notifyreadrequestalsorespondtobus") && input.notifyreadrequestalsorespondtobus === true) {
                                        if (typeof input.currentPayload === "undefined" || input.currentPayload === "" || input.currentPayload === null) { // 14/08/2021 Added || input.currentPayload === null
                                            node.writeQueueAdd({ grpaddr: _dest, payload: input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized, dpt: input.dpt, outputtype: "response", nodecallerid: input.id });
                                            input.setNodeStatus({ fill: "blue", shape: "ring", text: "Read & Autorespond with default", payload: input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized, GA: input.topic, dpt: msg.knx.dpt, devicename: "" });
                                        } else {
                                            node.writeQueueAdd({ grpaddr: _dest, payload: input.currentPayload, dpt: input.dpt, outputtype: "response", nodecallerid: input.id });
                                            input.setNodeStatus({ fill: "blue", shape: "ring", text: "Read & Autorespond with default", payload: input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized, GA: input.topic, dpt: msg.knx.dpt, devicename: "" });
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
            let _clonedMessage = RED.util.cloneMessage(_oKNXMessage);
            if (node.linkStatus !== "connected") {
                try {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimate-config: writeQueueAdd Discarded " + JSON.stringify(_clonedMessage));
                } catch (error) {

                }
                return;
            }
            // _clonedMessage is { grpaddr, payload,dpt,outputtype (write or response),nodecallerid (id of the node sending adding the telegram to the queue)}
            node.telegramsQueue.unshift(_clonedMessage); // Add _clonedMessage as first in the queue pile
        }

        function handleTelegramQueue() {
            if (node.knxConnection !== null || node.host.toUpperCase() === "EMULATE") {
                //console.log("BANANA handleTelegramQueueSONO BLOCCATO ? ",node.lockHandleTelegramQueue, "CONNECTED ? ", node.linkStatus )
                if (node.lockHandleTelegramQueue === true) return; // Exits if the funtion is busy
                node.lockHandleTelegramQueue = true; // Lock the function. It cannot be called again until finished.

                // 16/08/2021 If not connected, exit
                if (node.linkStatus !== "connected") {
                    node.telegramsQueue = [];
                    node.lockHandleTelegramQueue = false; // Unlock the function
                    return;
                }

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
                        if (node.host.toUpperCase() === "EMULATE") {
                            // The gateway is in EMULATION mode
                            sendEmulatedTelegram(oKNXMessage);
                        } else {
                            node.knxConnection.respond(oKNXMessage.grpaddr, oKNXMessage.payload, oKNXMessage.dpt);
                        }
                    } catch (error) {
                        try {
                            node.nodeClients.find(a => a.id === oKNXMessage.nodecallerid).setNodeStatus({ fill: "red", shape: "dot", text: "Send response " + error, payload: oKNXMessage.payload, GA: oKNXMessage.grpaddr, dpt: oKNXMessage.dpt, devicename: "" })
                        } catch (error) { }
                    }
                } else if (oKNXMessage.outputtype === "read") {
                    try {
                        if (node.host.toUpperCase() === "EMULATE") {
                            // The gateway is in EMULATION mode
                            sendEmulatedTelegram(oKNXMessage);
                        } else {
                            node.knxConnection.read(oKNXMessage.grpaddr);
                        }
                    } catch (error) { }
                } else if (oKNXMessage.outputtype === "update") {

                    // 05/01/2021 Update don't send anything to the bus, but instead updates the values of all nodes belonging to the group address passed
                    // oKNXMessage = {
                    //     grpaddr: '5/0/1',
                    //     payload: true,
                    //     dpt: '1.001',
                    //     outputtype: 'update',
                    //     nodecallerid: 'd104af91.31da18'
                    //   }
                    try {

                        node.nodeClients.forEach(input => {

                            // 16/08/2021 If not connected, exit
                            if (node.linkStatus !== "connected") {
                                node.telegramsQueue = [];
                                node.lockHandleTelegramQueue = false; // Unlock the function
                                return;
                            }

                            // 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
                            if (input.hasOwnProperty("isSceneController")) {

                            } else if (input.hasOwnProperty("isLogger")) { // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node

                            } else if (input.listenallga == true) {

                            } else if (input.topic == oKNXMessage.grpaddr) {

                                if (input.hasOwnProperty("isWatchDog")) { // 04/02/2020 Watchdog implementation
                                    // Is a watchdog node

                                } else {

                                    let msg = {
                                        topic: input.topic,
                                        payload: oKNXMessage.payload,
                                        devicename: input.name ? input.name : "",
                                        event: "Update_NoWrite",
                                        eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS"
                                    };
                                    // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                                    if (!checkRBEInputFromKNXBusAllowSend(input, msg.payload)) {
                                        input.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block (" + msg.payload + ") from KNX", payload: "", GA: "", dpt: "", devicename: "" })
                                        node.lockHandleTelegramQueue = false; // Unlock the function
                                        return;
                                    };
                                    msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Added previous payload
                                    input.currentPayload = msg.payload;// Set the current value for the RBE input
                                    input.setNodeStatus({ fill: "green", shape: "dot", text: "", payload: msg.payload, GA: input.topic, dpt: input.dpt, devicename: "" });
                                    input.handleSend(msg);
                                };
                            };
                        });

                    } catch (error) { }

                } else {
                    // Write
                    try {
                        if (node.host.toUpperCase() === "EMULATE") {
                            // The gateway is in EMULATION mode
                            sendEmulatedTelegram(oKNXMessage);
                        } else {
                            node.knxConnection.write(oKNXMessage.grpaddr, oKNXMessage.payload, oKNXMessage.dpt);
                        }
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

            return !_.isEqual(_node.currentPayload, _KNXTelegramPayload);
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
            } else if (_rawValue.length == 3) {
                return "11.001";
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
                                //if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("Trying for " + dest + ". FOUND " + element.value);
                                return element.value;
                            }
                        }
                    } catch (error) {

                    }
                }
                throw new Error("tryToFigureOutDataPointFromRawValue: no suitable datapoint found"); // 24/08/2021 Return error if no DPT
            }
        }

        function buildInputMessage({ _srcGA, _destGA, _event, _Rawvalue, _inputDpt, _devicename, _outputtopic, _oNode }) {
            var sPayloadmeasureunit = "unknown";
            var sDptdesc = "unknown";
            var sPayloadsubtypevalue = "unknown";
            var jsValue = null;
            var sInputDpt = "unknown";

            let errorMessage = {
                topic: _outputtopic
                , payload: "UNKNOWN, PLEASE IMPORT THE ETS FILE!"
                , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
                , payloadmeasureunit: ""
                , payloadsubtypevalue: ""
                , knx:
                {
                    event: _event
                    , dpt: "unknown"
                    //, details: dpt
                    , dptdesc: ""
                    , source: _srcGA
                    , destination: _destGA
                    , rawValue: _Rawvalue
                }
            };

            // Resolve DPT and convert value if available
            if (_Rawvalue !== null) {
                try {
                    sInputDpt = _inputDpt === null ? tryToFigureOutDataPointFromRawValue(_Rawvalue) : _inputDpt;
                } catch (error) {
                    // Here comes if no datapoint has beeen found
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: buildInputMessage: Error returning from tryToFigureOutDataPointFromRawValue. Device " + _srcGA + " Destination " + _destGA + " Event " + _event + " GA's Datapoint " + (_inputDpt === null ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!" : _inputDpt) + " Devicename " + _devicename + " Topic " + _outputtopic + " " + error.message);
                    errorMessage.payload = "UNKNOWN: ERROR tryToFigureOutDataPointFromRawValue:" + error.message;
                    return errorMessage;
                }

                try {
                    var dpt = dptlib.resolve(sInputDpt);
                } catch (error) {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: buildInputMessage: Error returning from dptlib.resolve(sInputDpt). Device " + _srcGA + " Destination " + _destGA + " Event " + _event + " GA's Datapoint " + (_inputDpt === null ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!" : _inputDpt) + " Devicename " + _devicename + " Topic " + _outputtopic + " " + error.message);
                    errorMessage.payload = "UNKNOWN: ERROR dptlib.resolve:" + error.message;
                    return errorMessage;
                }

                if (dpt !== null && _Rawvalue !== null) {
                    try {
                        var jsValue = dptlib.fromBuffer(_Rawvalue, dpt)
                        if (jsValue === null) {
                            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: buildInputMessage: received a wrong datagram form KNX BUS, from device " + _srcGA + " Destination " + _destGA + " Event " + _event + " GA's Datapoint " + (_inputDpt === null ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!" : _inputDpt) + " Devicename " + _devicename + " Topic " + _outputtopic + " NodeID " + _oNode.id || "");
                        }
                    } catch (error) {
                        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: buildInputMessage: Error returning from DPT decoding. Device " + _srcGA + " Destination " + _destGA + " Event " + _event + " GA's Datapoint " + (_inputDpt === null ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!" : _inputDpt) + " Devicename " + _devicename + " Topic " + _outputtopic + " " + error.message + " NodeID " + _oNode.id || "");
                        errorMessage.payload = "UNKNOWN: ERROR dptlib.fromBuffer:" + error.message;
                        return errorMessage;
                    }

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
                            // Don't care
                        }
                    }
                };
            } else {
                // Don't care, it's a READ REQUEST
            }

            try {
                // Build final input message object
                let finalMessage = {
                    topic: _outputtopic
                    , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
                    , payload: jsValue
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
                // 11/11/2021 jsValue is null, as well as _Rawvalue, in case of READ REQUEST message. 
                // if (jsValue !== null) finalMessage.payload = jsValue;

                return finalMessage;
            } catch (error) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimate-config: buildInputMessage error: " + error.message);
                return errorMessage;
            }

        };


        node.on("close", function (done) {
            if (node.timerSendTelegramFromQueue !== undefined) clearInterval(node.timerSendTelegramFromQueue); // 02/01/2020 Stop queue timer
            node.lockHandleTelegramQueue = false; // Unlock the telegram handling function

            saveExposedGAs(); // 04/04/2021 save the current values of GA payload
            try {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.destroy();
            } catch (error) { }
            try {
                node.Disconnect();
            } catch (error) { }
            done();
        })

        function readCSV(_csvText) {
            // 24/02/2020, in the middle of Coronavirus emergency in Italy. Check if it a CSV ETS Export of group addresses, or if it's an EFS
            if (_csvText.split("\n")[0].toUpperCase().indexOf("\"") == -1) return readESF(_csvText);

            var ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red

            if (_csvText == "") {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: no csv ETS found');
                return;
            } else {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: csv ETS found !');
                // 23/08/2019 Delete inwanted CRLF in the GA description
                let sTemp = correctCRLFInCSV(_csvText);

                // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
                let fileGA = sTemp.split("\n");
                // Controllo se le righe dei gruppi contengono il separatore di tabulazione
                if (fileGA[0].search("\t") == -1) {
                    node.error('KNXUltimate-config: ERROR: the csv ETS file must have the tabulation as separator');
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
                                    node.error("KNXUltimate-config: ABORT IMPORT OF ETS CSV FILE. To skip the invalid datapoint and continue import, change the related setting, located in the config node in the ETS import section.");
                                    return;
                                } if (node.stopETSImportIfNoDatapoint === "fake") {
                                    // 02/03/2020 Whould you like to continue without datapoint? Good. Here a totally fake datapoint
                                    node.warn("KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to continue import with a fake datapoint 1.001. -> " + element.split("\t")[0] + " " + element.split("\t")[1]);
                                    ajsonOutput.push({ ga: element.split("\t")[1], dpt: "1.001", devicename: sFather + element.split("\t")[0] + " (DPT NOT SET IN ETS - FAKE DPT USED)" });
                                } else {
                                    // 31/03/2020 Skip import
                                    node.warn("KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to skip -> " + element.split("\t")[0] + " " + element.split("\t")[1]);
                                }
                            } else {
                                var DPTa = element.split("\t")[5].split("-")[1];
                                var DPTb = element.split("\t")[5].split("-")[2];
                                if (typeof DPTb == "undefined") {
                                    node.warn("KNXUltimate-config: WARNING: Datapoint not fully set (there is only the main type). I applied a default .001, but please check if i'ts ok ->" + element.split("\t")[0] + " " + element.split("\t")[1] + " Datapoint: " + element.split("\t")[5]);
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
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: no ESF found');
                return;
            } else {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: esf ETS found !');
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
                                node.error("KNXUltimate-config: ABORT IMPORT OF ETS ESF FILE. To continue import, change the related setting, located in the config node in the ETS import section.");
                                return;
                            } else if (node.stopETSImportIfNoDatapoint === "fake") {
                                sDPT = "5.004"; // Maybe.
                                node.error("KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to fake the datapoint -> " + sGA + ". An fake datapoint has been set: " + sDPT);
                            } else {
                                sDPT = "SKIP";
                                node.error("KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to skip -> " + sGA);
                            }
                        }
                        if (sDPT !== "SKIP") ajsonOutput.push({ ga: sGA, dpt: sDPT, devicename: "(" + sFirstGroupName + "->" + sSecondGroupName + ") " + sDeviceName });
                    }
                }
            }

            return ajsonOutput;

        }

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

        // 26/02/2021 Used to send the messages if the node gateway is in EMULATION mode
        function sendEmulatedTelegram(_msg) {
            // INPUT IS
            // _msg = {
            //     grpaddr: '5/0/1',
            //     payload: true,
            //     dpt: '1.001'       
            //   }

            // OUTPUT MUST BE:
            // {
            //     "topic": "2/4/3",
            //     "payload": 0,
            //     "devicename": "",
            //     "payloadmeasureunit": "W",
            //     "payloadsubtypevalue": "unknown",
            //     "knx": {
            //       "event": "GroupValue_Write",
            //       "dpt": "14.056",
            //       "dptdesc": "DPT_Value_Power",
            //       "source": "1.1.53",
            //       "destination": "2/4/3",
            //       "rawValue": [
            //         0,
            //         0,
            //         0,
            //         0
            //       ]
            //     },
            //     "_msgid": "c5e3a9f1.ced418"
            //   }

            try {

                // Complete the properties mancanti
                let sEvent = "GroupValue_Write";
                if (_msg.outputtype === "write") sEvent = "GroupValue_Write";
                if (_msg.outputtype === "response") sEvent = "GroupValue_Response";
                if (_msg.outputtype === "read") sEvent = "GroupValue_Read";

                node.nodeClients.forEach(input => {

                    // 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
                    if (input.hasOwnProperty("isSceneController")) {

                    } else if (input.hasOwnProperty("isLogger")) { // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node

                    } else if (input.listenallga == true) {

                        // Get the DPT
                        let oGA;
                        try {
                            oGA = node.csv.filter(sga => sga.ga == _msg.grpaddr)[0];
                        } catch (error) { }

                        let msg = {
                            topic: _msg.grpaddr,//input.topic,
                            payload: _msg.payload,
                            devicename: (typeof oGA === "undefined") ? input.name || "" : oGA.devicename,
                            payload: _msg.payload,
                            knx: { event: sEvent, dpt: _msg.dpt, destination: _msg.grpaddr },
                            emulated: true
                        };

                        input.setNodeStatus({ fill: "green", shape: "ring", text: "Emulated", payload: msg.payload, GA: input.topic, dpt: input.dpt, devicename: "" });
                        input.handleSend(msg);

                    } else if (input.topic == _msg.grpaddr) {

                        if (input.hasOwnProperty("isWatchDog")) { // 04/02/2020 Watchdog implementation
                            // Is a watchdog node

                        } else {

                            let msg = {
                                topic: input.outputtopic,
                                payload: _msg.payload,
                                devicename: input.name ? input.name : "",
                                payload: _msg.payload,
                                knx: { event: sEvent, dpt: _msg.dpt, destination: _msg.grpaddr },
                                emulated: true
                            };

                            // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                            if (!checkRBEInputFromKNXBusAllowSend(input, msg.payload)) {
                                input.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block (" + msg.payload + ") from KNX", payload: "", GA: "", dpt: "", devicename: "" })
                                return;
                            };

                            msg.previouspayload = typeof input.currentPayload !== "undefined" ? input.currentPayload : ""; // 24/01/2020 Added previous payload
                            input.currentPayload = msg.payload;// Set the current value for the RBE input
                            input.setNodeStatus({ fill: "green", shape: "ring", text: "Emulated", payload: msg.payload, GA: input.topic, dpt: input.dpt, devicename: "" });
                            input.handleSend(msg);
                        };
                    };
                });

            } catch (error) { }
        }

        // 12/11/2021 Starts the telegram out queue handler
        if (node.timerSendTelegramFromQueue !== null) clearInterval(node.timerSendTelegramFromQueue);
        node.timerSendTelegramFromQueue = setInterval(handleTelegramQueue, (config.delaybetweentelegrams === undefined || config.delaybetweentelegrams < 5) ? 40 : config.delaybetweentelegrams); // 02/01/2020 Start the timer that handles the queue of telegrams

        // 08/10/2021 Every xx seconds, i check if the connection is up and running
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Autoconnection: " + (node.autoReconnect === 0 ? "no." : "yes, in " + node.autoReconnect + " seconds.") + " Node " + node.name);
        if (node.timerKNXUltimateCheckState !== null) clearInterval(node.timerKNXUltimateCheckState);
        if (node.autoReconnect > 0) {
            node.timerKNXUltimateCheckState = setInterval(() => {
                if (node.linkStatus === "disconnected" && node.autoReconnect > 0) node.initKNXConnection();
            }, node.autoReconnect * 1000);
        }



    }




    //RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode);
    RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode, {
        credentials: {
            keyringFilePassword: { type: "password" }
        }
    });
}
