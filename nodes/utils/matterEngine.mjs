/* eslint-disable max-len */
import { EventEmitter } from 'events'
import { setTimeout as pleaseWait } from 'timers/promises'

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
    const { CommissioningController, NodeStates } = await import('@project-chip/matter.js')
    const { ManualPairingCodeCodec, QrPairingCodeCodec, NodeId } = await import('@matter/main/types')
    const { GeneralCommissioning } = await import('@matter/main/clusters')
    this._api = {
      Environment, StorageService, Logger, LogLevel, CommissioningController, NodeStates, ManualPairingCodeCodec, QrPairingCodeCodec, NodeId, GeneralCommissioning
    }
    return this._api
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
    const environment = api.Environment.default
    environment.vars.set('storage.path', this.storagePath)
    this.controller = new api.CommissioningController({
      environment: { environment, id: this.instanceId },
      autoConnect: false,
      adminFabricLabel: this.fabricLabel
    })
    await this.controller.start()
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
  commission = async (_pairingCode) => {
    if (this.controller === null) throw new Error('Matter controller not started')
    const api = await this._loadApi()
    const code = (_pairingCode || '').toString().trim()
    if (code === '') throw new Error('Empty pairing code')
    let passcode
    let identifierData
    if (code.toUpperCase().startsWith('MT:')) {
      const qr = api.QrPairingCodeCodec.decode(code)[0]
      passcode = qr.passcode
      identifierData = { longDiscriminator: qr.discriminator }
    } else {
      const manual = api.ManualPairingCodeCodec.decode(code.replace(/[^0-9]/g, ''))
      passcode = manual.passcode
      identifierData = { shortDiscriminator: manual.shortDiscriminator }
    }
    const nodeId = await this.controller.commissionNode({
      commissioning: {
        regulatoryLocation: api.GeneralCommissioning.RegulatoryLocationType.IndoorOutdoor
      },
      discovery: {
        identifierData,
        discoveryCapabilities: { onIpNetwork: true }
      },
      passcode
    }, { connectNodeAfterCommissioning: false })
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
        let basicInfo = detail.basicInformationData || {}
        try {
          if (node !== undefined && node.basicInformation !== undefined) basicInfo = node.basicInformation
        } catch (error) { /* empty */ }
        let connectionState = 'disconnected'
        try {
          if (node !== undefined) connectionState = this.nodeStateToString(node.connectionState)
        } catch (error) { /* empty */ }
        retArray.push({
          nodeId: key,
          name: basicInfo.nodeLabel || basicInfo.productLabel || basicInfo.productName || detail.advertisedName || `Node ${key}`,
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
