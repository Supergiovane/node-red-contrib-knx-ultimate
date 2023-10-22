/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
const dptlib = require("../KNXEngine/src/dptlib");
const HueClass = require("./utils/hueEngine").classHUE;
const loggerEngine = require("./utils/sysLogger");
const hueColorConverter = require("./utils/hueColorConverter");

// Helpers
const sortBy = (field) => (a, b) => {
  if (a[field] > b[field]) {
    return 1;
  }
  return -1;
};

const onlyDptKeys = (kv) => kv[0].startsWith("DPT");

const extractBaseNo = (kv) => ({
  subtypes: kv[1].subtypes,
  base: parseInt(kv[1].id.replace("DPT", "")),
});

const convertSubtype = (baseType) => (kv) => {
  const value = `${baseType.base}.${kv[0]}`;
  // let sRet = value + " " + kv[1].name + (kv[1].unit === undefined ? "" : " (" + kv[1].unit + ")");
  const sRet = `${value} ${kv[1].name}`;
  return {
    value,
    text: sRet,
  };
};

const toConcattedSubtypes = (acc, baseType) => {
  const subtypes = Object.entries(baseType.subtypes).sort(sortBy(0)).map(convertSubtype(baseType));
  return acc.concat(subtypes);
};

module.exports = (RED) => {
  RED.httpAdmin.get("/knxUltimateDpts", RED.auth.needsPermission("hue-config.read"), (req, res) => {
    const dpts = Object.entries(dptlib).filter(onlyDptKeys).map(extractBaseNo).sort(sortBy("base")).reduce(toConcattedSubtypes, []);
    res.json(dpts);
  });

  function hueConfig(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.host = config.host;
    node.nodeClients = []; // Stores the registered clients
    node.loglevel = config.loglevel !== undefined ? config.loglevel : "error"; // 18/02/2020 Loglevel default error
    node.sysLogger = null;
    try {
      node.sysLogger = loggerEngine.get({ loglevel: node.loglevel }); // New logger to adhere to the loglevel selected in the config-window
    } catch (error) {
      /* empty */
    }

    node.name = config.name === undefined || config.name === "" ? node.host : config.name;

    // Init HUE Utility
    node.hueManager = new HueClass(node.host, node.credentials.username, node.credentials.clientkey, config.bridgeid, node.sysLogger);

    // Connect to Bridge and get the resources
    node.ConnectToHueBridge = async () => {
      await node.hueManager.Connect();
      // Handle events
      try {
        node.hueManager.removeAllListeners();
      } catch (error) {
        /* empty */
      }
      node.hueManager.on("event", (_event) => {
        node.nodeClients.forEach((_oClient) => {
          const oClient = _oClient;
          try {
            if (oClient.handleSendHUE !== undefined) oClient.handleSendHUE(_event);
          } catch (error) {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`Errore node.hueManager.on(event): ${error.message}`);
          }
        });
      });
      // Connected
      node.hueManager.on("connected", () => {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("node.hueManager connected event");
      });
      // Initialize the http wrapper, to use the provided key.
      // This http wrapper is used to get the data from HUE brigde
      await node.refreshResources();
    };

    (async () => {
      await node.ConnectToHueBridge();
    })();

    // Get all devices and join it with relative rooms, by adding the room name to the device name
    node.getResources = (_rtype) => {
      try {
        // Returns capitalized string
        function capStr(s) {
          if (typeof s !== "string") return "";
          return s.charAt(0).toUpperCase() + s.slice(1);
        }
        const retArray = [];
        let allResources;
        if (_rtype === "light" || _rtype === "grouped_light") {
          allResources = node.hueAllResources.filter((a) => a.type === "light" || a.type === "grouped_light");
        } else {
          allResources = node.hueAllResources.filter((a) => a.type === _rtype);
        }
        for (let index = 0; index < allResources.length; index++) {
          const resource = allResources[index];
          // Get the owner
          try {
            let resourceName = "";
            let sType = "";
            if (_rtype === "light" || _rtype === "grouped_light") {
              // It's a service, having a owner
              const owners = node.hueAllResources.filter((a) => a.id === resource.owner.rid);
              for (let index = 0; index < owners.length; index++) {
                const owner = owners[index];
                if (owner.type === "bridge_home") {
                  resourceName += "ALL GROUPS and ";
                } else {
                  resourceName += `${owner.metadata.name} and `;
                  //const room = node.hueAllRooms.find((child) => child.children.find((a) => a.rid === owner.id));
                  //sRoom += room !== undefined ? `${room.metadata.name} + ` : " + ";
                  sType += capStr(owner.type) + ' + ';
                }
              }
              sType = sType.slice(0, -" + ".length);
              resourceName = resourceName.slice(0, -" and ".length);
              resourceName += sType !== "" ? ' (' + sType + ')' : "";
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
            if (_rtype === "motion") {
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
          } catch (error) {
            retArray.push({
              name: `${_rtype}: ERROR ${error.message}`,
              id: resource.id,
            });
          }
        }
        return { devices: retArray };
      } catch (error) {
        if (node.sysLogger !== undefined && node.sysLogger !== null)
          node.sysLogger.error(`KNXUltimateHue: hueEngine: classHUE: getDevices: error ${error.message}`);
        return { devices: error.message };
      }
    };
    node.refreshResources = () => new Promise((resolve, reject) => {
      (async () => {
        // Reload all resources
        try {
          node.hueAllResources = await node.hueManager.hueApiV2.get("/resource");
          node.hueAllRooms = node.hueAllResources.filter((a) => a.type === "room");
          resolve(true);
        } catch (error) {
          if (this.sysLogger !== undefined && this.sysLogger !== null) {
            this.sysLogger.error(`KNXUltimatehueEngine: getting resources: ${error.message}`);
            reject(error.message);
          }
        }
      })();
    });

    // Get all devices and join it with relative rooms, by adding the room name to the device name
    node.getColorFromHueLight = (_lightId) => new Promise((resolve, reject) => {
      (async () => {
        try {
          await node.refreshResources();
          const oLight = node.hueAllResources.filter((a) => a.id === _lightId)[0];
          const ret = hueColorConverter.ColorConverter.xyBriToRgb(
            oLight.color.xy.x,
            oLight.color.xy.y,
            oLight.dimming.brightness,
          );
          resolve(JSON.stringify(ret));
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`KNXUltimateHue: hueEngine: getColorFromHueLight: error ${error.message}`);
          reject(error.message);
        }
      })();
    });

    node.addClient = (_Node) => {
      // Check if node already exists
      if (node.nodeClients.filter((x) => x.id === _Node.id).length === 0) {
        // Add _Node to the clients array
        _Node.setNodeStatusHue({
          fill: "grey",
          shape: "ring",
          text: "Hue initialized.",
        });
        node.nodeClients.push(_Node);
      }
    };

    node.removeClient = (_Node) => {
      // Remove the client node from the clients array
      try {
        node.nodeClients = node.nodeClients.filter((x) => x.id !== _Node.id);
      } catch (error) { /* empty */ }
    };

    node.on("close", (done) => {
      try {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger = null;
        loggerEngine.destroy();
        node.nodeClients = [];
        node.hueManager.removeAllListeners();
        (async () => {
          try {
            await node.hueManager.close();
            node.hueManager = null;
            delete node.hueManager;
          } catch (error) {
            /* empty */
          }
          done();
        })();
      } catch (error) {
        done();
      }
    });

    RED.httpAdmin.get("/knxUltimateGetHueColor", RED.auth.needsPermission("hue-config.read"), (req, res) => {
      (async () => {
        try {
          const rgbColor = await node.getColorFromHueLight(req.query.id);
          res.json(rgbColor);
        } catch (error) {
          res.json("Select the device first!");
        }
      })();
    });

    RED.httpAdmin.get("/KNXUltimateGetResourcesHUE", RED.auth.needsPermission("hue-config.read"), (req, res) => {
      try {
        // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
        const serverNode = RED.nodes.getNode(req.query.nodeID); // Retrieve node.id of the config node.
        const jRet = serverNode.getResources(req.query.rtype);
        res.json(jRet);
        // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
      } catch (error) {
        RED.log.error(`Errore KNXUltimateGetResourcesHUE non gestito ${error.message}`);
        res.json({ devices: error.message });
        (async () => {
          await node.ConnectToHueBridge();
        })();
      }
    });
  }

  // RED.nodes.registerType("hue-config", hue-config);
  RED.nodes.registerType("hue-config", hueConfig, {
    credentials: {
      username: { type: "password" },
      clientkey: { type: "password" },
    },
  });
};
