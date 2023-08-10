
const dptlib = require('./../KNXEngine/src/dptlib')
const hueClass = require('./utils/hueEngine').classHUE
const loggerEngine = require('./utils/sysLogger.js')
// Helpers
const sortBy = (field) => (a, b) => {
  if (a[field] > b[field]) { return 1 } else { return -1 }
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
  const subtypes =
    Object.entries(baseType.subtypes)
      .sort(sortBy(0))
      .map(convertSubtype(baseType))

  return acc.concat(subtypes)
}

module.exports = (RED) => {
  'use strict'

  RED.httpAdmin.get('/knxUltimateDpts', RED.auth.needsPermission('hue-config.read'), function (req, res) {
    const dpts =
      Object.entries(dptlib)
        .filter(onlyDptKeys)
        .map(extractBaseNo)
        .sort(sortBy('base'))
        .reduce(toConcattedSubtypes, [])

    res.json(dpts)
  })

  function hueConfig(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.host = config.host
    node.nodeClients = [] // Stores the registered clients
    node.loglevel = config.loglevel !== undefined ? config.loglevel : 'error' // 18/02/2020 Loglevel default error
    node.sysLogger = null // 20/03/2022 Default
    try {
      node.sysLogger = loggerEngine.get({ loglevel: node.loglevel }) // 08/04/2021 new logger to adhere to the loglevel selected in the config-window
    } catch (error) { }
    node.name = (config.name === undefined || config.name === '') ? node.host : config.name // 12/08/2021

    // Init HUE Utility
    node.hueManager = new hueClass(node.host, node.credentials.username, node.credentials.clientkey, config.bridgeid, node.sysLogger)

    // Event clip V2
    node.hueManager.on('event', _event => {
      node.nodeClients.forEach(_oClient => {
        const oClient = _oClient
        try {
          if (oClient.handleSendHUE !== undefined) oClient.handleSendHUE(_event)
        } catch (error) {
          if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger.error('Errore node.hueManager.on(event): ' + error.message)
        }
      })
    })

    RED.httpAdmin.get('/KNXUltimateGetResourcesHUE', RED.auth.needsPermission('hue-config.read'), function (req, res) {
      try {
        (async () => {
          try {
            // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
            const _node = RED.nodes.getNode(req.query.nodeID)// Retrieve node.id of the config node.
            const jRet = await node.hueManager.getResources(req.query.rtype, _node.host, _node.credentials.username)
            res.json(jRet)
            // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
          } catch (err) {
            RED.log.error('Errore KNXUltimateGetResourcesHUE non gestito ' + err.message)
            res.json({ error: err.message })
          }
        })()
      } catch (err) {
        RED.log.error('Errore KNXUltimateGetResourcesHUE bsonto ' + err.message)
        res.json({ error: err.message })
      }
    })

    node.addClient = (_Node) => {
      // Check if node already exists
      if (node.nodeClients.filter(x => x.id === _Node.id).length === 0) {
        // Add _Node to the clients array
        _Node.setNodeStatusHue({ fill: 'grey', shape: 'ring', text: 'Hue initialized.' })
        node.nodeClients.push(_Node)
      }
    }

    node.removeClient = (_Node) => {
      // Remove the client node from the clients array
      try {
        node.nodeClients = node.nodeClients.filter(x => x.id !== _Node.id)
      } catch (error) { }
    }

    node.on('close', function (done) {
      try {
        if (node.sysLogger !== undefined && node.sysLogger !== null) node.sysLogger = null; loggerEngine.destroy()
        node.nodeClients = []
        node.hueManager.removeAllListeners();
        (async () => {
          try {
            await node.hueManager.close()
            node.hueManager = null
            delete node.hueManager
          } catch (error) {
          }
          done()
        })()
      } catch (error) {
        done()
        console.log(error.message)
      }
    })
  }

  // RED.nodes.registerType("hue-config", hue-config);
  RED.nodes.registerType('hue-config', hueConfig, {
    credentials: {
      username: { type: 'password' },
      clientkey: { type: 'password' }
    }
  })
}
