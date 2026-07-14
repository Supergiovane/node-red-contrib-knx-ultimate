/* eslint-disable max-len */
import { EventEmitter } from 'events'

// Wrapper around a matter.js ServerNode acting as a Matter BRIDGE (Aggregator):
// external Matter controllers (Alexa, Google Home, Apple Home...) commission it once
// and see every configured KNX virtual device as a bridged Matter device.
// Mirrors the contract of matterEngine.mjs: an EventEmitter with
// 'online', 'offline', 'commissioned', 'decommissioned', 'fabricsChanged' and
// 'command' ({ deviceId, fn, value }) events.
class classMatterBridge extends EventEmitter {
  constructor (_storagePath, _instanceId, _sysLogger, _options = {}) {
    super()
    this.storagePath = _storagePath
    this.instanceId = _instanceId
    this.sysLogger = _sysLogger
    this.options = {
      port: Number(_options.port) || 5540,
      deviceName: (_options.deviceName || 'KNX-Ultimate Bridge').toString().slice(0, 32)
    }
    this.server = null
    this.aggregator = null
    this.endpoints = new Map() // deviceId -> Endpoint
    this.deviceDefs = new Map() // deviceId -> definition
    this.bridgeStatus = 'stopped' // stopped | running
    this._api = null
    this._factory = null
    this._logThrottle = new Map()
  }

  _log = (level, message) => {
    try {
      const logger = this.sysLogger
      if (logger && typeof logger[level] === 'function') return logger[level](message)
      if (logger && typeof logger.log === 'function') return logger.log(message)
    } catch (error) { /* empty */ }
    if (level === 'error') console.error(message)
    else if (level === 'warn') console.warn(message)
    else console.log(message)
  }

  _logThrottled = (level, throttleKey, message, intervalMs = 30000) => {
    const now = Date.now()
    const entry = this._logThrottle.get(throttleKey) || { last: 0, suppressed: 0 }
    if (this._logThrottle.size > 1000) this._logThrottle.clear()
    if (entry.last === 0 || (now - entry.last) >= intervalMs) {
      const suffix = entry.suppressed > 0 ? ` (suppressed ${entry.suppressed} similar)` : ''
      entry.last = now
      entry.suppressed = 0
      this._logThrottle.set(throttleKey, entry)
      this._log(level, `${message}${suffix}`)
      return
    }
    entry.suppressed += 1
    this._logThrottle.set(throttleKey, entry)
  }

  _loadApi = async () => {
    if (this._api !== null) return this._api
    const { Environment, ServerNode, Endpoint, Logger, LogLevel, VendorId } = await import('@matter/main')
    const { AggregatorEndpoint } = await import('@matter/main/endpoints/aggregator')
    const { QrCode } = await import('@matter/main/types')
    this._factory = await import('./matterBridgeDeviceFactory.mjs')
    this._api = { Environment, ServerNode, Endpoint, Logger, LogLevel, VendorId, AggregatorEndpoint, QrCode }
    return this._api
  }

  // Starts the bridge and exposes the given virtual devices.
  // _deviceDefs: [{ id, type, name }]
  start = async (_deviceDefs = []) => {
    const api = await this._loadApi()
    try {
      api.Logger.level = api.LogLevel.ERROR
    } catch (error) { /* empty */ }
    const { withEnvironmentLock } = await import('./matterEnvironmentLock.mjs')
    // Environment.default (and its 'storage.path' var) is a process-wide singleton shared
    // with the Matter Controller engine: serialize the set+create critical section so a
    // concurrent startup can never observe another engine's storage path mid-flight.
    this.server = await withEnvironmentLock(async () => {
      const environment = api.Environment.default
      environment.vars.set('storage.path', this.storagePath)
      return api.ServerNode.create({
        id: this.instanceId,
        network: { port: this.options.port },
        productDescription: {
          name: this.options.deviceName,
          deviceType: api.AggregatorEndpoint.deviceType
        },
        basicInformation: {
          vendorName: 'KNX-Ultimate',
          vendorId: api.VendorId(0xFFF1), // Test vendor ID
          nodeLabel: this.options.deviceName,
          productName: this.options.deviceName,
          productLabel: this.options.deviceName,
          productId: 0x8000,
          serialNumber: `knxu-${this.instanceId}`.slice(0, 32),
          uniqueId: this.instanceId.slice(-32)
        }
      })
    })

    this.aggregator = new api.Endpoint(api.AggregatorEndpoint, { id: 'aggregator' })
    await this.server.add(this.aggregator)

    for (let index = 0; index < _deviceDefs.length; index++) {
      const def = _deviceDefs[index]
      try {
        await this._addDeviceEndpoint(def)
      } catch (error) {
        this._log('error', `classMatterBridge: cannot add device "${def?.name}" (${def?.type}): ${error.message}`)
      }
    }

    // Commissioning lifecycle events
    try {
      this.server.events.commissioning.commissioned.on(() => {
        try { this.emit('commissioned') } catch (error) { /* empty */ }
      })
      this.server.events.commissioning.decommissioned.on(() => {
        try { this.emit('decommissioned') } catch (error) { /* empty */ }
      })
      this.server.events.commissioning.fabricsChanged.on((fabricIndex, action) => {
        try { this.emit('fabricsChanged', Number(fabricIndex), action) } catch (error) { /* empty */ }
      })
    } catch (error) {
      this._log('warn', `classMatterBridge: cannot hook commissioning events: ${error.message}`)
    }

    await this.server.start()
    this.bridgeStatus = 'running'
    this.emit('online')
    this._log('info', `classMatterBridge: bridge "${this.options.deviceName}" started on port ${this.options.port} with ${this.endpoints.size} device(s)`)
  }

  _addDeviceEndpoint = async (def) => {
    if (!def || !def.id || !def.type) throw new Error('Invalid device definition')
    const endpoint = this._factory.createBridgedEndpoint(def, `knxu-${this.instanceId.slice(-8)}`, (command) => {
      try {
        this.emit('command', command)
      } catch (error) {
        this._logThrottled('error', 'bridge:command', `classMatterBridge: command handler error: ${error.message}`)
      }
    })
    await this.aggregator.add(endpoint)
    this.endpoints.set(def.id, endpoint)
    this.deviceDefs.set(def.id, def)
    return endpoint
  }

  // Removes a bridged device endpoint from the running server.
  removeDeviceEndpoint = async (_deviceId) => {
    const endpoint = this.endpoints.get(_deviceId)
    if (endpoint === undefined) return false
    try {
      await endpoint.close()
    } catch (error) {
      this._log('warn', `classMatterBridge: removeDeviceEndpoint ${_deviceId}: ${error.message}`)
    }
    this.endpoints.delete(_deviceId)
    this.deviceDefs.delete(_deviceId)
    return true
  }

  // Reconciles the exposed devices with a new definition list WITHOUT restarting the server:
  // paired controllers receive the endpoint changes live (PartsList subscription reports),
  // while a full restart would resume the session without re-reading the structure.
  reconcileDevices = async (_deviceDefs = []) => {
    if (this.server === null) throw new Error('Matter bridge not started')
    const newById = new Map(_deviceDefs.filter((d) => d && d.id).map((d) => [d.id, d]))
    // Remove deleted devices; recreate the ones whose type/behavior changed
    const currentIds = Array.from(this.endpoints.keys())
    for (let index = 0; index < currentIds.length; index++) {
      const id = currentIds[index]
      const newDef = newById.get(id)
      const oldDef = this.deviceDefs.get(id)
      const needsRecreate = newDef !== undefined && oldDef !== undefined &&
        (newDef.type !== oldDef.type ||
          (newDef.invertPosition === true) !== (oldDef.invertPosition === true) ||
          (newDef.coverExposeAsDimmableLight === true) !== (oldDef.coverExposeAsDimmableLight === true) ||
          (newDef.hasHeatingSetpoint !== false) !== (oldDef.hasHeatingSetpoint !== false) ||
          (newDef.hasCoolingSetpoint === true) !== (oldDef.hasCoolingSetpoint === true))
      if (newDef === undefined || needsRecreate) {
        await this.removeDeviceEndpoint(id)
      }
    }
    // Add new devices and apply renames on the existing ones
    for (const def of newById.values()) {
      if (!this.endpoints.has(def.id)) {
        try {
          await this._addDeviceEndpoint(def)
        } catch (error) {
          this._log('error', `classMatterBridge: reconcile cannot add "${def.name}" (${def.type}): ${error.message}`)
        }
      } else {
        const oldDef = this.deviceDefs.get(def.id)
        if ((oldDef.name || '') !== (def.name || '')) {
          const name = (def.name || def.type).toString().slice(0, 32)
          try {
            await this.endpoints.get(def.id).set({
              bridgedDeviceBasicInformation: { nodeLabel: name, productName: name, productLabel: name }
            })
          } catch (error) {
            this._log('warn', `classMatterBridge: reconcile rename ${def.id}: ${error.message}`)
          }
        }
        this.deviceDefs.set(def.id, def)
      }
    }
    this._log('info', `classMatterBridge: devices reconciled, now exposing ${this.endpoints.size} device(s)`)
  }

  // KNX -> Matter: applies a KNX status value to the Matter attribute of a virtual device.
  setDeviceState = async (_deviceId, _fn, _knxValue) => {
    try {
      const endpoint = this.endpoints.get(_deviceId)
      const def = this.deviceDefs.get(_deviceId)
      if (endpoint === undefined || def === undefined) return false
      const patch = this._factory.knxValueToMatterPatch(def, _fn, _knxValue)
      if (patch === undefined) return false
      await endpoint.set(patch)
      return true
    } catch (error) {
      this._logThrottled('warn', `bridge:set:${_deviceId}:${_fn}`, `classMatterBridge: setDeviceState ${_deviceId}/${_fn}: ${error.message}`)
      return false
    }
  }

  // Marks a device as reachable/unreachable on the Matter side
  setDeviceReachable = async (_deviceId, _reachable) => {
    try {
      const endpoint = this.endpoints.get(_deviceId)
      if (endpoint === undefined) return false
      await endpoint.set({ bridgedDeviceBasicInformation: { reachable: _reachable === true } })
      return true
    } catch (error) {
      return false
    }
  }

  // Pairing info for the editor: QR code (text + ASCII art), manual code, commissioned fabrics.
  getPairingInfo = () => {
    if (this.server === null) return { running: false }
    try {
      const commissioningState = this.server.state.commissioning
      const fabrics = []
      try {
        Object.values(commissioningState.fabrics || {}).forEach((fabric) => {
          fabrics.push({
            label: fabric.label || '',
            vendorId: Number(fabric.rootVendorId !== undefined ? fabric.rootVendorId : (fabric.vendorId || 0)),
            fabricIndex: Number(fabric.fabricIndex || 0)
          })
        })
      } catch (error) { /* empty */ }
      const info = {
        running: this.bridgeStatus === 'running',
        commissioned: commissioningState.commissioned === true,
        fabrics,
        deviceCount: this.endpoints.size,
        port: this.options.port
      }
      if (commissioningState.commissioned !== true && commissioningState.pairingCodes !== undefined) {
        info.manualPairingCode = commissioningState.pairingCodes.manualPairingCode
        info.qrPairingCode = commissioningState.pairingCodes.qrPairingCode
        try {
          info.qrAscii = this._api.QrCode.get(commissioningState.pairingCodes.qrPairingCode)
        } catch (error) { /* empty */ }
      }
      return info
    } catch (error) {
      this._log('warn', `classMatterBridge: getPairingInfo: ${error.message}`)
      return { running: this.bridgeStatus === 'running', error: error.message }
    }
  }

  // Factory reset: removes all fabrics and commissioning data. The bridge restarts advertising for pairing.
  factoryReset = async () => {
    if (this.server === null) throw new Error('Matter bridge not started')
    await this.server.erase()
    this.emit('decommissioned')
  }

  close = async () => {
    this.bridgeStatus = 'stopped'
    this._logThrottle.clear()
    try {
      if (this.server !== null) await this.server.close()
    } catch (error) {
      this._log('warn', `classMatterBridge: close: ${error.message}`)
    }
    this.server = null
    this.aggregator = null
    this.endpoints.clear()
    this.deviceDefs.clear()
    this.emit('offline')
  }
}

export { classMatterBridge }
