/* eslint-disable max-len */
const path = require('path')
const { exportMatterStorage, importMatterStorage } = require('./utils/matterStorageBackup')
const matterPackageVersion = require('@matter/main').version
const { Specification } = require('@matter/model')

// 10/09/2024 Setup the color logger
const loggerSetup = (options) => {
  const clog = require('node-color-log').createNamedLogger(options.setPrefix)
  clog.setLevel(options.loglevel)
  clog.setDate(() => (new Date()).toLocaleString())
  return clog
}

module.exports = (RED) => {
  function matterConfig (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.nodeClients = [] // Stores the registered clients
    node.loglevel = config.loglevel !== undefined ? config.loglevel : 'error'
    node.sysLogger = null
    node.matterManager = null
    node.timerMatterConfigCheckState = null
    node.storageOperation = null
    try {
      node.sysLogger = loggerSetup({ loglevel: node.loglevel, setPrefix: 'matter-config.js' })
    } catch (error) { console.log(error.stack) }
    node.name = config.name === undefined || config.name === '' ? 'Matter Controller' : config.name
    node.fabricLabel = config.fabricLabel === undefined || config.fabricLabel === '' ? 'KNX-Ultimate' : config.fabricLabel
    // Stable, filesystem-safe identity of the controller (fabric), bound to this config node.
    node.matterInstanceId = `knxultimate-matter-${node.id.replace(/[^a-zA-Z0-9]/g, '')}`
    node.matterStoragePath = path.join(RED.settings.userDir || '.', 'knxultimatestorage', 'matter')

    // Helper like the hue-config one
    Object.defineProperty(node, 'linkStatus', {
      get: function () {
        return node.matterManager?.matterConnectionStatus ?? 'disconnected'
      }
    })

    const safeClientCall = (client, fn, label) => {
      try {
        if (!client || typeof fn !== 'function') return
        fn()
      } catch (error) {
        node.sysLogger?.warn(`Matter client ${label} error: ${error.message}`)
      }
    }

    node.initMatterConnection = async () => {
      try {
        if (node.matterManager !== null) await node.matterManager.close()
      } catch (error) { /* empty */ }
      try {
        const { classMatter } = await import('./utils/matterEngine.mjs')
        node.matterManager = new classMatter(node.matterStoragePath, node.matterInstanceId, node.fabricLabel, node.sysLogger)
      } catch (error) {
        node.sysLogger?.error(`Errore matter-config: node.initMatterConnection: ${error.message}`)
        throw (error)
      }

      // Attribute changes coming from the Matter devices
      node.matterManager.on('event', (_event) => {
        node.nodeClients.forEach((_oClient) => {
          try {
            if (_oClient.handleSendMatter !== undefined) _oClient.handleSendMatter(_event)
          } catch (error) {
            node.sysLogger?.error(`Errore node.matterManager.on(event): ${error.message}`)
          }
        })
      })

      // Cluster events (button presses etc.)
      node.matterManager.on('matterEvent', (_event) => {
        node.nodeClients.forEach((_oClient) => {
          try {
            if (_oClient.handleMatterClusterEvent !== undefined) _oClient.handleMatterClusterEvent(_event)
          } catch (error) {
            node.sysLogger?.error(`Errore node.matterManager.on(matterEvent): ${error.message}`)
          }
        })
      })

      // A paired node completed the initial sync: let the clients do their initial read
      node.matterManager.on('nodeInitialized', (_nodeId) => {
        node.nodeClients.forEach((_oClient) => {
          if (_oClient.matterNodeId === _nodeId) {
            safeClientCall(_oClient, () => _oClient.handleMatterNodeInitialized(), 'handleMatterNodeInitialized')
          }
        })
      })

      // Connection state of a single paired device changed
      node.matterManager.on('nodeState', (_nodeId, _state) => {
        node.nodeClients.forEach((_oClient) => {
          if (_oClient.matterNodeId === _nodeId) {
            safeClientCall(_oClient, () => _oClient.setNodeStatusMatter({
              fill: _state === 'connected' ? 'green' : 'yellow',
              shape: _state === 'connected' ? 'dot' : 'ring',
              text: _state,
              payload: ''
            }), 'setNodeStatusMatter')
            if (_state === 'connected') {
              safeClientCall(_oClient, () => _oClient.handleMatterNodeInitialized(), 'handleMatterNodeInitialized')
            }
          }
        })
      })

      node.matterManager.on('connected', () => {
        node.nodeClients.forEach((_oClient) => {
          safeClientCall(_oClient, () => _oClient.setNodeStatusMatter({
            fill: 'green',
            shape: 'ring',
            text: 'Controller ready',
            payload: ''
          }), 'setNodeStatusMatter')
        })
      })

      node.matterManager.on('disconnected', () => {
        node.nodeClients.forEach((_oClient) => {
          safeClientCall(_oClient, () => _oClient.setNodeStatusMatter({
            fill: 'red',
            shape: 'ring',
            text: 'Matter Disconnected',
            payload: ''
          }), 'setNodeStatusMatter')
        })
      })

      try {
        await node.matterManager.Connect()
      } catch (error) {
        node.sysLogger?.error(`Errore matter-config: Connect: ${error.message}`)
      }
    }

    node.startWatchdogTimer = async () => {
      if (node.timerMatterConfigCheckState !== null) clearTimeout(node.timerMatterConfigCheckState)
      node.timerMatterConfigCheckState = setTimeout(() => {
        (async () => {
          if (node.linkStatus === 'disconnected') {
            try {
              await node.initMatterConnection()
            } catch (error) {
              node.sysLogger?.error(`Errore matter-config: node.startWatchdogTimer: ${error.message}`)
            }
          }
          await node.startWatchdogTimer()
        })()
      }, 60000)
    }

    setTimeout(() => {
      (async () => {
        try {
          await node.initMatterConnection()
        } catch (error) {
          // Never let a failed startup (missing dependency, corrupted storage...) become
          // an unhandled rejection: the watchdog will retry the connection later.
          node.sysLogger?.error(`matter-config: startup error: ${error.message}`)
        }
        try {
          node.startWatchdogTimer()
        } catch (error) {
          node.sysLogger?.error(`matter-config: watchdog start error: ${error.message}`)
        }
      })()
    }, 5000)

    // Functions called from the nodes and the admin endpoints ----------------------------------------
    node.getCommissionedNodesDetails = () => {
      if (node.matterManager === null) return []
      return node.matterManager.getCommissionedNodesDetails()
    }

    node.getNodeStructure = (_nodeId) => {
      if (node.matterManager === null) throw new Error('Matter controller not started')
      return node.matterManager.getNodeStructure(_nodeId)
    }

    node.commission = async (_pairingCode, _options = {}) => {
      if (node.matterManager === null) throw new Error('Matter controller not started')
      return node.matterManager.commission(_pairingCode, _options)
    }

    node.removeCommissionedNode = async (_nodeId) => {
      if (node.matterManager === null) throw new Error('Matter controller not started')
      return node.matterManager.removeNode(_nodeId)
    }

    node.renameCommissionedNode = async (_nodeId, _label) => {
      if (node.matterManager === null) throw new Error('Matter controller not started')
      return node.matterManager.renameNode(_nodeId, _label)
    }

    const withStoppedController = async (operation) => {
      if (node.storageOperation !== null) throw new Error('Another Matter storage operation is already running')
      node.storageOperation = (async () => {
        if (node.matterManager !== null) await node.matterManager.close()
        node.matterManager = null
        try {
          return await operation()
        } finally {
          await node.initMatterConnection()
        }
      })()
      try { return await node.storageOperation } finally { node.storageOperation = null }
    }

    node.exportMatterStorage = () => withStoppedController(() => exportMatterStorage({
      storagePath: node.matterStoragePath,
      instanceId: node.matterInstanceId,
      kind: 'controller',
      protocolVersion: Specification.REVISION,
      packageVersion: matterPackageVersion
    }))

    node.importMatterStorage = (backup) => withStoppedController(() => importMatterStorage({
      storagePath: node.matterStoragePath,
      instanceId: node.matterInstanceId,
      kind: 'controller',
      backup
    }))
    // END functions called from the nodes -------------------------------------------------------------

    node.addClient = (_Node) => {
      try {
        if (node.nodeClients.filter((x) => x.id === _Node.id).length !== 0) return
        node.nodeClients.push(_Node)
        if (node.linkStatus !== 'connected') {
          safeClientCall(_Node, () => _Node.setNodeStatusMatter({
            fill: 'grey',
            shape: 'ring',
            text: 'Waiting for Matter controller'
          }), 'setNodeStatusMatter')
          return
        }
        safeClientCall(_Node, () => _Node.setNodeStatusMatter({
          fill: 'green',
          shape: 'ring',
          text: 'Ready'
        }), 'setNodeStatusMatter')
        // If the paired node already has values in cache, do the initial read straight away
        safeClientCall(_Node, () => _Node.handleMatterNodeInitialized(), 'handleMatterNodeInitialized')
      } catch (error) {
        node.sysLogger?.error(`matter-config: addClient error: ${error.message}`)
      }
    }

    node.removeClient = (_Node) => {
      try {
        node.nodeClients = node.nodeClients.filter((x) => x.id !== _Node.id)
      } catch (error) {
        /* empty */
      }
    }

    node.on('close', (done) => {
      try {
        node.nodeClients = []
        if (node.timerMatterConfigCheckState !== null) clearTimeout(node.timerMatterConfigCheckState);
        (async () => {
          try {
            if (node.matterManager !== null) await node.matterManager.close()
            node.matterManager = null
            node.sysLogger = null
            done()
          } catch (error) {
            done()
          }
        })()
      } catch (error) {
        done()
      }
    })
  }
  RED.nodes.registerType('matter-config', matterConfig)
}
