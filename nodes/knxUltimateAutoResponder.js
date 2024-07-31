module.exports = function (RED) {
  const dptlib = require('knxultimate').dptlib;
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
    node.decodedRespondToList = [];
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

    if (node.server.csv === undefined || node.server.csv === '' || node.server.csv.length === 0) {
      node.status({ fill: 'grey', shape: 'ring', text: 'No ETS file imported', payload: '', dpt: '', devicename: '' });
      //return;
    } else {
      node.server.csv.forEach(element => {
        node.exposedGAs.push({ address: element.ga, dpt: element.dpt, devicename: element.devicename, payload: undefined })
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
        if (element.ga.includes('..')) {
          const start = Number(element.ga.substring(element.ga.lastIndexOf("/") + 1, element.ga.indexOf("..")));
          const end = Number(element.ga.substring(element.ga.indexOf("..") + 2));
          const twoLevel = element.ga.substring(0, element.ga.lastIndexOf("/") + 1);
          for (let index = start; index < end; index++) {
            const decAdd = twoLevel + index;
            node.decodedRespondToList.push({ address: decAdd, default: defaultVal });
          }
        } else {
          node.decodedRespondToList.push({ address: element.ga, default: defaultVal })
        }
        node.status({ fill: 'green', shape: 'ring', text: 'JSON parsed: ' + node.decodedRespondToList.length + " directive(s).", payload: '', dpt: '', devicename: '' });
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
          var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination)
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination) ${error.stack}`);
        }
        if (oGa === undefined) {
          let datapoint;
          let decodedPayload;
          if (msg.knx !== undefined && msg.knx.dpt !== undefined) {
            // There is the CSV file imported
            datapoint = msg.knx.dpt;
            decodedPayload = msg.payload;
          } else {
            // Must get the dpt from the decodedRespondToList list, then decode the payload
            try {
              datapoint = node.decodedRespondToList.find(x => x.address === msg.knx.destination).dpt;
              const dpt = dptlib.resolve(datapoint);
              const decodedPayload = dptlib.fromBuffer(msg.knx.rawValue, dpt);
            } catch (error) {
              node.status({ fill: 'red', shape: 'dot', text: 'datapoint = node.decodedRespondToList ' + error.message, payload: '', dpt: '', devicename: '' });
              if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: datapoint = node.decodedRespondToList.find(x => x.address === msg.knx.destination).dpt ${error.stack}`);
            }
          }
          if (decodedPayload !== undefined && datapoint !== undefined) node.exposedGAs.push({ address: msg.knx.destination, devicename: undefined, dpt: datapoint, payload: decodedPayload })

        } else {
          oGa.dpt = msg.knx.dpt
          oGa.payload = msg.payload
        }
      } else {

        // Send the response to the bus
        var defaultValue; // Default value if no payload in the exposedGA list
        var bFound = false;
        // Can i handle the incoming message?
        try {
          for (let index = 0; index < node.decodedRespondToList.length; index++) {
            const element = node.decodedRespondToList[index];
            if (msg.knx.destination === element.address) {
              defaultValue = element.default;
              bFound = true;
              break;
            }
          }
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: before bFound ${error.stack}`);
        }
        if (!bFound) return;

        try {
          let retVal;
          let oFoundGA = node.exposedGAs.find(ga => ga.address === msg.knx.destination);
          if (oFoundGA === undefined) return;
          if (oFoundGA.payload === undefined) {
            if (defaultValue === 'true') defaultValue = true;
            if (defaultValue === 'false') defaultValue = false;
            retVal = defaultValue;
          } else {
            retVal = oFoundGA.payload;
          }
          if (retVal !== undefined) {
            const dDate = new Date()
            node.status({ fill: 'blue', shape: 'dot', text: 'Respond ' + oFoundGA.address + ' => ' + retVal + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ')' })
            node.server.writeQueueAdd({ grpaddr: oFoundGA.address, payload: retVal, dpt: oFoundGA.dpt || '', outputtype: 'response', nodecallerid: node.id });
          }
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimateAutoResponder: after bFound ${error.stack}`);
        }
      }
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      node.exposedGAs = [];
      node.decodedRespondToList = [];
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
