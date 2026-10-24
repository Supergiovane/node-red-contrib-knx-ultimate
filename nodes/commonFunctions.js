// Utility function
// until node-red 3.1.0, there is a bug creating a plugin, so for backward compatibility, i must use a JS as a node.
const oOS = require('os')
const path = require('path')
const dptlib = require('knxultimate').dptlib
const KNXClient = require('knxultimate').KNXClient
const { normalizeAuthFromAccessTokenQuery } = require('./utils/httpAdminAccessToken')
const { storageOf } = require('./utils/fileStorage')

// DATAPONT MANIPULATION HELPERS
// ####################
const sortBy = (field) => (a, b) => {
  if (a[field] > b[field]) {
    return 1
  } else {
    return -1
  }
}

const onlyDptKeys = (kv) => {
  return kv[0].startsWith('DPT')
}

const extractBaseNo = (kv) => {
  return {
    subtypes: kv[1].subtypes,
    base: parseInt(kv[1].id.replace('DPT', ''))
  }
}

const convertSubtype = (baseType) => (kv) => {
  const value = `${baseType.base}.${kv[0]}`
  // let sRet = value + " " + kv[1].name + (kv[1].unit === undefined ? "" : " (" + kv[1].unit + ")");
  const sRet = value + ' ' + kv[1].name
  return {
    value,
    text: sRet
  }
}

const toConcattedSubtypes = (acc, baseType) => {
  const subtypes = Object.entries(baseType.subtypes).sort(sortBy(0)).map(convertSubtype(baseType))

  return acc.concat(subtypes)
}
// ####################

module.exports = (RED) => {
  RED.plugins.registerPlugin('commonFunctions', {
    type: 'foo',
    onadd: function () {
      RED.events.on('registry:plugin-added', function (id) {
        // console.log(`my-test-plugin: plugin-added event "${id}"`)
        commonFunctions()
      })
    }
  })

  function commonFunctions () {
    const node = this

    // // Gather infos about all interfaces on the lan and provides a static variable utils.aDiscoveredknxGateways
    // try {
    //     require('./utils/utils').DiscoverKNXGateways()
    // } catch (error) {

    // }

    // Endpoint for reading csv/esf by the other nodes
    RED.httpAdmin.get('/knxUltimatecsv', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        if (typeof req.query.nodeID !== 'undefined' && req.query.nodeID !== null && req.query.nodeID !== '') {
          const _node = RED.nodes.getNode(req.query.nodeID) // Retrieve node.id of the config node.
          if (_node !== null) res.json(RED.nodes.getNode(_node.id).csv)
        } else {
          // Get the first knxultimate-config having a valid csv
          try {
            if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.info('KNXUltimate-config: Requested csv maybe from visu-ultimate?')
            RED.nodes.eachNode((_node) => {
              if (_node.hasOwnProperty('csv') && _node.type === 'knxUltimate-config' && _node.csv !== '') {
                res.json(RED.nodes.getNode(_node.id).csv)
              }
            })
          } catch (error) { }
        }
      } catch (error) {
      }
    })

    // 14/08/2019 Endpoint for retrieving the ethernet interfaces
    RED.httpAdmin.get('/knxUltimateETHInterfaces', (req, res) => {
      const jListInterfaces = []
      try {
        const oiFaces = oOS.networkInterfaces()
        Object.keys(oiFaces).forEach((ifname) => {
          const ifaceEntries = Array.isArray(oiFaces[ifname]) ? oiFaces[ifname] : []
          const externalEntries = ifaceEntries.filter((iface) => iface && iface.internal === false)
          if (externalEntries.length === 0) return
          const addresses = externalEntries.map((iface) => ({
            address: iface.address,
            family: iface.family,
            netmask: iface.netmask,
            cidr: iface.cidr || null
          }))
          const displayAddress = addresses.map((entry) => entry.address).join(', ')
          jListInterfaces.push({
            name: ifname,
            address: displayAddress,
            addresses
          })
        })
      } catch (error) { }
      res.json(jListInterfaces)
    })

    RED.httpAdmin.get('/knxUltimateSerialInterfaces', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        const list = await KNXClient.listSerialInterfaces()
        res.json(Array.isArray(list) ? list : [])
      } catch (error) {
        try { RED.log.error(`KNXUltimate serial discovery failed: ${error.message}`) } catch (e) { }
        res.json([])
      }
    })

    // Discover KNX/IP gateways on demand and return cached results
    RED.httpAdmin.get('/knxUltimateDiscoverKNXGateways', RED.auth.needsPermission('knxUltimate-config.read'), async function (req, res) {
      try {
        const utils = require('./utils/utils')
        // Always trigger discovery on request to ensure fresh data
        const list = await utils.DiscoverKNXGateways()
        res.json(Array.isArray(list) ? list : [])
      } catch (error) {
        try { RED.log.error(`KNX gateway discovery failed: ${error.message}`) } catch (e) { /* noop */ }
        res.json([])
      }
    })

    // Shared Logger download for legacy nodes and the private Utility profile.
    const downloadLoggerFile = (req, res) => {
      try {
        const nodeId = (req.query.nodeId || req.query.id || '').toString()
        if (!nodeId) {
          res.status(400).json({ error: 'NO_NODE_ID' })
          return
        }
        const loggerNode = RED.nodes.getNode(nodeId)
        if (!loggerNode || loggerNode.isLogger !== true) {
          res.status(404).json({ error: 'LOGGER_NOT_FOUND' })
          return
        }
        const filePath = (loggerNode.filePath || '').toString()
        if (!filePath) {
          res.status(404).json({ error: 'NO_FILE_PATH' })
          return
        }
        // The file may still be waiting in the gateway's File Cache Control.
        const storage = storageOf(loggerNode.serverKNX)
        if (!storage.exists(filePath)) {
          res.status(404).json({ error: 'FILE_NOT_FOUND' })
          return
        }
        let content
        try {
          content = storage.readFile(filePath)
        } catch (err) {
          try { RED.log.error(`KNXUltimateLoggerDownload error reading file ${filePath}: ${err.message}`) } catch (e) {}
          res.status(500).json({ error: 'READ_ERROR' })
          return
        }
        const safeName = path.basename(filePath) || 'knx-logger.xml'
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`)
        res.end(content)
      } catch (error) {
        try { RED.log.error(`KNXUltimateLoggerDownload error: ${error.message}`) } catch (e) {}
        if (!res.headersSent) res.status(500).json({ error: 'UNEXPECTED_ERROR' })
      }
    }
    RED.httpAdmin.get('/knxUltimateLoggerDownload', normalizeAuthFromAccessTokenQuery, RED.auth.needsPermission('knxUltimate-config.read'), downloadLoggerFile)
    RED.httpAdmin.get('/knxUltimateUtility/logger/download', normalizeAuthFromAccessTokenQuery, RED.auth.needsPermission('knxUltimate-config.read'), downloadLoggerFile)

    // 2025-09 List interfaces (IA) from KNX Secure keyring
    RED.httpAdmin.get('/knxUltimateKeyringInterfaces', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        let keyringContent = (req.query.keyring || '').toString()
        let password = (req.query.pwd || '').toString()
        // If not provided, try to read from existing config node
        if ((!keyringContent || !password) && req.query.serverId) {
          const cfg = RED.nodes.getNode(req.query.serverId)
          if (cfg) {
            try { keyringContent = cfg.keyringFileXML || keyringContent } catch (e) { }
            try { password = (cfg.credentials && cfg.credentials.keyringFilePassword) ? cfg.credentials.keyringFilePassword : password } catch (e) { }
          }
        }
        if (!keyringContent || !password) {
          return res.json([])
        }
        let Keyring
        try {
          ({ Keyring } = require('knxultimate/build/secure/keyring'))
        } catch (e) {
          try { RED.log.error(`KNXUltimate: cannot load Keyring module: ${e.message}`) } catch (err) { }
          return res.json([])
        }
        const kr = new Keyring()
        try {
          await kr.load(keyringContent, password)
        } catch (e) {
          try { RED.log.error(`KNXUltimate: keyring load error: ${e.message}`) } catch (err) { }
          return res.json([])
        }
        const out = []
        try {
          for (const [iaStr, iface] of kr.getInterfaces()) {
            out.push({ ia: iaStr, userId: iface?.userId })
          }
        } catch (e) { }
        res.json(out)
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateKeyringInterfaces error: ${error.message}`) } catch (e) { }
        res.json([])
      }
    })

    RED.httpAdmin.get('/knxUltimateKeyringDataSecureGAs', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        let keyringContent = (req.query.keyring || '').toString()
        let password = (req.query.pwd || '').toString()
        // Try to use config node if not provided
        if ((!keyringContent || !password) && req.query.serverId) {
          const cfg = RED.nodes.getNode(req.query.serverId)
          if (cfg) {
            try { keyringContent = cfg.keyringFileXML || keyringContent } catch (e) { }
            try { password = (cfg.credentials && cfg.credentials.keyringFilePassword) ? cfg.credentials.keyringFilePassword : password } catch (e) { }
          }
        }
        if (!keyringContent || !password) return res.json([])
        let Keyring
        try { ({ Keyring } = require('knxultimate/build/secure/keyring')) } catch (e) { return res.json([]) }
        const kr = new Keyring()
        try { await kr.load(keyringContent, password) } catch (e) { return res.json([]) }
        const out = []
        try {
          for (const [gaStr, g] of kr.getGroupAddresses()) {
            if (g?.decryptedKey && g.decryptedKey.length > 0) out.push(gaStr)
          }
        } catch (e) { }
        res.json(out)
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateKeyringDataSecureGAs error: ${error.message}`) } catch (e) { }
        res.json([])
      }
    })

    RED.httpAdmin.get('/knxUltimateDpts', (req, res) => {
      try {
        const dpts = Object.entries(dptlib.dpts).filter(onlyDptKeys).map(extractBaseNo).sort(sortBy('base'))
          .reduce(toConcattedSubtypes, [])
        res.json(dpts)
      } catch (error) { }
    })

    // 15/09/2020 Supergiovane, read datapoint help usage
    RED.httpAdmin.get('/knxUltimateDptsGetHelp', (req, res) => {
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        const sDPT = req.query.dpt.split('.')[0] // Takes only the main type
        let jRet
        if (sDPT === '0') {
          // Special fake datapoint, meaning "Universal Mode"
          jRet = {
            help: `// KNX-Ultimate set as UNIVERSAL NODE
    // Example of a function that sends a message to the KNX-Ultimate
    msg.destination = "0/0/1"; // Set the destination 
    msg.payload = false; // issues a write or response (based on the options Telegram type above) to the KNX bus
    msg.event = "GroupValue_Write"; // "GroupValue_Write" or "GroupValue_Response", overrides the option Telegram type above.
    msg.dpt = "1.001"; // for example "1.001", overrides the Datapoint option. (Datapoints can be sent as 9 , "9" , "9.001" or "DPT9.001")
    return msg;`,
            helplink: 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Device'
          }
          res.json(jRet)
          return
        }
        jRet = {
          help: 'NO',
          helplink: 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome'
        }
        const dpts = Object.entries(dptlib.dpts).filter(onlyDptKeys)
        for (let index = 0; index < dpts.length; index++) {
          if (dpts[index][0].toUpperCase() === `DPT${sDPT}`) {
            jRet = {
              help: dpts[index][1].basetype.hasOwnProperty('help') ? dpts[index][1].basetype.help : 'NO',
              helplink: dpts[index][1].basetype.hasOwnProperty('helplink')
                ? dpts[index][1].basetype.helplink
                : 'https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome'
            }
            break
          }
        }
        res.json(jRet)
      } catch (error) {
        res.json({ error: error.stack })
      }
    })

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
}
