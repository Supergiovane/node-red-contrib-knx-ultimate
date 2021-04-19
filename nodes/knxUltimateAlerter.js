

module.exports = function (RED) {
    function knxUltimateAlerter(config) {
        var fs = require('fs');
        var path = require('path');
        var mkdirp = require('mkdirp');

        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.name = config.name || "KNX Alerter";
        node.listenallga = true; // Dont' remove this.
        node.notifyreadrequest = false;
        node.notifyresponse = true;
        node.notifywrite = true; // Dont' remove this.
        node.initialread = false
        node.outputtype = "write"
        node.outputRBE = "false"
        node.inputRBE = "false"
        node.rules = config.rules || [{}];
        node.isalertnode = true; // Signal to config node, that this is a node scene controller
        node.userDir = path.join(RED.settings.userDir, "knxultimatestorage"); // 09/03/2020 Storage of ttsultimate (otherwise, at each upgrade to a newer version, the node path is wiped out and recreated, loosing all custom files)
        node.alertedDevices = [];
        node.curIndexAlertedDevice = 0;
        node.timerSend = null;
        node.whentostart = config.whentostart === undefined ? "ifnewalert" : config.whentostart;
        node.timerinterval = (config.timerinterval === undefined || config.timerinterval == "") ? "2" : config.timerinterval;
        try {
            node.sysLogger = require("./utils/sysLogger.js").get({ loglevel: node.server.loglevel || "error" }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window
        } catch (error) {
            node.sysLogger = "error";
        }


        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.server === null) return;
            // Log only service statuses, not the GA values
            if (dpt !== undefined) return;
            if (dpt !== "") return;

            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint === true ? _dpt : "") + (node.server.statusDisplayLastUpdate === true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });

        }

        // Used to call the status update from the config node.
        node.setLocalStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            try {
                node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) === true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint === true ? _dpt : "") + (node.server.statusDisplayLastUpdate === true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
            } catch (error) {
                node.status({ fill: fill, shape: shape, text: _GA + payload + ((true === true) ? " " + _devicename : "") + (false === true ? _dpt : "") + (true === true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
            }

        }

        // This function is called by the knx-ultimate config node, to output a msg.payload.
        node.handleSend = msg => {

            try {
                if (!msg.knx.dpt.startsWith("1.")) return;
            } catch (error) {
                return;
            }

            // Update the node.rules with the values taken from the file, if any, otherwise leave the default value
            for (var i = 0; i < node.rules.length; i++) {
                // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName}
                var rule = node.rules[i];
                if (msg.topic === rule.topic) {
                    if (msg.payload == true) {
                        // Add the device to the array of alertedDevices
                        let oTrovato = node.alertedDevices.find(a => a.topic === rule.topic);
                        if (oTrovato === undefined) {
                            node.alertedDevices.unshift({ topic: rule.topic, devicename: rule.devicename }); // Add to the begin of array
                        }
                        node.setLocalStatus({ fill: "red", shape: "dot", text: "Alert", payload: "", GA: msg.topic, dpt: "", devicename: rule.devicename });

                    } else {
                        // Remove the device from the array
                        node.alertedDevices = node.alertedDevices.filter(a => a.topic !== msg.topic);
                        node.setLocalStatus({ fill: "green", shape: "dot", text: "Restore", payload: "", GA: msg.topic, dpt: "", devicename: rule.devicename });
                    }
                }
            }
            
            // If there's some device to alert, stop current timer and restart
            // This allow the last alerted device to be outputted immediately
            if (node.whentostart === "ifnewalert" && node.alertedDevices.length > 0) {
                clearTimeout(node.timerSend);
                node.curIndexAlertedDevice = 0; // Restart form the beginning
                node.startTimer();
            }
        };

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;
            if (msg.hasOwnProperty("start")) {
                clearTimeout(node.timerSend);
                node.curIndexAlertedDevice = 0; // Restart form the beginning
                node.startTimer();
                return;
            }

            if (msg.topic === undefined) {
                node.setLocalStatus({ fill: "grey", shape: "dot", text: "ERROR: You must provide a msg.topic", payload: "", GA: "", dpt: "", devicename: "" });
                return;
            }
            if (msg.payload === undefined) {
                node.setLocalStatus({ fill: "grey", shape: "dot", text: "ERROR: You must provide payload (true/false)", payload: "", GA: "", dpt: "", devicename: "" });
                return;
            }
            msg.knx = { dpt: "1.001" };
            node.handleSend(msg);

        })

        node.on("close", function (done) {
            clearTimeout(node.timerSend);
            if (node.server) {
                node.server.removeClient(node)
            }
            done();
        })

        node.handleTimer = () => {
            if (node.alertedDevices.length > 0) {
                let count = node.alertedDevices.length;
                if (node.curIndexAlertedDevice > count - 1) {
                    node.curIndexAlertedDevice = 0;
                    if (node.whentostart === "manualstart") {
                        node.curIndexAlertedDevice = 0; // Restart form the beginning
                        node.sendNoMoreDevices();
                        return;
                    }
                }
                // Create output message
                try {
                    let curDev = node.alertedDevices[node.curIndexAlertedDevice]; // is { topic: rule.topic, devicename: rule.devicename }
                    let msg = {};
                    msg.topic = curDev.topic;
                    msg.count = count;
                    msg.devicename = curDev.devicename;
                    msg.payload = true;
                    node.send(msg);
                } catch (error) {
                }
                node.curIndexAlertedDevice += 1;
                // Restart timer
                node.startTimer();
            } else {
                // Nothing more to output
                node.sendNoMoreDevices();
            }
        }

        // Start timer
        node.startTimer = () => {
            clearTimeout(node.timerSend);
            node.timerSend = setTimeout(() => {
                node.handleTimer();
            }, node.timerinterval * 1000);
        }

        // As soon as there no more devices..
        node.sendNoMoreDevices = () => {
            let msg = {};
            msg.topic = "";
            msg.count = 0;
            msg.devicename = "";
            msg.payload = false;
            node.send(msg);
        }

        // Init
        node.sendNoMoreDevices();

        // On each deploy, unsubscribe+resubscribe
        if (node.server) {
            node.server.removeClient(node);
            if (node.topic !== "" || node.topicSave !== "") {
                node.server.addClient(node);
            }
        }


    }
    RED.nodes.registerType("knxUltimateAlerter", knxUltimateAlerter)
}
