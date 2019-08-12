const knx = require('knx')
const dptlib = require('knx/src/dptlib')

//Helpers
sortBy = (field) => (a, b) => {
    if (a[field] > b[field]) { return 1 } else { return -1 }
}


onlyDptKeys = (kv) => {
    return kv[0].startsWith("DPT")
}

extractBaseNo = (kv) => {
    return {
        subtypes: kv[1].subtypes,
        base: parseInt(kv[1].id.replace("DPT", ""))
    }
}

convertSubtype = (baseType) => (kv) => {
    let value = `${baseType.base}.${kv[0]}`
    return {
        value: value
        , text: value + ` (${kv[1].name})`
    }
}


toConcattedSubtypes = (acc, baseType) => {
    let subtypes =
        Object.entries(baseType.subtypes)
            .sort(sortBy(0))
            .map(convertSubtype(baseType))

    return acc.concat(subtypes)
}



module.exports = (RED) => {


    RED.httpAdmin.get("/knxUltimateDpts", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
        const dpts =
            Object.entries(dptlib)
                .filter(onlyDptKeys)
                .map(extractBaseNo)
                .sort(sortBy("base"))
                .reduce(toConcattedSubtypes, [])

        res.json(dpts)
    })

    function knxUltimateConfigNode(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.host = config.host
        node.port = config.port
        node.physAddr = config.physAddr || "15.15.22"; // the KNX physical address we'd like to use
        node.suppress_ack_ldatareq = config.suppress_ack_ldatareq || false; // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
        node.csv = readCSV(config.csv); // Array from ETS CSV Group Addresses

        // Entry point for reading csv from the other nodes
        RED.httpAdmin.get("/knxUltimatecsv", RED.auth.needsPermission('knxUltimate-config.read'), function (req, res) {
           
            res.json(node.csv)
        });
        
       
        var knxErrorTimeout;
        node.nodeClients = [] // Stores the registered clients
      
        node.addClient = (_Node) => {

         // Check if the node has a valid topic and dpt
            if (_Node.listenallga==false) {
                if (typeof _Node.topic == "undefined" || typeof _Node.dpt == "undefined") {
                    _Node.status({ fill: "red", shape: "dot", text: "Empty group address (topic) or datapoint." })
                    return;
                } else {
          
                    // Topic must be in formar x/x/x
                    if (_Node.topic.split("\/").length < 3) {
                        _Node.status({ fill: "red", shape: "dot", text: "Wrong group address (topic: " + _Node.topic + ") format." })
                        return;
                    }
                }
            }

            // Add _Node to the clients array
            node.nodeClients.push(_Node)
            if (node.status === "connected" && _Node.initialread) {
                node.readValue(_Node.topic);
            }
            // At first node client connection, this node connects to the bus
            if (node.nodeClients.length === 1) {
                node.connect();
            }
        }

      
        node.removeClient = (_Node) => {
            // Remove the client node from the clients array
            // RED.log.info(node.nodeClients.length + "Node " + node.id + " has been unsubscribed from receiving KNX messages. ");
            try {node.nodeClients = node.nodeClients.filter(x => x.id !== _Node.id)
            } catch (error) {}
            
              // If no clien nodes, disconnect from bus.
            if (node.nodeClients.length === 0) {
                node.Disconnect();
                node.knxConnection = null;
            }
        }
      
        
        node.readInitialValues = () => {
            var readHistory = []
            let delay = 50
            node.nodeClients
                .filter(oClient => oClient.initialread)
                .forEach(oClient => {
                    if (oClient.listenallga==true) {
                        delay = delay + 60
                        for (let index = 0; index < node.csv.length; index++) {
                            const element = node.csv[index];
                            if (readHistory.includes(element.ga)) return
                            setTimeout(() => node.readValue(element.ga), delay)
                            readHistory.push(element.ga)
                        }
                    } else {
                        if (readHistory.includes(oClient.topic)) return
                        setTimeout(() => node.readValue(oClient.topic), delay)
                        delay = delay + 60
                        readHistory.push(oClient.topic)
                    }
                    
                })
        }
       
    
        node.readValue = topic => {
            if (node.knxConnection) {
                try {
                    node.knxConnection.read(topic)
                } catch (error) {
                    RED.log.error('knxUltimate readValue: (' + topic + ') ' + error);
                }
                
            }
        }
        
        node.setAllClientsStatus = (_status, _color, _text) => {
            node.status = _status
            function nextStatus(oClient) {
                oClient.setStatus( _color, "dot", "(" + oClient.topic + ") " + _status + " " + _text )
            }
            node.nodeClients.map(nextStatus)
        }
        
        node.connect = () => {
            
            node.setAllClientsStatus("Waiting", "grey", "")
            node.knxConnection = new knx.Connection({
                ipAddr: node.host,
                ipPort: node.port,
                physAddr: node.physAddr, // the KNX physical address we'd like to use
                suppress_ack_ldatareq:node.suppress_ack_ldatareq,
                handlers: {
                    connected: () => {
                        if (knxErrorTimeout == undefined) {
                            node.setAllClientsStatus("connected", "green", "")
                            node.readInitialValues() // Perform initial read if applicable
                        }
                    },
                    error: function(connstatus) {
                        node.error(connstatus);
                            if (connstatus == "E_KNX_CONNECTION") {
                                node.setAllClientsStatus("knxError", "yellow", "Error KNX BUS communication")
                            } else {
                                node.setAllClientsStatus("Waiting", "grey", "")
                            }
                    }
                }
            })
            
            // Handle BUS events
            node.knxConnection.on("event", function (evt, src, dest, rawValue) {
                //RED.log.info(src + " " + dest + " " + evt)
                switch (evt) {
                    case "GroupValue_Write": {
                        
                        node.nodeClients
                            .filter(input => input.notifywrite)
                            .forEach(input => {
                                if (input.listenallga==true) {
                                    // Get the GA from CVS
                                    let oGA = node.csv.filter(sga => sga.ga == dest)[0]
                                    let msg = buildInputMessage(src, dest, evt, rawValue, oGA.dpt, oGA.devicename)
                                    input.setStatus("green","dot","(" + msg.knx.destination + ") " + msg.payload + " dpt:" + msg.knx.dpt);
                                    input.send(msg)
                                } else if (input.topic == dest) {
                                    let msg = buildInputMessage(src, dest, evt, rawValue, input.dpt, input.name ? input.name :"")
                                    input.currentPayload = msg.payload;// Set the current value for the RBE input
                                    input.setStatus("green", "dot", "(" + input.topic + ") " + msg.payload);
                                    input.send(msg)
                                }
                            })
                        break;
                    }
                    case "GroupValue_Response": {
                        
                        node.nodeClients
                            .filter(input => input.notifyresponse)
                            .forEach(input => {
                                if (input.listenallga==true) {
                                    // Get the DPT
                                    let oGA = node.csv.filter(sga => sga.ga == dest)[0]
                                    let msg = buildInputMessage(src, dest, evt, rawValue, oGA.dpt, oGA.devicename)
                                    input.setStatus("blue", "dot", "(" + msg.knx.destination + ") " + msg.payload + " dpt:" + msg.knx.dpt);
                                    input.send(msg)
                                } else if (input.topic == dest) {
                                    let msg = buildInputMessage(src, dest, evt, rawValue, input.dpt, input.name ? input.name :"")
                                    input.currentPayload = msg.payload; // Set the current value for the RBE input
                                    input.setStatus("blue", "dot", "(" + input.topic + ") " + msg.payload);
                                    input.send(msg)
                                }
                            })
                        break;
                    }
                    case "GroupValue_Read": {
                        
                        node.nodeClients
                            .filter(input => input.notifyreadrequest)
                            .forEach(input => {
                                if (input.listenallga==true) {
                                    // Get the DPT
                                    let oGA = node.csv.filter(sga => sga.ga == dest)[0]
                                    let msg = buildInputMessage(src, dest, evt, null, oGA.dpt, oGA.devicename)
                                    input.setStatus("grey", "dot","(" + msg.knx.destination + ") read dpt:" + msg.knx.dpt);
                                    input.send(msg)
                                } else if (input.topic == dest) {
                                    let msg = buildInputMessage(src, dest, evt, null, input.dpt, input.name ? input.name :"")
                                    input.setStatus("grey", "dot", "(" + input.topic + ") read");
                                    input.send(msg)
                                }
                            })
                        break;
                    }
                    default: return
                }
            })
        }

        node.Disconnect = () => {
            node.setAllClientsStatus("Waiting", "grey", "")
        }

        function buildInputMessage(src, dest, evt, value, inputDpt, _devicename) {
            // Resolve DPT and convert value if available
            var dpt = dptlib.resolve(inputDpt)
            var jsValue = null
            if (dpt && value) {
                var jsValue = dptlib.fromBuffer(value, dpt)
            }

            // Build final input message object
            return {
                topic: dest
                , payload: jsValue
                , knx:
                {
                    event: evt
                    , dpt: inputDpt
                    //, dptDetails: dpt
                    , source: src
                    , destination: dest
                    , rawValue: value
                }
                , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
            }
        }
    

        node.on("close", function () {
            node.setAllClientsStatus("Waiting","grey","")
            node.knxConnection = null
        })
 
        function readCSV(_csvText) {
                
            var ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red
           
            if (_csvText == "") {
                RED.log.info('knxUltimate: no csv ETS found');
                return;
            } else {
                RED.log.info('knxUltimate: csv ETS found !');
                // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
                let fileGA = _csvText.split("\n");
                // Controllo se le righe dei gruppi contengono il separatore di tabulazione
                if (fileGA[0].search("\t") == -1) {
                    RED.log.error('knxUltimate: ERROR: the csv ETS file must have the tabulation as separator')
                    return;
                }
    
                var sFirstGroupName = "";
                var sSecondGroupName = "";
                var sFather="";
                for (let index = 0; index < fileGA.length; index++) {
                    const element = fileGA[index].replace(/\"/g, ""); // Rimuovo le virgolette
                    if (element !== "") {
                        
                        // Main and secondary group names
                        if ((element.split("\t")[1].match(/-/g) || []).length == 2) {
                            // Found main group family name (Example Light Actuators)
                            sFirstGroupName = element.split("\t")[0] || "";
                            sSecondGroupName = "";
                        }
                        if ((element.split("\t")[1].match(/-/g)||[]).length==1) {
                            // Found second group family name (Example First Floor light)
                            sSecondGroupName = element.split("\t")[0] || "";
                        }
                        if(sFirstGroupName!=="" && sSecondGroupName !==""){sFather="(" + sFirstGroupName + "->" +sSecondGroupName + ") " }
                       
                        if (element.split("\t")[1].search("-") == -1 && element.split("\t")[1].search("/") !== -1) {
                            // Ho trovato una riga contenente un GA valido, cioè con 2 "/"
                            if (element.split("\t")[5] == "") {
                                RED.log.error("knxUltimate: ERROR: Datapoint not set in ETS CSV. Please set the datapoint with ETS and export the group addresses again. ->" + element.split("\t")[0] + " " + element.split("\t")[1])
                                return;
                            }
                            var DPTa = element.split("\t")[5].split("-")[1];
                            var DPTb = element.split("\t")[5].split("-")[2];
                            if (typeof DPTb == "undefined") {
                                RED.log.warn("knxUltimate: WARNING: Datapoint not fully set (there is only the first part on the left of the '.'). I applied a default .001, but please set the datapoint with ETS and export the group addresses again. ->" + element.split("\t")[0] + " " + element.split("\t")[1] + " Datapoint: " + element.split("\t")[5] );
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
                            ajsonOutput.push({ga:element.split("\t")[1], dpt:DPTa + "." + DPTb, devicename: sFather + element.split("\t")[0]});
                        }
                    }
                }
                
                return ajsonOutput;
            }
    
        }
    
    }

   

    RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode);
}


