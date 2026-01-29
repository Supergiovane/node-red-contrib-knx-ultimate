// KNX Router Filter - filters RAW telegram objects between KNX Multi Routing nodes
const normalizeText = (value) => String(value || '').trim()

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
    node.allowWrite = config.allowWrite !== undefined ? (config.allowWrite === true || config.allowWrite === 'true') : true
    node.allowResponse = config.allowResponse !== undefined ? (config.allowResponse === true || config.allowResponse === 'true') : true
    node.allowRead = config.allowRead !== undefined ? (config.allowRead === true || config.allowRead === 'true') : true

    node.gaMode = config.gaMode || 'off' // off|allow|block
    node.gaPatterns = config.gaPatterns || ''
    node.srcMode = config.srcMode || 'off' // off|allow|block
    node.srcPatterns = config.srcPatterns || ''

    node.rewriteGA = config.rewriteGA !== undefined ? (config.rewriteGA === true || config.rewriteGA === 'true') : false
    node.gaRewriteRules = config.gaRewriteRules || ''
    node.rewriteSource = config.rewriteSource !== undefined ? (config.rewriteSource === true || config.rewriteSource === 'true') : false
    node.srcRewriteRules = config.srcRewriteRules || ''

    const gaRegexes = compileAddressPatterns({ raw: node.gaPatterns, kind: 'ga' })
    const srcRegexes = compileAddressPatterns({ raw: node.srcPatterns, kind: 'src' })
    const gaRewrite = compileRewriteRules({ raw: node.gaRewriteRules, kind: 'ga' })
    const srcRewrite = compileRewriteRules({ raw: node.srcRewriteRules, kind: 'src' })

    let passed = 0
    let dropped = 0

    const setCountersStatus = () => {
      node.status({ fill: 'grey', shape: 'dot', text: `pass ${passed} / drop ${dropped}` })
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
        const fields = extractFields(msg)

        // If message doesn't look like a KNX raw telegram, pass it through unchanged.
        if (!fields.event && !fields.destination && !fields.source) {
          passed += 1
          node.send([msg, null])
          setCountersStatus()
          return
        }

        if (!shouldPassEvent(fields.event)) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'event', event: fields.event })
          node.send([null, msg])
          setCountersStatus()
          return
        }

        if (!shouldPassAddress({ mode: node.gaMode, value: fields.destination, regexes: gaRegexes })) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'ga', ga: fields.destination })
          node.send([null, msg])
          setCountersStatus()
          return
        }

        if (!shouldPassAddress({ mode: node.srcMode, value: fields.source, regexes: srcRegexes })) {
          dropped += 1
          attachFilterMeta(msg, { dropped: true, reason: 'source', source: fields.source })
          node.send([null, msg])
          setCountersStatus()
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
            meta = Object.assign({}, meta, {
              rewritten: true,
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
        setCountersStatus()
      } catch (error) {
        node.error(error)
        node.status({ fill: 'red', shape: 'dot', text: error.message || String(error) })
      }
    })

    setCountersStatus()
  }

  RED.nodes.registerType('knxUltimateRouterFilter', knxUltimateRouterFilter)
}
