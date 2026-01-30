// KNX Router Filter - filters RAW telegram objects between KNX Multi Routing nodes
const normalizeText = (value) => String(value || '').trim()

const normalizeHex = (value) => {
  if (value === undefined || value === null) return ''
  const s = String(value).trim()
  if (!s) return ''
  return s.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '')
}

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  const s = String(value).trim().toLowerCase()
  if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true
  if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false
  return fallback
}

const normalizeMultiline = (value) => {
  if (value === undefined || value === null) return ''
  if (Array.isArray(value)) return value.map(v => String(v)).join('\n')
  return String(value)
}

let _knxultimateCache = null
const getKnxultimate = () => {
  if (_knxultimateCache) return _knxultimateCache
  _knxultimateCache = require('knxultimate')
  return _knxultimateCache
}

const splitPatterns = (raw) => {
  const s = normalizeText(raw)
  if (!s) return []
  return s
    .split(/[\r\n,;]+/)
    .map(t => t.trim())
    .filter(Boolean)
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const compileAddressPatterns = ({ raw, kind }) => {
  const tokens = splitPatterns(raw)
  const regexes = []
  for (const token of tokens) {
    if (token === '*') {
      regexes.push(/^.*$/)
      continue
    }
    if (token.toLowerCase().startsWith('re:')) {
      const reSrc = token.slice(3).trim()
      if (!reSrc) continue
      try {
        regexes.push(new RegExp(reSrc))
      } catch (error) {
        // ignore invalid regex
      }
      continue
    }

    if (kind === 'ga') {
      const parts = token.split('/').map(p => p.trim()).filter(p => p !== '')
      if (parts.length === 0) continue
      while (parts.length < 3) parts.push('*')
      const segs = parts.slice(0, 3).map((p) => {
        if (p === '*' || p === 'x' || p === 'X') return '\\d+'
        if (/^\\d+$/.test(p)) return escapeRegExp(p)
        // fallback: allow exact match for weird inputs
        return escapeRegExp(p)
      })
      regexes.push(new RegExp(`^${segs[0]}/${segs[1]}/${segs[2]}$`))
      continue
    }

    // kind === 'src' (physical address)
    const parts = token.split('.').map(p => p.trim()).filter(p => p !== '')
    if (parts.length === 0) continue
    while (parts.length < 3) parts.push('*')
    const segs = parts.slice(0, 3).map((p) => {
      if (p === '*' || p === 'x' || p === 'X') return '\\d+'
      if (/^\\d+$/.test(p)) return escapeRegExp(p)
      return escapeRegExp(p)
    })
    regexes.push(new RegExp(`^${segs[0]}\\.${segs[1]}\\.${segs[2]}$`))
  }
  return regexes
}

const matchesAny = (value, regexes) => {
  if (!regexes || regexes.length === 0) return false
  const s = String(value || '')
  if (!s) return false
  for (const re of regexes) {
    try {
      if (re.test(s)) return true
    } catch (e) { /* ignore */ }
  }
  return false
}

const compileRewriteRules = ({ raw, kind }) => {
  const lines = splitPatterns(raw)
  const rules = []
  for (const line of lines) {
    const trimmed = String(line || '').trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue

    const sep = trimmed.includes('=>') ? '=>' : (trimmed.includes('->') ? '->' : null)
    if (!sep) continue
    const parts = trimmed.split(sep)
    if (parts.length < 2) continue
    const left = parts[0].trim()
    const right = parts.slice(1).join(sep).trim()
    if (!left || !right) continue

    // Regex rule
    if (left.toLowerCase().startsWith('re:')) {
      const reSrc = left.slice(3).trim()
      if (!reSrc) continue
      try {
        rules.push({
          type: 'regex',
          re: new RegExp(reSrc),
          replacement: right,
          source: trimmed
        })
      } catch (error) { /* ignore invalid */ }
      continue
    }

    // Wildcard rule (ga/src)
    const delimiter = kind === 'ga' ? '/' : '.'
    const leftParts = left.split(delimiter).map(p => p.trim()).filter(p => p !== '')
    if (leftParts.length === 0) continue
    while (leftParts.length < 3) leftParts.push('*')
    const leftSegs = leftParts.slice(0, 3).map((p) => {
      if (p === '*' || p === 'x' || p === 'X') return '(\\d+)'
      if (/^\\d+$/.test(p)) return escapeRegExp(p)
      return escapeRegExp(p)
    })
    const re = new RegExp(`^${leftSegs.join(kind === 'ga' ? '\\/' : '\\.')}$`)

    // replacement: allow '*' placeholders to map capture groups in order
    let replacement = right
    let captureIndex = 1
    replacement = replacement.replace(/\*/g, () => `$${captureIndex++}`)
    rules.push({ type: 'wildcard', re, replacement, source: trimmed })
  }
  return rules
}

const applyRewrite = (value, rules) => {
  const s = String(value || '')
  if (!s || !rules || rules.length === 0) return s
  for (const rule of rules) {
    try {
      if (rule.re && rule.re.test(s)) {
        const out = s.replace(rule.re, rule.replacement)
        return out
      }
    } catch (e) { /* ignore */ }
  }
  return s
}

const setNestedIfExists = (obj, path, value) => {
  try {
    if (!obj || typeof obj !== 'object') return false
    const parts = path.split('.')
    let cur = obj
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur || typeof cur !== 'object') return false
      if (!Object.prototype.hasOwnProperty.call(cur, parts[i])) return false
      cur = cur[parts[i]]
    }
    const last = parts[parts.length - 1]
    if (!Object.prototype.hasOwnProperty.call(cur, last)) return false
    cur[last] = value
    return true
  } catch (e) {
    return false
  }
}

const getPayloadObject = (msg) => {
  if (!msg || typeof msg !== 'object') return null
  if (!msg.payload || typeof msg.payload !== 'object' || Buffer.isBuffer(msg.payload)) return null
  return msg.payload
}

const getKnxObject = (msg) => {
  const payload = getPayloadObject(msg)
  if (payload && payload.knx && typeof payload.knx === 'object' && !Buffer.isBuffer(payload.knx)) return payload.knx
  if (msg && msg.knx && typeof msg.knx === 'object' && !Buffer.isBuffer(msg.knx)) return msg.knx
  return null
}

const getCemiHexFromMsg = (msg) => {
  const knx = getKnxObject(msg)
  if (!knx) return ''
  const cemi = knx.cemi
  if (!cemi) return ''
  if (typeof cemi === 'string') return cemi
  if (typeof cemi === 'object' && !Buffer.isBuffer(cemi) && cemi.hex) return cemi.hex
  return ''
}

const setCemiHexOnMsg = (msg, cemiHex) => {
  const knx = getKnxObject(msg)
  if (!knx) return false
  if (knx.cemi && typeof knx.cemi === 'object' && !Buffer.isBuffer(knx.cemi) && 'hex' in knx.cemi) {
    knx.cemi.hex = cemiHex
    return true
  }
  knx.cemi = { hex: cemiHex }
  return true
}

const isIndividualAddressString = (value) => /^\d{1,2}\.\d{1,2}\.\d{1,3}$/.test(String(value || '').trim())
const isGroupAddressString = (value) => /^\d{1,2}\/\d{1,2}\/\d{1,3}$/.test(String(value || '').trim())

const syncCemiWithKnxFields = (msg) => {
  const knx = getKnxObject(msg)
  if (!knx) return false
  const cemiHex = getCemiHexFromMsg(msg)
  const clean = normalizeHex(cemiHex)
  if (!clean || clean.length % 2 !== 0) return false

  let cemi
  try {
    const { KNXTunnelingRequest } = getKnxultimate()
    cemi = KNXTunnelingRequest.parseCEMIMessage(Buffer.from(clean, 'hex'), 0)
  } catch (e) {
    return false
  }
  if (!cemi || !cemi.control) return false

  let updated = false
  try {
    if (isIndividualAddressString(knx.source)) {
      const { KNXAddress } = getKnxultimate()
      cemi.srcAddress = KNXAddress.createFromString(String(knx.source).trim(), KNXAddress.TYPE_INDIVIDUAL)
      updated = true
    }
  } catch (e) { /* ignore */ }

  try {
    if (isGroupAddressString(knx.destination)) {
      const { KNXAddress } = getKnxultimate()
      cemi.dstAddress = KNXAddress.createFromString(String(knx.destination).trim(), KNXAddress.TYPE_GROUP)
      try { cemi.control.addressType = 1 } catch (e2) { /* ignore */ }
      updated = true
    }
  } catch (e) { /* ignore */ }

  if (!updated) return false
  try {
    const outHex = cemi.toBuffer().toString('hex')
    setCemiHexOnMsg(msg, outHex)
    try { knx.cemi.hopCount = knx.cemi.hopCount } catch (e) { /* ignore */ }
    return true
  } catch (e) {
    return false
  }
}

const attachFilterMeta = (msg, meta) => {
  try {
    const payload = getPayloadObject(msg)
    if (!payload) return
    payload.knxRouterFilter = meta
  } catch (e) { /* ignore */ }
}

const getOrCreateMeta = (msg) => {
  const payload = getPayloadObject(msg)
  if (!payload) return null
  if (!payload.knxRouterFilter || typeof payload.knxRouterFilter !== 'object' || Buffer.isBuffer(payload.knxRouterFilter)) {
    payload.knxRouterFilter = {}
  }
  return payload.knxRouterFilter
}

module.exports = function (RED) {
  function knxUltimateRouterFilter (config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.name = config.name || 'KNX Router Filter'
    node.allowWrite = parseBoolean(config.allowWrite, true)
    node.allowResponse = parseBoolean(config.allowResponse, true)
    node.allowRead = parseBoolean(config.allowRead, true)

    node.gaMode = config.gaMode || 'off' // off|allow|block
    node.gaPatterns = config.gaPatterns || ''
    node.srcMode = config.srcMode || 'off' // off|allow|block
    node.srcPatterns = config.srcPatterns || ''

    node.rewriteGA = parseBoolean(config.rewriteGA, false)
    node.gaRewriteRules = config.gaRewriteRules || ''
    node.rewriteSource = parseBoolean(config.rewriteSource, false)
    node.srcRewriteRules = config.srcRewriteRules || ''

    let gaRegexes = compileAddressPatterns({ raw: node.gaPatterns, kind: 'ga' })
    let srcRegexes = compileAddressPatterns({ raw: node.srcPatterns, kind: 'src' })
    let gaRewrite = compileRewriteRules({ raw: node.gaRewriteRules, kind: 'ga' })
    let srcRewrite = compileRewriteRules({ raw: node.srcRewriteRules, kind: 'src' })

    let passed = 0
    let dropped = 0

    const providerCache = new Map()

    const getGatewayIdFromMsg = (msg) => {
      try {
        const payload = msg && msg.payload && typeof msg.payload === 'object' && !Buffer.isBuffer(msg.payload) ? msg.payload : null
        const routing = (payload && payload.knxMultiRouting) ? payload.knxMultiRouting : (msg && msg.knxMultiRouting ? msg.knxMultiRouting : null)
        const id = routing && routing.gateway && routing.gateway.id ? String(routing.gateway.id) : ''
        return id
      } catch (e) {
        return ''
      }
    }

    const resolveProvider = (gatewayId) => {
      if (!gatewayId) return null
      if (providerCache.has(gatewayId)) return providerCache.get(gatewayId) || null
      try {
        const p = RED.nodes.getNode(gatewayId) || null
        providerCache.set(gatewayId, p)
        return p
      } catch (e) {
        providerCache.set(gatewayId, null)
        return null
      }
    }

    const applyStatus = (msg, status) => {
      try {
        const gatewayId = getGatewayIdFromMsg(msg)
        const provider = resolveProvider(gatewayId)
        if (provider && typeof provider.applyStatusUpdate === 'function') {
          provider.applyStatusUpdate(node, status)
        } else {
          node.status(status)
        }
      } catch (e) {
        try { node.status(status) } catch (e2) { /* ignore */ }
      }
    }

    const setCountersStatus = (msg) => {
      applyStatus(msg, { fill: 'grey', shape: 'dot', text: `pass ${passed} / drop ${dropped}` })
    }

    let configStatusTimer = null
    const setConfigStatus = (msg, text) => {
      try {
        if (configStatusTimer) clearTimeout(configStatusTimer)
        applyStatus(msg, { fill: 'blue', shape: 'ring', text: text || 'Config changed' })
        configStatusTimer = setTimeout(() => setCountersStatus(null), 2000)
      } catch (e) { /* ignore */ }
    }

    const rebuildCompiledRules = () => {
      gaRegexes = compileAddressPatterns({ raw: node.gaPatterns, kind: 'ga' })
      srcRegexes = compileAddressPatterns({ raw: node.srcPatterns, kind: 'src' })
      gaRewrite = compileRewriteRules({ raw: node.gaRewriteRules, kind: 'ga' })
      srcRewrite = compileRewriteRules({ raw: node.srcRewriteRules, kind: 'src' })
    }

    const applySetConfig = (msg) => {
      const sc = msg && msg.setConfig && typeof msg.setConfig === 'object' && !Buffer.isBuffer(msg.setConfig) ? msg.setConfig : null
      if (!sc) return false

      const changedKeys = []
      const markChanged = (key) => { if (!changedKeys.includes(key)) changedKeys.push(key) }

      if (Object.prototype.hasOwnProperty.call(sc, 'name')) {
        node.name = normalizeText(sc.name) || node.name
        markChanged('name')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'allowWrite')) {
        node.allowWrite = parseBoolean(sc.allowWrite, node.allowWrite)
        markChanged('allowWrite')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'allowResponse')) {
        node.allowResponse = parseBoolean(sc.allowResponse, node.allowResponse)
        markChanged('allowResponse')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'allowRead')) {
        node.allowRead = parseBoolean(sc.allowRead, node.allowRead)
        markChanged('allowRead')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'gaMode')) {
        const m = normalizeText(sc.gaMode).toLowerCase()
        if (m === 'off' || m === 'allow' || m === 'block') {
          node.gaMode = m
          markChanged('gaMode')
        }
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'gaPatterns')) {
        node.gaPatterns = normalizeMultiline(sc.gaPatterns)
        markChanged('gaPatterns')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'srcMode')) {
        const m = normalizeText(sc.srcMode).toLowerCase()
        if (m === 'off' || m === 'allow' || m === 'block') {
          node.srcMode = m
          markChanged('srcMode')
        }
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'srcPatterns')) {
        node.srcPatterns = normalizeMultiline(sc.srcPatterns)
        markChanged('srcPatterns')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'rewriteGA')) {
        node.rewriteGA = parseBoolean(sc.rewriteGA, node.rewriteGA)
        markChanged('rewriteGA')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'gaRewriteRules')) {
        node.gaRewriteRules = normalizeMultiline(sc.gaRewriteRules)
        markChanged('gaRewriteRules')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'rewriteSource')) {
        node.rewriteSource = parseBoolean(sc.rewriteSource, node.rewriteSource)
        markChanged('rewriteSource')
      }
      if (Object.prototype.hasOwnProperty.call(sc, 'srcRewriteRules')) {
        node.srcRewriteRules = normalizeMultiline(sc.srcRewriteRules)
        markChanged('srcRewriteRules')
      }

      if (changedKeys.length > 0) {
        rebuildCompiledRules()
        setConfigStatus(msg, `Config changed: ${changedKeys.join(', ')}`)
      }
      return true
    }

    const extractFields = (msg) => {
      const payload = msg && msg.payload !== undefined ? msg.payload : null
      const knx = (payload && payload.knx) ? payload.knx : (msg && msg.knx ? msg.knx : null)
      const event = knx && knx.event ? String(knx.event) : ''
      const destination = knx && (knx.destination || knx.grpaddr || knx.ga) ? String(knx.destination || knx.grpaddr || knx.ga) : ''
      const source = knx && knx.source ? String(knx.source) : ''
      return { event, destination, source }
    }

    const shouldPassEvent = (event) => {
      if (!event) return true
      if (event === 'GroupValue_Write') return node.allowWrite
      if (event === 'GroupValue_Response') return node.allowResponse
      if (event === 'GroupValue_Read') return node.allowRead
      return true
    }

    const shouldPassAddress = ({ mode, value, regexes }) => {
      if (!mode || mode === 'off') return true
      if (!regexes || regexes.length === 0) return true
      const isMatch = matchesAny(value, regexes)
      if (mode === 'allow') return isMatch
      if (mode === 'block') return !isMatch
      return true
    }

    node.on('input', function (msg) {
      try {
        if (msg && Object.prototype.hasOwnProperty.call(msg, 'setConfig')) {
          applySetConfig(msg)
          return
        }

        const fields = extractFields(msg)

        // If message doesn't look like a KNX raw telegram, pass it through unchanged.
        if (!fields.event && !fields.destination && !fields.source) {
          passed += 1
          node.send([msg, null])
          setCountersStatus(msg)
          return
        }

        if (!shouldPassEvent(fields.event)) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'event', event: fields.event })
          node.send([null, msg])
          setCountersStatus(msg)
          return
        }

        if (!shouldPassAddress({ mode: node.gaMode, value: fields.destination, regexes: gaRegexes })) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'ga', ga: fields.destination })
          node.send([null, msg])
          setCountersStatus(msg)
          return
        }

        if (!shouldPassAddress({ mode: node.srcMode, value: fields.source, regexes: srcRegexes })) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'source', source: fields.source })
          node.send([null, msg])
          setCountersStatus(msg)
          return
        }

        passed += 1
        let meta = getOrCreateMeta(msg) || {}
        // Rewrite fields only for passed messages
        if (fields.event || fields.destination || fields.source) {
          const beforeGA = fields.destination
          const beforeSrc = fields.source
          let afterGA = beforeGA
          let afterSrc = beforeSrc
          if (node.rewriteGA) afterGA = applyRewrite(beforeGA, gaRewrite)
          if (node.rewriteSource) afterSrc = applyRewrite(beforeSrc, srcRewrite)

          let anyRewrite = false

          if (afterGA && afterGA !== beforeGA) {
            // Prefer payload.knx.destination, fallback to msg.knx.destination
            const changed = setNestedIfExists(msg, 'payload.knx.destination', afterGA) || setNestedIfExists(msg, 'knx.destination', afterGA)
            meta = Object.assign({}, meta, { rewrite: Object.assign({}, meta.rewrite || {}, { destination: { from: beforeGA, to: afterGA } }) })
            if (!changed && msg.payload && msg.payload.knx) msg.payload.knx.destination = afterGA
            anyRewrite = true
          }
          if (afterSrc && afterSrc !== beforeSrc) {
            const changed = setNestedIfExists(msg, 'payload.knx.source', afterSrc) || setNestedIfExists(msg, 'knx.source', afterSrc)
            meta = Object.assign({}, meta, { rewrite: Object.assign({}, meta.rewrite || {}, { source: { from: beforeSrc, to: afterSrc } }) })
            if (!changed && msg.payload && msg.payload.knx) msg.payload.knx.source = afterSrc
            anyRewrite = true
          }

          if (anyRewrite) {
            let cemiSynced = false
            try { cemiSynced = syncCemiWithKnxFields(msg) } catch (e) { cemiSynced = false }
            meta = Object.assign({}, meta, {
              rewritten: true,
              cemiSynced,
              original: Object.assign({}, meta.original || {}, {
                destination: beforeGA,
                source: beforeSrc
              })
            })
          }
        }
        const finalMeta = Object.assign({}, meta || {}, { dropped: false, rewritten: !!(meta && meta.rewritten) })
        attachFilterMeta(msg, finalMeta)
        node.send([msg, null])
        setCountersStatus(msg)
      } catch (error) {
        node.error(error)
        applyStatus(msg, { fill: 'red', shape: 'dot', text: error.message || String(error) })
      }
    })

    node.on('close', function () {
      try {
        if (configStatusTimer) clearTimeout(configStatusTimer)
        configStatusTimer = null
      } catch (e) { /* ignore */ }
    })

    setCountersStatus(null)
  }

  RED.nodes.registerType('knxUltimateRouterFilter', knxUltimateRouterFilter)
}
