module.exports = function (RED) {
  function knxUltimateHueHumiditySensor(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.serverKNX = RED.nodes.getNode(config.server) || undefined;
    node.serverHue = RED.nodes.getNode(config.serverHue) || undefined;
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
    node.outputRBE = 'false';
    node.inputRBE = 'false';
    node.currentPayload = '';
    node.passthrough = 'no';
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = 'leave';
    node.formatdecimalsvalue = 2;
    node.hueDevice = config.hueDevice;
    node.dpthumiditysensor = config.dpthumiditysensor;
    node.humidityDPT = (config.dpthumiditysensor && config.dpthumiditysensor !== '') ? config.dpthumiditysensor : '9.007';
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === 'yes');
    node.currentDeviceValue = 0;
    node.enableNodePINS = (config.enableNodePINS === undefined || config.enableNodePINS === 'yes');
    node.outputs = node.enableNodePINS ? 1 : 0;

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

    node.setNodeStatus = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = '';
        const dDate = new Date();
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString();
        node.sKNXNodeStatusText = `|KNX: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`;
        pushStatus({ fill, shape, text: (node.sHUENodeStatusText || '') + ' ' + (node.sKNXNodeStatusText || '') });
      } catch (error) { /* empty */ }
    };

    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      try {
        if (payload === undefined) payload = '';
        const dDate = new Date();
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString();
        node.sHUENodeStatusText = `|HUE: ${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})`;
        pushStatus({ fill, shape, text: node.sHUENodeStatusText + ' ' + (node.sKNXNodeStatusText || '') });
      } catch (error) { /* empty */ }
    };

    const mapHumidityValue = (_event) => {
      if (_event?.humidity === undefined) return undefined;
      let value;
      if (typeof _event.humidity.percentage === 'number') {
        value = _event.humidity.percentage;
      } else if (typeof _event.humidity.humidity === 'number') {
        value = _event.humidity.humidity;
      }
      if (value === undefined) return undefined;
      if (value > 100) {
        value = value / 100;
      }
      return Math.round(value * 100) / 100;
    };

    node.handleSend = (msg) => {
      if (msg.knx.event === 'GroupValue_Read') {
        switch (msg.knx.destination) {
          case config.GAhumiditysensor:
            node.sendResponseToKNX(node.currentDeviceValue);
            break;
          default:
            break;
        }
      }
    };

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id !== config.hueDevice) return;
        const humidityValue = mapHumidityValue(_event);
        if (humidityValue === undefined || Number.isNaN(humidityValue)) return;

        const knxMsgPayload = {
          topic: config.GAhumiditysensor,
          dpt: node.humidityDPT,
          payload: humidityValue,
          name: node.name,
          event: 'humidity',
          rawEvent: _event,
        };

        if (knxMsgPayload.topic) {
          safeSendToKNX({
            grpaddr: knxMsgPayload.topic,
            payload: knxMsgPayload.payload,
            dpt: knxMsgPayload.dpt,
            outputtype: 'write',
          }, 'write');
        }
        node.currentDeviceValue = knxMsgPayload.payload;

        updateStatus({
          fill: 'green',
          shape: 'dot',
          text: `HUE->KNX ${knxMsgPayload.payload} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
        });

        if (node.enableNodePINS) {
          node.send(knxMsgPayload);
        }
        node.setNodeStatusHue({
          fill: 'blue',
          shape: 'ring',
          text: 'HUE->KNX',
          payload: knxMsgPayload.payload,
        });
      } catch (error) {
        updateStatus({
          fill: 'red',
          shape: 'dot',
          text: `HUE->KNX error ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
        });
      }
    };

    node.sendResponseToKNX = (_level) => {
      if (!node.serverKNX) return;
      const knxMsgPayload = {
        topic: config.GAhumiditysensor,
        dpt: node.humidityDPT,
        payload: _level,
      };
      if (knxMsgPayload.topic) {
        safeSendToKNX({
          grpaddr: knxMsgPayload.topic,
          payload: knxMsgPayload.payload,
          dpt: knxMsgPayload.dpt,
          outputtype: 'response',
        }, 'response');
      }
    };

    if (node.serverKNX) {
      node.serverKNX.removeClient(node);
      node.serverKNX.addClient(node);
    }
    if (node.serverHue) {
      node.serverHue.removeClient(node);
      node.serverHue.addClient(node);
    }

    node.on('close', (done) => {
      if (node.serverKNX) {
        node.serverKNX.removeClient(node);
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node);
      }
      done();
    });
  }
  RED.nodes.registerType('knxUltimateHueHumiditySensor', knxUltimateHueHumiditySensor);
};
