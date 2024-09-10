/* eslint-disable max-len */
const dptlib = require('knxultimate').dptlib;
const _ = require('lodash');
const KNXUtils = require('knxultimate').KNXUtils;
const payloadRounder = require('./utils/payloadManipulation');

// 10/09/2024 Setup the color logger
loggerSetup = (options) => {
  let clog = require("node-color-log").createNamedLogger(options.setPrefix);
  clog.setLevel(options.loglevel);
  clog.setDate(() => (new Date()).toLocaleString());
  return clog;
}

module.exports = function (RED) {

  function knxUltimateGarageDoorBarrierOpener(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.serverKNX = RED.nodes.getNode(config.server);
    // 11/11/2021 Is the node server disabled by the flow "disable" command?
    if (node.serverKNX === null) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' });
      return;
    }

    node.topic = config.topic;
    node.dpt = '1.001';
    node.notifyreadrequest = false;
    node.notifyreadrequestalsorespondtobus = 'false';
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = '';
    node.notifyresponse = false;
    node.notifywrite = true;
    node.initialread = false;
    node.listenallga = true; // Don't remove
    node.outputtype = 'write';
    node.sysLogger = loggerSetup({ loglevel: node.serverKNX.loglevel, setPrefix: "knxUltimateGarageDoorOpener.js" }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window

    // From KNX to the node
    node.GACommand = config.GACommand === undefined ? "" : config.GACommand;
    node.GAImpulse = config.GAImpulse === undefined ? "" : config.GAImpulse;
    node.GABlocking = config.GABlocking === undefined ? "" : config.GABlocking;

    // From the node to KNX
    node.GAStatus = config.GAStatus === undefined ? "" : config.GAStatus;
    node.GAMoving = config.GAMoving === undefined ? "" : config.GAMoving;
    node.GAObstructionDetected = config.GAObstructionDetected === undefined ? "" : config.GAObstructionDetected;

    node.valueStatusWhenOpen = config.valueStatusWhenOpen;
    node.valueCommandToOpen = config.valueCommandToOpen;
    node.onCommandReceivedWhileMoving = config.onCommandReceivedWhileMoving;
    node.timeToFullyOpen = config.timeToFullyOpen === undefined ? 20 : config.timeToFullyOpen;
    node.timeToFullyClosed = config.timeToFullyClosed === undefined ? 20 : config.timeToFullyClosed;
    node.blockingTimeout = config.blockingTimeout === undefined ? 0 : config.blockingTimeout;
    node.statusClosed = !node.valueStatusWhenOpen; // Door status (closed/open)
    node.timerMovement = null;

    // Validate the Address
    try {
      KNXUtils.validateKNXAddress(node.GACommand, true);
    } catch (error) {
      node.setNodeStatus({
        fill: 'red', shape: 'dot', text: error.message, payload: '', GA: node.GACommand, dpt: '', devicename: '',
      });
      return;
    }
    try {
      KNXUtils.validateKNXAddress(node.GAImpulse, true);
    } catch (error) {
      node.setNodeStatus({
        fill: 'red', shape: 'dot', text: error.message, payload: '', GA: node.GAImpulse, dpt: '', devicename: '',
      });
      return;
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload, GA, dpt, devicename,
    }) => {
      try {
        if (node.serverKNX === null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return; }
        const dDate = new Date();
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA === '') ? '' : `(${GA}) `;
        devicename = devicename || '';
        dpt = (typeof dpt === 'undefined' || dpt === '') ? '' : ` DPT${dpt}`;
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        node.status({ fill, shape, text: `${GA + payload + (node.listenallga === true ? ` ${devicename}` : '')} (${dDate.getDate()}, ${dDate.toLocaleTimeString()} ${text}` });
      } catch (error) { /* empty */ }
    };

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = (msg) => {
      try {
        switch (msg.knx.destination) {
          case config.GACommand:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve('1.001'));
            if (msg.payload) {
              let status = '';
              if (msg.payload !== node.statusClosed) {
                status = 'Moving to open position';
              } else {
                status = 'Moving to closed position';
              }
              node.setNodeStatus({
                fill: 'yellow', shape: 'dot', text: status, payload: '',
              });
              node.serverKNX.sendKNXTelegramToKNXEngine({
                grpaddr: node.GAImpulse, payload: true, dpt: '1.001', outputtype: 'write', nodecallerid: node.id
              });
              if (node.timerMovement !== null) clearTimeout(node.timerMovement);
              node.timerMovement = setTimeout(() => {

              }, node.timeToFullyOpen);
            }

            break;
          case config.GArepeatStatus:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptrepeat));
            node.toggleGArepeat = msg.payload.decr_incr === 1;
            node.setNodeStatus({
              fill: 'green', shape: 'dot', text: 'KNX->HUE Repeat Status', payload: msg.payload,
            });
            break;
          default:
            break;
        }
      } catch (error) {
        node.setNodeStatus({
          fill: 'red', shape: 'dot', text: `KNX->HUE error ${error.message}`, payload: '',
        });
      }
      // node.send(msg);
    };

    node.on('input', (msg) => {
      if (typeof msg === 'undefined') return;
      if (!node.serverKNX) return; // 29/08/2019 Server not instantiate
    });

    node.on('close', (done) => {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node);
        try {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`knxUltimateGarageDoorBarrierOpener: Close: node id ${node.id} with topic ${node.topic || ''} has been removed from the server.`);
        } catch (error) { }
      }
      done();
    });
  }
  RED.nodes.registerType('knxUltimateGarageDoorBarrierOpener', knxUltimateGarageDoorBarrierOpener);
};
