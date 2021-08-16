module.exports = function (RED) {


    // msg is:
    //  // Build final input message object
    //  return {
    //     topic: _outputtopic
    //     , payload: jsValue
    //     , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
    //     , payloadmeasureunit: sPayloadmeasureunit
    //     , payloadsubtypevalue: sPayloadsubtypevalue
    //     , knx:
    //     {
    //         event: _event
    //         , dpt: sInputDpt
    //         //, details: dpt
    //         , dptdesc: sDptdesc
    //         , source: _srcGA
    //         , destination: _destGA
    //         , rawValue: _Rawvalue
    //     }
    // };

    // The node.exposedGAs is and array of:
    // {
    //     address,
    //     dpt, 
    //     payload
    // }


    function knxUltimateGlobalContext(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.topic = node.name;
        node.name = config.name === undefined ? "KNXGlobalContext" : config.name;
        node.outputtopic = node.name;
        node.dpt = "";
        node.notifyreadrequest = false
        node.notifyreadrequestalsorespondtobus = "false";
        node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = "";
        node.notifyresponse = true;
        node.notifywrite = true;
        node.initialread = false
        node.listenallga = true;
        node.outputtype = "write";
        node.outputRBE = false // Apply or not RBE to the output (Messages coming from flow)
        node.inputRBE = false // Apply or not RBE to the input (Messages coming from BUS)
        node.currentPayload = "" // Current value for the RBE input and for the .previouspayload msg
        node.passthrough = "no";
        node.formatmultiplyvalue = 1;
        node.formatnegativevalue = "leave";
        node.formatdecimalsvalue = 999;
        node.writeExecutionInterval = config.writeExecutionInterval === undefined ? 1000 : config.writeExecutionInterval;
  
        node.exposeAsVariable = config.exposeAsVariable !== undefined ? config.exposeAsVariable : "exposeAsVariableREADONLY"; // Should expose the Group Addresses to the Global Variable?
        node.exposedGAs = [];
        node.timerExposedGAs = null;
        
        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.server == null) { node.status({ fill: "red", shape: "dot", text: "[NO GATEWAY SELECTED]" }); return; }
            GA = GA === undefined ? "" : GA;
            payload = payload === undefined ? "" : payload;
            var dDate = new Date();
            node.status({ fill: fill, shape: shape, text: GA + " " + payload + " " + text + " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" });
        }

        // exposeAsVariableREADWRITE
        //#region "WRITE TO BUS"
        goTimerGo = () => {
            node.timerExposedGAs = setTimeout(() => {
                var oContext = node.context().global.get(node.name + "_WRITE") || [];
                node.context().global.set(node.name + "_WRITE", []); // Delete the var
                for (let index = 0; index < oContext.length; index++) {
                    const element = oContext[index];
                    if (!element.hasOwnProperty("address")) {
                        node.setNodeStatus({ fill: "RED", shape: "dot", text: "NO Group Address set" });
                        goTimerGo();
                        return;
                    }
                    if (!element.hasOwnProperty("payload")) {
                        node.setNodeStatus({ fill: "RED", shape: "dot", text: "NO payload set" });
                        goTimerGo();
                        return;
                    }
                    node.setNodeStatus({ fill: "green", shape: "dot", text: "Write", payload: element.payload, GA: element.address, dpt: element.dpt || "", devicename: "" });
                    node.server.writeQueueAdd({ grpaddr: element.address, payload: element.payload, dpt: element.dpt || "", outputtype: "write", nodecallerid: node.id });
                }
                goTimerGo();
            }, node.writeExecutionInterval);
        }
        // 21/02/2021 timer for write to BUS
        if (node.exposeAsVariable === "exposeAsVariableREADWRITE") {
            goTimerGo();
            node.setNodeStatus({ fill: "green", shape: "dot", text: "Start Writing" });
        } else {
            if (node.timerExposedGAs !== null) clearTimeout(node.timerExposedGAs);
            node.context().global.set(node.name + "_WRITE", []); // Delete the var
        }
        //#endregion

        // This function is called by the knx-ultimate config node, to output a msg.payload.
        node.handleSend = msg => {

            if (node.exposeAsVariable !== "exposeAsVariableNO") {
                try {
                    var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
                } catch (error) {
                    console.log(error);
                }
                if (oGa === undefined) {
                    node.exposedGAs.push({ address: msg.knx.destination, dpt: msg.knx.dpt, payload: msg.payload });
                } else {
                    oGa.dpt = msg.knx.dpt;
                    oGa.payload = msg.payload;
                }
                // Save into the global Context
                try {
                    node.context().global.set(node.name + "_READ", node.exposedGAs);
                } catch (error) {
                    console.log(error);
                }
            } else {
                node.exposedGAs = [];
                node.context().global.set(node.name + "_READ", node.exposedGAs);
            }
        };

        node.on("input", function (msg) {


        })

        node.on("close", function (done) {
            if (node.timerExposedGAs !== null) clearTimeout(node.timerExposedGAs);
            if (node.server) {
                node.server.removeClient(node);
            }
            done();
        })

        // On each deploy, unsubscribe+resubscribe
        if (node.server) {
            node.server.removeClient(node);
            node.server.addClient(node);
        }


    }
    RED.nodes.registerType("knxUltimateGlobalContext", knxUltimateGlobalContext)
}
