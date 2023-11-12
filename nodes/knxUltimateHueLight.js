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
    node.notifyreadrequest = true;
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
    node.DayTime = true;
    node.isGrouped_light = config.hueDevice.split("#")[1] === "grouped_light";
    node.hueDevice = config.hueDevice.split("#")[0];
    node.initializingAtStart = (config.readStatusAtStartup === undefined || config.readStatusAtStartup === "yes");
    config.specifySwitchOnBrightness = (config.specifySwitchOnBrightness === undefined || config.specifySwitchOnBrightness === '') ? "temperature" : config.specifySwitchOnBrightness;
    config.specifySwitchOnBrightnessNightTime = (config.specifySwitchOnBrightnessNightTime === undefined || config.specifySwitchOnBrightnessNightTime === '') ? "no" : config.specifySwitchOnBrightnessNightTime;
    config.colorAtSwitchOnDayTime = (config.colorAtSwitchOnDayTime === '' || config.colorAtSwitchOnDayTime === undefined) ? '{ "kelvin":3000, "brightness":100 }' : config.colorAtSwitchOnDayTime;
    config.colorAtSwitchOnNightTime = (config.colorAtSwitchOnNightTime === '' || config.colorAtSwitchOnNightTime === undefined) ? '{ "kelvin":2700, "brightness":20 }' : config.colorAtSwitchOnNightTime;
    config.colorAtSwitchOnDayTime = config.colorAtSwitchOnDayTime.replace("geen", "green");
    config.colorAtSwitchOnNightTime = config.colorAtSwitchOnNightTime.replace("geen", "green");
    // Transform HEX in RGB and stringified json in json oblects.
    if (config.colorAtSwitchOnDayTime.indexOf("#") !== -1) {
      // Transform to rgb.
      try {
        config.colorAtSwitchOnDayTime = hueColorConverter.ColorConverter.hexRgb(config.colorAtSwitchOnDayTime.replace("#", ""));
      } catch (error) {
        config.colorAtSwitchOnDayTime = { kelvin: 3000, brightness: 100 };
      }
    } else {
      config.colorAtSwitchOnDayTime = JSON.parse(config.colorAtSwitchOnDayTime);
    }
    // Same thing, but with night color
    if (config.colorAtSwitchOnNightTime.indexOf("#") !== -1) {
      // Transform to rgb.
      try {
        config.colorAtSwitchOnNightTime = hueColorConverter.ColorConverter.hexRgb(config.colorAtSwitchOnNightTime.replace("#", ""));
      } catch (error) {
        config.colorAtSwitchOnNightTime = { kelvin: 2700, brightness: 20 };
      }
    } else {
      config.colorAtSwitchOnNightTime = JSON.parse(config.colorAtSwitchOnNightTime);
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({
      fill, shape, text, payload,
    }) => { };
    // Used to call the status update from the HUE config node.
    node.setNodeStatusHue = ({ fill, shape, text, payload }) => {
      if (payload === undefined) payload = '';
      const dDate = new Date();
      payload = typeof payload === "object" ? JSON.stringify(payload) : payload.toString();
      node.status({ fill, shape, text: `${text} ${payload} (${dDate.getDate()}, ${dDate.toLocaleTimeString()})` });
    };

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }

    // This function is called by the hue-config.js
    node.handleSend = (msg) => {
      if (node.currentHUEDevice === undefined && node.serverHue.linkStatus === "connected") {
        node.setNodeStatusHue({
          fill: "yellow",
          shape: "ring",
          text: "Initializing. Please wait.",
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
              let colorChoosen;
              let temperatureChoosen;
              let brightnessChoosen;
              // The light must support the temperature (in this case, colorAtSwitchOnNightTime is an object {kelvin:xx, brightness:yy})
              if (node.currentHUEDevice.color_temperature !== undefined) {
                if (node.DayTime === true && config.specifySwitchOnBrightness === "temperature") {
                  temperatureChoosen = config.colorAtSwitchOnDayTime.kelvin;
                } else if (node.DayTime === false && config.enableDayNightLighting === "temperature") {
                  temperatureChoosen = config.colorAtSwitchOnNightTime.kelvin;
                }
              }
              if (node.currentHUEDevice.dimming !== undefined) {
                // Check wether the user selected specific brightness at switch on (in this case, colorAtSwitchOnNightTime is an object {kelvin:xx, brightness:yy})
                if (node.DayTime === true && config.specifySwitchOnBrightness === "temperature") {
                  brightnessChoosen = config.colorAtSwitchOnDayTime.brightness;
                } else if (node.DayTime === false && config.enableDayNightLighting === "temperature") {
                  brightnessChoosen = config.colorAtSwitchOnNightTime.brightness;
                }
              }
              if (node.currentHUEDevice.color !== undefined) {
                // Check wether the user selected specific color at switch on (in this case, colorAtSwitchOnDayTime is a text with HTML web color)
                if (node.DayTime === true && config.specifySwitchOnBrightness === "yes") {
                  colorChoosen = config.colorAtSwitchOnDayTime;
                } else if (node.DayTime === false && config.enableDayNightLighting === "yes") {
                  colorChoosen = config.colorAtSwitchOnNightTime;
                }
              }

              if (colorChoosen !== undefined) {
                // Now we have a jColorChoosen. Proceed illuminating the light
                let gamut = null;
                if (node.currentHUEDevice.color.gamut_type !== undefined) {
                  gamut = node.currentHUEDevice.color.gamut_type;
                }
                const dretXY = hueColorConverter.ColorConverter.rgbToXy(colorChoosen.red, colorChoosen.green, colorChoosen.blue, gamut);
                const dbright = hueColorConverter.ColorConverter.getBrightnessFromRGBOrHex(colorChoosen.red, colorChoosen.green, colorChoosen.blue);
                node.currentHUEDevice.dimming.brightness = Math.round(dbright, 0);
                node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
                state = dbright > 0 ? { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } } : { on: { on: false } };
              } else if (temperatureChoosen !== undefined) {
                // Kelvin
                const mirek = hueColorConverter.ColorConverter.kelvinToMirek(temperatureChoosen);
                node.currentHUEDevice.color_temperature.mirek = mirek;
                node.currentHUEDevice.dimming.brightness = brightnessChoosen;
                node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
                // Kelvin temp
                state = brightnessChoosen > 0 ? { on: { on: true }, dimming: { brightness: brightnessChoosen }, color_temperature: { mirek: mirek } } : { on: { on: false } };
              } else if (brightnessChoosen !== undefined) {
                state = brightnessChoosen > 0 ? { on: { on: true }, dimming: { brightness: brightnessChoosen } } : { on: { on: false } };
              } else {
                state = { on: { on: true } };
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
            node.setNodeStatusHue({
              fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload),
            });
            break;
          case config.GALightKelvin:
            let retMirek;
            msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightKelvin));
            if (config.dptLightKelvin === "7.600") {
              if (msg.payload > 65535) msg.payload = 65535;
              if (msg.payload < 0) msg.payload = 0;
              retMirek = hueColorConverter.ColorConverter.scale(msg.payload, [0, 65535], [500, 153]);
            } else if (config.dptLightKelvin === "9.002") {
              // Relative temperature in Kelvin. Use HUE scale.
              if (msg.payload > 6535) msg.payload = 6535;
              if (msg.payload < 2000) msg.payload = 2000;
              retMirek = hueColorConverter.ColorConverter.scale(msg.payload, [2000, 6535], [500, 153]);
            }
            state = { color_temperature: { mirek: retMirek } };
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE",
              payload: msg.payload,
            });
            break;
          case config.GADaylightSensor:
            node.DayTime = Boolean(dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptDaylightSensor)));
            if (config.invertDayNight !== undefined && config.invertDayNight === true) node.DayTime = !node.DayTime;
            node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "KNX->HUE Daytime",
              payload: node.DayTime,
            });

            break;
          case config.GALightHSV:
            if (config.dptLightHSV === "3.007") {
              // MDT smartbutton will dim the color temperature
              // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
              // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightHSV));
              node.hueDimmingTunableWhite(msg.payload.decr_incr, msg.payload.data, config.dimSpeed);
              node.setNodeStatusHue({
                fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload),
              });
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
            const bright = hueColorConverter.ColorConverter.getBrightnessFromRGBOrHex(msg.payload.red, msg.payload.green, msg.payload.blue);
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
            {
              if (node.timerColorCycle !== undefined) clearInterval(node.timerColorCycle);
              const gaValColorCycle = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightColorCycle));
              if (gaValColorCycle === true) {
                node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, { on: { on: true } }, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
                node.timerColorCycle = setInterval(() => {
                  try {
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
                    const bright = hueColorConverter.ColorConverter.getBrightnessFromRGBOrHex(red, green, blue);
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
            }
            break;
          default:
            break;
        }

        // I must respond to query requests (read request) sent from the KNX BUS

        if (msg.knx.event === "GroupValue_Read" && node.currentHUEDevice !== undefined) {
          let ret;
          switch (msg.knx.destination) {
            case config.GALightState:
              ret = node.currentHUEDevice.on.on;
              if (ret !== undefined) node.updateKNXLightState(ret, "response");
              break;
            case config.GALightColorState:
              ret = node.currentHUEDevice.color.xy;
              if (ret !== undefined) node.updateKNXLightColorState(node.currentHUEDevice.color, "response");
              break;
            case config.GALightHSVState:
              ret = node.currentHUEDevice.color_temperature.mirek;
              if (ret !== undefined) node.updateKNXLightHSVState(ret, "response");
              break;
            case config.GALightBrightnessState:
              ret = node.currentHUEDevice.dimming.brightness;
              if (ret !== undefined) node.updateKNXBrightnessState(ret, "response");
              break;
            case config.GALightKelvinState:
              ret = node.currentHUEDevice.color_temperature.mirek;
              if (ret !== undefined) node.updateKNXLightKelvinState(ret, "response");
              break;
            default:
              break;
          }
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
      // 31/10/2023 after many attempts to use dimming_delta function of the HueApeV2, loosing days of my life, without a decent success
      // i decide to go to the "step brightness" way.
      let hueTelegram = {};
      const numStep = 10; // Steps from 0 to 100 by 10
      if (_dimSpeedInMillisecs === undefined || _dimSpeedInMillisecs === '') _dimSpeedInMillisecs = 5000;

      if (_KNXbrightness_delta === 0 && _KNXaction === 0) {
        // STOP DIM
        if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
        node.brightnessStep = null;
        return;
      }

      // Set the actual brightness to start with
      if (node.brightnessStep === null || node.brightnessStep === undefined) node.brightnessStep = node.currentHUEDevice.dimming.brightness || 50;
      node.brightnessStep = Math.ceil(Number(node.brightnessStep));

      // Set the speed
      _dimSpeedInMillisecs /= numStep;

      // We have also minDimLevelLight and maxDimLevelLight to take care of.
      let minDimLevelLight = config.minDimLevelLight === undefined ? 10 : Number(config.minDimLevelLight);
      if (config.minDimLevelLight === "useHueLightLevel" && node.currentHUEDevice.dimming.min_dim_level === undefined) minDimLevelLight = 10;
      const maxDimLevelLight = config.maxDimLevelLight === undefined ? 100 : Number(config.maxDimLevelLight);

      if (_KNXbrightness_delta > 0 && _KNXaction === 1) {
        // DIM UP
        if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
        node.timerStepDim = setInterval(() => {
          node.updateKNXBrightnessState(node.brightnessStep); // Unnecessary, but necessary to set the KNX Status in real time.
          node.brightnessStep += numStep;
          if (node.brightnessStep > maxDimLevelLight) node.brightnessStep = maxDimLevelLight;
          hueTelegram = { dimming: { brightness: node.brightnessStep }, dynamics: { duration: _dimSpeedInMillisecs } };
          // Switch on the light if off
          if (node.currentHUEDevice.hasOwnProperty("on") !== undefined && node.currentHUEDevice.on.on === false) {
            hueTelegram.on = { on: true };
          }
          node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
          if (node.brightnessStep >= maxDimLevelLight) clearInterval(node.timerStepDim);
        }, _dimSpeedInMillisecs);
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 0) {
        // DIM DOWN
        if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
        node.timerStepDim = setInterval(() => {
          node.updateKNXBrightnessState(node.brightnessStep); // Unnecessary, but necessary to set the KNX Status in real time.
          node.brightnessStep -= numStep;
          if (node.brightnessStep < minDimLevelLight) node.brightnessStep = minDimLevelLight;
          hueTelegram = { dimming: { brightness: node.brightnessStep }, dynamics: { duration: _dimSpeedInMillisecs } };
          // Switch off the light if on
          if (node.currentHUEDevice.hasOwnProperty("on") !== undefined && node.currentHUEDevice.on.on === true && node.brightnessStep === 0) {
            hueTelegram.on = { on: false };
          }
          node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
          if (node.brightnessStep <= minDimLevelLight) clearInterval(node.timerStepDim);
        }, _dimSpeedInMillisecs);
      }
    };
    // ***********************************************************

    // Start dimming tunable white
    // mirek: required(integer minimum: 153, maximum: 500)
    // ***********************************************************
    node.hueDimmingTunableWhite = function hueDimming(_KNXaction, _KNXbrightness_delta, _dimSpeedInMillisecs = undefined) {
      let dimDirection = "stop";
      let hueTelegram = {};
      _dimSpeedInMillisecs = _dimSpeedInMillisecs === undefined || _dimSpeedInMillisecs === "" ? 5000 : _dimSpeedInMillisecs;
      let delta = 0;
      if (!node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = 347 - Math.round(173, 0); // Unable to read the mirek, set medium as default
      // We have also minDimLevelLight and maxDimLevelLight to take care of.
      // Mirek limits are not taken in consideration.
      // Maximum mirek is 347
      if (_KNXbrightness_delta === 0 && _KNXaction === 0) {
        dimDirection = "stop";
        hueTelegram = { color_temperature_delta: { action: dimDirection } };
        node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
        return;
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 1) {
        if (node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = 347 - Math.round(node.currentHUEDevice.color_temperature.mirek, 0);
        dimDirection = "up";
      }
      if (_KNXbrightness_delta > 0 && _KNXaction === 0) {
        // Set the minumum delta, taking care of the minimum brightness specified either in the HUE lamp itself, or specified by the user (parameter node.minDimLevelLight)
        if (node.currentHUEDevice.color_temperature.hasOwnProperty("mirek")) delta = Math.round(node.currentHUEDevice.color_temperature.mirek, 0);
        dimDirection = "down";
      }
      // Calculate the dimming time based on delta
      // 10000:x=347:delta
      // x = (10000 * delta) / 347
      _dimSpeedInMillisecs = Math.round((_dimSpeedInMillisecs * delta) / 347, 0);

      hueTelegram = { color_temperature_delta: { action: dimDirection, mirek_delta: delta }, dynamics: { duration: _dimSpeedInMillisecs } };
      // Switch on the light if off
      if (node.currentHUEDevice.hasOwnProperty("on") !== undefined && node.currentHUEDevice.on.on === false && dimDirection === "up") {
        hueTelegram.on = { on: true };
      }
      node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
    };
    // ***********************************************************

    node.handleSendHUE = (_event) => {
      try {
        if (_event.id === node.hueDevice) {
          if (node.currentHUEDevice === undefined || node.serverHue === null || node.serverHue === undefined) {
            node.setNodeStatusHue({
              fill: "red",
              shape: "ring",
              text: "Rejected HUE message. I'm connecting to the Bridge...",
              payload: "",
            });
            return;
          }

          // Output the msg to the flow
          node.send(_event);

          // // DEBUG
          //delete _event.dimming;
          //delete _event.color;
          //delete _event.color_temperature;
          //delete _event.color_temperature_delta;

          // As grouped_light doesn't contain all requested properties, i find the first light in the group, and use this below in the code
          // If the event type is grouped light, and there are missing properties, i infer these missing properties from the first light in the group!
          if ((_event.color !== undefined || _event.dimming !== undefined || _event.color_temperature !== undefined) && _event.type === 'grouped_light') {
            try {
              const firstLightInGroup = node.serverHue.getFirstLightInGroup(_event.id);
              if (firstLightInGroup !== null && firstLightInGroup !== undefined) {
                if (_event.color === undefined) {
                  _event.color = firstLightInGroup.color;
                }
                if (_event.color_temperature === undefined) {
                  _event.color_temperature = firstLightInGroup.color_temperature;
                }
              }
            } catch (error) { }
          }

          if (_event.hasOwnProperty("on")) {
            node.updateKNXLightState(_event.on.on);
            // In case of switch off, set the dim to zero
            if (_event.on.on === false && (config.updateKNXBrightnessStatusOnHUEOnOff === undefined || config.updateKNXBrightnessStatusOnHUEOnOff === "onhueoff")) {
              node.updateKNXBrightnessState(0);
              //node.currentHUEDevice.dimming.brightness = 0;
            } else if (_event.on.on === true && node.currentHUEDevice.on.on === false) {
              // Turn on always update the dimming KNX Status value as well.
              let brightVal = 100;
              if (node.currentHUEDevice.dimming !== undefined && node.currentHUEDevice.dimming.brightness !== undefined) brightVal = node.currentHUEDevice.dimming.brightness;
              node.updateKNXBrightnessState(brightVal);
            }
            node.currentHUEDevice.on.on = _event.on.on;
          }

          if (_event.color !== undefined) { // fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/287
            node.updateKNXLightColorState(_event.color);
            node.currentHUEDevice.color = _event.color;
          }

          if (_event.hasOwnProperty("dimming") && _event.dimming.brightness !== undefined) {
            // Once upon n a time, the light transmit the brightness value of 0.39.
            // To avoid wrongly turn light state on, exit
            if (_event.dimming.brightness < 1) _event.dimming.brightness = 0;
            if (node.currentHUEDevice.hasOwnProperty("on") && node.currentHUEDevice.on.on === false && _event.dimming.brightness === 0) {
              // Do nothing, because the light is off and the dimming also is 0
            } else {
              if (node.currentHUEDevice.hasOwnProperty("on") && node.currentHUEDevice.on.on === false && (!_event.hasOwnProperty("on") || (_event.hasOwnProperty("on") && _event.on.on === true))) node.updateKNXLightState(_event.dimming.brightness > 0);
              node.updateKNXBrightnessState(_event.dimming.brightness);
              // If the brightness reaches zero, the hue lamp "on" property must be set to zero as well
              if (_event.dimming.brightness === 0 && node.currentHUEDevice.hasOwnProperty("on") && node.currentHUEDevice.on.on === true) {
                node.serverHue.hueManager.writeHueQueueAdd(
                  node.hueDevice,
                  { on: { on: false } },
                  node.isGrouped_light === false ? "setLight" : "setGroupedLight",
                );
                node.currentHUEDevice.on.on = false;
              }
              node.currentHUEDevice.dimming.brightness = _event.dimming.brightness;
            }
          }
          if (_event.hasOwnProperty("color_temperature") && _event.color_temperature.mirek !== undefined) {
            node.updateKNXLightHSVState(_event.color_temperature.mirek);
            node.updateKNXLightKelvinState(_event.color_temperature.mirek);
            node.currentHUEDevice.color_temperature.mirek = _event.color_temperature.mirek;
          }
        }
      } catch (error) {
        node.status({
          fill: "red",
          shape: "dot",
          text: `HUE->KNX error ${node.id} ${error.message}`,
        });
        RED.log.error(`knxUltimateHueLight: node.handleSendHUE = (_event): ${error.message}`);
      }
    };

    // Leave the name after "function", to avoid <anonymous function> in the stack trace, in caso of errors.
    node.updateKNXBrightnessState = function updateKNXBrightnessState(_value, _outputtype = "write") {
      if (config.GALightBrightnessState !== undefined && config.GALightBrightnessState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightBrightnessState;
        knxMsgPayload.dpt = config.dptLightBrightnessState;
        knxMsgPayload.payload = _value;
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          if (node.server !== null && node.server !== undefined) {
            node.server.writeQueueAdd({
              grpaddr: knxMsgPayload.topic,
              payload: knxMsgPayload.payload,
              dpt: knxMsgPayload.dpt,
              outputtype: _outputtype,
              nodecallerid: node.id,
            });
          }
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX Bright",
          payload: knxMsgPayload.payload,
        });
      }
    };

    node.updateKNXLightState = function updateKNXLightState(_value, _outputtype = "write") {
      try {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightState;
        knxMsgPayload.dpt = config.dptLightState;
        knxMsgPayload.payload = _value;
        if (config.GALightState !== undefined && config.GALightState !== "") {

          // Check not to have already sent the value
          // Send to KNX bus
          if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
            if (node.server !== null && node.server !== undefined) {
              node.server.writeQueueAdd({
                grpaddr: knxMsgPayload.topic,
                payload: knxMsgPayload.payload,
                dpt: knxMsgPayload.dpt,
                outputtype: _outputtype,
                nodecallerid: node.id,
              });
            }
          }
          node.setNodeStatusHue({
            fill: "blue",
            shape: "ring",
            text: "HUE->KNX On/Off",
            payload: knxMsgPayload.payload,
          });
        }
      } catch (error) {
        /* empty */
      }
    };

    node.updateKNXLightHSVState = function updateKNXLightHSVState(_value, _outputtype = "write") {
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
          if (node.server !== null && node.server !== undefined) {
            node.server.writeQueueAdd({
              grpaddr: knxMsgPayload.topic,
              payload: knxMsgPayload.payload,
              dpt: knxMsgPayload.dpt,
              outputtype: _outputtype,
              nodecallerid: node.id,
            });
          }
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX HSV",
          payload: knxMsgPayload.payload,
        });
      }
    };

    node.updateKNXLightColorState = function updateKNXLightColorState(_value, _outputtype = "write") {
      if (config.GALightColorState !== undefined && config.GALightColorState !== "") {
        if (!_value.hasOwnProperty('xy') || _value.xy.x === undefined) return;
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightColorState;
        knxMsgPayload.dpt = config.dptLightColorState;
        try {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.xyBriToRgb(
            _value.xy.x,
            _value.xy.y,
            node.currentHUEDevice !== undefined && node.currentHUEDevice.dimming !== undefined && node.currentHUEDevice.dimming.brightness === undefined ? node.currentHUEDevice.dimming.brightness : 100,
          );
          knxMsgPayload.payload = { red: knxMsgPayload.payload.r, green: knxMsgPayload.payload.g, blue: knxMsgPayload.payload.b };
          // Send to KNX bus
          if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
            if (node.server !== null && node.server !== undefined) {
              node.server.writeQueueAdd({
                grpaddr: knxMsgPayload.topic,
                payload: knxMsgPayload.payload,
                dpt: knxMsgPayload.dpt,
                outputtype: _outputtype,
                nodecallerid: node.id,
              });
            }
          }
          node.setNodeStatusHue({
            fill: "blue",
            shape: "ring",
            text: "HUE->KNX Color",
            payload: knxMsgPayload.payload,
          });
        } catch (error) { }
      }
    };

    node.updateKNXLightKelvinState = function updateKNXLightKelvinState(_value, _outputtype = "write") {
      if (config.GALightKelvinState !== undefined && config.GALightKelvinState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightKelvinState;
        knxMsgPayload.dpt = config.dptLightKelvinState;
        if (config.dptLightKelvinState === "7.600") {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.scale(_value, [153, 500], [65535, 0]);
        } else if (config.dptLightKelvinState === "9.002") {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.scale(_value, [153, 500], [6535, 2000]);
        }
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          if (node.server !== null && node.server !== undefined) {
            node.server.writeQueueAdd({
              grpaddr: knxMsgPayload.topic,
              payload: knxMsgPayload.payload,
              dpt: knxMsgPayload.dpt,
              outputtype: _outputtype,
              nodecallerid: node.id,
            });
          }

          node.setNodeStatusHue({
            fill: "blue",
            shape: "ring",
            text: "HUE->KNX Kelvin",
            payload: knxMsgPayload.payload,
          });
        }
      }
    };

    // On each deploy, unsubscribe+resubscribe
    if (node.server) {
      node.server.removeClient(node);
      node.server.addClient(node);
    }
    if (node.serverHue) {
      try {
        node.serverHue.removeClient(node);
        node.serverHue.addClient(node);
      } catch (error) {
        RED.log.error("knxUltimateHueLight: if (node.server): " + error.message);
      }
    }

    node.on('input', (msg, send, done) => {
      try {
        const state = RED.util.cloneMessage(msg);
        node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
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
