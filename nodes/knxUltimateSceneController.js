

module.exports = function (RED) {
    function knxUltimateSceneController(config) {
        var fs = require('fs');
        var mkdirp = require('mkdirp');

        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.name = config.name || "KNX Scene Controller";
        node.outputtopic = typeof config.outputtopic === "undefined" ? "" : config.outputtopic;
        node.topic = config.topic || "";
        node.dpt = config.dpt || "1.001"
        node.topicTrigger = config.topicTrigger || "true";
        node.topicSave = config.topicSave || "";
        node.dptSave = config.dptSave || "1.001"
        node.topicSaveTrigger = config.topicSaveTrigger || "true";
        node.listenallga = true; // Dont' remove this.
        node.notifyreadrequest = false;
        node.notifyresponse = false
        node.notifywrite = true; // Dont' remove this.
        node.initialread = false
        node.outputtype = "write"
        node.outputRBE = "false"
        node.inputRBE = "false"
        node.rules = config.rules || [{}];
        node.isSceneController = true; // Signal to config node, that this is a node scene controller
        node.userDir = RED.settings.userDir + "/knxultimatestorage"; // 09/03/2020 Storage of sonospollytts (otherwise, at each upgrade to a newer version, the node path is wiped out and recreated, loosing all custom files)
        
        // 11/03/2020 Delete scene saved file, from html
        RED.httpAdmin.get("/knxultimatescenecontrollerdelete", RED.auth.needsPermission("knxUltimateSceneController.read"), function (req, res) {
            // Delete the file
            try {
                var newPath = node.userDir + "/scenecontroller/SceneController_" + req.query.FileName;
                fs.unlinkSync(newPath)
            } catch (error) { RED.log.warn("e " + error)}
            res.json({ status: 220 });
        });

        function setupDirectory(aPath) {
            try {
                return fs.statSync(aPath).isDirectory();
            } catch (e) {

                // Path does not exist
                if (e.code === 'ENOENT') {
                    // Try and create it
                    try {
                        try {
                            mkdirp.sync(aPath);
                            RED.log.info('knxUltimate-Scene Controller: created directory path: ' + aPath);
                        } catch (error) {
                            RED.log.error('knxUltimate-Scene Controller: failed to access path:: ' + aPath + " : " + error);
                            return false;
                        }

                        return true;
                    } catch (e) {
                        RED.log.error('knxUltimate-Scene Controller: failed to create path: ' + aPath + " : " + e);
                    }
                }
                // Otherwise failure
                return false;
            }
        }

        // This stores all scenes values, that are been saved.
        try {
            setupDirectory(node.userDir);
        } catch (error) { }
        if (!setupDirectory(node.userDir + "/scenecontroller")) {
            RED.log.error('knxUltimate-Scene Controller: Unable to set up permanent files directory: ' + node.userDir + "/scenecontroller");
            node.setNodeStatus({ fill: "red", shape: "dot", text: "Unable to setup permanent files directory", payload: "", GA: "", dpt: "", devicename: node.name })
        } else {

        }

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.icountMessageInWindow == -999) return; // Locked out
            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) == true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint == true ? _dpt : "") + (node.server.statusDisplayLastUpdate == true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
            // 16/02/2020 signal errors to the server
            if (fill.toUpperCase() == "RED") {
                if (node.server) {
                    var oError = { nodeid: node.id, topic: node.outputtopic, devicename: _devicename, GA: _GA, text: text };
                    node.server.reportToWatchdogCalledByKNXUltimateNode(oError);
                };
            };
        }

        // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Recall scene. This is called from the node server, that pass the telegram msg.
        // This function is called everytime node.server receives a telegram, so i need to parse the msg to do what scene controller needs
        // Relevant parts of the message: msg.knx.destination and msg.payload
        node.SaveDeviceInScene = msg => {
            RED.log.warn("BANANA " + msg.payload.toString())
            // Check wether to recall or save scene
            //if (msg.knx.destination === node.topic) {node.RecallScene(msg.payload.toString()); return; }
            //if (msg.knx.destination === node.topicSave) { node.SaveScene(msg.payload.toString()); return; }

            // Check and update the values of each device in the scene and update the rule array accordingly.
            for (var i = 0; i < node.rules.length; i++) {
                // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                var oDevice = node.rules[i];
                if (typeof oDevice !== "undefined" && oDevice.topic == msg.knx.destination) {
                    // Ops... found a device in the scene. Wonderful. update the device in the rule by adding a currentPayload property
                    oDevice.currentPayload = msg.payload.toString();
                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Update dev in scene", payload: oDevice.currentPayload, GA: oDevice.topic, dpt: oDevice.dpt, devicename: oDevice.devicename || "" });
                    break;
                }
            }
        }

        // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Recall scene. 
        node.RecallScene = _Payload => {
            var curVal = _Payload.toString().toLowerCase();
            var newVal = node.topicTrigger.toString().toLowerCase();
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
            if (curVal != newVal) return;

            // Read the scene values from file, if any.
            let oSavedRules = null;
            try {
                oSavedRules = fs.readFileSync(node.userDir + "/scenecontroller/SceneController_" + node.id);
                oSavedRules = JSON.parse(oSavedRules);
            } catch (error) { }

            // Update the node.rules with the values taken from the file, if any, otherwise leave the default value
            for (var i = 0; i < node.rules.length; i++) {
                // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                var rule = node.rules[i];
                var newVal = null;
                if (oSavedRules !== null) {
                    var oSavedDev = oSavedRules.find(a => a.topic === rule.topic);
                    if (typeof oSavedDev !== "undefined") {
                        newVal = oSavedDev.send;
                        if (newVal !== null) { rule.send = newVal.toString(); }
                    }
                }
                node.server.writeQueueAdd({ grpaddr: rule.topic, payload: rule.send, dpt: rule.dpt, outputtype: "write", nodecallerid: node.id })
            }
            setTimeout(() => {
                node.setNodeStatus({ fill: "green", shape: "dot", text: "Recall scene", payload: "", GA: "", dpt: "", devicename: "" });
            }, 1000);
            node.send({ savescene: false, recallscene: true });
        }

        // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Save scene.
        node.SaveScene = _Payload => {
  
            var curVal = _Payload.toString().toLowerCase();
            var newVal = node.topicSaveTrigger.toString().toLowerCase();
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
            if (curVal != newVal) return;

            // Save the currentPayload of each device in the scene
            for (var i = 0; i < node.rules.length; i++) {
                // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                var oDevice = node.rules[i];
                if (oDevice.hasOwnProperty("currentPayload")) {
                    oDevice.send = oDevice.currentPayload.toString();
                }
            }
            node.setNodeStatus({ fill: "blue", shape: "dot", text: "Saved scene", payload: "", GA: "", dpt: "", devicename: "" });
            try {
                fs.writeFileSync(node.userDir + "/scenecontroller/SceneController_" + node.id, JSON.stringify(node.rules, null, 2), 'utf-8');
            } catch (error) {
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Error saving scene. Unable to access filesystem.", payload: "", GA: "", dpt: "", devicename: node.name });
                return;
             }
            node.send({ savescene: true, recallscene: false });
        }

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;

            if (!node.server) return; // 29/08/2019 Server not instantiate
            if (node.server.linkStatus !== "connected") {
                RED.log.error("knxUltimateSceneController: Lost link due to a connection error");
                return; // 29/08/2019 If not connected, exit
            }

            // 07/02/2020 Revamped flood protection (avoid accepting too many messages as input)
            if (node.icountMessageInWindow == -999) return; // Locked out
            if (node.icountMessageInWindow == 0) {
                setTimeout(() => {
                    if (node.icountMessageInWindow >= 120) {
                        // Looping detected
                        node.setNodeStatus({ fill: "red", shape: "ring", text: "DISABLED! Flood protection! Too many msg at the same time.", payload: "", GA: "", dpt: "", devicename: "" })
                        RED.log.error("knxUltimateSceneController: Node " + node.id + " has been disabled due to Flood Protection. Too many messages in a timeframe. Check your flow's design or use RBE option.");
                        node.icountMessageInWindow = -999; //Lock out node
                        return;
                    } else { node.icountMessageInWindow = -1; }
                }, 1000);
            }
            node.icountMessageInWindow += 1;

            if (msg.hasOwnProperty('savescene')) node.SaveScene(node.topicSaveTrigger);
            if (msg.hasOwnProperty('recallscene')) node.RecallScene(node.topicTrigger);

        })

        node.on('close', function () {
            if (node.server) {
                node.server.removeClient(node)
            }
        })

        // On each deploy, unsubscribe+resubscribe
        if (node.server) {
            node.server.removeClient(node);
            if (node.topic !== "" || node.topicSave !== "") {
                node.server.addClient(node);
            }
        }


    }
    RED.nodes.registerType("knxUltimateSceneController", knxUltimateSceneController)
}
