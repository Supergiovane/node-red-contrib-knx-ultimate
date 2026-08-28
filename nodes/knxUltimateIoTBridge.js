const loggerClass = require('./utils/sysLogger')

module.exports = function (RED) {
  function knxUltimateIoTBridge (config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.serverKNX = RED.nodes.getNode(config.server) || undefined

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    if (!node.serverKNX) {
      pushStatus({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX MQTT - IoT'
    node.outputtopic = config.outputtopic || ''

    node.listenallga = true
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'

    node.emitOnChangeOnly = config.emitOnChangeOnly === true
    node.readOnDeploy = config.readOnDeploy === true
    node.acceptFlowInput = config.acceptFlowInput !== false // default true

    node.mappings = Array.isArray(config.mappings) ? config.mappings : []

    // Operation mode: 'iot' (classic IoT mappings, default) or 'homeassistant' (native
    // MQTT bridge with Home Assistant discovery for every group address + cover/climate).
    node.nodeMode = config.nodeMode === 'homeassistant' ? 'homeassistant' : 'iot'
    // Home Assistant bus wiring: 'standalone' (default) talks to the KNX gateway directly,
    // 'flow' uses the node's input/output pins instead (wire a KNXUltimate universal node to
    // both): the input pin feeds KNX bus telegrams in, the output pin emits telegrams to write.
    node.haBusMode = config.haBusMode === 'flow' ? 'flow' : 'standalone'
    node.mqttUrl = typeof config.mqttUrl === 'string' ? config.mqttUrl.trim() : ''
    node.mqttBaseTopic = typeof config.mqttBaseTopic === 'string' && config.mqttBaseTopic.trim() !== '' ? config.mqttBaseTopic.trim() : 'knx-ultimate'
    node.mqttDiscovery = config.mqttDiscovery !== false && config.mqttDiscovery !== 'false'
    node.mqttDiscoveryPrefix = typeof config.mqttDiscoveryPrefix === 'string' && config.mqttDiscoveryPrefix.trim() !== '' ? config.mqttDiscoveryPrefix.trim() : 'homeassistant'
    // Entity name format for the exposed GAs: 'full' (ETS path + name, as imported),
    // 'name-first' (name first, path after), 'name-only' (path removed), 'name-ga' (name + GA).
    node.mqttNameFormat = typeof config.mqttNameFormat === 'string' && config.mqttNameFormat.trim() !== '' ? config.mqttNameFormat.trim() : 'full'
    node.mqttCustomEntities = Array.isArray(config.mqttCustomEntities) ? config.mqttCustomEntities : []
    // Group addresses to expose as simple entities. Once the user curates the list
    // (mqttExposeConfigured), only the listed GAs are exposed; otherwise all imported GAs are.
    node.mqttExposeConfigured = config.mqttExposeConfigured === true
    node.mqttExposedGAs = Array.isArray(config.mqttExposedGAs) ? config.mqttExposedGAs : []
    // Group addresses the user marked as read-only: they are still exposed (state is
    // published to HA) but never accept commands back to the KNX bus.
    node.mqttReadOnlyGAs = Array.isArray(config.mqttReadOnlyGAs) ? config.mqttReadOnlyGAs : []
    node.mqttBridge = null

    const safeNumber = (value, fallback = 0) => {
      if (value === null || value === undefined || value === '') return fallback
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    const sanitizeString = (value) => {
      if (typeof value === 'string') return value.trim()
      if (value === undefined || value === null) return ''
      return String(value).trim()
    }

    const normaliseDirection = (value) => {
      switch (value) {
        case 'knx-to-iot':
        case 'iot-to-knx':
        case 'bidirectional':
          return value
        default:
          return 'bidirectional'
      }
    }

    const normaliseType = (value) => {
      switch (value) {
        case 'mqtt':
        case 'rest':
        case 'modbus':
          return value
        default:
          return 'mqtt'
      }
    }

    const normaliseModbusArea = (value, legacyFunction = '') => {
      switch (value) {
        case 'coil':
        case 'discrete-input':
        case 'holding-register':
        case 'input-register':
          return value
        default: {
          const fn = sanitizeString(legacyFunction).toLowerCase()
          if (fn.includes('discrete')) return 'discrete-input'
          if (fn.includes('input') && fn.includes('register')) return 'input-register'
          if (fn.includes('coil')) return 'coil'
          return 'holding-register'
        }
      }
    }

    const normaliseModbusDataType = (value, area) => {
      if (area === 'coil' || area === 'discrete-input') return 'bool'
      switch (value) {
        case 'bool':
        case 'uint16':
        case 'int16':
          return value
        default:
          return 'uint16'
      }
    }

    const ensureId = (value) => {
      const id = sanitizeString(value)
      return id !== '' ? id : (RED.util && typeof RED.util.generateId === 'function' ? RED.util.generateId() : Math.random().toString(16).slice(2))
    }

    const cleanMapping = (raw) => {
      const source = raw && typeof raw === 'object' ? raw : {}
      const mapping = { ...source }
      mapping.id = ensureId(mapping.id)
      mapping.label = sanitizeString(mapping.label) || mapping.id
      mapping.ga = sanitizeString(mapping.ga)
      mapping.dpt = sanitizeString(mapping.dpt)
      mapping.direction = normaliseDirection(mapping.direction)
      mapping.iotType = normaliseType(mapping.iotType)
      mapping.target = sanitizeString(mapping.target)
      mapping.method = sanitizeString(mapping.method) || 'POST'
      mapping.modbusFunction = sanitizeString(mapping.modbusFunction) || 'writeHoldingRegister'
      // Existing flows emitted a generic scalar Modbus message. Keep that exact contract unless
      // a mapping explicitly opts into the direct node-red-contrib-modbus Flex message shape.
      mapping.modbusMessageFormat = source.modbusMessageFormat === 'flex' ? 'flex' : 'legacy'
      mapping.modbusArea = normaliseModbusArea(mapping.modbusArea, mapping.modbusFunction)
      mapping.modbusDataType = normaliseModbusDataType(mapping.modbusDataType, mapping.modbusArea)
      if (mapping.modbusMessageFormat === 'flex' && ['discrete-input', 'input-register'].includes(mapping.modbusArea)) {
        mapping.direction = 'iot-to-knx'
      }
      mapping.modbusUnitId = mapping.modbusUnitId === undefined || mapping.modbusUnitId === null || mapping.modbusUnitId === ''
        ? 1
        : mapping.modbusUnitId
      mapping.modbusAddress = mapping.modbusAddress === undefined || mapping.modbusAddress === null || mapping.modbusAddress === ''
        ? mapping.target
        : mapping.modbusAddress
      if (mapping.modbusMessageFormat === 'flex') {
        mapping.scale = mapping.scale === undefined || mapping.scale === null || mapping.scale === '' ? 1 : Number(mapping.scale)
        mapping.offset = mapping.offset === undefined || mapping.offset === null || mapping.offset === '' ? 0 : Number(mapping.offset)
      } else {
        mapping.scale = safeNumber(mapping.scale, 1)
        mapping.offset = safeNumber(mapping.offset, 0)
      }
      mapping.template = sanitizeString(mapping.template)
      mapping.property = sanitizeString(mapping.property)
      mapping.enabled = mapping.enabled !== false
      mapping.timeout = safeNumber(mapping.timeout, 0)
      mapping.retry = safeNumber(mapping.retry, 0)
      return mapping
    }

    node.mappings = node.mappings.map(cleanMapping).filter((m) => m.ga !== '' && m.enabled)

    node.stateById = new Map()
    node.gaIndex = new Map()
    node.targetIndex = new Map()

    const registerMapping = (mapping) => {
      const existing = node.gaIndex.get(mapping.ga) || []
      existing.push(mapping)
      node.gaIndex.set(mapping.ga, existing)

      const key = mapping.iotType + '::' + (mapping.target || mapping.label)
      const targetList = node.targetIndex.get(key) || []
      targetList.push(mapping)
      node.targetIndex.set(key, targetList)
    }

    node.mappings.forEach(registerMapping)

    const buildStatusText = (baseText) => {
      const total = node.mappings.length
      return `${total} map(s) ${baseText || ''}`.trim()
    }

    const updateIdleStatus = () => {
      pushStatus({ fill: 'grey', shape: 'ring', text: buildStatusText('ready') })
    }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* empty */ }

    node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text = '', mapping, payload }) => {
      try {
        const extra = mapping ? ` ${mapping.ga}→${mapping.target || mapping.iotType}` : ''
        const valueStr = payload === undefined ? '' : ` ${JSON.stringify(payload)}`
        pushStatus({ fill, shape, text: buildStatusText(`${text}${extra}${valueStr}`) })
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error(`Status update failed: ${error.message}`)
      }
    }

    // HOME ASSISTANT (MQTT) BRIDGE -----------------------------------------------------------
    node.startMqttBridge = () => {
      if (node.mqttBridge !== null) return // already running
      if (!node.mqttUrl) {
        pushStatus({ fill: 'red', shape: 'dot', text: 'MQTT broker URL missing' })
        return
      }
      try {
        // Lazy-require so the node still loads if the optional mqtt dependency is missing.
        const { createMqttBridge } = require('./lib/mqtt-bridge.js')
        node.mqttBridge = createMqttBridge({
          node,
          url: node.mqttUrl,
          baseTopic: node.mqttBaseTopic,
          discovery: node.mqttDiscovery,
          discoveryPrefix: node.mqttDiscoveryPrefix,
          nameFormat: node.mqttNameFormat,
          username: node.credentials ? node.credentials.mqttUsername : undefined,
          password: node.credentials ? node.credentials.mqttPassword : undefined,
          groupAddresses: (node.serverKNX && Array.isArray(node.serverKNX.csv)) ? node.serverKNX.csv : [],
          customEntities: node.mqttCustomEntities,
          // null => expose all imported GAs (until the user curates the list).
          exposedGAs: node.mqttExposeConfigured ? node.mqttExposedGAs : null,
          // GAs exposed as read-only (state only, no command topic back to KNX).
          readOnlyGAs: node.mqttReadOnlyGAs,
          onCommand: ({ ga, dpt, value }) => {
            // A Home Assistant command arrived: write it to the KNX bus.
            try {
              if (node.haBusMode === 'flow') {
                // Flow mode: emit a message on the (single) output pin for a downstream
                // KNXUltimate universal node to write to the bus (destination + dpt + payload).
                node.send({
                  topic: ga,
                  destination: ga,
                  dpt: dpt || '',
                  payload: value
                })
                return
              }
              node.serverKNX.sendKNXTelegramToKNXEngine({
                grpaddr: ga,
                payload: value,
                dpt,
                outputtype: 'write',
                nodecallerid: node.id
              })
            } catch (error) {
              if (node.sysLogger) node.sysLogger.error('HA bridge write failed (' + ga + '): ' + error.message)
            }
          },
          onStatus: (status) => {
            if (!status) return
            if (status.state === 'connected') {
              pushStatus({ fill: 'green', shape: 'dot', text: 'HA connected (' + (status.detail || '0') + ' entities)' })
            } else if (status.state === 'error') {
              pushStatus({ fill: 'red', shape: 'dot', text: 'MQTT ' + (status.detail || 'error') })
            } else if (status.state === 'reconnect' || status.state === 'offline') {
              pushStatus({ fill: 'yellow', shape: 'ring', text: 'MQTT ' + status.state })
            }
          }
        })
        node.mqttBridge.connect()
        pushStatus({ fill: 'grey', shape: 'ring', text: 'HA mode: connecting (' + node.mqttBridge.entityCount + ' entities)' })
      } catch (error) {
        node.mqttBridge = null
        if (node.sysLogger) node.sysLogger.error('startMqttBridge failed: ' + error.message)
        pushStatus({ fill: 'red', shape: 'dot', text: 'MQTT bridge: ' + error.message })
      }
    }

    node.stopMqttBridge = (done) => {
      const bridge = node.mqttBridge
      node.mqttBridge = null
      let called = false
      const cb = () => {
        if (called) return
        called = true
        if (typeof done === 'function') {
          try { done() } catch (error) { /* ignore */ }
        }
      }
      if (!bridge) {
        cb()
        return
      }
      try {
        bridge.close(cb)
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error('stopMqttBridge error: ' + (error && error.message))
        cb()
      }
    }

    const isBooleanDpt = (dpt) => typeof dpt === 'string' && dpt.startsWith('1.')

    const toBoolean = (value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'number') return value !== 0
      if (typeof value === 'string') {
        const lowered = value.trim().toLowerCase()
        if (['true', '1', 'on', 'yes', 'open'].includes(lowered)) return true
        if (['false', '0', 'off', 'no', 'close', 'closed'].includes(lowered)) return false
      }
      if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'value')) return toBoolean(value.value)
        if (Object.prototype.hasOwnProperty.call(value, 'state')) return toBoolean(value.state)
      }
      return Boolean(value)
    }

    const toStrictBoolean = (value) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'number' && Number.isFinite(value)) {
        if (value === 0) return false
        if (value === 1) return true
      }
      if (typeof value === 'string') {
        const lowered = value.trim().toLowerCase()
        if (['true', '1', 'on', 'yes', 'open'].includes(lowered)) return true
        if (['false', '0', 'off', 'no', 'close', 'closed'].includes(lowered)) return false
      }
      throw new Error(`Invalid Modbus boolean value: ${JSON.stringify(value)}`)
    }

    const strictInteger = (value, field, min, max) => {
      if (value === '' || value === null || value === undefined || typeof value === 'boolean') {
        throw new Error(`${field} must be an integer between ${min} and ${max}`)
      }
      const parsed = Number(value)
      if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
        throw new Error(`${field} must be an integer between ${min} and ${max}`)
      }
      return parsed
    }

    const validateModbusScale = (mapping) => {
      if (!Number.isFinite(mapping.scale) || mapping.scale === 0) {
        throw new Error('Modbus scale must be a finite number other than zero')
      }
      if (!Number.isFinite(mapping.offset)) {
        throw new Error('Modbus offset must be a finite number')
      }
    }

    const getModbusUnitId = (mapping) => strictInteger(mapping.modbusUnitId, 'Modbus Unit ID', 0, 255)
    const getModbusAddress = (mapping) => strictInteger(mapping.modbusAddress, 'Modbus address', 0, 65535)

    const getModbusReadFunctionCode = (mapping) => {
      switch (mapping.modbusArea) {
        case 'coil': return 1
        case 'discrete-input': return 2
        case 'holding-register': return 3
        case 'input-register': return 4
        default: throw new Error(`Unsupported Modbus area: ${mapping.modbusArea}`)
      }
    }

    const getModbusWriteFunctionCode = (mapping) => {
      if (mapping.modbusArea === 'coil') return 5
      if (mapping.modbusArea === 'holding-register') return 6
      throw new Error(`The Modbus area ${mapping.modbusArea} is read-only`)
    }

    const encodeModbusWriteValue = (mapping, value) => {
      validateModbusScale(mapping)
      if (mapping.modbusArea === 'coil') return toStrictBoolean(value)

      if (value === '' || value === null || value === undefined) {
        throw new Error('Modbus register value must be numeric')
      }
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) throw new Error('Modbus register value must be finite')

      if (mapping.modbusDataType === 'bool') return toStrictBoolean(value) ? 1 : 0

      const rounded = Math.round(numeric)
      if (mapping.modbusDataType === 'int16') {
        if (rounded < -32768 || rounded > 32767) throw new Error('Modbus int16 value is outside -32768..32767')
        return rounded < 0 ? 0x10000 + rounded : rounded
      }
      if (rounded < 0 || rounded > 65535) throw new Error('Modbus uint16 value is outside 0..65535')
      return rounded
    }

    const decodeModbusReadValue = (mapping, rawValue) => {
      validateModbusScale(mapping)
      if (mapping.modbusArea === 'coil' || mapping.modbusArea === 'discrete-input') {
        return toStrictBoolean(rawValue)
      }

      const word = strictInteger(rawValue, 'Modbus register value', 0, 65535)
      if (mapping.modbusDataType === 'bool') return word !== 0
      if (mapping.modbusDataType === 'int16') return word > 0x7fff ? word - 0x10000 : word
      return word
    }

    const applyScale = (value, mapping) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return (value * mapping.scale) + mapping.offset
      }
      return value
    }

    const revertScale = (value, mapping) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        const scaled = value - mapping.offset
        if (mapping.scale === 0) return scaled
        return scaled / mapping.scale
      }
      return value
    }

    const valuesAreEqual = (a, b) => {
      if (a === b) return true
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) && Number.isNaN(b)) return true
        return a === b
      }
      if (typeof a === 'boolean' && typeof b === 'boolean') return a === b
      try {
        return JSON.stringify(a) === JSON.stringify(b)
      } catch (error) {
        return false
      }
    }

    const renderTemplate = (template, context) => {
      if (!template) return context.value
      return template
        .replace(/{{\s*value\s*}}/g, String(context.value))
        .replace(/{{\s*ga\s*}}/g, context.ga)
        .replace(/{{\s*target\s*}}/g, context.target)
        .replace(/{{\s*type\s*}}/g, context.type)
        .replace(/{{\s*label\s*}}/g, context.label)
        .replace(/{{\s*isoTimestamp\s*}}/g, new Date().toISOString())
    }

    const buildModbusFlexWrite = (mapping, value) => {
      const unitid = getModbusUnitId(mapping)
      const address = getModbusAddress(mapping)
      const fc = getModbusWriteFunctionCode(mapping)
      return {
        request: {
          value: encodeModbusWriteValue(mapping, value),
          fc,
          unitid,
          address,
          quantity: 1
        },
        metadata: {
          contract: 'flex-v1',
          operation: 'write',
          unitid,
          address,
          quantity: 1,
          fc,
          area: mapping.modbusArea,
          dataType: mapping.modbusDataType
        }
      }
    }

    const buildOutMessage = (mapping, value, meta) => {
      const context = {
        value,
        ga: mapping.ga,
        target: mapping.target,
        type: mapping.iotType,
        label: mapping.label,
        isoTimestamp: new Date().toISOString()
      }

      let payload = renderTemplate(mapping.template, context)
      let topic = mapping.iotType === 'mqtt'
        ? (mapping.target || node.outputtopic || mapping.ga)
        : (node.outputtopic || mapping.target || mapping.ga)

      let modbusFlex = null
      if (mapping.iotType === 'modbus' && mapping.modbusMessageFormat === 'flex') {
        modbusFlex = buildModbusFlexWrite(mapping, value)
        payload = modbusFlex.request
        topic = `knxultimate/modbus/${node.id}/${mapping.id}/write`
      }

      const out = {
        topic,
        payload,
        bridge: {
          id: mapping.id,
          label: mapping.label,
          type: mapping.iotType,
          direction: 'knx-to-iot',
          target: mapping.target,
          method: mapping.method,
          modbusFunction: mapping.modbusFunction,
          property: mapping.property,
          timeout: mapping.timeout,
          retry: mapping.retry,
          scale: mapping.scale,
          offset: mapping.offset
        },
        knx: {
          ga: mapping.ga,
          dpt: mapping.dpt,
          event: meta.event,
          source: meta.source,
          ts: meta.ts,
          raw: meta.raw
        }
      }

      if (mapping.iotType === 'rest') {
        out.url = mapping.target || node.outputtopic || ''
        out.method = mapping.method || 'POST'
        if (mapping.property) out.property = mapping.property
        out.timeout = mapping.timeout
        out.retry = mapping.retry
        out.headers = meta.headers || {}
      }
      if (mapping.iotType === 'modbus') {
        out.modbusFunction = modbusFlex
          ? (modbusFlex.request.fc === 5 ? 'writeCoil' : 'writeHoldingRegister')
          : mapping.modbusFunction
        out.address = modbusFlex ? modbusFlex.request.address : mapping.target
        if (mapping.property) out.property = mapping.property
        out.timeout = mapping.timeout
        out.retry = mapping.retry
        if (modbusFlex) {
          out.bridge.modbusFunction = out.modbusFunction
          out.bridge.modbus = modbusFlex.metadata
        }
      }
      if (mapping.iotType === 'mqtt' && mapping.property) {
        out.property = mapping.property
      }
      return out
    }

    const rememberKnxValue = (mapping, value) => {
      const current = node.stateById.get(mapping.id) || {}
      current.lastKnxValue = value
      current.updatedAt = Date.now()
      node.stateById.set(mapping.id, current)
    }

    const rememberIoTValue = (mapping, value) => {
      const current = node.stateById.get(mapping.id) || {}
      current.lastIoTValue = value
      current.updatedAt = Date.now()
      node.stateById.set(mapping.id, current)
    }

    const rememberKnxEchoToSuppress = (mapping, value) => {
      const current = node.stateById.get(mapping.id) || {}
      current.suppressKnxEchoValue = value
      current.suppressKnxEchoUntil = Date.now() + 2000
      node.stateById.set(mapping.id, current)
    }

    const shouldSuppressKnxEcho = (mapping, value, msg) => {
      if (mapping.iotType !== 'modbus' || mapping.modbusMessageFormat !== 'flex') return false
      const current = node.stateById.get(mapping.id)
      if (!current) return false
      if (current.suppressKnxEchoUntil < Date.now()) {
        delete current.suppressKnxEchoValue
        delete current.suppressKnxEchoUntil
        return false
      }
      const isEchoed = msg && (msg.echoed === true || (msg.knx && msg.knx.echoed === true))
      if (!isEchoed) return false
      if (!valuesAreEqual(current.suppressKnxEchoValue, value)) return false
      delete current.suppressKnxEchoValue
      delete current.suppressKnxEchoUntil
      return true
    }

    const shouldEmitKnxValue = (mapping, value) => {
      if (!node.emitOnChangeOnly) return true
      const current = node.stateById.get(mapping.id)
      if (!current || current.lastKnxValue === undefined) return true
      return !valuesAreEqual(current.lastKnxValue, value)
    }

    const shouldWriteModbusValueToKnx = (mapping, value) => {
      if (!node.emitOnChangeOnly) return true
      const current = node.stateById.get(mapping.id)
      if (!current || current.lastIoTValue === undefined) return true
      return !valuesAreEqual(current.lastIoTValue, value)
    }

    const findMappingsByGA = (ga) => node.gaIndex.get(ga) || []

    const getModbusRequestFromMessage = (msg) => {
      if (!msg || typeof msg !== 'object') return null
      if (msg.modbusRequest && typeof msg.modbusRequest === 'object') return msg.modbusRequest
      if (msg.input && msg.input.payload && typeof msg.input.payload === 'object' && !Array.isArray(msg.input.payload) && Object.prototype.hasOwnProperty.call(msg.input.payload, 'fc')) {
        return msg.input.payload
      }
      if (msg.responseBuffer && msg.payload && typeof msg.payload === 'object' && !Array.isArray(msg.payload) && Object.prototype.hasOwnProperty.call(msg.payload, 'fc')) {
        return msg.payload
      }
      if (msg.responseBuffer && msg.values && typeof msg.values === 'object' && !Array.isArray(msg.values) && Object.prototype.hasOwnProperty.call(msg.values, 'fc')) {
        return msg.values
      }
      if (msg.bridge && msg.bridge.modbus && typeof msg.bridge.modbus === 'object') return msg.bridge.modbus
      return null
    }

    const isModbusTransportMessage = (msg) => {
      if (!msg || typeof msg !== 'object') return false
      const hasInputRequest = msg.input && msg.input.payload && typeof msg.input.payload === 'object' && Object.prototype.hasOwnProperty.call(msg.input.payload, 'fc')
      const hasExplicitFlexContract = msg.bridge && msg.bridge.modbus && msg.bridge.modbus.contract === 'flex-v1'
      return Boolean(
        msg.modbusRequest ||
        msg.responseBuffer ||
        Object.prototype.hasOwnProperty.call(msg, 'values') ||
        hasInputRequest ||
        hasExplicitFlexContract
      ) && getModbusRequestFromMessage(msg) !== null
    }

    const asModbusDataArray = (value) => {
      if (Array.isArray(value)) return value
      if (Buffer.isBuffer(value)) return Array.from(value)
      if (value && typeof value === 'object' && Array.isArray(value.data)) return value.data
      return null
    }

    const getModbusResponseData = (msg, request) => {
      const candidates = [
        msg && msg.payload,
        msg && msg.values,
        msg && msg.responseBuffer && msg.responseBuffer.data,
        msg && msg.responseBuffer
      ]
      for (const candidate of candidates) {
        const data = asModbusDataArray(candidate)
        if (data) return data
      }
      const quantity = Number(request && request.quantity)
      if (quantity === 1 && msg && (typeof msg.payload === 'number' || typeof msg.payload === 'boolean')) return [msg.payload]
      return null
    }

    const findMappingsForModbusResponse = (request, dataLength) => {
      const fc = strictInteger(request.fc, 'Modbus function code', 1, 4)
      const unitid = strictInteger(request.unitid !== undefined ? request.unitid : request.unitId, 'Modbus Unit ID', 0, 255)
      const address = strictInteger(request.address, 'Modbus address', 0, 65535)
      const quantityValue = request.quantity === undefined || request.quantity === null || request.quantity === '' ? dataLength : request.quantity
      const quantity = strictInteger(quantityValue, 'Modbus quantity', 1, 65536)
      if (address + quantity > 65536) throw new Error('Modbus address plus quantity exceeds 65536')

      const matches = []
      for (const mapping of node.mappings) {
        if (mapping.iotType !== 'modbus' || mapping.modbusMessageFormat !== 'flex') continue
        if (mapping.direction === 'knx-to-iot') continue
        try {
          if (getModbusUnitId(mapping) !== unitid) continue
          if (getModbusReadFunctionCode(mapping) !== fc) continue
          const mappingAddress = getModbusAddress(mapping)
          if (mappingAddress < address || mappingAddress >= address + quantity) continue
          matches.push({ mapping, offset: mappingAddress - address })
        } catch (error) {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping })
        }
      }
      return matches
    }

    const findMappingsForModbusWriteResponse = (request) => {
      const fc = strictInteger(request.fc, 'Modbus function code', 5, 16)
      const unitid = strictInteger(request.unitid !== undefined ? request.unitid : request.unitId, 'Modbus Unit ID', 0, 255)
      const address = strictInteger(request.address, 'Modbus address', 0, 65535)
      const matches = []

      for (const mapping of node.mappings) {
        if (mapping.iotType !== 'modbus' || mapping.modbusMessageFormat !== 'flex') continue
        if (mapping.direction === 'iot-to-knx') continue
        try {
          if (getModbusUnitId(mapping) !== unitid) continue
          if (getModbusAddress(mapping) !== address) continue
          if (getModbusWriteFunctionCode(mapping) !== fc) continue
          matches.push(mapping)
        } catch (error) {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping })
        }
      }
      return matches
    }

    const matchMappingForIoT = (msg) => {
      const bridge = msg.bridge || {}
      const type = bridge.type || (msg.iotType) || 'mqtt'
      const target = bridge.target || msg.topic || ''
      const id = bridge.id || bridge.mappingId

      if (id) {
        const mapping = node.mappings.find((m) => m.id === id)
        if (mapping) return mapping
      }

      const key = type + '::' + target
      const list = node.targetIndex.get(key)
      if (list && list.length > 0) return list[0]

      if (target && !target.includes('::')) {
        for (const m of node.mappings) {
          if (m.target === target) return m
        }
      }
      return null
    }

    const sendToKNX = (mapping, payload, meta = {}) => {
      try {
        if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') {
          throw new Error('KNX gateway not available')
        }
        const telegram = {
          grpaddr: mapping.ga,
          payload,
          dpt: mapping.dpt || '',
          outputtype: meta.outputtype || 'write',
          nodecallerid: node.id
        }
        node.serverKNX.sendKNXTelegramToKNXEngine(telegram)
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`sendToKNX failed (${mapping.ga}): ${error.message}`)
        } else {
          RED.log.error(`knxUltimateIoTBridge sendToKNX failed (${mapping.ga}): ${error.message}`)
        }
        throw error
      }
    }

    const buildIoTToKnxAck = (mapping, value, modbusRequest) => {
      const ack = {
        topic: mapping.ga,
        payload: value,
        bridge: {
          id: mapping.id,
          label: mapping.label,
          type: mapping.iotType,
          direction: 'iot-to-knx',
          target: mapping.target,
          method: mapping.method,
          modbusFunction: mapping.modbusFunction,
          property: mapping.property,
          timeout: mapping.timeout,
          retry: mapping.retry
        }
      }
      if (mapping.iotType === 'rest') {
        ack.url = mapping.target || ''
        ack.method = mapping.method || 'POST'
      }
      if (mapping.iotType === 'modbus') {
        ack.address = mapping.modbusMessageFormat === 'flex' ? getModbusAddress(mapping) : mapping.target
        ack.modbusFunction = mapping.modbusFunction
        if (mapping.modbusMessageFormat === 'flex') {
          ack.bridge.modbus = {
            contract: 'flex-v1',
            operation: 'read',
            unitid: getModbusUnitId(mapping),
            address: getModbusAddress(mapping),
            quantity: 1,
            fc: modbusRequest ? Number(modbusRequest.fc) : getModbusReadFunctionCode(mapping),
            area: mapping.modbusArea,
            dataType: mapping.modbusDataType
          }
        }
      }
      return ack
    }

    const handleModbusTransportInput = (msg, send) => {
      if (!isModbusTransportMessage(msg)) return { handled: false }
      const request = getModbusRequestFromMessage(msg)
      const fc = Number(request && request.fc)
      const hasExplicitFlexContract = msg.bridge && msg.bridge.modbus && msg.bridge.modbus.contract === 'flex-v1'
      const routedMapping = matchMappingForIoT(msg)
      const routedToFlexMapping = routedMapping && routedMapping.iotType === 'modbus' && routedMapping.modbusMessageFormat === 'flex'
      let matches = []

      try {
        if ([1, 2, 3, 4].includes(fc)) {
          const probeLength = Number.isInteger(Number(request.quantity)) && Number(request.quantity) > 0
            ? Number(request.quantity)
            : 1
          matches = findMappingsForModbusResponse(request, probeLength)
        } else if ([5, 6, 15, 16].includes(fc)) {
          matches = findMappingsForModbusWriteResponse(request)
        }
      } catch (error) {
        const routedToModbusMapping = routedMapping && routedMapping.iotType === 'modbus'
        if (!hasExplicitFlexContract && !(msg.error && routedToModbusMapping)) return { handled: false }
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message })
        return { handled: true, error }
      }

      // Preserve the generic scalar path for old mappings (and for MQTT/REST messages that
      // merely carry Modbus metadata). A message is owned by this adapter only when the request
      // matches a Flex mapping or carries this bridge's explicit Flex contract.
      if (msg.error && (hasExplicitFlexContract || matches.length > 0 || (routedMapping && routedMapping.iotType === 'modbus'))) {
        const error = msg.error instanceof Error ? msg.error : new Error(String(msg.error))
        const operation = [5, 6, 15, 16].includes(fc) ? 'write' : 'read'
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: `Modbus ${operation}: ${error.message}` })
        return { handled: true, error }
      }
      if (!hasExplicitFlexContract && routedMapping && !routedToFlexMapping) return { handled: false }
      if (!hasExplicitFlexContract && matches.length === 0 && !routedToFlexMapping) return { handled: false }

      // Flex Write responses are acknowledgements, not device state. They must never be
      // interpreted as a value to write onto KNX, even if wired back to this node by mistake.
      if ([5, 6, 15, 16].includes(fc)) return { handled: true }
      if (![1, 2, 3, 4].includes(fc)) return { handled: true }

      const data = getModbusResponseData(msg, request)
      if (!data || data.length === 0) {
        const error = new Error('Modbus read response has no data')
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message })
        return { handled: true, error }
      }

      try {
        matches = findMappingsForModbusResponse(request, data.length)
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message })
        return { handled: true, error }
      }

      if (matches.length === 0) {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'No Modbus mapping for response', payload: request.address })
        return { handled: true }
      }

      let firstError = null
      for (const match of matches) {
        const mapping = match.mapping
        try {
          if (match.offset >= data.length) throw new Error('Modbus read response is shorter than the configured mapping')
          const rawValue = decodeModbusReadValue(mapping, data[match.offset])
          let value = typeof rawValue === 'number' ? revertScale(rawValue, mapping) : rawValue
          if (isBooleanDpt(mapping.dpt)) value = toBoolean(value)
          if (!shouldWriteModbusValueToKnx(mapping, value)) continue

          sendToKNX(mapping, value)
          rememberIoTValue(mapping, value)
          rememberKnxEchoToSuppress(mapping, value)
          const ack = buildIoTToKnxAck(mapping, value, request)
          node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'Modbus→KNX', mapping, payload: value })
          if (send) send([null, ack]); else node.send([null, ack])
        } catch (error) {
          if (!firstError) firstError = error
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping })
        }
      }
      return { handled: true, error: firstError }
    }

    // Home Assistant mode: mirror a decoded KNX telegram to MQTT. Works with a telegram coming
    // from the gateway (standalone) or from the input pin (flow mode); both share the shape
    // produced by the KNXUltimate universal node ({ payload, knx: { destination, event } }).
    const publishKnxToMqtt = (msg) => {
      if (!msg || !node.mqttBridge) return
      const destination = msg.knx && msg.knx.destination ? msg.knx.destination : sanitizeString(msg.topic)
      if (!destination) return
      const event = msg.knx ? msg.knx.event : undefined
      if (event === 'GroupValue_Read') return // read requests carry no value
      node.mqttBridge.publishState(destination, msg.payload)
    }

    const handleKnxTelegram = (msg) => {
      try {
        if (!msg) return
        const destination = msg.knx && msg.knx.destination ? msg.knx.destination : sanitizeString(msg.topic)
        if (!destination) return

        // Home Assistant mode: mirror the decoded value to MQTT and stop (no IoT mappings).
        if (node.nodeMode === 'homeassistant') {
          publishKnxToMqtt(msg)
          return
        }

        const meta = {
          event: msg.knx ? msg.knx.event : undefined,
          source: msg.knx ? msg.knx.source : undefined,
          ts: Date.now(),
          raw: msg.knx || {}
        }

        if (meta.event === 'GroupValue_Read') {
          // Skip read indications; we only emit when value is provided.
          return
        }

        const mappings = findMappingsByGA(destination)
        if (!mappings.length) return

        for (const mapping of mappings) {
          if (mapping.direction === 'iot-to-knx') continue
          // A Modbus write is a command. Never turn a KNX read response/status telegram into
          // that command; this also prevents readOnDeploy from changing a Modbus device.
          if (mapping.iotType === 'modbus' && mapping.modbusMessageFormat === 'flex' && meta.event !== 'GroupValue_Write') continue
          try {
            let value = msg.payload
            if (isBooleanDpt(mapping.dpt)) value = toBoolean(value)
            if (shouldSuppressKnxEcho(mapping, value, msg)) continue
            if (typeof value === 'number') value = applyScale(value, mapping)
            if (!shouldEmitKnxValue(mapping, value)) continue

            const outMsg = buildOutMessage(mapping, value, meta)
            rememberKnxValue(mapping, value)
            node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'KNX→IoT', mapping, payload: value })
            node.send([outMsg, null])
          } catch (error) {
            node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping })
            if (node.sysLogger) node.sysLogger.error(`KNX→IoT mapping failed (${mapping.ga}): ${error.message}`)
          }
        }
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`handleKnxTelegram error: ${error.message}`)
        } else {
          RED.log.error(`knxUltimateIoTBridge handleKnxTelegram error: ${error.message}`)
        }
      }
    }

    node.handleSend = handleKnxTelegram

    node.on('input', (msg, send, done) => {
      // In Home Assistant mode, commands flow in over MQTT, not via the flow input. The one
      // exception is 'flow' bus mode, where the input pin carries KNX bus telegrams (from a
      // KNXUltimate universal node) that must be mirrored to MQTT.
      if (node.nodeMode === 'homeassistant') {
        if (node.haBusMode === 'flow') publishKnxToMqtt(msg)
        if (done) done()
        return
      }
      if (!node.acceptFlowInput) {
        if (done) done()
        return
      }

      const modbusResult = handleModbusTransportInput(msg, send)
      if (modbusResult.handled) {
        if (done) done(modbusResult.error)
        return
      }

      const bridgeMapping = matchMappingForIoT(msg)
      if (!bridgeMapping) {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'No mapping for input', payload: msg.topic })
        if (done) done()
        return
      }
      if (bridgeMapping.direction === 'knx-to-iot') {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'Mapping is KNX→IoT only', mapping: bridgeMapping })
        if (done) done()
        return
      }

      if (bridgeMapping.iotType === 'modbus' && bridgeMapping.modbusMessageFormat === 'flex') {
        try {
          validateModbusScale(bridgeMapping)
          getModbusUnitId(bridgeMapping)
          getModbusAddress(bridgeMapping)
          getModbusReadFunctionCode(bridgeMapping)
        } catch (error) {
          node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping: bridgeMapping })
          if (done) done(error)
          return
        }
      }

      let value = msg.payload
      if (isBooleanDpt(bridgeMapping.dpt)) {
        value = toBoolean(value)
      } else if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
        value = Number(value)
      }

      if (typeof value === 'number') {
        value = revertScale(value, bridgeMapping)
      }

      try {
        sendToKNX(bridgeMapping, value)
        rememberIoTValue(bridgeMapping, value)
        const ack = buildIoTToKnxAck(bridgeMapping, value)
        node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'IoT→KNX', mapping: bridgeMapping, payload: msg.payload })
        if (send) send([null, ack]); else node.send([null, ack])
        if (done) done()
      } catch (error) {
        node.setNodeStatus({ fill: 'red', shape: 'dot', text: error.message, mapping: bridgeMapping })
        if (done) done(error)
      }
    })

    node.on('close', (done) => {
      // Always call done() exactly once, even if something throws, so a deploy / Node-RED exit
      // is never blocked by the bridge teardown.
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        if (typeof done === 'function') {
          try { done() } catch (error) { /* ignore */ }
        }
      }
      try {
        if (node.serverKNX && typeof node.serverKNX.removeClient === 'function') {
          try {
            node.serverKNX.removeClient(node)
          } catch (error) {
            /* empty */
          }
        }
        // Stop the MQTT bridge (best-effort, hard-capped so redeploy never blocks on the broker).
        node.stopMqttBridge(finish)
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error('close handler error: ' + (error && error.message))
        finish()
      }
    })

    const registerClient = () => {
      if (node.serverKNX) {
        try {
          if (typeof node.serverKNX.removeClient === 'function') {
            node.serverKNX.removeClient(node)
          }
          if (typeof node.serverKNX.addClient === 'function') {
            node.serverKNX.addClient(node)
          }
        } catch (error) {
          if (node.sysLogger) node.sysLogger.error(`registerClient failed: ${error.message}`)
        }
      }
    }

    const issueInitialReads = () => {
      if (!node.readOnDeploy) return
      if (!node.serverKNX || typeof node.serverKNX.sendKNXTelegramToKNXEngine !== 'function') return
      for (const mapping of node.mappings) {
        if (mapping.direction === 'iot-to-knx') continue
        if (mapping.iotType === 'modbus' && mapping.modbusMessageFormat === 'flex') continue
        if (!mapping.ga) continue
        try {
          node.serverKNX.sendKNXTelegramToKNXEngine({
            grpaddr: mapping.ga,
            payload: '',
            dpt: '',
            outputtype: 'read',
            nodecallerid: node.id
          })
        } catch (error) {
          if (node.sysLogger) node.sysLogger.error(`Initial read failed (${mapping.ga}): ${error.message}`)
        }
      }
    }

    // In HA 'flow' mode the KNX telegrams arrive on the input pin, so we must NOT subscribe to
    // the gateway's client feed (that would double-publish and bypass the intended wiring).
    const useFlowBus = node.nodeMode === 'homeassistant' && node.haBusMode === 'flow'
    if (!useFlowBus) registerClient()
    if (node.nodeMode === 'homeassistant') {
      node.startMqttBridge()
    } else {
      updateIdleStatus()
      issueInitialReads()
    }
  }

  RED.nodes.registerType('knxUltimateIoTBridge', knxUltimateIoTBridge, {
    credentials: {
      mqttUsername: { type: 'text' },
      mqttPassword: { type: 'password' }
    }
  })
}
