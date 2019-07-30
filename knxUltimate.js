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
        
         // Check if the node has a valid topic and dpt
         if (typeof node.topic == "undefined" || typeof node.dpt == "undefined") {
            node.status({ fill: "red", shape: "dot", text: "Empty group address (topic) or datapoint." })
            return;
        } else {
          
            // Topic must be in formar x/x/x
            if (node.topic.split("\/").length < 3) {
                node.status({ fill: "red", shape: "dot", text: "Wrong group address (topic: " + node.topic + ") format." })
                return;
            }
        }

        node.on("input", function (msg) {
            // 25/07/2019 if payload is read, do a read, otherwise, write to the bus
            if (msg.hasOwnProperty('readstatus') && msg.readstatus === true) {
                // READ: Send a Read request to the bus
                if (node.server) {
                    var grpaddr = ""
                    if (!node.listenallga) {
                        grpaddr = msg.knx && msg.knx.destination ? msg.knx.destination : node.topic
                        node.server.readValue(grpaddr)
                    } else { // Listen all GAs
                        if (msg.knx && msg.knx.destination) {
                            // listenallga is true, but the user specified own group address
                            grpaddr = msg.knx.destination
                            node.server.readValue(grpaddr)
                        } else {
                           // Issue read to all group addresses
                            for (let index = 0; index < node.server.csv.length; index++) {
                                const element = node.server.csv[index];
                                node.server.readValue(element.ga)}
                        }
                       
                    }
                        
                 }
            } else {
                // OUTPUT: Send message to the bus (write/response)
                if (node.server) {
                    if (node.server.knxConnection) {
                        let outputtype =
                            msg.knx && msg.knx.event
                                ? msg.knx.event == "GroupValue_Response"
                                    ? "response"
                                    : msg.knx.event == "GroupValue_Write"
                                        ? "write"
                                        : node.outputtype
                                : node.outputtype
                        
                        var grpaddr = "";
                        var dpt = "";
                        if (node.listenallga) {
                            // The node is set to listen to all Group Addresses. The msg.knx.destination is needed.
                            if (msg.knx && msg.knx.destination) {
                                grpaddr = msg.knx.destination;
                            } else {
                                node.status({ fill: "red", shape: "dot", text: "msg.knx.destination not set!" })
                                return;
                            }
                        } else {
                            grpaddr = msg.knx && msg.knx.destination
                            ? msg.knx.destination
                            : node.topic
                        }
                        
                        if (node.listenallga) {
                            // The node is set to listen to all Group Addresses. Gets the datapoint from the CSV or use the msg.knx.dpt.
                            if (msg.knx && msg.knx.dpt) {
                                dpt = msg.knx.dpt;
                            } else {
                                // Get the datapoint from the CSV
                                let oGA=node.server.csv.filter(sga => sga.ga == grpaddr)[0]
                                dpt=oGA.dpt
                            }
                        } else {
                            dpt = msg.knx && msg.knx.dpt
                            ? msg.knx.dpt
                            : node.dpt
                        }
                        
                        if (outputtype == "response") {
                            node.server.knxConnection.respond(grpaddr, msg.payload, dpt)
                            node.status({ fill: "green", shape: "dot", text: "Respond ("+ grpaddr +") " + msg.payload + " dpt:" + dpt })
                        } else {
                            node.server.knxConnection.write(grpaddr, msg.payload, dpt)
                            node.status({ fill: "green", shape: "dot", text: "Write ("+ grpaddr +") " + msg.payload + " dpt:" + dpt })
     
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

        if (node.server) {
            if (node.topic || node.listenallga ) {
                node.server.addClient(node)
            }
        }
    }
    RED.nodes.registerType("knxUltimate", knxUltimate)
}
