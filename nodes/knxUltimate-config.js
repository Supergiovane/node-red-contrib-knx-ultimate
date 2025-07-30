/* eslint-disable prefer-template */
/* eslint-disable no-inner-declarations */
/* eslint-disable curly */
/* eslint-disable max-len */
/* eslint-disable prefer-arrow-callback */
const fs = require("fs");
const path = require("path");
const net = require("net");
const _ = require("lodash");
const knx = require("knxultimate");
//const dptlib = require('knxultimate').dptlib;
const dptlib = require('knxultimate').dptlib;
const loggerClass = require('./utils/sysLogger')
// const { Server } = require('http')
const payloadRounder = require("./utils/payloadManipulation");
const utils = require('./utils/utils');

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
  function knxUltimateConfigNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.host = config.host;
    node.port = parseInt(config.port);
    node.physAddr = config.physAddr || "15.15.22"; // the KNX physical address we'd like to use
    node.suppressACKRequest = typeof config.suppressACKRequest === "undefined" ? true : config.suppressACKRequest; // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
    node.linkStatus = "disconnected"; // Can be: connected or disconnected
    node.nodeClients = []; // Stores the registered clients
    node.KNXEthInterface = typeof config.KNXEthInterface === "undefined" ? "Auto" : config.KNXEthInterface;
    node.KNXEthInterfaceManuallyInput = typeof config.KNXEthInterfaceManuallyInput === "undefined" ? "" : config.KNXEthInterfaceManuallyInput; // If you manually set the interface name, it will be wrote here
    node.timerDoInitialRead = null; // 17/02/2020 Timer (timeout) to do initial read of all nodes requesting initial read, after all nodes have been registered to the sercer
    node.stopETSImportIfNoDatapoint = typeof config.stopETSImportIfNoDatapoint === "undefined" ? "stop" : config.stopETSImportIfNoDatapoint; // 09/01/2020 Stop, Import Fake or Skip the import if a group address has unset datapoint
    node.localEchoInTunneling = typeof config.localEchoInTunneling !== "undefined" ? config.localEchoInTunneling : true;
    node.userDir = path.join(RED.settings.userDir, "knxultimatestorage"); // 04/04/2021 Supergiovane: Storage for service files
    node.exposedGAs = [];
    node.loglevel = config.loglevel !== undefined ? config.loglevel : "error"; // 18/02/2020 Loglevel default error
    if (node.loglevel === 'trace') node.loglevel = 'debug'; // Backward compatibility
    if (node.loglevel === 'silent') node.loglevel = 'disable'; // Backward compatibility
    node.sysLogger = null; // 20/03/2022 Default    
    try {
      node.sysLogger = new loggerClass({ loglevel: node.loglevel, setPrefix: node.type + " <" + (node.name || node.id || '') + ">" });
    } catch (error) { console.log(error.stack) }
    node.csv = readCSV(config.csv); // Array from ETS CSV Group Addresses {ga:group address, dpt: datapoint, devicename: full device name with main and subgroups}

    // 12/11/2021 Connect at start delay
    node.autoReconnect = true; // 20/03/2022 Default
    if (config.autoReconnect === "no" || config.autoReconnect === false) {
      node.autoReconnect = false;
    } else {
      node.autoReconnect = true;
    }
    node.ignoreTelegramsWithRepeatedFlag = config.ignoreTelegramsWithRepeatedFlag === undefined ? false : config.ignoreTelegramsWithRepeatedFlag;
    // 24/07/2021 KNX Secure checks...
    node.keyringFileXML = typeof config.keyringFileXML === "undefined" || config.keyringFileXML.trim() === "" ? "" : config.keyringFileXML;
    node.knxSecureSelected = typeof config.knxSecureSelected === "undefined" ? false : config.knxSecureSelected;
    node.name = config.name === undefined || config.name === "" ? node.host : config.name; // 12/08/2021
    node.timerKNXUltimateCheckState = null; // 08/10/2021 Check the state. If not connected and autoreconnect is true, retrig the connetion attempt.
    node.knxConnectionProperties = null; // Retains the connection properties
    node.allowLauch_initKNXConnection = true; // See the node.timerKNXUltimateCheckState function
    node.hostProtocol = config.hostProtocol === undefined ? "Auto" : config.hostProtocol; // 20/03/2022 Default
    node.knxConnection = null; // 20/03/2022 Default
    node.delaybetweentelegrams = (config.delaybetweentelegrams === undefined || config.delaybetweentelegrams === null || config.delaybetweentelegrams === '') ? 25 : Number(config.delaybetweentelegrams);
    if (node.delaybetweentelegrams < 25) node.delaybetweentelegrams = 25; // Protection avoiding handleKNXQueue hangs
    if (node.delaybetweentelegrams > 100) node.delaybetweentelegrams = 100; // Protection avoiding handleKNXQueue hangs
    node.timerSaveExposedGAs = null; // Timer to save the exposed GA every once in a while

    // 05/12/2021 Set the protocol (this is undefined if coming from ild versions
    if (node.hostProtocol === "Auto") {
      // Auto set protocol based on IP
      if (
        node.host.startsWith("224.") ||
        node.host.startsWith("225.") ||
        node.host.startsWith("232.") ||
        node.host.startsWith("233.") ||
        node.host.startsWith("234.") ||
        node.host.startsWith("235.") ||
        node.host.startsWith("239.")
      ) {
        node.hostProtocol = "Multicast";
      } else {
        node.hostProtocol = "TunnelUDP";
      }
      node.sysLogger?.info("IP Protocol AUTO SET to " + node.hostProtocol + ", based on IP " + node.host);
    }


    node.setAllClientsStatus = (_status, _color, _text) => {
      node.nodeClients.forEach((oClient) => {
        try {
          if (oClient.setNodeStatus !== undefined) oClient.setNodeStatus({
            fill: _color,
            shape: "dot",
            text: _status + " " + _text,
            payload: "",
            GA: oClient.topic,
            dpt: "",
            devicename: "",
          });
        } catch (error) {
          node.sysLogger?.warn("Wow setAllClientsStatus error " + error.message);
        }
      });
    };

    //
    // KNX-SECURE
    // 15/11/2021 Function to load the keyring file exported from ETS
    //
    //
    node.jKNXSecureKeyring = null;
    try {
      (async () => {
        if (node.knxSecureSelected) {
          node.jKNXSecureKeyring = await knx.KNXSecureKeyring.keyring.load(node.keyringFileXML, node.credentials.keyringFilePassword);
          RED.log.info(
            "KNX-Secure: Keyring for ETS proj " +
            node.jKNXSecureKeyring.ETSProjectName +
            ", created by " +
            node.jKNXSecureKeyring.ETSCreatedBy +
            " on " +
            node.jKNXSecureKeyring.ETSCreated +
            " succesfully validated with provided password, using node " +
            node.name || node.id,
          );
        } else {
          RED.log.info("KNX-Unsecure: connection to insecure interface/router using node " + node.name || node.id);
        }
      })();
    } catch (error) {
      node.sysLogger?.error("KNX Secure: error parsing the keyring XML: " + error.message);
      node.jKNXSecureKeyring = null;
      node.knxSecureSelected = false;
      const t = setTimeout(() => node.setAllClientsStatus("Error", "red", "KNX Secure " + error.message), 2000); // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
    }

    // 04/04/2021 Supergiovane, creates the service paths where the persistent files are created.
    // The values file is stored only upon disconnection/close
    // ************************
    function setupDirectory(_aPath) {
      if (!fs.existsSync(_aPath)) {
        // Create the path
        try {
          fs.mkdirSync(_aPath);
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return true;
      }
    }
    if (!setupDirectory(node.userDir)) {
      node.sysLogger?.error("Unable to set up MAIN directory: " + node.userDir);
    }
    if (!setupDirectory(path.join(node.userDir, "knxpersistvalues"))) {
      node.sysLogger?.error("Unable to set up cache directory: " + path.join(node.userDir, "knxpersistvalues"));
    } else {
      node.sysLogger?.info("payload cache set to " + path.join(node.userDir, "knxpersistvalues"));
    }

    async function saveExposedGAs() {
      const sFile = path.join(node.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
      try {
        if (node.exposedGAs.length > 0) {
          fs.writeFileSync(sFile, JSON.stringify(node.exposedGAs));
          node.sysLogger?.info("wrote peristent values to the file " + sFile);
        }
      } catch (err) {
        node.sysLogger?.error("unable to write peristent values to the file " + sFile + " " + err.message);
      }
    }
    function loadExposedGAs() {
      const sFile = path.join(node.userDir, "knxpersistvalues", "knxpersist" + node.id + ".json");
      try {
        node.exposedGAs = JSON.parse(fs.readFileSync(sFile, "utf8"));
      } catch (err) {
        node.exposedGAs = [];
        node.sysLogger?.info("unable to read peristent file " + sFile + " " + err.message);
      }
    }

    // ************************



    // 16/02/2020 KNX-Ultimate nodes calls this function, then this funcion calls the same function on the Watchdog
    node.reportToWatchdogCalledByKNXUltimateNode = (_oError) => {
      // _oError is = { nodeid: node.id, topic: node.outputtopic, devicename: devicename, GA: GA, text: text };
      const readHistory = [];
      const delay = 0;
      node.nodeClients
        .filter((_oClient) => _oClient.isWatchDog !== undefined && _oClient.isWatchDog === true)
        .forEach((_oClient) => {
          _oClient.signalNodeErrorCalledByConfigNode(_oError);
        });
    };

    node.addClient = (_Node) => {
      // Check if node already exists
      if (node.nodeClients.filter((x) => x.id === _Node.id).length === 0) {
        // Add _Node to the clients array
        if (node.autoReconnect) {
          _Node.setNodeStatus({
            fill: "grey",
            shape: "ring",
            text: "Node initialized.",
            payload: "",
            GA: "",
            dpt: "",
            devicename: "",
          });
        } else {
          _Node.setNodeStatus({
            fill: "red",
            shape: "ring",
            text: "Autoconnect disabled. Please manually connect.",
            payload: "",
            GA: "",
            dpt: "",
            devicename: "",
          });
        }
        node.nodeClients.push(_Node);
      }
    };

    node.removeClient = async (_Node) => {
      // Remove the client node from the clients array
      try {
        node.nodeClients = node.nodeClients.filter((x) => x.id !== _Node.id);
      } catch (error) { /* empty */ }

      // If no clien nodes, disconnect from bus.
      if (node.nodeClients.length === 0) {
        try {
          await node.Disconnect();
        } catch (error) { /* empty */ }
      }
    };

    // 17/02/2020 Do initial read (called by node.timerDoInitialRead timer)
    function DoInitialReadFromKNXBusOrFile() {
      if (node.linkStatus !== "connected") return; // 29/08/2019 If not connected, exit
      node.sysLogger?.info("Do DoInitialReadFromKNXBusOrFile");
      loadExposedGAs(); // 04/04/2021 load the current values of GA payload
      node.sysLogger?.info("Loaded persist GA values", node.exposedGAs?.length);

      if (node.timerSaveExposedGAs !== null) clearInterval(node.timerSaveExposedGAs);
      node.timerSaveExposedGAs = setInterval(async () => {
        await saveExposedGAs();
      }, 5000);
      node.sysLogger?.info("Started timerSaveExposedGAs with array lenght ", node.exposedGAs?.length);

      try {
        const readHistory = [];

        // First, read from file. This allow all virtual devices to get their values from file.
        node.nodeClients
          .filter((_oClient) => _oClient.initialread === 2 || _oClient.initialread === 3)
          .filter((_oClient) => _oClient.hasOwnProperty("isWatchDog") === false)
          .forEach((_oClient) => {

            if (node.linkStatus !== "connected") return; // 16/08/2021 If not connected, exit

            // 04/04/2020 selected READ FROM FILE 2 or from file then from bus 3
            if (_oClient.listenallga === true) {
              // 13/12/2021 DA FARE
            } else {
              try {
                if (node.exposedGAs.length > 0) {
                  const oExposedGA = node.exposedGAs.find((a) => a.ga === _oClient.topic);
                  if (oExposedGA !== undefined) {
                    // Retrieve the value from exposedGAs
                    const msg = buildInputMessage({
                      _srcGA: "",
                      _destGA: _oClient.topic,
                      _event: "GroupValue_Response",
                      _Rawvalue: Buffer.from(oExposedGA.rawValue.data),
                      _inputDpt: _oClient.dpt,
                      _devicename: _oClient.name ? _oClient.name : "",
                      _outputtopic: _oClient.outputtopic,
                      _oNode: _oClient,
                      _echoed: false
                    });
                    _oClient.previouspayload = ""; // 05/04/2021 Added previous payload
                    _oClient.currentPayload = msg.payload;
                    _oClient.setNodeStatus({
                      fill: "grey",
                      shape: "dot",
                      text: "Update value from persist file",
                      payload: _oClient.currentPayload,
                      GA: _oClient.topic,
                      dpt: _oClient.dpt,
                      devicename: _oClient.name || "",
                    });
                    // 06/05/2021 If, after the rawdata has been savad to file, the user changes the datapoint, the buildInputMessage returns payload null, because it's unable to convert the value
                    if (msg.payload === null) {
                      // Delete the exposedGA
                      node.exposedGAs = node.exposedGAs.filter((item) => item.ga !== _oClient.topic);
                      _oClient.setNodeStatus({
                        fill: "yellow",
                        shape: "dot",
                        text: "Datapoint has been changed, remove the value from persist file",
                        payload: _oClient.currentPayload,
                        GA: _oClient.topic,
                        dpt: _oClient.dpt,
                        devicename: _oClient.devicename || "",
                      });
                      node.sysLogger?.error("DoInitialReadFromKNXBusOrFile: Datapoint may have been changed, remove the value from persist file of " + _oClient.topic + " Devicename " + _oClient.name + " Currend DPT " + _oClient.dpt + " Node.id " + _oClient.id);
                    } else {
                      if (_oClient.notifyresponse) _oClient.handleSend(msg);
                    }
                  } else {
                    if (_oClient.initialread === 3) {
                      // Not found, issue a READ to the bus
                      if (!readHistory.includes(_oClient.topic)) {
                        node.sysLogger?.debug("DoInitialReadFromKNXBusOrFile 3: sent read request to GA " + _oClient.topic);
                        _oClient.setNodeStatus({
                          fill: "grey",
                          shape: "dot",
                          text: "Persist value not found, issuing READ request to BUS",
                          payload: _oClient.currentPayload,
                          GA: _oClient.topic,
                          dpt: _oClient.dpt,
                          devicename: _oClient.devicename || "",
                        });
                        node.sendKNXTelegramToKNXEngine({
                          grpaddr: _oClient.topic,
                          payload: "",
                          dpt: "",
                          outputtype: "read",
                          nodecallerid: _oClient.id,
                        });
                        readHistory.push(_oClient.topic);
                      }
                    }
                  }
                }
              } catch (error) {
                node.sysLogger?.error("DoInitialReadFromKNXBusOrFile: " + error.stack);
              }
            }
          });

        // Then, after all values have been read from file, read from BUS
        // This allow the virtual devices to get their values before this will be readed from bus
        node.nodeClients
          .filter((_oClient) => _oClient.initialread === 1)
          .filter((_oClient) => _oClient.hasOwnProperty("isWatchDog") === false)
          .forEach((_oClient) => {

            if (node.linkStatus !== "connected") return; // 16/08/2021 If not connected, exit

            // 04/04/2020 selected READ FROM BUS 1
            if (_oClient.hasOwnProperty("isalertnode") && _oClient.isalertnode) {
              _oClient.initialReadAllDevicesInRules();
            } else if (_oClient.hasOwnProperty("isLoadControlNode") && _oClient.isLoadControlNode) {
              _oClient.initialReadAllDevicesInRules();
            } else if (_oClient.listenallga === true) {
              for (let index = 0; index < node.csv.length; index++) {
                const element = node.csv[index];
                if (!readHistory.includes(element.ga)) {
                  node.sendKNXTelegramToKNXEngine({
                    grpaddr: element.ga,
                    payload: "",
                    dpt: "",
                    outputtype: "read",
                    nodecallerid: element.id,
                  });
                  readHistory.push(element.ga);
                  node.sysLogger?.debug("DoInitialReadFromKNXBusOrFile from Universal Node: sent read request to GA " + element.ga);
                }
              }
            } else {
              if (!readHistory.includes(_oClient.topic)) {
                node.sendKNXTelegramToKNXEngine({
                  grpaddr: _oClient.topic,
                  payload: "",
                  dpt: "",
                  outputtype: "read",
                  nodecallerid: _oClient.id,
                });
                readHistory.push(_oClient.topic);
                node.sysLogger?.debug("DoInitialReadFromKNXBusOrFile: sent read request to GA " + _oClient.topic);
              }
            }
          });
      } catch (error) { }
    }

    // 01/02/2020 Dinamic change of the KNX Gateway IP, Port and Physical Address
    // This new thing has been requested by proServ RealKNX staff.
    node.setGatewayConfig = async (
      /** @type {string} */ _sIP,
      /** @type {number} */ _iPort,
      /** @type {string} */ _sPhysicalAddress,
      /** @type {string} */ _sBindToEthernetInterface,
      /** @type {string} */ _Protocol,
      /** @type {string} */ _CSV,
    ) => {
      if (typeof _sIP !== "undefined" && _sIP !== "") node.host = _sIP;
      if (typeof _iPort !== "undefined" && _iPort !== 0) node.port = _iPort;
      if (typeof _sPhysicalAddress !== "undefined" && _sPhysicalAddress !== "") node.physAddr = _sPhysicalAddress;
      if (typeof _sBindToEthernetInterface !== "undefined") node.KNXEthInterface = _sBindToEthernetInterface;
      if (typeof _Protocol !== "undefined") node.hostProtocol = _Protocol;
      if (typeof _CSV !== "undefined" && _CSV !== "") {
        try {
          const sTemp = readCSV(_CSV); // 27/09/2022 Set the new CSV
          node.csv = sTemp;
        } catch (error) {
          node.sysLogger?.info("Node's main config setting error. " + error.message || "");
        }
      }

      node.sysLogger?.info(
        "Node's main config setting has been changed. New config: IP " +
        node.host +
        " Port " +
        node.port +
        " PhysicalAddress " +
        node.physAddr +
        " BindToInterface " +
        node.KNXEthInterface +
        (typeof _CSV !== "undefined" && _CSV !== "" ? ". A new group address CSV has been imported." : ""),
      );

      try {
        await node.Disconnect();
        // node.setKnxConnectionProperties(); // 28/12/2021 Commented
        node.setAllClientsStatus("CONFIG", "yellow", "KNXUltimage-config:setGatewayConfig: disconnected by new setting...");
        node.sysLogger?.debug("KNXUltimage-config:setGatewayConfig: disconnected by setGatewayConfig.");
      } catch (error) { }
    };

    // 05/05/2021 force connection or disconnection from the KNX BUS and disable the autoreconenctions attempts.
    // This new thing has been requested by proServ RealKNX staff.
    node.connectGateway = async (_bConnection) => {
      if (_bConnection === undefined) return;
      node.sysLogger?.info(
        (_bConnection === true ? "Forced connection from watchdog" : "Forced disconnection from watchdog") +
        node.host +
        " Port " +
        node.port +
        " PhysicalAddress " +
        node.physAddr +
        " BindToInterface " +
        node.KNXEthInterface,
      );
      if (_bConnection === true) {
        // CONNECT AND ENABLE RECONNECTION ATTEMPTS
        try {
          await node.Disconnect();
          node.setAllClientsStatus("CONFIG", "yellow", "Forced GW connection from watchdog.");
          node.autoReconnect = true;
        } catch (error) { }
      } else {
        // DISCONNECT AND DISABLE RECONNECTION ATTEMPTS
        try {
          node.autoReconnect = false;
          await node.Disconnect();
          const t = setTimeout(() => {
            // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
            node.setAllClientsStatus("CONFIG", "yellow", "Forced GW disconnection and stop reconnection attempts, from watchdog.");
          }, 2000);
        } catch (error) { }
      }
    };

    // 08/10/2021
    // node.knxConnectionProperties must be:
    // const optionsDefaults = {
    //     physAddr: '15.15.200',
    //     connectionKeepAliveTimeout: KNXConstants.KNX_CONSTANTS.CONNECTION_ALIVE_TIME,
    //     ipAddr: "224.0.23.12",
    //     ipPort: 3671,
    //     hostProtocol: "TunnelUDP", // TunnelUDP, TunnelTCP, Multicast
    //     isSecureKNXEnabled: false,
    //     suppress_ack_ldatareq: false,
    //     loglevel: "info",
    //     localEchoInTunneling: true,
    //     localIPAddress: "",
    //     jKNXSecureKeyring: node.jKNXSecureKeyring
    //     interface: "",
    //     KNXQueueSendIntervalMilliseconds: Number(node.delaybetweentelegrams)
    // };

    node.setKnxConnectionProperties = () => {
      // 25/08/2021 Moved out of node.initKNXConnection
      node.knxConnectionProperties = {
        ipAddr: node.host,
        ipPort: node.port,
        physAddr: node.physAddr, // the KNX physical address we'd like to use
        suppress_ack_ldatareq: node.suppressACKRequest,
        loglevel: node.loglevel,
        localEchoInTunneling: node.localEchoInTunneling, // 14/03/2020 local echo in tunneling mode (see API Supergiovane)
        hostProtocol: node.hostProtocol,
        isSecureKNXEnabled: node.knxSecureSelected,
        jKNXSecureKeyring: node.jKNXSecureKeyring,
        localIPAddress: "", // Riempito da KNXEngine
        KNXQueueSendIntervalMilliseconds: Number(node.delaybetweentelegrams),
        connectionKeepAliveTimeout: 30 // Every 30 seconds, send a connectionstatus_request
      };
      // 11/07/2022 Test if the IP is a valid one or is a DNS Name
      switch (net.isIP(node.host)) {
        case 0:
          // Invalid IP, resolve the DNS name.
          const dns = require("dns-sync");
          let resolvedIP = null;
          try {
            resolvedIP = dns.resolve(node.host);
          } catch (error) {
            throw new Error("net.isIP: INVALID IP OR DNS NAME. Error checking the Gateway Host in Config node. " + error.message);
          }
          if (resolvedIP === null || net.isIP(resolvedIP) === 0) {
            // Error in resolving DNS Name
            node.sysLogger?.error(
              "net.isIP: INVALID IP OR DNS NAME. Check the Gateway Host in Config node " + node.name + " " + node.host,
            );
            throw new Error("net.isIP: INVALID IP OR DNS NAME. Check the Gateway Host in Config node.");
          }
          node.sysLogger?.info(
            "net.isIP: The gateway is not specified as IP. The DNS resolver pointed me to the IP " +
            node.host +
            ", in Config node " +
            node.name,
          );
          node.knxConnectionProperties.ipAddr = resolvedIP;
        case 4:
          // It's an IPv4
          break;
        case 6:
          // It's an IPv6
          break;
        default:
          break;
      }

      if (node.KNXEthInterface !== "Auto") {
        let sIfaceName = "";
        if (node.KNXEthInterface === "Manual") {
          sIfaceName = node.KNXEthInterfaceManuallyInput;
          node.sysLogger?.info("Bind KNX Bus to interface : " + sIfaceName + " (Interface's name entered by hand). Node " + node.name);
        } else {
          sIfaceName = node.KNXEthInterface;
          node.sysLogger?.info(
            "Bind KNX Bus to interface : " + sIfaceName + " (Interface's name selected from dropdown list). Node " + node.name,
          );
        }
        node.knxConnectionProperties.interface = sIfaceName;
      } else {
        // 08/10/2021 Delete the interface
        try {
          delete node.knxConnectionProperties.interface;
        } catch (error) { }
        node.sysLogger?.info("Bind KNX Bus to interface (Auto). Node " + node.name);
      }
    };
    // node.setKnxConnectionProperties(); 28/12/2021 Commented

    node.initKNXConnection = async () => {
      try {
        node.setKnxConnectionProperties(); // 28/12/2021 Added
      } catch (error) {
        node.sysLogger?.error("setKnxConnectionProperties: " + error.message);
        if (node.linkStatus !== "disconnected") await node.Disconnect();
        return;
      }

      // 12/08/2021 Avoid start connection if there are no knx-ultimate nodes linked to this gateway
      // At start, initKNXConnection is already called only if the gateway has clients, but in the successive calls from the error handler, this check is not done.
      if (node.nodeClients.length === 0) {
        try {
          node.sysLogger?.info("No nodes linked to this gateway " + node.name);
          try {
            if (node.linkStatus !== "disconnected") await node.Disconnect();
          } catch (error) { }
          return;
        } catch (error) { }
      }

      try {
        // 02/01/2022 This is important to free the tunnel in case of hard disconnection.
        await node.Disconnect();
      } catch (error) {
        // node.sysLogger?.info(error)
      }

      try {
        // Unsetting handlers if node.knxConnection was existing
        try {
          if (node.knxConnection !== null && node.knxConnection !== undefined) {
            await node.knxConnection.Disconnect();
            node.sysLogger?.debug("removing old handlers. Node " + node.name);
            node.knxConnection.removeAllListeners();
          }
        } catch (error) {
          node.sysLogger?.info("BANANA ERRORINO", error);
        }

        //node.knxConnectionProperties.localSocketAddress = { address: '192.168.2.2', port: 59000 }
        node.knxConnection = new knx.KNXClient(node.knxConnectionProperties);

        // Setting handlers
        // ######################################
        node.knxConnection.on(knx.KNXClientEvents.indication, handleBusEvents);
        node.knxConnection.on(knx.KNXClientEvents.error, (err) => {
          try {
            node.sysLogger?.error("received KNXClientEvents.error: " + (err.message === undefined ? err : err.message));
          } catch (error) {
          }
          // 31/03/2022 Don't care about some errors
          if (err.message !== undefined && (err.message === "ROUTING_LOST_MESSAGE" || err.message === "ROUTING_BUSY")) {
            node.sysLogger?.error(
              "KNXClientEvents.error: " +
              (err.message === undefined ? err : err.message) +
              " consider DECREASING the transmission speed, by increasing the telegram's DELAY in the gateway configuration node!",
            );
            return;
          }
          node.Disconnect("Disconnected by error " + (err.message === undefined ? err : err.message), "red");
          node.sysLogger?.error("Disconnected by: " + (err.message === undefined ? err : err.message));
        });

        node.knxConnection.on(knx.KNXClientEvents.disconnected, (info) => {
          if (node.linkStatus !== "disconnected") {
            node.linkStatus = "disconnected";
            node.sysLogger?.warn("Disconnected event %s", info);
            node.Disconnect("Disconnected by event: " + info || "", "red"); // 11/03/2022
          }
        });
        node.knxConnection.on(knx.KNXClientEvents.close, (info) => {
          node.sysLogger?.debug("KNXClient socket closed.");
          node.linkStatus = "disconnected";
        });
        node.knxConnection.on(knx.KNXClientEvents.connected, (info) => {

          node.linkStatus = "connected";

          // Start the timer to do initial read.
          if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead);
          node.timerDoInitialRead = setTimeout(() => {
            try {
              DoInitialReadFromKNXBusOrFile();
            } catch (error) {
              node.sysLogger?.error("DoInitialReadFromKNXBusOrFile " + error.stack);
            }
          }, 1000); // 17/02/2020 Do initial read of all nodes requesting initial read
          const t = setTimeout(() => {
            // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
            node.setAllClientsStatus("Connected.", "green", "On duty.");
          }, 500);
          node.sysLogger?.info("Connected to %o", info);
        });
        node.knxConnection.on(knx.KNXClientEvents.connecting, (info) => {
          node.linkStatus = "connecting";
          node.sysLogger?.debug("Connecting to" + info.ipAddr || "");
          node.setAllClientsStatus(info.ipAddr || "", "grey", "Connecting...");
        });
        // ######################################

        node.setAllClientsStatus("Connecting... ", "grey", "");
        node.sysLogger?.info("perform websocket connection on " + node.name);
        try {
          node.sysLogger?.info("Connecting... " + node.name);
          node.knxConnection.Connect();
        } catch (error) {
          node.sysLogger?.error("node.knxConnection.Connect() " + node.name + ": " + error.message);
          node.linkStatus = "disconnected";
          throw error;
        }
      } catch (error) {
        if (node.sysLogger !== null) {
          node.sysLogger.error("Error in instantiating knxConnection " + error.stack + " Node " + node.name);
          node.error("KNXUltimate-config: Error in instantiating knxConnection " + error.message + " Node " + node.name);
        }
        node.linkStatus = "disconnected";
        // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
        const t = setTimeout(() => node.setAllClientsStatus("Error in instantiating knxConnection " + error.message, "red", "Error"), 200);
      }
    };

    // Handle BUS events
    // ---------------------------------------------------------------------------------------
    function handleBusEvents(_datagram, _echoed) {
      // console.time('handleBusEvents');

      let _rawValue = null;
      try {
        _rawValue = _datagram.cEMIMessage.npdu.dataValue;
      } catch (error) {
        return;
      }

      let _evt = null;
      if (_datagram.cEMIMessage.npdu.isGroupRead) _evt = "GroupValue_Read";
      if (_datagram.cEMIMessage.npdu.isGroupResponse) _evt = "GroupValue_Response";
      if (_datagram.cEMIMessage.npdu.isGroupWrite) _evt = "GroupValue_Write";

      let _src = null;
      _src = _datagram.cEMIMessage.srcAddress.toString();

      let _dest = null;
      _dest = _datagram.cEMIMessage.dstAddress.toString();

      _echoed = _echoed || false;

      const isRepeated = _datagram.cEMIMessage.control.repeat !== 1;
      // 06/06/2021 Supergiovane: check if i can handle the telegrams with "Repeated" flag
      if (node.ignoreTelegramsWithRepeatedFlag === true && isRepeated) {
        node.sysLogger?.warn("Ignored telegram with Repeated Flag " + _evt + " Src:" + _src + " Dest:" + _dest);
        return;
      }

      // 23/03/2021 Supergiovane: Added the CEMI telegram for ETS Diagnostic
      // #####################################################################
      let _cemiETS = "";
      if (_echoed) {
        // I'm sending a telegram to the BUS in Tunneling mode, with echo enabled.
        // Tunnel: TX to BUS: OK
        try {
          const sCemiFromDatagram = _datagram.cEMIMessage.toBuffer().toString("hex");
          _cemiETS = "2900BCD0" + sCemiFromDatagram.substr(8);
        } catch (error) {
          _cemiETS = "";
        }
      } else {
        try {
          // Multicast: RX from BUS: OK
          // Multicast TX to BUS: OK
          // Tunnel: RX from BUS: OK
          // Tunnel: TX to BUS: see the _echoed above
          _cemiETS = _datagram.cEMIMessage.toBuffer().toString("hex");
        } catch (error) {
          _cemiETS = "";
        }
      }
      // #####################################################################

      // 04/04/2021 Supergiovane: save value to node.exposedGAs
      if (typeof _dest === "string" && _rawValue !== undefined && (_evt === "GroupValue_Write" || _evt === "GroupValue_Response")) {
        try {
          const ret = { ga: _dest, rawValue: _rawValue, dpt: undefined, devicename: undefined };
          node.exposedGAs = node.exposedGAs.filter((item) => item.ga !== _dest); // Remove previous
          if (node.csv !== undefined && node.csv !== '' && node.csv.length !== 0) {
            // Add the dpt
            const found = node.csv.find(a => a.ga === _dest);
            if (found !== undefined) {
              ret.dpt = found.dpt;
              ret.devicename = found.devicename;
            }
          }
          node.exposedGAs.push(ret); // add the new
        } catch (error) { }
      }

      switch (_evt) {
        case "GroupValue_Write":
          // console.time('GroupValue_Write'); // 05/04/2022 Fatto test velocità tra for..loop e forEach. E' risultato sempre comunque più veloce il forEach!
          node.nodeClients
            .filter((_input) => _input.notifywrite === true)
            .forEach((_input) => {

              // 21/10/2024 check wether is a HUE device
              if (_input.type.includes('knxUltimateHue')) {
                const msg = {
                  knx: {
                    event: _evt,
                    destination: _dest,
                    rawValue: _rawValue,
                  }
                };
                _input.handleSend(msg);
              } else if (_input.hasOwnProperty("isSceneController")) {// 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
                // 12/08/2020 Check wether is a learn (save) command or a activate (play) command.
                if (_dest === _input.topic || _dest === _input.topicSave) {
                  // Prepare the two messages to be evaluated directly into the Scene Controller node.
                  new Promise((resolve) => {
                    if (_dest === _input.topic) {
                      try {
                        const msgRecall = buildInputMessage({
                          _srcGA: _src,
                          _destGA: _dest,
                          _event: _evt,
                          _Rawvalue: _rawValue,
                          _inputDpt: _input.dpt,
                          _devicename: _input.name ? _input.name : "",
                          _outputtopic: _input.outputtopic,
                          _oNode: null,
                          _echoed: _echoed
                        });
                        _input.RecallScene(msgRecall.payload, false);
                      } catch (error) { }
                    } // 12/08/2020 Do NOT use "else", because both topics must be evaluated in case both recall and save have same group address.
                    if (_dest === _input.topicSave) {
                      try {
                        const msgSave = buildInputMessage({
                          _srcGA: _src,
                          _destGA: _dest,
                          _event: _evt,
                          _Rawvalue: _rawValue,
                          _inputDpt: _input.dptSave,
                          _devicename: _input.name || "",
                          _outputtopic: _dest,
                          _oNode: null,
                          _echoed: _echoed
                        });
                        _input.SaveScene(msgSave.payload, false);
                      } catch (error) { }
                    }
                    resolve(true); // fulfilled
                    // reject("error"); // rejected
                  })
                    .then(function () { })
                    .catch(function () { });
                } else {
                  // 19/03/2020 Check and Update value if the input is part of a scene controller
                  new Promise((resolve) => {
                    // Check and update the values of each device in the scene and update the rule array accordingly.
                    for (let i = 0; i < _input.rules.length; i++) {
                      // rule is { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}
                      const oDevice = _input.rules[i];
                      if (typeof oDevice !== "undefined" && oDevice.topic == _dest) {
                        const msg = buildInputMessage({
                          _srcGA: _src,
                          _destGA: _dest,
                          _event: _evt,
                          _Rawvalue: _rawValue,
                          _inputDpt: oDevice.dpt,
                          _devicename: oDevice.name || "",
                          _outputtopic: oDevice.outputtopic,
                          _oNode: null,
                          _echoed: _echoed
                        });
                        oDevice.currentPayload = msg.payload;
                        _input.setNodeStatus({
                          fill: "grey",
                          shape: "dot",
                          text: "Update dev in scene",
                          payload: oDevice.currentPayload,
                          GA: oDevice.topic,
                          dpt: oDevice.dpt,
                          devicename: oDevice.devicename || "",
                        });
                        break;
                      }
                    }
                    resolve(true); // fulfilled
                    // reject("error"); // rejected
                  })
                    .then(function () { })
                    .catch(function () { });
                }
              } else if (_input.hasOwnProperty("isLogger")) {
                // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node
                // 24/03/2021 Logger Node, i'll pass cemiETS
                if (_cemiETS !== undefined) {
                  // new Promise((resolve, reject) => {
                  _input.handleSend(_cemiETS);
                  //    resolve(true); // fulfilled
                  // reject("error"); // rejected
                  // }).then(function () { }).catch(function () { });
                }

              } else if (_input.listenallga === true) {
                // 25/10/2019 TRY TO AUTO DECODE IF Group address not found in the CSV
                const msg = buildInputMessage({
                  _srcGA: _src,
                  _destGA: _dest,
                  _event: _evt,
                  _Rawvalue: _rawValue,
                  _outputtopic: _dest,
                  _oNode: _input,
                  _echoed: _echoed
                });
                _input.setNodeStatus({
                  fill: "green",
                  shape: "dot",
                  text: "",
                  payload: msg.payload,
                  GA: msg.knx.destination,
                  dpt: msg.knx.dpt,
                  devicename: msg.devicename,
                });
                _input.handleSend(msg);
              } else if (_input.topic == _dest) {
                if (_input.hasOwnProperty("isWatchDog")) {
                  // 04/02/2020 Watchdog implementation
                  // Is a watchdog node
                } else {
                  const msg = buildInputMessage({
                    _srcGA: _src,
                    _destGA: _dest,
                    _event: _evt,
                    _Rawvalue: _rawValue,
                    _inputDpt: _input.dpt,
                    _devicename: _input.name ? _input.name : "",
                    _outputtopic: _input.outputtopic,
                    _oNode: _input,
                    _echoed: _echoed
                  });
                  // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                  if (!checkRBEInputFromKNXBusAllowSend(_input, msg.payload)) {
                    _input.setNodeStatus({
                      fill: "grey",
                      shape: "ring",
                      text: "rbe block (" + msg.payload + ") from KNX",
                      payload: "",
                      GA: "",
                      dpt: "",
                      devicename: "",
                    });
                    return;
                  }
                  msg.previouspayload = typeof _input.currentPayload !== "undefined" ? _input.currentPayload : ""; // 24/01/2020 Added previous payload
                  _input.currentPayload = msg.payload; // Set the current value for the RBE input
                  _input.setNodeStatus({
                    fill: "green",
                    shape: "dot",
                    text: "",
                    payload: msg.payload,
                    GA: _input.topic,
                    dpt: _input.dpt,
                    devicename: "",
                  });
                  _input.handleSend(msg);
                }
              }
            });
          // console.timeEnd('GroupValue_Write');
          break;

        case "GroupValue_Response":
          node.nodeClients
            .filter((_input) => _input.notifyresponse === true)
            .forEach((_input) => {

              if (_input.hasOwnProperty("isLogger")) {
                // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node
                // 24/03/2021 Logger Node, i'll pass cemiETS
                if (_cemiETS !== undefined) {
                  // new Promise((resolve, reject) => {
                  _input.handleSend(_cemiETS);
                  //    resolve(true); // fulfilled
                  // reject("error"); // rejected
                  // }).then(function () { }).catch(function () { });
                }
              } else if (_input.listenallga === true) {

                const msg = buildInputMessage({
                  _srcGA: _src,
                  _destGA: _dest,
                  _event: _evt,
                  _Rawvalue: _rawValue,
                  _outputtopic: _dest,
                  _oNode: _input,
                  _echoed: _echoed
                });
                _input.setNodeStatus({
                  fill: "blue",
                  shape: "dot",
                  text: "",
                  payload: msg.payload,
                  GA: msg.knx.destination,
                  dpt: msg.knx.dpt,
                  devicename: msg.devicename,
                });
                _input.handleSend(msg);
              } else if (_input.topic === _dest) {
                // 04/02/2020 Watchdog implementation
                if (_input.hasOwnProperty("isWatchDog")) {
                  // Is a watchdog node
                  _input.watchDogTimerReset();
                } else {
                  const msg = buildInputMessage({
                    _srcGA: _src,
                    _destGA: _dest,
                    _event: _evt,
                    _Rawvalue: _rawValue,
                    _inputDpt: _input.dpt,
                    _devicename: _input.name ? _input.name : "",
                    _outputtopic: _input.outputtopic,
                    _oNode: _input,
                    _echoed: _echoed
                  });
                  // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                  if (!checkRBEInputFromKNXBusAllowSend(_input, msg.payload)) {
                    _input.setNodeStatus({
                      fill: "grey",
                      shape: "ring",
                      text: "rbe INPUT filter applied on " + msg.payload,
                      payload: msg.payload,
                      GA: _dest,
                    });
                    return;
                  }
                  msg.previouspayload = typeof _input.currentPayload !== "undefined" ? _input.currentPayload : ""; // 24/01/2020 Added previous payload
                  _input.currentPayload = msg.payload; // Set the current value for the RBE input
                  _input.setNodeStatus({
                    fill: "blue",
                    shape: "dot",
                    text: "",
                    payload: msg.payload,
                    GA: _input.topic,
                    dpt: msg.knx.dpt,
                    devicename: msg.devicename,
                  });
                  _input.handleSend(msg);
                }
              }
            });
          break;

        case "GroupValue_Read":
          node.nodeClients
            .filter((_input) => _input.notifyreadrequest === true)
            .forEach((_input) => {

              if (_input.hasOwnProperty("isLogger")) {
                // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node
                // node.sysLogger?.info("BANANA isLogger", _evt, _src, _dest, _rawValue, _cemiETS);
                // 24/03/2021 Logger Node, i'll pass cemiETS
                if (_cemiETS !== undefined) {
                  // new Promise((resolve, reject) => {
                  _input.handleSend(_cemiETS);
                  //    resolve(true); // fulfilled
                  // reject("error"); // rejected
                  // }).then(function () { }).catch(function () { });
                }
              } else if (_input.listenallga === true) {

                // Read Request
                const msg = buildInputMessage({
                  _srcGA: _src,
                  _destGA: _dest,
                  _event: _evt,
                  _Rawvalue: null,
                  _outputtopic: _dest,
                  _oNode: _input,
                  _echoed: _echoed
                });
                _input.setNodeStatus({
                  fill: "grey",
                  shape: "dot",
                  text: "Read",
                  payload: "",
                  GA: msg.knx.destination,
                  dpt: msg.knx.dpt,
                  devicename: msg.devicename,
                });
                _input.handleSend(msg);
              } else if (_input.topic === _dest) {
                // 04/02/2020 Watchdog implementation
                if (_input.hasOwnProperty("isWatchDog")) {
                  // Is a watchdog node
                } else {
                  // Read Request
                  const msg = buildInputMessage({
                    _srcGA: _src,
                    _destGA: _dest,
                    _event: _evt,
                    _Rawvalue: null,
                    _inputDpt: _input.dpt,
                    _devicename: _input.name || "",
                    _outputtopic: _input.outputtopic,
                    _oNode: _input,
                    _echoed: _echoed
                  });
                  msg.previouspayload = typeof _input.currentPayload !== "undefined" ? _input.currentPayload : ""; // 24/01/2020 Reset previous payload
                  // 24/09/2019 Autorespond to BUS
                  if (_input.hasOwnProperty("notifyreadrequestalsorespondtobus") && _input.notifyreadrequestalsorespondtobus === true) {
                    if (typeof _input.currentPayload === "undefined" || _input.currentPayload === "" || _input.currentPayload === null) {
                      // 14/08/2021 Added || input.currentPayload === null
                      node.sendKNXTelegramToKNXEngine({
                        grpaddr: _dest,
                        payload: _input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized,
                        dpt: _input.dpt,
                        outputtype: "response",
                        nodecallerid: _input.id,
                      });
                      _input.setNodeStatus({
                        fill: "blue",
                        shape: "ring",
                        text: "Read & Autorespond with default",
                        payload: _input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized,
                        GA: _input.topic,
                        dpt: msg.knx.dpt,
                        devicename: "",
                      });
                    } else {
                      node.sendKNXTelegramToKNXEngine({
                        grpaddr: _dest,
                        payload: _input.currentPayload,
                        dpt: _input.dpt,
                        outputtype: "response",
                        nodecallerid: _input.id,
                      });
                      _input.setNodeStatus({
                        fill: "blue",
                        shape: "ring",
                        text: "Read & Autorespond with default",
                        payload: _input.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized,
                        GA: _input.topic,
                        dpt: msg.knx.dpt,
                        devicename: "",
                      });
                    }
                  } else {
                    _input.setNodeStatus({
                      fill: "grey",
                      shape: "dot",
                      text: "Read",
                      payload: msg.payload,
                      GA: _input.topic,
                      dpt: msg.knx.dpt,
                      devicename: "",
                    });
                  }
                  _input.handleSend(msg);
                }
              }
            });
          break;

        default:
          return;
      }
      // console.timeEnd('handleBusEvents');
    }
    // END Handle BUS events---------------------------------------------------------------------------------------

    // oKNXMessage is { grpaddr, payload,dpt,outputtype (write or response),nodecallerid (node caller)}. 06/03/2020 "Read" request does have the lower priority in the queue, so firstly, i search for "read" telegrams and i move it on the top of the queue pile.
    node.sendKNXTelegramToKNXEngine = (_oKNXMessage) => {
      if (node.knxConnection === null || node.linkStatus !== "connected") return;

      // 26/12/2021 The KNXEngine is busy waiting for telegram's ACK. Strange.
      if (!node.knxConnection.clearToSend) {
        node.sysLogger?.warn(
          "sendKNXTelegramToKNXEngine: the KNXEngine is busy or is waiting for a telegram ACK with seqNumner " +
          node.knxConnection.getCurrentItemHandledByTheQueue() +
          ". Delay handling queue.",
        );
      }


      // 19/01/2023 FORMATTING THE OUTPUT PAYLOAD (ROUND, ETC) BASED ON THE NODE CONFIG
      //* ********************************************************
      if (_oKNXMessage.outputtype === "read") {
        try {
          _oKNXMessage.payload = payloadRounder.Manipulate(RED.nodes.getNode(_oKNXMessage.nodecallerid), _oKNXMessage.payload);
        } catch (error) {
          node.sysLogger?.error(
            "sendKNXTelegramToKNXEngine: Sacripante Manipulate payload: " + error.message
          );
        }

      }
      //* ********************************************************

      if (_oKNXMessage.outputtype === "response") {
        try {
          node.knxConnection.respond(_oKNXMessage.grpaddr, _oKNXMessage.payload, _oKNXMessage.dpt);
        } catch (error) {
          try {
            const oNode = RED.nodes.getNode(_oKNXMessage.nodecallerid); // 05/04/2022 Get the real node
            oNode.setNodeStatus({
              fill: "red",
              shape: "dot",
              text: "Send response " + error,
              payload: _oKNXMessage.payload,
              GA: _oKNXMessage.grpaddr,
              dpt: _oKNXMessage.dpt,
              devicename: "",
            });
          } catch (error) { }
        }
      } else if (_oKNXMessage.outputtype === "read") {
        try {
          node.knxConnection.read(_oKNXMessage.grpaddr);
        } catch (error) { }
      } else if (_oKNXMessage.outputtype === "update") {
        // 05/01/2021 Update don't send anything to the bus, but instead updates the values of all nodes belonging to the group address passed
        // oKNXMessage = {
        //     grpaddr: '5/0/1',
        //     payload: true,
        //     dpt: '1.001',
        //     outputtype: 'update',
        //     nodecallerid: 'd104af91.31da18'
        //   }
        try {
          node.nodeClients.forEach((_input) => {

            // 19/03/2020 in the middle of coronavirus. Whole italy is red zone, closed down. Scene Controller implementation
            if (_input.hasOwnProperty("isSceneController")) {
            } else if (_input.hasOwnProperty("isLogger")) {
              // 26/03/2020 Coronavirus is slightly decreasing the affected numer of people. Logger Node
            } else if (_input.listenallga === true) {
            } else if (_input.topic == _oKNXMessage.grpaddr) {
              if (_input.hasOwnProperty("isWatchDog")) {
                // 04/02/2020 Watchdog implementation
                // Is a watchdog node
              } else {
                const msg = {
                  topic: _input.outputtopic,
                  payload: _oKNXMessage.payload,
                  devicename: _input.name ? _input.name : "",
                  event: "Update_NoWrite",
                  eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
                };
                // Check RBE INPUT from KNX Bus, to avoid send the payload to the flow, if it's equal to the current payload
                if (!checkRBEInputFromKNXBusAllowSend(_input, msg.payload)) {
                  _input.setNodeStatus({
                    fill: "grey",
                    shape: "ring",
                    text: "rbe block (" + msg.payload + ") from KNX",
                    payload: "",
                    GA: "",
                    dpt: "",
                    devicename: "",
                  });
                  return;
                }
                msg.previouspayload = typeof _input.currentPayload !== "undefined" ? _input.currentPayload : ""; // 24/01/2020 Added previous payload
                _input.currentPayload = msg.payload; // Set the current value for the RBE input
                _input.setNodeStatus({
                  fill: "green",
                  shape: "dot",
                  text: "",
                  payload: msg.payload,
                  GA: _input.topic,
                  dpt: _input.dpt,
                  devicename: "",
                });
                _input.handleSend(msg);
              }
            }
          });
        } catch (error) { }
      } else {
        // Write
        try {
          node.knxConnection.write(_oKNXMessage.grpaddr, _oKNXMessage.payload, _oKNXMessage.dpt);
        } catch (error) {
          try {
            const oNode = RED.nodes.getNode(_oKNXMessage.nodecallerid); // 05/04/2022 Get the real node
            node.sysLogger?.error(
              "node.knxConnection.write: Payload: " + _oKNXMessage.payload + " GA:" + _oKNXMessage.grpaddr + " DPT:" + _oKNXMessage.dpt + " " + error.stack
            );
            oNode.setNodeStatus({
              fill: "red",
              shape: "dot",
              text: "Send write " + error,
              payload: _oKNXMessage.payload,
              GA: _oKNXMessage.grpaddr,
              dpt: _oKNXMessage.dpt,
              devicename: "",
            });
          } catch (error) { }
        }
      }
    }


    // 14/08/2019 If the node has payload same as the received telegram, return false
    function checkRBEInputFromKNXBusAllowSend(_node, _KNXTelegramPayload) {
      if (_node.inputRBE !== "true") return true;

      return !_.isEqual(_node.currentPayload, _KNXTelegramPayload);
    }

    // 26/10/2019 Try to figure out the datapoint type from raw value
    function tryToFigureOutDataPointFromRawValue(_rawValue) {
      // 25/10/2019 Try some Datapoints
      if (_rawValue === null) return "1.001";
      if (_rawValue.length === 1) {
        if (_rawValue[0].toString() == "0" || _rawValue[0].toString() == "1") {
          return "1.001"; // True/False?
        } else {
          return "5.001"; // Absolute Brightness ?
        }
      } else if (_rawValue.length == 4) {
        return "14.056"; // Watt ?
      } else if (_rawValue.length == 2) {
        return "9.001";
      } else if (_rawValue.length == 3) {
        return "11.001";
      } else if (_rawValue.length == 14) {
        return "16.001"; // Text ?
      } else {
        // Dont' know, try until no errors
        const dpts = Object.entries(dptlib).filter(onlyDptKeys).map(extractBaseNo).sort(sortBy("base")).reduce(toConcattedSubtypes, []);
        for (let index = 0; index < dpts.length; index++) {
          const element = dpts[index];
          try {
            // dpt.value)
            // dpt.text))
            const dpt = dptlib.resolve(element.value);
            if (typeof dpt !== "undefined") {
              const jsValue = dptlib.fromBuffer(_rawValue, dpt);
              if (typeof jsValue !== "undefined") {
                // node.sysLogger?.info("Trying for " + dest + ". FOUND " + element.value);
                return element.value;
              }
            }
          } catch (error) { }
        }
        throw new Error("tryToFigureOutDataPointFromRawValue: no suitable datapoint found"); // 24/08/2021 Return error if no DPT
      }
    }


    function buildInputMessage({ _srcGA, _destGA, _event, _Rawvalue, _inputDpt, _devicename, _outputtopic, _oNode, _echoed = false }) {
      let sPayloadmeasureunit = "unknown";
      let sDptdesc = "unknown";
      let sPayloadsubtypevalue = "unknown";
      let jsValue = null;
      let sInputDpt = "unknown";
      let gainfo = "unknown";
      let oGA;

      // Construct the gainfo from _devicename ("(Ingressi logici->Sensori) Camera armadi lux")
      if (node.csv !== undefined) {
        try {
          oGA = node.csv.filter((sga) => sga.ga == _destGA)[0];
          const regexGA = /^(.*)\/(.*)\/(.*)$/;
          const regexName = /^\((.*)->(.*)\) (.*)$/;
          const matchGA = oGA.ga.match(regexGA);
          const matchName = oGA.devicename.match(regexName);
          gainfo = {
            maingroupname: matchName[1],
            middlegroupname: matchName[2],
            ganame: matchName[3],
            maingroupnumber: matchGA[1],
            middlegroupnumber: matchGA[2],
            ganumber: matchGA[3]
          }
        } catch (error) {
          // Dont' care
        }
      }

      // 20/06/2024 set both if undefined
      if (_inputDpt === undefined) {
        try {
          _inputDpt = oGA === undefined ? null : oGA.dpt;
        } catch (error) {
          _inputDpt = null;
        }

      }
      if (_devicename === undefined) {
        try {
          _devicename = oGA === undefined ? _oNode.name || "" : oGA.devicename;
        } catch (error) {
          _devicename = undefined;
        }
      }

      const errorMessage = {
        topic: _outputtopic,
        payload: "UNKNOWN, PLEASE IMPORT THE ETS FILE!",
        devicename: typeof _devicename !== "undefined" ? _devicename : "",
        payloadmeasureunit: "",
        payloadsubtypevalue: "",
        knx: {
          event: _event,
          dpt: "unknown",
          dptdesc: "",
          source: _srcGA,
          destination: _destGA,
          rawValue: _Rawvalue,
        },
      };

      // Resolve DPT and convert value if available
      if (_Rawvalue !== null) {
        try {
          sInputDpt = _inputDpt === null ? tryToFigureOutDataPointFromRawValue(_Rawvalue) : _inputDpt;
        } catch (error) {
          // Here comes if no datapoint has beeen found
          node.sysLogger?.error(
            "buildInputMessage: Error returning from tryToFigureOutDataPointFromRawValue. Device " +
            _srcGA +
            " Destination " +
            _destGA +
            " Event " +
            _event +
            " GA's Datapoint " +
            (_inputDpt === null
              ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!"
              : _inputDpt) +
            " Devicename " +
            _devicename +
            " Topic " +
            _outputtopic +
            " " +
            error.message,
          );
          errorMessage.payload = "UNKNOWN: ERROR tryToFigureOutDataPointFromRawValue:" + error.message;
          return errorMessage;
        }

        try {
          var dpt = dptlib.resolve(sInputDpt);
        } catch (error) {
          node.sysLogger?.error(
            "buildInputMessage: Error returning from dptlib.resolve(sInputDpt). Device " +
            _srcGA +
            " Destination " +
            _destGA +
            " Event " +
            _event +
            " GA's Datapoint " +
            (_inputDpt === null
              ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!"
              : _inputDpt) +
            " Devicename " +
            _devicename +
            " Topic " +
            _outputtopic +
            " " +
            error.message,
          );
          errorMessage.payload = "UNKNOWN: ERROR dptlib.resolve:" + error.messages;
          return errorMessage;
        }

        if (dpt !== null && _Rawvalue !== null) {
          try {
            jsValue = dptlib.fromBuffer(_Rawvalue, dpt);
            if (jsValue === null) {
              node.sysLogger?.error(
                "buildInputMessage: received a wrong datagram form KNX BUS, from device " +
                _srcGA +
                " Destination " +
                _destGA +
                " Event " +
                _event +
                " GA's Datapoint " +
                (_inputDpt === null
                  ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!"
                  : _inputDpt) +
                " Devicename " +
                _devicename +
                " Topic " +
                _outputtopic +
                " NodeID " +
                _oNode.id || "",
              );
            }
          } catch (error) {
            node.sysLogger?.error(
              "buildInputMessage: Error returning from DPT decoding. Device " +
              _srcGA +
              " Destination " +
              _destGA +
              " Event " +
              _event +
              " GA's Datapoint " +
              (_inputDpt === null
                ? "THE ETS FILE HAS NOT BEEN IMPORTED, SO I'M TRYING TO FIGURE OUT WHAT DATAPOINT BELONGS THIS GROUP ADDRESS. DON'T BLAME ME IF I'M WRONG, INSTEAD, IMPORT THE ETS FILE!"
                : _inputDpt) +
              " Devicename " +
              _devicename +
              " Topic " +
              _outputtopic +
              " " +
              error.message +
              " NodeID " +
              _oNode.id || "",
            );
            errorMessage.payload = "UNKNOWN: ERROR dptlib.fromBuffer:" + error.stack;
            return errorMessage;
          }
        }

        // 19/01/2023 FORMATTING THE OUTPUT PAYLOAD (ROUND, ETC) BASED ON THE NODE CONFIG
        //* ********************************************************
        jsValue = payloadRounder.Manipulate(_oNode, jsValue);
        //* ********************************************************

        if (dpt.subtype !== undefined) {
          sPayloadmeasureunit = dpt.subtype.unit !== undefined ? dpt.subtype.unit : "unknown";
          sDptdesc = dpt.subtype.desc !== undefined ? dpt.subtype.desc.charAt(0).toUpperCase() + dpt.subtype.desc.slice(1) : "unknown";
          if (dpt.subtype.enc !== undefined) {
            try {
              if (!jsValue) sPayloadsubtypevalue = dpt.subtype.enc[0];
              if (jsValue) sPayloadsubtypevalue = dpt.subtype.enc[1];
            } catch (error) {
              // Don't care
            }
          }
        }

      } else {
        // Don't care, it's a READ REQUEST
      }

      try {
        // Build final input message object
        const finalMessage = {
          topic: _outputtopic,
          devicename: typeof _devicename !== "undefined" ? _devicename : "",
          payload: jsValue,
          payloadmeasureunit: sPayloadmeasureunit,
          payloadsubtypevalue: sPayloadsubtypevalue,
          gainfo: gainfo,
          echoed: _echoed,
          knx: {
            event: _event,
            dpt: sInputDpt,
            dptdesc: sDptdesc,
            source: _srcGA,
            destination: _destGA,
            rawValue: _Rawvalue
          }
        };
        // 11/11/2021 jsValue is null, as well as _Rawvalue, in case of READ REQUEST message.
        // if (jsValue !== null) finalMessage.payload = jsValue;

        return finalMessage;
      } catch (error) {
        node.sysLogger?.error("buildInputMessage error: " + error.message);
        return errorMessage;
      }
    }

    function readCSV(_csvText) {
      // 26/05/2023 check if the text is a file path
      if (_csvText.toUpperCase().includes(".CSV") || _csvText.toUpperCase().includes(".ESF")) {
        // I'ts a file. Read it now and pass to the _csvText
        const sFileName = _csvText;
        try {
          _csvText = fs.readFileSync(sFileName, { encoding: "utf8" });
        } catch (error) {
          node.sysLogger?.error("ERROR: reading ETS file " + error.message);
          node.error("ERROR: reading ETS file " + error.message);
          return;
        }
      }

      // 24/02/2020, in the middle of Coronavirus emergency in Italy. Check if it a CSV ETS Export of group addresses, or if it's an EFS
      if (_csvText.split("\n")[0].toUpperCase().indexOf('"') == -1) return readESF(_csvText);

      const ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red

      if (_csvText == "") {
        node.sysLogger?.info("no csv ETS found");
      } else {
        node.sysLogger?.info("csv ETS found !");
        // 23/08/2019 Delete inwanted CRLF in the GA description
        const sTemp = correctCRLFInCSV(_csvText);

        // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
        const fileGA = sTemp.split("\n");
        // Controllo se le righe dei gruppi contengono il separatore di tabulazione
        if (fileGA[0].search("\t") == -1) {
          node.error("KNXUltimate-config: ERROR: the csv ETS file must have the tabulation as separator");
          return;
        }

        let sFirstGroupName = "";
        let sSecondGroupName = "";
        let sFather = "";
        for (let index = 0; index < fileGA.length; index++) {
          try {
            let element = fileGA[index];
            element = element.replace(/\"/g, ""); // Rimuovo le virgolette
            element = element.replace(/\#/g, ""); // Rimuovo evetuali #

            if (element !== "") {
              // Main and secondary group names
              if ((element.split("\t")[1].match(/-/g) || []).length == 2) {
                // Found main group family name (Example Light Actuators)
                sFirstGroupName = element.split("\t")[0] || "";
                sSecondGroupName = "";
              }
              if ((element.split("\t")[1].match(/-/g) || []).length == 1) {
                // Found second group family name (Example First Floor light)
                sSecondGroupName = element.split("\t")[0] || "";
              }
              if (sFirstGroupName !== "" && sSecondGroupName !== "") {
                sFather = "(" + sFirstGroupName + "->" + sSecondGroupName + ") ";
              }

              if (element.split("\t")[1].search("-") == -1 && element.split("\t")[1].search("/") !== -1) {
                // Ho trovato una riga contenente un GA valido, cioè con 2 "/"
                if (element.split("\t")[5] == "") {
                  if (node.stopETSImportIfNoDatapoint === "stop") {
                    node.error(
                      "KNXUltimate-config: ABORT IMPORT OF ETS CSV FILE. To skip the invalid datapoint and continue import, change the related setting, located in the config node in the ETS import section.",
                    );
                    return;
                  }
                  if (node.stopETSImportIfNoDatapoint === "fake") {
                    // 02/03/2020 Whould you like to continue without datapoint? Good. Here a totally fake datapoint
                    node.warn(
                      "KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to continue import with a fake datapoint 1.001. -> " +
                      element.split("\t")[0] +
                      " " +
                      element.split("\t")[1],
                    );
                    ajsonOutput.push({
                      ga: element.split("\t")[1],
                      dpt: "1.001",
                      devicename: sFather + element.split("\t")[0] + " (DPT NOT SET IN ETS - FAKE DPT USED)",
                    });
                  } else {
                    // 31/03/2020 Skip import
                    node.warn(
                      "KNXUltimate-config: WARNING IMPORT OF ETS CSV FILE. Datapoint not set. You choosed to skip -> " +
                      element.split("\t")[0] +
                      " " +
                      element.split("\t")[1],
                    );
                  }
                } else {
                  const DPTa = element.split("\t")[5].split("-")[1];
                  let DPTb = element.split("\t")[5].split("-")[2];
                  if (typeof DPTb === "undefined") {
                    node.warn(
                      "KNXUltimate-config: WARNING: Datapoint not fully set (there is only the main type). I applied a default .001, but please check if i'ts ok ->" +
                      element.split("\t")[0] +
                      " " +
                      element.split("\t")[1] +
                      " Datapoint: " +
                      element.split("\t")[5],
                    );
                    DPTb = "001"; // default
                  }
                  // Trailing zeroes
                  if (DPTb.length == 1) {
                    DPTb = "00" + DPTb;
                  } else if (DPTb.length == 2) {
                    DPTb = "0" + DPTb;
                  }
                  if (DPTb.length == 3) {
                    DPTb = "" + DPTb; // stupid, but for readability
                  }
                  ajsonOutput.push({
                    ga: element.split("\t")[1],
                    dpt: DPTa + "." + DPTb,
                    devicename: sFather + element.split("\t")[0],
                  });
                }
              }
            }
          } catch (error) {
            node.sysLogger?.error("readCSV " + " ROW:" + fileGA[index] + " Error:" + error.stack);
          }

        }

        return ajsonOutput;
      }
    }

    function readESF(_esfText) {
      // 24/02/2020 must do an EIS to DPT conversion.
      // https://www.loxone.com/dede/kb/eibknx-datentypen/
      // Format: Attuatori luci.Luci primo piano.0/0/1	Luce camera da letto	EIS 1 'Switching' (1 Bit)	Low
      const ajsonOutput = new Array(); // Array: qui va l'output totale con i nodi per node-red

      if (_esfText === "") {
        node.sysLogger?.info("no ESF found");
        return;
      } else {
        node.sysLogger?.info("esf ETS found !");
        // Read and decode the CSV in an Array containing:  "group address", "DPT", "Device Name"
        const fileGA = _esfText.split("\n");
        let sGA = "";
        let sFirstGroupName = "";
        let sSecondGroupName = ""; // Fake, because EIS datapoints are unprecise.
        let sDeviceName = "";
        let sEIS = "";
        let sDPT = "";

        for (let index = 1; index < fileGA.length; index++) {
          let element = fileGA[index];
          element = element.replace(/\"/g, ""); // Rimuovo evetuali virgolette
          element = element.replace(/\#/g, ""); // Rimuovo evetuali #
          // element = element.replace(/[^\x00-\x7F]/g, '') // Remove non ascii chars

          if (element !== "") {
            sFirstGroupName = element.split("\t")[0].split(".")[0] || "";
            sSecondGroupName = element.split("\t")[0].split(".")[1] || "";
            sGA = element.split("\t")[0].split(".")[2] || "";
            sDeviceName = element.split("\t")[1] || "";
            sEIS = element.split("\t")[2] || "";
            sDPT = "";
            // Transform EIS to DPT
            if (sEIS.toUpperCase().includes("EIS 1")) sDPT = "1.001";
            if (sEIS.toUpperCase().includes("EIS 2")) sDPT = "3.007";
            if (sEIS.toUpperCase().includes("EIS 3")) sDPT = "10.001";
            if (sEIS.toUpperCase().includes("EIS 4")) sDPT = "11.001";
            if (sEIS.toUpperCase().includes("EIS 5")) sDPT = "9.001";
            if (sEIS.toUpperCase().includes("EIS 6")) sDPT = "5.001";
            if (sEIS.toUpperCase().includes("EIS 7")) sDPT = "1.001";
            if (sEIS.toUpperCase().includes("EIS 8")) sDPT = "2.001";
            if (sEIS.toUpperCase().includes("EIS 9")) sDPT = "14.007";
            if (sEIS.toUpperCase().includes("EIS 10")) sDPT = "7.001";
            if (sEIS.toUpperCase().includes("EIS 11")) sDPT = "12.001";
            if (sEIS.toUpperCase().includes("EIS 12")) sDPT = "15.000";
            if (sEIS.toUpperCase().includes("EIS 13")) sDPT = "4.001";
            if (sEIS.toUpperCase().includes("EIS 14")) sDPT = "5.001";
            if (sEIS.toUpperCase().includes("EIS 15")) sDPT = "16.001";

            if (sEIS.toUpperCase().includes("UNCERTAIN")) {
              if (sEIS.toUpperCase().includes("4 BYTE")) {
                sDPT = "14.056";
              } else if (sEIS.toUpperCase().includes("2 BYTE")) {
                sDPT = "9.001";
              } else if (sEIS.toUpperCase().includes("3 BYTE")) {
                sDPT = "10.001"; // Date
              } else if (sEIS.toUpperCase().includes("1 BYTE")) {
                sDPT = "20.102"; // RTC
              } else {
                sDPT = "5.004"; // Maybe.
              }
            }
            if (sDPT === "") {
              if (node.stopETSImportIfNoDatapoint === "stop") {
                node.error(
                  "KNXUltimate-config: ABORT IMPORT OF ETS ESF FILE. To continue import, change the related setting, located in the config node in the ETS import section.",
                );
                return;
              } if (node.stopETSImportIfNoDatapoint === "fake") {
                sDPT = "5.004"; // Maybe.
                node.error(
                  "KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to fake the datapoint -> " +
                  sGA +
                  ". An fake datapoint has been set: " +
                  sDPT,
                );
              } else {
                sDPT = "SKIP";
                node.error("KNXUltimate-config: ERROR: Found an UNCERTAIN datapoint in ESF ETS. You choosed to skip -> " + sGA);
              }
            }
            if (sDPT !== "SKIP") ajsonOutput.push({
              ga: sGA,
              dpt: sDPT,
              devicename: "(" + sFirstGroupName + "->" + sSecondGroupName + ") " + sDeviceName,
            });
          }
        }
      }

      return ajsonOutput;
    }

    // 23/08/2019 Delete unwanted CRLF in the GA description
    function correctCRLFInCSV(_csv) {
      let sOut = ""; // fixed output text to return
      let sChar = "";
      let bStart = false;
      for (let index = 0; index < _csv.length; index++) {
        sChar = _csv.substr(index, 1);
        if (sChar == '"') {
          if (!bStart) {
            bStart = true;
          } else {
            bStart = false;
          }
          sOut += sChar;
        } else {
          if (bStart) {
            // i'm in the phrase, delimited by "". No CRLF nor TABulators should be there
            if (sChar !== "\n" && sChar !== "\r" && sChar !== "\t") {
              sOut += sChar;
            } else {
              sOut += " "; // Where it was a CRLF, i put a space
            }
          } else {
            sOut += sChar;
          }
        }
      }

      // Replace all parenthesis with []
      sOut = sOut.replace(/\(/g, "[").replace(/\)/g, "]");
      return sOut;
    }

    // 08/10/2021 Every xx seconds, i check if the connection is up and running
    node.sysLogger?.info("Autoconnection: " + (node.autoReconnect === false ? "no." : "yes") + " Node " + node.name);
    if (node.timerKNXUltimateCheckState !== null) clearInterval(node.timerKNXUltimateCheckState);
    node.timerKNXUltimateCheckState = setInterval(async () => {
      // If the node is disconnected, wait another cycle, then reconnects
      if (node.allowLauch_initKNXConnection && node.autoReconnect) {
        node.allowLauch_initKNXConnection = false;
        const t = setTimeout(() => {
          // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "const t = ".
          node.setAllClientsStatus("Auto reconnect in progress...", "grey", "");
        }, 100);
        node.sysLogger?.debug(
          "Auto Reconect by timerKNXUltimateCheckState in progress. node.LinkStatus: " +
          node.linkStatus +
          ", node.autoReconnect:" +
          node.autoReconnect,
        );
        await node.initKNXConnection();
        return;
      }
      if (node.linkStatus === "disconnected" && node.autoReconnect) {
        node.allowLauch_initKNXConnection = true; // Next cycle, launch initKNXConnection, so it pauses more and leave more time
        const t = setTimeout(() => {
          // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
          node.setAllClientsStatus("Retry connection", "grey", "");
        }, 1000);
        node.sysLogger?.debug(
          "Waiting next cycle to reconect. node.LinkStatus: " + node.linkStatus + ", node.autoReconnect:" + node.autoReconnect,
        );
        // node.initKNXConnection();
      }
    }, 10000);

    node.Disconnect = async (_sNodeStatus = "", _sColor = "grey") => {
      if (node.timerSaveExposedGAs !== null) clearInterval(node.timerSaveExposedGAs);
      if (node.linkStatus === "disconnected") {
        node.sysLogger?.debug("Disconnect: already not connected:" + node.linkStatus + ", node.autoReconnect:" + node.autoReconnect);
        return;
      }
      node.linkStatus = "disconnected"; // 29/08/2019 signal disconnection
      if (node.timerDoInitialRead !== null) clearTimeout(node.timerDoInitialRead); // 17/02/2020 Stop the initial read timer
      try {
        if (node.knxConnection !== null) await node.knxConnection.Disconnect();
      } catch (error) {
        node.sysLogger?.debug(
          "Disconnected: node.knxConnection.Disconnect() " + (error.message || "") + " , node.autoReconnect:" + node.autoReconnect,
        );
      }
      node.setAllClientsStatus("Disconnected", _sColor, _sNodeStatus);
      await saveExposedGAs(); // 04/04/2021 save the current values of GA payload
      node.sysLogger?.debug("Disconnected, node.autoReconnect:" + node.autoReconnect);
    };

    node.on("close", async function (done) {
      try {
        await node.Disconnect();
      } catch (error) { /* empty */ }
      node.nodeClients = []; // 05/04/2022 Nullify
      try {
        if (node.sysLogger !== null) node.sysLogger = null;
        loggerEngine.destroy();
      } catch (error) { /* empty */ }
      done();
    });
  }

  // RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode);
  RED.nodes.registerType("knxUltimate-config", knxUltimateConfigNode, {
    credentials: {
      keyringFilePassword: { type: "password" },
    },
  });
};
