/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
const cloneDeep = require("lodash/cloneDeep");
//const classHUE = require("./utils/hueEngine").classHUE;
const hueColorConverter = require("./utils/colorManipulators/hueColorConverter");


// 10/09/2024 Setup the color logger
loggerSetup = (options) => {
  let clog = require("node-color-log").createNamedLogger(options.setPrefix);
  clog.setLevel(options.loglevel);
  clog.setDate(() => (new Date()).toLocaleString());
  return clog;
}


module.exports = (RED) => {
  function hueConfig(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.host = config.host;
    node.nodeClients = []; // Stores the registered clients
    node.loglevel = config.loglevel !== undefined ? config.loglevel : "error"; // loglevel doesn'e exists yet
    node.sysLogger = null;
    node.hueAllResources = undefined;
    node.timerHUEConfigCheckState = null; // Timer that check the connection to the hue bridge every xx seconds
    try {
      node.sysLogger = loggerSetup({ loglevel: node.loglevel, setPrefix: "hue-config.js" });
    } catch (error) { console.log(error.stack) }
    node.name = config.name === undefined || config.name === "" ? node.host : config.name;

    // Helper not to write everytime the "node.hueManager === null || node.hueManager === "undefined" || node.hueManager.HUEBridgeConnectionStatus === undefined"
    Object.defineProperty(node, "linkStatus", {
      get: function () {
        return node.hueManager?.HUEBridgeConnectionStatus ?? "disconnected";
      }
    });


    // Connect to Bridge and get the resources
    node.initHUEConnection = async () => {
      await node.closeConnection();
      try {
        if (node.hueManager !== undefined) await node.hueManager.close();
      } catch (error) { /* empty */ }

      (async () => {
        try {
          const { classHUE } = await import('./utils/hueEngine.mjs');
          node.hueManager = new classHUE(node.host, node.credentials.username, node.credentials.clientkey, config.bridgeid, node.sysLogger);
        } catch (error) {
          node.sysLogger?.error(`Errore hue-config: node.initHUEConnection: ${error.message}`);
          throw (error)
        }
        node.hueManager.on("event", (_event) => {
          node.nodeClients.forEach((_oClient) => {
            const oClient = _oClient;
            try {
              if (oClient.handleSendHUE !== undefined) oClient.handleSendHUE(_event);
            } catch (error) {
              node.sysLogger?.error(`Errore node.hueManager.on(event): ${error.message}`);
            }
          });
        });
        // Connected
        node.hueManager.on("connected", () => {
          if (node.linkStatus === "disconnected") {
            // Start the timer to do initial read.
            if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
            node.timerDoInitialRead = setTimeout(() => {
              (async () => {
                try {
                  node.sysLogger?.info(`HTTP getting resource from HUE bridge : ${node.name}`);
                  await node.loadResourcesFromHUEBridge();
                  node.sysLogger?.info(`Total HUE resources count : ${node.hueAllResources.length}`);
                } catch (error) {
                  node.nodeClients.forEach((_oClient) => {
                    setTimeout(() => {
                      _oClient.setNodeStatusHue({
                        fill: "red",
                        shape: "ring",
                        text: "HUE",
                        payload: error.message,
                      });
                    }, 200);
                  });
                }
              })();
            }, 10000); // 17/02/2020 Do initial read of all nodes requesting initial read
          }
        });

        node.hueManager.on("disconnected", () => {
          node.nodeClients.forEach((_oClient) => {
            _oClient.setNodeStatusHue({
              fill: "red",
              shape: "ring",
              text: "HUE Disconnected",
              payload: "",
            });
          });
        });
        try {
          await node.hueManager.Connect();
        } catch (error) { }
      })();

    };

    node.startWatchdogTimer = async () => {
      if (node.timerHUEConfigCheckState !== null) clearTimeout(node.timerHUEConfigCheckState);
      node.timerHUEConfigCheckState = setTimeout(() => {
        (async () => {
          if (node.linkStatus === "disconnected") {
            // The hueEngine is already connected to the HUE Bridge
            try {
              await node.initHUEConnection();
            } catch (error) {
              node.sysLogger?.error(`Errore hue-config: node.startWatchdogTimer: ${error.message}`);
            }
          }
          await node.startWatchdogTimer();
        })();
      }, 60000);
    };

    setTimeout(() => {
      (async () => {
        await node.initHUEConnection();
        node.startWatchdogTimer();
      })();
    }, 5000);


    // Functions called from the nodes ----------------------------------------------------------------
    // Query the HUE Bridge to return the resources
    node.loadResourcesFromHUEBridge = async () => {
      if (node.linkStatus === "disconnected") return;
      // (async () => {
      // °°°°°° Load ALL resources
      try {
        node.hueAllResources = await node.hueManager.hueApiV2.get("/resource");
        if (node.hueAllResources !== undefined) {
          node.hueAllRooms = node.hueAllResources.filter((a) => a.type === "room");
          // Update all KNX State of the nodes with the new hue device values
          node.nodeClients.forEach((_node) => {
            if (_node.hueDevice !== undefined && node.hueAllResources !== undefined) {
              const oHUEDevice = node.hueAllResources.filter((a) => a.id === _node.hueDevice)[0];
              if (oHUEDevice !== undefined) {
                // Add _Node to the clients array
                _node.setNodeStatusHue({
                  fill: "green",
                  shape: "ring",
                  text: "Ready",
                });
                _node.currentHUEDevice = cloneDeep(oHUEDevice); // Copy by Value and not by ref
                if (_node.initializingAtStart === true) {
                  _node.handleSendHUE(oHUEDevice); // Pass by value
                }
              }
            }
          });
        } else {
          // The config node cannot read the resources. Signalling disconnected
        }
      } catch (error) {
        if (this.sysLogger !== undefined && this.sysLogger !== null) {
          this.sysLogger.error(`KNXUltimatehueEngine: loadResourcesFromHUEBridge: ${error.message}`);
          throw (error);
        }
      }

      //})();
    };

    node.getFirstLightInGroup = function getFirstLightInGroup(_groupID) {
      if (node.hueAllResources === undefined || node.hueAllResources === null) return;
      try {
        const group = node.hueAllResources.filter((a) => a.id === _groupID)[0];
        const owner = node.hueAllResources.filter((a) => a.id === group.owner.rid)[0];
        if (owner.children !== undefined) {
          const dev = node.hueAllResources.filter((a) => a.id === owner.children[0].rid)[0];
          if (dev.type === "device" && dev.services !== undefined) {
            const lightID = dev.services.filter((a) => a.rtype === 'light')[0].rid;
            const oLight = node.hueAllResources.filter((a) => a.id === lightID)[0];
            return oLight;
          } else if (dev.type === "light") {
            return dev;
          }
        }
      } catch (error) { }
    };

    // Return an array of light belonging to the groupID
    node.getAllLightsBelongingToTheGroup = async function getAllLightsBelongingToTheGroup(_groupID, refreshResourcesFromBridge = true) {
      if (node.hueAllResources === undefined || node.hueAllResources === null) return;
      const retArr = [];
      let filteredResource;
      try {
        if (refreshResourcesFromBridge === true) {
          await node.loadResourcesFromHUEBridge();
        }
        // filteredResource = node.hueAllResources.filter((a) => a.id === _groupID);
        // if (filteredResource[0].type === "grouped_light") {
        //   filteredResource = node.hueAllResources.filter((a) => a.services);
        //   filteredResource = filteredResource.filter((a) => a.services).filter((b) => b.type === "light");
        //   if (filteredResource.length > 0) {
        //     console.log(filteredResource)
        //   }
        // }
        node.hueAllResources.forEach((res) => {
          if (res.services !== undefined && res.services.length > 0) {
            res.services.forEach((serv) => {
              if (serv.rid === _groupID) {
                if (res.children !== undefined) {
                  const children = res.children.filter((a) => a.rtype === "light");
                  for (let index = 0; index < children.length; index++) {
                    const element = children[index];
                    const oLight = node.hueAllResources.filter((a) => a.id === element.rid);
                    //if (oLight !== null && oLight !== undefined) retArr.push({ groupID: _groupID, light: oLight[0] });
                    if (oLight !== null && oLight !== undefined) retArr.push(oLight[0]);
                  }
                }
              }
            });
          }
        });
        return retArr;
      } catch (error) { /* empty */ }
    };

    // Returns the cached devices (node.hueAllResources) by type.
    node.getResources = function getResources(_rtype) {
      try {
        if (node.hueAllResources === undefined) return;
        // Returns capitalized string
        function capStr(s) {
          if (typeof s !== "string") return "";
          return s.charAt(0).toUpperCase() + s.slice(1);
        }
        const retArray = [];
        let allResources;
        if (_rtype === "light" || _rtype === "grouped_light") {
          allResources = node.hueAllResources.filter((a) => a.type === "light" || a.type === "grouped_light");
        } else if (_rtype === "plug") {
          allResources = node.hueAllResources.filter((a) => a.type === "plug" || a.type === "smartplug" || a.type === "smart_plug");
          console.log('getResources plug raw resources', allResources.map((res) => ({ id: res.id, type: res.type, owner: res.owner?.rtype })));
        } else {
          allResources = node.hueAllResources.filter((a) => a.type === _rtype);
        }
        if (allResources === null) return;
        for (let index = 0; index < allResources.length; index++) {
          const resource = allResources[index];
          // Get the owner
          try {
            let resourceName = "";
            let sType = "";
            let sArchetype = "";
            if (_rtype === "light" || _rtype === "grouped_light") {
              // It's a service, having a owner
              const owners = node.hueAllResources.filter((a) => a.id === resource.owner.rid);
              if (owners !== null) {
                for (let index = 0; index < owners.length; index++) {
                  const owner = owners[index];
                  if (owner.type === "bridge_home") {
                    resourceName += "ALL GROUPS and ";
                  } else {
                    resourceName += `${owner.metadata.name} and `;
                    sArchetype += `${owner.metadata.archetype === undefined ? "" : owner.metadata.archetype} and `;
                    // const room = node.hueAllRooms.find((child) => child.children.find((a) => a.rid === owner.id));
                    // sRoom += room !== undefined ? `${room.metadata.name} + ` : " + ";
                    sType += `${capStr(owner.type)} + `;
                  }
                }
              }
              sType = sType.slice(0, -" + ".length);
              if (sArchetype !== '') sArchetype = sArchetype.slice(0, -" and ".length);
              resourceName = resourceName.slice(0, -" and ".length);
              resourceName += sType !== "" ? ` (${sType}:${sArchetype})` : "";
              retArray.push({
                name: `${capStr(resource.type)}: ${resourceName}`,
                id: resource.id,
                deviceObject: resource,
              });
            }
            if (_rtype === "scene") {
              resourceName = resource.metadata.name || "**Name Not Found**";
              // Get the linked zone
              const zone = node.hueAllResources.find((res) => res.id === resource.group.rid);
              resourceName += ` - ${capStr(resource.group.rtype)}: ${zone.metadata.name}`;
              retArray.push({
                name: `${capStr(_rtype)}: ${resourceName}`,
                id: resource.id,
              });
            }
            if (_rtype === "button") {
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              const controlID = resource.metadata !== undefined ? resource.metadata.control_id || "" : "";
              retArray.push({
                name: `${capStr(_rtype)}: ${linkedDevName}, button ${controlID}`,
                id: resource.id,
              });
            }
            if (_rtype === "motion" || _rtype === "camera_motion") {
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `${capStr(_rtype)}: ${linkedDevName}`,
                id: resource.id,
              });
            }
            if (_rtype === "relative_rotary") {
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `Rotary: ${linkedDevName}`,
                id: resource.id,
              });
            }
            if (_rtype === "light_level") {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid));
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `Light Level: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ""}`,
                id: resource.id,
              });
            }
            if (_rtype === "plug") {
              const linkedDevice = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id));
              const room = node.hueAllRooms?.find((roomItem) => roomItem.children?.find((child) => child.rid === linkedDevice?.id));
              const plugName = linkedDevice?.metadata?.name || resource.metadata?.name || "Unnamed Plug";
              const stateLabel = resource?.on?.on === true ? "on" : "off";
              console.log('getResources plug direct resource', { id: resource.id, type: resource.type, name: plugName, linkedDevice: linkedDevice?.id });
              retArray.push({
                name: `Plug: ${plugName}${room !== undefined ? `, room ${room.metadata.name}` : ""} [${stateLabel}]`,
                id: resource.id,
                type: resource.type,
                deviceObject: resource,
              });
            }
            if (_rtype === "temperature") {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid));
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `Temperature: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ""}`,
                id: resource.id,
              });
            }
            if (_rtype === "device_power") {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid));
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `Battery: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ""}`,
                id: resource.id,
              });
            }
            if (_rtype === "zigbee_connectivity") {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid));
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === "device" && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || "";
              retArray.push({
                name: `Zigbee Connectivity: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ""}`,
                id: resource.id,
              });
              // Get zigbee_connectivituy
              // const bridgeId = node.hueAllResources.filter((a) => a.bridge_id === config.bridgeid).owner.rid;
              // const zigbee_ConnectivityID = node.hueAllResources.filter((a) => a.id === bridgeId).services.filter((a) => a.rtype === "zigbee_connectivity").rid;
              // // connected, disconnected, connectivity_issue, unidirectional_incoming
              // const oZigbeeConnectivityStatus = node.hueAllResources.filter((a) => a.id === zigbee_ConnectivityID).status;
              //const zigbee = node.hueAllResources.filter((a) => a.services !== undefined).find((a) => a.services.rtype === "zigbee_connectivity");
              //const devs = zigbee.filter((a) => a.rtype === "zigbee_connectivity");
            }
            if (_rtype === 'contact') {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid))
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === 'device' && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || ''
              retArray.push({
                name: `Contact: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ''}`,
                id: resource.id,
              });
            }
            if (_rtype === 'device_software_update') {
              const Room = node.hueAllRooms.find((room) => room.children.find((child) => child.rid === resource.owner.rid))
              const linkedDevName = node.hueAllResources.find((dev) => dev.type === 'device' && dev.services.find((serv) => serv.rid === resource.id)).metadata.name || ''
              retArray.push({
                name: `Software status: ${linkedDevName}${Room !== undefined ? `, room ${Room.metadata.name}` : ''}`,
                id: resource.id,
              });
            }
          } catch (error) {
            console.log("KNXHue-config: getResources error ", error.trace);
            retArray.push({
              name: `${_rtype}: ERROR ${error.message}`,
              id: resource.id,
            });
          }
        }
        if (_rtype === "plug" && retArray.length === 0) {
          const plugDevices = node.hueAllResources.filter((dev) => {
            if (dev.type !== "device" || !Array.isArray(dev.services)) return false;
            const archetypePlug = dev.product_data?.product_archetype === 'plug' || dev.metadata?.archetype === 'plug' || /plug/i.test(dev.product_data?.product_name || '') || /plug/i.test(dev.metadata?.name || '');
            const hasService = dev.services.some((serv) => ['plug', 'smartplug', 'smart_plug', 'light'].includes(serv.rtype || ''));
            return archetypePlug && hasService;
          });
          plugDevices.forEach((device) => {
            try {
              const plugService = device.services.find((serv) => ['plug', 'smartplug', 'smart_plug', 'light'].includes(serv.rtype || ''));
              if (!plugService) return;
              const plugResource = node.hueAllResources.find((res) => res.id === plugService.rid) || {};
              const room = node.hueAllRooms?.find((roomItem) => roomItem.children?.find((child) => child.rid === device.id));
              const plugName = device.metadata?.name || plugResource.metadata?.name || "Unnamed Plug";
              const stateLabel = plugResource?.on?.on === true ? "on" : (plugResource?.on?.on === false ? "off" : "");
              retArray.push({
                name: `Plug: ${plugName}${room !== undefined ? `, room ${room.metadata.name}` : ""}${stateLabel ? ` [${stateLabel}]` : ""}`,
                id: plugService.rid || device.id,
                type: plugService.rtype || plugResource.type || 'light',
                deviceObject: plugResource.on ? plugResource : {
                  id: plugService.rid || device.id,
                  type: plugService.rtype || plugResource.type || 'light',
                  on: plugResource.on,
                  owner: { rid: device.id, rtype: 'device' },
                },
              });
            } catch (err) {
              node.sysLogger?.warn(`KNXUltimateHue: getResources plug fallback error ${err.message}`);
            }
          });
        }
        node.sysLogger?.debug(`getResources plug returning ${retArray.length}`);
        return { devices: retArray };
      } catch (error) {
        node.sysLogger?.error(`KNXUltimateHue: hueEngine: classHUE: getResources: error ${error.message}`);
        return { devices: error.message };
      }
    };

    // Get current color in HEX (used in html)
    node.getColorFromHueLight = (_lightId) => {
      try {
        const oLight = node.hueAllResources.filter((a) => a.id === _lightId)[0];
        const retRGB = hueColorConverter.ColorConverter.xyBriToRgb(oLight.color.xy.x, oLight.color.xy.y, oLight.dimming.brightness);
        const ret = "#" + hueColorConverter.ColorConverter.rgbHex(retRGB.r, retRGB.g, retRGB.b).toString();
        return ret;
      } catch (error) {
        node.sysLogger?.warn(`KNXUltimateHue: hueEngine: getColorFromHueLight: error ${error.message}`);
        return {};
      }
    };
    // Get current Kelvin (used in html)
    node.getKelvinFromHueLight = (_lightId) => {
      try {
        const oLight = node.hueAllResources.filter((a) => a.id === _lightId)[0];
        const ret = { kelvin: hueColorConverter.ColorConverter.mirekToKelvin(oLight.color_temperature.mirek), brightness: Math.round(oLight.dimming.brightness, 0) };
        return JSON.stringify(ret);
      } catch (error) {
        node.sysLogger?.error(`KNXUltimateHue: hueEngine: getKelvinFromHueLight: error ${error.message}`);
        return {};
      }
    };

    /**
    * Get average color XY from a light array
    * @param {array} _arrayLights - Light array
    * @returns { x,y,mirek,brightness } - Object containing all infos
    */
    node.getAverageColorsXYBrightnessAndTemperature = async function getAverageColorsXYBrightnessAndTemperature(_arrayLights) {
      let x; let y; let mirek; let brightness;
      let countColor = 0, countColor_Temperature = 0, countDimming = 0;
      _arrayLights.forEach((element) => {
        if (element.color !== undefined && element.color.xy !== undefined) {
          if (x === undefined) { x = 0; y = 0; }
          x += element.color.xy.x;
          y += element.color.xy.y;
          countColor += 1;
        }
        if (element.color_temperature !== undefined && element.color_temperature.mirek !== undefined) {
          if (mirek === undefined) mirek = 0;
          mirek += element.color_temperature.mirek;
          countColor_Temperature += 1;
        }
        if (element.dimming !== undefined && element.dimming.brightness !== undefined) {
          if (brightness === undefined) brightness = 0;
          brightness += element.dimming.brightness;
          countDimming += 1;
        }
      });
      // Calculate and return the averages
      const retX = countColor === 0 ? undefined : x / countColor;
      const retY = countColor === 0 ? undefined : y / countColor;
      const retMirek = countColor_Temperature === 0 ? undefined : mirek / countColor_Temperature;
      const retBrightness = countDimming === 0 ? undefined : brightness / countDimming;

      return {
        x: retX, y: retY, mirek: retMirek, brightness: retBrightness
      };
    };
    // END functions called from the nodes ----------------------------------------------------------------



    node.addClient = (_Node) => {
      // Update the node hue device, as soon as a node register itself to hue-config nodeClients
      if (node.nodeClients.filter((x) => x.id === _Node.id).length === 0) {
        node.nodeClients.push(_Node);
        if (node.hueAllResources !== undefined && node.hueAllResources !== null && _Node.initializingAtStart === true) {
          const oHUEDevice = node.hueAllResources.filter((a) => a.id === _Node.hueDevice)[0];
          if (oHUEDevice !== undefined) {
            _Node.currentHUEDevice = cloneDeep(oHUEDevice);
            _Node.handleSendHUE(oHUEDevice);
            // Add _Node to the clients array
            _Node.setNodeStatusHue({
              fill: "green",
              shape: "dot",
              text: "I'm new and ready.",
            });
          }
        } else {
          // Add _Node to the clients array
          _Node.setNodeStatusHue({
            fill: "grey",
            shape: "ring",
            text: "Waiting for connection",
          });
        }
      }
    };

    node.removeClient = (_Node) => {
      // Remove the client node from the clients array
      try {
        node.nodeClients = node.nodeClients.filter((x) => x.id !== _Node.id);
      } catch (error) {
        /* empty */
      }
    };

    node.closeConnection = async () => {
      node.hueManager?.removeAllListeners();
      node.linkStatus === "disconnected";
    }

    node.on("close", (done) => {
      try {
        node.sysLogger = null;
        node.nodeClients = [];
        node.closeConnection();
        (async () => {
          try {
            await node.hueManager.close();
            node.hueManager = null;
            delete node.hueManager;
            done();
          } catch (error) {
            done();
          }
        })();
      } catch (error) {
        done();
      }
    });
  }
  RED.nodes.registerType("hue-config", hueConfig, {
    credentials: {
      username: { type: "password" },
      clientkey: { type: "password" },
    },
  });
};
