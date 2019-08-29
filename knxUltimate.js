module.exports = function (RED) {
    function knxUltimate(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.topic = config.topic
        node.dpt = config.dpt || "1.001"
        node.notifyreadrequest = config.notifyreadrequest || false
        node.notifyresponse = config.notifyresponse || false
        node.notifywrite = config.notifywrite
        node.initialread = config.initialread || false
        node.listenallga = config.listenallga || false
        node.outputtype = config.outputtype || "write" // When the node is used as output
        node.outputRBE = config.outputRBE || "false" // Apply or not RBE to the input
        node.inputRBE = config.inputRBE || "false" // Apply or not RBE to the input
        node.currentPayload = "" // Current value for the RBE input
        node.icountMessageInWindow = 0; // Used to prevent looping messages

         // Check if the node has a valid topic and dpt
        if(node.listenallga==false){
            if (typeof node.topic == "undefined" || typeof node.dpt == "undefined") {
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Empty group address (topic) or datapoint." })
                return;
            } else {
            
                // Topic must be in formar x/x/x
                if (node.topic.split("\/").length < 3) {
                    node.setNodeStatus({ fill: "red", shape: "dot", text: "Wrong group address (topic: " + node.topic + ") format." })
                    return;
                }
            }
        }

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text }) => {
            if (node.icountMessageInWindow == -999) return; // Locked out, doesn't change status.
            var dDate = new Date();
            node.status({fill: fill,shape: shape,text: text + " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")"})
        }

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;
            if (!node.server) return; // 29/08/2019 Server not instantiate
            if (node.server.linkStatus !== "connected") {
                //node.setNodeStatus({ fill: "red", shape: "ring", text: "Lost link due to a connection error" });
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
                        node.setNodeStatus({ fill: "grey", shape: "dot", text: "Read (" + grpaddr + ")" });
                        node.server.readValue(grpaddr)
                    } else { // Listen all GAs
                        if (msg.destination) {
                            // listenallga is true, but the user specified own group address
                            grpaddr = msg.destination
                            node.server.readValue(grpaddr)
                        } else {
                           // Issue read to all group addresses
                            let delay = 0;
                            for (let index = 0; index < node.server.csv.length; index++) {
                                const element = node.server.csv[index];
                                setTimeout(() => {
                                    node.server.readValue(element.ga);
                                    node.setNodeStatus({ fill: "yellow", shape: "dot", text: "Request (" + element.ga + ")" });
                                }, delay);
                                delay = delay + 200;
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
                            node.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block ("+msg.payload+") to KNX"})
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
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "DISABLED! Looping detected! Check your flow's design or use RBE option." })
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
                            // The node is set to listen to all Group Addresses. The msg.knx.destination is needed.
                            if (msg.destination) {
                                grpaddr = msg.destination;
                            } else {
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "msg.destination not set!" })
                                return;
                            }
                        } else {
                            grpaddr = msg.destination
                            ? msg.destination
                            : node.topic
                        }
                        
                        if (node.listenallga==true) {
                            // The node is set to listen to all Group Addresses. Gets the datapoint from the CSV or use the msg.dpt.
                            if (msg.dpt) {
                                dpt = msg.dpt;
                            } else {
                                // Get the datapoint from the CSV
                                let oGA=node.server.csv.filter(sga => sga.ga == grpaddr)[0]
                                dpt=oGA.dpt
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
                                    node.setNodeStatus({ fill: "red", shape: "ring", text: "Node DISABLED due to a circulare reference (" + grpaddr + "). Two nodes with same group address are linked. Unlink it." })
                                }, 1000);
                                //node.server.removeClient(node);
                                return;
                            }
                        }
                        if (outputtype == "response") {
                            try {
                                node.server.knxConnection.respond(grpaddr, msg.payload, dpt);
                                node.setNodeStatus({ fill: "green", shape: "dot", text: "Respond (" + grpaddr + ") " + msg.payload + " dpt:" + dpt });
                            } catch (error) {}
                        } else {
                            try {
                                node.server.knxConnection.write(grpaddr, msg.payload, dpt);
                                node.setNodeStatus({ fill: "green", shape: "dot", text: "Write (" + grpaddr + ") " + msg.payload + " dpt:" + dpt });
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
