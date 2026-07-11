/* eslint-disable max-len */
// Value conversions between KNX (decoded DPT payloads) and Matter clusters.
// Used by the Matter controller nodes to translate group address payloads into Matter
// commands/attribute-writes and Matter attribute reports into KNX payloads.

// Matter cluster IDs
const CLUSTER = {
  IDENTIFY: 3,
  ON_OFF: 6,
  LEVEL_CONTROL: 8,
  POWER_SOURCE: 47,
  BOOLEAN_STATE: 69,
  DOOR_LOCK: 257,
  WINDOW_COVERING: 258,
  COLOR_CONTROL: 768,
  ILLUMINANCE: 1024,
  TEMPERATURE: 1026,
  PRESSURE: 1027,
  FLOW: 1028,
  HUMIDITY: 1029,
  OCCUPANCY: 1030,
  THERMOSTAT: 513,
  FAN_CONTROL: 514,
  ELECTRICAL_POWER: 144,
  ELECTRICAL_ENERGY: 145
}

const clampByte = (value, max) => {
  let v = Math.round(Number(value))
  if (Number.isNaN(v)) v = 0
  if (v < 0) v = 0
  if (v > max) v = max
  return v
}

const truthy = (value) => value === true || value === 1 || value === '1' || value === 'true' || value === 'on'

// Standard "options" arguments required by several Matter commands
const LEVEL_OPTS = { optionsMask: {}, optionsOverride: {} }

/**
 * Converts a decoded KNX payload into a Matter queue item ({ kind, name, args }).
 * @param {object} mapping - { clusterId, targetKind ('command'|'attribute'), target (name) }
 * @param {*} value - Decoded KNX payload (dptlib.fromBuffer output)
 * @returns {object|null} { kind: 'command'|'attributeWrite', name, args } or null to skip
 */
function knxToMatter (mapping, value) {
  const clusterId = Number(mapping.clusterId)
  const target = mapping.target

  if (mapping.targetKind === 'attribute') {
    // Attribute write. Apply known unit scaling, otherwise write raw.
    let outValue = value
    switch (clusterId) {
      case CLUSTER.THERMOSTAT:
        if (['occupiedHeatingSetpoint', 'occupiedCoolingSetpoint', 'unoccupiedHeatingSetpoint', 'unoccupiedCoolingSetpoint'].includes(target)) {
          outValue = Math.round(Number(value) * 100) // °C -> centi-°C
        }
        break
      case CLUSTER.FAN_CONTROL:
        if (target === 'percentSetting') outValue = clampByte(value, 100)
        if (target === 'speedSetting') outValue = Math.round(Number(value))
        break
      case CLUSTER.ON_OFF:
        if (target === 'onOff') outValue = truthy(value)
        break
      default:
        break
    }
    return { kind: 'attributeWrite', name: target, args: outValue }
  }

  // Command invocation
  switch (clusterId) {
    case CLUSTER.ON_OFF:
      if (target === 'toggle') return { kind: 'command', name: 'toggle', args: undefined }
      // For on/off honour the KNX boolean payload, so a single DPT1 GA drives both.
      return { kind: 'command', name: truthy(value) ? 'on' : 'off', args: undefined }

    case CLUSTER.LEVEL_CONTROL:
      if (target === 'stop' || target === 'stopWithOnOff') return { kind: 'command', name: target, args: { ...LEVEL_OPTS } }
      // moveToLevel / moveToLevelWithOnOff: KNX percent (0-100) -> Matter level (0-254)
      return {
        kind: 'command',
        name: target,
        args: { level: clampByte(Number(value) * 254 / 100, 254), transitionTime: 0, ...LEVEL_OPTS }
      }

    case CLUSTER.WINDOW_COVERING:
      if (target === 'stopMotion') return { kind: 'command', name: 'stopMotion', args: undefined }
      if (target === 'goToLiftPercentage') return { kind: 'command', name: 'goToLiftPercentage', args: { liftPercent100thsValue: clampByte(Number(value) * 100, 10000) } }
      if (target === 'goToTiltPercentage') return { kind: 'command', name: 'goToTiltPercentage', args: { tiltPercent100thsValue: clampByte(Number(value) * 100, 10000) } }
      // upOrOpen / downOrClose: honour KNX DPT 1.008 (0 = up, 1 = down)
      return { kind: 'command', name: truthy(value) ? 'downOrClose' : 'upOrOpen', args: undefined }

    case CLUSTER.DOOR_LOCK:
      // Honour KNX boolean payload (1 = lock, 0 = unlock)
      return { kind: 'command', name: truthy(value) ? 'lockDoor' : 'unlockDoor', args: {} }

    case CLUSTER.COLOR_CONTROL:
      if (target === 'moveToColorTemperature') {
        // KNX DPT 7.600 carries Kelvin; Matter wants mireds. Accept mireds too (values < 1000).
        const numeric = Number(value)
        const mireds = numeric >= 1000 ? Math.round(1000000 / numeric) : Math.round(numeric)
        return { kind: 'command', name: 'moveToColorTemperature', args: { colorTemperatureMireds: mireds, transitionTime: 0, ...LEVEL_OPTS } }
      }
      if (target === 'moveToHue') {
        return { kind: 'command', name: 'moveToHue', args: { hue: clampByte(Number(value) * 254 / 100, 254), direction: 0, transitionTime: 0, ...LEVEL_OPTS } }
      }
      if (target === 'moveToSaturation') {
        return { kind: 'command', name: 'moveToSaturation', args: { saturation: clampByte(Number(value) * 254 / 100, 254), transitionTime: 0, ...LEVEL_OPTS } }
      }
      break

    case CLUSTER.IDENTIFY:
      if (target === 'identify') return { kind: 'command', name: 'identify', args: { identifyTime: 15 } }
      break

    default:
      break
  }

  // Generic fallback: pass objects through as command arguments, otherwise invoke without arguments.
  return { kind: 'command', name: target, args: (value !== null && typeof value === 'object') ? value : undefined }
}

/**
 * Converts a Matter attribute report into a KNX-friendly payload.
 * The final DPT encoding is done by the KNX engine using the DPT selected in the mapping.
 * @returns {*} converted payload, or undefined to skip sending
 */
function matterToKnx (clusterId, attributeName, value) {
  if (value === null || value === undefined) return undefined
  const cid = Number(clusterId)
  switch (cid) {
    case CLUSTER.ON_OFF:
      if (attributeName === 'onOff') return value === true
      break
    case CLUSTER.LEVEL_CONTROL:
      if (attributeName === 'currentLevel') return Math.round(Number(value) * 100 / 254) // -> KNX percent
      break
    case CLUSTER.WINDOW_COVERING:
      if (attributeName === 'currentPositionLiftPercent100ths' || attributeName === 'targetPositionLiftPercent100ths') return Math.round(Number(value) / 100)
      if (attributeName === 'currentPositionTiltPercent100ths' || attributeName === 'targetPositionTiltPercent100ths') return Math.round(Number(value) / 100)
      if (attributeName === 'currentPositionLiftPercentage' || attributeName === 'currentPositionTiltPercentage') return Number(value)
      break
    case CLUSTER.COLOR_CONTROL:
      if (attributeName === 'colorTemperatureMireds') return Number(value) > 0 ? Math.round(1000000 / Number(value)) : undefined // -> Kelvin
      if (attributeName === 'currentHue' || attributeName === 'currentSaturation') return Math.round(Number(value) * 100 / 254)
      break
    case CLUSTER.THERMOSTAT:
      if (['localTemperature', 'outdoorTemperature', 'occupiedHeatingSetpoint', 'occupiedCoolingSetpoint', 'unoccupiedHeatingSetpoint', 'unoccupiedCoolingSetpoint'].includes(attributeName)) {
        return Number(value) / 100 // centi-°C -> °C
      }
      break
    case CLUSTER.TEMPERATURE:
    case CLUSTER.HUMIDITY:
      if (attributeName === 'measuredValue') return Number(value) / 100
      break
    case CLUSTER.PRESSURE:
      if (attributeName === 'measuredValue') return Number(value) / 10 // kPa*10 -> kPa... DPT 9.006 expects Pa: user can scale
      break
    case CLUSTER.ILLUMINANCE:
      if (attributeName === 'measuredValue') return Math.round(Math.pow(10, (Number(value) - 1) / 10000) * 100) / 100 // -> Lux
      break
    case CLUSTER.OCCUPANCY:
      if (attributeName === 'occupancy') {
        if (value !== null && typeof value === 'object') return value.occupied === true
        return (Number(value) & 1) === 1
      }
      break
    case CLUSTER.BOOLEAN_STATE:
      if (attributeName === 'stateValue') return value === true
      break
    case CLUSTER.DOOR_LOCK:
      if (attributeName === 'lockState') return Number(value) === 1 // 1 = locked
      break
    case CLUSTER.POWER_SOURCE:
      if (attributeName === 'batPercentRemaining') return Math.round(Number(value) / 2) // half-percent units
      if (attributeName === 'batChargeLevel') return Number(value)
      break
    case CLUSTER.ELECTRICAL_POWER:
      if (attributeName === 'activePower' || attributeName === 'apparentPower' || attributeName === 'reactivePower') return Number(value) / 1000 // mW -> W
      if (attributeName === 'voltage') return Number(value) / 1000 // mV -> V
      if (attributeName === 'activeCurrent' || attributeName === 'rmsCurrent') return Number(value) / 1000 // mA -> A
      break
    case CLUSTER.ELECTRICAL_ENERGY:
      if (attributeName === 'cumulativeEnergyImported' || attributeName === 'cumulativeEnergyExported') {
        if (value !== null && typeof value === 'object' && value.energy !== undefined) return Number(value.energy) / 1000000 // mWh -> kWh
      }
      break
    case CLUSTER.FAN_CONTROL:
      if (attributeName === 'percentSetting' || attributeName === 'percentCurrent') return Number(value)
      break
    default:
      break
  }
  // Generic fallback: booleans and numbers as-is; objects are passed through (the KNX engine may stringify)
  if (typeof value === 'boolean' || typeof value === 'number') return value
  if (typeof value === 'string') return value
  return value
}

module.exports = { knxToMatter, matterToKnx, CLUSTER }
