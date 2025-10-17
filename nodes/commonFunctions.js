// Utility function
// until node-red 3.1.0, there is a bug creating a plugin, so for backward compatibility, i must use a JS as a node.
const oOS = require('os')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const dptlib = require('knxultimate').dptlib
const customHTTP = require('./utils/http')
const KNXClient = require('knxultimate').KNXClient
const sysLogger = require('./utils/sysLogger')

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

    const ensureBuffer = (rawValue) => {
      if (!rawValue) return null
      if (Buffer.isBuffer(rawValue)) return rawValue
      if (Array.isArray(rawValue)) return Buffer.from(rawValue)
      if (typeof rawValue === 'object' && Array.isArray(rawValue.data)) return Buffer.from(rawValue.data)
      if (rawValue.type === 'Buffer' && Array.isArray(rawValue.data)) return Buffer.from(rawValue.data)
      return null
    }

    const guessDptFromRawValue = (rawBuffer) => {
      if (!rawBuffer || !rawBuffer.length) return null
      if (rawBuffer.length === 1) {
        if (rawBuffer[0] === 0 || rawBuffer[0] === 1) return '1.001'
        return '5.001'
      }
      if (rawBuffer.length === 4) return '14.056'
      if (rawBuffer.length === 2) return '9.001'
      if (rawBuffer.length === 3) return '11.001'
      if (rawBuffer.length === 14) return '16.001'

      const dpts = Object.entries(dptlib).filter(onlyDptKeys).map(extractBaseNo).sort(sortBy('base')).reduce(toConcattedSubtypes, [])
      for (let index = 0; index < dpts.length; index++) {
        try {
          const resolved = dptlib.resolve(dpts[index].value)
          if (!resolved) continue
          const jsValue = dptlib.fromBuffer(rawBuffer, resolved)
          if (typeof jsValue !== 'undefined') return dpts[index].value
        } catch (error) { /* empty */ }
      }
      return null
    }

    const formatDisplayValue = (value) => {
      if (value === null || value === undefined) return ''
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value)
        } catch (error) {
          return String(value)
        }
      }
      if (typeof value === 'boolean') return value ? 'true' : 'false'
      return String(value)
    }

    // // Gather infos about all interfaces on the lan and provides a static variable utils.aDiscoveredknxGateways
    // try {
    //     require('./utils/utils').DiscoverKNXGateways()
    // } catch (error) {

    // }

    // 11/03/2020 Delete scene saved file, from html
    RED.httpAdmin.get('/knxultimateCheckHueConnected', (req, res) => {
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        if (!serverId) {
          res.json({ ready: false })
          return
        }
        if (serverId.hueAllResources === null || serverId.hueAllResources === undefined) {
          (async function main () {
            try {
              if (typeof serverId.loadResourcesFromHUEBridge === 'function') {
                await serverId.loadResourcesFromHUEBridge()
              }
            } catch (error) {
              RED.log.error(`Errore RED.httpAdmin.get('/knxultimateCheckHueConnected' ${error.stack}`)
            }
            res.json({ ready: false })
          }()).catch()
        } else {
          res.json({ ready: true })
        }
      } catch (error) {
        RED.log.error(`Errore RED.httpAdmin.get('/knxultimateCheckHueConnected' ${error.stack}`)
        res.json({ ready: false })
      }
    })

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

    // // Find all HUE Bridges in the network
    // RED.httpAdmin.get('/KNXUltimateDiscoverHueBridges'), (req, res) => {
    //     const url = 'https://discovery.meethue.com'; // Use HUE broker server discover process by visiting
    //     async function fetchData() {
    //         try {
    //             const response = await fetch(url);  // Effettua la richiesta
    //             const dataArray = await response.json();  // Parsing dei dati JSON
    //             // Mostra l'array risultante
    //             res.json(dataArray);
    //         } catch (error) {
    //             if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`Error fetching discovery.meethue.com ${error.stack}`);
    //             res.json("");
    //         }
    //     }
    // fetchData();
    // };

    // Find all HUE Bridges in the network
    RED.httpAdmin.get('/KNXUltimateGetHueBridgeInfo', RED.auth.needsPermission('hue-config.read'), (req, res) => {
      async function fetchData () {
        try {
          const response = await customHTTP.getBridgeDetails(req.query.IP)
          // Mostra l'array risultante
          res.json(response)
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`Error fetching discovery.meethue.com ${error.stack}`)
          res.json({ error: error.message })
        }
      }
      fetchData()
    })

    // Find all HUE Bridges in the network
    RED.httpAdmin.get('/KNXUltimateGetPlainHueBridgeCredentials', RED.auth.needsPermission('hue-config.read'), (req, res) => {
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        const username = serverId.credentials.username
        const clientkey = serverId.credentials.clientkey
        res.json({ username, clientkey })
      } catch (error) {
        res.json({ error: error.message })
      }
    })

    // Endpoint for registering with the HUE Bridge
    RED.httpAdmin.get('/KNXUltimateRegisterToHueBridge', (req, res) => {
      (async () => {
        try {
          const configNode = RED.nodes.getNode(req.query.serverId)
          const ipAddress = req.query.IP
          if (!ipAddress) throw new Error('Bridge IP address is required.')
          const registration = await customHTTP.registerBridgeUser(ipAddress, 'KNXUltimate', 'Node-RED')
          const bridgeInfo = {
            data: registration.bridge,
            name: registration.bridge?.name || configNode?.name || 'Hue Bridge',
            ipaddress: registration.bridge?.ipaddress || ipAddress,
            bridgeid: registration.bridge?.bridgeid || configNode?.bridgeid || ''
          }
          if (configNode) {
            try {
              configNode.credentials = configNode.credentials || {}
              configNode.credentials.username = registration.user.username
              configNode.credentials.clientkey = registration.user.clientkey
              if (typeof bridgeInfo.bridgeid === 'string' && bridgeInfo.bridgeid) {
                try { configNode.bridgeid = bridgeInfo.bridgeid } catch (e) { /* noop */ }
              }
            } catch (credError) {
              if (node.sysLogger) node.sysLogger.warn(`Hue registration: unable to persist credentials for node ${configNode.id}: ${credError.message}`)
            }
          }
          res.json({ bridge: bridgeInfo, user: registration.user })
        } catch (error) {
          if (node.sysLogger) node.sysLogger.error(`Hue bridge registration failed: ${error.message}`)
          res.json({ error: error.message })
        }
      })()
    })

    RED.httpAdmin.get('/KNXUltimateDiscoverHueBridges', RED.auth.needsPermission('hue-config.read'), (req, res) => {
      customHTTP.discoverHueBridges().then((list) => {
        res.json(Array.isArray(list) ? list : [])
      }).catch((error) => {
        if (node.sysLogger) node.sysLogger.error(`Hue bridge discovery failed: ${error.message}`)
        res.json({ error: error.message })
      })
    })

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

    RED.httpAdmin.get('/knxUltimateGetHueColor', (req, res) => {
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        // find wether the light is a light or is grouped_light
        let hexColor
        const _oDevice = serverId.hueAllResources.filter((a) => a.id === req.query.id)[0]
        if (_oDevice.type === 'light') {
          hexColor = serverId.getColorFromHueLight(req.query.id)
        } else {
          // grouped_light, get the first light in the group
          const oLight = serverId.getFirstLightInGroup(_oDevice.id)
          hexColor = serverId.getColorFromHueLight(oLight.id)
        }
        res.json(hexColor !== undefined ? hexColor : 'Select the device first!')
      } catch (error) {
        res.json('Select the device first!')
      }
    })

    // 2025-09 Secure: return list of Data Secure Group Addresses from keyring
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

    RED.httpAdmin.get('/knxUltimateGetKelvinColor', (req, res) => {
      try {
        // find wether the light is a light or is grouped_light
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        let kelvinValue
        const _oDevice = serverId.hueAllResources.filter((a) => a.id === req.query.id)[0]
        if (_oDevice.type === 'light') {
          kelvinValue = serverId.getKelvinFromHueLight(req.query.id)
        } else {
          // grouped_light, get the first light in the group
          const oLight = serverId.getFirstLightInGroup(_oDevice.id)
          kelvinValue = serverId.getKelvinFromHueLight(oLight.id)
        }
        res.json(kelvinValue !== undefined ? kelvinValue : 'Select the device first!')
      } catch (error) {
        res.json('Select the device first!')
      }
    })

    RED.httpAdmin.get('/knxUltimateGetLightObject', (req, res) => {
      try {
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        if (serverId.hueAllResources === null || serverId.hueAllResources === undefined) {
          throw (new Error('Resource not yet loaded'))
        }
        const _lightId = req.query.id
        const oLight = serverId.hueAllResources.filter((a) => a.id === _lightId)[0]
        // Infer some useful info, so the HTML part can avoid to query the server
        // Kelvin
        try {
          if (oLight.color_temperature !== undefined && oLight.color_temperature.mirek !== undefined) {
            oLight.calculatedKelvin = hueColorConverter.ColorConverter.mirekToKelvin(oLight.color_temperature.mirek)
          }
        } catch (error) {
          oLight.calculatedKelvin = undefined
        }
        // HEX value from XYBri
        try {
          const retRGB = hueColorConverter.ColorConverter.xyBriToRgb(oLight.color.xy.x, oLight.color.xy.y, oLight.dimming.brightness)
          const ret = `#${hueColorConverter.ColorConverter.rgbHex(retRGB.r, retRGB.g, retRGB.b).toString()}`
          oLight.calculatedHEXColor = ret
        } catch (error) {
          oLight.calculatedHEXColor = undefined
        }
        res.json(oLight)
      } catch (error) {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error(`KNXUltimateHue: hueEngine: knxUltimateGetLightObject: error ${error.message}.`)
        res.json({})
      }
    })

    RED.httpAdmin.get('/knxUltimateMonitor', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const server = RED.nodes.getNode(req.query.serverId)
        if (!server) {
          res.json({ items: [], error: 'NO_SERVER' })
          return
        }
        const items = Array.isArray(server.exposedGAs) ? server.exposedGAs.map((entry) => {
          const rawBuffer = ensureBuffer(entry?.rawValue)
          const rawHex = rawBuffer ? rawBuffer.toString('hex') : ''
          let dpt = entry?.dpt
          let guessed = false
          if ((!dpt || dpt === '') && rawBuffer) {
            const inferred = guessDptFromRawValue(rawBuffer)
            if (inferred) {
              dpt = inferred
              guessed = true
            }
          }
          let value = null
          if (rawBuffer && dpt) {
            try {
              const resolved = dptlib.resolve(dpt)
              if (resolved) value = dptlib.fromBuffer(rawBuffer, resolved)
            } catch (error) { /* empty */ }
          }
          return {
            ga: entry?.ga || '',
            devicename: entry?.devicename || '',
            dpt: dpt || '',
            dptGuessed: guessed,
            rawHex,
            value,
            valueText: formatDisplayValue(value),
            updatedAt: entry?.updatedAt || null
          }
        }).sort((a, b) => a.ga.localeCompare(b.ga)) : []
        res.json({ items })
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateMonitor error: ${error.message}`) } catch (e) { }
        res.json({ items: [], error: error.message })
      }
    })

    RED.httpAdmin.post('/knxUltimateMonitorToggle', RED.auth.needsPermission('knxUltimate-config.write'), (req, res) => {
      try {
        const serverId = req.body?.serverId
        const ga = req.body?.ga
        const server = serverId ? RED.nodes.getNode(serverId) : null
        if (!server) {
          res.json({ status: 'error', error: 'NO_SERVER' })
          return
        }
        if (!ga) {
          res.json({ status: 'error', error: 'NO_GA' })
          return
        }
        const entry = Array.isArray(server.exposedGAs) ? server.exposedGAs.find((item) => item.ga === ga) : undefined
        if (!entry) {
          res.json({ status: 'error', error: 'GA_NOT_FOUND' })
          return
        }
        const rawBuffer = ensureBuffer(entry.rawValue)
        let dpt = entry.dpt
        if (!rawBuffer) {
          res.json({ status: 'error', error: 'NO_CURRENT_VALUE' })
          return
        }
        if (!dpt) {
          const inferred = guessDptFromRawValue(rawBuffer)
          if (inferred) dpt = inferred
        }
        let currentValue = null
        if (dpt) {
          try {
            const resolved = dptlib.resolve(dpt)
            if (resolved) currentValue = dptlib.fromBuffer(rawBuffer, resolved)
          } catch (error) { currentValue = null }
        }
        if (typeof currentValue !== 'boolean') {
          res.json({ status: 'error', error: 'NOT_BOOLEAN' })
          return
        }
        const nextValue = !currentValue
        const sendDpt = dpt || '1.001'
        try {
          server.sendKNXTelegramToKNXEngine({
            grpaddr: ga,
            payload: nextValue,
            dpt: sendDpt,
            outputtype: 'write',
            nodecallerid: 'knxUltimateMonitor'
          })
        } catch (error) {
          res.json({ status: 'error', error: error.message })
          return
        }
        res.json({ status: 'ok', value: nextValue })
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateMonitorToggle error: ${error.message}`) } catch (e) { }
        res.json({ status: 'error', error: error.message })
      }
    })

    RED.httpAdmin.get('/knxUltimateDebugLog', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const rawSince = req.query?.sinceSeq ?? req.query?.since ?? req.query?.after ?? null
        let sinceSeq = null
        if (rawSince !== null && rawSince !== undefined) {
          const parsed = Number(rawSince)
          if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
            sinceSeq = Math.floor(parsed)
          }
        }
        const snapshot = sinceSeq === null ? sysLogger.getDebugSnapshot() : sysLogger.getDebugSnapshot({ sinceSeq })
        res.json({
          entries: snapshot.entries,
          latestSeq: snapshot.latestSeq,
          total: snapshot.total,
          limit: snapshot.limit
        })
      } catch (error) {
        try { RED.log.error(`KNXUltimate: knxUltimateDebugLog error: ${error.message}`) } catch (e) { }
        res.json({ entries: [], error: error.message })
      }
    })

    RED.httpAdmin.post('/KNXUltimateLocateHueDevice', async (req, res) => {
      const respondError = (status, message) => {
        res.status(status).json({ error: message })
      }
      try {
        const rawServerId = req.body?.serverId
        const serverId = typeof rawServerId === 'string' ? rawServerId.trim() : (rawServerId ? String(rawServerId).trim() : '')
        if (!serverId) {
          respondError(400, 'Hue bridge not specified')
          return
        }
        const hueServer = RED.nodes.getNode(serverId)
        if (!hueServer) {
          respondError(404, 'Hue bridge not found')
          return
        }
        if (!hueServer.hueManager || !hueServer.hueManager.hueApiV2 || typeof hueServer.hueManager.hueApiV2.put !== 'function') {
          respondError(503, 'Hue bridge not ready')
          return
        }
        if (hueServer.linkStatus !== 'connected') {
          respondError(503, 'Hue bridge is not connected')
          return
        }
        const rawDeviceId = req.body?.deviceId
        const deviceId = typeof rawDeviceId === 'string' ? rawDeviceId.trim() : (rawDeviceId ? String(rawDeviceId).trim() : '')
        if (!deviceId) {
          respondError(400, 'Hue device not specified')
          return
        }
        const rawDeviceType = req.body?.deviceType
        const deviceType = typeof rawDeviceType === 'string' ? rawDeviceType.trim().toLowerCase() : (rawDeviceType ? String(rawDeviceType).trim().toLowerCase() : '')
        let resourceSnapshot = null
        if (typeof hueServer.getHueResourceSnapshot === 'function') {
          try {
            resourceSnapshot = await hueServer.getHueResourceSnapshot(deviceId, { forceRefresh: false })
          } catch (error) {
            resourceSnapshot = null
          }
        }
        const resolvedType = (resourceSnapshot?.type || deviceType || 'light').toLowerCase()
        const targets = []
        const addTarget = (id, type) => {
          if (!id || !type) return
          const trimmedId = typeof id === 'string' ? id.trim() : String(id).trim()
          const trimmedType = typeof type === 'string' ? type.trim().toLowerCase() : String(type).trim().toLowerCase()
          if (trimmedId === '' || trimmedType === '') return
          targets.push({ id: trimmedId, type: trimmedType })
        }

        if (resolvedType === 'grouped_light') {
          let lights = []
          if (typeof hueServer.getAllLightsBelongingToTheGroup === 'function') {
            try {
              lights = await hueServer.getAllLightsBelongingToTheGroup(deviceId)
            } catch (error) {
              lights = []
            }
          }
          if (Array.isArray(lights) && lights.length > 0) {
            lights.forEach((lightResource) => {
              const ownerId = lightResource?.owner?.rid
              if (ownerId) {
                addTarget(ownerId, 'device')
              } else if (lightResource?.id) {
                addTarget(lightResource.id, 'light')
              }
            })
          }
          if (targets.length === 0 && typeof hueServer.getFirstLightInGroup === 'function') {
            const firstLight = hueServer.getFirstLightInGroup(deviceId)
            const ownerId = firstLight?.owner?.rid
            if (ownerId) {
              addTarget(ownerId, 'device')
            } else if (firstLight?.id) {
              addTarget(firstLight.id, 'light')
            }
          }
        } else if (resolvedType === 'device') {
          addTarget(deviceId, 'device')
        } else {
          const ownerId = resourceSnapshot?.owner?.rid
          if (ownerId) {
            addTarget(ownerId, 'device')
          } else {
            addTarget(deviceId, resolvedType || 'light')
          }
        }

        const uniqueTargets = []
        const seenTargets = new Set()
        targets.forEach((target) => {
          const key = `${target.type}:${target.id}`
          if (!seenTargets.has(key)) {
            seenTargets.add(key)
            uniqueTargets.push(target)
          }
        })

        if (uniqueTargets.length === 0) {
          respondError(404, 'Hue device resource unavailable')
          return
        }

        const sessionKey = `identify:${deviceId}`
        const maxDurationMs = 600000
        const intervalMs = 1000
        const rawAction = (req.body?.action || '').toString().trim().toLowerCase()
        const explicitAction = rawAction === 'start' || rawAction === 'stop' ? rawAction : 'toggle'

        const stopIdentifySession = () => {
          if (typeof hueServer.isHueIdentifySessionActive === 'function' && hueServer.isHueIdentifySessionActive(sessionKey)) {
            if (typeof hueServer.stopHueIdentifySession === 'function') {
              hueServer.stopHueIdentifySession(sessionKey, 'manual')
            }
            return true
          }
          return false
        }

        if (explicitAction === 'stop') {
          const wasActive = stopIdentifySession()
          res.json({ status: 'stopped', wasActive })
          return
        }

        if (explicitAction !== 'start') {
          if (stopIdentifySession()) {
            res.json({ status: 'stopped', wasActive: true })
            return
          }
        }

        if (explicitAction === 'start' && typeof hueServer.isHueIdentifySessionActive === 'function' && hueServer.isHueIdentifySessionActive(sessionKey)) {
          res.json({ status: 'started', alreadyActive: true, expiresInMs: maxDurationMs })
          return
        }

        if (typeof hueServer.startHueIdentifySession === 'function') {
          const started = await hueServer.startHueIdentifySession({
            sessionKey,
            targets: uniqueTargets,
            intervalMs,
            maxDurationMs
          })
          if (!started) {
            respondError(500, 'Unable to start locate session')
            return
          }
          res.json({ status: 'started', expiresInMs: maxDurationMs })
          return
        }
        const identifyPayload = { identify: { action: 'identify' } }
        for (const target of uniqueTargets) {
          await hueServer.hueManager.hueApiV2.put(`/resource/${target.type}/${target.id}`, identifyPayload)
        }
        res.json({ status: 'started', expiresInMs: 0 })
      } catch (error) {
        try { RED.log.error(`KNXUltimate LocateHueDevice error: ${error.message}`) } catch (err) { }
        res.status(500).json({ error: error.message })
      }
    })

    RED.httpAdmin.get('/KNXUltimateGetResourcesHUE', async (req, res) => {
      try {
        // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
        const serverId = RED.nodes.getNode(req.query.serverId) // Retrieve node.id of the config node.
        if (serverId === null) {
          RED.log.warn('Warn KNXUltimateGetResourcesHUE serverId is null')
          const jRet = []
          jRet.push({ name: 'PLEASE DEPLOY FIRST: then try again.', id: 'error' })
          res.json({ devices: jRet })
          return
        }
        const refreshFlag = (req.query.forceRefresh || '').toString().toLowerCase()
        const forceRefresh = refreshFlag === '1' || refreshFlag === 'true' || refreshFlag === 'yes'
        const jRet = await serverId.getResources(req.query.rtype, { forceRefresh })
        if (jRet !== undefined) {
          res.json(jRet)
        } else {
          res.json({ devices: [{ name: "I'm still connecting...Try in some seconds" }] })
        }
        // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
      } catch (error) {
        // RED.log.error(`Errore KNXUltimateGetResourcesHUE non gestito ${error.message}`);
        res.json({ devices: error.message })
        RED.log.error(`Err KNXUltimateGetResourcesHUE: ${error.message}`)
        // (async () => {
        //   await node.initHUEConnection();
        // })();
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
            helplink: 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki'
          }
          res.json(jRet)
          return
        }
        jRet = {
          help: 'NO',
          helplink: 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome'
        }
        const dpts = Object.entries(dptlib.dpts).filter(onlyDptKeys)
        for (let index = 0; index < dpts.length; index++) {
          if (dpts[index][0].toUpperCase() === `DPT${sDPT}`) {
            jRet = {
              help: dpts[index][1].basetype.hasOwnProperty('help') ? dpts[index][1].basetype.help : 'NO',
              helplink: dpts[index][1].basetype.hasOwnProperty('helplink')
                ? dpts[index][1].basetype.helplink
                : 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-SamplesHome'
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
