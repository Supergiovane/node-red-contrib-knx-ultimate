module.exports = function (RED) {
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
      node.setNodeStatus({ fill: 'red', shape: '', text: 'No ETS file imported', payload: '', dpt: '', devicename: '' });
      return;
    }

    node.server.csv.forEach(element => {
      node.exposedGAs.push({ address: element.ga, dpt: element.dpt, devicename: element.devicename, payload: undefined })
    })

    // Fill the filter list
    try {
      node.commandText = config.commandText.split('\n');
      if (node.commandText === undefined || node.commandText.length === 0) {
        node.setNodeStatus({ fill: 'red', shape: '', text: 'Respond to list must be filled', payload: '', dpt: '', devicename: '' });
        return;
      }
    } catch (error) {
      return;
    }

    // Decode the commandText list be exploding the format 2/x, 2/2/x
    for (let index = 0; index < node.commandText.length; index++) {
      const element = node.commandText[index];
      let defaultVal = element.split(':')[1];
      if (element.split(':')[0].includes('x')) {
        for (let index = 0; index < 257; index++) {
          let decAdd = element.split(':')[0].replace(/x/g, index)
          node.decodedRespondToList.push({ address: decAdd, default: defaultVal })
        }
      } else {
        node.decodedRespondToList.push({ address: element.split(':')[0], default: defaultVal })
      }
    }


    // This function is called by the knx-ultimate config node, to output a msg.payload.
    node.handleSend = msg => {

      if (msg.knx !== undefined && msg.knx.event !== undefined && msg.knx.event !== "GroupValue_Read") {

        // Save the value
        try {
          var oGa = node.exposedGAs.find(ga => ga.address === msg.knx.destination)
        } catch (error) {
          console.log(error)
        }
        if (oGa === undefined) {
          node.exposedGAs.push({ address: msg.knx.destination, devicename: undefined, dpt: msg.knx.dpt, payload: msg.payload })
        } else {
          oGa.dpt = msg.knx.dpt
          oGa.payload = msg.payload
        }
      } else {

        // Send the response to the bus
        var defaultValue; // Default value if no payload in the exposedGA list
        var bFound = false;
        // Can i handle the incoming message?
        for (let index = 0; index < node.decodedRespondToList.length; index++) {
          const element = node.decodedRespondToList[index];
          if (msg.knx.destination === element.address) {
            defaultValue = element.default;
            bFound = true;
            break;
          }
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
          console.log(error)
        }
      }
    }

    node.on('input', function (msg) {

    })

    node.on('close', function (done) {
      if (node.timerExposedGAs !== null) clearTimeout(node.timerExposedGAs)
      node.exposedGAs = []
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
