const CHAT_CONTEXT_VERSION = 1
const CHAT_CONTEXT_MAX_BYTES = 512 * 1024
const CHAT_CONTEXT_MAX_SESSIONS = 50
const CHAT_CONTEXT_MAX_TURNS_PER_SESSION = 8
const CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION = 20
const CHAT_CONTEXT_MAX_CAMERA_WATCHES_PER_SESSION = 20
const CHAT_CONTEXT_MAX_QUESTION_CHARS = 4000
const CHAT_CONTEXT_MAX_REPLY_CHARS = 8000
const CHAT_CONTEXT_MAX_INSTRUCTION_CHARS = 2000

const clampText = (value, maxChars) => String(value === undefined || value === null ? '' : value)
  .trim()
  .slice(0, Math.max(0, Number(maxChars) || 0))

const normalizeSessionId = value => clampText(value || 'default', 160) || 'default'

const createEmptyKnxAiChatContext = () => ({
  version: CHAT_CONTEXT_VERSION,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sessions: []
})

const normalizeTurn = (turn) => {
  if (!turn || typeof turn !== 'object' || Array.isArray(turn)) return null
  const question = clampText(turn.question, CHAT_CONTEXT_MAX_QUESTION_CHARS)
  const reply = clampText(turn.reply, CHAT_CONTEXT_MAX_REPLY_CHARS)
  if (!question && !reply) return null
  return {
    at: clampText(turn.at || new Date().toISOString(), 64),
    question,
    reply
  }
}

const normalizeInstruction = (instruction) => {
  if (!instruction || typeof instruction !== 'object' || Array.isArray(instruction)) return null
  const text = clampText(instruction.text, CHAT_CONTEXT_MAX_INSTRUCTION_CHARS)
  if (!text) return null
  return {
    at: clampText(instruction.at || new Date().toISOString(), 64),
    text
  }
}

const normalizeCameraWatch = (watch) => {
  if (!watch || typeof watch !== 'object' || Array.isArray(watch)) return null
  const id = clampText(watch.id, 160)
  const cameraId = clampText(watch.cameraId, 160)
  const cameraName = clampText(watch.cameraName, 240)
  const eventType = clampText(watch.eventType, 80)
  if (!id || (!cameraId && !cameraName) || !eventType) return null
  return {
    id,
    createdAt: clampText(watch.createdAt || new Date().toISOString(), 64),
    cameraId,
    cameraName,
    eventType,
    scopeId: clampText(watch.scopeId, 160),
    scopeName: clampText(watch.scopeName, 240),
    objectTypes: Array.from(new Set((Array.isArray(watch.objectTypes) ? watch.objectTypes : [])
      .map(value => clampText(value, 80).toLocaleLowerCase())
      .filter(Boolean))).slice(0, 12),
    cooldownSeconds: Math.max(10, Math.min(86400, Number(watch.cooldownSeconds) || 60)),
    sendSnapshot: watch.sendSnapshot !== false,
    language: clampText(watch.language || 'en', 8).toLocaleLowerCase()
  }
}

const normalizeSession = (session) => {
  if (!session || typeof session !== 'object' || Array.isArray(session)) return null
  const id = normalizeSessionId(session.id)
  const turns = (Array.isArray(session.turns) ? session.turns : [])
    .map(normalizeTurn)
    .filter(Boolean)
    .slice(-CHAT_CONTEXT_MAX_TURNS_PER_SESSION)
  const instructions = (Array.isArray(session.instructions) ? session.instructions : [])
    .map(normalizeInstruction)
    .filter(Boolean)
    .slice(-CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION)
  const cameraWatches = (Array.isArray(session.cameraWatches) ? session.cameraWatches : [])
    .map(normalizeCameraWatch)
    .filter(Boolean)
    .slice(-CHAT_CONTEXT_MAX_CAMERA_WATCHES_PER_SESSION)
  return {
    id,
    updatedAt: clampText(session.updatedAt || new Date().toISOString(), 64),
    turns,
    instructions,
    cameraWatches
  }
}

const normalizeKnxAiChatContext = (value = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const byId = new Map()
  ;(Array.isArray(source.sessions) ? source.sessions : []).forEach((item) => {
    const session = normalizeSession(item)
    if (!session) return
    byId.delete(session.id)
    byId.set(session.id, session)
  })
  return {
    version: CHAT_CONTEXT_VERSION,
    createdAt: clampText(source.createdAt || new Date().toISOString(), 64),
    updatedAt: clampText(source.updatedAt || new Date().toISOString(), 64),
    sessions: Array.from(byId.values()).slice(-CHAT_CONTEXT_MAX_SESSIONS)
  }
}

const findSession = (context, sessionId) => {
  const id = normalizeSessionId(sessionId)
  return normalizeKnxAiChatContext(context).sessions.find(session => session.id === id) || null
}

const touchSession = (context, sessionId) => {
  const target = normalizeKnxAiChatContext(context)
  const id = normalizeSessionId(sessionId)
  const existing = target.sessions.find(session => session.id === id)
  const session = existing || { id, updatedAt: new Date().toISOString(), turns: [], instructions: [], cameraWatches: [] }
  target.sessions = target.sessions.filter(item => item.id !== id)
  target.sessions.push(session)
  target.sessions = target.sessions.slice(-CHAT_CONTEXT_MAX_SESSIONS)
  target.updatedAt = new Date().toISOString()
  session.updatedAt = target.updatedAt
  return { target, session }
}

const explicitInstructionPatterns = [
  /^\s*(?:please[\s,]+)?remember\b/i,
  /^\s*from now on\b/i,
  /^\s*(?:please[\s,]+)?(?:always|never)\b/i,
  /^\s*(?:per favore[\s,]+)?(?:ricordati|ricorda|ricordarsi|memorizza)\b/i,
  /^\s*(?:d['’]ora in poi|da ora in poi)\b/i,
  /^\s*(?:usa sempre|non usare mai|evita sempre)\b/i,
  /^\s*(?:bitte[\s,]+)?(?:merk dir|erinnere dich)\b/i,
  /^\s*(?:ab jetzt|von jetzt an)\b/i,
  /^\s*(?:s['’]il te pla[iî]t[\s,]+)?(?:souviens-toi|rappelle-toi|m[eé]morise)\b/i,
  /^\s*(?:dor[eé]navant|[àa] partir de maintenant)\b/i,
  /^\s*(?:por favor[\s,]+)?(?:recuerda|memoriza)\b/i,
  /^\s*(?:a partir de ahora|de ahora en adelante)\b/i,
  /^\s*(?:请)?记住/,
  /^\s*从现在开始/
]

const extractExplicitKnxAiChatInstruction = (question) => {
  const text = clampText(question, CHAT_CONTEXT_MAX_INSTRUCTION_CHARS)
  if (!text) return ''
  return explicitInstructionPatterns.some(pattern => pattern.test(text)) ? text : ''
}

const addKnxAiChatTurn = (context, { sessionId, question, reply, at } = {}) => {
  const { target, session } = touchSession(context, sessionId)
  const turn = normalizeTurn({ at, question, reply })
  if (turn) session.turns.push(turn)
  session.turns = session.turns.slice(-CHAT_CONTEXT_MAX_TURNS_PER_SESSION)

  const explicitInstruction = extractExplicitKnxAiChatInstruction(question)
  if (explicitInstruction) {
    const normalized = explicitInstruction.toLocaleLowerCase()
    session.instructions = session.instructions.filter(item => item.text.toLocaleLowerCase() !== normalized)
    session.instructions.push({
      at: clampText(at || new Date().toISOString(), 64),
      text: explicitInstruction
    })
    session.instructions = session.instructions.slice(-CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION)
  }
  return target
}

const clearKnxAiChatSession = (context, sessionId) => {
  const target = normalizeKnxAiChatContext(context)
  const id = normalizeSessionId(sessionId)
  target.sessions = target.sessions.filter(session => session.id !== id)
  target.updatedAt = new Date().toISOString()
  return target
}

const addKnxAiCameraWatch = (context, { sessionId, watch } = {}) => {
  const normalized = normalizeCameraWatch(watch)
  if (!normalized) return normalizeKnxAiChatContext(context)
  const { target, session } = touchSession(context, sessionId)
  session.cameraWatches = (Array.isArray(session.cameraWatches) ? session.cameraWatches : [])
    .filter(item => item.id !== normalized.id)
  session.cameraWatches.push(normalized)
  session.cameraWatches = session.cameraWatches.slice(-CHAT_CONTEXT_MAX_CAMERA_WATCHES_PER_SESSION)
  return target
}

const removeKnxAiCameraWatches = (context, { sessionId, predicate } = {}) => {
  const { target, session } = touchSession(context, sessionId)
  const before = Array.isArray(session.cameraWatches) ? session.cameraWatches.length : 0
  session.cameraWatches = (Array.isArray(session.cameraWatches) ? session.cameraWatches : [])
    .filter(watch => !(typeof predicate === 'function' && predicate(watch)))
  return { context: target, removed: Math.max(0, before - session.cameraWatches.length) }
}

const listKnxAiCameraWatches = (context, sessionId) => getKnxAiChatSession(context, sessionId).cameraWatches.slice()

const listAllKnxAiCameraWatches = (context) => normalizeKnxAiChatContext(context).sessions.flatMap(session => {
  return session.cameraWatches.map(watch => Object.assign({ sessionId: session.id }, watch))
})

const getKnxAiChatSession = (context, sessionId) => {
  const session = findSession(context, sessionId)
  return session || {
    id: normalizeSessionId(sessionId),
    updatedAt: '',
    turns: [],
    instructions: [],
    cameraWatches: []
  }
}

const buildKnxAiChatPromptContext = ({ context, sessionId, maxChars = 16000 } = {}) => {
  const session = getKnxAiChatSession(context, sessionId)
  if (!session.instructions.length && !session.turns.length && !session.cameraWatches.length) return ''
  const lines = []
  if (session.instructions.length) {
    lines.push('PERSISTENT CHAT INSTRUCTIONS AND PREFERENCES (explicitly supplied by this user; follow them unless they conflict with safety or the KNX contract; newer entries override older conflicting entries):')
    session.instructions.forEach(item => lines.push(`- ${item.text.replace(/\r?\n/g, ' ')}`))
  }
  if (session.turns.length) {
    if (lines.length) lines.push('')
    lines.push('RECENT CONVERSATION:')
    session.turns.forEach((turn) => {
      lines.push(`User: ${turn.question}`)
      lines.push(`Assistant: ${turn.reply}`)
    })
  }
  if (session.cameraWatches.length) {
    if (lines.length) lines.push('')
    lines.push('ACTIVE CAMERA WATCHES (persistent notification rules created by this chat):')
    session.cameraWatches.forEach((watch) => {
      const camera = watch.cameraName || watch.cameraId
      const scope = watch.scopeName || watch.scopeId
      const objects = watch.objectTypes.length ? `; objects ${watch.objectTypes.join(', ')}` : ''
      lines.push(`- ${watch.id}: ${camera}; event ${watch.eventType}${scope ? `; scope ${scope}` : ''}${objects}; cooldown ${watch.cooldownSeconds}s`)
    })
  }
  return lines.join('\n').slice(0, Math.max(1000, Number(maxChars) || 16000))
}

const escapeMarkdownText = value => clampText(value, CHAT_CONTEXT_MAX_REPLY_CHARS)
  .replace(/\r?\n/g, ' ')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const renderKnxAiChatContext = (context) => {
  const target = normalizeKnxAiChatContext(context)
  target.updatedAt = new Date().toISOString()
  const metadata = Buffer.from(JSON.stringify(target), 'utf8').toString('base64')
  const lines = [
    '<!-- KNX_AI_CHAT_CONTEXT_V1_BASE64',
    metadata,
    'KNX_AI_CHAT_CONTEXT_END -->',
    '',
    '# KNX AI Chat Context',
    '',
    `Updated: ${target.updatedAt}`,
    '',
    'This bounded file stores recent chat turns and explicit long-term instructions separately for each chat session.',
    ''
  ]
  target.sessions.forEach((session) => {
    lines.push(`## Session ${escapeMarkdownText(session.id)}`, '')
    lines.push('### Persistent instructions', '')
    if (!session.instructions.length) lines.push('_None._')
    session.instructions.forEach(item => lines.push(`- ${escapeMarkdownText(item.at)} — ${escapeMarkdownText(item.text)}`))
    lines.push('', '### Camera watches', '')
    if (!session.cameraWatches.length) lines.push('_None._')
    session.cameraWatches.forEach((watch) => {
      const camera = watch.cameraName || watch.cameraId
      const scope = watch.scopeName || watch.scopeId
      const objects = watch.objectTypes.length ? `; objects ${watch.objectTypes.join(', ')}` : ''
      lines.push(`- ${escapeMarkdownText(watch.id)} — ${escapeMarkdownText(camera)}; event ${escapeMarkdownText(watch.eventType)}${scope ? `; scope ${escapeMarkdownText(scope)}` : ''}${objects}; cooldown ${watch.cooldownSeconds}s`)
    })
    lines.push('', '### Recent turns', '')
    if (!session.turns.length) lines.push('_None._')
    session.turns.forEach((turn) => {
      lines.push(`- ${escapeMarkdownText(turn.at)} — **User:** ${escapeMarkdownText(turn.question)}`)
      lines.push(`  **Assistant:** ${escapeMarkdownText(turn.reply)}`)
    })
    lines.push('')
  })
  return { markdown: lines.join('\n'), context: target }
}

const buildKnxAiChatContextMarkdown = ({ context, maxBytes = CHAT_CONTEXT_MAX_BYTES } = {}) => {
  const targetBytes = Math.max(64 * 1024, Math.min(CHAT_CONTEXT_MAX_BYTES, Number(maxBytes) || CHAT_CONTEXT_MAX_BYTES))
  let bounded = normalizeKnxAiChatContext(context)
  let rendered = renderKnxAiChatContext(bounded)
  while (Buffer.byteLength(rendered.markdown, 'utf8') > targetBytes) {
    const sessionWithTurns = bounded.sessions.find(session => session.turns.length > 0)
    if (sessionWithTurns) sessionWithTurns.turns.shift()
    else if (bounded.sessions.length > 1) bounded.sessions.shift()
    else {
      const sessionWithInstructions = bounded.sessions.find(session => session.instructions.length > 0)
      if (!sessionWithInstructions) break
      sessionWithInstructions.instructions.shift()
    }
    rendered = renderKnxAiChatContext(bounded)
    bounded = rendered.context
  }
  return {
    markdown: rendered.markdown,
    context: rendered.context,
    bytes: Buffer.byteLength(rendered.markdown, 'utf8'),
    maxBytes: targetBytes
  }
}

const parseKnxAiChatContextMarkdown = (markdown) => {
  const text = String(markdown || '')
  const match = text.match(/<!-- KNX_AI_CHAT_CONTEXT_V1_BASE64\s*\n([A-Za-z0-9+/=\r\n]+?)\nKNX_AI_CHAT_CONTEXT_END -->/)
  if (!match) return createEmptyKnxAiChatContext()
  try {
    const metadata = Buffer.from(match[1].replace(/\s+/g, ''), 'base64').toString('utf8')
    return normalizeKnxAiChatContext(JSON.parse(metadata))
  } catch (error) {
    return createEmptyKnxAiChatContext()
  }
}

const conversationMapFromKnxAiChatContext = (context) => {
  const result = new Map()
  normalizeKnxAiChatContext(context).sessions.forEach((session) => {
    result.set(session.id, session.turns.map(turn => ({
      question: turn.question,
      reply: turn.reply
    })))
  })
  return result
}

module.exports = {
  CHAT_CONTEXT_MAX_CAMERA_WATCHES_PER_SESSION,
  CHAT_CONTEXT_MAX_BYTES,
  CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION,
  CHAT_CONTEXT_MAX_SESSIONS,
  CHAT_CONTEXT_MAX_TURNS_PER_SESSION,
  addKnxAiCameraWatch,
  addKnxAiChatTurn,
  buildKnxAiChatContextMarkdown,
  buildKnxAiChatPromptContext,
  clearKnxAiChatSession,
  conversationMapFromKnxAiChatContext,
  createEmptyKnxAiChatContext,
  extractExplicitKnxAiChatInstruction,
  getKnxAiChatSession,
  listAllKnxAiCameraWatches,
  listKnxAiCameraWatches,
  normalizeKnxAiChatContext,
  normalizeCameraWatch,
  parseKnxAiChatContextMarkdown,
  removeKnxAiCameraWatches
}
