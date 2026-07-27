'use strict'

const { CLUSTER } = require('./matterKnxConverter')

const normalizeToken = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const requireNumber = (value, functionName, min, max) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) throw new Error(`Matter function "${functionName}" requires a numeric value`)
  if (min !== undefined && numeric < min) throw new Error(`Matter function "${functionName}" requires a value >= ${min}`)
  if (max !== undefined && numeric > max) throw new Error(`Matter function "${functionName}" requires a value <= ${max}`)
  return numeric
}

const requireBoolean = (value, functionName) => {
  if (value === true || value === 1 || value === '1' || normalizeToken(value) === 'true' || normalizeToken(value) === 'on') return true
  if (value === false || value === 0 || value === '0' || normalizeToken(value) === 'false' || normalizeToken(value) === 'off') return false
  throw new Error(`Matter function "${functionName}" requires true/false`)
}

const command = (clusterId, names, value) => ({
  clusterId,
  targetKind: 'command',
  names: Array.isArray(names) ? names : [names],
  value
})

const attribute = (clusterId, names, value, writableOnly = false) => ({
  clusterId,
  targetKind: 'attribute',
  names: Array.isArray(names) ? names : [names],
  value,
  writableOnly
})

// Friendly functions deliberately use the same names as the Matter Bridge where
// the concepts overlap. Values use human units (percent, °C, lux, W and kWh).
const SEMANTIC_FUNCTIONS = {
  onoff: {
    read: attribute(CLUSTER.ON_OFF, 'onOff'),
    write: (value) => {
      if (normalizeToken(value) === 'toggle') return command(CLUSTER.ON_OFF, 'toggle', false)
      const on = requireBoolean(value, 'onoff')
      return command(CLUSTER.ON_OFF, on ? 'on' : 'off', on)
    }
  },
  level: {
    read: attribute(CLUSTER.LEVEL_CONTROL, 'currentLevel'),
    write: (value) => command(CLUSTER.LEVEL_CONTROL, ['moveToLevelWithOnOff', 'moveToLevel'], requireNumber(value, 'level', 0, 100))
  },
  position: {
    read: attribute(CLUSTER.WINDOW_COVERING, ['currentPositionLiftPercent100ths', 'currentPositionLiftPercentage']),
    write: (value) => command(CLUSTER.WINDOW_COVERING, 'goToLiftPercentage', requireNumber(value, 'position', 0, 100))
  },
  tiltposition: {
    read: attribute(CLUSTER.WINDOW_COVERING, ['currentPositionTiltPercent100ths', 'currentPositionTiltPercentage']),
    write: (value) => command(CLUSTER.WINDOW_COVERING, 'goToTiltPercentage', requireNumber(value, 'tiltposition', 0, 100))
  },
  open: {
    write: () => command(CLUSTER.WINDOW_COVERING, 'upOrOpen', false)
  },
  close: {
    write: () => command(CLUSTER.WINDOW_COVERING, 'downOrClose', true)
  },
  stop: {
    write: () => command(CLUSTER.WINDOW_COVERING, 'stopMotion', undefined)
  },
  setpoint: {
    read: attribute(CLUSTER.THERMOSTAT, 'occupiedHeatingSetpoint'),
    write: (value) => attribute(CLUSTER.THERMOSTAT, 'occupiedHeatingSetpoint', requireNumber(value, 'setpoint'), true)
  },
  coolingsetpoint: {
    read: attribute(CLUSTER.THERMOSTAT, 'occupiedCoolingSetpoint'),
    write: (value) => attribute(CLUSTER.THERMOSTAT, 'occupiedCoolingSetpoint', requireNumber(value, 'coolingsetpoint'), true)
  },
  currenttemp: {
    read: attribute(CLUSTER.THERMOSTAT, 'localTemperature')
  },
  fanspeed: {
    read: attribute(CLUSTER.FAN_CONTROL, ['percentCurrent', 'percentSetting']),
    write: (value) => attribute(CLUSTER.FAN_CONTROL, 'percentSetting', requireNumber(value, 'fanspeed', 0, 100), true)
  },
  temperature: {
    read: attribute(CLUSTER.TEMPERATURE, 'measuredValue')
  },
  humidity: {
    read: attribute(CLUSTER.HUMIDITY, 'measuredValue')
  },
  illuminance: {
    read: attribute(CLUSTER.ILLUMINANCE, 'measuredValue')
  },
  occupancy: {
    read: attribute(CLUSTER.OCCUPANCY, 'occupancy')
  },
  contact: {
    read: attribute(CLUSTER.BOOLEAN_STATE, 'stateValue')
  },
  battery: {
    read: attribute(CLUSTER.POWER_SOURCE, 'batPercentRemaining')
  },
  activepower: {
    read: attribute(CLUSTER.ELECTRICAL_POWER, 'activePower')
  },
  importedenergy: {
    read: attribute(CLUSTER.ELECTRICAL_ENERGY, 'cumulativeEnergyImported')
  },
  identify: {
    write: () => command(CLUSTER.IDENTIFY, 'identify', undefined)
  }
}

const getInputStructure = (capabilities) => {
  if (!capabilities || typeof capabilities !== 'object') return undefined
  const structure = capabilities.inputStructure
  return structure && Array.isArray(structure.clusters) ? structure : undefined
}

const targetSupported = (capabilities, candidate) => {
  const structure = getInputStructure(capabilities)
  if (!structure) return true
  const cluster = structure.clusters.find((item) => Number(item.id) === Number(candidate.clusterId))
  if (!cluster) return false
  const collection = candidate.targetKind === 'command' ? cluster.commands : cluster.attributes
  if (!Array.isArray(collection)) return false
  return candidate.names.some((name) => collection.some((item) =>
    normalizeToken(item.name) === normalizeToken(name) &&
    (!candidate.writableOnly || item.writable === true)
  ))
}

const materializeTarget = (capabilities, candidate) => {
  if (!candidate) return undefined
  const structure = getInputStructure(capabilities)
  if (!structure) return { ...candidate, target: candidate.names[0] }
  const cluster = structure.clusters.find((item) => Number(item.id) === Number(candidate.clusterId))
  const collection = candidate.targetKind === 'command' ? cluster?.commands : cluster?.attributes
  if (!Array.isArray(collection)) return undefined
  for (const name of candidate.names) {
    const found = collection.find((item) =>
      normalizeToken(item.name) === normalizeToken(name) &&
      (!candidate.writableOnly || item.writable === true)
    )
    if (found) return { ...candidate, target: found.name }
  }
  return undefined
}

const semanticPayload = (msg) => {
  const payload = msg?.payload
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Buffer.isBuffer(payload)) return undefined
  const rawFunction = payload.function ?? payload.fn
  if (rawFunction === undefined || rawFunction === null || String(rawFunction).trim() === '') return undefined
  return {
    functionName: normalizeToken(rawFunction),
    value: payload.value,
    requestFromRemote: payload.requestFromRemote === true || payload.remote === true
  }
}

const supportedSemanticFunctions = (capabilities) => Object.entries(SEMANTIC_FUNCTIONS)
  .filter(([, definition]) => {
    const readSupported = definition.read && targetSupported(capabilities, definition.read)
    const writeSupported = definition.write && [undefined, 0, true, false, 'toggle'].some((value) => {
      try {
        return targetSupported(capabilities, definition.write(value))
      } catch (error) {
        return false
      }
    })
    return readSupported || writeSupported
  })
  .map(([name]) => name)

const resolveSemanticInput = (msg, capabilities) => {
  const input = semanticPayload(msg)
  if (!input) return undefined
  const definition = SEMANTIC_FUNCTIONS[input.functionName]
  if (!definition) {
    const supported = supportedSemanticFunctions(capabilities)
    throw new Error(`Unsupported Matter function "${input.functionName}"${supported.length ? `. Supported: ${supported.join(', ')}` : ''}`)
  }
  const wantsWrite = input.value !== undefined || !definition.read
  let candidate
  if (wantsWrite) {
    if (!definition.write) throw new Error(`Matter function "${input.functionName}" is read-only`)
    candidate = definition.write(input.value)
  } else {
    candidate = definition.read
  }
  const resolved = materializeTarget(capabilities, candidate)
  if (!resolved) throw new Error(`Matter endpoint does not support function "${input.functionName}"`)
  return {
    functionName: input.functionName,
    requestFromRemote: input.requestFromRemote,
    operation: wantsWrite ? 'write' : 'read',
    value: resolved.value,
    mapping: {
      endpointId: msg.endpointId,
      clusterId: resolved.clusterId,
      targetKind: resolved.targetKind,
      target: resolved.target
    }
  }
}

module.exports = {
  SEMANTIC_FUNCTIONS,
  normalizeToken,
  resolveSemanticInput,
  semanticPayload,
  supportedSemanticFunctions
}
