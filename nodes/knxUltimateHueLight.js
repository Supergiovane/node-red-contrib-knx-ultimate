/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-lonely-if */
const cloneDeep = require("lodash/cloneDeep");
const dptlib = require("../KNXEngine/src/dptlib");
const hueColorConverter = require("./utils/colorManipulators/hueColorConverter");

module.exports = function (RED) {
  function knxUltimateHueLight(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.server = RED.nodes.getNode(config.server);
    node.serverHue = RED.nodes.getNode(config.serverHue);

    // Convert for backward compatibility
    if (config.nameLightKelvinDIM === undefined) {
      config.nameLightKelvinDIM = config.nameLightHSV;
      config.GALightKelvinDIM = config.GALightHSV;
      config.dptLightKelvinDIM = config.dptLightHSV;

      config.nameLightKelvinPercentage = config.nameLightHSVPercentage;
      config.GALightKelvinPercentage = config.GALightHSVPercentage;
      config.dptLightKelvinPercentage = config.dptLightHSVPercentage;

      config.nameLightKelvinPercentageState = config.nameLightHSVState;
      config.GALightKelvinPercentageState = config.GALightHSVState;
      config.dptLightKelvinPercentageState = config.dptLightHSVState;
    }

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
    node.outputRBE = 'false'; // Apply or not RBE to the output (Messages coming from flow)
    node.inputRBE = 'false'; // Apply or not RBE to the input (Messages coming from BUS)
    node.currentPayload = ""; // Current value for the RBE input and for the .previouspayload msg
    node.passthrough = "no";
    node.formatmultiplyvalue = 1;
    node.formatnegativevalue = "leave";
    node.formatdecimalsvalue = 2;
    node.currentHUEDevice = undefined; // At start, this value is filled by a call to HUE api. It stores a value representing the current light status.
    node.HUEDeviceWhileDaytime = null;// This retains the HUE device status while daytime, to be restored after nighttime elapsed.
    node.HUELightsBelongingToGroupWhileDaytime = null; // Array contains all light belonging to the grouped_light (if grouped_light is selected)
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
    config.dimSpeed = (config.dimSpeed === undefined || config.dimSpeed === '') ? 5000 : Number(config.dimSpeed);
    config.HSVDimSpeed = (config.HSVDimSpeed === undefined || config.HSVDimSpeed === '') ? 5000 : Number(config.HSVDimSpeed);
    config.invertDimTunableWhiteDirection = config.invertDimTunableWhiteDirection === undefined ? false : true;
    node.HSVObject = null; //{ h, s, v };// Store the current light calculated HSV

    // Transform HEX in RGB and stringified json in json oblects.
    if (config.colorAtSwitchOnDayTime.indexOf("#") !== -1) {
      // Transform to rgb.
      try {
        config.colorAtSwitchOnDayTime = hueColorConverter.ColorConverter.hexRgb(config.colorAtSwitchOnDayTime.replace("#", ""));
      } catch (error) {
        config.colorAtSwitchOnDayTime = { kelvin: 3000, brightness: 100 };
      }
    } else {
      try {
        config.colorAtSwitchOnDayTime = JSON.parse(config.colorAtSwitchOnDayTime);
      } catch (error) {
        RED.log.error(`knxUltimateHueLight:  config.colorAtSwitchOnDayTime = JSON.parse(config.colorAtSwitchOnDayTime): ${error.message} : ${error.stack || ""} `);
        config.colorAtSwitchOnDayTime = "";
      }
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
      try {
        config.colorAtSwitchOnNightTime = JSON.parse(config.colorAtSwitchOnNightTime);
      } catch (error) {
        RED.log.error(`knxUltimateHueLight:  config.colorAtSwitchOnDayTime = JSON.parse(config.colorAtSwitchOnNightTime): ${error.message} : ${error.stack || ""} `);
        config.colorAtSwitchOnNightTime = "";
      }

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
      if (msg.knx.event !== "GroupValue_Read" && node.currentHUEDevice !== undefined) {
        let state = {};
        try {
          switch (msg.knx.destination) {
            case config.GALightSwitch:
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightSwitch));
              if (msg.payload === true) {
                // From HUE Api core concepts:
                // If you try and control multiple conflicting parameters at once e.g. {"color": {"xy": {"x":0.5,"y":0.5}}, "color_temperature": {"mirek": 250}}
                // the lights can only physically do one, for this we apply the rule that xy beats ct. Simple.
                // color_temperature.mirek: color temperature in mirek is null when the light color is not in the ct spectrum
                if ((node.DayTime === true && config.specifySwitchOnBrightness === "no") && ((node.isGrouped_light === false && node.HUEDeviceWhileDaytime !== null) || (node.isGrouped_light === true && node.HUELightsBelongingToGroupWhileDaytime !== null))) {
                  if (node.isGrouped_light === false && node.HUEDeviceWhileDaytime !== null) {
                    // The DayNight has switched into day, so restore the previous light status
                    state = { on: { on: true }, dimming: node.HUEDeviceWhileDaytime.dimming, color: node.HUEDeviceWhileDaytime.color, color_temperature: node.HUEDeviceWhileDaytime.color_temperature };
                    if (node.HUEDeviceWhileDaytime.color_temperature !== undefined && node.HUEDeviceWhileDaytime.color_temperature.mirek === null) delete state.color_temperature; // Otherwise the lamp will not turn on due to an error. color_temperature.mirek: color temperature in mirek is null when the light color is not in the ct spectrum
                    node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
                    node.setNodeStatusHue({
                      fill: "green",
                      shape: "dot",
                      text: "KNX->HUE",
                      payload: "Restore light status",
                    });
                    node.HUEDeviceWhileDaytime = null; // Nullize the object.
                  } else if (node.isGrouped_light === true && node.HUELightsBelongingToGroupWhileDaytime !== null) {
                    // The DayNight has switched into day, so restore the previous light state, belonging to the group
                    let bAtLeastOneIsOn = false;
                    for (let index = 0; index < node.HUELightsBelongingToGroupWhileDaytime.length; index++) { // Ensure, at least 1 lamp was on, otherwise turn all lamps on
                      const element = node.HUELightsBelongingToGroupWhileDaytime[index].light[0];
                      if (element.on.on === true) {
                        bAtLeastOneIsOn = true;
                        break;
                      }
                    }
                    for (let index = 0; index < node.HUELightsBelongingToGroupWhileDaytime.length; index++) {
                      const element = node.HUELightsBelongingToGroupWhileDaytime[index].light[0];
                      if (bAtLeastOneIsOn === true) {
                        state = { on: element.on, dimming: element.dimming, color: element.color, color_temperature: element.color_temperature };
                      } else {
                        // Failsafe all on
                        state = { on: { on: true }, dimming: element.dimming, color: element.color, color_temperature: element.color_temperature };
                      }
                      if (element.color_temperature !== undefined && element.color_temperature.mirek === null) delete state.color_temperature; // Otherwise the lamp will not turn on due to an error. color_temperature.mirek: color temperature in mirek is null when the light color is not in the ct spectrum
                      node.serverHue.hueManager.writeHueQueueAdd(element.id, state, "setLight");
                    }
                    node.setNodeStatusHue({
                      fill: "green",
                      shape: "dot",
                      text: "KNX->HUE",
                      payload: "Resuming all group's light",
                    });
                    node.HUELightsBelongingToGroupWhileDaytime = null; // Nullize the object.
                    return;
                  }
                } else {
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
                  // Create the HUE command
                  if (colorChoosen !== undefined) {
                    // Now we have a jColorChoosen. Proceed illuminating the light
                    let gamut = null;
                    if (node.currentHUEDevice.color.gamut !== undefined) {
                      gamut = node.currentHUEDevice.color.gamut;
                    }
                    const dretXY = hueColorConverter.ColorConverter.calculateXYFromRGB(colorChoosen.red, colorChoosen.green, colorChoosen.blue, gamut);
                    const dbright = hueColorConverter.ColorConverter.getBrightnessFromRGBOrHex(colorChoosen.red, colorChoosen.green, colorChoosen.blue);
                    node.currentHUEDevice.dimming.brightness = Math.round(dbright, 0);
                    if (node.currentHUEDevice.color !== undefined) node.currentHUEDevice.color.xy = dretXY; // 26/03/2024
                    node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
                    state = dbright > 0 ? { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } } : { on: { on: false } };
                    // state = { on: { on: true }, dimming: { brightness: dbright }, color: { xy: dretXY } };
                  } else if (temperatureChoosen !== undefined) {
                    // Kelvin
                    const mirek = hueColorConverter.ColorConverter.kelvinToMirek(temperatureChoosen);
                    node.currentHUEDevice.color_temperature.mirek = mirek;
                    node.currentHUEDevice.dimming.brightness = brightnessChoosen;
                    node.updateKNXBrightnessState(node.currentHUEDevice.dimming.brightness);
                    // Kelvin temp
                    state = brightnessChoosen > 0 ? { on: { on: true }, dimming: { brightness: brightnessChoosen }, color_temperature: { mirek: mirek } } : { on: { on: false } };
                    // state = { on: { on: true }, dimming: { brightness: brightnessChoosen }, color_temperature: { mirek: mirek } };
                  } else if (brightnessChoosen !== undefined) {
                    state = brightnessChoosen > 0 ? { on: { on: true }, dimming: { brightness: brightnessChoosen } } : { on: { on: false } };
                    // state = { on: { on: true }, dimming: { brightness: brightnessChoosen } };
                  } else {
                    state = { on: { on: true } };
                  }
                }
              } else {
                // Stop color cycle
                if (node.timerColorCycle !== undefined) clearInterval(node.timerColorCycle);
                // Stop Blinking
                if (node.timerBlink !== undefined) clearInterval(node.timerBlink);
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
            case config.GALightHSV_H_DIM:
              // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
              // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightDIM));
              node.hueDimmingHSV_H(msg.payload.decr_incr, msg.payload.data, config.HSVDimSpeed);
              node.setNodeStatusHue({
                fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload),
              });
              break;
            case config.GALightHSV_S_DIM:
              // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
              // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightDIM));
              node.hueDimmingHSV_S(msg.payload.decr_incr, msg.payload.data, config.HSVDimSpeed);
              node.setNodeStatusHue({
                fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload),
              });
              break;
            case config.GALightKelvin:
              let retMirek;
              let kelvinValue = 0;
              msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightKelvin));
              if (config.dptLightKelvin === "7.600") {
                if (msg.payload > 6535) msg.payload = 6535;
                if (msg.payload < 2000) msg.payload = 2000;
                kelvinValue = msg.payload;//hueColorConverter.ColorConverter.scale(msg.payload, [0, 65535], [2000, 6535]);
                retMirek = hueColorConverter.ColorConverter.kelvinToMirek(kelvinValue);
              } else if (config.dptLightKelvin === "9.002") {
                // Relative temperature in Kelvin. Use HUE scale.
                if (msg.payload > 6535) msg.payload = 6535;
                if (msg.payload < 2000) msg.payload = 2000;
                retMirek = hueColorConverter.ColorConverter.kelvinToMirek(msg.payload);
              }
              state = { color_temperature: { mirek: retMirek } };
              node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, state, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
              node.setNodeStatusHue({
                fill: "green",
                shape: "dot",
                text: "KNX->HUE",
                payload: kelvinValue,
              });
              break;
            case config.GADaylightSensor:
              node.DayTime = Boolean(dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptDaylightSensor)));
              if (config.invertDayNight !== undefined && config.invertDayNight === true) node.DayTime = !node.DayTime;
              if (config.specifySwitchOnBrightness === "no") {
                // This retains the HUE device status while daytime, to be restored after nighttime elapsed. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/298
                if (node.DayTime === false) {
                  if (node.isGrouped_light === false) node.HUEDeviceWhileDaytime = cloneDeep(node.currentHUEDevice); // DayTime has switched to false: save the currentHUEDevice into the HUEDeviceWhileDaytime
                  if (node.isGrouped_light === true) {
                    (async () => {
                      try {
                        const retLights = await node.serverHue.getAllLightsBelongingToTheGroup(node.hueDevice);
                        node.HUELightsBelongingToGroupWhileDaytime = cloneDeep(retLights); // DayTime has switched to false: save the lights belonging to the group into the HUELightsBelongingToGroupWhileDaytime array
                      } catch (error) { /* empty */ }
                    })();
                  }
                }
              } else {
                node.HUEDeviceWhileDaytime = null;
                node.HUELightsBelongingToGroupWhileDaytime = null;
              }
              node.setNodeStatusHue({
                fill: "green",
                shape: "dot",
                text: "KNX->HUE Daytime",
                payload: node.DayTime,
              });

              break;
            case config.GALightKelvinDIM:
              if (config.dptLightKelvinDIM === "3.007") {
                // MDT smartbutton will dim the color temperature
                // { decr_incr: 1, data: 1 } : Start increasing until { decr_incr: 0, data: 0 } is received.
                // { decr_incr: 0, data: 1 } : Start decreasing until { decr_incr: 0, data: 0 } is received.
                msg.payload = dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightKelvinDIM));
                node.hueDimmingTunableWhite(msg.payload.decr_incr, msg.payload.data, 5000);
                node.setNodeStatusHue({
                  fill: "green", shape: "dot", text: "KNX->HUE", payload: JSON.stringify(msg.payload),
                });
              }
              break;
            case config.GALightKelvinPercentage:
              if (config.dptLightKelvinPercentage === "5.001") {
                // 0-100% tunable white
                msg.payload = 100 - dptlib.fromBuffer(msg.knx.rawValue, dptlib.resolve(config.dptLightKelvinPercentage));
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
                && node.currentHUEDevice.color !== undefined
                && node.currentHUEDevice.color.gamut !== undefined
              ) {
                gamut = node.currentHUEDevice.color.gamut;
              }
              const retXY = hueColorConverter.ColorConverter.calculateXYFromRGB(msg.payload.red, msg.payload.green, msg.payload.blue, gamut);
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
                }, 1500);
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
                        && node.currentHUEDevice.color !== undefined
                        && node.currentHUEDevice.color.gamut !== undefined
                      ) {
                        gamut = node.currentHUEDevice.color.gamut;
                      }
                      const retXY = hueColorConverter.ColorConverter.calculateXYFromRGB(red, green, blue, gamut);
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
        } catch (error) {
          node.status({
            fill: "red",
            shape: "dot",
            text: `KNX->HUE errorRead ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
          });
          RED.log.error(`knxUltimateHueLight: node.handleSend:  if (msg.knx.event !== "GroupValue_Read"): ${error.message} : ${error.stack || ""} `);
        }
      }

      // I must respond to query requests (read request) sent from the KNX BUS
      try {
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
            case config.GALightKelvinPercentageState:
              ret = node.currentHUEDevice.color_temperature.mirek;
              if (ret !== undefined) node.updateKNXLightKelvinPercentageState(ret, "response");
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
          text: `KNX->HUE error :-( ${error.message} (${new Date().getDate()}, ${new Date().toLocaleTimeString()})`,
        });
        RED.log.error(`knxUltimateHueLight: node.handleSend: if (msg.knx.event === "GroupValue_Read" && node.currentHUEDevice !== undefined): ${error.message} : ${error.stack || ""} `);
      }
    };

    // Start dimming
    // ***********************************************************
    node.hueDimming = function hueDimming(_KNXaction, _KNXbrightness_Direction, _dimSpeedInMillisecs = undefined) {
      // 31/10/2023 after many attempts to use dimming_delta function of the HueApeV2, loosing days of my life, without a decent success, will use the standard dimming calculations
      // i decide to go to the "step brightness" way.
      try {
        let hueTelegram = {};
        let numStep = 10; // Steps from 0 to 100 by 10
        const extendedConf = {};

        if (_KNXbrightness_Direction === 0 && _KNXaction === 0) {
          // STOP DIM
          if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
          node.brightnessStep = null;
          node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
          return;
        }

        // 26/03/2024 set the extended configuration as well, because the light was off (so i've been unable to set it up elsewhere)
        if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
          // if (node.currentHUEDevice.color !== undefined) extendedConf.color = { xy: node.currentHUEDevice.color.xy }; // DO NOT ADD THE COLOR, BECAUSE THE COLOR HAS ALSO THE BRIGHTNESS, SO ALL THE DATA NEEDED TO BE SWITCHED ON CORRECLY
          if (node.currentHUEDevice.color_temperature !== undefined) extendedConf.color_temperature = { mirek: node.currentHUEDevice.color_temperature.mirek };
        }

        // If i'm dimming up while the light is off, start the dim with the initial brightness set to zero
        if (_KNXbrightness_Direction > 0 && _KNXaction === 1 && node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
          node.brightnessStep = null;
          node.currentHUEDevice.dimming.brightness = 0;
        }

        // Set the actual brightness to start with
        if (node.brightnessStep === null || node.brightnessStep === undefined) node.brightnessStep = node.currentHUEDevice.dimming.brightness !== undefined ? node.currentHUEDevice.dimming.brightness : 50;
        node.brightnessStep = Math.ceil(Number(node.brightnessStep));

        // We have also minDimLevelLight and maxDimLevelLight to take care of.
        let minDimLevelLight;
        if (config.minDimLevelLight === undefined) {
          minDimLevelLight = 10;
        } else if (config.minDimLevelLight === "useHueLightLevel") {
          minDimLevelLight = node.currentHUEDevice.dimming.min_dim_level === undefined ? 10 : node.currentHUEDevice.dimming.min_dim_level;
        } else {
          minDimLevelLight = Number(config.minDimLevelLight);
        }
        const maxDimLevelLight = config.maxDimLevelLight === undefined ? 100 : Number(config.maxDimLevelLight);

        // Set the speed
        _dimSpeedInMillisecs /= numStep;
        numStep = Math.round((maxDimLevelLight - minDimLevelLight) / numStep, 0);

        if (_KNXbrightness_Direction > 0 && _KNXaction === 1) {
          // DIM UP
          if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
          node.timerStepDim = setInterval(() => {
            node.updateKNXBrightnessState(node.brightnessStep); // Unnecessary, but necessary to set the KNX Status in real time.
            node.brightnessStep += numStep;
            if (node.brightnessStep > maxDimLevelLight) node.brightnessStep = maxDimLevelLight;
            hueTelegram = { dimming: { brightness: node.brightnessStep }, dynamics: { duration: _dimSpeedInMillisecs + 500 } }; // + is to avoid ladder effect
            // Switch on the light if off
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
              hueTelegram.on = { on: true };
              Object.assign(hueTelegram, extendedConf); // 26/03/2024 add extended conf
            }
            //console.log(hueTelegram)
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStep >= maxDimLevelLight) clearInterval(node.timerStepDim);
          }, _dimSpeedInMillisecs);
        }
        if (_KNXbrightness_Direction > 0 && _KNXaction === 0) {
          if (node.currentHUEDevice.on.on === false) return; // Don't dim down, if the light is already off.
          // DIM DOWN
          if (node.timerStepDim !== undefined) clearInterval(node.timerStepDim);
          node.timerStepDim = setInterval(() => {
            node.updateKNXBrightnessState(node.brightnessStep); // Unnecessary, but necessary to set the KNX Status in real time.
            node.brightnessStep -= numStep;
            if (node.brightnessStep < minDimLevelLight) node.brightnessStep = minDimLevelLight;
            hueTelegram = { dimming: { brightness: node.brightnessStep }, dynamics: { duration: _dimSpeedInMillisecs + 500 } };// + 100 is to avoid ladder effect
            // Switch off the light if on
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === true && node.brightnessStep === 0) {
              hueTelegram.on = { on: false };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStep <= minDimLevelLight) clearInterval(node.timerStepDim);
          }, _dimSpeedInMillisecs);
        }
      } catch (error) { }
    };
    // ***********************************************************

    // Start dimming tunable white
    // mirek: required(integer minimum: 153, maximum: 500)
    // ***********************************************************
    node.hueDimmingTunableWhite = function hueDimmingTunableWhite(_KNXaction, _KNXbrightness_DirectionTunableWhite, _dimSpeedInMillisecsTunableWhite = undefined) {
      // 23/23/2023 after many attempts to use dimming_delta function of the HueApeV2, loosing days of my life, without a decent success, will use the standard dimming calculations
      // i decide to go to the "step brightness" way.
      try {

        if (_KNXbrightness_DirectionTunableWhite === 0 && _KNXaction === 0) {
          // STOP DIM
          if (node.timerStepDimTunableWhite !== undefined) clearInterval(node.timerStepDimTunableWhite);
          node.brightnessStepTunableWhite = null;
          node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
          return;
        }

        let numStepTunableWhite = 10; // Steps from 153 to 500
        if (config.invertDimTunableWhiteDirection === true) {
          if (_KNXaction === 1) { _KNXaction = 0; } else { _KNXaction = 1; }
        }

        // Set the actual brightness to start with
        if (node.brightnessStepTunableWhite === null || node.brightnessStepTunableWhite === undefined) node.brightnessStepTunableWhite = node.currentHUEDevice.color_temperature.mirek || 372;
        node.brightnessStepTunableWhite = Math.ceil(Number(node.brightnessStepTunableWhite));

        // Set the speed
        _dimSpeedInMillisecsTunableWhite = Math.ceil(_dimSpeedInMillisecsTunableWhite / numStepTunableWhite);

        const minDimLevelLightTunableWhite = 153;
        const maxDimLevelLightTunableWhite = 500;
        //numStepTunableWhite = hueColorConverter.ColorConverter.scale(numStepTunableWhite, [0, 100], [minDimLevelLightTunableWhite, maxDimLevelLightTunableWhite]);
        //numStepTunableWhite = hueColorConverter.ColorConverter.scale(numStepTunableWhite, [node.brightnessStepTunableWhite, maxDimLevelLightTunableWhite], [node.brightnessStepTunableWhite, maxDimLevelLightTunableWhite]);
        numStepTunableWhite = Math.round((maxDimLevelLightTunableWhite - minDimLevelLightTunableWhite) / numStepTunableWhite, 0);

        if (_KNXbrightness_DirectionTunableWhite > 0 && _KNXaction === 1) {
          // DIM UP
          if (node.timerStepDimTunableWhite !== undefined) clearInterval(node.timerStepDimTunableWhite);
          node.timerStepDimTunableWhite = setInterval(() => {
            node.updateKNXLightKelvinPercentageState(node.brightnessStepTunableWhite); // Unnecessary, but necessary to set the KNX Status in real time.
            node.brightnessStepTunableWhite += numStepTunableWhite; // *2 to speed up the things
            if (node.brightnessStepTunableWhite > maxDimLevelLightTunableWhite) node.brightnessStepTunableWhite = maxDimLevelLightTunableWhite;
            const hueTelegram = { color_temperature: { mirek: node.brightnessStepTunableWhite }, dynamics: { duration: _dimSpeedInMillisecsTunableWhite } };
            // Switch on the light if off
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
              hueTelegram.on = { on: true };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepTunableWhite >= maxDimLevelLightTunableWhite) clearInterval(node.timerStepDimTunableWhite);
          }, _dimSpeedInMillisecsTunableWhite);
        }
        if (_KNXbrightness_DirectionTunableWhite > 0 && _KNXaction === 0) {
          if (node.currentHUEDevice.on.on === false) return; // Don't dim down, if the light is already off.
          // DIM DOWN
          if (node.timerStepDimTunableWhite !== undefined) clearInterval(node.timerStepDimTunableWhite);
          node.timerStepDimTunableWhite = setInterval(() => {
            node.updateKNXLightKelvinPercentageState(node.brightnessStepTunableWhite); // Unnecessary, but necessary to set the KNX Status in real time.
            node.brightnessStepTunableWhite -= numStepTunableWhite; // *2 to speed up the things
            if (node.brightnessStepTunableWhite < minDimLevelLightTunableWhite) node.brightnessStepTunableWhite = minDimLevelLightTunableWhite;
            const hueTelegram = { color_temperature: { mirek: node.brightnessStepTunableWhite }, dynamics: { duration: _dimSpeedInMillisecsTunableWhite } };
            // Switch off the light if on
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === true && node.brightnessStepTunableWhite === 0) {
              hueTelegram.on = { on: false };
            }
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepTunableWhite <= minDimLevelLightTunableWhite) clearInterval(node.timerStepDimTunableWhite);
          }, _dimSpeedInMillisecsTunableWhite);
        }
      } catch (error) { }
    };
    // ***********************************************************

    /**
  * Starts dimming / stop dimming of the HUE
  * @param {number} _KNXaction 1 for start, 0 for stop
  * @param {number} _KNXbrightness_DirectionHSV_H 1 for up, 0 for down
  * @param {number} _dimSpeedInMillisecsHSV Speed time in milliseconds
  * @returns {}
  */
    node.hueDimmingHSV_H = function hueDimmingHSV_H(_KNXaction, _KNXbrightness_DirectionHSV_H, _dimSpeedInMillisecsHSV = undefined) {
      // After many attempts to use dimming_delta function of the HueApiV2, loosing days of my life, without a decent success, will use the standard dimming calculations
      // i decide to go to the "step brightness" way.
      try {
        if (_KNXbrightness_DirectionHSV_H === 0 && _KNXaction === 0) {
          // STOP DIM
          if (node.timerStepDimHSV_H !== undefined) clearInterval(node.timerStepDimHSV_H);
          node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
          return;
        }

        let xyBrightnessToHsv;
        if (node.currentHUEDevice.color !== undefined && node.currentHUEDevice.color.xy !== undefined) {
          // Get the XY + brightness from the lamp and transform it into HSV
          // xyBrightnessToHsv = hueColorConverter.ColorConverter.xyBrightnessToHsv(node.currentHUEDevice.color.xy.x, node.currentHUEDevice.color.xy.y, node.currentHUEDevice.dimming.brightness);
          xyBrightnessToHsv = hueColorConverter.ColorConverter.xyBrightnessToHsv(hueColorConverter.ColorConverter.scale(node.currentHUEDevice.color.xy.x, [0, 1], [0, 100]), hueColorConverter.ColorConverter.scale(node.currentHUEDevice.color.xy.y, [0, 1], [0, 100]), node.currentHUEDevice.dimming.brightness);
        } else {
          return; // Something wrong here.
        }
        let numStepHSV_H = 10; // Steps from 0 to 100

        // Set the actual brightness to start with
        if (node.brightnessStepHSV_H === null || node.brightnessStepHSV_H === undefined) node.brightnessStepHSV_H = node.currentHUEDevice.dimming.brightness;
        node.brightnessStepHSV_H = Math.ceil(Number(node.brightnessStepHSV_H));

        const minDimLevelLightHSV_H = 1;
        const maxDimLevelLightHSV_H = 100;
        numStepHSV_H = Math.round((maxDimLevelLightHSV_H - minDimLevelLightHSV_H) / numStepHSV_H, 0);
        // Set the speed
        _dimSpeedInMillisecsHSV = Math.ceil(_dimSpeedInMillisecsHSV / (maxDimLevelLightHSV_H / numStepHSV_H));

        if (_KNXbrightness_DirectionHSV_H > 0 && _KNXaction === 1) {
          // DIM UP
          if (node.timerStepDimHSV_H !== undefined) clearInterval(node.timerStepDimHSV_H);
          node.timerStepDimHSV_H = setInterval(() => {
            node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
            node.brightnessStepHSV_H += numStepHSV_H;
            if (node.brightnessStepHSV_H > maxDimLevelLightHSV_H) node.brightnessStepHSV_H = maxDimLevelLightHSV_H;
            //node.updateKNXLightHSV_H_State(node.brightnessStepHSV_H); // Unnecessary, but necessary to set the KNX Status in real time.
            xyBrightnessToHsv.h = node.brightnessStepHSV_H;
            const hsvToXYBri = hueColorConverter.ColorConverter.hsvToxyBrightness(xyBrightnessToHsv, node.currentHUEDevice.color.gamut);
            const hueTelegram = { color: { xy: { x: hsvToXYBri.x, y: hsvToXYBri.y } }, dynamics: { duration: _dimSpeedInMillisecsHSV + 500 } }; // Add some ms, to prevent the "ladder" step effect.
            // Switch on the light if off
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
              hueTelegram.on = { on: true };
            }
            node.currentHUEDevice.color.xy = hsvToXYBri;// Unnecessary, but necessary to set the KNX Status in real time.
            node.updateKNXLightColorState(node.currentHUEDevice.color);
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepHSV_H >= maxDimLevelLightHSV_H) {
              if (node.timerStepDimHSV_H !== undefined) clearInterval(node.timerStepDimHSV_H);
            }
          }, _dimSpeedInMillisecsHSV);
        }
        if (_KNXbrightness_DirectionHSV_H > 0 && _KNXaction === 0) {
          if (node.currentHUEDevice.on.on === false) return; // Don't dim down, if the light is already off.
          // DIM DOWN
          if (node.timerStepDimHSV_H !== undefined) clearInterval(node.timerStepDimHSV_H);
          node.timerStepDimHSV_H = setInterval(() => {
            node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
            node.brightnessStepHSV_H -= numStepHSV_H; // *2 to speed up the things
            if (node.brightnessStepHSV_H < minDimLevelLightHSV_H) node.brightnessStepHSV_H = minDimLevelLightHSV_H;
            //node.updateKNXLightHSV_H_State(node.brightnessStepHSV_H); // Unnecessary, but necessary to set the KNX Status in real time.
            // Produco l'RGB
            xyBrightnessToHsv.h = node.brightnessStepHSV_H;
            const hsvToXYBri = hueColorConverter.ColorConverter.hsvToxyBrightness(xyBrightnessToHsv, node.currentHUEDevice.color.gamut);
            const hueTelegram = { color: { xy: { x: hsvToXYBri.x, y: hsvToXYBri.y } }, dynamics: { duration: _dimSpeedInMillisecsHSV + 500 } };
            // Switch off the light if on
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === true && node.brightnessStepHSV_H === 0) {
              hueTelegram.on = { on: false };
            }
            node.currentHUEDevice.color.xy = hsvToXYBri;// Unnecessary, but necessary to set the KNX Status in real time.
            node.updateKNXLightColorState(node.currentHUEDevice.color);
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepHSV_H <= minDimLevelLightHSV_H) {
              if (node.timerStepDimHSV_H !== undefined) clearInterval(node.timerStepDimHSV_H);
            }
          }, _dimSpeedInMillisecsHSV);
        }
      } catch (error) { /* empty */ }
    };
    /**
  * Starts dimming / stop dimming of the Saturation
  * @param {number} _KNXaction 1 for start, 0 for stop
  * @param {number} _KNXbrightness_DirectionHSV_S 1 for up, 0 for down
  * @param {number} _dimSpeedInMillisecsHSV Speed time in milliseconds
  * @returns {}
  */
    node.hueDimmingHSV_S = function hueDimmingHSV_S(_KNXaction, _KNXbrightness_DirectionHSV_S, _dimSpeedInMillisecsHSV = undefined) {
      // After many attempts to use dimming_delta function of the HueApiV2, loosing days of my life, without a decent success, will use the standard dimming calculations
      // i decide to go to the "step brightness" way.
      try {
        if (_KNXbrightness_DirectionHSV_S === 0 && _KNXaction === 0) {
          // STOP DIM
          if (node.timerStepDimHSV_S !== undefined) clearInterval(node.timerStepDimHSV_S);
          node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
          return;
        }

        let xyBrightnessToHsv;
        if (node.currentHUEDevice.color !== undefined && node.currentHUEDevice.color.xy !== undefined) {
          // Get the XY + brightness from the lamp and transform it into HSV
          xyBrightnessToHsv = hueColorConverter.ColorConverter.xyBrightnessToHsv(hueColorConverter.ColorConverter.scale(node.currentHUEDevice.color.xy.x, [0, 1], [0, 100]), hueColorConverter.ColorConverter.scale(node.currentHUEDevice.color.xy.y, [0, 1], [0, 100]), node.currentHUEDevice.dimming.brightness);
        } else {
          return; // Something wrong here.
        }
        let numStepHSV_S = 10; // Steps from 0 to 100

        // Set the actual brightness to start with
        if (node.brightnessStepHSV_S === null || node.brightnessStepHSV_S === undefined) node.brightnessStepHSV_S = node.currentHUEDevice.dimming.brightness;
        node.brightnessStepHSV_S = Math.ceil(Number(node.brightnessStepHSV_S));

        const minDimLevelLightHSV_S = 1;
        const maxDimLevelLightHSV_S = 100;
        numStepHSV_S = Math.round((maxDimLevelLightHSV_S - minDimLevelLightHSV_S) / numStepHSV_S, 0);
        // Set the speed
        _dimSpeedInMillisecsHSV = Math.ceil(_dimSpeedInMillisecsHSV / (maxDimLevelLightHSV_S / numStepHSV_S));

        if (_KNXbrightness_DirectionHSV_S > 0 && _KNXaction === 1) {
          // DIM UP
          if (node.timerStepDimHSV_S !== undefined) clearInterval(node.timerStepDimHSV_S);
          node.timerStepDimHSV_S = setInterval(() => {
            node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
            node.brightnessStepHSV_S += numStepHSV_S;
            if (node.brightnessStepHSV_S > maxDimLevelLightHSV_S) node.brightnessStepHSV_S = maxDimLevelLightHSV_S;
            //node.updateKNXLightHSV_S_State(node.brightnessStepHSV_S); // Unnecessary, but necessary to set the KNX Status in real time.
            xyBrightnessToHsv.s = node.brightnessStepHSV_S;
            const hsvToXYBri = hueColorConverter.ColorConverter.hsvToxyBrightness(xyBrightnessToHsv, node.currentHUEDevice.color.gamut);
            const hueTelegram = { color: { xy: { x: hsvToXYBri.x, y: hsvToXYBri.y } }, dynamics: { duration: _dimSpeedInMillisecsHSV + 500 } }; // Add some ms, to prevent the "ladder" step effect.
            // Switch on the light if off
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false) {
              hueTelegram.on = { on: true };
            }
            node.currentHUEDevice.color.xy = cloneDeep(hsvToXYBri);// Unnecessary, but necessary to set the KNX Status in real time.
            node.updateKNXLightColorState(node.currentHUEDevice.color);
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepHSV_S >= maxDimLevelLightHSV_S) {
              if (node.timerStepDimHSV_S !== undefined) clearInterval(node.timerStepDimHSV_S);
            }
          }, _dimSpeedInMillisecsHSV);
        }
        if (_KNXbrightness_DirectionHSV_S > 0 && _KNXaction === 0) {
          if (node.currentHUEDevice.on.on === false) return; // Don't dim down, if the light is already off.
          // DIM DOWN
          if (node.timerStepDimHSV_S !== undefined) clearInterval(node.timerStepDimHSV_S);
          node.timerStepDimHSV_S = setInterval(() => {
            node.serverHue.hueManager.deleteHueQueue(node.hueDevice); // Clear dimming queue.
            node.brightnessStepHSV_S -= numStepHSV_S; // *2 to speed up the things
            if (node.brightnessStepHSV_S < minDimLevelLightHSV_S) node.brightnessStepHSV_S = minDimLevelLightHSV_S;
            //node.updateKNXLightHSV_S_State(node.brightnessStepHSV_S); // Unnecessary, but necessary to set the KNX Status in real time.
            // Produco l'RGB
            xyBrightnessToHsv.s = node.brightnessStepHSV_S;
            const hsvToXYBri = hueColorConverter.ColorConverter.hsvToxyBrightness(xyBrightnessToHsv, node.currentHUEDevice.color.gamut);
            const hueTelegram = { color: { xy: { x: hsvToXYBri.x, y: hsvToXYBri.y } }, dynamics: { duration: _dimSpeedInMillisecsHSV + 500 } };
            // Switch off the light if on
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === true && node.brightnessStepHSV_S === 0) {
              hueTelegram.on = { on: false };
            }
            node.currentHUEDevice.color.xy = cloneDeep(hsvToXYBri);// Unnecessary, but necessary to set the KNX Status in real time.
            node.updateKNXLightColorState(node.currentHUEDevice.color);
            node.serverHue.hueManager.writeHueQueueAdd(node.hueDevice, hueTelegram, node.isGrouped_light === false ? "setLight" : "setGroupedLight");
            if (node.brightnessStepHSV_S <= minDimLevelLightHSV_S) {
              if (node.timerStepDimHSV_S !== undefined) clearInterval(node.timerStepDimHSV_S);
            }
          }, _dimSpeedInMillisecsHSV);
        }
      } catch (error) { /* empty */ }
    };
    // ***********************************************************

    node.handleSendHUE = (_event) => {
      try {
        const deviceByRef = cloneDeep(_event);
        if (deviceByRef.id === node.hueDevice) {
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
          node.send(deviceByRef);

          // // DEBUG testing enable/disable HTML UI Tabs
          //delete _event.dimming;
          //delete _event.color;
          //delete _event.color_temperature;
          //delete _event.color_temperature_delta;

          // As grouped_light doesn't contain all requested properties, i find the first light in the group, and use this below in the code
          // If the event type is grouped light, and there are missing properties, i infer these missing properties from the first light in the group!
          if ((deviceByRef.color !== undefined || deviceByRef.dimming !== undefined || deviceByRef.color_temperature !== undefined) && deviceByRef.type === 'grouped_light') {
            try {
              const firstLightInGroup = node.serverHue.getFirstLightInGroup(deviceByRef.id);
              if (firstLightInGroup !== null && firstLightInGroup !== undefined) {
                if (deviceByRef.color === undefined) {
                  deviceByRef.color = firstLightInGroup.color;
                }
                if (deviceByRef.color_temperature === undefined) {
                  deviceByRef.color_temperature = firstLightInGroup.color_temperature;
                }
              }
            } catch (error) { }
          }

          if (deviceByRef.on !== undefined) {
            node.updateKNXLightState(deviceByRef.on.on);
            // In case of switch off, set the dim to zero
            if (deviceByRef.on.on === false && (config.updateKNXBrightnessStatusOnHUEOnOff === undefined || config.updateKNXBrightnessStatusOnHUEOnOff === "onhueoff")) {
              node.updateKNXBrightnessState(0);
              if (deviceByRef.dimming !== undefined) delete deviceByRef.dimming; // Remove event.dimming, because has beem handled by this function and i don't want the function below to take care of it.
            } else if (deviceByRef.on.on === true && node.currentHUEDevice.on.on === false) {
              // Turn on always update the dimming KNX Status value as well.
              let brightVal = 50;
              if (node.currentHUEDevice.dimming !== undefined && node.currentHUEDevice.dimming.brightness !== undefined) brightVal = node.currentHUEDevice.dimming.brightness;
              node.updateKNXBrightnessState(brightVal);
            }
            node.currentHUEDevice.on.on = deviceByRef.on.on;
          }

          if (deviceByRef.color !== undefined) { // fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/287
            node.updateKNXLightColorState(deviceByRef.color);
            node.currentHUEDevice.color = deviceByRef.color;
          }

          if (deviceByRef.dimming !== undefined && deviceByRef.dimming.brightness !== undefined) {
            // Once upon n a time, the light transmit the brightness value of 0.39.
            // To avoid wrongly turn light state on, exit
            if (deviceByRef.dimming.brightness < 1) deviceByRef.dimming.brightness = 0;
            if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false && deviceByRef.dimming.brightness === 0) {
              // Do nothing, because the light is off and the dimming also is 0
            } else {
              if (node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === false && (deviceByRef.on === undefined || (deviceByRef.on !== undefined && deviceByRef.on.on === true))) node.updateKNXLightState(deviceByRef.dimming.brightness > 0);
              node.updateKNXBrightnessState(deviceByRef.dimming.brightness);
              // If the brightness reaches zero, the hue lamp "on" property must be set to zero as well
              if (deviceByRef.dimming.brightness === 0 && node.currentHUEDevice.on !== undefined && node.currentHUEDevice.on.on === true) {
                node.serverHue.hueManager.writeHueQueueAdd(
                  node.hueDevice,
                  { on: { on: false } },
                  node.isGrouped_light === false ? "setLight" : "setGroupedLight",
                );
                node.currentHUEDevice.on.on = false;
              }
              node.currentHUEDevice.dimming.brightness = deviceByRef.dimming.brightness;
            }
          }
          if (deviceByRef.color_temperature !== undefined && deviceByRef.color_temperature.mirek !== undefined) {
            node.updateKNXLightKelvinPercentageState(deviceByRef.color_temperature.mirek);
            node.updateKNXLightKelvinState(deviceByRef.color_temperature.mirek);
            node.currentHUEDevice.color_temperature.mirek = deviceByRef.color_temperature.mirek;
          }
        }
      } catch (error) {
        node.status({
          fill: "red",
          shape: "dot",
          text: `HUE->KNX error ${node.id} ${error.message}. Seee Log`,
        });
        RED.log.error(`knxUltimateHueLight: node.handleSendHUE = (_event): ${error.stack}`);
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

    node.updateKNXLightKelvinPercentageState = function updateKNXLightKelvinPercentageState(_value, _outputtype = "write") {
      if (config.GALightKelvinPercentageState !== undefined && config.GALightKelvinPercentageState !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightKelvinPercentageState;
        knxMsgPayload.dpt = config.dptLightKelvinPercentageState;
        if (config.dptLightKelvinPercentageState === "5.001") {
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
          text: "HUE->KNX Tunable White",
          payload: knxMsgPayload.payload,
        });
      }
    };

    //     /**
    //  * Update the internal HSV variable status and send the valuge in % to the KNX BUS
    //  * @param {number} _value 0-100%
    //  * @param {string} _outputtype "write" is the default KNX command
    //  * * @returns {}
    //  */
    //     node.updateKNXLightHSV_H_State = function updateKNXLightHSV_H_State(_value, _outputtype = "write") {
    //       if (config.GALightHSV_H_State !== undefined && config.GALightHSV_H_State !== "") {
    //         const knxMsgPayload = {};
    //         knxMsgPayload.topic = config.GALightHSV_H_State;
    //         knxMsgPayload.dpt = config.dptLightHSV_H_State;
    //         if (config.dptLightHSV_H_State === "5.001") {
    //           knxMsgPayload.payload = 100 - _value;
    //         }
    //         // Send to KNX bus
    //         if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
    //           if (node.server !== null && node.server !== undefined) {
    //             node.server.writeQueueAdd({
    //               grpaddr: knxMsgPayload.topic,
    //               payload: knxMsgPayload.payload,
    //               dpt: knxMsgPayload.dpt,
    //               outputtype: _outputtype || "write",
    //               nodecallerid: node.id,
    //             });
    //           }
    //         }
    //         node.setNodeStatusHue({
    //           fill: "blue",
    //           shape: "ring",
    //           text: "HUE->KNX HSV (H)",
    //           payload: knxMsgPayload.payload,
    //         });
    //       }
    //     };

    //     /**
    //  * Update the internal HSV variable status and send the valuge in % to the KNX BUS
    //  * @param {number} _value 0-100%
    //  * @param {string} _outputtype "write" is the default KNX command
    //  * @returns {}
    //  */
    //     node.updateKNXLightHSV_S_State = function updateKNXLightHSV_S_State(_value, _outputtype = "write") {
    //       if (config.GALightHSV_S_State !== undefined && config.GALightHSV_S_State !== "") {
    //         const knxMsgPayload = {};
    //         knxMsgPayload.topic = config.GALightHSV_S_State;
    //         knxMsgPayload.dpt = config.dptLightHSV_S_State;
    //         if (config.dptLightHSV_S_State === "5.001") {
    //           knxMsgPayload.payload = _value;
    //         }
    //         // Send to KNX bus
    //         if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
    //           if (node.server !== null && node.server !== undefined) {
    //             node.server.writeQueueAdd({
    //               grpaddr: knxMsgPayload.topic,
    //               payload: knxMsgPayload.payload,
    //               dpt: knxMsgPayload.dpt,
    //               outputtype: _outputtype || "write",
    //               nodecallerid: node.id,
    //             });
    //           }
    //         }
    //         node.setNodeStatusHue({
    //           fill: "blue",
    //           shape: "ring",
    //           text: "HUE->KNX HSV (H)",
    //           payload: knxMsgPayload.payload,
    //         });
    //       }
    //     };

    /**
  * Update the KNC colors and HSV states group addresses
  * @param {object} _value {xy:{x,y}} in 0-1 scale
  * @param {string} _outputtype "write" is the default KNX command
  * @returns {}
  */
    node.updateKNXLightColorState = function updateKNXLightColorState(_value, _outputtype = "write") {
      if (config.GALightColorState !== undefined && config.GALightColorState !== "") {
        if (_value.xy === undefined || _value.xy.x === undefined) return;
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
      if (config.GALightHSV_S_State !== undefined && config.GALightHSV_S_State !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightHSV_S_State;
        knxMsgPayload.dpt = config.dptLightHSV_S_State;
        if (config.dptLightHSV_S_State === "5.001") {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.xyBrightnessToHsv(_value.xy.x, _value.xy.y, node.currentHUEDevice !== undefined && node.currentHUEDevice.dimming !== undefined && node.currentHUEDevice.dimming.brightness === undefined ? node.currentHUEDevice.dimming.brightness : 100, false);
          knxMsgPayload.payload = knxMsgPayload.payload.s;
        }
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          if (node.server !== null && node.server !== undefined) {
            node.server.writeQueueAdd({
              grpaddr: knxMsgPayload.topic,
              payload: knxMsgPayload.payload,
              dpt: knxMsgPayload.dpt,
              outputtype: _outputtype || "write",
              nodecallerid: node.id,
            });
          }
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX HSV (S)",
          payload: knxMsgPayload.payload,
        });
      }
      if (config.GALightHSV_H_State !== undefined && config.GALightHSV_H_State !== "") {
        const knxMsgPayload = {};
        knxMsgPayload.topic = config.GALightHSV_H_State;
        knxMsgPayload.dpt = config.dptLightHSV_H_State;
        if (config.dptLightHSV_H_State === "5.001") {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.xyBrightnessToHsv(_value.xy.x, _value.xy.y, node.currentHUEDevice !== undefined && node.currentHUEDevice.dimming !== undefined && node.currentHUEDevice.dimming.brightness === undefined ? node.currentHUEDevice.dimming.brightness : 100, false);
          knxMsgPayload.payload = 100 - knxMsgPayload.payload.h;
        }
        // Send to KNX bus
        if (knxMsgPayload.topic !== "" && knxMsgPayload.topic !== undefined) {
          if (node.server !== null && node.server !== undefined) {
            node.server.writeQueueAdd({
              grpaddr: knxMsgPayload.topic,
              payload: knxMsgPayload.payload,
              dpt: knxMsgPayload.dpt,
              outputtype: _outputtype || "write",
              nodecallerid: node.id,
            });
          }
        }
        node.setNodeStatusHue({
          fill: "blue",
          shape: "ring",
          text: "HUE->KNX HSV (H)",
          payload: knxMsgPayload.payload,
        });
      }
    };

    node.updateKNXLightKelvinState = function updateKNXLightKelvinState(_value, _outputtype = "write") {
      if (config.GALightKelvinState !== undefined && config.GALightKelvinState !== "") {
        const knxMsgPayload = {};
        let kelvinValue = 0;
        knxMsgPayload.topic = config.GALightKelvinState;
        knxMsgPayload.dpt = config.dptLightKelvinState;
        if (config.dptLightKelvinState === "7.600") {
          kelvinValue = hueColorConverter.ColorConverter.mirekToKelvin(_value);
          knxMsgPayload.payload = hueColorConverter.ColorConverter.scale(kelvinValue, [2000, 6535], [0, 65535]);
        } else if (config.dptLightKelvinState === "9.002") {
          knxMsgPayload.payload = hueColorConverter.ColorConverter.mirekToKelvin(_value);
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
            payload: kelvinValue,
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
  };
  RED.nodes.registerType("knxUltimateHueLight", knxUltimateHueLight);
};
