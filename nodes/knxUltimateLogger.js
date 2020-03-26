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
        node.topic = config.topic;
        node.intervalCreateETSXML = config.intervalCreateETSXML !== undefined ? (config.intervalCreateETSXML * 1000) *60 : 900000;

        node.autoStart = config.autoStart !== undefined ? config.autoStart : false;
        node.timerCreateETSXML = null;
        node.isLogger = true;
        node.etsXMLRow = [];

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

        // 26/03/2020 Create and output the XML for ETS bus monitor
        function createETSXML() {
            var sFile = "<CommunicationLog xmlns=\"http://knx.org/xml/telegrams/01\">\n";

            for (let index = 0; index < node.etsXMLRow.length; index++) {
                const element = node.etsXMLRow[index];
                sFile += element;
            }
            sFile += "<RecordStop Timestamp=\"" + new Date().toISOString() + "\" />\n";
            sFile += "</CommunicationLog>";
            node.send({ payload: sFile });
        };

        // This function is called by the knx-ultimate config node.
        node.handleMessage = msg => {
            // Receiving every message
            // Add row to XML ETS
            node.etsXMLRow.push(" <Telegram Timestamp=\"" + new Date().toISOString() + "\" Service=\"L_Data.ind\" FrameFormat=\"CommonEmi\" RawData=\"" + msg.knx.cemiETS + "\" />\n");
        };


        node.StartETSXMLTimer = () => {
            node.beatNumber = 0;
            if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML);
            node.timerCreateETSXML = setInterval(createETSXML, node.intervalCreateETSXML); // 02/01/2020 Start the timer that handles the queue of telegrams
            node.setNodeStatus({ fill: "green", shape: "dot", text: "ETS timer started.", payload: "", GA: "", dpt: "", devicename: "" })
        }

        if (node.autoStart) node.StartETSXMLTimer();  // Autostart ETS timer

        node.on("input", function (msg) {

            if (typeof msg === "undefined") return;
           
            if (msg.hasOwnProperty("startetstimer")) {
                if (Boolean(msg.startetstimer) === true) {
                    node.StartETSXMLTimer();
                }
                else {
                    clearInterval(node.timerCreateETSXML);
                    node.setNodeStatus({ fill: "grey", shape: "ring", text: "ETS timer stopped.", payload: "", GA: "", dpt: "", devicename: "" })
                };
            };
        });

        node.on('close', function () {
            clearInterval(node.timerCreateETSXML);
            if (node.server) {
                node.server.removeClient(node)
            };
        });

        // On each deploy, unsubscribe+resubscribe
        // Unsubscribe(Subscribe)
        if (node.server) {
            clearInterval(node.timerCreateETSXML);
            node.server.removeClient(node);
            if (node.topic || node.listenallga) {
                node.server.addClient(node);
                if (node.autoStart) node.StartETSXMLTimer();  // Autostart ETS timer
            }

        }

    }
    RED.nodes.registerType("knxUltimateLogger", knxUltimateLogger)
}
