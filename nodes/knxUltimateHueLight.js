/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-lonely-if */
module.exports = function (RED) {
  const dptlib = require("../KNXEngine/src/dptlib");
  const hueColorConverter = require("./utils/hueColorConverter");

  function knxUltimateHueLight(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    node.serverHue = RED.nodes.getNode(config.serverHue);
    node.topic = node.name;
    node.name = config.name === undefined ? "Hue" : config.name;
    node.outputtopic = node.name;
    node.dpt = "";
    node.notifyreadrequest = false;
    node.notifyreadrequestalsorespondtobus = "false";
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = "";
    node.notifyresponse = false;
    node.notifywrite = true;
    node.initialread = true;
    node.listenallga = true; // Don't remove
    node.outputtype = "write";
    node.outputRBE = false; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = false; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ""; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = "no";
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = "leave";
    node.formatdecimalsvalue = 2;
    node.currentHUEDevice = undefined; // At start, this value is filled by a call to HUE api. It stores a value representing the current light status.
    node.currentKNXGALightState = false; // Stores the current KNX value for the GA
    node.DayTime = true;
    node.isGrouped_light = config.hueDevice.split("#")[1] === "grouped_light";
    node.hueDevice = config.hueDevice.split("#")[0];

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload,
    }) => { };
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({
      fill, shape, text, payload,
    }) => {
      if (payload === undefined) return;
      const dDate = new Date();
      payload = typeof payload === "object" ? JSON.stringify(payload) : payload.toString();
      node.status({ fill, shape, text: `${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})` });
    };

    node.setNodeStatusHue({
      fill: "grey",
      shape: "ring",
      text: "Connecting to the Bridge...",
      payload: "",
    });

    // This function is called by the hue-config.js
    node.handleSend = (msg) => {
      if (node.currentHUEDevice === undefined) {
        node.setNodeStatusHue({
          fill: "red",
          shape: "ring",
          text: "Rejected KNX message. I'm connecting to the Bridge...",
          payload: "",
        });
        return;
      }
      let state = {};
      try {
        switch (msg.knx.destination) {
          case config.GALightSwitch:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightSwitch));
            if (msg.payload === true) {
              // The user selected specific color/brightness at switch on.
              let jColorChoosen = null;
              if (node.DayTime === true && (config.specifySwitchOnBrightness === undefined || config.specifySwitchOnBrightness === "yes")) {
                try {
                  jColorChoosen = JSON.parse(config.colorAtSwitchOnDayTime);
                  if (jColorChoosen.green === undefined) jColorChoosen.green = jColorChoosen.hasOwnProperty("geen") ? jColorChoosen.geen : jColorChoosen.green;
                } catch (error) {
                  jColorChoosen = { red: 255, green: 255, blue: 255 };
                }
              } else if (node.DayTime === false && config.enableDayNightLighting === "yes") {
                try {
                  jColorChoosen = JSON.parse(config.colorAtSwitchOnNightTime);
                } catch (error) {
                  jColorChoosen = { red: 10, green: 10, blue: 10 };
                }
              }
              if (jColorChoosen !== null) {
                let gamut = null;
                if (
                  node.currentHUEDevice !== undefined
                  && node.currentHUEDevice.hasOwnProperty("color")
                  && node.currentHUEDevice.color.hasOwnProperty("gamut_type")
                ) {
                  gamut = node.currentHUEDevice.color.gamut_type;
                }
                const dretXY = hueColorConverter.ColorConverter.rgbToXy(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue, gamut);
                const dbright = hueColorConverter.ColorConverter.getBrightnessFromRGB(jColorChoosen.red, jColorChoosen.green, jColorChoosen.blue);
                node.currentHUEDevice.dimming.brightness = dbright;
                node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
                state = dbright > 0 ? { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } } : { on: { on: false } };
              } else {
                state = { on: { on: true }, dimming: node.currentHUEDevice.dimming };
              }
            } else {
              state = { on: { on: false } };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: state,
            });
            break;
          case config.GALightDIM:
            // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
            // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightDIM));
            node.hueDimming(msg.payload.decr_incr, msg.payload.data, config.dimSpeed);
            node.setNodeStatusHue({ fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload) });
            break;
          case config.GADaylightSensor:
            if (config.enableDayNightLighting === "yes") {
              node.DayTime = Boolean(dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptDaylightSensor)));
              if (config.invertDayNight !== undefined && config.invertDayNight === true) node.DayTime = !node.DayTime;
              node.setNodeStatusHue({
                fill: "green",
                shape: "dot",
                text: "KNX->HUE Daytime",
                payload: node.DayTime,
              });
            } else {
              node.DayTime = true;
            }
            break;
          case config.GALightHSV:
            if (config.dptLightHSV === "3.007") {
              // MDT smartbutton will dim the color temperature
              // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
              // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightHSV));
              node.hueDimmingTunableWhite(msg.payload.decr_incr, msg.payload.data, config.dimSpeed);
              node.setNodeStatusHue({ fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload) });
            }
            break;
          case config.GALightHSVPercentage:
            if (config.dptLightHSVPercentage === "5.001") {
              // 0-100% tunable white
              msg.payload = 100 - dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightHSVPercentage));
              // msg.payload = msg.payload <= 0 ? 1 : msg.payload
              const retMirek = hueColorConverter.ColorConverter.scale(msg.payload, [0, 100], [153, 500]);
              msg.payload = retMirek;
              state = { color_temperature: { mirek: msg.payload } };
              node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
              node.setNodeStatusHue({
                fill: "green",
                shape: "dot",
                text: "KNX->HUE",
                payload: state,
              });
            }
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: msg.payload,
            });
            break;
          case config.GALightBrightness:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightBrightness));
            state = { dimming: { brightness: msg.payload } };
            if (node.currentHUEDevice === undefined) {
              // Grouped light
              state.on = { on: msg.payload > 0 };
            } else {
              // Light
              if (node.currentHUEDevice.on.on === false && msg.payload > 0) state.on = { on: true };
              if (node.currentHUEDevice.on.on === true && msg.payload === 0) state.on = { on: false };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: state,
            });
            break;
          case config.GALightColor:
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightColor));
            let gamut = null;
            if (
              node.currentHUEDevice !== undefined
              && node.currentHUEDevice.hasOwnProperty("color")
              && node.currentHUEDevice.color.hasOwnProperty("gamut_type")
            ) {
              gamut = node.currentHUEDevice.color.gamut_type;
            }
            const retXY = hueColorConverter.ColorConverter.rgbToXy(msg.payload.red, msg.payload.green, msg.payload.blue, gamut);
            const bright = hueColorConverter.ColorConverter.getBrightnessFromRGB(msg.payload.red, msg.payload.green, msg.payload.blue);
            // state = bright > 0 ? { on: { on: true }, dimming: { brightness: bright }, color: { xy: retXY } } : { on: { on: false } }
            state = { dimming: { brightness: bright }, color: { xy: retXY } };
            if (node.currentHUEDevice === undefined) {
              // Grouped light
              state.on = { on: bright > 0 };
            } else {
              // Light
              if (node.currentHUEDevice.on.on === false && bright > 0) state.on = { on: true };
              if (node.currentHUEDevice.on.on === true && bright === 0) state = { on: { on: false }, dimming: { brightness: bright } };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: state,
            });
            break;
          case config.GALightBlink:
            const gaVal = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightBlink));
            if (gaVal) {
              node.timerBlink = setInterval(() => {
                if (node.blinkValue === undefined) node.blinkValue = true;
                node.blinkValue = !node.blinkValue;
                msg.payload = node.blinkValue;
                // state = msg.payload === true ? { on: { on: true } } : { on: { on: false } }
                state = msg.payload === true
                  ? { on: { on: true }, dimming: { brightness: 100 }, dynamics: { duration: 0 } }
                  : { on: { on: false }, dimming: { brightness: 0 }, dynamics: { duration: 0 } };
                node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
              }, 1000);
            } else {
              if (node.timerBlink !== undefined) clearInterval(node.timerBlink);
              node.serverHue.hueManager.writeHueQueueAdd(
                node.hueDevice,
                { on: { on: false } },
                node.isGrouped_light === false ? "setLight" : "setGroupedLight",
              );
            }
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: gaVal,
            });
            break;
          case config.GALightColorCycle:
            if (node.timerColorCycle !== undefined) clearInterval(node.timerColorCycle);
            const gaValColorCycle = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightColorCycle));
            if (gaValColorCycle === true) {
              node.serverHue.hueManager.writeHueQueueAdd(
                node.hueDevice,
                { on: { on: true } },
                node.isGrouped_light === false ? "setLight" : "setGroupedLight",
              );
              node.timerColorCycle = setInterval(() => {
                try {
                  function getRandomIntInclusive(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
                  }
                  const red = getRandomIntInclusive(0, 255);
                  const green = getRandomIntInclusive(0, 255);
                  const blue = getRandomIntInclusive(0, 255);
                  let gamut = null;
                  if (
                    node.currentHUEDevice !== undefined
                    && node.currentHUEDevice.hasOwnProperty("color")
                    && node.currentHUEDevice.color.hasOwnProperty("gamut_type")
                  ) {
                    gamut = node.currentHUEDevice.color.gamut_type;
                  }
                  const retXY = hueColorConverter.ColorConverter.rgbToXy(red, green, blue, gamut);
                  const bright = hueColorConverter.ColorConverter.getBrightnessFromRGB(red, green, blue);
                  state = bright > 0 ? { on: { on: true }, dimming: { brightness: bright }, color: { xy: retXY } } : { on: { on: false } };
                  node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
                } catch (error) { }
              }, 10000);
            } else {
              if (node.timerColorCycle !== undefined) clearInterval(node.timerColorCycle);
              node.serverHue.hueManager.writeHueQueueAdd(
                node.hueDevice,
                { on: { on: false } },
                node.isGrouped_light === false ? "setLight" : "setGroupedLight",
              );
            }
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: gaValColorCycle,
            });
            break;
          default:
            break;
        }
      } catch (error) {
        node.status({
          fill: "red",
          shape: "dot",
          text: `KNX->HUE error ${error.message || error} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
        });
      }
    };

    // Start dimming
    // ***********************************************************
    node.hueDimming = function hueDimming(_KNXaction, _KNXbrightness_delta, _dimSpeedInMillisecs = undefined) {
      let dimDirection = 'stop';
      let hueTelegram = {};
      _dimSpeedInMillisecs = (_dimSpeedInMillisecs === undefined || _dimSpeedInMillisecs === '') ? 5000 : _dimSpeedInMillisecs;
      let delta = 0;
      const minDimLevelLight = config.minDimLevelLight === undefined ? 3 : config.minDimLevelLight;
      const maxDimLevelLight = config.maxDimLevelLight === undefined ? 100 : config.maxDimLevelLight;

      // We have also minDimLevelLight and maxDimLevelLight to take care of.

      if (_KNXbrightness_delta === 0 && _KNXaction === 0) {
        dimDirection = 'stop';
        hueTelegram = { dimming_delta: { action: dimDirection } };
        node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
        return;
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 1) {
        delta = 100 - Math.round(node.currentHUEDevice.dimming.brightness, 0) - (100 - Number(maxDimLevelLight));
        dimDirection = 'up';
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 0) {
        // Set the minumum delta, taking care of the minimum brightness specified either in the HUE lamp itself, or specified by the user (parameter node.minDimLevelLight)
        delta = Math.round(node.currentHUEDevice.dimming.brightness, 0) - (minDimLevelLight === 'useHueLightLevel' ? node.currentHUEDevice.dimming.min_dim_level : Number(minDimLevelLight));
        dimDirection = 'down';
      }
      // Calculate the dimming time based on delta
      // 10000:x=100:delta
      // x = (10000 * delta) / 100
      _dimSpeedInMillisecs = Math.round((_dimSpeedInMillisecs * delta) / 100, 0);

      hueTelegram = { dimming_delta: { action: dimDirection, brightness_delta: delta }, dynamics: { duration: _dimSpeedInMillisecs } };
      // Switch on the light if off
      if (node.currentHUEDevice.hasOwnProperty('on') !== undefined && node.currentHUEDevice.on.on === false && dimDirection === "up") {
        hueTelegram.on = { on: true };
      }
      node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
    };
    // ***********************************************************

    // Start dimming tunable white
    // mirek: required(integer minimum: 153, maximum: 500)
    // ***********************************************************
    node.hueDimmingTunableWhite = function hueDimming(_KNXaction, _KNXbrightness_delta, _dimSpeedInMillisecs = undefined) {
      let dimDirection = 'stop';
      let hueTelegram = {};
      _dimSpeedInMillisecs = (_dimSpeedInMillisecs === undefined || _dimSpeedInMillisecs === '') ? 5000 : _dimSpeedInMillisecs;
      let delta = 0;
      if (!node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = 347 - Math.round(173, 0); // Unable to read the mirek, set medium as default
      // We have also minDimLevelLight and maxDimLevelLight to take care of.
      // Mirek limits are not taken in consideration.
      // Maximum mirek is 347
      if (_KNXbrightness_delta === 0 && _KNXaction === 0) {
        dimDirection = 'stop';
        hueTelegram = { color_temperature_delta: { action: dimDirection } };
        node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
        return;
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 1) {
        if (node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = 347 - Math.round(node.currentHUEDevice.color_temperature.mirek, 0);
        dimDirection = 'up';
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 0) {
        // Set the minumum delta, taking care of the minimum brightness specified either in the HUE lamp itself, or specified by the user (parameter node.minDimLevelLight)
        if (node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = Math.round(node.currentHUEDevice.color_temperature.mirek, 0);
        dimDirection = 'down';
      }
      // Calculate the dimming time based on delta
      // 10000:x=347:delta
      // x = (10000 * delta) / 347
      _dimSpeedInMillisecs = Math.round((_dimSpeedInMillisecs * delta) / 347, 0);

      hueTelegram = { color_temperature_delta: { action: dimDirection, mirek_delta: delta }, dynamics: { duration: _dimSpeedInMillisecs } };
      // Switch on the light if off
      if (node.currentHUEDevice.hasOwnProperty('on') !== undefined && node.currentHUEDevice.on.on === false && dimDirection === "up") {
        hueTelegram.on = { on: true };
      }
      node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
    };
    // ***********************************************************

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === node.hueDevice) {
          if (node.currentHUEDevice === undefined) {
            node.setNodeStatusHue({
              fill: "red",
              shape: "ring",
              text: "Rejected HUE message. I'm connecting to the Bridge...",
              payload: "",
            });
            return;
          }
          if (_event.hasOwnProperty("on")) {
            node.updateKNXLightState(_event.on.on);
            // In case of switch off, set the dim to zero
            if (_event.on.on === false && (config.updateKNXBrightnessStatusOnHUEOnOff === undefined || config.updateKNXBrightnessStatusOnHUEOnOff === 'onhueoff')) {
              node.updateKNXBrightnessState(0);
            } else {
              // Sends the previous brightness value
              try {
                node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
              } catch (error) {
                /* empty */
              }
            }
          }
          if (_event.hasOwnProperty("color")) {
            node.updateKNXLightColorState(_event.color);
          }
          if (_event.hasOwnProperty("dimming")) {
            // Every once on a time, the light transmit the brightness value of 0.39.
            // To avoid wrongly turn light state on, exit
            if (_event.dimming.brightness < 1) _event.dimming.brightness = 0;
            if (node.currentHUEDevice.hasOwnProperty('on') && node.currentHUEDevice.on.on === false && _event.dimming.brightness === 0) return;
            if (node.currentHUEDevice.on.on === false) node.updateKNXLightState(_event.dimming.brightness > 0);
            node.updateKNXBrightnessState(_event.dimming.brightness);
            // If the brightness reaches zero, the hue lamp "on" property must be set to zero as well
            if (_event.dimming.brightness === 0) {
              node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, { on: { on: false } }, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            }
          }
          if (_event.hasOwnProperty("color_temperature")) {
            node.updateKNXLightHSVState(_event.color_temperature.mirek);
          }

          // Update the current HUE Device with the new _event
          function copiaOggettoRicorsivo(objDestinazione, objOrigine) {
            for (const prop in objOrigine) {
              if (typeof objOrigine[prop] === "object" && objOrigine[prop] !== null) {
                // Se la proprietà è un oggetto, copiamola in modo ricorsivo
                objDestinazione[prop] = objDestinazione[prop] || {};
                copiaOggettoRicorsivo(objDestinazione[prop], objOrigine[prop]);
              } else {
                // Altrimenti, copia il valore della proprietà
                objDestinazione[prop] = objOrigine[prop];
              }
            }
          }
          // Copia l'oggettoOrigine nell'oggettoDestinazione mantenendo le proprietà esistenti
          copiaOggettoRicorsivo(node.currentHUEDevice, _event);
        }
      } catch (error) {
        node.status({
          fill: "red",
          shape: "dot",
          text: `HUE->KNX error ${node.id} ${error.message}`,
        });
      }
    };

    // Leave the name after "function", to avoid <anonymous function> in the stack trace, in caso of errors.
    node.updateKNXBrightnessState = function updateKNXBrightnessState(_value) {
      if (config.GALightBrightnessState !== undefined && config.GALightBrightnessState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightBrightnessState;
        knxMsgPayload.dpt = config.dptLightBrightnessState;
        knxMsgPayload.payload = _value;
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          node.server.writeQueueAdd({
            grpaddr: knxMsgPayload.topic,
            payload: knxMsgPayload.payload,
            dpt: knxMsgPayload.dpt,
            outputtype: "write",
            nodecallerid: node.id,
          });
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX State",
          payload: knxMsgPayload.payload,
        });
      }
    };

    node.updateKNXLightState = function updateKNXBrightnessState(_value) {
      try {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightState;
        knxMsgPayload.dpt = config.dptLightState;
        knxMsgPayload.payload = _value;
        if (config.GALightState !== undefined && config.GALightState !== "") {
          if (node.currentKNXGALightState !== knxMsgPayload.payload) {
            // Check not to have already sent the value
            // Send to KNX bus
            if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
              node.server.writeQueueAdd({
                grpaddr: knxMsgPayload.topic,
                payload: knxMsgPayload.payload,
                dpt: knxMsgPayload.dpt,
                outputtype: "write",
                nodecallerid: node.id,
              });
            }
            node.setNodeStatusHue({
              fill: "blue",
              shape: "ring",
              text: "HUE->KNX State",
              payload: knxMsgPayload.payload,
            });
          }
        }
        node.currentKNXGALightState = knxMsgPayload.payload; // Stores the current value
      } catch (error) {
        /* empty */
      }
    };

    node.updateKNXLightHSVState = function updateKNXLightState(_value) {
      if (config.GALightHSVState !== undefined && config.GALightHSVState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightHSVState;
        knxMsgPayload.dpt = config.dptLightHSVState;
        if (config.dptLightHSVState === "5.001") {
          const retPercent = hueColorConverter.ColorConverter.scale(_value, [153, 500], [0, 100]);
          knxMsgPayload.payload = 100 - retPercent;
        }
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          node.server.writeQueueAdd({
            grpaddr: knxMsgPayload.topic,
            payload: knxMsgPayload.payload,
            dpt: knxMsgPayload.dpt,
            outputtype: "write",
            nodecallerid: node.id,
          });
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX State",
          payload: knxMsgPayload.payload,
        });
      }
    };

    node.updateKNXLightColorState = function updateKNXLightColorState(_value) {
      if (config.GALightColorState !== undefined && config.GALightColorState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightColorState;
        knxMsgPayload.dpt = config.dptLightColorState;
        knxMsgPayload.payload = hueColorConverter.ColorConverter.xyBriToRgb(
          _value.xy.x,
          _value.xy.y,
          node.currentHUEDevice !== undefined ? node.currentHUEDevice.dimming.brightness : 100,
        );
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          node.server.writeQueueAdd({
            grpaddr: knxMsgPayload.topic,
            payload: knxMsgPayload.payload,
            dpt: knxMsgPayload.dpt,
            outputtype: "write",
            nodecallerid: node.id,
          });
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX State",
          payload: knxMsgPayload.payload,
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
      if (node.serverHue !== null && node.serverHue.hueManager !== null) {
        try {
          // Everytime the node is edited, it comes here to read the currentHueDevice, if any.
          // It comes here also at node-red boot, but at node-red boot, the hueAllResources is null.
          // The hue-config take cares of filling all properties of the node, after it has been connected to the hue Brigde.
          if (node.serverHue.hueAllResources !== null) node.currentHUEDevice = node.serverHue.loadResourcesFromHUEBridge(node);
        } catch (error) { }
        try {
          node.serverHue.addClient(node);
        } catch (err) {
          RED.log.error(`Errore knxUltimateHueLight node.currentHUEDevice ${err.message}`);
        }
      }
    }

    node.on("input", (msg) => { });

    node.on("close", (done) => {
      if (node.server) {
        node.server.removeClient(node);
      }
      if (node.serverHue) {
        node.serverHue.removeClient(node);
      }
      done();
    });
  }
  RED.nodes.registerType("knxUltimateHueLight", knxUltimateHueLight);
};
