module.exports = function (RED) {
    function knxUltimateWatchDog(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.server = RED.nodes.getNode(config.server);
        node.dpt = "1.001"
        node.notifyreadrequestalsorespondtobus = "false"
        node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ""
        node.notifyreadrequest = true;
        node.notifyresponse = true
        node.notifywrite = false
        node.initialread = false
        node.listenallga = false
        node.outputtype = "write"
        node.outputRBE = "false"
        node.inputRBE = "false"
        node.currentPayload = ""
        node.topic = config.topic;
        node.retryInterval = config.retryInterval !== undefined ? config.retryInterval * 1000 : 10000;
        node.maxRetry = config.maxRetry !== undefined ? config.maxRetry : 6;
        node.autoStart = config.autoStart !== undefined ? config.autoStart : false;
        node.beatNumber = 0; // Telegram counter
        node.timerWatchDog = null;
        node.isWatchDog = true;
        node.checkLevel = config.checkLevel !== undefined ? config.checkLevel : "Ethernet";

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.icountMessageInWindow == -999) return; // Locked out, doesn't change status.
            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) == true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint == true ? _dpt : "") + (node.server.statusDisplayLastUpdate == true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
        }

        if (!node.server) return;

        function handleTheDog() {
            node.beatNumber += 1;
            if (node.beatNumber > node.maxRetry) {
                // Confirmed connection error    
                node.beatNumber = 0; // Reset Counter
                msg = {
                    type: "BUSError",
                    checkPerformed: node.checkLevel,
                    nodeid: node.id,
                    payload: true,
                    description: "Watchdog elapsed and no response from KNX Bus"
                }
                node.send(msg)
            } else {
                // Issue a read request
                if (node.server.knxConnection) {
                    node.server.writeQueueAdd({ grpaddr: node.topic, payload: "", dpt: "", outputtype: "read" });
                    node.setNodeStatus({ fill: "yellow", shape: "dot", text: "Check level " + node.checkLevel + ", beat telegram " + node.beatNumber + " of " + node.maxRetry, payload: "", GA: "", dpt: "", devicename: "" });
                };
            };
        };

        // This function is called by the knx-ultimate config node.
        node.evalCalledByConfigNode = _sTypeOfTelegram => {
            // The node received a telegram from the bus
            // _sTypeOfTelegram = "Read" (in case of Ethernet level check)
            // _sTypeOfTelegram = "Response" or "Write" (in case of KNX TP level check)
            if (node.checkLevel === "Ethernet") {
                if (_sTypeOfTelegram === "Read" || _sTypeOfTelegram === "Response") {
                    // With this check level "Ethernet", i need to obtain at least a response from the KNX/IP Gateway, that is "Read"
                    node.beatNumber = 0; // Reset counter
                    setTimeout(() => {
                        node.setNodeStatus({ fill: "green", shape: "dot", text: "Basic check level " + node.checkLevel + " - BUS OK.", payload: "", GA: node.topic, dpt: "", devicename: "" });
                    }, 500);
                };
            } else {
                // With this check level "Ethernet + KNX Twisted Pair", i need to obtain the "Response" from the physical device, otherwise the connection TP is broken.
                if (_sTypeOfTelegram === "Response") {
                    // With this check level, i need to obtain at least a response from the KNX/IP Gateway, that is "Read"
                    node.beatNumber = 0; // Reset counter
                    setTimeout(() => {
                        node.setNodeStatus({ fill: "green", shape: "dot", text: "Full check level " + node.checkLevel + " - BUS OK.", payload: "", GA: node.topic, dpt: "", devicename: "" });
                    }, 500);
                };
            };
        };

        // 16/02/2020 This function is called by the knx-ultimate config node.
        node.signalNodeErrorCalledByConfigNode = _oError => {
            // Report an error from knx-ultimate node.
            // var oError = {nodeid:node.id,topic:node.outputtopic,devicename:_devicename,GA:_GA,text:text};
            msg = {
                type: "NodeError",
                checkPerformed: "Self KNX-Ultimate node reporting a red color status",
                nodeid: _oError.nodeid,
                payload: true,
                description: _oError.text,
                completeError: _oError
            };
            node.send(msg);
        };

        node.StartWatchDogTimer = () => {
            node.beatNumber = 0;
            if (node.timerWatchDog !== null) clearInterval(node.timerWatchDog);
            node.timerWatchDog = setInterval(handleTheDog, node.retryInterval); // 02/01/2020 Start the timer that handles the queue of telegrams
            node.setNodeStatus({ fill: "green", shape: "dot", text: "WatchDog started.", payload: "", GA: "", dpt: "", devicename: "" })
        }

        if (node.autoStart) node.StartWatchDogTimer();  // Autostart watchdog

        node.on("input", function (msg) {

            if (typeof msg === "undefined") return;
            if (node.topic === undefined) {
                clearInterval(node.timerWatchDog);
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Invalid Group Address Monitor", payload: "", GA: "", dpt: "", devicename: "" })
                RED.log.error("knxUltimateWatchDog: Node " + node.id + " Invalid Group Address Monitor. Please correct it.");
                return;
            };

            // 01/02/2020 Dinamic change of the KNX Gateway IP, Port and Physical Address
            // This new thing has been requested by proServ RealKNX staff.
            if (msg.hasOwnProperty("setGatewayConfig")) {
                node.server.setGatewayConfig(msg.setGatewayConfig.IP, msg.setGatewayConfig.Port, msg.setGatewayConfig.PhysicalAddress, msg.setGatewayConfig.BindToEthernetInterface);
                msg = {
                    type: "setGatewayConfig",
                    checkPerformed: "The Watchdog node changed the gateway configuration.",
                    nodeid: node.id,
                    payload: true,
                    description: "New Config issued to the gateway. IP:" + (msg.setGatewayConfig.IP || "Unchanged") + " Port:" + (msg.setGatewayConfig.Port || "Unchanged") + " PhysicalAddress:" + (msg.setGatewayConfig.PhysicalAddress || "Unchanged") + " BindLocalInterface:" + (msg.setGatewayConfig.BindToEthernetInterface || "Unchanged"),
                    completeError: ""
                };
                node.send(msg);
                // 20/02/2020 Restart watchdog timer from scratch
                node.StartWatchDogTimer();
            };

            if (msg.hasOwnProperty("start")) {
                if (Boolean(msg.start) === true) {
                    node.StartWatchDogTimer();
                }
                else {
                    clearInterval(node.timerWatchDog);
                    node.setNodeStatus({ fill: "grey", shape: "ring", text: "WatchDog stopped.", payload: "", GA: "", dpt: "", devicename: "" })
                };
            };
        });

        node.on('close', function () {
            clearInterval(node.timerWatchDog);
            if (node.server) {
                node.server.removeClient(node)
            };
        });

        // On each deploy, unsubscribe+resubscribe
        // Unsubscribe(Subscribe)
        if (node.server) {
            clearInterval(node.timerWatchDog);
            node.server.removeClient(node);
            if (node.topic || node.listenallga) {
                node.server.addClient(node);
                if (node.autoStart) node.StartWatchDogTimer();  // Autostart watchdog
            }

        }

    }
    RED.nodes.registerType("knxUltimateWatchDog", knxUltimateWatchDog)
}
