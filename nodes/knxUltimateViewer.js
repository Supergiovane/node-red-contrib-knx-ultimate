const KNXAddress = require('./../KNXEngine/src/protocol/KNXAddress').KNXAddress;

module.exports = function (RED) {
  function knxUltimateViewer(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    node.topic = node.name;
    node.name = config.name === undefined ? 'KNXViewer' : config.name;
    node.outputtopic = node.name;
    node.dpt = '';
    node.notifyreadrequest = false;
    node.notifyreadrequestalsorespondtobus = 'false';
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = '';
    node.notifyresponse = true;
    node.notifywrite = true;
    node.initialread = false;
    node.listenallga = true;
    node.outputtype = 'write';
    node.outputRBE = 'false'; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false'; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ''; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no';
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = 'leave';
    node.formatdecimalsvalue = 2;

    node.exposedGAs = [];

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.server == null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return; }
        GA = GA === undefined ? '' : GA;
        payload = payload === undefined ? '' : payload;
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        const dDate = new Date();
        node.status({ fill, shape, text: GA + ' ' + payload + ' ' + text + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' });
      } catch (error) { /* empty */ }
    };

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {
      try {
        var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
      } catch (error) {

      }
      const sDeviceName = msg.devicename === node.name ? 'Import ETS file to view the group address name' : msg.devicename; // The ETS file hasn't been imported
      const sAddressRAW = KNXAddress.createFromString(msg.knx.destination, KNXAddress.TYPE_GROUP).get(); // Address as number (for ordering later)
      if (oGa === undefined) {
        node.exposedGAs.push({ address: msg.knx.destination, addressRAW: sAddressRAW, dpt: msg.knx.dpt, payload: msg.payload, devicename: sDeviceName, lastupdate: new Date(), rawPayload: 'HEX Raw: ' + msg.knx.rawValue.toString('hex') || '?', payloadmeasureunit: (msg.payloadmeasureunit !== 'unknown' ? ' ' + msg.payloadmeasureunit : '') });
      } else {
        oGa.dpt = msg.knx.dpt;
        oGa.payload = msg.payload;
        oGa.devicename = sDeviceName;
        oGa.lastupdate = new Date();
        oGa.rawPayload = 'HEX Raw: ' + msg.knx.rawValue.toString('hex') || '?';
        oGa.payloadmeasureunit = (msg.payloadmeasureunit !== 'unknown' ? ' ' + msg.payloadmeasureunit : '');
      }
      // Output the payload
      node.createPayload();
    };

    node.createPayload = () => {
      const sHead = `<table>
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
      const sFooter = `</tbody>
            </table>`;
      let sPayload = '';

      const aSorted = node.exposedGAs.sort((a, b) => {
        if (a.addressRAW !== undefined && b.addressRAW !== undefined) {
          return a.addressRAW > b.addressRAW ? 1 : -1;
        } else {
          return a.addressRAW !== undefined ? 1 : -1;
        }
      });
      try {
        for (let index = 0; index < aSorted.length; index++) {
          const element = aSorted[index];
          sPayload += '<tr><td>' + element.address + '</td>';
          if (typeof element.payload === 'boolean' && element.payload === true) {
            sPayload += '<td><b><font color=green>True</font></b></td>';
          } else if (typeof element.payload === 'boolean' && element.payload === false) {
            sPayload += '<td><font color=red>False</font></td>';
          } else if (typeof element.payload === 'object' && !isNaN(Date.parse(element.payload))) {
            // The payload is a datetime
            sPayload += '<td>' + element.payload.toLocaleString() + '</td>';
          } else if (typeof element.payload === 'object') {
            // Is maybe a JSON?
            try {
              // sPayload += '<td>' + JSON.stringify(element.payload) + '</td>'
              sPayload += '<td><i>' + element.rawPayload + '</i></td>';
            } catch (error) {
              sPayload += '<td>' + element.payload + '</td>';
            }
          } else {
            sPayload += '<td>' + element.payload + element.payloadmeasureunit + '</td>';
          }
          sPayload += '<td>' + element.dpt + '</td>';
          sPayload += '<td>' + element.lastupdate.toLocaleString() + '</td>';
          sPayload += '<td><font style="font-size: smaller;">' + element.devicename + '</font></td></tr>';
        }
      } catch (error) {

      }

      node.send([{ topic: node.name, payload: sHead + sPayload + sFooter }, { topic: node.name, payload: node.exposedGAs }]);
    };

    node.on('input', function (msg) {

    });

    node.on('close', function (done) {
      if (node.server) {
        node.server.removeClient(node);
      }
      done();
    });

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node);
      node.server.addClient(node);
    }
  }
  RED.nodes.registerType('knxUltimateViewer', knxUltimateViewer);
};
