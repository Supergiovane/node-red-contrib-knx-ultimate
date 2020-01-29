module.exports = function (RED) {
    function knxUltimate(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.topic = config.topic
        node.dpt = config.dpt || "1.001"
        node.notifyreadrequest = config.notifyreadrequest || false
        node.notifyreadrequestalsorespondtobus = config.notifyreadrequestalsorespondtobus || "false";  // Auto respond if notifireadrequest is true
        node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = config.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized || "";
        node.notifyresponse = config.notifyresponse || false
        node.notifywrite = config.notifywrite
        node.initialread = config.initialread || false
        node.listenallga = config.listenallga || false
        node.outputtype = config.outputtype || "write" // When the node is used as output
        node.outputRBE = config.outputRBE || "false" // Apply or not RBE to the input
        node.inputRBE = config.inputRBE || "false" // Apply or not RBE to the input
        node.currentPayload = "" // Current value for the RBE input and for the .previouspayload msg
        node.icountMessageInWindow = 0; // Used to prevent looping messages
        node.messageQueue = []; // 01/01/2020 All messages from the flow to the node, will be queued and will be sent separated by 60 milliseconds each. Use uf the underlying knx.js "minimumDelay" is not possible because the telegram order isn't mantained.
         
        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.icountMessageInWindow == -999) return; // Locked out, doesn't change status.
            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA= (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt= (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) == true ? " " + _devicename : "") +(node.server.statusDisplayDataPoint == true ? _dpt : "") + (node.server.statusDisplayLastUpdate == true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
        }

        // Check if the node has a valid topic and dpt
        if(node.listenallga==false){
            if (typeof node.topic == "undefined" || typeof node.dpt == "undefined") {
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Empty group address (topic) or datapoint.",payload: "", GA: "", dpt:"", devicename:"" })
                return;
            } else {
            
                // Topic must be in formar x/x/x
                if (node.topic.split("\/").length < 3) {
                    node.setNodeStatus({ fill: "red", shape: "dot", text: "Wrong group address format.",payload: "", GA: node.topic, dpt:"", devicename:""})
                    return;
                }
            }
        }

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;
            if (typeof msg.payload === "undefined" || typeof msg.payload === "object" || typeof msg.payload === "function") // 16/01/2020 Check for invalid payload
            {
                // 29/01/2020 If the message has no payload and no readstatus and isn't a dim command, throw an error. (If you requests a readstatus, there's no need to pass a payload)
                if (!msg.hasOwnProperty("readstatus") && !msg.payload.hasOwnProperty("decr_incr")) {
                    node.setNodeStatus({ fill: "red", shape: "dot", text: "Payload must be string, number or boolean", payload: "", GA: "", dpt: "", devicename: "" })
                    RED.log.error("knxUltimate: Node " + node.id + " has received an INVALID payload. Please check the flow.");
                    return; 
                }
            }
                
            
            if (!node.server) return; // 29/08/2019 Server not instantiate
            if (node.server.linkStatus !== "connected") {
                RED.log.error("knxUltimate: Lost link due to a connection error");
                return; // 29/08/2019 If not connected, exit
            }
            // 25/07/2019 if payload is read, do a read, otherwise, write to the bus
            if (msg.hasOwnProperty('readstatus') && msg.readstatus === true) {
                // READ: Send a Read request to the bus
                if (node.server) {
                    var grpaddr = ""
                    if (node.listenallga==false) {
                        grpaddr = msg && msg.destination ? msg.destination : node.topic
                        node.setNodeStatus({ fill: "grey", shape: "dot", text: "Read",payload: "", GA: grpaddr, dpt:node.dpt, devicename:"" });
                        node.server.readValue(grpaddr)
                    } else { // Listen all GAs
                        if (msg.destination) {
                            // listenallga is true, but the user specified own group address
                            grpaddr = msg.destination
                            node.server.readValue(grpaddr)
                        } else {
                           // Issue read to all group addresses
                            // 25/10/2019 the user is able not import the csv, so i need to check for it. This option should be unckecked by the knxUltimate html config, but..
                            if (typeof node.server.csv !== "undefined")
                            {
                                let delay = 0;
                                for (let index = 0; index < node.server.csv.length; index++) {
                                    const element = node.server.csv[index];
                                    setTimeout(() => {
                                        node.server.readValue(element.ga);
                                        node.setNodeStatus({ fill: "yellow", shape: "dot", text: "Read",payload:"", GA: element.ga, dpt:element.dpt, devicename:element.devicename });
                                    }, delay);
                                    delay = delay + 200;
                                }    
                            }
                            
                            // setTimeout(() => {
                            //     node.setNodeStatus({ fill: "yellow", shape: "dot", text: "Done requests." });
                            // }, delay+500);
                        }
                    }
                 }
            } else {
                if (node.listenallga == false) {
                    // Applying RBE filter
                    if (node.outputRBE==true) {
                        var curVal=node.currentPayload.toString().toLowerCase();
                        var newVal=msg.payload.toString().toLowerCase();
                        if (curVal==="false") {
                            curVal = "0";
                        }
                        if (curVal==="true") {
                            curVal = "1";
                        }
                        if (newVal==="false") {
                            newVal = "0";
                        }
                        if (newVal==="true") {
                            newVal = "1";
                        }
                        if (curVal === newVal) {
                            node.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block ("+msg.payload+") to KNX", payload:"", GA: "", dpt:"", devicename:""})
                            return;
                        }
                    }
                }   
                // Anti looping check
                if (node.icountMessageInWindow == -999) return; // Locked out
                if (node.icountMessageInWindow == 0) {
                    setTimeout(() => {
                        if (node.icountMessageInWindow >= 80) {
                            // Looping detected
                            setTimeout(() => {
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "DISABLED! Looping detected! Check your flow's design or use RBE option.", payload:"", GA: "", dpt:"", devicename:"" })
                                RED.log.error("knxUltimate: Node " + node.id + " has been disabled due to loop detection. Check your flow's design or use RBE option.");
                            }, 1000);
                            node.icountMessageInWindow = -999; //Lock out node
                            return;
                        }else{node.icountMessageInWindow = -1;}
                    }, 1000);
                } 
                node.icountMessageInWindow += 1;
                        

                // OUTPUT: Send message to the bus (write/response)
                if (node.server) {
                    if (node.server.knxConnection) {
                        let outputtype =
                            msg.event
                                ? msg.event == "GroupValue_Response"
                                    ? "response"
                                    : msg.event == "GroupValue_Write"
                                        ? "write"
                                        : node.outputtype
                                : node.outputtype
                        
                        var grpaddr = "";
                        var dpt = "";
                        if (node.listenallga==true) {
                            // The node is set to Universal mode (listen to all Group Addresses). The msg.knx.destination is needed.
                            if (msg.destination) {
                                grpaddr = msg.destination;
                            } else {
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "msg.destination not set!" ,payload:"", GA: "", dpt:"", devicename:""})
                                return;
                            }
                        } else {
                            grpaddr = msg.destination
                            ? msg.destination
                            : node.topic
                        }
                        
                        if (node.listenallga==true) {
                            // The node is set to Universal mode (listen to all Group Addresses). Gets the datapoint from the CSV or use the msg.dpt.
                            if (msg.dpt) {
                                dpt = msg.dpt;
                            } else {
                                // Get the datapoint from the CSV
                                if (typeof node.server.csv !== "undefined") {
                                    let oGA = node.server.csv.filter(sga => sga.ga == grpaddr)[0]
                                    dpt = oGA.dpt
                                } else
                                {
                                    node.setNodeStatus({ fill: "red", shape: "dot", text: "msg.dpt not set!" ,payload:"", GA: "", dpt:"", devicename:""})
                                    return;
                                }
                            }
                        } else {
                            dpt = msg.dpt
                            ? msg.dpt
                            : node.dpt
                        }
                        // Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
                        if (msg.hasOwnProperty('topic')) { 
                            if (msg.topic == grpaddr && msg.knx) {
                                RED.log.error("knxUltimate: Circular reference protection. The node " + node.id + " has been disabled. " + JSON.stringify(msg));
                                setTimeout(() => {
                                    node.setNodeStatus({ fill: "red", shape: "ring", text: "Node DISABLED due to a circulare reference (" + grpaddr + "). Two nodes with same group address are linked. Unlink it.",payload:"", GA: "", dpt:"", devicename:"" })
                                }, 1000);
                                //node.server.removeClient(node);
                                return;
                            }
                        }
                        if (outputtype == "response") {
                            try {
                                node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
                                //node.server.knxConnection.respond(grpaddr, msg.payload, dpt);
                                node.server.writeQueueAdd({ grpaddr: grpaddr, payload:msg.payload,dpt:dpt,outputtype:outputtype})
                                node.setNodeStatus({ fill: "blue", shape: "dot", text: "Responding",payload: msg.payload, GA: grpaddr, dpt:dpt, devicename:"" });
                            } catch (error) {}
                        } else {
                            try {
                                node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
                                //node.server.knxConnection.write(grpaddr, msg.payload, dpt);
                                node.server.writeQueueAdd({ grpaddr: grpaddr, payload:msg.payload,dpt:dpt,outputtype:outputtype})
                                node.setNodeStatus({ fill: "green", shape: "dot", text: "Writing",payload: msg.payload, GA: grpaddr, dpt:dpt, devicename:"" });
                            } catch (error) {}
                        }
                    }
                }
            }
            
            
        })
        
        node.on('close', function () {
            if (node.server) {
                node.server.removeClient(node)
            }
        })

        // On each deploy, unsubscribe+resubscribe
        // Unsubscribe(Subscribe)
        if (node.server) {
            node.server.removeClient(node);
            //node.setNodeStatus({ fill: "grey", shape: "ring", text: "Unsubscribed" });
            if (node.topic || node.listenallga) {
                node.server.addClient(node);
                //(node.setNodeStatus({ fill: "green", shape: "ring", text: "Ready" })
            }
            
        }
       
			
    }
    RED.nodes.registerType("knxUltimate", knxUltimate)
}
