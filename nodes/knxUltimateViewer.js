module.exports = function (RED) {

    function knxUltimateViewer(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)
        node.topic = node.name;
        node.name = config.name === undefined ? "KNXViewer" : config.name;
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
        node.formatdecimalsvalue = 2;

        node.exposedGAs = [];

        // Used to call the status update from the config node.
        node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
            if (node.server == null) { node.status({ fill: "red", shape: "dot", text: "[NO GATEWAY SELECTED]" }); return; }
            GA = GA === undefined ? "" : GA;
            payload = payload === undefined ? "" : payload;
            let dDate = new Date();
            node.status({ fill: fill, shape: shape, text: GA + " " + payload + " " + text + " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" });
        }


        // This function is called by the knx-ultimate config node, to output a msg.payload.
        node.handleSend = msg => {
            try {
                var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
            } catch (error) {

            }
            let sDate = new Date().toLocaleString();
            let sDeviceName = msg.devicename === node.name ? "Import ETS file to view the group address name" : msg.devicename; // The ETS file hasn't been imported
            if (oGa === undefined) {
                node.exposedGAs.push({ address: msg.knx.destination, dpt: msg.knx.dpt, payload: msg.payload, devicename: sDeviceName, lastupdate: sDate });
            } else {
                oGa.dpt = msg.knx.dpt;
                oGa.payload = msg.payload;
                oGa.devicename =sDeviceName;
                oGa.lastupdate = sDate;
            }
            // Output the payload
            node.createPayload();
        };

        node.createPayload = () => {
            let sHead = `<table>
            <thead>
              <tr>
                <th> GA </th>
                <th> Value </th>
                <th> DPT </th>
                <th> Last updated </th>
                <th> Group Address Name </th>
              </tr>
            </thead>
            <tbody>`;
            let sFooter = `</tbody>
            </table>`;
            let sPayload = "";

            const aSorted = node.exposedGAs.sort((a, b) => {
                if (a.address !== undefined && b.address !== undefined) {
                    return a.address > b.address ? 1 : -1;
                } else {
                    return a.address !== undefined ? 1 : -1
                }
            });

            for (let index = 0; index < aSorted.length; index++) {
                const element = aSorted[index];
                sPayload += `<tr>
                <td>` + element.address + `</td>`;
                if (typeof element.payload === "boolean" && element.payload === true) {
                    sPayload += "<td><b><font color=green>True</font></b></td>";
                } else if (typeof element.payload === "boolean" && element.payload === false) {
                    sPayload += "<td><font color=red>False</font></td>";
                } else {
                    sPayload += "<td>" + element.payload + "</td>";
                }
                sPayload += "<td>" + element.dpt + "</td>"
                sPayload += "<td>" + element.lastupdate + "</td>";
                sPayload += "<td><font size=2pt>" + element.devicename + "</font></td></tr>";
            }

            node.send({ topic: node.name, payload: sHead + sPayload + sFooter });
        }

        node.on("input", function (msg) {


        })

        node.on("close", function (done) {
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
    RED.nodes.registerType("knxUltimateViewer", knxUltimateViewer)
}
