
/* eslint-disable max-len */
module.exports = function (RED) {
  const _ = require('lodash');
  const KNXUtils = require('knxultimate');
  const payloadRounder = require('./utils/payloadManipulation');

  function knxUltimate(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    // 11/11/2021 Is the node server disabled by the flow "disable" command?
    if (node.server === null) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' });
      return;
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload, GA, dpt, devicename,
    }) => {
      try {
        if (node.server == null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return; }
        if (node.icountMessageInWindow == -999) return; // Locked out, doesn't change status.
        const dDate = new Date();
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA == '') ? '' : `(${GA}) `;
        devicename = devicename || '';
        dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ` DPT${dpt}`;
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        node.status({ fill, shape, text: `${GA + payload + (node.listenallga === true ? ` ${devicename}` : '')} (${dDate.getDate()}, ${dDate.toLocaleTimeString()} ${text}` });
        // 16/02/2020 signal errors to the server
        if (fill.toUpperCase() === 'RED') {
          if (node.server) {
            const oError = {
              nodeid: node.id, topic: node.outputtopic, devicename, GA, text,
            };
            node.server.reportToWatchdogCalledByKNXUltimateNode(oError);
          }
        }
        // Validate the Address to advise the user. The address can be undefined, because the
        // group address can be set via setConfig
        if (node.listenallga === false) {
          try {
            KNXUtils.validateKNXAddress(node.topic, true);
          } catch (error) {
            node.setNodeStatus({
              fill: 'grey', shape: 'ring', text: "DISABLED: " + error.message, payload: '', GA: node.topic, dpt: '', devicename: '',
            });
          }
        }

      } catch (error) {
      }

    };



    // Get the Group Address from various sources
    if (config.setTopicType === undefined || config.setTopicType === 'str') {
      node.topic = config.topic;
      node.dpt = config.dpt || '1.001';
    } else if (config.setTopicType === 'flow') {
      try {
        node.topic = node.context().flow.get(config.topic);
        node.dpt = 'auto';
        payloadRounder.KNXULtimateChangeConfigByInputMSG({ setConfig: { setGroupAddress: node.topic, setDPT: node.dpt } }, node, config);
      } catch (error) {
        node.topic = undefined;
      }
    } else if (config.setTopicType === 'global') {
      try {
        node.topic = node.context().global.get(config.topic);
        node.dpt = 'auto';
        payloadRounder.KNXULtimateChangeConfigByInputMSG({ setConfig: { setGroupAddress: node.topic, setDPT: node.dpt } }, node, config);
      } catch (error) {
        node.topic = undefined;
      }
    } else if (config.setTopicType === 'env') {
      try {
        node.topic = RED.util.getSetting(node, config.topic); // takes care of the subflow's env vairables
        node.dpt = 'auto';
        payloadRounder.KNXULtimateChangeConfigByInputMSG({ setConfig: { setGroupAddress: node.topic, setDPT: node.dpt } }, node, config);
      } catch (error) {
        node.topic = undefined;
      }
    }


    node.outputtopic = (config.outputtopic === undefined || config.outputtopic === '') ? node.topic : config.outputtopic; // 07/02/2020 Importante, per retrocompatibilità
    node.name = config.name;
    node.notifyreadrequest = config.notifyreadrequest || false;
    node.notifyreadrequestalsorespondtobus = config.notifyreadrequestalsorespondtobus || 'false'; // Auto respond if notifireadrequest is true
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = config.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized || '';
    node.notifyresponse = config.notifyresponse || false;
    node.notifywrite = config.notifywrite;
    node.initialread = config.initialread || 0;
    if (node.initialread === true) node.initialread = 1; // 04/04/2021 Backward compatibility
    if (node.initialread === false) node.initialread = 0; // 04/04/2021 Backward compatibility
    node.initialread = Number(config.initialread);
    node.listenallga = config.listenallga || false;
    node.outputtype = config.outputtype || 'write';// When the node is used as output
    node.outputRBE = config.outputRBE || 'false'; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = config.inputRBE || 'false'; // Apply or not RBE to the input (Messages coming from BUS)
    // Backward compatibility
    if (node.outputRBE === true) node.outputRBE = 'true';
    if (node.outputRBE === false) node.outputRBE = 'false';
    if (node.inputRBE === true) node.inputRBE = 'true';
    if (node.inputRBE === false) node.inputRBE = 'false';

    node.currentPayload = ''; // Current value for the RBE input and for the .previouspayload msg
    node.icountMessageInWindow = 0; // Used to prevent looping messages
    node.messageQueue = []; // 01/01/2020 All messages from the flow to the node, will be queued and will be sent separated by 60 milliseconds each. Use uf the underlying api "minimumDelay" is not possible because the telegram order isn't mantained.
    node.formatmultiplyvalue = (typeof config.formatmultiplyvalue === 'undefined' ? 1 : config.formatmultiplyvalue);
    node.formatnegativevalue = (typeof config.formatnegativevalue === 'undefined' ? 'leave' : config.formatnegativevalue);
    node.formatdecimalsvalue = (typeof config.formatdecimalsvalue === 'undefined' ? 999 : config.formatdecimalsvalue);
    node.passthrough = (typeof config.passthrough === 'undefined' ? 'no' : config.passthrough);
    node.inputmessage = {}; // Stores the input message to be passed through
    node.timerTTLInputMessage = null; // The stored node.inputmessage has a ttl.
    node.sysLogger = require('./utils/sysLogger.js').get({ loglevel: node.server.loglevel || 'error' }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window


    // Check if the node has a valid dpt
    if (node.listenallga === false) {
      if (node.dpt === undefined || node.dpt === '') {
        node.setNodeStatus({
          fill: 'red', shape: 'dot', text: 'The Datapoint cannot be empty.', payload: '', GA: '', dpt: '', devicename: '',
        });
        return;
      }
    }

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = (msg) => {
      // 27/03/2020 can i merge the last input msg arrived, with the output?
      try {
        if (node.passthrough === 'yes') {
          // Respect the order! Object.assign(target, master). On master will be copied to target and properties of master will overwrite the same properties on target!
          if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
          msg = Object.assign(RED.util.cloneMessage(node.inputmessage), msg);
          node.inputmessage = {};
        } else if (node.passthrough === 'yesownprop') {
          // Yes, but in an own prop
          if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
          msg.inputmessage = RED.util.cloneMessage(node.inputmessage);
          node.inputmessage = {};
        }
      } catch (error) { }
      node.send(msg);
    };


    node.on('input', (msg) => {
      if (typeof msg === 'undefined') return;
      if (!node.server) return; // 29/08/2019 Server not instantiate

      // 11/01/2021 Accept properties change from msg
      // *********************************
      if (msg.hasOwnProperty('setConfig')) {
        payloadRounder.KNXULtimateChangeConfigByInputMSG(msg, node, config);
        return;
      }
      // *********************************


      // 16/06/2024 Check wether the node has a group address set.
      // Validate the Address
      if (node.listenallga === false) {
        try {
          KNXUtils.validateKNXAddress(node.topic, true);
        } catch (error) {
          node.setNodeStatus({
            fill: 'red', shape: 'dot', text: error.message, payload: '', GA: node.topic, dpt: '', devicename: '',
          });
          return;
        }
      }

      // 19/06/2022 Reset the RBE filter https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/191
      // *********************************
      if (msg.hasOwnProperty('resetRBE')) {
        node.currentPayload = '';
        node.setNodeStatus({
          fill: 'grey', shape: 'ring', text: 'Reset RBE filter on this node.', payload: '', GA: '', dpt: '', devicename: '',
        });
        return;
      }
      // *********************************

      if (node.passthrough !== 'no') { // 27/03/2020 Save the input message to be passed out to msg output
        // The msg has a TTL of 3 seconds
        if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
        node.timerTTLInputMessage = setTimeout(() => { node.inputmessage = {}; }, 3000);
        node.inputmessage = RED.util.cloneMessage(msg); // 28/03/2020 Store the message to be passed through.
      }

      // 25/07/2019 if payload is read or the Telegram type is set to "read", do a read, otherwise, write to the bus
      if ((msg.hasOwnProperty('readstatus') && msg.readstatus === true) || node.outputtype === 'read') {
        // READ: Send a Read request to the bus
        let grpaddr = '';
        if (node.listenallga == false) {
          grpaddr = node.topic;
          if (msg.hasOwnProperty('destination')) grpaddr = msg.destination;
          // 29/12/2020 Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
          if (msg.hasOwnProperty('knx')) {
            if (msg.knx.destination == grpaddr && ((msg.knx.event === 'GroupValue_Response' || msg.knx.event === 'GroupValue_Read'))) {
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: Circular reference protection during READ. The node ${node.id} has been temporary disabled. Two nodes with same group address and reaction/Telegram type are linked. See the FAQ in the Wiki. Msg:${JSON.stringify(msg)}`);
              const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                node.setNodeStatus({
                  fill: 'red', shape: 'ring', text: `DISABLED due to a circulare reference while READ (${grpaddr}).`, payload: '', GA: '', dpt: '', devicename: '',
                });
              }, 1000);
              return;
            }
          }
          node.setNodeStatus({
            fill: 'grey', shape: 'dot', text: 'Read', payload: '', GA: grpaddr, dpt: '', devicename: '',
          });
          node.server.writeQueueAdd({
            grpaddr, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id,
          });
        } else { // Listen all GAs
          if (msg.hasOwnProperty('destination')) {
            // listenallga is true, but the user specified own group address
            grpaddr = msg.destination;
            // 29/12/2020 Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
            if (msg.hasOwnProperty('knx')) {
              if (msg.knx.destination == grpaddr && ((msg.knx.event === 'GroupValue_Response' || msg.knx.event === 'GroupValue_Read'))) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: Circular reference protection during READ-2. The node ${node.id} has been temporary disabled. Two nodes with same group address and reaction/Telegram type are linked. See the FAQ in the Wiki. Msg:${JSON.stringify(msg)}`);
                const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                  node.setNodeStatus({
                    fill: 'red', shape: 'ring', text: `DISABLED due to a circulare reference while READ-2 (${grpaddr}).`, payload: '', GA: '', dpt: '', devicename: '',
                  });
                }, 1000);
                return;
              }
            }
            node.server.writeQueueAdd({
              grpaddr, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id,
            });
          } else {
            // Issue read to all group addresses
            // 25/10/2019 the user is able not import the csv, so i need to check for it. This option should be unckecked by the knxUltimate html config, but..
            if (typeof node.server.csv !== 'undefined') {
              let delay = 0;
              for (let index = 0; index < node.server.csv.length; index++) {
                const element = node.server.csv[index];
                const grpaddr = element.ga;
                // 29/12/2020 Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
                if (msg.hasOwnProperty('knx')) {
                  if (msg.knx.destination == grpaddr && ((msg.knx.event === 'GroupValue_Response' || msg.knx.event === 'GroupValue_Read'))) {
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: Circular reference protection during READ-3. Node ${node.id} The read request hasn't been sent. Two nodes with same group address and reaction/Telegram type are linked. See the FAQ in the Wiki. Msg:${JSON.stringify(msg)}`);
                    node.setNodeStatus({
                      fill: 'red', shape: 'ring', text: `NOT SENT due to a circulare reference while READ-3 (${grpaddr}).`, payload: '', GA: '', dpt: '', devicename: '',
                    });
                  }
                } else {
                  node.server.writeQueueAdd({
                    grpaddr, payload: '', dpt: '', outputtype: 'read', nodecallerid: node.id,
                  });
                  const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                    // Timeout is only for the status update.
                    node.setNodeStatus({
                      fill: 'grey', shape: 'dot', text: 'Add Read to queue...', payload: '', GA: grpaddr, dpt: element.dpt, devicename: element.devicename,
                    });
                  }, delay);
                  delay += 10;
                }
              }
            } else {
              // No csv. A chi cavolo dovrei mandare la richiesta read?
              const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                // Timeout is only for the status update.
                node.setNodeStatus({
                  fill: 'red', shape: 'dot', text: "Read: ETS file not set, i don't know where to send the read request.", payload: '', GA: '', dpt: '', devicename: node.name,
                });
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`KNX-Ultimate: ETS file not set, i don't know where to send the read request. I'm the node ${node.id}`);
              }, 100);
            }
          }
        }
      } else {
        if (node.listenallga === false) {
          // 23/12/2020 Applying RBE filter
          if (node.outputRBE === "true") {
            // 19/01/2023 CHECKING THE INPUT PAYLOAD (ROUND, ETC) BASED ON THE NODE CONFIG
            //* ********************************************************
            const pTest = payloadRounder.Manipulate(node, msg.payload);
            //* ********************************************************

            if (_.isEqual(node.currentPayload, pTest)) {
              // RBE kicks in, doesn't send the payload
              node.setNodeStatus({
                fill: 'grey', shape: 'ring', text: `rbe block (${msg.payload}) to KNX`, payload: '', GA: '', dpt: '', devicename: '',
              });
              return;
            }
          }
        }
        // 07/02/2020 Revamped flood protection (avoid accepting too many messages as input)
        if (node.icountMessageInWindow == -999) return; // Locked out
        if (node.icountMessageInWindow == 0) {
          const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
            if (node.icountMessageInWindow >= 120) {
              // Looping detected
              node.setNodeStatus({
                fill: 'red', shape: 'ring', text: 'DISABLED! Flood protection! Too many msg at the same time.', payload: '', GA: '', dpt: '', devicename: '',
              });
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: Node ${node.id} has been disabled due to Flood Protection. Too many messages in a timeframe. Check your flow's design or use RBE option.`);
              node.icountMessageInWindow = -999; // Lock out node
            } else { node.icountMessageInWindow = -1; }
          }, 1000);
        }
        node.icountMessageInWindow += 1;

        // OUTPUT: Send message to the bus (write/response)
        if (node.server.knxConnection) {
          let { outputtype } = node;
          let grpaddr = '';
          let dpt = '';

          // 29/12/2020 Check wheter the input message contains the "event" property, that overwrite the node's outputtype
          if (msg.hasOwnProperty('event')) {
            if (msg.event === 'GroupValue_Write') outputtype = 'write';
            if (msg.event === 'GroupValue_Response') outputtype = 'response';
            if (msg.event === 'Update_NoWrite') outputtype = 'update'; // 05/01/2021 Doesn't send anything to the bus. Only updates the node currentPayload
          }

          if (node.listenallga === true) {
            // The node is set to Universal mode (listen to all Group Addresses). Some fields are needed
            if (msg.hasOwnProperty('destination')) {
              grpaddr = msg.destination;
            } else {
              node.setNodeStatus({
                fill: 'red', shape: 'dot', text: 'msg.destination not set!', payload: '', GA: '', dpt: '', devicename: '',
              });
              return;
            }
            if (msg.hasOwnProperty('dpt') && msg.dpt !== undefined && msg.dpt !== '') {
              dpt = msg.dpt;
            } else {
              // No datapoint set. If the CSV is loaded, try to get it from there.
              if (!msg.hasOwnProperty('writeraw')) { // In raw mode, Datapoint is useless
                // Get the datapoint from the CSV
                if (typeof node.server.csv !== 'undefined') {
                  const oGA = node.server.csv.filter((sga) => sga.ga == grpaddr)[0];
                  if (oGA !== undefined) {
                    dpt = oGA.dpt;
                  } else {
                    node.setNodeStatus({
                      fill: 'red', shape: 'dot', text: 'msg.dpt not set and not found in the CSV!', payload: '', GA: '', dpt: '', devicename: '',
                    });
                    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: node id: ${node.id} ` + 'msg.dpt not set and not found in the CSV!');
                    return;
                  }
                } else {
                  node.setNodeStatus({
                    fill: 'red', shape: 'dot', text: "msg.dpt not set and there's no CSV to search for!", payload: '', GA: '', dpt: '', devicename: '',
                  });
                  if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: node id: ${node.id} ` + 'msg.dpt not set and there\'s no CSV to search for!');
                  return;
                }
              }
            }
          } else {
            grpaddr = msg.hasOwnProperty('destination') ? msg.destination : node.topic;
            dpt = (msg.hasOwnProperty('dpt') && msg.dpt !== undefined && msg.dpt !== '') ? msg.dpt : node.dpt;
          }

          // Protection over circular references (for example, if you link two Ultimate Nodes toghether with the same group address), to prevent infinite loops
          if (msg.hasOwnProperty('knx')) {
            if (msg.knx.destination == grpaddr && ((msg.knx.event === 'GroupValue_Write' && outputtype === 'write') || (msg.knx.event === 'GroupValue_Response' && outputtype === 'response') || (msg.knx.event === 'GroupValue_Response' && outputtype === 'read') || (msg.knx.event === 'GroupValue_Read' && outputtype === 'read'))) {
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: Circular reference protection. The node ${node.id} has been temporarely disabled. Two nodes with same group address and reaction/Telegram type are linked. See the FAQ in the Wiki. Msg:${JSON.stringify(msg)}`);
              const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
                node.setNodeStatus({
                  fill: 'red', shape: 'ring', text: `DISABLED due to a circulare reference (${grpaddr}).`, payload: '', GA: '', dpt: '', devicename: '',
                });
              }, 1000);
              return;
            }
          }

          // 01/12/2020 Write RAW added.
          //  If you encode the values by yourself, you can write raw buffers with writeRaw(groupaddress: string, buffer: Buffer, bitlength?: Number, callback?: () => void).
          // The third (optional) parameter bitlength is necessary for datapoint types where the bitlength does not equal the buffers bytelength * 8. This is the case for dpt 1 (bitlength 1), 2 (bitlength 2) and 3 (bitlength 4). For other dpts the paramter can be omitted.
          // // Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
          // connection.writeRaw('1/0/0', Buffer.from('01', 'hex'), 1)
          // // Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
          // connection.writeRaw('1/0/0', Buffer.from('0730', 'hex'))
          if (msg.hasOwnProperty('writeraw') && msg.hasOwnProperty('writeraw') !== null) {
            try {
              if (msg.hasOwnProperty('bitlenght') && msg.bitlenght !== null) {
                node.server.knxConnection.writeRaw(grpaddr, msg.writeraw, msg.bitlenght);
              } else {
                node.server.knxConnection.writeRaw(grpaddr, msg.writeraw);
              }
              node.setNodeStatus({
                fill: 'green', shape: 'dot', text: 'RAW Write', payload: '', GA: grpaddr, dpt: '', devicename: '',
              });
            } catch (error) {
              node.setNodeStatus({
                fill: 'red', shape: 'dot', text: `Error RAW Write: ${error}`, payload: '', GA: grpaddr, dpt: '', devicename: '',
              });
            }
            return;
          }

          if (outputtype == 'response') {
            try {
              node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
              node.server.writeQueueAdd({
                grpaddr, payload: msg.payload, dpt, outputtype, nodecallerid: node.id,
              });
              node.setNodeStatus({
                fill: 'blue', shape: 'dot', text: 'Responding', payload: msg.payload, GA: grpaddr, dpt, devicename: '',
              });
            } catch (error) { }
          } else if (outputtype == 'update') {
            // 05/01/2021 Updates only the internal currentPayload value.
            try {
              node.currentPayload = msg.payload;
              node.server.writeQueueAdd({
                grpaddr, payload: msg.payload, dpt, outputtype, nodecallerid: node.id,
              });
              node.setNodeStatus({
                fill: 'grey', shape: 'dot', text: 'Updating internal value', payload: msg.payload, GA: grpaddr, dpt, devicename: '',
              });
            } catch (error) { }
          } else {
            try {
              node.currentPayload = msg.payload;// 31/12/2019 Set the current value (because, if the node is a virtual device, then it'll never fire "GroupValue_Write" in the server node, causing the currentPayload to never update)
              // if (node.server.linkStatus === "connected") {
              node.server.writeQueueAdd({
                grpaddr, payload: msg.payload, dpt, outputtype, nodecallerid: node.id,
              });
              node.setNodeStatus({
                fill: 'green', shape: 'dot', text: 'Writing', payload: msg.payload, GA: grpaddr, dpt, devicename: '',
              });
              // } else {
              //    node.setNodeStatus({ fill: "grey", shape: "dot", text: "Disconnected", payload: msg.payload, GA: grpaddr, dpt: dpt, devicename: "" });
              // }
            } catch (error) { }
          }
        }
      }
    });

    node.on('close', (done) => {
      if (node.timerTTLInputMessage !== null) clearTimeout(node.timerTTLInputMessage);
      node.inputmessage = {};
      if (node.server) {
        node.server.removeClient(node);
        try {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`knxUltimate: Close: node id ${node.id} with topic ${node.topic || ''} has been removed from the server.`);
        } catch (error) { }
      }
      done();
    });

    // On each deploy, add the node to the server list
    if (node.server) {
      node.server.addClient(node);
      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`knxUltimate: addClient: node id ${node.id}` || '' + ` with topic ${node.topic || ''} has been added to the server.`);
      // 05/11/2021 if the node is set to read from bus, issue a read.
      // "node-input-initialread0": "No",
      // "node-input-initialread1": "Leggi dal BUS KNX",
      // "node-input-initialread2": "Leggi l'ultimo valore salvato su file prima della disconnessione.",
      // "node-input-initialread3": "Leggi l'ultimo valore salvato su file prima della disconnessione. Se inesistente, leggi dal BUS KNX",
      if (node.server.linkStatus === 'connected' && node.initialread === 1 || node.initialread === 3) {
        node.setNodeStatus({
          fill: 'yellow', shape: 'dot', text: 'Get value from BUS.', payload: '', GA: node.topic || '', dpt: '', devicename: '',
        });
        const t = setTimeout(() => { // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.emit('input', { readstatus: true });
        }, 3000);
      }
    }
  }
  RED.nodes.registerType('knxUltimate', knxUltimate);
};
