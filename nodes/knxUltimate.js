module.exports = function (RED) {

    function knxUltimate(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.topic = config.topic
        node.outputtopic = (typeof config.outputtopic === "undefined" || config.outputtopic == "") ? config.topic : config.outputtopic; // 07/02/2020 Importante, per retrocompatibilità
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
        node.messageQueue = []; // 01/01/2020 All messages from the flow to the node, will be queued and will be sent separated by 60 milliseconds each. Use uf the underlying api "minimumDelay" is not possible because the telegram order isn't mantained.
        node.formatmultiplyvalue = (typeof config.formatmultiplyvalue === "undefined" ? 1 : config.formatmultiplyvalue);
        node.formatnegativevalue = (typeof config.formatnegativevalue === "undefined" ? "leave" : config.formatnegativevalue);
        node.formatdecimalsvalue = (typeof config.formatdecimalsvalue === "undefined" ? 999 : config.formatdecimalsvalue);
        node.passthrough = (typeof config.passthrough === "undefined" ? "no" : config.passthrough);
        node.inputmessage = {}; // Stores the input message to be passed through
        node.timerTTLInputMessage = null; // The stored node.inputmessage has a ttl.

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.server == null) { node.status({ fill: "red", shape: "dot", text: "[NO GATEWAY SELECTED]"}); return; }
            if (node.icountMessageInWindow == -999) return; // Locked out, doesn't change status.
            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint === true ? _dpt : "") + (node.server.statusDisplayLastUpdate === true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
            // 16/02/2020 signal errors to the server
            if (fill.toUpperCase() == "RED") {
                if (node.server) {
                    var oError = { nodeid: node.id, topic: node.outputtopic, devicename: _devicename, GA: _GA, text: text };
                    node.server.reportToWatchdogCalledByKNXUltimateNode(oError);
                };
            };
        }

        // Check if the node has a valid topic and dpt
        if (node.listenallga == false) {
            if (typeof node.topic == "undefined" || typeof node.dpt == "undefined") {
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Empty Group Addr. or datapoint.", payload: "", GA: "", dpt: "", devicename: "" })
                return;
            } else {

                // topic must be in formar x/x/x
                if (node.topic.split("\/").length < 3) {
                    node.setNodeStatus({ fill: "red", shape: "dot", text: "Wrong group address format.", payload: "", GA: node.topic, dpt: "", devicename: "" })
                    return;
                }
            }
        }

        // This function is called by the knx-ultimate config node, to output a msg.payload.
        node.handleSend = msg => {
            // 27/03/2020 can i merge the last input msg arrived, with the output?
            try {
                if (node.passthrough === "yes") {
                    // Respect the order! Object.assign(target, master). On master will be copied to target and properties of master will overwrite the same properties on target!
                    if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
                    msg = Object.assign(RED.util.cloneMessage(node.inputmessage), msg);
                    node.inputmessage = {};
                } else if (node.passthrough === "yesownprop") {
                    // Yes, but in an own prop
                    if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
                    msg.inputmessage = RED.util.cloneMessage(node.inputmessage);
                    node.inputmessage = {};
                }
            } catch (error) { }
            node.send(msg);
        };

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;
            if (!node.server) return; // 29/08/2019 Server not instantiate

            // 02/10/2020 is now handled in the connection.js API. Search for isTunnelConnected
            // if (node.server.linkStatus !== "connected") {
            //     RED.log.error("knxUltimate: KNX link is disconnected");
            //     return; // 29/08/2019 If not connected, exit
            // }

            if (node.passthrough !== "no") { // 27/03/2020 Save the input message to be passed out to msg output
                // The msg has a TTL of 3 seconds
                if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
                node.timerTTLInputMessage = setTimeout(function () { node.inputmessage = {}; }, 3000);
                node.inputmessage = msg;   // 28/03/2020 Store the message to be passed through.
            }

            // 25/07/2019 if payload is read or the output type is set to "read", do a read, otherwise, write to the bus
            if ((msg.hasOwnProperty('readstatus') && msg.readstatus === true) || node.outputtype === "read") {
                // READ: Send a Read request to the bus
                var grpaddr = ""
                if (node.listenallga == false) {
                    grpaddr = msg && msg.destination ? msg.destination : node.topic
                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Read", payload: "", GA: grpaddr, dpt: node.dpt, devicename: "" });
                    node.server.writeQueueAdd({ grpaddr: grpaddr, payload: "", dpt: "", outputtype: "read", nodecallerid: node.id });
                } else { // Listen all GAs
                    if (msg.hasOwnProperty("destination")) {
                        // listenallga is true, but the user specified own group address
                        grpaddr = msg.destination
                        node.server.writeQueueAdd({ grpaddr: grpaddr, payload: "", dpt: "", outputtype: "read", nodecallerid: node.id });
                    } else {
                        // Issue read to all group addresses
                        // 25/10/2019 the user is able not import the csv, so i need to check for it. This option should be unckecked by the knxUltimate html config, but..
                        if (typeof node.server.csv !== "undefined") {
                            let delay = 0;
                            for (let index = 0; index < node.server.csv.length; index++) {
                                const element = node.server.csv[index];
                                node.server.writeQueueAdd({ grpaddr: element.ga, payload: "", dpt: "", outputtype: "read", nodecallerid: node.id });
                                setTimeout(() => {
                                    // Timeout is only for the status update.
                                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Add Read to queue...", payload: "", GA: element.ga, dpt: element.dpt, devicename: element.devicename });
                                }, delay);
                                delay = delay + 10;
                            }
                        } else {
                            // No csv. A chi cavolo dovrei mandare la richiesta read?
                            setTimeout(() => {
                                // Timeout is only for the status update.
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "Read: ETS file not set, i don't know where to send the read request.", payload: "", GA: "", dpt: "", devicename: node.name });
                                RED.log.error("KNX-Ultimate: ETS file not set, i don't know where to send the read request. I'm the node " + node.id);
                            }, 100);
                        }
                    }
                }
            } else {
                if (node.listenallga == false) {
                    // Applying RBE filter
                    if (node.outputRBE == true) {
                        var curVal = node.currentPayload.toString().toLowerCase();
                        var newVal = msg.payload.toString().toLowerCase();
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
                            node.setNodeStatus({ fill: "grey", shape: "ring", text: "rbe block (" + msg.payload + ") to KNX", payload: "", GA: "", dpt: "", devicename: "" })
                            return;
                        }
                    }
                }
                // 07/02/2020 Revamped flood protection (avoid accepting too many messages as input)
                if (node.icountMessageInWindow == -999) return; // Locked out
                if (node.icountMessageInWindow == 0) {
                    setTimeout(() => {
                        if (node.icountMessageInWindow >= 120) {
                            // Looping detected
                            node.setNodeStatus({ fill: "red", shape: "ring", text: "DISABLED! Flood protection! Too many msg at the same time.", payload: "", GA: "", dpt: "", devicename: "" })
                            RED.log.error("knxUltimate: Node " + node.id + " has been disabled due to Flood Protection. Too many messages in a timeframe. Check your flow's design or use RBE option.");
                            node.icountMessageInWindow = -999; //Lock out node
                            return;
                        } else { node.icountMessageInWindow = -1; }
                    }, 1000);
                }
                node.icountMessageInWindow += 1;


                // OUTPUT: Send message to the bus (write/response)
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
                    if (node.listenallga == true) {
                        // The node is set to Universal mode (listen to all Group Addresses). The msg.knx.destination is needed.
                        if (msg.destination) {
                            grpaddr = msg.destination;
                        } else {
                            node.setNodeStatus({ fill: "red", shape: "dot", text: "msg.destination not set!", payload: "", GA: "", dpt: "", devicename: "" })
                            return;
                        }
                    } else {
                        grpaddr = msg.destination
                            ? msg.destination
                            : node.topic
                    }

                    if (node.listenallga == true) {
                        // The node is set to Universal mode (listen to all Group Addresses). Gets the datapoint from the CSV or use the msg.dpt.
                        if (msg.dpt) {
                            dpt = msg.dpt;
                        } else {
                            // Get the datapoint from the CSV
                            if (typeof node.server.csv !== "undefined") {
                                let oGA = node.server.csv.filter(sga => sga.ga == grpaddr)[0]
                                dpt = oGA.dpt
                            } else {
                                node.setNodeStatus({ fill: "red", shape: "dot", text: "msg.dpt not set!", payload: "", GA: "", dpt: "", devicename: "" })
                                return;
                            }
                        }
                    } else {
                        dpt = msg.dpt
                            ? msg.dpt
                            : node.dpt
                    }
                    // Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
                    // if (msg.hasOwnProperty('topic')) { 
                    if (msg.hasOwnProperty('knx')) {
                        //if (msg.topic == grpaddr && msg.knx !== undefined) { // 07/02/2020 changed, to allow topic customization asked by users.
                        if (msg.knx.destination == grpaddr) { // 07/02/2020 changed, to allow topic customization asket by users.
                            RED.log.error("knxUltimate: Circular reference protection. The node " + node.id + " has been disabled. Two nodes with same group address are linked. See the FAQ in the Wiki. Msg:" + JSON.stringify(msg));
                            setTimeout(() => {
                                node.setNodeStatus({ fill: "red", shape: "ring", text: "DISABLED due to a circulare reference (" + grpaddr + ").", payload: "", GA: "", dpt: "", devicename: "" })
                            }, 1000);
                            return;
                        }
                    }
                    if (outputtype == "response") {
                        try {
                            node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
                            node.server.writeQueueAdd({ grpaddr: grpaddr, payload: msg.payload, dpt: dpt, outputtype: outputtype, nodecallerid: node.id })
                            node.setNodeStatus({ fill: "blue", shape: "dot", text: "Responding", payload: msg.payload, GA: grpaddr, dpt: dpt, devicename: "" });
                        } catch (error) { }
                    } else {
                        try {
                            node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
                            node.server.writeQueueAdd({ grpaddr: grpaddr, payload: msg.payload, dpt: dpt, outputtype: outputtype, nodecallerid: node.id })
                            node.setNodeStatus({ fill: "green", shape: "dot", text: "Writing", payload: msg.payload, GA: grpaddr, dpt: dpt, devicename: "" });
                        } catch (error) { }
                    }
                }
            }


        })

        node.on("close", function (done) {
            if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
            node.inputmessage = {};
            if (node.server) {
                node.server.removeClient(node);
            }
            done();
        })

        // On each deploy, unsubscribe+resubscribe
        if (node.server) {
            node.server.removeClient(node);
            if (node.topic || node.listenallga) {
                node.server.addClient(node);
            }

        }


    }
    RED.nodes.registerType("knxUltimate", knxUltimate)
}
