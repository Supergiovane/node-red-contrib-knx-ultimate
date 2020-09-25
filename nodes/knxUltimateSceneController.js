

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
        node.listenallga = false; // Dont' remove this.
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
        node.disabled = false; // 21/09/2020 you can now disable the scene controller

        // 11/03/2020 Delete scene saved file, from html
        RED.httpAdmin.get("/knxultimatescenecontrollerdelete", RED.auth.needsPermission("knxUltimateSceneController.read"), function (req, res) {
            // Delete the file
            try {
                var newPath = node.userDir + "/scenecontroller/SceneController_" + req.query.FileName;
                fs.unlinkSync(newPath)
            } catch (error) { RED.log.warn("e " + error) }
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
            if (node.server == null) { node.status({ fill: "red", shape: "dot", text: "[NO GATEWAY SELECTED]" }); return; }
            if (node.icountMessageInWindow == -999) return; // Locked out
            if (node.disabled === true) fill = "grey"; // 21/09/2020 if disabled, color is grey
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


        // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Recall scene. 
        node.RecallScene = (_Payload, _ForceEvenControllerIsDisabled) => {

            // 25/09/2020 If the node is disabled, doens't perform the action.
            if (node.disabled && !_ForceEvenControllerIsDisabled) {
                setTimeout(() => {
                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Recall while disabled", payload: "", GA: "", dpt: "", devicename: "" });
                }, 500);
                node.send({ savescene: false, recallscene: true, savevalue: false, disabled: true });
                return;
            }

            var curVal;
            var newVal;

            if (typeof _Payload === "object") {
                // If payload is an object, parse it as object
                try {
                    curVal = JSON.stringify(_Payload);
                    if (node.topicTrigger.toString().indexOf("{") > -1) {
                        // Sanitize string, if not having quotes
                        var correctJson = node.topicTrigger.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
                        try {
                            newVal = JSON.stringify(JSON.parse(correctJson));
                        } catch (error) {
                            // Not a valid JSON, thread as normal.
                            newVal = node.topicTrigger.toString().toLowerCase();
                        }
                    } else {
                        // topicTrigge is not a JSON
                        newVal = node.topicTrigger.toString().toLowerCase();
                    }
                } catch (error) {
                    // Invalid JSON, threat as normal.
                    curVal = _Payload.toString().toLowerCase();
                    newVal = node.topicTrigger.toString().toLowerCase();
                }

            } else {
                // Not a JSON, threath as normal.
                curVal = _Payload.toString().toLowerCase();
                newVal = node.topicTrigger.toString().toLowerCase();
            }

            if (curVal === "false") {
                curVal = "0";
            }
            if (curVal === "true") {
                curVal = "1";
            }
            if (curVal.toString().indexOf("\"decr_incr\":1") > -1 && curVal.toString().indexOf("\"data\":0") == -1) { // Handling DIM
                curVal = "DIMUP";
            }
            if (curVal.toString().indexOf("\"decr_incr\":0") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                curVal = "DIMDOWN";
            }
            if (newVal === "false") {
                newVal = "0";
            }
            if (newVal === "true") {
                newVal = "1";
            }
            if (newVal.toString().indexOf("\"decr_incr\":1") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                newVal = "DIMUP";
            }
            if (newVal.toString().indexOf("\"decr_incr\":0") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                newVal = "DIMDOWN";
            }
            //RED.log.warn(curVal + " new: " + newVal)
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
                // If payload is an object, parse it as object
                var oPayload;
                if (rule.send.toString().indexOf("{") > -1) {
                    // Sanitize string, if not having quotes
                    var correctJson = rule.send.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
                    try {
                        oPayload = JSON.parse(correctJson);
                    } catch (error) {
                        oPayload = rule.send;
                    }
                } else {
                    oPayload = rule.send;
                }
                node.server.writeQueueAdd({ grpaddr: rule.topic, payload: oPayload, dpt: rule.dpt, outputtype: "write", nodecallerid: node.id })
            }
            setTimeout(() => {
                node.setNodeStatus({ fill: "green", shape: "dot", text: "Recall scene", payload: "", GA: "", dpt: "", devicename: "" });
            }, 1000);
            node.send({ savescene: false, recallscene: true, savevalue: false, disabled: false });
        }

        // 11/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Save scene.
        node.SaveScene = (_Payload, _ForceEvenControllerIsDisabled) => {

            // 25/09/2020 If the node is disabled, doens't perform the action.
            if (node.disabled && !_ForceEvenControllerIsDisabled) {
                setTimeout(() => {
                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Saved while disabled", payload: "", GA: "", dpt: "", devicename: "" });
                }, 500);
                node.send({ savescene: true, recallscene: false, savevalue: false, disabled: true });
                return;
            }

            var curVal;
            var newVal;

            if (typeof _Payload === "object") {
                // If payload is an object, parse it as object
                try {
                    curVal = JSON.stringify(_Payload);
                    if (node.topicSaveTrigger.toString().indexOf("{") > -1) {
                        // Sanitize string, if not having quotes
                        var correctJson = node.topicSaveTrigger.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
                        try {
                            newVal = JSON.stringify(JSON.parse(correctJson));
                        } catch (error) {
                            // Not a valid JSON, thread as normal.
                            newVal = node.topicSaveTrigger.toString().toLowerCase();
                        }
                    } else {
                        // topicTrigge is not a JSON
                        newVal = node.topicSaveTrigger.toString().toLowerCase();
                    }
                } catch (error) {
                    // Invalid JSON, threat as normal.
                    curVal = _Payload.toString().toLowerCase();
                    newVal = node.topicSaveTrigger.toString().toLowerCase();
                }

            } else {
                // Not a JSON, threath as normal.
                curVal = _Payload.toString().toLowerCase();
                newVal = node.topicSaveTrigger.toString().toLowerCase();
            }

            if (curVal === "false") {
                curVal = "0";
            }
            if (curVal === "true") {
                curVal = "1";
            }
            if (curVal.toString().indexOf("\"decr_incr\":1") > -1 && curVal.toString().indexOf("\"data\":0") == -1) { // Handling DIM
                curVal = "DIMUP";
            }
            if (curVal.toString().indexOf("\"decr_incr\":0") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                curVal = "DIMDOWN";
            }
            if (newVal === "false") {
                newVal = "0";
            }
            if (newVal === "true") {
                newVal = "1";
            }
            if (newVal.toString().indexOf("\"decr_incr\":1") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                newVal = "DIMUP";
            }
            if (newVal.toString().indexOf("\"decr_incr\":0") > -1 && curVal.toString().indexOf("\"data\":0") == -1) {// Handling DIM
                newVal = "DIMDOWN";
            }
            //RED.log.warn(curVal + " new: " + newVal)
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
            node.send({ savescene: true, recallscene: false, savevalue: false, disabled: false });
        }

        // 12/08/2020 Save the topic's value into the group address
        node.SaveValue = _msg => {

            if (_msg.hasOwnProperty("topic") && _msg.hasOwnProperty("payload")) {
                // Save the currentPayload into the group address
                for (var i = 0; i < node.rules.length; i++) {
                    // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                    var oDevice = node.rules[i];
                    if (oDevice.hasOwnProperty("topic") && oDevice.hasOwnProperty("currentPayload") && oDevice.topic === _msg.topic) {
                        oDevice.currentPayload = _msg.payload;
                    }
                }
                node.setNodeStatus({ fill: "blue", shape: "dot", text: "Saved value", payload: _msg.payload, GA: _msg.topic, dpt: "", devicename: "" });
                node.send({ savescene: false, recallscene: false, savevalue: true, disabled: node.disabled });
            } else {
                node.setNodeStatus({ fill: "red", shape: "dot", text: "Error saving value; the msg.topic and msg.payload must be both present in the input message.", payload: "", GA: "", dpt: "", devicename: node.name });
            }
        }


        // This function is called by the knx-ultimate config node, to output a msg.payload.
        node.handleSend = msg => {
            node.send(msg);
        };

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

            if (msg.hasOwnProperty('savescene')) node.SaveScene(node.topicSaveTrigger, true);
            if (msg.hasOwnProperty('recallscene')) node.RecallScene(node.topicTrigger, true);
            if (msg.hasOwnProperty('savevalue')) node.SaveValue(msg);
            if (msg.hasOwnProperty('disabled')) {
                if (msg.disabled === true) {
                    node.disabled = true;
                    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Disabled", payload: "", GA: "", dpt: "", devicename: "" });
                } else {
                    node.disabled = false;
                    node.setNodeStatus({ fill: "green", shape: "dot", text: "Enabled", payload: "", GA: "", dpt: "", devicename: "" });
                }
            }

        })

        node.on("close", function (done) {
            if (node.server) {
                node.server.removeClient(node)
            }
            done();
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
