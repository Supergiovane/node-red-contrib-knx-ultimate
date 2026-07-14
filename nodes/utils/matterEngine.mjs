/* eslint-disable max-len */
import { EventEmitter } from 'events'
import dns from 'dns/promises'
import { setTimeout as pleaseWait } from 'timers/promises'

// Last 4 hex chars of an id-ish string (serial, uniqueId, mDNS name...), uppercased.
// Used to disambiguate identical device names (Shelly encode the MAC in the serial).
const shortHexSuffix = (value) => {
  if (value === undefined || value === null) return ''
  const hex = String(value).replace(/[^0-9a-fA-F]/g, '')
  if (hex.length >= 4) return hex.slice(-4).toUpperCase()
  const alnum = String(value).replace(/[^0-9a-zA-Z]/g, '')
  return alnum.length >= 4 ? alnum.slice(-4).toUpperCase() : alnum.toUpperCase()
}

const normalizeHostForCompare = (value) => {
  if (value === undefined || value === null) return ''
  return String(value).trim().toLowerCase().replace(/^\[/, '').replace(/\]$/, '').split('%')[0]
}

// Wrapper around the matter.js CommissioningController.
// It mirrors the contract of hueEngine.mjs: an EventEmitter with a command queue,
// emitting 'connected', 'disconnected', 'event' (attribute changes), 'matterEvent' (cluster events),
// 'nodeState' and 'structureChanged'.
class classMatter extends EventEmitter {
  constructor (_storagePath, _instanceId, _fabricLabel, _sysLogger, { startQueue = true } = {}) {
    super()
    this.matterConnectionStatus = 'disconnected'
    this.storagePath = _storagePath
    this.instanceId = _instanceId
    this.fabricLabel = _fabricLabel || 'KNX-Ultimate'
    this.sysLogger = _sysLogger
    this.controller = null
    this.pairedNodes = new Map() // nodeId (string) -> PairedNode
    this.commandQueue = []
    this.queueMaxLength = 2000
    this.exitAllQueues = false
    this._api = null // Lazy loaded matter.js exports
    this._logThrottle = new Map()
    if (startQueue) this.handleQueue()
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
    const { Environment, StorageService, Logger, LogLevel } = await import('@matter/main')
    const { Seconds } = await import('@matter/general')
    const { CommissioningController, NodeStates } = await import('@project-chip/matter.js')
    const { ManualPairingCodeCodec, QrPairingCodeCodec, NodeId } = await import('@matter/main/types')
    const { BasicInformation, GeneralCommissioning } = await import('@matter/main/clusters')
    this._api = {
      Environment, StorageService, Logger, LogLevel, Seconds, CommissioningController, NodeStates, ManualPairingCodeCodec, QrPairingCodeCodec, NodeId, BasicInformation, GeneralCommissioning
    }
    return this._api
  }

  _resolveTargetHosts = async (_targetHost) => {
    const host = normalizeHostForCompare(_targetHost)
    if (host === '') return []
    const ret = new Set([host])
    try {
      const entries = await dns.lookup(host, { all: true })
      entries.forEach((entry) => {
        const address = normalizeHostForCompare(entry.address)
        if (address !== '') ret.add(address)
      })
    } catch (error) { /* Host may already be an IP or only resolvable by Matter/mDNS. */ }
    return Array.from(ret)
  }

  _deviceHasTargetHost = (device, targetHosts) => {
    if (!Array.isArray(targetHosts) || targetHosts.length === 0) return false
    try {
      return (device.addresses || []).some((address) => targetHosts.includes(normalizeHostForCompare(address.ip)))
    } catch (error) {
      return false
    }
  }

  _discoverCommissionableDeviceAtHost = async (identifierData, discoveryCapabilities, targetHost) => {
    const targetHosts = await this._resolveTargetHosts(targetHost)
    if (targetHosts.length === 0) return undefined
    const devices = await this.controller.discoverCommissionableDevices(
      identifierData,
      discoveryCapabilities,
      undefined,
      this._api.Seconds(20)
    )
    return devices.find((device) => this._deviceHasTargetHost(device, targetHosts))
  }

  _buildKnownAddressDiscoveryAttempts = (identifierData, discoveryCapabilities, targetHost) => {
    const host = normalizeHostForCompare(targetHost)
    if (host === '') return []
    // Matter devices normally listen for commissioning on UDP/5540. Shelly's HTTP RPC
    // gives us the device IP, not its mDNS service port, so try the standard PASE port
    // before falling back to mDNS-filtered discovery.
    return [{
      identifierData,
      discoveryCapabilities,
      knownAddress: {
        ip: host,
        port: 5540,
        type: 'udp'
      }
    }, {
      identifierData,
      discoveryCapabilities,
      knownAddress: {
        ip: host,
        port: 5540
      }
    }]
  }

  _allocateCommissionNodeId = () => {
    const commissioned = new Set()
    try {
      this.controller.getCommissionedNodes().forEach((nodeId) => commissioned.add(nodeId.toString()))
    } catch (error) { /* empty */ }
    try {
      if (this.controller.nodeId !== undefined) commissioned.add(this.controller.nodeId.toString())
    } catch (error) { /* empty */ }
    for (let index = 0; index < 100; index++) {
      const nodeId = this._api.NodeId.randomOperationalNodeId(this.controller.crypto)
      if (!commissioned.has(nodeId.toString())) return nodeId
    }
    throw new Error('Unable to allocate a free Matter Node ID for commissioning')
  }

  nodeStateToString = (state) => {
    try {
      const { NodeStates } = this._api
      switch (state) {
        case NodeStates.Connected: return 'connected'
        case NodeStates.Disconnected: return 'disconnected'
        case NodeStates.Reconnecting: return 'reconnecting'
        case NodeStates.WaitingForDeviceDiscovery: return 'waitingfordiscovery'
        default: return `unknown (${state})`
      }
    } catch (error) {
      return `unknown (${state})`
    }
  }

  Connect = async () => {
    const api = await this._loadApi()
    try {
      // Quiet down the very verbose default matter.js console logging.
      api.Logger.level = api.LogLevel.ERROR
    } catch (error) { /* empty */ }
    const { withEnvironmentLock } = await import('./matterEnvironmentLock.mjs')
    // Serialize with the Matter Bridge engine: both write Environment.default.vars
    // ('storage.path') before creating their matter.js node, and that Environment is a
    // process-wide singleton. See matterEnvironmentLock.mjs for why this matters.
    await withEnvironmentLock(async () => {
      const environment = api.Environment.default
      environment.vars.set('storage.path', this.storagePath)
      this.controller = new api.CommissioningController({
        environment: { environment, id: this.instanceId },
        autoConnect: false,
        adminFabricLabel: this.fabricLabel
      })
      await this.controller.start()
    })
    this.matterConnectionStatus = 'connected'
    this.emit('connected')
    // Connect all already commissioned nodes and hook their events.
    const nodeIds = this.controller.getCommissionedNodes()
    for (let index = 0; index < nodeIds.length; index++) {
      try {
        await this._attachNode(nodeIds[index])
      } catch (error) {
        this._log('error', `classMatter: Connect: cannot attach node ${nodeIds[index]}: ${error.message}`)
      }
    }
  }

  _attachNode = async (_nodeId) => {
    const key = _nodeId.toString()
    const node = await this.controller.getNode(_nodeId)
    this.pairedNodes.set(key, node)
    if (node.__knxUltimateHooked !== true) {
      node.__knxUltimateHooked = true
      node.events.attributeChanged.on((data) => {
        try {
          this.emit('event', {
            nodeId: key,
            endpointId: Number(data.path.endpointId),
            clusterId: Number(data.path.clusterId),
            attributeId: Number(data.path.attributeId),
            attributeName: data.path.attributeName,
            value: data.value
          })
        } catch (error) {
          this._logThrottled('error', 'matter:attrchanged', `classMatter: attributeChanged handler: ${error.message}`)
        }
      })
      node.events.eventTriggered.on((data) => {
        try {
          this.emit('matterEvent', {
            nodeId: key,
            endpointId: Number(data.path.endpointId),
            clusterId: Number(data.path.clusterId),
            eventId: Number(data.path.eventId),
            eventName: data.path.eventName,
            events: data.events
          })
        } catch (error) {
          this._logThrottled('error', 'matter:eventtriggered', `classMatter: eventTriggered handler: ${error.message}`)
        }
      })
      node.events.stateChanged.on((state) => {
        try {
          this.emit('nodeState', key, this.nodeStateToString(state))
        } catch (error) { /* empty */ }
      })
      node.events.structureChanged.on(() => {
        try {
          this.emit('structureChanged', key)
        } catch (error) { /* empty */ }
      })
      node.events.initializedFromRemote?.on(() => {
        try {
          this.emit('nodeInitialized', key)
        } catch (error) { /* empty */ }
      })
    }
    try {
      node.connect() // Establishes connection and auto-subscribes to all attributes/events
    } catch (error) {
      this._log('warn', `classMatter: _attachNode connect ${key}: ${error.message}`)
    }
    return node
  }

  // Commission (pair) a new device using an 11-digit manual pairing code or a QR code string (MT:...)
  commission = async (_pairingCode, _options = {}) => {
    if (this.controller === null) throw new Error('Matter controller not started')
    const api = await this._loadApi()
    const code = (_pairingCode || '').toString().trim()
    if (code === '') throw new Error('Empty pairing code')
    let passcode
    let identifierData
    const discoveryCapabilities = { onIpNetwork: true }
    if (code.toUpperCase().startsWith('MT:')) {
      const qr = api.QrPairingCodeCodec.decode(code)[0]
      passcode = qr.passcode
      identifierData = { longDiscriminator: qr.discriminator }
    } else {
      const manual = api.ManualPairingCodeCodec.decode(code.replace(/[^0-9]/g, ''))
      passcode = manual.passcode
      identifierData = { shortDiscriminator: manual.shortDiscriminator }
    }
    let nodeId
    try {
      const commissioningNodeId = this._allocateCommissionNodeId()
      this._log('info', `classMatter: commission: using Node ID ${commissioningNodeId.toString()} for new device`)
      let discovery = {
        identifierData,
        discoveryCapabilities
      }
      const targetHost = (_options?.targetHost || '').toString().trim()
      if (targetHost !== '') {
        const commissionableDevice = await this._discoverCommissionableDeviceAtHost(identifierData, discoveryCapabilities, targetHost)
        discovery = commissionableDevice !== undefined
          ? {
              commissionableDevice,
              discoveryCapabilities
            }
          : undefined
      }
      const discoveryAttempts = discovery !== undefined
        ? [discovery]
        : this._buildKnownAddressDiscoveryAttempts(identifierData, discoveryCapabilities, targetHost)
      let lastError
      for (const discoveryAttempt of discoveryAttempts) {
        try {
          nodeId = await this.controller.commissionNode({
            commissioning: {
              nodeId: commissioningNodeId,
              regulatoryLocation: api.GeneralCommissioning.RegulatoryLocationType.IndoorOutdoor
            },
            discovery: discoveryAttempt,
            passcode
          }, { connectNodeAfterCommissioning: false })
          lastError = undefined
          break
        } catch (error) {
          lastError = error
        }
      }
      if (nodeId === undefined) {
        if (targetHost !== '' && discoveryAttempts.length > 0) {
          throw new Error(`No commissionable Matter device matching this pairing code could be commissioned at ${targetHost}. Direct PASE on UDP/5540 and mDNS discovery both failed.${lastError ? ` Last error: ${lastError.message || lastError}` : ''}`)
        }
        throw lastError || new Error('Matter commissioning failed')
      }
    } catch (error) {
      // The 11-digit MANUAL code carries only the 4-bit short discriminator, so several
      // identical devices (e.g. same-model Shelly) look alike to discovery: it can reach
      // the WRONG one — typically the first, already-commissioned device — and fail with a
      // "node ID already commissioned" conflict. Point the user to the QR code.
      const msg = String((error && error.message) || error)
      const isManual = !code.toUpperCase().startsWith('MT:')
      if (/already commissioned|can not be reused/i.test(msg)) {
        throw new Error(`${msg} — the commissioner reached a device that is ALREADY paired to this controller.${isManual ? ' The MANUAL code can reach the wrong identical device (short discriminator): use the QR code (MT:...) to target the exact one.' : ''} If you really mean this device, factory-reset it (or unpair that node) and try again. Pair one device at a time.`)
      }
      if (isManual) {
        throw new Error(`${msg} — tip: the MANUAL code can't tell identical devices apart (short discriminator). Use the QR code (MT:...) for a precise match, pair one device at a time, and factory-reset the device if it is already commissioned elsewhere.`)
      }
      throw error
    }
    try {
      await this._attachNode(nodeId)
    } catch (error) {
      // Pairing succeeded: never report it as failed just because the first connection
      // attempt errored. The node will be attached again at the next controller start.
      this._log('warn', `classMatter: commission: node ${nodeId} paired but not yet attached: ${error.message}`)
    }
    return nodeId.toString()
  }

  // Decommission (unpair) a device. Falls back to forced removal if the device is unreachable.
  removeNode = async (_nodeIdString) => {
    if (this.controller === null) throw new Error('Matter controller not started')
    const api = await this._loadApi()
    const nodeId = api.NodeId(BigInt(_nodeIdString))
    const node = this.pairedNodes.get(_nodeIdString)
    try {
      if (node !== undefined) {
        await node.decommission()
      } else {
        await this.controller.removeNode(nodeId, true)
      }
    } catch (error) {
      this._log('warn', `classMatter: removeNode: decommission failed (${error.message}), forcing removal`)
      await this.controller.removeNode(nodeId, false)
    }
    this.pairedNodes.delete(_nodeIdString)
    this.commandQueue = this.commandQueue.filter((el) => el.nodeId !== _nodeIdString)
  }

  // Returns [{ nodeId, name, vendorName, productName, connectionState }]
  getCommissionedNodesDetails = () => {
    if (this.controller === null) return []
    const retArray = []
    let details = []
    try {
      details = this.controller.getCommissionedNodesDetails()
    } catch (error) {
      this._log('warn', `classMatter: getCommissionedNodesDetails: ${error.message}`)
    }
    details.forEach((detail) => {
      try {
        const key = detail.nodeId.toString()
        const node = this.pairedNodes.get(key)
        let basicInfo = detail.basicInformationData || detail.deviceData?.basicInformation || {}
        try {
          if (node !== undefined && node.basicInformation !== undefined) basicInfo = node.basicInformation
        } catch (error) { /* empty */ }
        let connectionState = 'disconnected'
        try {
          if (node !== undefined) connectionState = this.nodeStateToString(node.connectionState)
        } catch (error) { /* empty */ }
        // Name: prefer the user-assigned label; otherwise fall back to the model and
        // append a short unique suffix so identical devices (e.g. several Shelly of the
        // same model) are distinguishable. Shelly expose their MAC in the serial number,
        // so its last 4 hex chars are effectively the "last 4 of the MAC" other apps show.
        const userLabel = basicInfo.nodeLabel || basicInfo.productLabel
        const baseName = userLabel || basicInfo.productName || detail.advertisedName || `Node ${key}`
        let displayName = baseName
        if (!userLabel) {
          const idSource = basicInfo.serialNumber || basicInfo.uniqueId || detail.advertisedName || key
          const suffix = shortHexSuffix(idSource)
          if (suffix && !baseName.toUpperCase().includes(suffix)) displayName = `${baseName} (${suffix})`
        }
        retArray.push({
          nodeId: key,
          name: displayName,
          vendorName: basicInfo.vendorName || '',
          productName: basicInfo.productName || '',
          serialNumber: basicInfo.serialNumber || '',
          connectionState
        })
      } catch (error) {
        this._log('warn', `classMatter: getCommissionedNodesDetails item: ${error.message}`)
      }
    })
    return retArray
  }

  _walkEndpoints = (endpoint, _callback) => {
    _callback(endpoint)
    try {
      const parts = endpoint.parts
      if (parts !== undefined) {
        parts.forEach((child) => {
          this._walkEndpoints(child, _callback)
        })
      }
    } catch (error) { /* empty */ }
  }

  _getAllEndpoints = (node) => {
    const endpoints = []
    try {
      node.getDevices().forEach((device) => {
        this._walkEndpoints(device, (ep) => {
          if (ep.number !== undefined && !endpoints.some((e) => e.number === ep.number)) endpoints.push(ep)
        })
      })
    } catch (error) {
      this._log('warn', `classMatter: _getAllEndpoints: ${error.message}`)
    }
    return endpoints
  }

  _findEndpoint = (node, _endpointId) => {
    return this._getAllEndpoints(node).find((ep) => Number(ep.number) === Number(_endpointId))
  }

  _findClusterClient = (node, _endpointId, _clusterId) => {
    try {
      const endpoint = this._findEndpoint(node, _endpointId)
      if (endpoint === undefined) return undefined
      return endpoint.getAllClusterClients().find((cc) => Number(cc.id) === Number(_clusterId))
    } catch (error) {
      this._logThrottled('warn', 'matter:findcluster', `classMatter: _findClusterClient: ${error.message}`)
      return undefined
    }
  }

  // Returns the full structure of a commissioned node: endpoints, clusters, attributes (with cached values) and commands.
  // Used by the editor UI to let the user pick the mapping targets.
  getNodeStructure = (_nodeIdString) => {
    const node = this.pairedNodes.get(_nodeIdString)
    if (node === undefined) throw new Error(`Matter node ${_nodeIdString} unknown or not yet connected`)
    const retEndpoints = []
    this._getAllEndpoints(node).forEach((endpoint) => {
      let deviceTypes = []
      try {
        deviceTypes = endpoint.getDeviceTypes().map((dt) => dt.name)
      } catch (error) { /* empty */ }
      const clusters = []
      let clusterClients = []
      try {
        clusterClients = endpoint.getAllClusterClients()
      } catch (error) {
        this._logThrottled('warn', 'matter:structure:clients', `classMatter: getNodeStructure getAllClusterClients: ${error.message}`)
      }
      clusterClients.forEach((cc) => {
        try {
          const attributes = []
          Object.keys(cc.attributes).forEach((attrName) => {
            try {
              if (/^\d+$/.test(attrName)) return // Skip numeric aliases
              if (typeof cc.isAttributeSupportedByName === 'function' && !cc.isAttributeSupportedByName(attrName)) return
              // Skip the global meta attributes (FeatureMap, AttributeList, ClusterRevision...):
              // they are useless for KNX mappings and only confuse the user.
              if (Number(cc.attributes[attrName].id) >= 65528) return
              let value
              try {
                value = cc.attributes[attrName].getLocal()
              } catch (error) { value = undefined }
              attributes.push({ name: attrName, id: Number(cc.attributes[attrName].id), value: this._jsonSafe(value) })
            } catch (error) { /* empty */ }
          })
          const commands = []
          Object.keys(cc.commands).forEach((cmdName) => {
            try {
              if (/^\d+$/.test(cmdName)) return
              if (typeof cc.isCommandSupportedByName === 'function' && !cc.isCommandSupportedByName(cmdName)) return
              commands.push({ name: cmdName })
            } catch (error) { /* empty */ }
          })
          clusters.push({
            id: Number(cc.id),
            name: cc.name,
            attributes,
            commands
          })
        } catch (error) {
          this._logThrottled('warn', 'matter:structure', `classMatter: getNodeStructure cluster error: ${error.message}`)
        }
      })
      try {
        retEndpoints.push({
          endpointId: Number(endpoint.number),
          name: endpoint.name,
          deviceTypes,
          clusters
        })
      } catch (error) {
        this._logThrottled('warn', 'matter:structure:endpoint', `classMatter: getNodeStructure endpoint error: ${error.message}`)
      }
    })
    return { nodeId: _nodeIdString, endpoints: retEndpoints }
  }

  _jsonSafe = (value) => {
    try {
      return JSON.parse(JSON.stringify(value, (k, v) => (typeof v === 'bigint' ? v.toString() : v)))
    } catch (error) {
      return undefined
    }
  }

  // Read an attribute value. By default returns the locally cached (subscribed) value.
  readAttribute = async (_nodeIdString, _endpointId, _clusterId, _attributeName, _requestFromRemote = false) => {
    const node = this.pairedNodes.get(_nodeIdString)
    if (node === undefined) throw new Error(`Matter node ${_nodeIdString} unknown or not yet connected`)
    const clusterClient = this._findClusterClient(node, _endpointId, _clusterId)
    if (clusterClient === undefined) throw new Error(`Cluster ${_clusterId} not found on endpoint ${_endpointId}`)
    const attribute = clusterClient.attributes[_attributeName]
    if (attribute === undefined) throw new Error(`Attribute ${_attributeName} not found in cluster ${clusterClient.name}`)
    return attribute.get(_requestFromRemote)
  }

  // Synchronous read of the locally cached attribute value (undefined if not yet received).
  getCachedAttribute = (_nodeIdString, _endpointId, _clusterId, _attributeName) => {
    try {
      const node = this.pairedNodes.get(_nodeIdString)
      if (node === undefined) return undefined
      const clusterClient = this._findClusterClient(node, _endpointId, _clusterId)
      if (clusterClient === undefined) return undefined
      const attribute = clusterClient.attributes[_attributeName]
      if (attribute === undefined) return undefined
      return attribute.getLocal()
    } catch (error) {
      return undefined
    }
  }

  renameNode = async (_nodeIdString, _label) => {
    const label = (_label || '').toString().trim()
    if (label === '') throw new Error('Empty Matter device name')
    if (label.length > 64) throw new Error('Matter device name is too long')
    const node = this.pairedNodes.get(_nodeIdString)
    if (node === undefined) throw new Error(`Matter node ${_nodeIdString} unknown or not yet connected`)
    let clusterClient
    try {
      if (typeof node.getRootClusterClient === 'function') clusterClient = node.getRootClusterClient(this._api.BasicInformation)
    } catch (error) { /* empty */ }
    if (clusterClient === undefined) clusterClient = this._findClusterClient(node, 0, 40) // BasicInformation on the root endpoint
    if (clusterClient === undefined) throw new Error(`BasicInformation cluster not found on node ${_nodeIdString}`)
    const attribute = clusterClient.attributes.nodeLabel
    if (attribute === undefined) throw new Error(`nodeLabel attribute not found on node ${_nodeIdString}`)
    await attribute.set(label)
    return label
  }

  _enqueueCommand = (command) => {
    if (!command) return false
    if (!Array.isArray(this.commandQueue)) this.commandQueue = []
    this.commandQueue.unshift(command)
    if (this.commandQueue.length > this.queueMaxLength) {
      this.commandQueue.splice(this.queueMaxLength)
      this._logThrottled('warn', 'matter:queue:overflow', `Matter command queue overflow: capped at ${this.queueMaxLength}`, 60000)
    }
    return true
  }

  // Add a command or attribute write to the queue.
  // _item: { nodeId, endpointId, clusterId, kind: 'command'|'attributeWrite', name, args }
  writeMatterQueueAdd = async (_item) => {
    return this._enqueueCommand(_item)
  }

  deleteMatterQueue = async (_nodeIdString) => {
    this.commandQueue = this.commandQueue.filter((el) => el.nodeId !== _nodeIdString)
  }

  processQueueItem = async () => {
    let item = null
    try {
      if (this.matterConnectionStatus !== 'connected') return
      item = this.commandQueue.pop()
      if (!item) return
      const node = this.pairedNodes.get(item.nodeId)
      if (node === undefined) throw new Error(`Matter node ${item.nodeId} unknown or not yet connected`)
      const clusterClient = this._findClusterClient(node, item.endpointId, item.clusterId)
      if (clusterClient === undefined) throw new Error(`Cluster ${item.clusterId} not found on endpoint ${item.endpointId} of node ${item.nodeId}`)
      if (item.kind === 'attributeWrite') {
        const attribute = clusterClient.attributes[item.name]
        if (attribute === undefined) throw new Error(`Attribute ${item.name} not found in cluster ${clusterClient.name}`)
        await attribute.set(item.args)
      } else {
        const command = clusterClient.commands[item.name]
        if (typeof command !== 'function') throw new Error(`Command ${item.name} not found in cluster ${clusterClient.name}`)
        await command(item.args)
      }
    } catch (error) {
      const target = item ? `${item.nodeId}/${item.endpointId}/${item.clusterId}/${item.name}` : 'unknown'
      this._logThrottled('error', `matter:queue:error:${target}`, `classMatter: processQueueItem (${target}): ${error.message}`, 30000)
      this.emit('commandError', { item, error: error.message })
    }
  }

  handleQueue = async () => {
    do {
      if (this.matterConnectionStatus === 'connected' && this.commandQueue && this.commandQueue.length > 0) {
        try {
          await this.processQueueItem()
        } catch (error) { /* empty */ }
      }
      await pleaseWait(150)
    } while (!this.exitAllQueues)
  }

  close = async () => {
    this.exitAllQueues = true
    this.commandQueue = []
    this._logThrottle.clear()
    this.matterConnectionStatus = 'disconnected'
    try {
      if (this.controller !== null) await this.controller.close()
    } catch (error) {
      this._log('warn', `classMatter: close: ${error.message}`)
    }
    this.controller = null
    this.pairedNodes.clear()
  }
}

export { classMatter }
