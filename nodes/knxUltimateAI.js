// KNX Ultimate AI / Traffic Analyzer
const loggerClass = require('./utils/sysLogger')

const coerceBoolean = (value) => (value === true || value === 'true')

let adminEndpointsRegistered = false
const aiRuntimeNodes = new Map()

const sanitizeApiKey = (value) => {
  if (value === undefined || value === null) return ''
  let key = String(value).trim()
  if (key === '') return ''
  // Node-RED password placeholder when credential is already set
  if (key === '__PWRD__') return ''
  // Common copy/paste mistakes
  key = key.replace(/^authorization:\s*/i, '')
  key = key.replace(/^bearer\s+/i, '')
  key = key.replace(/^"(.+)"$/, '$1').replace(/^'(.+)'$/, '$1')
  // If user pasted a full header line, extract the token-like part
  const match = key.match(/(sk-[A-Za-z0-9_-]{10,})/)
  if (match) return match[1]
  return key
}

const safeStringify = (value) => {
  try {
    if (value === undefined) return ''
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  } catch (error) {
    return String(value)
  }
}

const normalizeValueForCompare = (value) => {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (Buffer.isBuffer(value)) return `buffer:${value.toString('hex')}`
  if (typeof value === 'object') return safeStringify(value)
  return String(value)
}

const nowMs = () => Date.now()

const postJson = async ({ url, headers, body, timeoutMs }) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs || 30000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'content-type': 'application/json' }, headers || {}),
      body: JSON.stringify(body || {}),
      signal: controller.signal
    })
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      json = { raw: text }
    }
    if (!res.ok) {
      const message = (json && (json.error?.message || json.message)) ? (json.error?.message || json.message) : `HTTP ${res.status}`
      const err = new Error(message)
      err.status = res.status
      err.response = json
      throw err
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

const getJson = async ({ url, headers, timeoutMs }) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs || 20000)
  try {
    const res = await fetch(url, { method: 'GET', headers: headers || {}, signal: controller.signal })
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      json = { raw: text }
    }
    if (!res.ok) {
      const message = (json && (json.error?.message || json.message)) ? (json.error?.message || json.message) : `HTTP ${res.status}`
      const err = new Error(message)
      err.status = res.status
      err.response = json
      throw err
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

const deriveModelsUrlFromBaseUrl = (baseUrl) => {
  const raw = String(baseUrl || '').trim()
  if (!raw) return 'https://api.openai.com/v1/models'
  try {
    const u = new URL(raw)
    const path = u.pathname || '/'
    if (/\/chat\/completions\/?$/.test(path)) {
      u.pathname = path.replace(/\/chat\/completions\/?$/, '/models')
      return u.toString()
    }
    if (/\/responses\/?$/.test(path)) {
      u.pathname = path.replace(/\/responses\/?$/, '/models')
      return u.toString()
    }
    if (/\/models\/?$/.test(path)) {
      u.pathname = path.replace(/\/models\/?$/, '/models')
      return u.toString()
    }
    if (/\/v1\/?$/.test(path)) {
      u.pathname = path.replace(/\/v1\/?$/, '/v1/models')
      return u.toString()
    }
    const v1Idx = path.indexOf('/v1')
    if (v1Idx >= 0) {
      u.pathname = path.slice(0, v1Idx + 3) + '/models'
      return u.toString()
    }
    u.pathname = '/v1/models'
    return u.toString()
  } catch (error) {
    return 'https://api.openai.com/v1/models'
  }
}

const isProbablyChatModelId = (id) => {
  const s = String(id || '').toLowerCase()
  if (!s) return false
  if (s.includes('embedding')) return false
  if (s.includes('whisper')) return false
  if (s.includes('tts')) return false
  if (s.includes('dall-e') || s.includes('dalle')) return false
  if (s.includes('moderation')) return false
  return true
}

module.exports = function (RED) {
  const buildKnxUltimateFlowInventory = ({ maxNodes = 80 } = {}) => {
    const tabById = new Map()
    const gatewaysById = new Map()
    const knxNodes = []

    try {
      if (typeof RED.nodes.eachNode !== 'function') return ''

      // First pass: collect tabs + gateways
      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (type === 'tab') {
          tabById.set(String(n.id || ''), String(n.label || n.name || ''))
          return
        }
        if (type === 'knxUltimate-config') {
          gatewaysById.set(String(n.id || ''), {
            id: String(n.id || ''),
            name: String(n.name || ''),
            physAddr: String(n.physAddr || '')
          })
        }
      })

      // Second pass: collect KNX Ultimate nodes (all flows)
      RED.nodes.eachNode((n) => {
        if (!n || typeof n !== 'object') return
        const type = String(n.type || '')
        if (!type.startsWith('knxUltimate') || type === 'knxUltimate-config') return

        const tabId = String(n.z || '')
        const tabLabel = tabById.get(tabId) || ''
        const id = String(n.id || '')
        const name = String(n.name || '')
        const server = String(n.server || '')
        const gw = gatewaysById.get(server) || null

        const entry = {
          tabLabel,
          type,
          id,
          name,
          gatewayId: server,
          gatewayName: gw ? gw.name : '',
          topic: n.topic !== undefined ? String(n.topic) : '',
          dpt: n.dpt !== undefined ? String(n.dpt) : ''
        }

        if (type === 'knxUltimate') {
          entry.listenAllGA = n.listenallga === true || n.listenallga === 'true'
          entry.outputType = n.outputtype !== undefined ? String(n.outputtype) : ''
          entry.notifyWrite = n.notifywrite === true || n.notifywrite === 'true'
          entry.notifyResponse = n.notifyresponse === true || n.notifyresponse === 'true'
          entry.notifyRead = n.notifyreadrequest === true || n.notifyreadrequest === 'true'
        } else if (type === 'knxUltimateMultiRouting') {
          entry.outputTopic = n.outputtopic !== undefined ? String(n.outputtopic) : ''
          entry.dropIfSameGateway = n.dropIfSameGateway === true || n.dropIfSameGateway === 'true'
        } else if (type === 'knxUltimateRouterFilter') {
          entry.gaMode = n.gaMode !== undefined ? String(n.gaMode) : ''
          entry.gaPatterns = n.gaPatterns !== undefined ? String(n.gaPatterns) : ''
          entry.srcMode = n.srcMode !== undefined ? String(n.srcMode) : ''
          entry.srcPatterns = n.srcPatterns !== undefined ? String(n.srcPatterns) : ''
          entry.rewriteGA = n.rewriteGA === true || n.rewriteGA === 'true'
          entry.gaRewriteRules = n.gaRewriteRules !== undefined ? String(n.gaRewriteRules) : ''
          entry.rewriteSource = n.rewriteSource === true || n.rewriteSource === 'true'
          entry.srcRewriteRules = n.srcRewriteRules !== undefined ? String(n.srcRewriteRules) : ''
        }

        knxNodes.push(entry)
      })
    } catch (error) {
      return ''
    }

    if (!knxNodes.length && !gatewaysById.size) return ''

    const sorted = knxNodes
      .sort((a, b) => {
        const at = (a.tabLabel || '').localeCompare(b.tabLabel || '')
        if (at !== 0) return at
        const an = (a.name || a.id).localeCompare(b.name || b.id)
        if (an !== 0) return an
        return (a.type || '').localeCompare(b.type || '')
      })
      .slice(0, Math.max(0, Number(maxNodes) || 0))

    const shorten = (id) => (id && id.length > 8) ? id.slice(0, 8) : id
    const safeLine = (s) => String(s || '').replace(/\s+/g, ' ').trim()

    const lines = []
    lines.push('Node-RED flow inventory (KNX Ultimate):')

    if (gatewaysById.size) {
      lines.push(`Gateways (knxUltimate-config): ${gatewaysById.size}`)
      for (const g of Array.from(gatewaysById.values()).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id)).slice(0, 20)) {
        const bits = []
        bits.push(`- ${shorten(g.id)}`)
        if (g.name) bits.push(`name="${safeLine(g.name)}"`)
        if (g.physAddr) bits.push(`physAddr=${safeLine(g.physAddr)}`)
        lines.push(bits.join(' '))
      }
      if (gatewaysById.size > 20) lines.push('- ...')
    }

    lines.push(`KNX Ultimate nodes: ${knxNodes.length}${knxNodes.length > sorted.length ? ` (showing first ${sorted.length})` : ''}`)
    for (const n of sorted) {
      const parts = []
      if (n.tabLabel) parts.push(`[${safeLine(n.tabLabel)}]`)
      parts.push(n.type)
      parts.push(shorten(n.id))
      if (n.name) parts.push(`name="${safeLine(n.name)}"`)
      if (n.gatewayName) parts.push(`gw="${safeLine(n.gatewayName)}"`)
      if (!n.gatewayName && n.gatewayId) parts.push(`gwId=${shorten(n.gatewayId)}`)

      if (n.type === 'knxUltimate') {
        if (n.topic) parts.push(`topic=${safeLine(n.topic)}`)
        if (n.dpt) parts.push(`dpt=${safeLine(n.dpt)}`)
        parts.push(`listenAll=${n.listenAllGA ? 'true' : 'false'}`)
      } else if (n.type === 'knxUltimateMultiRouting') {
        if (n.outputTopic) parts.push(`outputTopic=${safeLine(n.outputTopic)}`)
        parts.push(`dropTagged=${n.dropIfSameGateway ? 'true' : 'false'}`)
      } else if (n.type === 'knxUltimateRouterFilter') {
        if (n.gaMode && n.gaMode !== 'off') parts.push(`gaMode=${safeLine(n.gaMode)}`)
        if (n.gaPatterns) parts.push(`gaPatterns="${safeLine(n.gaPatterns)}"`)
        if (n.srcMode && n.srcMode !== 'off') parts.push(`srcMode=${safeLine(n.srcMode)}`)
        if (n.srcPatterns) parts.push(`srcPatterns="${safeLine(n.srcPatterns)}"`)
        if (n.rewriteGA) parts.push('rewriteGA=true')
        if (n.gaRewriteRules) parts.push(`gaRewriteRules="${safeLine(n.gaRewriteRules)}"`)
        if (n.rewriteSource) parts.push('rewriteSource=true')
        if (n.srcRewriteRules) parts.push(`srcRewriteRules="${safeLine(n.srcRewriteRules)}"`)
      } else {
        if (n.topic) parts.push(`topic=${safeLine(n.topic)}`)
      }
      lines.push(`- ${parts.join(' ')}`)
    }

    return lines.join('\n').trim()
  }

  if (!adminEndpointsRegistered) {
    adminEndpointsRegistered = true

    RED.httpAdmin.get('/knxUltimateAI/sidebar/nodes', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodes = Array.from(aiRuntimeNodes.values()).map((n) => ({
          id: n.id,
          name: n.name || '',
          topic: n.topic || '',
          gatewayId: n.serverKNX ? n.serverKNX.id : '',
          gatewayName: (n.serverKNX && n.serverKNX.name) ? n.serverKNX.name : '',
          llmEnabled: !!n.llmEnabled,
          llmProvider: n.llmProvider || '',
          llmModel: n.llmModel || ''
        })).sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
        res.json({ nodes })
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.get('/knxUltimateAI/sidebar/state', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodeId = req.query?.nodeId ? String(req.query.nodeId) : ''
        const fresh = req.query?.fresh === '1' || req.query?.fresh === 1 || req.query?.fresh === true || req.query?.fresh === 'true'
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.getSidebarState !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        res.json(n.getSidebarState({ fresh }))
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/sidebar/ask', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const nodeId = req.body?.nodeId ? String(req.body.nodeId) : ''
        const question = req.body?.question ? String(req.body.question) : ''
        if (!nodeId) {
          res.status(400).json({ error: 'Missing nodeId' })
          return
        }
        if (!question || question.trim() === '') {
          res.status(400).json({ error: 'Missing question' })
          return
        }
        const n = aiRuntimeNodes.get(nodeId) || RED.nodes.getNode(nodeId)
        if (!n || n.type !== 'knxUltimateAI' || typeof n.sidebarAsk !== 'function') {
          res.status(404).json({ error: 'KNX AI node not found' })
          return
        }
        const ret = await n.sidebarAsk(question)
        res.json(ret)
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.post('/knxUltimateAI/models', RED.auth.needsPermission('knxUltimate-config.write'), async (req, res) => {
      try {
        const body = req.body || {}
        const nodeId = body.nodeId ? String(body.nodeId) : ''

        let provider = body.provider ? String(body.provider) : ''
        let baseUrl = body.baseUrl ? String(body.baseUrl) : ''
        let apiKey = sanitizeApiKey(body.apiKey || '')
        const includeAll = body.includeAll === true || body.includeAll === 'true'

        const deployedNode = nodeId ? RED.nodes.getNode(nodeId) : null
        if (deployedNode && deployedNode.type !== 'knxUltimateAI') {
          res.status(400).json({ error: 'Invalid nodeId' })
          return
        }

        if (!provider && deployedNode) provider = deployedNode.llmProvider || 'openai_compat'
        if (!baseUrl && deployedNode) baseUrl = deployedNode.llmBaseUrl || ''
        if (!apiKey && deployedNode && deployedNode.credentials && deployedNode.credentials.llmApiKey) {
          apiKey = sanitizeApiKey(deployedNode.credentials.llmApiKey)
        }

        provider = provider || 'openai_compat'

        if (provider === 'ollama') {
          const tagsUrl = (() => {
            const raw = String(baseUrl || '').trim()
            if (!raw) return 'http://localhost:11434/api/tags'
            try {
              const u = new URL(raw)
              if (/\/api\/chat\/?$/.test(u.pathname)) u.pathname = u.pathname.replace(/\/api\/chat\/?$/, '/api/tags')
              else if (/\/api\/generate\/?$/.test(u.pathname)) u.pathname = u.pathname.replace(/\/api\/generate\/?$/, '/api/tags')
              else if (!/\/api\/tags\/?$/.test(u.pathname)) u.pathname = '/api/tags'
              return u.toString()
            } catch (error) {
              return 'http://localhost:11434/api/tags'
            }
          })()
          const json = await getJson({ url: tagsUrl })
          const models = (json && Array.isArray(json.models)) ? json.models.map(m => m.name).filter(Boolean) : []
          res.json({ provider, baseUrl: tagsUrl, models })
          return
        }

        // OpenAI-compatible: /v1/models
        const modelsUrl = deriveModelsUrlFromBaseUrl(baseUrl)
        const headers = {}
        if (apiKey) headers.authorization = `Bearer ${apiKey}`
        const json = await getJson({ url: modelsUrl, headers })

        let ids = []
        if (json && Array.isArray(json.data)) {
          ids = json.data.map(m => m && m.id).filter(Boolean)
        } else if (json && Array.isArray(json.models)) {
          ids = json.models.map(m => (typeof m === 'string' ? m : m && m.id)).filter(Boolean)
        }

        if (!includeAll) {
          ids = ids.filter(isProbablyChatModelId)
        }
        ids.sort()

        res.json({ provider, baseUrl: modelsUrl, models: ids, filtered: !includeAll })
      } catch (error) {
        res.status(error.status || 500).json({ error: error.message || String(error) })
      }
    })
  }

  function knxUltimateAI(config) {
    RED.nodes.createNode(this, config)
    const node = this

    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    if (node.serverKNX === undefined) {
      node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }

    node.name = config.name || 'KNX AI'
    node.topic = config.topic || node.name
    node.outputtopic = node.topic
    node.dpt = ''

    node.notifyreadrequest = config.notifyreadrequest !== undefined ? coerceBoolean(config.notifyreadrequest) : true
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = config.notifyresponse !== undefined ? coerceBoolean(config.notifyresponse) : true
    node.notifywrite = config.notifywrite !== undefined ? coerceBoolean(config.notifywrite) : true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''

    node.analysisWindowSec = Number(config.analysisWindowSec || 60)
    node.historyWindowSec = Number(config.historyWindowSec || 300)
    node.emitIntervalSec = Number(config.emitIntervalSec || 0)
    node.topN = Number(config.topN || 10)

    node.rateWindowSec = Number(config.rateWindowSec || 10)
    node.maxTelegramPerSecOverall = Number(config.maxTelegramPerSecOverall || 0)
    node.maxTelegramPerSecPerGA = Number(config.maxTelegramPerSecPerGA || 0)

    node.flapWindowSec = Number(config.flapWindowSec || 30)
    node.flapMaxChanges = Number(config.flapMaxChanges || 0)

    node.enablePattern = config.enablePattern !== undefined ? coerceBoolean(config.enablePattern) : true
    node.patternMaxLagMs = Number(config.patternMaxLagMs || 1500)
    node.patternMinCount = Number(config.patternMinCount || 8)

    node.llmEnabled = config.llmEnabled !== undefined ? coerceBoolean(config.llmEnabled) : false
    node.llmProvider = config.llmProvider || 'openai_compat'
    node.llmBaseUrl = config.llmBaseUrl || 'https://api.openai.com/v1/chat/completions'
    // Prefer Node-RED credentials store, fallback to legacy config field (backward compatible)
    node.llmApiKey = sanitizeApiKey((node.credentials && node.credentials.llmApiKey) ? node.credentials.llmApiKey : (config.llmApiKey || ''))
    node.llmModel = config.llmModel || 'gpt-4o-mini'
    node.llmSystemPrompt = config.llmSystemPrompt || 'You are a KNX building automation assistant. Analyze KNX bus traffic and provide actionable insights.'
    node.llmTemperature = (config.llmTemperature === undefined || config.llmTemperature === '') ? 0.2 : Number(config.llmTemperature)
    node.llmMaxTokens = (config.llmMaxTokens === undefined || config.llmMaxTokens === '') ? 600 : Number(config.llmMaxTokens)
    node.llmTimeoutMs = (config.llmTimeoutMs === undefined || config.llmTimeoutMs === '') ? 30000 : Number(config.llmTimeoutMs)
    node.llmMaxEventsInPrompt = (config.llmMaxEventsInPrompt === undefined || config.llmMaxEventsInPrompt === '') ? 600 : Number(config.llmMaxEventsInPrompt)
    node.llmIncludeRaw = config.llmIncludeRaw !== undefined ? coerceBoolean(config.llmIncludeRaw) : false
    node.llmIncludeFlowContext = config.llmIncludeFlowContext !== undefined ? coerceBoolean(config.llmIncludeFlowContext) : true
    node.llmMaxFlowNodesInPrompt = (config.llmMaxFlowNodesInPrompt === undefined || config.llmMaxFlowNodesInPrompt === '')
      ? 80
      : Number(config.llmMaxFlowNodesInPrompt)

    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.serverKNX === null) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate)
          : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        GA = (typeof GA === 'undefined' || GA === '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt === '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? safeStringify(payload) : payload
        updateStatus({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + ts + ') ' + (text || '') })
      } catch (error) { /* empty */ }
    }

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error'
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' })
    } catch (error) { /* empty */ }

    node._history = []
    node._gaState = new Map()
    node._timerEmit = null
    node._lastOverallAnomalyAt = 0
    node._lastSummary = null
    node._lastSummaryAt = 0
    node._anomalies = []
    node._assistantLog = []
    node._flowContextCache = { at: 0, text: '' }

    // Register runtime instance for sidebar visibility
    aiRuntimeNodes.set(node.id, node)

    const extractTelegram = (msg) => {
      if (!msg || !msg.knx) return null
      const raw = msg.knx.rawValue
      const rawHex = Buffer.isBuffer(raw) ? raw.toString('hex') : undefined
      return {
        ts: nowMs(),
        echoed: msg.echoed === true,
        event: msg.knx.event || '',
        source: msg.knx.source || '',
        destination: msg.knx.destination || '',
        dpt: msg.knx.dpt || '',
        dptdesc: msg.knx.dptdesc || '',
        devicename: msg.devicename || '',
        payload: msg.payload,
        payloadmeasureunit: msg.payloadmeasureunit || '',
        rawHex
      }
    }

    const trimHistory = (now) => {
      const maxAgeMs = Math.max(5, node.historyWindowSec) * 1000
      const cutoff = now - maxAgeMs
      while (node._history.length > 0 && node._history[0].ts < cutoff) node._history.shift()
      const maxEvents = Math.max(100, Number(config.maxEvents || 5000))
      while (node._history.length > maxEvents) node._history.shift()
    }

    const buildSummary = (now) => {
      const windowMs = Math.max(5, node.analysisWindowSec) * 1000
      const cutoff = now - windowMs
      const items = node._history.filter(t => t.ts >= cutoff)
      const byEvent = {}
      const byGA = {}
      const bySource = {}
      let unknownDpt = 0
      let echoedCount = 0
      for (let i = 0; i < items.length; i++) {
        const t = items[i]
        byEvent[t.event] = (byEvent[t.event] || 0) + 1
        byGA[t.destination] = (byGA[t.destination] || 0) + 1
        bySource[t.source] = (bySource[t.source] || 0) + 1
        if (!t.dpt || t.dpt === 'unknown') unknownDpt += 1
        if (t.echoed) echoedCount += 1
      }
      const topGAs = Object.keys(byGA)
        .map(ga => ({ ga, count: byGA[ga] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Math.max(1, node.topN))
      const topSources = Object.keys(bySource)
        .map(src => ({ source: src, count: bySource[src] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, Math.max(1, Math.min(10, node.topN)))

      const overallRate = items.length / Math.max(1, node.analysisWindowSec)

      let patterns = []
      if (node.enablePattern) {
        const maxItems = Math.min(items.length, 400)
        const slice = items.slice(items.length - maxItems)
        const lagMs = Math.max(100, node.patternMaxLagMs)
        const pairs = new Map()
        for (let i = 0; i < slice.length; i++) {
          const a = slice[i]
          for (let j = i + 1; j < slice.length; j++) {
            const b = slice[j]
            const delta = b.ts - a.ts
            if (delta > lagMs) break
            if (!a.destination || !b.destination) continue
            if (a.destination === b.destination) continue
            const key = `${a.destination} -> ${b.destination}`
            pairs.set(key, (pairs.get(key) || 0) + 1)
          }
        }
        patterns = Array.from(pairs.entries())
          .map(([k, count]) => {
            const parts = k.split(' -> ')
            return { from: parts[0], to: parts[1], count, withinMs: lagMs }
          })
          .filter(p => p.count >= Math.max(2, node.patternMinCount))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }

      return {
        meta: {
          nodeId: node.id,
          nodeName: node.name,
          generatedAt: new Date(now).toISOString(),
          analysisWindowSec: node.analysisWindowSec,
          historyWindowSec: node.historyWindowSec
        },
        counters: {
          telegrams: items.length,
          echoed: echoedCount,
          unknownDpt,
          overallRatePerSec: Number(overallRate.toFixed(2))
        },
        byEvent,
        topGAs,
        topSources,
        patterns
      }
    }

    const buildLLMPrompt = ({ question, summary }) => {
      const maxEvents = Math.max(10, node.llmMaxEventsInPrompt)
      const recent = node._history.slice(-maxEvents)
      const lines = recent.map(t => {
        const payloadStr = normalizeValueForCompare(t.payload)
        const rawStr = (node.llmIncludeRaw && t.rawHex) ? ` raw=${t.rawHex}` : ''
        const devName = t.devicename ? ` (${t.devicename})` : ''
        return `${new Date(t.ts).toISOString()} ${t.event} ${t.source} -> ${t.destination}${devName} dpt=${t.dpt} payload=${payloadStr}${rawStr}`
      })

      let flowContext = ''
      if (node.llmIncludeFlowContext) {
        const ttlMs = 10 * 1000
        const now = nowMs()
        if (node._flowContextCache && node._flowContextCache.text && (now - (node._flowContextCache.at || 0)) < ttlMs) {
          flowContext = node._flowContextCache.text
        } else {
          flowContext = buildKnxUltimateFlowInventory({ maxNodes: Math.max(0, Number(node.llmMaxFlowNodesInPrompt) || 0) })
          if (flowContext && flowContext.length > 8000) flowContext = flowContext.slice(0, 8000) + '\n...'
          node._flowContextCache = { at: now, text: flowContext }
        }
      }
      return [
        'KNX bus summary (JSON):',
        safeStringify(summary),
        '',
        flowContext ? 'Node-RED context:' : '',
        flowContext ? flowContext : '',
        flowContext ? '' : '',
        'Recent KNX telegrams:',
        lines.join('\n'),
        '',
        'User request:',
        question || ''
      ].join('\n')
    }

    const callLLM = async ({ question }) => {
      if (!node.llmEnabled) throw new Error('LLM is disabled in node config')
      if (!node.llmApiKey && node.llmProvider !== 'ollama') {
        throw new Error('Missing API key: paste only the OpenAI key (starts with sk-), without "Bearer"')
      }
      const summary = buildSummary(nowMs())
      const userContent = buildLLMPrompt({ question, summary })

      if (node.llmProvider === 'ollama') {
        const url = node.llmBaseUrl || 'http://localhost:11434/api/chat'
        const body = {
          model: node.llmModel || 'llama3.1',
          stream: false,
          messages: [
            { role: 'system', content: node.llmSystemPrompt || '' },
            { role: 'user', content: userContent }
          ],
          options: {
            temperature: node.llmTemperature
          }
        }
        const json = await postJson({ url, body, timeoutMs: node.llmTimeoutMs })
        const content = json && json.message && typeof json.message.content === 'string' ? json.message.content : safeStringify(json)
        return { provider: 'ollama', model: body.model, content, summary }
      }

      // Default: OpenAI-compatible chat/completions
      const url = node.llmBaseUrl || 'https://api.openai.com/v1/chat/completions'
      const headers = {}
      if (node.llmApiKey) headers.authorization = `Bearer ${node.llmApiKey}`
      const baseBody = {
        model: node.llmModel,
        temperature: node.llmTemperature,
        messages: [
          { role: 'system', content: node.llmSystemPrompt || '' },
          { role: 'user', content: userContent }
        ]
      }

      // Some OpenAI models (and some compatible gateways) require `max_completion_tokens` instead of `max_tokens`.
      // Try with `max_tokens` first for broad compatibility, then fallback once if the server rejects it.
      const bodyWithMaxTokens = Object.assign({ max_tokens: node.llmMaxTokens }, baseBody)
      const bodyWithMaxCompletionTokens = Object.assign({ max_completion_tokens: node.llmMaxTokens }, baseBody)

      let json
      try {
        json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: node.llmTimeoutMs })
      } catch (error) {
        const msg = (error && error.message) ? String(error.message) : ''
        if (msg.includes("Unsupported parameter: 'max_tokens'") || msg.includes('max_completion_tokens')) {
          json = await postJson({ url, headers, body: bodyWithMaxCompletionTokens, timeoutMs: node.llmTimeoutMs })
        } else if (msg.includes("Unsupported parameter: 'max_completion_tokens'")) {
          json = await postJson({ url, headers, body: bodyWithMaxTokens, timeoutMs: node.llmTimeoutMs })
        } else {
          throw error
        }
      }
      const content = json && json.choices && json.choices[0] && json.choices[0].message && typeof json.choices[0].message.content === 'string'
        ? json.choices[0].message.content
        : safeStringify(json)
      return { provider: 'openai_compat', model: baseBody.model, content, summary }
    }

    const emitSummary = () => {
      const now = nowMs()
      trimHistory(now)
      const summary = buildSummary(now)
      node._lastSummary = summary
      node._lastSummaryAt = now
      node.send([{ topic: node.outputtopic, payload: summary, knxAi: { type: 'summary' } }, null, null])
      const best = summary.topGAs && summary.topGAs[0] ? `${summary.topGAs[0].ga} (${summary.topGAs[0].count})` : 'no traffic'
      updateStatus({ fill: 'green', shape: 'dot', text: `AI ${summary.counters.overallRatePerSec}/s top ${best}` })
    }

    const recordAnomaly = (payload) => {
      try {
        const entry = { at: new Date().toISOString(), payload }
        node._anomalies.push(entry)
        while (node._anomalies.length > 200) node._anomalies.shift()
      } catch (error) { /* empty */ }
    }

    const maybeEmitOverallAnomaly = (now) => {
      if (!node.maxTelegramPerSecOverall || node.maxTelegramPerSecOverall <= 0) return
      const windowMs = Math.max(2, node.rateWindowSec) * 1000
      const cutoff = now - windowMs
      const items = node._history.filter(t => t.ts >= cutoff)
      const rate = items.length / Math.max(1, node.rateWindowSec)
      if (rate <= node.maxTelegramPerSecOverall) return
      if (now - node._lastOverallAnomalyAt < 2000) return
      node._lastOverallAnomalyAt = now
      const payload = {
        type: 'overall_rate',
        ratePerSec: Number(rate.toFixed(2)),
        thresholdPerSec: node.maxTelegramPerSecOverall,
        windowSec: node.rateWindowSec,
        observedTelegrams: items.length
      }
      recordAnomaly(payload)
      node.send([null, {
        topic: node.outputtopic,
        payload,
        knxAi: { type: 'anomaly' }
      }, null])
      updateStatus({ fill: 'red', shape: 'ring', text: `AI bus rate high: ${rate.toFixed(1)}/s` })
    }

    const maybeEmitGAAnomalies = (telegram) => {
      const now = telegram.ts
      const ga = telegram.destination || ''
      if (!ga) return
      const state = node._gaState.get(ga) || { tsList: [], changeTsList: [], lastValue: undefined, lastValueTs: 0, lastAnomalyAt: 0 }

      // Rate per GA
      if (node.maxTelegramPerSecPerGA && node.maxTelegramPerSecPerGA > 0) {
        const windowMs = Math.max(2, node.rateWindowSec) * 1000
        const cutoff = now - windowMs
        state.tsList.push(now)
        while (state.tsList.length > 0 && state.tsList[0] < cutoff) state.tsList.shift()
        const rate = state.tsList.length / Math.max(1, node.rateWindowSec)
        if (rate > node.maxTelegramPerSecPerGA && (now - state.lastAnomalyAt) > 2000) {
          state.lastAnomalyAt = now
          const payload = {
            type: 'ga_rate',
            ga,
            ratePerSec: Number(rate.toFixed(2)),
            thresholdPerSec: node.maxTelegramPerSecPerGA,
            windowSec: node.rateWindowSec,
            observedTelegrams: state.tsList.length
          }
          recordAnomaly(payload)
          node.send([null, {
            topic: node.outputtopic,
            payload,
            knxAi: { type: 'anomaly', ga }
          }, null])
        }
      }

      // Flapping / rapid changes
      if (node.flapMaxChanges && node.flapMaxChanges > 0) {
        const windowMs = Math.max(5, node.flapWindowSec) * 1000
        const currentValue = normalizeValueForCompare(telegram.payload)
        if (state.lastValue !== undefined && currentValue !== state.lastValue) {
          const cutoff = now - windowMs
          state.changeTsList.push(now)
          while (state.changeTsList.length > 0 && state.changeTsList[0] < cutoff) state.changeTsList.shift()
          if (state.changeTsList.length >= node.flapMaxChanges && (now - state.lastAnomalyAt) > 2000) {
            state.lastAnomalyAt = now
            const payload = {
              type: 'ga_flap',
              ga,
              changesInWindow: state.changeTsList.length,
              thresholdChanges: node.flapMaxChanges,
              windowSec: node.flapWindowSec,
              lastValue: state.lastValue,
              currentValue
            }
            recordAnomaly(payload)
            node.send([null, {
              topic: node.outputtopic,
              payload,
              knxAi: { type: 'anomaly', ga }
            }, null])
          }
        }
        state.lastValue = currentValue
        state.lastValueTs = now
      }

      node._gaState.set(ga, state)
    }

    // Called by knxUltimate-config.js
    node.handleSend = (msg) => {
      const telegram = extractTelegram(msg)
      if (!telegram) return
      node._history.push(telegram)
      const now = telegram.ts
      trimHistory(now)
      maybeEmitGAAnomalies(telegram)
      maybeEmitOverallAnomaly(now)
    }

    const handleCommand = async (msg) => {
      const cmd = (msg && msg.topic !== undefined) ? String(msg.topic).toLowerCase() : ''
      if (cmd === 'reset') {
        node._history = []
        node._gaState = new Map()
        updateStatus({ fill: 'grey', shape: 'dot', text: 'AI reset' })
        node.send([{ topic: node.outputtopic, payload: { ok: true }, knxAi: { type: 'reset' } }, null, null])
        return
      }

      if (cmd === 'summary' || cmd === 'stats' || cmd === 'top' || cmd === '') {
        emitSummary()
        return
      }

      if (cmd === 'ask') {
        const question = (msg.prompt !== undefined)
          ? String(msg.prompt)
          : (typeof msg.payload === 'string' ? msg.payload : safeStringify(msg.payload))
        updateStatus({ fill: 'blue', shape: 'ring', text: 'AI thinking...' })
        try {
          const ret = await callLLM({ question })
          node._assistantLog.push({ at: new Date().toISOString(), question, content: ret.content, provider: ret.provider, model: ret.model })
          while (node._assistantLog.length > 50) node._assistantLog.shift()
          node.send([null, null, {
            topic: node.outputtopic,
            payload: ret.content,
            knxAi: { type: 'llm', provider: ret.provider, model: ret.model, question },
            summary: ret.summary
          }])
          updateStatus({ fill: 'green', shape: 'dot', text: 'AI answer ready' })
        } catch (error) {
          node._assistantLog.push({ at: new Date().toISOString(), question, error: error.message || String(error) })
          while (node._assistantLog.length > 50) node._assistantLog.shift()
          node.send([null, null, {
            topic: node.outputtopic,
            payload: { error: error.message || String(error) },
            knxAi: { type: 'llm_error', question }
          }])
          updateStatus({ fill: 'red', shape: 'dot', text: `AI error: ${error.message || error}` })
        }
        return
      }

      node.warn(`knxUltimateAI: unknown command '${cmd}'. Supported: reset, summary, ask`)
    }

    node.getSidebarState = ({ fresh = false } = {}) => {
      const now = nowMs()
      trimHistory(now)
      const summary = fresh ? buildSummary(now) : (node._lastSummary || buildSummary(now))
      if (fresh) {
        node._lastSummary = summary
        node._lastSummaryAt = now
      }
      return {
        node: {
          id: node.id,
          type: node.type,
          name: node.name || '',
          topic: node.topic || '',
          gatewayId: node.serverKNX ? node.serverKNX.id : '',
          gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : '',
          llmEnabled: !!node.llmEnabled,
          llmProvider: node.llmProvider || '',
          llmModel: node.llmModel || ''
        },
        summary,
        anomalies: node._anomalies.slice(-50),
        assistant: node._assistantLog.slice(-30)
      }
    }

    node.sidebarAsk = async (question) => {
      const q = String(question || '').trim()
      if (q === '') throw new Error('Missing question')
      updateStatus({ fill: 'blue', shape: 'ring', text: 'AI thinking...' })
      const ret = await callLLM({ question: q })
      node._assistantLog.push({ at: new Date().toISOString(), question: q, content: ret.content, provider: ret.provider, model: ret.model })
      while (node._assistantLog.length > 50) node._assistantLog.shift()
      updateStatus({ fill: 'green', shape: 'dot', text: 'AI answer ready' })
      return { answer: ret.content, provider: ret.provider, model: ret.model, summary: ret.summary }
    }

    node.on('input', function (msg) {
      handleCommand(msg)
    })

    node.on('close', function (done) {
      try {
        if (node._timerEmit) clearInterval(node._timerEmit)
      } catch (error) { /* empty */ }
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      try { aiRuntimeNodes.delete(node.id) } catch (e) { }
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }

    if (node.emitIntervalSec && node.emitIntervalSec > 0) {
      if (node._timerEmit) clearInterval(node._timerEmit)
      node._timerEmit = setInterval(emitSummary, Math.max(5, node.emitIntervalSec) * 1000)
    }

    updateStatus({ fill: 'grey', shape: 'dot', text: 'AI ready' })
  }

  RED.nodes.registerType('knxUltimateAI', knxUltimateAI, {
    credentials: {
      llmApiKey: { type: 'password' }
    }
  })
}
