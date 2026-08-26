const CHAT_CONTEXT_VERSION = 3
const CHAT_CONTEXT_MAX_BYTES = 512 * 1024
const CHAT_CONTEXT_MAX_SESSIONS = 50
const CHAT_CONTEXT_MAX_TURNS_PER_SESSION = 8
const CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION = 20
const CHAT_CONTEXT_MAX_CAMERA_WATCHES_PER_SESSION = 20
const CHAT_CONTEXT_MAX_QUESTION_CHARS = 4000
const CHAT_CONTEXT_MAX_REPLY_CHARS = 8000
const CHAT_CONTEXT_MAX_INSTRUCTION_CHARS = 2000
const CHAT_CONTEXT_NATIVE_HEADER = 'KNXAI_CHAT_CONTEXT'

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

const addKnxAiChatTurn = (context, { sessionId, question, reply, at } = {}) => {
  const { target, session } = touchSession(context, sessionId)
  const turn = normalizeTurn({ at, question, reply })
  if (turn) session.turns.push(turn)
  session.turns = session.turns.slice(-CHAT_CONTEXT_MAX_TURNS_PER_SESSION)
  return target
}

const addKnxAiChatInstruction = (context, { sessionId, text, at } = {}) => {
  const instruction = normalizeInstruction({ text, at })
  if (!instruction) return normalizeKnxAiChatContext(context)
  const { target, session } = touchSession(context, sessionId)
  const normalizedText = instruction.text.toLocaleLowerCase()
  session.instructions = session.instructions
    .filter(item => item.text.toLocaleLowerCase() !== normalizedText)
  session.instructions.push(instruction)
  session.instructions = session.instructions.slice(-CHAT_CONTEXT_MAX_INSTRUCTIONS_PER_SESSION)
  return target
}

const removeKnxAiChatInstructions = (context, { sessionId, text, all = false } = {}) => {
  const { target, session } = touchSession(context, sessionId)
  if (all === true) {
    session.instructions = []
    return target
  }
  const normalizedText = clampText(text, CHAT_CONTEXT_MAX_INSTRUCTION_CHARS).toLocaleLowerCase()
  if (!normalizedText) return target
  session.instructions = session.instructions
    .filter(item => item.text.toLocaleLowerCase() !== normalizedText)
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
    lines.push('PERSISTENT USER-PROVIDED FACTS, PREFERENCES, AND INSTRUCTIONS (follow relevant entries unless they conflict with safety or the KNX contract; newer entries override older conflicting entries):')
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

const escapeKnxAiChatContextField = value => String(value === undefined || value === null ? '' : value)
  .replace(/\\/g, '\\\\')
  .replace(/\t/g, '\\t')
  .replace(/\r/g, '\\r')
  .replace(/\n/g, '\\n')

const unescapeKnxAiChatContextField = (value) => {
  const source = String(value === undefined || value === null ? '' : value)
  let result = ''
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (char !== '\\' || index + 1 >= source.length) {
      result += char
      continue
    }
    const next = source[index + 1]
    if (next === '\\') result += '\\'
    else if (next === 't') result += '\t'
    else if (next === 'r') result += '\r'
    else if (next === 'n') result += '\n'
    else result += `\\${next}`
    index += 1
  }
  return result
}

const buildKnxAiChatContextRecord = (type, fields = []) => [type]
  .concat(fields.map(escapeKnxAiChatContextField))
  .join('\t')

const renderKnxAiChatContextFile = (context) => {
  const target = normalizeKnxAiChatContext(context)
  target.updatedAt = new Date().toISOString()
  const lines = [
    '# KNX AI native chat-learning context',
    '# Tab-separated records. Escapes: \\\\ (backslash), \\t (tab), \\n (newline), \\r (carriage return).',
    '# Records: SESSION, INSTRUCTION, TURN, CAMERA_WATCH, END_SESSION.',
    buildKnxAiChatContextRecord(CHAT_CONTEXT_NATIVE_HEADER, [CHAT_CONTEXT_VERSION]),
    buildKnxAiChatContextRecord('CREATED_AT', [target.createdAt]),
    buildKnxAiChatContextRecord('UPDATED_AT', [target.updatedAt])
  ]
  target.sessions.forEach((session) => {
    lines.push(buildKnxAiChatContextRecord('SESSION', [session.id, session.updatedAt]))
    session.instructions.forEach(item => lines.push(buildKnxAiChatContextRecord('INSTRUCTION', [item.at, item.text])))
    session.turns.forEach(turn => lines.push(buildKnxAiChatContextRecord('TURN', [turn.at, turn.question, turn.reply])))
    session.cameraWatches.forEach((watch) => {
      lines.push(buildKnxAiChatContextRecord('CAMERA_WATCH', [
        watch.id,
        watch.createdAt,
        watch.cameraId,
        watch.cameraName,
        watch.eventType,
        watch.scopeId,
        watch.scopeName,
        watch.cooldownSeconds,
        watch.sendSnapshot ? 'true' : 'false',
        watch.language
      ].concat(watch.objectTypes)))
    })
    lines.push('END_SESSION')
  })
  return { content: `${lines.join('\n')}\n`, context: target }
}

const buildKnxAiChatContextFile = ({ context, maxBytes = CHAT_CONTEXT_MAX_BYTES } = {}) => {
  const targetBytes = Math.max(64 * 1024, Math.min(CHAT_CONTEXT_MAX_BYTES, Number(maxBytes) || CHAT_CONTEXT_MAX_BYTES))
  let bounded = normalizeKnxAiChatContext(context)
  let rendered = renderKnxAiChatContextFile(bounded)
  while (Buffer.byteLength(rendered.content, 'utf8') > targetBytes) {
    const sessionWithTurns = bounded.sessions.find(session => session.turns.length > 0)
    if (sessionWithTurns) sessionWithTurns.turns.shift()
    else if (bounded.sessions.length > 1) bounded.sessions.shift()
    else {
      const sessionWithInstructions = bounded.sessions.find(session => session.instructions.length > 0)
      if (!sessionWithInstructions) break
      sessionWithInstructions.instructions.shift()
    }
    rendered = renderKnxAiChatContextFile(bounded)
    bounded = rendered.context
  }
  return {
    content: rendered.content,
    context: rendered.context,
    bytes: Buffer.byteLength(rendered.content, 'utf8'),
    maxBytes: targetBytes
  }
}

const parseKnxAiChatContextFileStrict = (content) => {
  const source = String(content || '')
  const context = { version: CHAT_CONTEXT_VERSION, createdAt: '', updatedAt: '', sessions: [] }
  let headerSeen = false
  let currentSession = null

  source.split(/\r?\n/).forEach((line, lineIndex) => {
    if (!line.trim() || line.trimStart().startsWith('#')) return
    const fields = line.split('\t').map(unescapeKnxAiChatContextField)
    const record = fields.shift()
    const fail = message => { throw new Error(`Invalid KNX AI native chat-learning context at line ${lineIndex + 1}: ${message}`) }

    if (!headerSeen) {
      if (record !== CHAT_CONTEXT_NATIVE_HEADER || String(fields[0] || '') !== String(CHAT_CONTEXT_VERSION)) {
        fail(`expected ${CHAT_CONTEXT_NATIVE_HEADER} ${CHAT_CONTEXT_VERSION} header`)
      }
      headerSeen = true
      return
    }

    if (record === 'CREATED_AT') {
      if (currentSession) fail('CREATED_AT is not allowed inside a session')
      context.createdAt = fields[0] || ''
      return
    }
    if (record === 'UPDATED_AT') {
      if (currentSession) fail('UPDATED_AT is not allowed inside a session')
      context.updatedAt = fields[0] || ''
      return
    }
    if (record === 'SESSION') {
      if (currentSession) fail('nested SESSION record')
      if (!String(fields[0] || '').trim()) fail('SESSION id is required')
      currentSession = {
        id: fields[0],
        updatedAt: fields[1] || '',
        turns: [],
        instructions: [],
        cameraWatches: []
      }
      return
    }
    if (record === 'END_SESSION') {
      if (!currentSession) fail('END_SESSION without SESSION')
      context.sessions.push(currentSession)
      currentSession = null
      return
    }
    if (!currentSession) fail(`${record || 'empty record'} is not allowed outside a session`)
    if (record === 'INSTRUCTION') {
      if (fields.length < 2 || !String(fields[1] || '').trim()) fail('INSTRUCTION requires timestamp and text')
      currentSession.instructions.push({ at: fields[0], text: fields[1] })
      return
    }
    if (record === 'TURN') {
      if (fields.length < 3 || (!String(fields[1] || '').trim() && !String(fields[2] || '').trim())) {
        fail('TURN requires timestamp, question and reply')
      }
      currentSession.turns.push({ at: fields[0], question: fields[1], reply: fields[2] })
      return
    }
    if (record === 'CAMERA_WATCH') {
      if (fields.length < 10) fail('CAMERA_WATCH has missing fields')
      if (fields[8] !== 'true' && fields[8] !== 'false') fail('CAMERA_WATCH sendSnapshot must be true or false')
      currentSession.cameraWatches.push({
        id: fields[0],
        createdAt: fields[1],
        cameraId: fields[2],
        cameraName: fields[3],
        eventType: fields[4],
        scopeId: fields[5],
        scopeName: fields[6],
        cooldownSeconds: Number(fields[7]),
        sendSnapshot: fields[8] === 'true',
        language: fields[9],
        objectTypes: fields.slice(10)
      })
      return
    }
    fail(`unknown ${record || 'empty'} record`)
  })

  if (!headerSeen) throw new Error(`The file does not contain a ${CHAT_CONTEXT_NATIVE_HEADER} ${CHAT_CONTEXT_VERSION} header`)
  if (currentSession) throw new Error('Invalid KNX AI native chat-learning context: SESSION without END_SESSION')
  if (!context.createdAt || !context.updatedAt) throw new Error('Invalid KNX AI native chat-learning context: CREATED_AT and UPDATED_AT are required')
  return normalizeKnxAiChatContext(context)
}

const parseKnxAiChatContextFile = (content) => {
  try {
    return parseKnxAiChatContextFileStrict(content)
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
  addKnxAiChatInstruction,
  addKnxAiChatTurn,
  buildKnxAiChatContextFile,
  buildKnxAiChatPromptContext,
  clearKnxAiChatSession,
  conversationMapFromKnxAiChatContext,
  createEmptyKnxAiChatContext,
  getKnxAiChatSession,
  listAllKnxAiCameraWatches,
  listKnxAiCameraWatches,
  normalizeKnxAiChatContext,
  normalizeCameraWatch,
  parseKnxAiChatContextFile,
  parseKnxAiChatContextFileStrict,
  removeKnxAiCameraWatches,
  removeKnxAiChatInstructions
}
