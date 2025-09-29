/* eslint-disable max-len */
const dptlib = require('knxultimate').dptlib;//require('knxultimate').dptlib;
const loggerClass = require('./utils/sysLogger')
module.exports = function (RED) {

  function knxUltimateHueScene(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.serverKNX = RED.nodes.getNode(config.server) || undefined;
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined;
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
    node.outputRBE = 'false'; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false'; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ''; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = 'no';
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = 'leave';
    node.formatdecimalsvalue = 2;
    node.hueDevice = config.hueDevice;
    node.initializingAtStart = false;
    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error';
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + " <" + (node.name || node.id || '') + ">" });
    } catch (error) { console.log(error.stack) }
    // Multi scene
    config.GAsceneMulti = config.GAsceneMulti === undefined ? '' : config.GAsceneMulti;
    config.namesceneMulti = config.namesceneMulti === undefined ? '' : config.namesceneMulti;
    config.dptsceneMulti = config.dptsceneMulti === undefined ? '' : config.dptsceneMulti;
    config.rules = config.rules === undefined ? [] : config.rules;
    config.selectedModeTabNumber = config.selectedModeTabNumber === undefined ? 0 : Number(config.selectedModeTabNumber); // Transform as number

    const shouldDisplayStatus = (color) => {
      const provider = node.serverKNX;
      if (provider && typeof provider.shouldDisplayStatus === 'function') {
        return provider.shouldDisplayStatus(color);
      }
      return true;
    };

    const updateStatus = (status) => {
      if (!status) return;
      if (shouldDisplayStatus(status.fill)) {
        node.status(status);
      }
    };

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          const now = new Date();
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX server missing (${context}) (${now.getDate()}, ${now.toLocaleTimeString()})` });
          return;
        }
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id });
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: `KNX send error ${error.message}` });
      }
    };

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload,
    }) => {
      try {
        if (payload === undefined) payload = '';
        const dDate = new Date();
        payload = typeof payload === "object" ? JSON.stringify(payload) : payload.toString();
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`;
        updateStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') });
      } catch (error) { }
    };
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = '';
        const dDate = new Date();
        payload = typeof payload === "object" ? JSON.stringify(payload) : payload.toString();
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`;
        updateStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') });
      } catch (error) { }
    };

    // This function is called by the knx-hue config node
    node.handleSend = msg => {
      let state = {};
      if (config.selectedModeTabNumber === 0) {
        // Sigle
        try {
          switch (msg.knx.destination) {
            case config.GAscene:
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptscene));
              if (config.dptscene.startsWith("1.")) {
                if (msg.payload === true) {
                  state = { recall: { action: config.hueSceneRecallType } };
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
                } else {
                  // Turn off all light belonging to the scene
                  (async () => {
                    try {
                      node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: false } }, 'stopScene');
                    } catch (error) {
                      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimateHUEConfig: classHUE: handleQueue: stopScene: ' + error.message);
                    }
                  })();
                }
              } else {
                if (Number(config.valscene) === msg.payload.scenenumber && msg.payload.save_recall === 0) {
                  state = { recall: { action: config.hueSceneRecallType } };
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
                }
              }
              node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: msg.payload });
              break;
            default:
              break;
          }
        } catch (error) {
          updateStatus({ fill: 'red', shape: 'dot', text: 'KNX->HUE single: ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' });
        }
      } else if (config.selectedModeTabNumber === 1) {
        // Multi
        try {
          if (config.GAsceneMulti !== undefined && config.dptsceneMulti !== undefined && config.rules.length !== 0) {
            if (config.GAsceneMulti === msg.knx.destination) {
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptsceneMulti));
              // row is: { rowRuleKNXSceneNumber: rowRuleKNXSceneNumber, rowRuleHUESceneName: rowRuleHUESceneName, rowRuleHUESceneID:rowRuleHUESceneID, rowRuleRecallAs:rowRuleRecallAs}
              config.rules.forEach(row => {
                if (row.rowRuleKNXSceneNumber !== undefined
                  && row.rowRuleHUESceneID !== undefined
                  && row.rowRuleRecallAs !== undefined
                  && Number(row.rowRuleKNXSceneNumber) === Number(msg.payload.scenenumber)
                  && Number(msg.payload.save_recall) === 0
                  && node.serverHue.hueManager !== undefined) {
                  state = { recall: { action: row.rowRuleRecallAs } };
                  node.serverHue.hueManager.writeHueQueueAdd(row.rowRuleHUESceneID, state, 'setScene');
                  node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: msg.payload });
                }
              });
            }
          }
        } catch (error) {
          updateStatus({ fill: 'red', shape: 'dot', text: 'KNX->HUE multi: ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' });
        }
      }
    };

    node.handleSendHUE = (_event) => {
      try {
        if (Number(config.selectedModeTabNumber) === 0 && config.hueDevice !== undefined && _event.id === config.hueDevice) {
          // Single mode
          const knxMsgPayload = {};
          knxMsgPayload.topic = config.GAsceneStatus;
          knxMsgPayload.dpt = config.dptsceneStatus;
          if (_event.hasOwnProperty("status") && _event.status.hasOwnProperty("active")) {
            knxMsgPayload.payload = _event.status.active !== "inactive";
            // Send to KNX bus
            if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
              safeSendToKNX({
                grpaddr: knxMsgPayload.topic,
                payload: knxMsgPayload.payload,
                dpt: knxMsgPayload.dpt,
                outputtype: "write",
              }, 'write');
            }
            updateStatus({
              fill: "blue",
              shape: "dot",
              text: `HUE->KNX ${JSON.stringify(knxMsgPayload.payload)} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
            });
            // Output the msg to the flow
            node.send(_event);
          }
        } else if (Number(config.selectedModeTabNumber) === 1 && config.rules !== undefined) {
          // Multi mode
          config.rules.forEach(row => {
            if (row.rowRuleHUESceneID !== undefined && _event.id === row.rowRuleHUESceneID) {
              // Output the msg to the flow
              node.send(_event);
            }
          });
        }
      } catch (error) {
        updateStatus({ fill: 'red', shape: 'dot', text: 'HUE->KNX error ' + error.message + ' (' + new Date().getDate() + ', ' + new Date().toLocaleTimeString() + ')' });
      }
    };

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      node.serverKNX.removeClient(node);
      node.serverKNX.addClient(node);
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node);
      node.serverHue.addClient(node);
    }

    node.on('input', (msg, send, done) => {
      try {
        const state = RED.util.cloneMessage(msg);
        node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
        node.setNodeStatusHue({
          fill: "green",
          shape: "dot",
          text: "->HUE",
          payload: "Flow msg.",
        });
      } catch (error) {
        node.setNodeStatusHue({
          fill: "red",
          shape: "dot",
          text: "->HUE",
          payload: error.message,
        });
      }
      // Once finished, call 'done'.
      // This call is wrapped in a check that 'done' exists
      // so the node will work in earlier versions of Node-RED (<1.0)
      if (done) {
        done();
      }
    });
    node.on('close', function (done) {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node);
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node);
      }
      done();
    });
  }
  RED.nodes.registerType('knxUltimateHueScene', knxUltimateHueScene);
};
