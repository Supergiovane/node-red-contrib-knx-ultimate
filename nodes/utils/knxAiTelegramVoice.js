const path = require('path')

const KNX_AI_TELEGRAM_VOICE_MAX_BYTES = 20 * 1024 * 1024
const KNX_AI_TELEGRAM_VOICE_MAX_DURATION_SECONDS = 5 * 60
const KNX_AI_VOICE_API_TIMEOUT_MS = 120000
const KNX_AI_VOICE_TRANSCRIPTION_MODEL = 'gpt-4o-mini-transcribe'
const KNX_AI_VOICE_SPEECH_MODEL = 'gpt-4o-mini-tts'
const KNX_AI_VOICE_SPEECH_VOICE = 'alloy'
const KNX_AI_VOICE_SPEECH_MAX_CHARS = 4096
const KNX_AI_VOICE_DEFAULT_BASE_URL = 'https://api.openai.com/v1'

const normalizeKnxAiLlmProvider = (value) => {
  const normalized = String(value || '').trim().toLowerCase().replace(/[ -]+/g, '_')
  if (!normalized || normalized === 'openai' || normalized === 'openai_compatible') return 'openai_compat'
  return normalized
}

const isKnxAiOpenAiCompatibleChatProvider = (value) => {
  const provider = normalizeKnxAiLlmProvider(value)
  return provider === 'openai_compat'
}

const resolveKnxAiVoiceServiceConfig = ({
  chatProvider,
  chatBaseUrl,
  chatApiKey
} = {}) => {
  const provider = normalizeKnxAiLlmProvider(chatProvider)
  const chatCompatible = isKnxAiOpenAiCompatibleChatProvider(provider)

  return {
    apiKey: chatCompatible ? String(chatApiKey || '').trim() : '',
    baseUrl: chatCompatible ? (String(chatBaseUrl || '').trim() || KNX_AI_VOICE_DEFAULT_BASE_URL) : '',
    chatCompatible,
    chatProvider: provider,
    source: chatCompatible ? 'chat' : 'unconfigured',
    speechModel: KNX_AI_VOICE_SPEECH_MODEL,
    speechVoice: KNX_AI_VOICE_SPEECH_VOICE,
    transcriptionModel: KNX_AI_VOICE_TRANSCRIPTION_MODEL
  }
}

const isOfficialOpenAiVoiceUrl = (value) => {
  try {
    const parsed = new URL(String(value || '').trim())
    const hostname = parsed.hostname.toLowerCase()
    return parsed.protocol === 'https:' && (hostname === 'api.openai.com' || hostname.endsWith('.api.openai.com'))
  } catch (error) {
    return false
  }
}

const normalizeVoiceMediaType = (value) => {
  const normalized = String(value || '').split(';')[0].trim().toLowerCase()
  return normalized.startsWith('audio/') ? normalized : 'audio/ogg'
}

const extensionForVoiceMediaType = (mediaType) => {
  const normalized = normalizeVoiceMediaType(mediaType)
  if (normalized === 'audio/mpeg' || normalized === 'audio/mp3') return '.mp3'
  if (normalized === 'audio/mp4' || normalized === 'audio/m4a' || normalized === 'audio/x-m4a') return '.m4a'
  if (normalized === 'audio/wav' || normalized === 'audio/x-wav') return '.wav'
  if (normalized === 'audio/webm') return '.webm'
  return '.ogg'
}

const sanitizeVoiceFilename = ({ filename, mediaType, fallback = 'telegram-voice' } = {}) => {
  const source = path.basename(String(filename || '').trim()).replace(/[^a-zA-Z0-9._-]/g, '-')
  if (source) return source.slice(0, 240)
  return `${fallback}${extensionForVoiceMediaType(mediaType)}`
}

const getAiVoiceDisclosure = (language) => {
  const normalized = String(language || '').trim().toLowerCase().split(/[-_]/)[0]
  const labels = {
    de: 'KI-generierte Stimme',
    en: 'AI-generated voice',
    es: 'Voz generada por IA',
    fr: 'Voix générée par l’IA',
    it: 'Voce generata dall’IA',
    zh: 'AI 生成的语音'
  }
  return labels[normalized] || labels.en
}

const deriveOpenAiCompatibleAudioUrl = (baseUrl, resource = 'transcriptions') => {
  const resourceName = String(resource || '').trim().toLowerCase()
  if (resourceName !== 'transcriptions' && resourceName !== 'speech') {
    throw new Error(`Unsupported OpenAI audio resource '${resourceName}'`)
  }
  let parsed
  try {
    parsed = new URL(String(baseUrl || 'https://api.openai.com/v1/chat/completions').trim())
  } catch (error) {
    throw new Error('Invalid OpenAI-compatible base URL for voice processing')
  }
  if (parsed.username || parsed.password) throw new Error('OpenAI-compatible voice URL must not contain credentials')
  const pathname = parsed.pathname.replace(/\/+$/, '') || '/v1'
  const terminalPaths = ['/chat/completions', '/completions', '/responses']
  const terminal = terminalPaths.find(item => pathname.endsWith(item))
  let apiRoot = terminal ? pathname.slice(0, -terminal.length) : pathname
  if (!terminal && !/\/v1$/i.test(apiRoot)) {
    const versionIndex = apiRoot.toLowerCase().lastIndexOf('/v1/')
    if (versionIndex >= 0) apiRoot = apiRoot.slice(0, versionIndex + 3)
  }
  parsed.pathname = `${apiRoot.replace(/\/+$/, '')}/audio/${resourceName}`
  parsed.hash = ''
  return parsed.toString()
}

const findTelegramVoiceMetadata = (message) => {
  const source = message && typeof message === 'object' ? message : {}
  const original = source.originalMessage && typeof source.originalMessage === 'object'
    ? source.originalMessage
    : {}
  if (original.voice && typeof original.voice === 'object') return original.voice
  if (original.message && original.message.voice && typeof original.message.voice === 'object') return original.message.voice
  return {}
}

const resolveTelegramVoiceAllowedOrigin = (message) => {
  const details = message && message.telegramBot && typeof message.telegramBot === 'object'
    ? message.telegramBot
    : {}
  const candidate = String(details.baseApiUrl || details.baseapiurl || details.baseApiURL || '').trim()
  if (!candidate) return 'https://api.telegram.org'
  try { return new URL(candidate).origin } catch (error) { return 'https://api.telegram.org' }
}

const applyKnxAiTelegramVoiceInputPresetFallback = ({ preset, message } = {}) => {
  const normalizedPreset = String(preset || '')
  if (!['windkh-telegrambot', 'redbot-telegram'].includes(normalizedPreset) || !message || typeof message !== 'object') return null
  const telegram = message.payload && typeof message.payload === 'object' ? message.payload : null
  if (!telegram) return null
  const chatId = telegram.chatId
  if (chatId === undefined || chatId === null || chatId === '') return null
  const original = message.originalMessage && typeof message.originalMessage === 'object'
    ? message.originalMessage
    : {}
  const voice = findTelegramVoiceMetadata(message)

  if (normalizedPreset === 'redbot-telegram') {
    const redbotType = String(telegram.type || '').trim().toLowerCase()
    if ((redbotType !== 'audio' && redbotType !== 'voice') || !Buffer.isBuffer(telegram.content)) return null
    const mediaType = normalizeVoiceMediaType(voice.mime_type || telegram.mimeType)
    message.sessionId = String(chatId)
    message.language = (original.from && original.from.language_code) ||
      (original.message && original.message.from && original.message.from.language_code) ||
      telegram.language ||
      message.language ||
      ''
    message.topic = 'ask'
    delete message.prompt
    message.knxAi = Object.assign({}, message.knxAi, {
      sessionId: String(chatId),
      voiceInput: {
        source: 'telegram',
        originalType: 'voice',
        transport: 'redbot-buffer',
        data: telegram.content,
        fileId: String(voice.file_id || '').trim(),
        mediaType,
        filename: sanitizeVoiceFilename({ filename: telegram.filename || voice.file_name, mediaType }),
        durationSeconds: Math.max(0, Number(voice.duration || telegram.duration) || 0),
        fileSize: Math.max(0, Number(voice.file_size || telegram.fileSize) || telegram.content.length)
      }
    })
    return message
  }

  if (telegram.type !== 'voice') return null
  const mediaType = normalizeVoiceMediaType(voice.mime_type || telegram.contentType || telegram.mimeType)
  const fileId = String(telegram.content || voice.file_id || '').trim()
  const weblink = String(telegram.weblink || message.weblink || '').trim()
  if (!fileId && !weblink) return null

  message.sessionId = String(chatId)
  message.language = (original.from && original.from.language_code) ||
    (original.message && original.message.from && original.message.from.language_code) ||
    message.language ||
    ''
  message.topic = 'ask'
  delete message.prompt
  message.knxAi = Object.assign({}, message.knxAi, {
    sessionId: String(chatId),
    voiceInput: {
      source: 'telegram',
      originalType: 'voice',
      fileId,
      weblink,
      allowedOrigin: resolveTelegramVoiceAllowedOrigin(message),
      mediaType,
      filename: sanitizeVoiceFilename({ filename: telegram.filename || voice.file_name, mediaType }),
      durationSeconds: Math.max(0, Number(voice.duration || telegram.duration) || 0),
      fileSize: Math.max(0, Number(voice.file_size || telegram.fileSize) || 0)
    }
  })
  return message
}

const isKnxAiTelegramVoiceInput = (message) => {
  const voiceInput = message && message.knxAi && message.knxAi.voiceInput
  return !!(voiceInput && voiceInput.source === 'telegram' && voiceInput.originalType === 'voice')
}

const redactKnxAiTelegramVoiceLocations = (message) => {
  if (!message || typeof message !== 'object') return message
  if (message.payload && typeof message.payload === 'object') {
    message.payload = Object.assign({}, message.payload)
    if (Buffer.isBuffer(message.payload.content)) message.payload.content = ''
    delete message.payload.weblink
    delete message.payload.path
  }
  delete message.weblink
  delete message.path
  if (message.knxAi && message.knxAi.voiceInput && typeof message.knxAi.voiceInput === 'object') {
    const voiceInput = Object.assign({}, message.knxAi.voiceInput)
    delete voiceInput.data
    delete voiceInput.weblink
    delete voiceInput.path
    message.knxAi = Object.assign({}, message.knxAi, { voiceInput })
  }
  return message
}

const responseHeader = (response, name) => {
  if (!response || !response.headers) return ''
  if (typeof response.headers.get === 'function') return String(response.headers.get(name) || '')
  const normalizedName = String(name || '').toLowerCase()
  const entry = Object.entries(response.headers).find(([key]) => String(key).toLowerCase() === normalizedName)
  return entry ? String(entry[1] || '') : ''
}

const readBoundedResponseBuffer = async (response, maxBytes) => {
  const limit = Math.max(1, Number(maxBytes) || KNX_AI_TELEGRAM_VOICE_MAX_BYTES)
  const declaredLength = Number(responseHeader(response, 'content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > limit) {
    throw new Error(`Voice audio exceeds the ${Math.round(limit / (1024 * 1024))} MB limit`)
  }
  if (response && response.body && typeof response.body.getReader === 'function') {
    const reader = response.body.getReader()
    const chunks = []
    let total = 0
    try {
      while (true) {
        const part = await reader.read()
        if (part.done) break
        const chunk = Buffer.from(part.value)
        total += chunk.length
        if (total > limit) {
          try { await reader.cancel() } catch (error) { /* ignore */ }
          throw new Error(`Voice audio exceeds the ${Math.round(limit / (1024 * 1024))} MB limit`)
        }
        chunks.push(chunk)
      }
    } finally {
      try { reader.releaseLock() } catch (error) { /* ignore */ }
    }
    return Buffer.concat(chunks, total)
  }
  if (!response || typeof response.arrayBuffer !== 'function') throw new Error('Voice download returned no audio data')
  const data = Buffer.from(await response.arrayBuffer())
  if (data.length > limit) throw new Error(`Voice audio exceeds the ${Math.round(limit / (1024 * 1024))} MB limit`)
  return data
}

const extractAudioApiError = (text) => {
  const raw = String(text || '').trim()
  if (!raw) return ''
  try {
    const json = JSON.parse(raw)
    const candidate = json && json.error && json.error.message
      ? json.error.message
      : json && (json.message || json.detail || json.error)
    if (candidate) return String(candidate).replace(/\s+/g, ' ').trim().slice(0, 1200)
  } catch (error) { /* use response text */ }
  return raw.replace(/\s+/g, ' ').slice(0, 1200)
}

const fetchKnxAiTelegramVoice = async ({
  voiceInput,
  fetchImpl = globalThis.fetch,
  timeoutMs = KNX_AI_VOICE_API_TIMEOUT_MS,
  maxBytes = KNX_AI_TELEGRAM_VOICE_MAX_BYTES
} = {}) => {
  const source = voiceInput && typeof voiceInput === 'object' ? voiceInput : {}
  const declaredSize = Math.max(0, Number(source.fileSize) || 0)
  if (declaredSize > maxBytes) throw new Error(`Voice audio exceeds the ${Math.round(maxBytes / (1024 * 1024))} MB limit`)
  const declaredDuration = Math.max(0, Number(source.durationSeconds) || 0)
  if (declaredDuration > KNX_AI_TELEGRAM_VOICE_MAX_DURATION_SECONDS) {
    throw new Error(`Voice message exceeds the ${Math.round(KNX_AI_TELEGRAM_VOICE_MAX_DURATION_SECONDS / 60)}-minute limit`)
  }
  const mediaType = normalizeVoiceMediaType(source.mediaType)
  const filename = sanitizeVoiceFilename({ filename: source.filename, mediaType })
  if (Buffer.isBuffer(source.data)) {
    if (!source.data.length) throw new Error('Telegram returned an empty voice message')
    if (source.data.length > maxBytes) throw new Error(`Voice audio exceeds the ${Math.round(maxBytes / (1024 * 1024))} MB limit`)
    return {
      data: Buffer.from(source.data),
      mediaType,
      filename,
      source: String(source.transport || 'telegram-buffer')
    }
  }
  const weblink = String(source.weblink || '').trim()
  if (weblink) {
    let parsed
    try {
      parsed = new URL(weblink)
    } catch (error) {
      throw new Error('Telegram returned an invalid voice download link')
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('Telegram voice download link must use HTTP or HTTPS')
    }
    if (parsed.username || parsed.password) throw new Error('Telegram voice download link must not contain credentials')
    const allowedOrigin = String(source.allowedOrigin || 'https://api.telegram.org').trim()
    if (parsed.origin !== allowedOrigin) throw new Error('Telegram voice download link has an unexpected origin')
    if (typeof fetchImpl !== 'function') throw new Error('Voice download is unavailable in this Node.js runtime')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs) || KNX_AI_VOICE_API_TIMEOUT_MS))
    try {
      let response
      try {
        response = await fetchImpl(parsed.toString(), { signal: controller.signal, redirect: 'manual' })
      } catch (error) {
        if (error && error.name === 'AbortError') throw new Error('Telegram voice download timed out')
        throw new Error('Telegram voice download failed (network error)')
      }
      if (!response || !response.ok) {
        const status = response && response.status ? `HTTP ${response.status}` : 'network error'
        throw new Error(`Telegram voice download failed (${status})`)
      }
      const data = await readBoundedResponseBuffer(response, maxBytes)
      if (!data.length) throw new Error('Telegram returned an empty voice message')
      return {
        data,
        mediaType: normalizeVoiceMediaType(responseHeader(response, 'content-type') || mediaType),
        filename,
        source: 'telegram-weblink'
      }
    } finally {
      clearTimeout(timer)
    }
  }

  throw new Error('Telegram did not provide a downloadable voice link')
}

const postKnxAiVoiceTranscription = async ({
  url,
  apiKey,
  audio,
  model = KNX_AI_VOICE_TRANSCRIPTION_MODEL,
  language = '',
  fetchImpl = globalThis.fetch,
  timeoutMs = KNX_AI_VOICE_API_TIMEOUT_MS
} = {}) => {
  if (!audio || !Buffer.isBuffer(audio.data) || !audio.data.length) throw new Error('Missing voice audio to transcribe')
  if (typeof fetchImpl !== 'function' || typeof globalThis.FormData !== 'function' || typeof globalThis.Blob !== 'function') {
    throw new Error('Voice transcription requires Node.js FormData support')
  }
  const form = new globalThis.FormData()
  form.append('file', new globalThis.Blob([audio.data], { type: normalizeVoiceMediaType(audio.mediaType) }), sanitizeVoiceFilename(audio))
  form.append('model', String(model || KNX_AI_VOICE_TRANSCRIPTION_MODEL))
  const normalizedLanguage = String(language || '').trim().toLowerCase().split(/[-_]/)[0]
  if (/^[a-z]{2,3}$/.test(normalizedLanguage)) form.append('language', normalizedLanguage)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs) || KNX_AI_VOICE_API_TIMEOUT_MS))
  try {
    let response
    try {
      response = await fetchImpl(url, {
        method: 'POST',
        headers: apiKey ? { authorization: `Bearer ${apiKey}` } : {},
        body: form,
        signal: controller.signal
      })
    } catch (error) {
      if (error && error.name === 'AbortError') throw new Error('Voice transcription timed out')
      throw new Error('Voice transcription failed (network error)')
    }
    const text = await response.text()
    if (!response.ok) {
      const detail = extractAudioApiError(text)
      throw new Error(detail ? `Voice transcription failed (HTTP ${response.status}: ${detail})` : `Voice transcription failed (HTTP ${response.status})`)
    }
    let json
    try { json = JSON.parse(text) } catch (error) { json = null }
    const transcript = String(json && json.text !== undefined ? json.text : text).trim()
    if (!transcript) throw new Error('Voice transcription returned no text')
    return { text: transcript, model: String(model || KNX_AI_VOICE_TRANSCRIPTION_MODEL) }
  } finally {
    clearTimeout(timer)
  }
}

const postKnxAiVoiceSpeech = async ({
  url,
  apiKey,
  text,
  model = KNX_AI_VOICE_SPEECH_MODEL,
  voice = KNX_AI_VOICE_SPEECH_VOICE,
  fetchImpl = globalThis.fetch,
  timeoutMs = KNX_AI_VOICE_API_TIMEOUT_MS,
  maxBytes = KNX_AI_TELEGRAM_VOICE_MAX_BYTES
} = {}) => {
  const input = String(text === undefined || text === null ? '' : text).trim()
  if (!input) throw new Error('Missing text for voice reply')
  if (input.length > KNX_AI_VOICE_SPEECH_MAX_CHARS) {
    throw new Error(`Voice reply exceeds the ${KNX_AI_VOICE_SPEECH_MAX_CHARS}-character speech limit`)
  }
  if (typeof fetchImpl !== 'function') throw new Error('Voice synthesis is unavailable in this Node.js runtime')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs) || KNX_AI_VOICE_API_TIMEOUT_MS))
  try {
    let response
    try {
      response = await fetchImpl(url, {
        method: 'POST',
        headers: Object.assign(
          { 'content-type': 'application/json' },
          apiKey ? { authorization: `Bearer ${apiKey}` } : {}
        ),
        body: JSON.stringify({
          model: String(model || KNX_AI_VOICE_SPEECH_MODEL),
          voice: String(voice || KNX_AI_VOICE_SPEECH_VOICE),
          input,
          response_format: 'opus'
        }),
        signal: controller.signal
      })
    } catch (error) {
      if (error && error.name === 'AbortError') throw new Error('Voice synthesis timed out')
      throw new Error('Voice synthesis failed (network error)')
    }
    if (!response.ok) {
      const detail = extractAudioApiError(await response.text())
      throw new Error(detail ? `Voice synthesis failed (HTTP ${response.status}: ${detail})` : `Voice synthesis failed (HTTP ${response.status})`)
    }
    const data = await readBoundedResponseBuffer(response, maxBytes)
    if (!data.length) throw new Error('Voice synthesis returned no audio')
    return {
      data,
      mediaType: 'audio/ogg',
      filename: 'knx-ai-reply.ogg',
      model: String(model || KNX_AI_VOICE_SPEECH_MODEL),
      voice: String(voice || KNX_AI_VOICE_SPEECH_VOICE)
    }
  } finally {
    clearTimeout(timer)
  }
}

const applyKnxAiTelegramVoiceOutputPresetFallback = ({ preset, message, inputMessage } = {}) => {
  const normalizedPreset = String(preset || '')
  if (!['windkh-telegrambot', 'redbot-telegram'].includes(normalizedPreset) || !message || typeof message !== 'object') return message
  const audio = message.knxAi && message.knxAi.audio
  if (!audio || !Buffer.isBuffer(audio.data) || !audio.data.length) return message
  const currentPayload = message.payload && typeof message.payload === 'object' ? message.payload : null
  if (currentPayload && (currentPayload.type === 'voice' || currentPayload.type === 'audio' || currentPayload.type === 'photo')) return message
  if (normalizedPreset === 'redbot-telegram' && currentPayload && currentPayload.type === 'inline-buttons') return message
  const confirmation = message.knxAi && message.knxAi.confirmationRequest
  if (normalizedPreset === 'redbot-telegram' && confirmation && confirmation.required === true) return message
  const source = inputMessage && typeof inputMessage === 'object'
    ? inputMessage
    : message.inputMessage && typeof message.inputMessage === 'object'
      ? message.inputMessage
      : message
  const sourcePayload = source.payload && typeof source.payload === 'object' ? source.payload : {}
  const chatId = currentPayload && currentPayload.chatId !== undefined
    ? currentPayload.chatId
    : sourcePayload.chatId !== undefined
      ? sourcePayload.chatId
      : source.chatId
  if (chatId === undefined || chatId === null || chatId === '') return message
  let caption = currentPayload ? currentPayload.content : message.payload
  if (caption && typeof caption === 'object') caption = caption.error || caption.message || ''
  const language = message.knxAi && message.knxAi.language
    ? message.knxAi.language
    : source.language
  caption = [getAiVoiceDisclosure(language), String(caption === undefined || caption === null ? '' : caption)]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1024)

  if (normalizedPreset === 'redbot-telegram') {
    const transport = currentPayload && currentPayload.transport
      ? currentPayload.transport
      : sourcePayload.transport || 'telegram'
    const userId = currentPayload && currentPayload.userId !== undefined
      ? currentPayload.userId
      : sourcePayload.userId
    message.payload = {
      transport,
      chatId,
      type: 'audio',
      inbound: false,
      content: audio.data,
      filename: sanitizeVoiceFilename({ filename: audio.filename, mediaType: audio.mediaType, fallback: 'knx-ai-reply' }),
      mimeType: normalizeVoiceMediaType(audio.mediaType),
      caption
    }
    if (userId !== undefined) message.payload.userId = userId
    return message
  }

  const options = Object.assign({}, currentPayload && currentPayload.options ? currentPayload.options : {})
  if (caption) options.caption = caption
  message.payload = {
    chatId,
    type: 'voice',
    content: audio.data,
    options,
    fileOptions: {
      filename: sanitizeVoiceFilename({ filename: audio.filename, mediaType: audio.mediaType, fallback: 'knx-ai-reply' }),
      contentType: normalizeVoiceMediaType(audio.mediaType)
    }
  }
  return message
}

module.exports = {
  KNX_AI_TELEGRAM_VOICE_MAX_BYTES,
  KNX_AI_TELEGRAM_VOICE_MAX_DURATION_SECONDS,
  KNX_AI_VOICE_API_TIMEOUT_MS,
  KNX_AI_VOICE_DEFAULT_BASE_URL,
  KNX_AI_VOICE_SPEECH_MAX_CHARS,
  KNX_AI_VOICE_SPEECH_MODEL,
  KNX_AI_VOICE_SPEECH_VOICE,
  KNX_AI_VOICE_TRANSCRIPTION_MODEL,
  applyKnxAiTelegramVoiceInputPresetFallback,
  applyKnxAiTelegramVoiceOutputPresetFallback,
  deriveOpenAiCompatibleAudioUrl,
  fetchKnxAiTelegramVoice,
  isKnxAiOpenAiCompatibleChatProvider,
  isKnxAiTelegramVoiceInput,
  isOfficialOpenAiVoiceUrl,
  normalizeKnxAiLlmProvider,
  postKnxAiVoiceSpeech,
  postKnxAiVoiceTranscription,
  readBoundedResponseBuffer,
  redactKnxAiTelegramVoiceLocations,
  resolveKnxAiVoiceServiceConfig
}
