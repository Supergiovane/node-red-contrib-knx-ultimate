

module.exports = function (RED) {
    function knxUltimateLoadControl(config) {
        const Address = require('./../KNXEngine/protocol/KNXAddress')
        const KnxConstants = require("./../KNXEngine/protocol/KNXConstants");

        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.name = config.name || "KNX Load Control";
        node.topic = config.topic;
        node.dpt = config.dpt;
        node.listenallga = true; // Dont' remove this.
        node.notifyreadrequest = false;
        node.notifyresponse = true;
        node.notifywrite = true; // Dont' remove this.
        node.initialread = false
        node.outputtype = "write"
        node.outputRBE = "false"
        node.inputRBE = "false"
        node.isLoadControlNode = true; // Signal to config node, that this is a Load Control node
        node.initialread = true;
        node.sheddingStage = 0;
        node.timerIncreaseShedding = null;
        node.timerDecreaseShedding = null;
        node.sheddingCheckInterval = config.sheddingCheckInterval !== undefined ? config.sheddingCheckInterval * 1000 : 10000;
        node.sheddingRestoreDelay = config.sheddingRestoreDelay !== undefined ? config.sheddingRestoreDelay * 1000 : 60000;

        node.totalWatt = 0; // Current total watt consumption
        node.wattLimit = config.wattLimit === undefined ? 3000 : config.wattLimit;
        node.deviceList = [];
        for (let index = 1; index < 6; index++) {
            // Eval, the magic. Fill in the device list. DEFINITION DEVICELIST
            node.deviceList.push({
                ga: eval("config.GA" + index),
                dpt: eval("config.DPT" + index),
                name: eval("config.Name" + index),
                autoRestore: eval("config.autoRestore" + index),
                monitorGA: eval("config.MonitorGA" + index),
                monitorDPT: eval("config.MonitorDPT" + index),
                monitorName: eval("config.MonitorName" + index),
                monitorVal: null
            });
        }

        try {
            node.sysLogger = require("./utils/sysLogger.js").get({ loglevel: node.server.loglevel || "error" }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window
        } catch (error) {
            node.sysLogger = "error";
        }


        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.server === null) return;
            // Log only service statuses, not the GA values

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

        // This function is called by the knx-ultimate config node.
        node.handleSend = msg => {

            // Update the Total Watt?
            if (msg.topic === node.topic) {
                node.totalWatt = msg.payload;
                //node.setLocalStatus({ fill: "blue", shape: "dot", text: "Total consumption", payload: node.totalWatt, GA: msg.topic, dpt: "", devicename: node.name });
                return;
            }

            // Update the node.deviceList
            for (var i = 0; i < node.deviceList.length; i++) {

                // deviceList is an array of objects:
                // ga: eval("config.GA" + index),
                // dpt: eval("config.DPT" + index),
                // name: eval("config.Name" + index),
                // autoRestore : eval("config.autoRestore" + index),
                // monitorGA: eval("config.MonitorGA" + index),
                // monitorDPT: eval("config.MonitorDPT" + index),
                // monitorName: eval("config.MonitorName" + index),
                // monitorVal: null

                var oRow = node.deviceList[i];
                if (msg.topic === oRow.monitorGA) {
                    oRow.monitorVal = msg.payload;
                    //node.setLocalStatus({ fill: "blue", shape: "dot", text: "Updated", payload: oRow.monitorVal, GA: msg.topic, dpt: "", devicename: oRow.monitorName });
                }

            }

        };


        // 03/02/2022 perform a read on all GA in the list
        node.initialReadAllDevicesInRules = () => {
            if (node.server) {
                for (var i = 0; i < node.deviceList.length; i++) {
                    let grpaddr = node.deviceList[i].monitorGA;
                    if (grpaddr !== undefined && grpaddr !== "") {
                        try {
                            // Check if it's a group address
                            let ret = Address.KNXAddress.createFromString(grpaddr, Address.KNXAddress.TYPE_GROUP);
                            node.setLocalStatus({ fill: "grey", shape: "dot", text: "Read", payload: "", GA: grpaddr, dpt: "", devicename: node.deviceList[i].monitorName });
                            node.server.writeQueueAdd({ grpaddr: grpaddr, payload: "", dpt: "", outputtype: "read", nodecallerid: node.id });
                        } catch (error) {
                            node.setLocalStatus({ fill: "grey", shape: "dot", text: "Not a KNX GA " + error.message, payload: "", GA: grpaddr, dpt: "", devicename: node.deviceList[i].monitorName });
                        }
                    }
                }
            } else {
                node.setLocalStatus({ fill: "red", shape: "ring", text: "No gateway selected. Unable to read from KNX bus", payload: "", GA: "", dpt: "", devicename: "" });
            }
        }


        // Start the timer
        node.startTimerIncreaseShedding = () => {

            // Increase shedding timer (Switch off devices)
            if (node.timerIncreaseShedding !== null) clearInterval(node.timerIncreaseShedding);
            node.timerIncreaseShedding = setInterval(() => {

                // Check consumption
                if (node.totalWatt > node.wattLimit) {
                    // Start increasing shedding!
                    if (node.sheddingStage < node.deviceList.length) {
                        node.increaseShedding();
                        node.startTimerDecreaseShedding();
                    }
                }
            }, node.sheddingCheckInterval);
        }

        // Start the timer
        node.startTimerDecreaseShedding = () => {

            // Decrease shedding timer (Switch devices on again)
            if (node.timerDecreaseShedding !== null) clearInterval(node.timerDecreaseShedding);
            node.timerDecreaseShedding = setInterval(() => {

                // Check consumption
                if (node.totalWatt <= node.wattLimit) {
                    // Start decreasing shedding!
                    if (node.sheddingStage > 0) {
                        node.decreaseShedding();
                    }
                }

            }, node.sheddingRestoreDelay);
        }

        node.increaseShedding = () => {
            // deviceList is an array of objects:
            // ga: eval("config.GA" + index),
            // dpt: eval("config.DPT" + index),
            // name: eval("config.Name" + index),
            // autoRestore : eval("config.autoRestore" + index),
            // monitorGA: eval("config.MonitorGA" + index),
            // monitorDPT: eval("config.MonitorDPT" + index),
            // monitorName: eval("config.MonitorName" + index),
            // monitorVal: null
            if (node.sheddingStage >= node.deviceList.length) {
                node.sheddingStage = node.deviceList.length;
                node.setLocalStatus({ fill: "red", shape: "dot", text: "No more loads to shed!!", payload: "", GA: "", dpt: "", devicename: "" });
                return;
            }

            node.sheddingStage++;
            let iRowIndex = node.sheddingStage - 1; // Array is base 0
            const oRow = node.deviceList[iRowIndex];
            if (oRow.ga !== undefined && oRow.ga !== "" && oRow.ga !== null) {
                // Check if the device is in use. If not, turn off the device and further increase the shedding stage to turn off the next one.
                node.setLocalStatus({ fill: "red", shape: "dot", text: "Switch off", payload: "Shedding stage " + node.sheddingStage, GA: oRow.ga, dpt: oRow.dpt, devicename: oRow.name });
                node.server.writeQueueAdd({ grpaddr: oRow.ga, payload: false, dpt: oRow.dpt, outputtype: "write", nodecallerid: node.id });
            } else {
                node.setLocalStatus({ fill: "yellow", shape: "dot", text: "No GA defined", payload: "Shedding stage " + node.sheddingStage, GA: "", dpt: "", devicename: "" });
            }

            node.send({ topic: node.name || node.topic, payload: "Shedding stage " + node.sheddingStage });
            // Go furhter ?
            if (oRow.monitorGA !== undefined && oRow.monitorGA !== "" && oRow.monitorGA !== null) {
                // Minimum consumption must be at lease xx Watt
                if (oRow.monitorVal === null || oRow.monitorVal === undefined || oRow.monitorVal < 30) {
                    // Switch off the next load, because this is already off, because the power consumption trascurable
                    node.increaseShedding();
                }
            }
        }

        node.decreaseShedding = () => {
            // deviceList is an array of objects:
            // ga: eval("config.GA" + index),
            // dpt: eval("config.DPT" + index),
            // name: eval("config.Name" + index),
            // autoRestore : eval("config.autoRestore" + index),
            // monitorGA: eval("config.MonitorGA" + index),
            // monitorDPT: eval("config.MonitorDPT" + index),
            // monitorName: eval("config.MonitorName" + index),
            // monitorVal: null
            if (node.sheddingStage <= 0) {
                node.sheddingStage = 0;
                node.setLocalStatus({ fill: "green", shape: "dot", text: "All loads are on", payload: "", GA: "", dpt: "", devicename: "" });
                return;
            }

            let iRowIndex = node.sheddingStage - 1; // Array is base 0
            if (iRowIndex < 0) {
                iRowIndex = 0;
            }
            const oRow = node.deviceList[iRowIndex];
            if (oRow.autoRestore === true) {
                if (oRow.ga !== undefined && oRow.ga !== "" && oRow.ga !== null) {
                    // Check if the device is in use. If not, turn off the device and further increase the shedding stage to turn off the next one.
                    node.setLocalStatus({ fill: "green", shape: "dot", text: "Switch on", payload: "Shedding stage " + node.sheddingStage - 1, GA: oRow.ga, dpt: oRow.dpt, devicename: oRow.name });
                    node.server.writeQueueAdd({ grpaddr: oRow.ga, payload: true, dpt: oRow.dpt, outputtype: "write", nodecallerid: node.id });
                } else {
                    node.setLocalStatus({ fill: "yellow", shape: "dot", text: "No GA defined", payload: "Shedding stage " + node.sheddingStage, GA: "", dpt: "", devicename: "" });
                }
                node.send({ topic: node.name || node.topic, payload: "Shedding stage " + node.sheddingStage - 1 });
            } else {
                // Cannot auto switch on the load.
                node.setLocalStatus({ fill: "yellow", shape: "dot", text: "Auto Restore disabled", payload: "Shedding stage " + node.sheddingStage, GA: oRow.ga, dpt: oRow.dpt, devicename: oRow.name });
            }
            if (node.sheddingStage > 0) {
                node.sheddingStage--;
            } else {
                setTimeout(() => {
                    node.setLocalStatus({ fill: "green", shape: "dot", text: "All loads have been restored", payload: "", GA: "", dpt: "", devicename: "" });
                }, 1000);
            }


        }

        // Start
        node.startTimerIncreaseShedding();

        node.on("input", function (msg) {
            if (typeof msg === "undefined") return;

            // Reset the shedding and activate all loads
            if (msg.hasOwnProperty("reset")) {
                if (node.timerDecreaseShedding !== null) clearInterval(node.timerDecreaseShedding);
                if (node.timerIncreaseShedding !== null) clearInterval(node.timerIncreaseShedding);
                node.sheddingStage = 0;
                for (let index = 0; index < node.deviceList.length; index++) {
                    const oRow = node.deviceList[index];
                    if (oRow.autoRestore === true) node.server.writeQueueAdd({ grpaddr: oRow.ga, payload: true, dpt: oRow.dpt, outputtype: "write", nodecallerid: node.id });
                }
                setTimeout(() => {
                    node.setLocalStatus({ fill: "green", shape: "dot", text: "All loads have been restored", payload: "", GA: "", dpt: "", devicename: "" });
                    // Restart shedding timer
                    node.startTimerIncreaseShedding();
                }, 1000);
                node.send({ topic: node.name || node.topic, payload: "reset" });
            }

            // Disable the shedding node
            if (msg.hasOwnProperty("disable")) {
                if (node.timerDecreaseShedding !== null) clearInterval(node.timerDecreaseShedding);
                if (node.timerIncreaseShedding !== null) clearInterval(node.timerIncreaseShedding);
                node.sheddingStage = 0;
                setTimeout(() => {
                    node.setLocalStatus({ fill: "grey", shape: "dot", text: "Disabled", payload: "", GA: "", dpt: "", devicename: "" });
                }, 1000);
                node.send({ topic: node.name || node.topic, payload: "disabled" });
            }

            // Disable the shedding node
            if (msg.hasOwnProperty("enable")) {
                if (node.timerDecreaseShedding !== null) clearInterval(node.timerDecreaseShedding);
                if (node.timerIncreaseShedding !== null) clearInterval(node.timerIncreaseShedding);
                setTimeout(() => {
                    node.setLocalStatus({ fill: "green", shape: "dot", text: "Enabled", payload: "", GA: "", dpt: "", devicename: "" });
                    // Restart shedding timer
                    node.startTimerIncreaseShedding();
                }, 1000);
                node.send({ topic: node.name || node.topic, payload: "enabled" });
            }

            // 24/04/2021 if payload is read or the output type is set to "read", do a read
            if ((msg.hasOwnProperty('readstatus') && msg.readstatus === true)) {
                node.initialReadAllDevicesInRules();
            }

        })

        node.on("close", function (done) {
            if (node.timerDecreaseShedding !== null) clearInterval(node.timerDecreaseShedding);
            if (node.timerIncreaseShedding !== null) clearInterval(node.timerIncreaseShedding);
            if (node.server) {
                node.server.removeClient(node)
            }
            done();
        })


        // On each deploy, unsubscribe+resubscribe
        if (node.server) {
            node.server.removeClient(node);
            if (node.topic !== "") {
                node.server.addClient(node);
            }
        }


    }
    RED.nodes.registerType("knxUltimateLoadControl", knxUltimateLoadControl)
}
