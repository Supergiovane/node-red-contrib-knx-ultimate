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

// The running Matter servers, keyed by config node id. Kept OUTSIDE the node lifecycle:
// a re-deploy must NOT restart the Matter server, otherwise the paired controllers
// resume their session without re-reading the structure and never see device changes.
// The devices are reconciled live instead; the server is closed only when the config
// node is deleted/disabled.
const runningBridges = new Map()

module.exports = (RED) => {
  function matterBridgeConfig (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.loglevel = config.loglevel !== undefined ? config.loglevel : 'error'
    node.sysLogger = null
    try {
      node.sysLogger = loggerSetup({ loglevel: node.loglevel, setPrefix: 'matterbridge-config.js' })
    } catch (error) { console.log(error.stack) }

    node.name = config.name === undefined || config.name === '' ? 'Matter Bridge' : config.name
    node.bridgePort = Number(config.bridgePort) || 5540
    // Name advertised to the Matter controllers (Alexa/Google honor it; Apple Home forces manual naming).
    // If left empty, fall back to this config node's own name so the bridge is never anonymous.
    node.bridgeDeviceName = config.bridgeDeviceName === undefined || config.bridgeDeviceName === '' ? node.name : config.bridgeDeviceName
    node.matterInstanceId = `knxultimate-bridge-${node.id.replace(/[^a-zA-Z0-9]/g, '')}`
    node.matterStoragePath = path.join(RED.settings.userDir || '.', 'knxultimatestorage', 'matter')

    node.matterBridge = null
    node.deviceClients = new Map() // matterDeviceId -> device node
    let startupTimer = null
    let reconcileTimer = null
    let closing = false
    let storageOperation = null

    Object.defineProperty(node, 'linkStatus', {
      get: function () {
        return node.matterBridge?.bridgeStatus === 'running' ? 'running' : 'stopped'
      }
    })

    const safeClientCall = (client, fn, label) => {
      try {
        if (!client || typeof fn !== 'function') return
        const result = fn()
        if (result && typeof result.catch === 'function') {
          result.catch((error) => node.sysLogger?.warn(`Matter bridge client ${label} async error: ${error.message}`))
        }
      } catch (error) {
        node.sysLogger?.warn(`Matter bridge client ${label} error: ${error.message}`)
      }
    }

    // Desired device definitions built from the currently registered device nodes.
    const buildDeviceDefs = () => {
      const defs = []
      node.deviceClients.forEach((client) => {
        try {
          const def = typeof client.getMatterDef === 'function' ? client.getMatterDef() : undefined
          if (def && def.id && def.type) defs.push(def)
        } catch (error) { /* empty */ }
      })
      return defs
    }

    // Notify every registered device node that the bridge status changed.
    const notifyClientsStatus = () => {
      node.deviceClients.forEach((client) => {
        safeClientCall(client, () => client.handleBridgeStatus(), 'handleBridgeStatus')
      })
    }

    const bindEngineEvents = (engine) => {
      engine.removeAllListeners()
      // An EventEmitter "error" without a listener terminates Node-RED.
      engine.on('error', (error) => {
        node.sysLogger?.error(`Matter bridge engine error: ${error?.message || error}`)
      })
      // Matter -> KNX: a controller (Alexa...) sent a command to a bridged device.
      // Route it to the device node that owns that Matter device.
      engine.on('command', (command) => {
        try {
          const client = node.deviceClients.get(command.deviceId)
          if (client === undefined) return
          safeClientCall(client, () => client.handleMatterCommand(command), 'handleMatterCommand')
        } catch (error) {
          node.sysLogger?.warn(`matterbridge-config: command routing error: ${error.message}`)
        }
      })
      engine.on('commissioned', () => notifyClientsStatus())
      engine.on('decommissioned', () => notifyClientsStatus())
      engine.on('fabricsChanged', () => notifyClientsStatus())
      engine.on('online', () => notifyClientsStatus())
    }

    // Reconcile the exposed devices with the currently registered device nodes.
    const scheduleReconcile = () => {
      if (reconcileTimer !== null) clearTimeout(reconcileTimer)
      reconcileTimer = setTimeout(() => {
        (async () => {
          try {
            if (node.matterBridge === null || node.matterBridge.bridgeStatus !== 'running') return
            await node.matterBridge.reconcileDevices(buildDeviceDefs())
            notifyClientsStatus()
          } catch (error) {
            node.sysLogger?.warn(`matterbridge-config: reconcile error: ${error.message}`)
          }
        })().catch((error) => node.sysLogger?.warn(`matterbridge-config: reconcile callback error: ${error.message}`))
      }, 1500)
    }

    const ensureEngineStarted = async () => {
      try {
        const { classMatterBridge } = await import('./utils/matterBridgeEngine.mjs')
        const existing = runningBridges.get(node.id)

        if (existing !== undefined && existing.bridgeStatus === 'running' &&
          Number(existing.options.port) === node.bridgePort &&
          existing.options.deviceName === node.bridgeDeviceName) {
          // Re-deploy: reuse the running Matter server and reconcile the devices live.
          node.matterBridge = existing
          bindEngineEvents(existing)
          await existing.reconcileDevices(buildDeviceDefs())
          notifyClientsStatus()
          return
        }

        if (existing !== undefined) {
          // Port or bridge name changed: a full restart is unavoidable.
          try {
            existing.removeAllListeners()
            await existing.close()
          } catch (error) { /* empty */ }
          runningBridges.delete(node.id)
        }

        const engine = new classMatterBridge(node.matterStoragePath, node.matterInstanceId, {
          info: (m) => node.sysLogger?.info(m),
          warn: (m) => node.sysLogger?.warn(m),
          error: (m) => node.sysLogger?.error(m),
          debug: (m) => node.sysLogger?.debug(m)
        }, { port: node.bridgePort, deviceName: node.bridgeDeviceName })
        runningBridges.set(node.id, engine)
        node.matterBridge = engine
        bindEngineEvents(engine)
        await engine.start(buildDeviceDefs())
        notifyClientsStatus()
      } catch (error) {
        node.sysLogger?.error(`matterbridge-config: ensureEngineStarted error: ${error.message}`)
      }
    }

    // The Matter server is started shortly after boot, giving the device nodes the
    // time to register themselves during flow initialization.
    startupTimer = setTimeout(() => {
      (async () => {
        if (closing) return
        await ensureEngineStarted()
      })().catch((error) => node.sysLogger?.error(`matterbridge-config: startup callback error: ${error.message}`))
    }, 5000)

    // Functions called from the device nodes -----------------------------------------
    node.registerDevice = (client) => {
      try {
        if (!client || !client.matterDeviceId) return
        node.deviceClients.set(client.matterDeviceId, client)
        scheduleReconcile()
      } catch (error) {
        node.sysLogger?.warn(`matterbridge-config: registerDevice error: ${error.message}`)
      }
    }

    node.unregisterDevice = (client) => {
      try {
        if (!client || !client.matterDeviceId) return
        node.deviceClients.delete(client.matterDeviceId)
        scheduleReconcile()
      } catch (error) { /* empty */ }
    }

    node.setDeviceState = async (deviceId, fn, value) => {
      if (node.matterBridge === null) return false
      return node.matterBridge.setDeviceState(deviceId, fn, value)
    }

    node.getPairingInfo = () => {
      if (node.matterBridge === null) return { running: false }
      return node.matterBridge.getPairingInfo()
    }

    node.factoryResetBridge = async () => {
      if (node.matterBridge === null) throw new Error('Matter bridge not started')
      await node.matterBridge.factoryReset()
      notifyClientsStatus()
    }

    const withStoppedBridge = async (operation) => {
      if (storageOperation !== null) throw new Error('Another Matter storage operation is already running')
      storageOperation = (async () => {
        const engine = node.matterBridge
        if (engine !== null) {
          engine.removeAllListeners()
          await engine.close()
          runningBridges.delete(node.id)
          node.matterBridge = null
        }
        try {
          return await operation()
        } finally {
          await ensureEngineStarted()
        }
      })()
      try { return await storageOperation } finally { storageOperation = null }
    }

    node.exportMatterStorage = () => withStoppedBridge(() => exportMatterStorage({
      storagePath: node.matterStoragePath,
      instanceId: node.matterInstanceId,
      kind: 'bridge',
      protocolVersion: Specification.REVISION,
      packageVersion: matterPackageVersion
    }))

    node.importMatterStorage = (backup) => withStoppedBridge(() => importMatterStorage({
      storagePath: node.matterStoragePath,
      instanceId: node.matterInstanceId,
      kind: 'bridge',
      backup
    }))
    // END functions called from the device nodes -------------------------------------

    node.on('close', (removed, done) => {
      closing = true
      try {
        if (startupTimer !== null) clearTimeout(startupTimer)
        if (reconcileTimer !== null) clearTimeout(reconcileTimer)
      } catch (error) { /* empty */ }
      try {
        if (node.matterBridge !== null) node.matterBridge.removeAllListeners()
      } catch (error) { /* empty */ }
      (async () => {
        try {
          if (removed === true && node.matterBridge !== null) {
            await node.matterBridge.close()
            runningBridges.delete(node.id)
          }
        } catch (error) { /* empty */ }
        node.matterBridge = null
        node.deviceClients.clear()
        node.sysLogger = null
        done()
      })()
    })
  }
  RED.nodes.registerType('matterbridge-config', matterBridgeConfig)
}
