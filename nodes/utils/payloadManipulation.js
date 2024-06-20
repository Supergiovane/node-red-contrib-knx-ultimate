/**
  * @param {object} [_oNode]
  * @param {any} [jsValue]
  */
exports.Manipulate = function roundPayload(_oNode, jsValue) {
  // 19/01/2023 FORMATTING THE OUTPUT PAYLOAD BASED ON SINGLE NODE SETUP
  //* ********************************************************
  // Formatting the msg output value
  try {
    if (_oNode !== null && jsValue !== null) {
      if (typeof jsValue === 'number' && _oNode.formatmultiplyvalue !== undefined && _oNode.formatdecimalsvalue !== undefined && _oNode.formatnegativevalue !== undefined) {
        // multiplier
        jsValue = jsValue * _oNode.formatmultiplyvalue
        // Number of decimals
        if (_oNode.formatdecimalsvalue == 999) {
          // Leave as is
        } else {
          // Round
          // jsValue = +(Math.round(jsValue + "e+" + _oNode.formatdecimalsvalue) + "e-" + _oNode.formatdecimalsvalue);
          const iMigliaia = parseInt('1' + '0'.repeat(_oNode.formatdecimalsvalue))
          jsValue = Math.round(jsValue * iMigliaia) / iMigliaia
        }
        // leave, zero or abs
        if (jsValue < 0) {
          if (_oNode.formatnegativevalue == 'zero') {
            jsValue = 0
          } else if (_oNode.formatnegativevalue == 'abs') {
            jsValue = Math.abs(jsValue)
          }
        }
      }
      return jsValue
    } else {
      return jsValue
    }
  } catch (error) {
    return jsValue
  }
  //* ********************************************************
}

// KNXULtimate nodes
module.exports.KNXULtimateChangeConfigByInputMSG = function KNXULtimateChangeConfigByInputMSG(msg, node, config) {

  if (!msg.setConfig.hasOwnProperty('setGroupAddress') || !msg.setConfig.hasOwnProperty('setDPT')) {
    node.setNodeStatus({
      fill: 'red', shape: 'ring', text: `setGroupAddress and setDPT are mandatory`, payload: '', GA: '', dpt: '', devicename: '',
    });
    return;
  }

  // Set DPT
  node.dpt = msg.setConfig.setDPT;
  config.dpt = msg.setConfig.setDPT;

  // SET GORUP ADDRESS
  node.topic = msg.setConfig.setGroupAddress;
  config.topic = msg.setConfig.setGroupAddress
  node.outputtopic = (config.outputtopic === undefined || config.outputtopic === '') ? msg.setConfig.setGroupAddress : config.outputtopic; // 07/02/2020 Importante, per retrocompatibilità
  config.outputtopic = node.outputtopic;

  // Read from the ETS file, the missing props
  if (node.server.csv !== undefined && node.server.csv !== null) {
    // Read it from ETS File
    const found = node.server.csv.find(item => item.ga === msg.setConfig.setGroupAddress);
    if (found !== undefined) {
      if (msg.setConfig.setDPT === 'auto') {
        node.dpt = found.dpt; // SET THE DPT
        config.dpt = found.dpt;
      }
      node.name = found.devicename;
      config.name = found.devicename;
    }
  }
  // If DPT is still "auto", something has going wrong
  if (node.dpt === 'auto') {
    // Unable to retrieve the datapoint
    node.setNodeStatus({
      fill: 'red', shape: 'ring', text: `Unable to retrieve the datapoint from the ETS file`, payload: '', GA: '', dpt: '', devicename: '',
    });
    if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`knxUltimate: setConfig: Node.id: ${node.id} error: Unable to retrieve the datapoint from the ETS file`);
  } else {
    node.setNodeStatus({
      fill: 'blue', shape: 'ring', text: `Config changed. Current GA: ${node.topic} DPT: ${node.dpt}`, payload: '', GA: '', dpt: '', devicename: node.name,
    });
  }

};