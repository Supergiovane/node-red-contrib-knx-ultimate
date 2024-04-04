module.exports = function (RED) {
  function knxUltimateHueTemperatureSensor(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    node.serverHue = RED.nodes.getNode(config.serverHue);
    node.topic = node.name;
    node.name = config.name === undefined ? 'Hue' : config.name;
    node.dpt = '';
    node.notifyreadrequest = true;
    node.notifyreadrequestalsorespondtobus = 'false';
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = '';
    node.notifyresponse = false;
    node.notifywrite = true;
    node.initialread = true;
    node.listenallga = true; // Don't remove
    node.outputtype = 'write';
    node.outputRBE = 'false'; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false'; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ''; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no';
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = 'leave';
    node.formatdecimalsvalue = 2;
    node.hueDevice = config.hueDevice;
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === "yes");
    node.currentDeviceValue = 0;

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload,
    }) => {

    };
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({
      fill, shape, text, payload,
    }) => {
      if (payload === undefined) payload = '';
      const dDate = new Date();
      payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString();
      node.status({ fill, shape, text: `${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})` });
    };

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = (msg) => {
      // Respond to KNX read telegram, by sending the current value as response telegram.
      if (msg.knx.event === "GroupValue_Read") {
        switch (msg.knx.destination) {
          case config.GAtemperaturesensor:
            // To the KNX bus wires
            node.sendResponseToKNX(node.currentDeviceValue);
            break;
          default:
            break;
        }
      }
    };

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === config.hueDevice) {
          const knxMsgPayload = {};
          knxMsgPayload.topic = config.GAtemperaturesensor;
          knxMsgPayload.dpt = config.dpttemperaturesensor;

          if (_event.hasOwnProperty('temperature') && _event.temperature.hasOwnProperty('temperature')) {
            knxMsgPayload.payload = _event.temperature.temperature;
            // Send to KNX bus
            if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
              node.server.writeQueueAdd({
                grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id,
              });
            }
            node.currentDeviceValue = knxMsgPayload.payload;

            node.status({ fill: 'green', shape: 'dot', text: `HUE->KNX ${JSON.stringify(knxMsgPayload.payload)} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})` });

            // Setup the output msg
            knxMsgPayload.name = node.name;
            knxMsgPayload.event = 'temperature';

            // Send payload
            knxMsgPayload.rawEvent = _event;
            node.send(knxMsgPayload);
            node.setNodeStatusHue({
              fill: 'blue', shape: 'ring', text: 'HUE->KNX', payload: knxMsgPayload.payload,
            });
          }
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: `HUE->KNX error ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})` });
      }
    };


    node.sendResponseToKNX = (_level) => {
      const knxMsgPayload = {};
      knxMsgPayload.topic = config.GAtemperaturesensor;
      knxMsgPayload.dpt = config.dpttemperaturesensor;

      knxMsgPayload.payload = _level;
      // Send to KNX bus
      if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
        node.server.writeQueueAdd({
          grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'response', nodecallerid: node.id,
        });
      }
    };


    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node);
      node.server.addClient(node);
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node);
      node.serverHue.addClient(node);
    }

    node.on('input', (msg) => {

    });

    node.on('close', (done) => {
      if (node.server) {
        node.server.removeClient(node);
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node);
      }
      done();
    });
  }
  RED.nodes.registerType('knxUltimateHueTemperatureSensor', knxUltimateHueTemperatureSensor);
};
