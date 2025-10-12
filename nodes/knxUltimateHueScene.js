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

    const pushStatus = (status) => {
      if (!status) return;
      const provider = node.serverKNX;
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status);
      } else {
        node.status(status);
      }
    };

    const updateStatus = (status) => {
      if (!status) return;
      pushStatus(status);
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

    let hueSceneReady = false;
    let pendingHueSceneSnapshot = null;
    const needsSceneReady = () => Number(config.selectedModeTabNumber) === 0 && config.hueDevice !== undefined && config.hueDevice !== '';

    const ensureHueSceneReady = async ({ forceRefresh = false } = {}) => {
      if (!needsSceneReady()) {
        hueSceneReady = true;
        return true;
      }
      if (!node.serverHue || typeof node.serverHue.getHueResourceSnapshot !== 'function') {
        hueSceneReady = false;
        return false;
      }
      if (pendingHueSceneSnapshot) {
        try {
          return await pendingHueSceneSnapshot;
        } catch (error) {
          return false;
        }
      }
      pendingHueSceneSnapshot = (async () => {
        try {
          const resource = await node.serverHue.getHueResourceSnapshot(config.hueDevice, { forceRefresh });
          if (!resource) {
            hueSceneReady = false;
            node.setNodeStatusHue({
              fill: "red",
              shape: "ring",
              text: "Hue scene not found",
              payload: "",
            });
            return false;
          }
          hueSceneReady = true;
          try {
            node.handleSendHUE(resource);
          } catch (error) {
            RED.log.debug(`knxUltimateHueScene: ensureHueSceneReady handleSendHUE error ${error.message}`);
          }
          return true;
        } catch (error) {
          hueSceneReady = false;
          RED.log.warn(`knxUltimateHueScene: ensureHueSceneReady error ${error.message}`);
          node.setNodeStatusHue({
            fill: "red",
            shape: "ring",
            text: `Sync failed ${error.message}`,
            payload: "",
          });
          return false;
        } finally {
          pendingHueSceneSnapshot = null;
        }
      })();
      return pendingHueSceneSnapshot;
    };

    const processKnxSceneCommand = (msg) => {
      let state = {};
      if (Number(config.selectedModeTabNumber) === 0) {
        try {
          switch (msg.knx.destination) {
            case config.GAscene: {
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptscene));
              if (config.dptscene.startsWith("1.")) {
                if (msg.payload === true) {
                  state = { recall: { action: config.hueSceneRecallType } };
                  node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
                } else {
                  (async () => {
                    try {
                      node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, { on: { on: false } }, 'stopScene');
                    } catch (error) {
                      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`KNXUltimateHUEConfig: stopScene: ${error.message}`);
                    }
                  })();
                }
              } else if (Number(config.valscene) === msg.payload.scenenumber && msg.payload.save_recall === 0) {
                state = { recall: { action: config.hueSceneRecallType } };
                node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
              }
              node.setNodeStatusHue({ fill: 'green', shape: 'dot', text: 'KNX->HUE', payload: msg.payload });
              break;
            }
            default:
              break;
          }
        } catch (error) {
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX->HUE single: ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})` });
        }
      } else if (Number(config.selectedModeTabNumber) === 1) {
        try {
          if (config.GAsceneMulti !== undefined && config.dptsceneMulti !== undefined && config.rules.length !== 0 && config.GAsceneMulti === msg.knx.destination) {
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptsceneMulti));
            config.rules.forEach((row) => {
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
        } catch (error) {
          updateStatus({ fill: 'red', shape: 'dot', text: `KNX->HUE multi: ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})` });
        }
      }
    };

    // This function is called by the knx-hue config node
    node.handleSend = (msg) => {
      if (needsSceneReady() && !hueSceneReady) {
        node.setNodeStatusHue({
          fill: "yellow",
          shape: "ring",
          text: "Syncing with HUE bridge",
          payload: "",
        });
        const clonedMsg = RED.util.cloneMessage(msg);
        ensureHueSceneReady({ forceRefresh: true }).then((ready) => {
          if (ready) processKnxSceneCommand(clonedMsg);
        }).catch(() => { /* handled in ensure */ });
        return;
      }
      processKnxSceneCommand(msg);
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
      ensureHueSceneReady({ forceRefresh: true });
    }

    const processFlowSceneCommand = (msg) => {
      try {
        const state = RED.util.cloneMessage(msg);
        node.serverHue.hueManager.writeHueQueueAdd(config.hueDevice, state, 'setScene');
        const statusValue = state.payload !== undefined ? state.payload : state;
        node.setNodeStatusHue({
          fill: "green",
          shape: "dot",
          text: "->HUE",
          payload: statusValue,
        });
      } catch (error) {
        node.setNodeStatusHue({
          fill: "red",
          shape: "dot",
          text: "->HUE",
          payload: error.message,
        });
        throw error;
      }
    };

    node.on('input', (msg, send, done) => {
      const finalize = (error) => {
        if (done) done(error);
      };
      if (needsSceneReady() && !hueSceneReady) {
        node.setNodeStatusHue({
          fill: "yellow",
          shape: "ring",
          text: "Syncing with HUE bridge",
          payload: "",
        });
        const clonedMsg = RED.util.cloneMessage(msg);
        ensureHueSceneReady({ forceRefresh: true }).then((ready) => {
          if (ready) {
            try {
              processFlowSceneCommand(clonedMsg);
              finalize();
            } catch (error) {
              finalize(error);
            }
          } else {
            finalize(new Error('Hue scene initialization failed'));
          }
        }).catch((error) => {
          finalize(error);
        });
        return;
      }
      try {
        processFlowSceneCommand(msg);
        finalize();
      } catch (error) {
        finalize(error);
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
