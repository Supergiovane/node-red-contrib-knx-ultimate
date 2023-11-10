module.exports = function (RED) {
  const dptlib = require("../KNXEngine/src/dptlib");

  function knxUltimateHueButton(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    node.serverHue = RED.nodes.getNode(config.serverHue);
    node.topic = node.name;
    node.name = config.name === undefined ? 'Hue' : config.name;
    node.dpt = '';
    node.notifyreadrequest = false;
    node.notifyreadrequestalsorespondtobus = 'false';
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = '';
    node.notifyresponse = false;
    node.notifywrite = true;
    node.initialread = true;
    node.listenallga = true; // Don't remove
    node.outputtype = 'write';
    node.outputRBE = false; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = false; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ''; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no';
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = 'leave';
    node.formatdecimalsvalue = 2;
    node.short_releaseValue = false;
    node.isTimerDimStopRunning = false;
    node.hueDevice = config.hueDevice;
    node.initializingAtStart = false;

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
      const state = {};
      try {
        switch (msg.knx.destination) {
          case config.GAshort_releaseStatus:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptshort_release));
            node.short_releaseValue = msg.payload;
            node.setNodeStatusHue({
              fill: 'green', shape: 'dot', text: 'KNX->HUE Short Release Status', payload: msg.payload,
            });
            break;
          case config.GArepeatStatus:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptrepeat));
            node.toggleGArepeat = msg.payload.decr_incr === 1;
            node.setNodeStatusHue({
              fill: 'green', shape: 'dot', text: 'KNX->HUE Repeat Status', payload: msg.payload,
            });
            break;
          default:
            break;
        }
      } catch (error) {
        node.setNodeStatusHue({
          fill: 'red', shape: 'dot', text: `KNX->HUE error ${error.message}`, payload: '',
        });
      }
    };

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === config.hueDevice) {

          // IMPORTANT: exit if no button last_event present.
          if (!_event.hasOwnProperty("button") || _event.button.last_event === undefined) return;

          const knxMsgPayload = {};
          let flowMsgPayload = true;
          // Handling events with toggles
          // KNX Dimming reminder tips
          // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
          // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
          switch (_event.button.last_event) {
            case 'initial_press':
              if (node.initial_pressValue === undefined) node.initial_pressValue = false;
              node.initial_pressValue = config.toggleValues ? !node.initial_pressValue : true;
              flowMsgPayload = node.initial_pressValue;
              break;
            case 'long_release':
              flowMsgPayload = node.long_pressValue;
              // if the dimmer was running, send the STOP telegram to the KNX bus wires, using the GArepeat Group address and dpt.
              if (node.isTimerDimStopRunning) {
                knxMsgPayload.topic = config.GArepeat;
                knxMsgPayload.dpt = config.dptrepeat;
                node.stopDIM(knxMsgPayload);
              }
              break;
            case 'double_short_release':
              if (node.double_short_releaseValue === undefined) node.double_short_releaseValue = false;
              node.double_short_releaseValue = config.toggleValues ? !node.double_short_releaseValue : true;
              flowMsgPayload = node.double_short_releaseValue;
              break;
            case 'long_press':
              if (node.long_pressValue === undefined) node.long_pressValue = false;
              node.long_pressValue = config.toggleValues ? !node.long_pressValue : true;
              flowMsgPayload = node.long_pressValue;
              break;
            case 'short_release':
              node.short_releaseValue = config.toggleValues ? !node.short_releaseValue : true;
              flowMsgPayload = node.short_releaseValue;
              if (config.GAshort_release !== undefined && config.GAshort_release !== '') {
                knxMsgPayload.topic = config.GAshort_release;
                knxMsgPayload.dpt = config.dptshort_release;
                knxMsgPayload.payload = node.short_releaseValue;
                // Send to KNX bus
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
                  node.server.writeQueueAdd({
                    grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id,
                  });
                }
                if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
                  node.setNodeStatusHue({
                    fill: 'blue', shape: 'dot', text: `HUE->KNX ${_event.button.last_event}`, payload: knxMsgPayload.payload,
                  });
                }
              }
              break;
            case 'repeat':
              flowMsgPayload = true;
              if (config.GArepeat !== undefined && config.GArepeat !== '') {
                if (node.isTimerDimStopRunning === false) {
                  // Set KNX Dim up/down start
                  knxMsgPayload.topic = config.GArepeat;
                  knxMsgPayload.dpt = config.dptrepeat;
                  knxMsgPayload.payload = node.long_pressValue ? { decr_incr: 0, data: 3 } : { decr_incr: 1, data: 3 }; // If the light is turned on, the initial DIM direction must be down, otherwise, up
                  // Send to KNX bus
                  if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
                    node.server.writeQueueAdd({
                      grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id,
                    });
                  }
                  if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
                    node.setNodeStatusHue({
                      fill: 'blue', shape: 'dot', text: 'HUE->KNX START DIM', payload: '',
                    });
                  }
                }
                node.startDimStopper(knxMsgPayload);
              }
              break;
            default:
              break;
          }

          // Setup the output msg
          const flowMsg = {};
          flowMsg.name = node.name;
          flowMsg.event = _event.button.last_event;
          flowMsg.rawEvent = _event;
          flowMsg.payload = flowMsgPayload;
          node.send(flowMsg);
          // node.setNodeStatusHue({ fill: 'blue', shape: 'ring', text: 'HUE->KNX', payload: flowMsg.rawEvent + ' ' + flowMsg.payload })
        }
      } catch (error) {
        node.setNodeStatusHue({
          fill: 'red', shape: 'dot', text: `HUE->KNX error ${error.message}`, payload: '',
        });
      }
    };

    // Timer to stop the dimming sequence
    node.startDimStopper = function (knxMsgPayload) {
      if (node.timerDimStop !== undefined) clearTimeout(node.timerDimStop);
      node.isTimerDimStopRunning = true;
      node.timerDimStop = setTimeout(() => {
        node.stopDIM(knxMsgPayload);
      }, 2000);
    };

    node.stopDIM = function (knxMsgPayload) {
      // KNX Stop DIM
      if (node.timerDimStop !== undefined) clearTimeout(node.timerDimStop);
      node.isTimerDimStopRunning = false;
      knxMsgPayload.payload = { decr_incr: 0, data: 0 }; // Payload for the output msg
      // Send to KNX bus
      if (knxMsgPayload.topic !== '' && knxMsgPayload.topic !== undefined) {
        node.server.writeQueueAdd({
          grpaddr: knxMsgPayload.topic, payload: knxMsgPayload.payload, dpt: knxMsgPayload.dpt, outputtype: 'write', nodecallerid: node.id,
        });
        node.setNodeStatusHue({
          fill: 'grey', shape: 'ring', text: 'HUE->KNX STOP DIM', payload: knxMsgPayload.payload,
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
  RED.nodes.registerType('knxUltimateHueButton', knxUltimateHueButton);
};
