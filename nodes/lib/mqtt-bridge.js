'use strict'

// Native MQTT bridge for the KNX gateway config node.
//
// When enabled it:
// - exposes every imported ETS group address (GA) as a Home Assistant MQTT entity
//   (switch / sensor / binary_sensor / number / text, derived from the DPT),
// - exposes user-defined composite entities (cover / climate) that aggregate several GAs,
// - publishes each GA value to a retained state topic as telegrams arrive on the bus,
// - subscribes to the command topics and writes incoming HA commands back to the KNX bus,
// - publishes Home Assistant MQTT Discovery so the entities appear automatically in HA,
// - tracks an availability (online/offline) topic via Last Will,
// - re-announces discovery on the HA "birth" message (HA restart / integration re-add).
//
// Internally everything is reduced to two maps, so simple and composite entities share the
// same plumbing:
//   - gaPublishers:    GA            -> [fn(decodedValue)]  (KNX bus -> MQTT state topics)
//   - commandHandlers: command topic -> fn(text) -> [{ ga, dpt, value }]  (MQTT -> KNX bus)
//
// The bridge is best-effort: a broker that is down or misconfigured must never crash the
// runtime, and stopping/redeploying must never block on a slow broker.

const mqtt = require('mqtt')
const ha = require('./knx-home-assistant.js')

function slugify (value, fallback) {
  const s = String(value == null ? '' : value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
  return s || fallback
}

function sanitizeBaseTopic (value) {
  const s = typeof value === 'string' ? value.trim() : ''
  // Strip wildcards and surrounding slashes; MQTT base topics must be concrete.
  return (s || 'knx-ultimate').replace(/[#+]/g, '').replace(/^\/+|\/+$/g, '') || 'knx-ultimate'
}

// A GA "1/2/3" becomes "1_2_3" for use inside topics and HA object ids.
function gaToSlug (ga) {
  return String(ga == null ? '' : ga).replace(/[^0-9]+/g, '_').replace(/^_|_$/g, '')
}

function normalizeGa (ga) {
  return typeof ga === 'string' ? ga.trim() : ''
}

// Clean up an entity name for Home Assistant: strip ASCII control characters and collapse
// runs of whitespace (ETS exports sometimes lose an accented char and leave a double space,
// e.g. "Velocità vento" -> "Velocit  vento"). This keeps the friendly name and the entity_id
// HA derives from it tidy, and never lets an all-blank/control-only string through.
function sanitizeEntityName (value) {
  return String(value == null ? '' : value)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ETS imports (CSV and ESF) build devicename as "(Main group->Middle group) GA name":
// the group-address path first, then the actual GA name. Reshape it according to the
// entity-name format chosen by the user for Home Assistant.
function formatEntityName (raw, ga, format) {
  const full = sanitizeEntityName(raw)
  if (full === '') return ga
  if (!format || format === 'full') return full
  const match = full.match(/^\(([^)]*)\)\s*(.*)$/)
  const path = match ? match[1].trim() : ''
  const name = match ? (match[2].trim() || ga) : full
  let result
  switch (format) {
    case 'name-first':
      result = path ? `${name} (${path})` : name
      break
    case 'name-only':
      result = name
      break
    case 'name-ga':
      result = `${name} (${ga})`
      break
    default:
      result = full
  }
  return sanitizeEntityName(result) || ga
}

function toFiniteNumber (value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp (value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createMqttBridge (options) {
  const opts = options || {}
  const node = opts.node
  const onCommand = typeof opts.onCommand === 'function' ? opts.onCommand : () => {}
  const onStatus = typeof opts.onStatus === 'function' ? opts.onStatus : () => {}

  const url = typeof opts.url === 'string' ? opts.url.trim() : ''
  const baseTopic = sanitizeBaseTopic(opts.baseTopic)
  const discovery = opts.discovery !== false
  const discoveryPrefix = (typeof opts.discoveryPrefix === 'string' && opts.discoveryPrefix.trim()) || 'homeassistant'
  const username = typeof opts.username === 'string' && opts.username ? opts.username : undefined
  const password = typeof opts.password === 'string' && opts.password ? opts.password : undefined
  // How simple per-GA entity names are built from the ETS devicename: 'full' (as imported),
  // 'name-first' (GA name first, path after), 'name-only' (path stripped), 'name-ga' (name + GA).
  const nameFormat = typeof opts.nameFormat === 'string' && opts.nameFormat ? opts.nameFormat : 'full'

  // Source per-GA entities: [{ ga, dpt, devicename }]
  const sourceGAs = Array.isArray(opts.groupAddresses) ? opts.groupAddresses : []
  // User-defined composite entities: [{ type:'cover'|'climate', name, ga... }]
  const customEntities = Array.isArray(opts.customEntities) ? opts.customEntities : []
  // Optional whitelist of GAs to expose as simple entities. null => expose all imported GAs.
  const exposeFilter = Array.isArray(opts.exposedGAs)
    ? new Set(opts.exposedGAs.map((g) => normalizeGa(g)).filter((g) => g !== ''))
    : null
  // GAs the user marked read-only: exposed as read-only HA entities (no command topic).
  const readOnlyFilter = new Set(
    (Array.isArray(opts.readOnlyGAs) ? opts.readOnlyGAs : [])
      .map((g) => normalizeGa(g))
      .filter((g) => g !== '')
  )

  const gatewayName = (node && node.name) || 'KNX Gateway'
  const gatewaySlug = slugify(node && node.name, '') || slugify(node && node.id, 'knx')
  const deviceId = `knx_${gatewaySlug}`

  const root = `${baseTopic}/${gatewaySlug}`
  const availabilityTopic = `${root}/availability`
  // Home Assistant birth topic(s): on (re)start HA publishes "online" here and devices must
  // re-announce their discovery. Default homeassistant/status; also cover a custom prefix.
  const birthTopics = Array.from(new Set(['homeassistant/status', `${discoveryPrefix}/status`]))

  const deviceBlock = {
    identifiers: [deviceId],
    name: gatewayName,
    manufacturer: 'node-red-contrib-knx-ultimate',
    model: 'KNX Ultimate Gateway'
  }

  // Resolve a GA's DPT from the ETS CSV (used to encode composite-entity writes).
  const dptByGa = new Map()
  sourceGAs.forEach((entry) => {
    if (entry && typeof entry.ga === 'string' && entry.ga.trim() !== '' && entry.dpt) {
      dptByGa.set(entry.ga.trim(), entry.dpt)
    }
  })
  const resolveDpt = (ga, fallback) => dptByGa.get(normalizeGa(ga)) || fallback

  // Unified plumbing (filled by the builders below).
  const discoveryConfigs = [] // [{ topic, config }]
  const gaPublishers = new Map() // ga -> [fn(decodedValue)]
  const commandHandlers = new Map() // topic -> fn(text) -> [{ ga, dpt, value }]
  const lastByTopic = new Map() // topic -> last published payload (dedupe + re-announce)

  const usedSlugs = new Set()
  function uniqueSlug (base) {
    let slug = base
    let i = 2
    while (slug === '' || usedSlugs.has(slug)) {
      slug = `${base || 'entity'}_${i}`
      i += 1
    }
    usedSlugs.add(slug)
    return slug
  }

  function addPublisher (ga, fn) {
    const key = normalizeGa(ga)
    if (key === '') return
    if (!gaPublishers.has(key)) gaPublishers.set(key, [])
    gaPublishers.get(key).push(fn)
  }

  function addDiscovery (domain, slug, config) {
    discoveryConfigs.push({ topic: `${discoveryPrefix}/${domain}/${deviceId}/${slug}/config`, config })
  }

  // ---- Composite entities (cover / climate) ----------------------------------------------
  // Track GAs consumed by composite entities so they are NOT also exposed as plain per-GA
  // entities (which would duplicate them in Home Assistant).
  const consumedGAs = new Set()

  function buildCover (def, index) {
    const name = (typeof def.name === 'string' && def.name.trim()) ? def.name.trim() : `Cover ${index + 1}`
    const slug = uniqueSlug(slugify(name, `cover_${index + 1}`))
    const uniqueId = `${deviceId}_${slug}`
    const invert = def.invertPosition !== false // KNX 0% = open by default

    const gaUpDown = normalizeGa(def.gaUpDown)
    const gaStop = normalizeGa(def.gaStop)
    const gaPosSet = normalizeGa(def.gaPosSet)
    const gaPosState = normalizeGa(def.gaPosState)
    if (!gaUpDown && !gaPosSet && !gaPosState) return // nothing usable

    ;[gaUpDown, gaStop, gaPosSet, gaPosState].forEach((g) => { if (g) consumedGAs.add(g) })

    const commandTopic = `${root}/${slug}/set`
    const positionTopic = `${root}/${slug}/position`
    const setPositionTopic = `${root}/${slug}/position/set`

    const config = {
      name,
      unique_id: uniqueId,
      object_id: uniqueId,
      device_class: typeof def.deviceClass === 'string' && def.deviceClass ? def.deviceClass : 'blind',
      availability_topic: availabilityTopic,
      payload_available: 'online',
      payload_not_available: 'offline',
      device: deviceBlock
    }

    if (gaUpDown) {
      config.command_topic = commandTopic
      config.payload_open = 'OPEN'
      config.payload_close = 'CLOSE'
      config.payload_stop = gaStop ? 'STOP' : null
      const dptUpDown = resolveDpt(gaUpDown, ha.COVER_DEFAULT_DPT.upDown)
      const dptStop = resolveDpt(gaStop, ha.COVER_DEFAULT_DPT.stop)
      commandHandlers.set(commandTopic, (text) => {
        const cmd = String(text || '').trim().toUpperCase()
        if (cmd === 'OPEN') return [{ ga: gaUpDown, dpt: dptUpDown, value: false }] // 0 = Up/Open
        if (cmd === 'CLOSE') return [{ ga: gaUpDown, dpt: dptUpDown, value: true }] // 1 = Down/Close
        if (cmd === 'STOP' && gaStop) return [{ ga: gaStop, dpt: dptStop, value: true }]
        return []
      })
    }

    if (gaPosSet || gaPosState) {
      config.position_topic = positionTopic
      config.position_open = 100
      config.position_closed = 0
    }
    if (gaPosSet) {
      config.set_position_topic = setPositionTopic
      const dptPos = resolveDpt(gaPosSet, ha.COVER_DEFAULT_DPT.position)
      commandHandlers.set(setPositionTopic, (text) => {
        const haPos = toFiniteNumber(text, null)
        if (haPos === null) return []
        const knxPos = clamp(invert ? 100 - haPos : haPos, 0, 100)
        return [{ ga: gaPosSet, dpt: dptPos, value: knxPos }]
      })
    }
    if (gaPosState) {
      addPublisher(gaPosState, (value) => {
        const knxPos = toFiniteNumber(value, null)
        if (knxPos === null) return
        const haPos = clamp(invert ? 100 - knxPos : knxPos, 0, 100)
        pub(positionTopic, String(Math.round(haPos)), true)
      })
    }

    addDiscovery('cover', slug, config)
  }

  function buildClimate (def, index) {
    const name = (typeof def.name === 'string' && def.name.trim()) ? def.name.trim() : `Climate ${index + 1}`
    const slug = uniqueSlug(slugify(name, `climate_${index + 1}`))
    const uniqueId = `${deviceId}_${slug}`

    const gaCurrentTemp = normalizeGa(def.gaCurrentTemp)
    const gaSetpointSet = normalizeGa(def.gaSetpointSet)
    const gaSetpointState = normalizeGa(def.gaSetpointState) || gaSetpointSet
    const gaOnOff = normalizeGa(def.gaOnOff)
    if (!gaCurrentTemp && !gaSetpointSet) return // nothing usable

    ;[gaCurrentTemp, gaSetpointSet, gaSetpointState, gaOnOff].forEach((g) => { if (g) consumedGAs.add(g) })

    const currentTempTopic = `${root}/${slug}/current_temp`
    const tempSetTopic = `${root}/${slug}/temp/set`
    const tempStateTopic = `${root}/${slug}/temp/state`
    const modeSetTopic = `${root}/${slug}/mode/set`
    const modeStateTopic = `${root}/${slug}/mode/state`

    const config = {
      name,
      unique_id: uniqueId,
      object_id: uniqueId,
      availability_topic: availabilityTopic,
      payload_available: 'online',
      payload_not_available: 'offline',
      device: deviceBlock,
      min_temp: toFiniteNumber(def.minTemp, 5),
      max_temp: toFiniteNumber(def.maxTemp, 35),
      temp_step: toFiniteNumber(def.tempStep, 0.5),
      temperature_unit: 'C'
    }

    if (gaCurrentTemp) {
      config.current_temperature_topic = currentTempTopic
      addPublisher(gaCurrentTemp, (value) => {
        const n = toFiniteNumber(value, null)
        if (n !== null) pub(currentTempTopic, String(n), true)
      })
    }

    if (gaSetpointSet) {
      config.temperature_command_topic = tempSetTopic
      const dptSet = resolveDpt(gaSetpointSet, ha.CLIMATE_DEFAULT_DPT.setpoint)
      commandHandlers.set(tempSetTopic, (text) => {
        const n = toFiniteNumber(text, null)
        if (n === null) return []
        return [{ ga: gaSetpointSet, dpt: dptSet, value: n }]
      })
    }
    if (gaSetpointState) {
      config.temperature_state_topic = tempStateTopic
      addPublisher(gaSetpointState, (value) => {
        const n = toFiniteNumber(value, null)
        if (n !== null) pub(tempStateTopic, String(n), true)
      })
    }

    if (gaOnOff) {
      // Minimal HVAC mode support: off / heat, backed by a 1-bit on/off GA.
      config.modes = ['off', 'heat']
      config.mode_command_topic = modeSetTopic
      config.mode_state_topic = modeStateTopic
      const dptOnOff = resolveDpt(gaOnOff, ha.CLIMATE_DEFAULT_DPT.onOff)
      commandHandlers.set(modeSetTopic, (text) => {
        const mode = String(text || '').trim().toLowerCase()
        if (mode === 'off') return [{ ga: gaOnOff, dpt: dptOnOff, value: false }]
        return [{ ga: gaOnOff, dpt: dptOnOff, value: true }] // heat / any other -> on
      })
      addPublisher(gaOnOff, (value) => {
        pub(modeStateTopic, value === true || value === 'true' || value === 1 ? 'heat' : 'off', true)
      })
    } else {
      config.modes = ['heat']
    }

    addDiscovery('climate', slug, config)
  }

  customEntities.forEach((def, index) => {
    if (!def || typeof def !== 'object') return
    try {
      if (def.type === 'cover') buildCover(def, index)
      else if (def.type === 'climate') buildClimate(def, index)
    } catch (_err) {
      // A single malformed entity must not break the whole bridge.
    }
  })

  // ---- Simple per-GA entities ------------------------------------------------------------
  const simpleSeen = new Set()
  sourceGAs.forEach((entry) => {
    if (!entry || typeof entry.ga !== 'string' || entry.ga.trim() === '') return
    const ga = entry.ga.trim()
    if (consumedGAs.has(ga)) return // already part of a cover/climate
    if (exposeFilter && !exposeFilter.has(ga)) return // deselected by the user
    const baseSlug = gaToSlug(ga)
    if (baseSlug === '' || simpleSeen.has(ga)) return
    simpleSeen.add(ga)
    const map = ha.mapDptToHa(entry.dpt)
    // Read-only GAs are downgraded to a state-only domain and never get a command topic,
    // so Home Assistant can display them but can't write back to the KNX bus.
    const isReadOnly = readOnlyFilter.has(ga)
    const domain = isReadOnly
      ? (map.domain === 'switch' ? 'binary_sensor' : (map.domain === 'number' || map.domain === 'text' ? 'sensor' : map.domain))
      : map.domain
    const slug = uniqueSlug(baseSlug)
    const uniqueId = `${deviceId}_${slug}`
    const name = formatEntityName(entry.devicename, ga, nameFormat)
    const stateTopic = `${root}/${slug}/state`
    const commandTopic = `${root}/${slug}/set`

    const config = {
      name,
      unique_id: uniqueId,
      object_id: uniqueId,
      state_topic: stateTopic,
      availability_topic: availabilityTopic,
      payload_available: 'online',
      payload_not_available: 'offline',
      device: deviceBlock
    }
    switch (domain) {
      case 'switch':
        config.command_topic = commandTopic
        config.payload_on = 'true'
        config.payload_off = 'false'
        config.state_on = 'true'
        config.state_off = 'false'
        break
      case 'binary_sensor':
        config.payload_on = 'true'
        config.payload_off = 'false'
        if (map.deviceClass) config.device_class = map.deviceClass
        break
      case 'number':
        config.command_topic = commandTopic
        if (typeof map.min === 'number') config.min = map.min
        if (typeof map.max === 'number') config.max = map.max
        if (typeof map.step === 'number') config.step = map.step
        config.mode = 'box'
        if (map.unit) config.unit_of_measurement = map.unit
        break
      case 'text':
        config.command_topic = commandTopic
        break
      case 'sensor':
      default:
        if (map.unit) config.unit_of_measurement = map.unit
        if (map.deviceClass) config.device_class = map.deviceClass
        break
    }
    addDiscovery(domain, slug, config)

    // KNX -> MQTT: publish the decoded value to the state topic.
    addPublisher(ga, (value) => pub(stateTopic, ha.formatValueForMqtt(value), true))

    // MQTT -> KNX: writable domains accept commands (unless the GA is read-only).
    if (map.writable === true && !isReadOnly) {
      const dpt = entry.dpt
      commandHandlers.set(commandTopic, (text) => {
        const value = ha.parseCommandFromMqtt(text, dpt)
        if (value === null) return []
        return [{ ga, dpt, value }]
      })
    }
  })

  const entityCount = discoveryConfigs.length
  const commandTopics = Array.from(commandHandlers.keys())

  let client = null
  let closed = false

  function log (msg) {
    if (node && typeof node.log === 'function') node.log(`[mqtt] ${msg}`)
  }

  function publishRaw (topic, payload, retain) {
    if (!client || closed) return
    try {
      client.publish(topic, payload, { retain: retain === true, qos: 0 })
    } catch (_err) {
      // best-effort
    }
  }

  // Publish a state value, retained and deduplicated per topic.
  function pub (topic, payload, retain) {
    if (lastByTopic.get(topic) === payload) return
    lastByTopic.set(topic, payload)
    publishRaw(topic, payload, retain)
  }

  // Called from the config node on every GroupValue_Write/Response, with the value already
  // decoded by KNXUltimate. Routes it to every MQTT topic that depends on this GA.
  function publishState (ga, value) {
    const publishers = gaPublishers.get(normalizeGa(ga))
    if (!publishers) return
    publishers.forEach((fn) => {
      try {
        fn(value)
      } catch (_err) {
        // best-effort
      }
    })
  }

  function warn (msg) {
    if (node && typeof node.warn === 'function') {
      try { node.warn(msg) } catch (_err) { /* ignore */ }
    }
  }

  // Never let a callback passed in by the caller throw out of an mqtt event handler.
  function safeStatus (status) {
    try {
      onStatus(status)
    } catch (_err) {
      // ignore
    }
  }

  // (Re)publish availability + discovery + last known state for every entity. Called on
  // connect and whenever HA comes online, so entities reappear after an HA restart.
  function announce () {
    try {
      publishRaw(availabilityTopic, 'online', true)
      if (discovery) {
        discoveryConfigs.forEach((d) => {
          try {
            publishRaw(d.topic, JSON.stringify(d.config), true)
          } catch (_err) {
            // skip a single malformed config rather than abort the whole announce
          }
        })
      }
      // Re-send cached states so HA doesn't show "unknown" right after (re)announcing.
      lastByTopic.forEach((payload, topic) => publishRaw(topic, payload, true))
      log(`announced discovery (${discovery ? entityCount + ' entit(y/ies)' : 'discovery OFF'})`)
    } catch (err) {
      warn('MQTT announce error: ' + (err && err.message))
    }
  }

  function handleIncoming (topic, buf) {
    try {
      const text = buf == null ? '' : buf.toString()

      // Home Assistant birth message: re-announce everything when HA comes online.
      if (birthTopics.includes(topic)) {
        if (text.trim().toLowerCase() === 'online') announce()
        return
      }

      const handler = commandHandlers.get(topic)
      if (!handler) return
      let writes = []
      try {
        writes = handler(text) || []
      } catch (err) {
        if (node && typeof node.error === 'function') node.error(err)
        return
      }
      writes.forEach((w) => {
        if (!w || !w.ga) return
        try {
          onCommand(w)
        } catch (err) {
          if (node && typeof node.error === 'function') node.error(err)
        }
      })
    } catch (err) {
      warn('MQTT message handling error: ' + (err && err.message))
    }
  }

  function connect () {
    if (!url) {
      onStatus({ state: 'error', detail: 'missing url' })
      return
    }
    const connectOpts = {
      reconnectPeriod: 5000,
      connectTimeout: 15000,
      will: { topic: availabilityTopic, payload: 'offline', retain: true, qos: 0 }
    }
    if (username) connectOpts.username = username
    if (password) connectOpts.password = password

    try {
      client = mqtt.connect(url, connectOpts)
    } catch (err) {
      safeStatus({ state: 'error', detail: err && err.message })
      return
    }

    // Every handler is fully guarded: an exception thrown inside an mqtt event listener would
    // otherwise become an uncaught exception and could take Node-RED down.
    client.on('connect', () => {
      try {
        log(`connected to ${url} (${entityCount} entities)`)
        announce()
        try {
          commandTopics.forEach((t) => client.subscribe(t, { qos: 0 }))
          birthTopics.forEach((t) => client.subscribe(t, { qos: 0 }))
        } catch (_err) {
          // best-effort
        }
        safeStatus({ state: 'connected', detail: String(entityCount) })
      } catch (err) {
        warn('MQTT connect handler error: ' + (err && err.message))
      }
    })
    client.on('message', handleIncoming)
    client.on('reconnect', () => safeStatus({ state: 'reconnect' }))
    client.on('offline', () => safeStatus({ state: 'offline' }))
    client.on('error', (err) => {
      warn(`MQTT error: ${err && err.message}`)
      safeStatus({ state: 'error', detail: err && err.message })
    })
    client.on('close', () => safeStatus({ state: 'offline' }))
  }

  function close (done) {
    closed = true
    const c = client
    client = null

    let finished = false
    function finish () {
      if (finished) return
      finished = true
      clearTimeout(guard)
      // Force-close the socket and stop reconnection attempts; never wait on the broker.
      if (c) {
        try {
          c.end(true)
        } catch (_err) {
          // ignore
        }
      }
      if (typeof done === 'function') done()
    }

    // Hard cap so stopping/redeploying is never blocked when the broker is slow or unreachable.
    const guard = setTimeout(finish, 700)
    if (typeof guard.unref === 'function') guard.unref()

    if (!c) {
      finish()
      return
    }

    if (c.connected) {
      // Best-effort retained "offline" before a graceful disconnect (the Last Will only fires
      // on an ungraceful drop). The guard above bounds how long we wait for it.
      try {
        c.publish(availabilityTopic, 'offline', { retain: true, qos: 0 }, () => finish())
      } catch (_err) {
        finish()
      }
    } else {
      finish()
    }
  }

  return {
    connect,
    close,
    publishState,
    entityCount,
    topics: { root, availabilityTopic, commandTopics }
  }
}

module.exports = { createMqttBridge }
