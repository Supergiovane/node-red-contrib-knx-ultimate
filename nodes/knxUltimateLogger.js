module.exports = function (RED) {
    function knxUltimateLogger(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.server = RED.nodes.getNode(config.server);
        node.notifyreadrequestalsorespondtobus = "false"
        node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ""
        node.notifyreadrequest = true;
        node.notifyresponse = true;
        node.notifywrite = true;
        node.initialread = false;
        node.listenallga = true;
        node.outputtype = "write";
        node.outputRBE = false;
        node.inputRBE = false;
        node.currentPayload = ""
        node.topic = config.topic !== undefined ? config.topic : "";
        node.autoStartTimerCreateETSXML = config.autoStartTimerCreateETSXML !== undefined ? config.autoStartTimerCreateETSXML : true;
        node.intervalCreateETSXML = config.intervalCreateETSXML !== undefined ? (config.intervalCreateETSXML * 1000) * 60 : 900000;
        node.maxRowsInETSXML = config.maxRowsInETSXML !== undefined ? config.maxRowsInETSXML : 0;
        node.timerCreateETSXML = null;
        node.isLogger = true;
        node.etsXMLRow = [];

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {

            var dDate = new Date();
            // 30/08/2019 Display only the things selected in the config
            _GA = (typeof _GA == "undefined" || GA == "") ? "" : "(" + GA + ") ";
            _devicename = devicename || "";
            _dpt = (typeof dpt == "undefined" || dpt == "") ? "" : " DPT" + dpt;
            node.status({ fill: fill, shape: shape, text: _GA + payload + ((node.listenallga && node.server.statusDisplayDeviceNameWhenALL) == true ? " " + _devicename : "") + (node.server.statusDisplayDataPoint == true ? _dpt : "") + (node.server.statusDisplayLastUpdate == true ? " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" : "") + " " + text });
        }

        if (!node.server) return;

        // 26/03/2020 Create and output the XML for ETS bus monitor
        function createETSXML() {
            var sFile = "<CommunicationLog xmlns=\"http://knx.org/xml/telegrams/01\">\n";
            for (let index = 0; index < node.etsXMLRow.length; index++) {
                const element = node.etsXMLRow[index];
                sFile += element;
            }
            sFile += "<RecordStop Timestamp=\"" + new Date().toISOString() + "\" />\n";
            sFile += "</CommunicationLog>";
            node.send({ topic: node.topic, payload: sFile });
        };

        // This function is called by the knx-ultimate config node.
        node.handleMessage = msg => {
            // Receiving every message

            // Add row to XML ETS
            // If too much, delete the oldest
            if (node.maxRowsInETSXML > 0 && (node.etsXMLRow.length > node.maxRowsInETSXML)) {
                // Shift (remove) the first row (the oldest)
                node.etsXMLRow.shift()
            }
            node.etsXMLRow.push(" <Telegram Timestamp=\"" + new Date().toISOString() + "\" Service=\"L_Data.ind\" FrameFormat=\"CommonEmi\" RawData=\"" + msg.knx.cemiETS + "\" />\n");
        };


        node.StartETSXMLTimer = () => {
            if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
            node.timerCreateETSXML = setInterval(createETSXML, node.intervalCreateETSXML); // 02/01/2020 Start the timer that handles the queue of telegrams
            setInterval(function () { node.setNodeStatus({ fill: "green", shape: "dot", text: "ETS timer started.", payload: "", GA: "", dpt: "", devicename: "" }) }, 5000)
        }

        node.on("input", function (msg) {

            if (typeof msg === "undefined") return;

            if (msg.hasOwnProperty("etsstarttimer")) {
                if (Boolean(msg.startetstimer) === true) {
                    node.StartETSXMLTimer();
                }
                else {
                    if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
                    node.setNodeStatus({ fill: "grey", shape: "ring", text: "ETS timer stopped.", payload: "", GA: "", dpt: "", devicename: "" })
                };
            };
            if (msg.hasOwnProperty("etsoutputnow")) {
                if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
                createETSXML()
                node.setNodeStatus({ fill: "grey", shape: "ring", text: "Output ETS", payload: "", GA: "", dpt: "", devicename: "" })
                if (node.autoStartTimerCreateETSXML) node.StartETSXMLTimer();  // autoStartTimerCreateETSXML ETS timer
            };


        });

        node.on('close', function () {
            if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
            if (node.server) {
                node.server.removeClient(node)
            };
        });

        // On each deploy, unsubscribe+resubscribe
        // Unsubscribe(Subscribe)
        if (node.server) {
            if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
            node.server.removeClient(node);
            node.server.addClient(node);
            if (node.autoStartTimerCreateETSXML) node.StartETSXMLTimer();  // autoStartTimerCreateETSXML ETS timer
        }

    }
    RED.nodes.registerType("knxUltimateLogger", knxUltimateLogger)
}
