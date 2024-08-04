module.exports = function (RED) {
  const dptlib = require('knxultimate').dptlib;
  const fs = require("fs");
  const path = require("path");

  // msg is:
  //  // Build final input message object
  //  return {
  //     topic: _outputtopic
  //     , payload: jsValue
  //     , devicename: (typeof _devicename !== 'undefined') ? _devicename : ""
  //     , payloadmeasureunit: sPayloadmeasureunit
  //     , payloadsubtypevalue: sPayloadsubtypevalue
  //     , knx:
  //     {
  //         event: _event
  //         , dpt: sInputDpt
  //         //, details: dpt
  //         , dptdesc: sDptdesc
  //         , source: _srcGA
  //         , destination: _destGA
  //         , rawValue: _Rawvalue
  //     }
  // };

  // The node.exposedGAs is and array of:
  // {
  //     address,
  //     dpt,
  //     payload
  // }

  function knxUltimateAutoResponder(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.server = RED.nodes.getNode(config.server)
    node.topic = node.name
    node.name = config.name === undefined ? 'Auto responder' : config.name
    node.outputtopic = node.name
    node.dpt = ''
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false' // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false' // Apply or not RBE to the input (Messages coming from BUS)
    node.exposedGAs = [];
    node.commandText = []; // Raw list Respond To
    node.sysLogger = require('./utils/sysLogger.js').get({ loglevel: node.server.loglevel || 'error' }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      // try {
      //   if (node.server == null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
      //   GA = GA === undefined ? '' : GA
      //   payload = payload === undefined ? '' : payload
      //   payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
      //   const dDate = new Date()
      //   node.status({ fill, shape, text: GA + ' ' + payload + ' ' + text + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
      // } catch (error) {
      // }
    }

    node.saveExposedGAs = () => {
      const sFile = path.join(node.server.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
      try {
        if (node.exposedGAs.length > 0) {
          fs.writeFileSync(sFile, JSON.stringify(node.exposedGAs));
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("knxUltimateAutoResponder: wrote peristent values to the file " + sFile);
        }
      } catch (err) {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error("knxUltimateAutoResponder: unable to write peristent values to the file " + sFile + " " + err.message);
      }
    }
    node.loadExposedGAs = () => {
      const sFile = path.join(node.server.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
      try {
        node.exposedGAs = JSON.parse(fs.readFileSync(sFile, "utf8"));
      } catch (err) {
        node.exposedGAs = [];
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn("knxUltimateAutoResponder: unable to read peristent file " + sFile + " " + err.message);
      }
    }

    // Load persistent file
    try {
      node.loadExposedGAs()
    } catch (error) {
    }


    // Add the ETS CSV file list to exposedGAs
    if (node.server.csv === undefined || node.server.csv === '' || node.server.csv.length === 0) {
      node.status({ fill: 'grey', shape: 'ring', text: 'No ETS file imported', payload: '', dpt: '', devicename: '' });
      //return;
    } else {
      node.server.csv.forEach(element => {
        const curGa = node.exposedGAs.find(a => a.address === element.ga);
        if (curGa === undefined) {
          node.exposedGAs.push({ address: element.ga, dpt: element.dpt, default: undefined, payload: undefined });
        }
      })
      node.status({ fill: 'green', shape: 'ring', text: 'ETS file loaded', payload: '', dpt: '', devicename: '' });
    }

    // Fill the filter list
    try {
      node.commandText = JSON.parse(config.commandText);
    } catch (error) {
      node.status({ fill: 'red', shape: 'dot', text: 'JSON error: ' + error.message, payload: '', dpt: '', devicename: '' });
      if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: node.commandText = JSON.parse(config.commandText) ${error.stack}`);
      return;
    }

    // Decode the commandText list be exploding the format 2/2/..
    node.commandText.forEach(element => {
      if (element.ga !== undefined && element.default !== undefined) {
        let defaultVal = element.default;
        let dpt = element.dpt;
        if (element.ga.includes('..')) {
          const start = Number(element.ga.substring(element.ga.lastIndexOf("/") + 1, element.ga.indexOf("..")));
          const end = Number(element.ga.substring(element.ga.indexOf("..") + 2));
          const twoLevel = element.ga.substring(0, element.ga.lastIndexOf("/") + 1);
          for (let index = start; index < end; index++) {
            const decAdd = twoLevel + index;
            // Add also to the exposedGAs list, if not already present
            let curGa = node.exposedGAs.find(a => a.address === decAdd);
            if (curGa === undefined) {
              node.exposedGAs.push({ address: decAdd, dpt: dpt, default: defaultVal, payload: undefined });
            } else {
              if (dpt !== undefined) curGa.dpt = dpt; // Take the Datapoint from the commandText directive, replacing from ETS CSV file, if exists.
            }
          }
        } else {
          let curGa = node.exposedGAs.find(a => a.address === element.ga);
          if (curGa === undefined) {
            node.exposedGAs.push({ address: element.ga, dpt: dpt, default: defaultVal, payload: undefined });
          } else {
            if (dpt !== undefined) curGa.dpt = dpt; // Take the Datapoint from the commandText directive, replacing from ETS CSV file, if exists.
          }
        }
        node.status({ fill: 'green', shape: 'ring', text: 'JSON parsed: ' + node.commandText.length + " directive(s).", payload: '', dpt: '', devicename: '' });
      } else {
        // Error
        node.status({ fill: 'red', shape: 'dot', text: 'JSON error: ga or default keys not set. Abort.', payload: '', dpt: '', devicename: '' });
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: node.commandText.forEach(element.. JSON error: ga or default keys not set. Abort.`);
        return;
      }
    });

    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {

      if (msg.knx !== undefined && msg.knx.event !== undefined && msg.knx.event !== "GroupValue_Read") {

        // Save the value
        try {
          var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination) ${error.stack}`);
        }
        if (oGa !== undefined) {
          try {
            // Don't care about the decoded payload, because knxUltimate-config could pass a TryToFindDatapoint from raw data
            // Take only RAW data and decode it with the dpt specified by the commandText directive
            const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt));
          } catch (error) {
            node.status({ fill: 'red', shape: 'dot', text: 'const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt)); ' + error.message, payload: '', dpt: '', devicename: '' });
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(oGa.dpt)); ${error.stack}`);
          }
          oGa.payload = decodedPayload
        }
      } else {

        try {
          let retVal;
          let oFoundGA = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
          if (oFoundGA === undefined) return;
          if (oFoundGA.payload === undefined) {
            retVal = oFoundGA.default;
          } else {
            retVal = oFoundGA.payload;
          }
          if (retVal !== undefined) {
            const dDate = new Date()
            node.status({ fill: 'blue', shape: 'dot', text: 'Respond ' + oFoundGA.address + ' => ' + retVal + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
            node.server.writeQueueAdd({ grpaddr: oFoundGA.address, payload: retVal, dpt: oFoundGA.dpt, outputtype: 'response', nodecallerid: node.id });
          }
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: after bFound ${error.stack}`);
        }
      }
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      try {
        node.saveExposedGAs();
      } catch (error) {
      }

      node.exposedGAs = [];
      if (node.server) {
        node.server.removeClient(node)
      }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node)
      node.server.addClient(node)
    }
  }
  RED.nodes.registerType('knxUltimateAutoResponder', knxUltimateAutoResponder)
}
