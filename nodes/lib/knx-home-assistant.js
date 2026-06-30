'use strict'

// Shared Home Assistant mapping helpers for the native KNX MQTT bridge.
//
// A KNX gateway exposes many group addresses (GA), each carrying a Datapoint Type (DPT).
// Home Assistant, on the other hand, models things as typed entities (switch, sensor,
// binary_sensor, number, text...). This module is the translation layer between the two:
//
// - mapDptToHa(dpt)            -> { domain, deviceClass?, unit?, min?, max?, step? }
// - formatValueForMqtt(value)  -> string to publish on a HA state topic
// - parseCommandFromMqtt(text, dpt) -> JS value to write on the KNX bus (or null)
//
// The mapping is intentionally pragmatic: it covers the common DPTs and falls back to a
// read-only "sensor" for everything else, so an unknown DPT never breaks discovery.

// Extract the main/sub parts of a DPT string ("DPT9.001", "9.001", "9" ...).
function splitDpt (dptRaw) {
  const clean = String(dptRaw == null ? '' : dptRaw).replace(/^dpt/i, '').trim()
  const parts = clean.split('.')
  const main = parseInt(parts[0], 10)
  const sub = parts.length > 1 ? parts[1].trim() : ''
  return { main: Number.isFinite(main) ? main : null, sub }
}

// Unit + HA device_class for the most common 2-byte float DPTs (DPT 9.xxx).
function unitForFloat (sub) {
  switch (sub) {
    case '001': return { unit: '°C', deviceClass: 'temperature' }
    case '002': return { unit: 'K' }
    case '003': return { unit: 'K/h' }
    case '004': return { unit: 'lx', deviceClass: 'illuminance' }
    case '005': return { unit: 'm/s', deviceClass: 'wind_speed' }
    case '006': return { unit: 'Pa', deviceClass: 'pressure' }
    case '007': return { unit: '%', deviceClass: 'humidity' }
    case '008': return { unit: 'ppm' }
    case '009': return { unit: 'mg/m³' }
    case '010': return { unit: 'm/s' }
    case '011': return { unit: 's' }
    case '020': return { unit: 'mV', deviceClass: 'voltage' }
    case '021': return { unit: 'mA', deviceClass: 'current' }
    case '022': return { unit: 'W/m²', deviceClass: 'irradiance' }
    case '024': return { unit: 'K' }
    case '025': return { unit: '1/h' }
    case '026': return { unit: 'l/h' }
    case '027': return { unit: '°F', deviceClass: 'temperature' }
    case '028': return { unit: 'km/h', deviceClass: 'wind_speed' }
    default: return {}
  }
}

// Map a KNX DPT to a Home Assistant entity descriptor.
// `domain` is the HA MQTT platform; the extra fields tune the discovery config.
function mapDptToHa (dptRaw) {
  const { main, sub } = splitDpt(dptRaw)

  if (main === 1) {
    // 1-bit boolean. A handful of subtypes are clearly read-only states; the rest are
    // treated as controllable switches.
    const readOnly = ['005', '011', '019']
    if (readOnly.includes(sub)) {
      const deviceClass = sub === '005' ? 'problem' : (sub === '019' ? 'opening' : undefined)
      return { domain: 'binary_sensor', deviceClass, writable: false }
    }
    return { domain: 'switch', writable: true }
  }

  if (main === 5) {
    if (sub === '001') return { domain: 'number', min: 0, max: 100, step: 1, unit: '%', writable: true } // scaling
    if (sub === '003') return { domain: 'number', min: 0, max: 360, step: 1, unit: '°', writable: true } // angle
    return { domain: 'number', min: 0, max: 255, step: 1, writable: true }
  }

  if (main === 6) return { domain: 'sensor', writable: false } // 1-byte signed
  if (main === 7) return { domain: 'sensor', writable: false } // 2-byte unsigned
  if (main === 8) return { domain: 'sensor', writable: false } // 2-byte signed

  if (main === 9) {
    const u = unitForFloat(sub)
    return { domain: 'sensor', unit: u.unit, deviceClass: u.deviceClass, writable: false }
  }

  if (main === 12) return { domain: 'sensor', writable: false } // 4-byte unsigned
  if (main === 13) {
    if (sub === '010') return { domain: 'sensor', unit: 'Wh', deviceClass: 'energy', writable: false }
    if (sub === '013') return { domain: 'sensor', unit: 'kWh', deviceClass: 'energy', writable: false }
    return { domain: 'sensor', writable: false } // 4-byte signed
  }

  if (main === 14) {
    // 4-byte float (engineering values). A few well-known subtypes carry a clear unit.
    if (sub === '056') return { domain: 'sensor', unit: 'W', deviceClass: 'power', writable: false }
    if (sub === '027') return { domain: 'sensor', unit: 'V', deviceClass: 'voltage', writable: false }
    if (sub === '019') return { domain: 'sensor', unit: 'A', deviceClass: 'current', writable: false }
    if (sub === '068') return { domain: 'sensor', unit: '°C', deviceClass: 'temperature', writable: false }
    return { domain: 'sensor', writable: false }
  }

  if (main === 16) return { domain: 'text', writable: true } // character string

  // Scenes (17/18), HVAC modes (20), colours (232) and anything else: expose as a
  // read-only sensor so the value is visible without risking a wrong write encoding.
  return { domain: 'sensor', writable: false }
}

// Render a KNX-decoded JS value to the string published on a HA state topic.
function formatValueForMqtt (value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (_err) {
      return ''
    }
  }
  return String(value)
}

// Parse a HA command payload (string) into the JS value to write on the KNX bus.
// Returns null when the payload can't be coerced to the DPT (the write is then skipped).
function parseCommandFromMqtt (text, dptRaw) {
  const { main } = splitDpt(dptRaw)
  const s = (text == null ? '' : String(text)).trim()
  if (s === '') return null

  if (main === 1) {
    const low = s.toLowerCase()
    if (['true', 'on', '1', 'open', 'up', 'yes'].includes(low)) return true
    if (['false', 'off', '0', 'closed', 'close', 'down', 'no'].includes(low)) return false
    return null
  }

  if ([5, 6, 7, 8, 9, 12, 13, 14].includes(main)) {
    const n = Number(s)
    return Number.isFinite(n) ? n : null
  }

  if (main === 16) return s

  // Unknown/structured DPT: accept JSON objects, otherwise pass the raw string through.
  if (s.startsWith('{') || s.startsWith('[')) {
    try {
      return JSON.parse(s)
    } catch (_err) {
      return s
    }
  }
  return s
}

// Default KNX DPTs for the roles of composite (cover/climate) entities. Used to encode
// writes when the role GA is not present in the ETS CSV (so its DPT can't be resolved).
const COVER_DEFAULT_DPT = {
  upDown: '1.008', // 0 = Up/Open, 1 = Down/Close
  stop: '1.007', // step/stop
  position: '5.001' // 0..100 %
}
const CLIMATE_DEFAULT_DPT = {
  currentTemp: '9.001',
  setpoint: '9.001',
  onOff: '1.001'
}

module.exports = {
  splitDpt,
  mapDptToHa,
  formatValueForMqtt,
  parseCommandFromMqtt,
  COVER_DEFAULT_DPT,
  CLIMATE_DEFAULT_DPT
}
