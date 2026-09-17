// Utility function
// until node-red 3.1.0, there is a bug creating a plugin, so for backward compatibility, i must use a JS as a node.
const oOS = require('os')
const fs = require('fs')
const path = require('path')
const dptlib = require('knxultimate').dptlib
const KNXClient = require('knxultimate').KNXClient
const { normalizeAuthFromAccessTokenQuery } = require('./utils/httpAdminAccessToken')

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

    // 11/03/2020 Delete scene saved file, from html
    RED.httpAdmin.get('/knxultimatescenecontrollerdelete'), (req, res) => {
      // Delete the file
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        const newPath = `${serverId.userDir}/scenecontroller/SceneController_${req.query.FileName}`
        fs.unlinkSync(newPath)
      } catch (error) { if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.warn(`e ${error}`) }
      res.json({ status: 220 })
    }

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

    // 12/08/2021 Endpoint for deleting the GA persistent file for the current gateway
    RED.httpAdmin.get('/deletePersistGAFile', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        if (typeof req.query.serverId !== 'undefined' && req.query.serverId !== null && req.query.serverId !== '') {
          try {
            const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
            const sFile = path.join(serverId.userDir, 'knxpersistvalues', `knxpersist${req.query.serverId}.json`)
            fs.unlinkSync(sFile)
          } catch (error) { res.json({ error: error.stack }) }
          res.json({ error: 'No error' })
        } else {
          res.json({ error: 'No serverId specified' })
        }
      } catch (error) {
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
        if (!fs.existsSync(filePath)) {
          res.status(404).json({ error: 'FILE_NOT_FOUND' })
          return
        }
        const safeName = path.basename(filePath) || 'knx-logger.xml'
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`)
        const stream = fs.createReadStream(filePath)
        stream.on('error', (err) => {
          try { RED.log.error(`KNXUltimateLoggerDownload error reading file ${filePath}: ${err.message}`) } catch (e) {}
          if (!res.headersSent) res.status(500).json({ error: 'READ_ERROR' })
        })
        stream.pipe(res)
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

    // 2026-06 Reveal all keyring passwords (and the general keyring password) in clear text.
    // Used by the "Utility" tab button, enabled only when KNX Secure is selected.
    RED.httpAdmin.get('/knxUltimateKeyringDump', RED.auth.needsPermission('knxUltimate-config.read'), async (req, res) => {
      try {
        let keyringContent = (req.query.keyring || '').toString()
        let password = (req.query.pwd || '').toString()
        // '__PWRD__' is the Node-RED placeholder for an unchanged password credential: ignore it.
        if (password === '__PWRD__') password = ''
        // Fill any missing field (keyring and/or password) from the existing config node.
        if ((!keyringContent || !password) && req.query.serverId) {
          const cfg = RED.nodes.getNode(req.query.serverId)
          if (cfg) {
            if (!keyringContent) { try { keyringContent = cfg.keyringFileXML || keyringContent } catch (e) { } }
            if (!password) { try { password = (cfg.credentials && cfg.credentials.keyringFilePassword) ? cfg.credentials.keyringFilePassword : password } catch (e) { } }
          }
        }
        if (!keyringContent || !password) {
          return res.json({ ok: false, error: 'MISSING_KEYRING_OR_PASSWORD' })
        }
        let Keyring
        try {
          ({ Keyring } = require('knxultimate/build/secure/keyring'))
        } catch (e) {
          try { RED.log.error(`KNXUltimate: cannot load Keyring module: ${e.message}`) } catch (err) { }
          return res.json({ ok: false, error: 'KEYRING_MODULE_UNAVAILABLE' })
        }
        const kr = new Keyring()
        try {
          await kr.load(keyringContent, password)
        } catch (e) {
          try { RED.log.error(`KNXUltimate: keyring load error: ${e.message}`) } catch (err) { }
          return res.json({ ok: false, error: 'KEYRING_LOAD_FAILED' })
        }

        const toIAString = (value) => {
          if (!value) return ''
          return typeof value.toString === 'function' ? value.toString() : String(value)
        }
        const toBufferString = (value) => {
          if (!value) return ''
          if (Buffer.isBuffer(value)) return value.toString('hex')
          return String(value)
        }

        const lines = []
        lines.push('================ KNX Secure keyring passwords ================')
        lines.push(`Created By: ${kr.getCreatedBy?.() || ''}`)
        lines.push(`Created On: ${kr.getCreated?.() || ''}`)
        lines.push(`General keyring password: ${password}`)
        lines.push('')

        lines.push('Interfaces:')
        const interfaceMap = kr.getInterfaces?.()
        const interfaces = Array.from(interfaceMap ? interfaceMap.values() : [])
        if (interfaces.length === 0) {
          lines.push('  (none)')
        } else {
          interfaces.forEach((iface, idx) => {
            lines.push(`  [${idx + 1}] ${toIAString(iface.individualAddress) || '(unknown)'} (${iface.type || ''})`)
            lines.push(`       Host: ${toIAString(iface.host) || ''}`)
            lines.push(`       User ID: ${typeof iface.userId === 'number' ? iface.userId : ''}`)
            lines.push(`       Password: ${iface.decryptedPassword || ''}`)
            lines.push(`       Authentication: ${iface.decryptedAuthentication || ''}`)
          })
        }
        lines.push('')

        lines.push('Backbones:')
        const backbones = kr.getBackbones?.() || []
        if (backbones.length === 0) {
          lines.push('  (none)')
        } else {
          backbones.forEach((backbone, idx) => {
            lines.push(`  [${idx + 1}] Multicast: ${backbone.multicastAddress || ''}`)
            lines.push(`       Key (hex): ${toBufferString(backbone.decryptedKey)}`)
          })
        }
        lines.push('')

        lines.push('Group Addresses:')
        const groupAddressMap = kr.getGroupAddresses?.()
        const groupAddresses = Array.from(groupAddressMap ? groupAddressMap.values() : [])
        if (groupAddresses.length === 0) {
          lines.push('  (none)')
        } else {
          groupAddresses.forEach((group, idx) => {
            lines.push(`  [${idx + 1}] ${toIAString(group.address) || ''}`)
            lines.push(`       Key (hex): ${toBufferString(group.decryptedKey)}`)
          })
        }
        lines.push('')

        lines.push('Devices:')
        const deviceMap = kr.getDevices?.()
        const devices = Array.from(deviceMap ? deviceMap.values() : [])
        if (devices.length === 0) {
          lines.push('  (none)')
        } else {
          devices.forEach((device, idx) => {
            lines.push(`  [${idx + 1}] ${toIAString(device.individualAddress) || ''}`)
            lines.push(`       Tool Key (hex): ${toBufferString(device.decryptedToolKey)}`)
            lines.push(`       Management Password: ${device.decryptedManagementPassword || ''}`)
            lines.push(`       Authentication: ${device.decryptedAuthentication || ''}`)
            lines.push(`       Serial Number: ${device.serialNumber || ''}`)
          })
        }
        lines.push('================ End of keyring passwords ================')

        res.json({ ok: true, dump: lines.join('\n') })
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateKeyringDump error: ${error.message}`) } catch (e) { }
        res.json({ ok: false, error: 'UNEXPECTED_ERROR' })
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
