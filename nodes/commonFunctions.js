// Utility function
// until node-red 3.1.0, there is a bug creating a plugin, so for backward compatibility, i must use a JS as a node.
const oOS = require("os");
const fs = require("fs");
const path = require("path");
const yaml = require('js-yaml');
const loggerEngine = require("./utils/sysLogger.js");
const dptlib = require('knxultimate').dptlib;



// DATAPONT MANIPULATION HELPERS
// ####################
const sortBy = (field) => (a, b) => {
    if (a[field] > b[field]) {
        return 1;
    } else {
        return -1;
    }
};

const onlyDptKeys = (kv) => {
    return kv[0].startsWith("DPT");
};

const extractBaseNo = (kv) => {
    return {
        subtypes: kv[1].subtypes,
        base: parseInt(kv[1].id.replace("DPT", "")),
    };
};

const convertSubtype = (baseType) => (kv) => {
    const value = `${baseType.base}.${kv[0]}`;
    // let sRet = value + " " + kv[1].name + (kv[1].unit === undefined ? "" : " (" + kv[1].unit + ")");
    const sRet = value + " " + kv[1].name;
    return {
        value,
        text: sRet,
    };
};

const toConcattedSubtypes = (acc, baseType) => {
    const subtypes = Object.entries(baseType.subtypes).sort(sortBy(0)).map(convertSubtype(baseType));

    return acc.concat(subtypes);
};
// ####################


module.exports = (RED) => {
    RED.plugins.registerPlugin("commonFunctions", {
        type: "foo",
        onadd: function () {
            RED.events.on("registry:plugin-added", function (id) {
                //console.log(`my-test-plugin: plugin-added event "${id}"`)
                commonFunctions();
            });
        }
    })

    function commonFunctions() {
        var node = this;

        try {
            node.sysLogger = loggerEngine.get({ loglevel: node.loglevel }); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window
        } catch (error) { }

        // 11/03/2020 Delete scene saved file, from html
        RED.httpAdmin.get('/knxultimateCheckHueConnected', (req, res) => {
            try {
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                if (serverId.hueAllResources === null || serverId.hueAllResources === undefined) {
                    res.json({ ready: false });
                } else {
                    res.json({ ready: true });
                }
            } catch (error) {
                res.json({ ready: false });
            }
        });

        // 11/03/2020 Delete scene saved file, from html
        RED.httpAdmin.get('/knxultimatescenecontrollerdelete'), (req, res) => {
            // Delete the file
            try {
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                const newPath = `${serverId.userDir}/scenecontroller/SceneController_${req.query.FileName}`;
                fs.unlinkSync(newPath);
            } catch (error) { if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn(`e ${error}`); }
            res.json({ status: 220 });
        };

        // Endpoint for connecting to HUE Bridge
        RED.httpAdmin.get("/KNXUltimateRegisterToHueBridge", (req, res) => {
            try {

                (async () => {
                    try {
                        const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.

                        // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
                        // If using this code outside of the examples directory, you will want to use the line below and remove the
                        // const discovery = require('node-hue-api').discovery
                        const hueApi = require("node-hue-api").api;
                        const appName = "KNXUltimate";
                        const deviceName = "Node-Red";

                        // async function discoverBridge() {
                        //   const discoveryResults = await discovery.nupnpSearch()

                        //   if (discoveryResults.length === 0) {
                        //     if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('Failed to resolve any Hue Bridges')
                        //     return null
                        //   } else {
                        //     // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
                        //     return discoveryResults[0].ipaddress
                        //   }
                        // }
                        async function discoverAndCreateUser() {
                            // const ipAddress = await discoverBridge()
                            const ipAddress = req.query.IP;
                            // Create an unauthenticated instance of the Hue API so that we can create a new user
                            try {
                                const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
                                let createdUser;
                                createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("*******************************************************************************\n");
                                if (node.sysLogger !== undefined && node.sysLogger !== null) {
                                    node.sysLogger.info(
                                        "User has been created on the Hue Bridge. The following username can be used to\n"
                                        + "authenticate with the Bridge and provide full local access to the Hue Bridge.\n"
                                        + "YOU SHOULD TREAT THIS LIKE A PASSWORD\n",
                                    );
                                }
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Hue Bridge User: ${createdUser.username}`);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("*******************************************************************************\n");

                                // Create a new API instance that is authenticated with the new user we created
                                const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);
                                // Do something with the authenticated user/api
                                const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
                                return { bridge: bridgeConfig, user: createdUser };
                            } catch (err) {
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`The Link button on the bridge was not pressed. ${err.message}`);
                                throw err;
                                // return {
                                //   error:
                                //     "The Link button on the bridge was not pressed or an error has occurred. " +
                                //     err.message,
                                // };
                            }
                        }
                        async function discoverAndCreateUserInsecure() {
                            // const ipAddress = await discoverBridge()
                            const ipAddress = req.query.IP;

                            // Create an unauthenticated instance of the Hue API so that we can create a new user                       
                            try {
                                const unauthenticatedApi = await hueApi.createInsecureLocal(ipAddress).connect();
                                let createdUser;
                                createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("*******************************************************************************\n");
                                if (node.sysLogger !== undefined && node.sysLogger !== null) {
                                    node.sysLogger.info(
                                        "User has been created on the Hue Bridge. The following username can be used to\n"
                                        + "authenticate with the Bridge and provide full local access to the Hue Bridge.\n"
                                        + "YOU SHOULD TREAT THIS LIKE A PASSWORD\n",
                                    );
                                }
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Hue Bridge User: ${createdUser.username}`);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("*******************************************************************************\n");

                                // Create a new API instance that is authenticated with the new user we created
                                const authenticatedApi = await hueApi.createInsecureLocal(ipAddress).connect(createdUser.username);
                                // Do something with the authenticated user/api
                                const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
                                return { bridge: bridgeConfig, user: createdUser };
                            } catch (err) {
                                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`The Link button on the bridge was not pressed. ` + err.stack);
                                return {
                                    error: `The Link button on the bridge was not pressed or an error has occurred.`,
                                };
                            }
                        }

                        // Invoke the discovery and create user code
                        try {
                            const jRet = await discoverAndCreateUser();
                            res.json(jRet);
                        } catch (error) {
                            RED.log.error(`Errore KNXUltimateRegisterToHueBridge non gestito Secure ${error.message}. Try with insecure http connection...`);
                            // Try with insecureClient (avoid problems with expired https certificates)
                            try {
                                const jRet = await discoverAndCreateUserInsecure();
                                res.json(jRet);
                            } catch (error) {
                                RED.log.error(`Errore KNXUltimateRegisterToHueBridge non gestito Insecure ${error.message}. I give up.`);
                                res.json({ error: error.message });
                            }
                        }
                    } catch (err) {
                        RED.log.error(`Errore KNXUltimateRegisterToHueBridge non gestito ${err.message}`);
                    }
                })();
            } catch (err) {
                RED.log.error(`Errore KNXUltimateRegisterToHueBridge bsonto ${err.message}`);
                res.json({ error: err.message });
            }
        });

        // Endpoint for reading csv/esf by the other nodes
        RED.httpAdmin.get("/knxUltimatecsv", RED.auth.needsPermission("knxUltimate-config.read"), (req, res) => {
            try {
                if (typeof req.query.nodeID !== "undefined" && req.query.nodeID !== null && req.query.nodeID !== "") {
                    const _node = RED.nodes.getNode(req.query.nodeID); // Retrieve node.id of the config node.
                    if (_node !== null) res.json(RED.nodes.getNode(_node.id).csv);
                } else {
                    // Get the first knxultimate-config having a valid csv
                    try {
                        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info("KNXUltimate-config: Requested csv maybe from visu-ultimate?");
                        RED.nodes.eachNode((_node) => {
                            if (_node.hasOwnProperty("csv") && _node.type === "knxUltimate-config" && _node.csv !== "") {
                                res.json(RED.nodes.getNode(_node.id).csv);
                            }
                        });
                    } catch (error) { }
                }
            } catch (error) {
            }

        });

        // 14/08/2019 Endpoint for retrieving the ethernet interfaces
        RED.httpAdmin.get("/knxUltimateETHInterfaces", (req, res) => {
            const jListInterfaces = [];
            try {
                const oiFaces = oOS.networkInterfaces();
                Object.keys(oiFaces).forEach((ifname) => {
                    // Interface with single IP
                    if (Object.keys(oiFaces[ifname]).length === 1) {
                        if (Object.keys(oiFaces[ifname])[0].internal === false) {
                            jListInterfaces.push({
                                name: ifname,
                                address: Object.keys(oiFaces[ifname])[0].address,
                            });
                        }
                    } else {
                        let sAddresses = "";
                        oiFaces[ifname].forEach((iface) => {
                            if (iface.internal === false) sAddresses += `+${iface.address}`;
                        });
                        if (sAddresses !== "") jListInterfaces.push({ name: ifname, address: sAddresses });
                    }
                });
            } catch (error) { }
            res.json(jListInterfaces);
        });

        // 12/08/2021 Endpoint for deleting the GA persistent file for the current gateway
        RED.httpAdmin.get("/deletePersistGAFile", RED.auth.needsPermission("knxUltimate-config.read"), (req, res) => {
            try {
                if (typeof req.query.serverId !== "undefined" && req.query.serverId !== null && req.query.serverId !== "") {
                    try {
                        const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                        const sFile = path.join(serverId.userDir, "knxpersistvalues", `knxpersist${req.query.serverId}.json`);
                        fs.unlinkSync(sFile);
                    } catch (error) { res.json({ error: error.stack }); }
                    res.json({ error: "No error" });
                } else {
                    res.json({ error: "No serverId specified" });
                }
            } catch (error) {
            }
        });

        RED.httpAdmin.get("/knxUltimateGetHueColor", (req, res) => {
            try {
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                // find wether the light is a light or is grouped_light
                let hexColor;
                const _oDevice = serverId.hueAllResources.filter((a) => a.id === req.query.id)[0];
                if (_oDevice.type === "light") {
                    hexColor = serverId.getColorFromHueLight(req.query.id);
                } else {
                    // grouped_light, get the first light in the group
                    const oLight = serverId.getFirstLightInGroup(_oDevice.id);
                    hexColor = serverId.getColorFromHueLight(oLight.id);
                }
                res.json(hexColor !== undefined ? hexColor : "Select the device first!");
            } catch (error) {
                res.json("Select the device first!");
            }
        });

        RED.httpAdmin.get("/knxUltimateGetKelvinColor", (req, res) => {
            try {
                // find wether the light is a light or is grouped_light
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                let kelvinValue;
                const _oDevice = serverId.hueAllResources.filter((a) => a.id === req.query.id)[0];
                if (_oDevice.type === "light") {
                    kelvinValue = serverId.getKelvinFromHueLight(req.query.id);
                } else {
                    // grouped_light, get the first light in the group
                    const oLight = serverId.getFirstLightInGroup(_oDevice.id);
                    kelvinValue = serverId.getKelvinFromHueLight(oLight.id);
                }
                res.json(kelvinValue !== undefined ? kelvinValue : "Select the device first!");
            } catch (error) {
                res.json("Select the device first!");
            }
        });

        RED.httpAdmin.get("/knxUltimateGetLightObject", (req, res) => {
            try {
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                if (serverId.hueAllResources === null || serverId.hueAllResources === undefined) {
                    throw (new Error("Resource not yet loaded"));
                }
                const _lightId = req.query.id;
                const oLight = serverId.hueAllResources.filter((a) => a.id === _lightId)[0];
                // Infer some useful info, so the HTML part can avoid to query the server
                // Kelvin
                try {
                    if (oLight.color_temperature !== undefined && oLight.color_temperature.mirek !== undefined) {
                        oLight.calculatedKelvin = hueColorConverter.ColorConverter.mirekToKelvin(oLight.color_temperature.mirek);
                    }
                } catch (error) {
                    oLight.calculatedKelvin = undefined;
                }
                // HEX value from XYBri
                try {
                    const retRGB = hueColorConverter.ColorConverter.xyBriToRgb(oLight.color.xy.x, oLight.color.xy.y, oLight.dimming.brightness);
                    const ret = `#${hueColorConverter.ColorConverter.rgbHex(retRGB.r, retRGB.g, retRGB.b).toString()}`;
                    oLight.calculatedHEXColor = ret;
                } catch (error) {
                    oLight.calculatedHEXColor = undefined;
                }
                res.json(oLight);
            } catch (error) {
                if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`KNXUltimateHue: hueEngine: knxUltimateGetLightObject: error ${error.message}.`);
                res.json({});
            }
        });

        RED.httpAdmin.get("/KNXUltimateGetResourcesHUE", (req, res) => {
            try {
                // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                if (serverId === null) {
                    RED.log.warn(`Warn KNXUltimateGetResourcesHUE serverId is null`);
                    res.json({ devices: `serverId not set` });
                    return;
                }
                const jRet = serverId.getResources(req.query.rtype);
                if (jRet !== undefined) {
                    res.json(jRet);
                } else {
                    res.json({ devices: [{ name: "I'm still connecting...Try in some seconds" }] });
                }
                // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
            } catch (error) {
                // RED.log.error(`Errore KNXUltimateGetResourcesHUE non gestito ${error.message}`);
                res.json({ devices: error.message });
                RED.log.error(`Err KNXUltimateGetResourcesHUE: ${error.message}`);
                // (async () => {
                //   await node.initHUEConnection();
                // })();
            }
        });

        RED.httpAdmin.get("/knxUltimateDpts", (req, res) => {
            try {
                const dpts = Object.entries(dptlib.dpts).filter(onlyDptKeys).map(extractBaseNo).sort(sortBy("base"))
                    .reduce(toConcattedSubtypes, []);
                res.json(dpts);
            } catch (error) { }
        });

        // 15/09/2020 Supergiovane, read datapoint help usage
        RED.httpAdmin.get("/knxUltimateDptsGetHelp", (req, res) => {
            try {

                const serverId = RED.nodes.getNode(req.query.serverId); // Retrieve node.id of the config node.
                const sDPT = req.query.dpt.split(".")[0]; // Takes only the main type
                let jRet;
                if (sDPT === "0") {
                    // Special fake datapoint, meaning "Universal Mode"
                    jRet = {
                        help: `// KNX-Ultimate set as UNIVERSAL NODE
    // Example of a function that sends a message to the KNX-Ultimate
    msg.destination = "0/0/1"; // Set the destination 
    msg.payload = false; // issues a write or response (based on the options Telegram type above) to the KNX bus
    msg.event = "GroupValue_Write"; // "GroupValue_Write" or "GroupValue_Response", overrides the option Telegram type above.
    msg.dpt = "1.001"; // for example "1.001", overrides the Datapoint option. (Datapoints can be sent as 9 , "9" , "9.001" or "DPT9.001")
    return msg;`,
                        helplink: "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki",
                    };
                    res.json(jRet);
                    return;
                }
                jRet = {
                    help: "NO",
                    helplink: "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome",
                };
                const dpts = Object.entries(dptlib.dpts).filter(onlyDptKeys);
                for (let index = 0; index < dpts.length; index++) {
                    if (dpts[index][0].toUpperCase() === `DPT${sDPT}`) {
                        jRet = {
                            help: dpts[index][1].basetype.hasOwnProperty("help") ? dpts[index][1].basetype.help : "NO",
                            helplink: dpts[index][1].basetype.hasOwnProperty("helplink")
                                ? dpts[index][1].basetype.helplink
                                : "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome",
                        };
                        break;
                    }
                }
                res.json(jRet);
            } catch (error) {
                res.json({ error: error.stack });
            }
        });

        // RED.httpAdmin.post("/banana", RED.auth.needsPermission("write"), (req, res) => {
        //     const node = RED.nodes.getNode(req.params.id);
        //     if (node != null) {
        //         try {
        //             if (req.body) {
        //                 console.log(body);
        //             }
        //         } catch (err) { }
        //     }
        //     res.json(req.body);
        // });

    }
};
