const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const {
  KNX_AI_CLOUD_LLM_TIMEOUT_MIN_MS,
  KNX_AI_COMPACT_CONTEXT_MAX_TOKENS,
  KNX_AI_LOCAL_CONTEXT_RETRY_CHAR_BUDGETS,
  KNX_AI_LOCAL_LLM_TIMEOUT_MIN_MS,
  KNX_AI_MINIMAL_CONTEXT_MAX_TOKENS,
  KNX_AI_ROUTINE_FEEDBACK_TIMEOUT_MS,
  KNX_AI_THINKING_DELAY_MS,
  KNX_AI_TRAFFIC_DEFAULTS,
  applyKnxAiChatMediaPresetFallback,
  bindSharedKnxAiState,
  buildKnxAiConfirmationRequest,
  buildKnxAiReadResultMetadata,
  buildKnxAiRoutineInspectionContext,
  buildKnxAiUniversalMessage,
  classifyKnxAiConfirmation,
  cloneKnxAiInputMessage,
  compileKnxAiChatAdapter,
  compactLlmMessagesForContextRetry,
  coerceKnxAiCommandPayload,
  detectKnxAiLanguageFromText,
  deriveLmStudioNativeApiUrl,
  dispatchKnxAiTtsUltimateAnnouncement,
  ensureLmStudioModelMaxContext,
  executeKnxAiChatAdapter,
  extractLlmHttpErrorDetail,
  extractOllamaModelMaxContextLength,
  extractKnxAiQuestion,
  formatKnxAiCommandPreview,
  formatKnxAiReadResults,
  formatKnxAiRoutineExecutionReport,
  getKnxAiConfirmationCopy,
  getKnxAiRequestStatusLabel,
  getKnxAiThinkingCopy,
  isChatCompletionsModelError,
  isLlmContextLengthError,
  isLikelyKnxAiRoutineRequest,
  isProbablyChatModelId,
  isUnsupportedTemperatureError,
  normalizeKnxAiCommandCandidates,
  normalizeKnxAiRoutineDescriptor,
  normalizeLmStudioModelCatalog,
  parseKnxAiConversationResponse,
  postLocalLlmWithContextFallbacks,
  postOpenAiCompatibleChatWithFallbacks,
  resolveKnxAiLanguage,
  resolveKnxAiLlmTimeoutMs,
  resolveKnxAiPromptContextMode,
  resolveKnxAiOperationEvent,
  resolveKnxAiSessionId,
  resolveOllamaModelMaxContext,
  releaseSharedKnxAiState,
  safeKnxAiSend,
  selectKnxAiCatalogForPrompt,
  selectKnxAiRoutineCatalogForPrompt,
  summarizeDetectedKnxAiCameraAdapters,
  summarizeDetectedKnxAiTtsAdapter
} = require('../nodes/knxUltimateAI').__test
const chatAdapterMappings = require('../resources/KNXAIChatAdapterMappings')
const {
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
  parseKnxAiChatContextMarkdown
} = require('../nodes/utils/knxAiChatContext')
const {
  KNX_AI_CAMERA_IMAGE_MAX_BYTES,
  KNX_AI_CAMERA_REGISTRY_KEY,
  buildKnxAiCameraNotificationText,
  cameraWatchMatchesEvent,
  getKnxAiCameraAdapterRegistry,
  normalizeKnxAiCameraActions,
  normalizeKnxAiCameraEvent,
  normalizeKnxAiCameraImage,
  resolveKnxAiCamera
} = require('../nodes/utils/knxAiCamera')

describe('KNX AI conversational control', () => {
  const catalog = [
    { ga: '1/2/3', dpt: '1.001', label: 'Living room light command', role: 'command' },
    { ga: '1/2/4', dpt: '1.001', label: 'Living room light status', role: 'status' },
    { ga: '1/2/5', dpt: '5.001', label: 'Living room brightness command', role: 'command' }
  ]

  const coercePayload = (value, context) => {
    if (context.dpt.startsWith('1.')) {
      if (value === true || value === 1 || String(value).toLowerCase() === 'on') return true
      if (value === false || value === 0 || String(value).toLowerCase() === 'off') return false
    }
    if (context.dpt.startsWith('5.')) return Number(value)
    return value
  }

  it('parses a structured provider response from a fenced JSON block', () => {
    const parsed = parseKnxAiConversationResponse('```json\n{"reply":"Accendo la luce.","language":"it","commands":[{"destination":"1/2/3","payload":true}],"cameraActions":[{"type":"snapshot","camera":"Ingresso"}],"speechActions":[{"type":"announce","text":"La cena è pronta","reason":"richiesto"}]}\n```')
    expect(parsed.reply).to.equal('Accendo la luce.')
    expect(parsed.language).to.equal('it')
    expect(parsed.commands).to.have.length(1)
    expect(parsed.cameraActions).to.deep.equal([{ type: 'snapshot', camera: 'Ingresso' }])
    expect(parsed.speechActions).to.deep.equal([{ type: 'announce', text: 'La cena è pronta', reason: 'richiesto' }])
    expect(parsed.routine).to.deep.equal({ active: false, name: '', phase: 'none' })
  })

  it('parses and normalizes a conversational multi-step routine', () => {
    const parsed = parseKnxAiConversationResponse(JSON.stringify({
      reply: 'Controllo lo stato della casa.',
      language: 'it',
      routine: { active: true, name: 'Uscita di casa', phase: 'inspect' },
      commands: [{ event: 'GroupValue_Read', destination: '1/2/4', dpt: '1.001', payload: null, reason: 'Stato luce' }],
      cameraActions: [],
      speechActions: []
    }))

    expect(parsed.routine).to.deep.equal({ active: true, name: 'Uscita di casa', phase: 'inspect' })
    expect(normalizeKnxAiRoutineDescriptor({ active: false, name: 'ignored', phase: 'plan' })).to.deep.equal({
      active: true,
      name: 'ignored',
      phase: 'plan'
    })
    expect(normalizeKnxAiRoutineDescriptor(null)).to.deep.equal({ active: false, name: '', phase: 'none' })
  })

  it('extracts text and a session id from common Telegram message shapes', () => {
    const msg = {
      payload: {
        content: 'Accendi la luce in soggiorno',
        chatId: 12345
      }
    }
    expect(extractKnxAiQuestion(msg)).to.equal('Accendi la luce in soggiorno')
    expect(resolveKnxAiSessionId(msg)).to.equal('12345')
  })

  it('maps telegrambot receiver and callback messages directly into KNX AI', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'windkh-telegrambot')
    const adapter = compileKnxAiChatAdapter({
      code: preset.inputCode,
      direction: 'chat input'
    })
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: {
          chatId: 12345,
          type: 'message',
          content: 'Che temperatura c’è in soggiorno?'
        },
        originalMessage: {
          from: { language_code: 'it' }
        }
      }
    })

    expect(message).to.include({
      topic: 'ask',
      prompt: 'Che temperatura c’è in soggiorno?',
      sessionId: '12345',
      language: 'it'
    })

    const callback = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: {
          chatId: 12345,
          type: 'callback_query',
          content: 'confirm'
        }
      }
    })
    expect(callback.topic).to.equal('confirm')
    expect(callback.knxAi).to.deep.equal({
      sessionId: '12345',
      confirm: true
    })
  })

  it('maps KNX AI replies and confirmation actions directly into telegrambot sender messages', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'windkh-telegrambot')
    const adapter = compileKnxAiChatAdapter({
      code: preset.outputCode,
      direction: 'chat output'
    })
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: 'Confermi l’accensione?',
        inputMessage: {
          payload: {
            chatId: 12345,
            type: 'message',
            content: 'Accendi la luce'
          }
        },
        knxAi: {
          confirmationRequest: {
            required: true,
            actions: [
              { label: 'Conferma', callbackData: 'confirm' },
              { label: 'Annulla', callbackData: 'cancel' }
            ]
          }
        }
      }
    })

    expect(message.payload).to.include({
      chatId: 12345,
      type: 'message',
      content: 'Confermi l’accensione?'
    })
    const replyMarkup = JSON.parse(message.payload.options.reply_markup)
    expect(replyMarkup.inline_keyboard[0]).to.deep.equal([
      { text: 'Conferma', callback_data: 'confirm' },
      { text: 'Annulla', callback_data: 'cancel' }
    ])
  })

  it('maps a camera snapshot into a telegrambot photo message', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'windkh-telegrambot')
    const adapter = compileKnxAiChatAdapter({ code: preset.outputCode, direction: 'chat output' })
    const image = Buffer.from([1, 2, 3])
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: 'Snapshot ingresso',
        inputMessage: { payload: { chatId: 12345, type: 'message', content: 'Foto ingresso' } },
        knxAi: { image: { data: image, mediaType: 'image/jpeg', filename: 'ingresso.jpg' } }
      }
    })

    expect(message.payload).to.deep.equal({
      chatId: 12345,
      type: 'photo',
      content: image,
      options: { caption: 'Snapshot ingresso' },
      fileOptions: { filename: 'ingresso.jpg', contentType: 'image/jpeg' }
    })
  })

  it('upgrades a saved telegrambot adapter that predates camera-image support', () => {
    const image = Buffer.from([0xff, 0xd8, 0xff, 0xd9])
    const message = applyKnxAiChatMediaPresetFallback({
      preset: 'windkh-telegrambot',
      inputMessage: { payload: { chatId: 12345 } },
      message: {
        payload: 'Snapshot soggiorno',
        knxAi: { image: { data: image, mediaType: 'image/jpeg', filename: 'soggiorno.jpg' } }
      }
    })

    expect(message.payload).to.deep.equal({
      chatId: 12345,
      type: 'photo',
      content: image,
      options: { caption: 'Snapshot soggiorno' },
      fileOptions: { filename: 'soggiorno.jpg', contentType: 'image/jpeg' }
    })
  })

  it('maps RedBot Telegram messages and postbacks directly into KNX AI', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'redbot-telegram')
    expect(preset).to.be.an('object')
    const adapter = compileKnxAiChatAdapter({
      code: preset.inputCode,
      direction: 'chat input'
    })
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: {
          transport: 'telegram',
          chatId: 'redbot-chat-1',
          userId: 'redbot-user-1',
          type: 'message',
          inbound: true,
          content: 'Accendi la luce del soggiorno'
        },
        originalMessage: {
          from: { language_code: 'it' }
        }
      }
    })

    expect(message).to.include({
      topic: 'ask',
      prompt: 'Accendi la luce del soggiorno',
      sessionId: 'redbot-chat-1',
      language: 'it'
    })

    const confirmation = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: {
          transport: 'telegram',
          chatId: 'redbot-chat-1',
          type: 'message',
          inbound: true,
          content: 'confirm'
        }
      }
    })
    expect(confirmation.topic).to.equal('confirm')
    expect(confirmation.knxAi).to.deep.equal({
      sessionId: 'redbot-chat-1',
      confirm: true
    })
  })

  it('maps KNX AI replies and confirmation actions into RedBot inline buttons', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'redbot-telegram')
    const adapter = compileKnxAiChatAdapter({
      code: preset.outputCode,
      direction: 'chat output'
    })
    const chat = () => ({})
    const client = () => ({})
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: 'Confermi l’accensione?',
        inputMessage: {
          payload: {
            transport: 'telegram',
            chatId: 'redbot-chat-1',
            userId: 'redbot-user-1',
            type: 'message',
            inbound: true,
            content: 'Accendi la luce'
          },
          originalMessage: { message_id: 42 },
          chat,
          client
        },
        knxAi: {
          confirmationRequest: {
            required: true,
            actions: [
              { label: 'Conferma', callbackData: 'confirm' },
              { label: 'Annulla', callbackData: 'cancel' }
            ]
          }
        }
      }
    })

    expect(message.chat).to.equal(chat)
    expect(message.client).to.equal(client)
    expect(message.payload).to.deep.equal({
      transport: 'telegram',
      chatId: 'redbot-chat-1',
      userId: 'redbot-user-1',
      type: 'inline-buttons',
      inbound: false,
      content: 'Confermi l’accensione?',
      buttons: [
        { type: 'postback', label: 'Conferma', value: 'confirm' },
        { type: 'postback', label: 'Annulla', value: 'cancel' }
      ]
    })
  })

  it('maps a camera snapshot into a RedBot Telegram photo message', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'redbot-telegram')
    const adapter = compileKnxAiChatAdapter({ code: preset.outputCode, direction: 'chat output' })
    const image = Buffer.from([4, 5, 6])
    const chat = () => ({})
    const client = () => ({})
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: 'Persona al cancello',
        inputMessage: {
          payload: { transport: 'telegram', chatId: 'redbot-chat-1', userId: 'user-1' },
          chat,
          client
        },
        knxAi: { image: { data: image, mediaType: 'image/jpeg', filename: 'cancello.jpg' } }
      }
    })

    expect(message.payload).to.deep.equal({
      transport: 'telegram',
      chatId: 'redbot-chat-1',
      userId: 'user-1',
      type: 'photo',
      inbound: false,
      content: image,
      filename: 'cancello.jpg',
      mimeType: 'image/jpeg',
      caption: 'Persona al cancello'
    })
  })

  it('builds the minimal RedBot envelope for a persistent camera alert after restart', () => {
    const preset = chatAdapterMappings.find(item => item.id === 'redbot-telegram')
    const adapter = compileKnxAiChatAdapter({ code: preset.outputCode, direction: 'chat output' })
    const message = executeKnxAiChatAdapter({
      adapter,
      msg: {
        payload: 'Movimento in giardino',
        inputMessage: {
          topic: 'camera_notification',
          payload: { chatId: 'redbot-chat-1', type: 'message', content: '' }
        },
        knxAi: { type: 'camera_notification' }
      }
    })

    expect(message.originalMessage).to.include({ transport: 'telegram', chatId: 'redbot-chat-1' })
    expect(message.chat).to.be.a('function')
    expect(message.chat().get()).to.deep.equal({})
    expect(message.get('chatId')).to.equal('redbot-chat-1')
    expect(message.payload).to.include({
      transport: 'telegram',
      chatId: 'redbot-chat-1',
      type: 'message',
      inbound: false,
      content: 'Movimento in giardino'
    })
  })

  it('rejects invalid or asynchronous custom chat adapter code safely', () => {
    expect(() => compileKnxAiChatAdapter({
      code: 'return {',
      direction: 'chat input'
    })).to.throw('Invalid KNX AI chat input adapter')

    const asynchronous = compileKnxAiChatAdapter({
      code: 'return Promise.resolve(msg);',
      direction: 'chat output'
    })
    expect(() => executeKnxAiChatAdapter({
      adapter: asynchronous,
      msg: {}
    })).to.throw('must be synchronous')
  })

  it('accepts only an ETS command GA and uses the ETS DPT', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [{ destination: '1/2/3', dpt: '1.001', payload: 'on', reason: 'User request' }],
      catalog,
      coercePayload
    })
    expect(result.rejected).to.deep.equal([])
    expect(result.accepted).to.deep.include({
      destination: '1/2/3',
      dpt: '1.001',
      payload: true,
      event: 'GroupValue_Write',
      label: 'Living room light command',
      reason: 'User request',
      sourceIndex: 0
    })
  })

  it('normalizes numeric and string DPT 1 payloads to booleans before validation', () => {
    const variants = [
      { payload: 1, expected: true },
      { payload: 0, expected: false },
      { payload: '1', expected: true },
      { payload: '0', expected: false },
      { payload: 'on', expected: true },
      { payload: 'off', expected: false }
    ]

    variants.forEach(({ payload, expected }) => {
      const result = normalizeKnxAiCommandCandidates({
        commands: [{ destination: '1/2/3', dpt: '1.001', payload }],
        catalog,
        coercePayload: coerceKnxAiCommandPayload
      })
      expect(result.rejected, `payload ${JSON.stringify(payload)}`).to.deep.equal([])
      expect(result.accepted[0].payload).to.equal(expected)
      expect(result.accepted[0].payload).to.be.a('boolean')
    })
  })

  it('does not coerce other numeric values into DPT 1 booleans', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [{ destination: '1/2/3', dpt: '1.001', payload: 2 }],
      catalog,
      coercePayload: coerceKnxAiCommandPayload
    })

    expect(result.accepted).to.deep.equal([])
    expect(result.rejected[0].reason).to.equal('DPT 1.001 payload must be true/false, 1/0, on/off, or an exact ETS value label')
  })

  it('rejects invented, read-only, and DPT-mismatched commands', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [
        { destination: '9/9/9', dpt: '1.001', payload: true },
        { destination: '1/2/4', dpt: '1.001', payload: true },
        { destination: '1/2/3', dpt: '5.001', payload: 50 }
      ],
      catalog,
      coercePayload
    })
    expect(result.accepted).to.deep.equal([])
    expect(result.rejected.map(item => item.reason)).to.deep.equal([
      'destination is not present in the imported ETS catalog',
      'destination is not classified as a command group address',
      'requested DPT 5.001 does not match ETS DPT 1.001'
    ])
  })

  it('allows exact ETS status objects to be queried without making them writable', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [{
        event: 'GroupValue_Read',
        destination: '1/2/4',
        dpt: '1.001',
        payload: null,
        reason: 'Refresh the current state'
      }],
      catalog,
      coercePayload
    })

    expect(resolveKnxAiOperationEvent({ event: 'GroupValue_Read' })).to.equal('GroupValue_Read')
    expect(result.rejected).to.deep.equal([])
    expect(result.accepted).to.deep.equal([{
      destination: '1/2/4',
      dpt: '1.001',
      payload: '',
      readstatus: true,
      event: 'GroupValue_Read',
      label: 'Living room light status',
      reason: 'Refresh the current state',
      sourceIndex: 0
    }])
  })

  it('rejects reads with unknown addresses or a DPT different from ETS', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [
        { event: 'GroupValue_Read', destination: '9/9/9', dpt: '9.001', payload: null },
        { event: 'GroupValue_Read', destination: '1/2/4', dpt: '9.001', payload: null }
      ],
      catalog,
      coercePayload
    })

    expect(result.accepted).to.deep.equal([])
    expect(result.rejected.map(item => item.reason)).to.deep.equal([
      'destination is not present in the imported ETS catalog',
      'requested DPT 9.001 does not match ETS DPT 1.001'
    ])
  })

  it('builds a Universal Mode read request without a writable payload', () => {
    const message = buildKnxAiUniversalMessage({
      command: {
        destination: '2/1/5',
        dpt: '9.001',
        event: 'GroupValue_Read',
        label: 'Living room temperature',
        reason: 'Read current temperature'
      },
      question: 'Che temperatura c’è in soggiorno?',
      sessionId: 'telegram-123',
      confirmed: false,
      index: 0,
      inputMessage: { topic: 'ask', payload: 'temperature' }
    })

    expect(message).to.include({
      topic: '2/1/5',
      destination: '2/1/5',
      dpt: '9.001',
      payload: '',
      event: 'GroupValue_Read',
      readstatus: true
    })
    expect(message.knxAi).to.include({ type: 'knx_read', confirmed: false })
    expect(message.inputMessage).to.deep.equal({ topic: 'ask', payload: 'temperature' })
  })

  it('formats fresh KNX read responses in the request language', () => {
    const reply = formatKnxAiReadResults({
      operations: [
        { destination: '2/1/5', label: 'Temperatura soggiorno' },
        { destination: '2/1/6', label: 'Temperatura cucina' }
      ],
      results: [
        {
          status: 'fulfilled',
          value: { payload: 22.4, payloadmeasureunit: '°C', event: 'GroupValue_Response' }
        },
        {
          status: 'rejected',
          reason: new Error('timeout')
        }
      ],
      language: 'it'
    })

    expect(reply).to.include('Letture KNX aggiornate')
    expect(reply).to.include('Temperatura soggiorno: 22.4 °C')
    expect(reply).to.include('Nessuna risposta ricevuta per: Temperatura cucina')
  })

  it('rejects a payload outside the ETS DPT range', () => {
    const result = normalizeKnxAiCommandCandidates({
      commands: [{ destination: '1/2/5', dpt: '5.001', payload: 101 }],
      catalog,
      coercePayload
    })
    expect(result.accepted).to.deep.equal([])
    expect(result.rejected[0].reason).to.equal('DPT 5.001 payload must be between 0 and 100')
  })

  it('does not silently turn an unknown enum label into the first DPT value', () => {
    expect(() => coerceKnxAiCommandPayload('banana', { dpt: '20.102' }))
      .to.throw('DPT 20.102 payload must be a typed JSON value or an exact ETS value label')
    expect(coerceKnxAiCommandPayload('Comfort', { dpt: '20.102' })).to.equal(1)
  })

  it('limits the number of commands emitted from one user request', () => {
    const commands = Array.from({ length: 7 }, () => ({
      destination: '1/2/3',
      dpt: '1.001',
      payload: true
    }))
    const result = normalizeKnxAiCommandCandidates({
      commands,
      catalog,
      maxCommands: 5,
      coercePayload
    })
    expect(result.accepted).to.have.length(5)
    expect(result.rejected).to.deep.equal([{ sourceIndex: 5, reason: 'command limit exceeded (5)' }])
  })

  it('caps fresh reads separately from actuator writes', () => {
    const readCatalog = Array.from({ length: 22 }, (_, index) => ({
      ga: `2/1/${index + 1}`,
      dpt: '9.001',
      label: `Temperature ${index + 1}`,
      role: 'status'
    }))
    const result = normalizeKnxAiCommandCandidates({
      commands: readCatalog.map(item => ({
        event: 'GroupValue_Read',
        destination: item.ga,
        dpt: item.dpt,
        payload: null
      })),
      catalog: readCatalog,
      maxCommands: 5,
      maxReadCommands: 20,
      coercePayload
    })

    expect(result.accepted).to.have.length(20)
    expect(result.rejected).to.deep.equal([{ sourceIndex: 20, reason: 'read limit exceeded (20)' }])
  })

  it('recognizes explicit multilingual confirmation and cancellation only as complete replies', () => {
    expect(classifyKnxAiConfirmation({ question: 'CONFERMA' })).to.equal('confirm')
    expect(classifyKnxAiConfirmation({ question: 'sì!' })).to.equal('confirm')
    expect(classifyKnxAiConfirmation({ question: 'BESTÄTIGEN' })).to.equal('confirm')
    expect(classifyKnxAiConfirmation({ question: 'annulla' })).to.equal('cancel')
    expect(classifyKnxAiConfirmation({ question: 'non confermare ancora' })).to.equal('none')
    expect(classifyKnxAiConfirmation({ msg: { knxAi: { confirm: true } } })).to.equal('confirm')
  })

  it('builds a deterministic preview with exact GA, DPT, and payload', () => {
    const preview = formatKnxAiCommandPreview({
      commands: [{ destination: '1/2/3', dpt: '1.001', payload: true, label: 'Living room light' }],
      copy: getKnxAiConfirmationCopy('it')
    })
    expect(preview).to.include('Modifiche KNX in attesa di conferma')
    expect(preview).to.include('1/2/3 / DPT 1.001 → true')
    expect(preview).to.include('CONFERMA')
    expect(preview).to.include('ANNULLA')
  })

  it('builds a localized routine plan from fresh KNX inspection results', () => {
    const operations = [
      { destination: '1/2/4', dpt: '1.001', label: 'Stato luce soggiorno' },
      { destination: '2/2/4', dpt: '1.019', label: 'Finestra soggiorno' }
    ]
    const results = [
      { status: 'fulfilled', value: { event: 'GroupValue_Response', payload: true, payloadmeasureunit: '' } },
      { status: 'rejected', reason: new Error('timeout') }
    ]
    const readResults = buildKnxAiReadResultMetadata({ operations, results })
    const routine = { active: true, name: 'Uscita di casa', phase: 'plan' }
    const context = buildKnxAiRoutineInspectionContext({ routine, readResults })
    const preview = formatKnxAiCommandPreview({
      commands: [{ destination: '1/2/3', dpt: '1.001', payload: false, label: 'Luce soggiorno' }],
      copy: getKnxAiConfirmationCopy('it'),
      routine,
      readResults
    })

    expect(context).to.include('FRESH ROUTINE INSPECTION RESULTS')
    expect(context).to.include('1/2/4 | dpt 1.001 | Stato luce soggiorno | GroupValue_Response | value true')
    expect(context).to.include('2/2/4 | dpt 1.019 | Finestra soggiorno | NO_RESPONSE')
    expect(preview).to.include('Routine “Uscita di casa” in attesa di conferma')
    expect(preview).to.include('1/2 stati KNX preliminari ricevuti')
    expect(preview).to.include('1/2/3 / DPT 1.001 → false')

    const report = formatKnxAiRoutineExecutionReport({
      routine,
      commands: [
        { destination: '1/2/3', label: 'Luce soggiorno' },
        { destination: '3/2/3', label: 'Clima soggiorno' }
      ],
      results,
      language: 'it'
    })
    expect(report.verifiedCount).to.equal(1)
    expect(report.unverifiedCount).to.equal(1)
    expect(report.text).to.include('Esito della routine “Uscita di casa”')
    expect(report.text).to.include('Feedback KNX immediato ricevuto per 1/2')
    expect(report.text).to.include('Clima soggiorno')

    const confirmationRequest = buildKnxAiConfirmationRequest({
      sessionId: 'routine-chat',
      expiresAt: Date.UTC(2026, 7, 25, 12, 0, 0),
      commandCount: 1,
      copy: getKnxAiConfirmationCopy('it'),
      routine
    })
    expect(confirmationRequest.routine).to.deep.equal(routine)
  })

  it('adds a localized machine-readable confirmation request for chat buttons', () => {
    const confirmationRequest = buildKnxAiConfirmationRequest({
      sessionId: 'telegram-123',
      expiresAt: Date.UTC(2026, 6, 29, 12, 0, 0),
      commandCount: 2,
      copy: getKnxAiConfirmationCopy('it')
    })
    expect(confirmationRequest).to.deep.equal({
      required: true,
      status: 'pending',
      sessionId: 'telegram-123',
      expiresAt: Date.UTC(2026, 6, 29, 12, 0, 0),
      expiresAtIso: '2026-07-29T12:00:00.000Z',
      commandCount: 2,
      actions: [
        {
          id: 'confirm',
          label: 'Conferma',
          callbackData: 'confirm',
          message: {
            topic: 'confirm',
            knxAi: { confirm: true, sessionId: 'telegram-123' }
          }
        },
        {
          id: 'cancel',
          label: 'Annulla',
          callbackData: 'cancel',
          message: {
            topic: 'cancel',
            knxAi: { confirm: false, sessionId: 'telegram-123' }
          }
        }
      ]
    })
  })

  it('clones the original input message for passthrough output metadata', () => {
    const inputMessage = {
      _msgid: 'message-123',
      topic: 'ask',
      payload: { text: 'Accendi la luce' },
      telegram: { chatId: 456 }
    }
    const clonedInputMessage = cloneKnxAiInputMessage(
      inputMessage,
      message => JSON.parse(JSON.stringify(message))
    )

    expect(clonedInputMessage).to.deep.equal(inputMessage)
    expect(clonedInputMessage).to.not.equal(inputMessage)
    expect(clonedInputMessage.payload).to.not.equal(inputMessage.payload)
  })

  it('contains cloning failures and falls back without throwing', () => {
    const cloneErrors = []
    const inputMessage = { topic: 'ask', payload: 'hello' }
    const clonedInputMessage = cloneKnxAiInputMessage(
      inputMessage,
      () => { throw new Error('cannot clone') },
      error => cloneErrors.push(error.message)
    )

    expect(clonedInputMessage).to.deep.equal(inputMessage)
    expect(cloneErrors).to.deep.equal(['cannot clone'])
  })

  it('contains output and error-reporting failures', () => {
    let reportedError = ''
    const sent = safeKnxAiSend({
      outputs: [null, null, { payload: 'reply' }, null],
      send: () => { throw new Error('send failed') },
      onError: error => { reportedError = error.message }
    })
    expect(sent).to.equal(false)
    expect(reportedError).to.equal('send failed')

    expect(() => safeKnxAiSend({
      outputs: [],
      send: () => { throw new Error('send failed') },
      onError: () => { throw new Error('report failed') }
    })).to.not.throw()
  })

  it('uses the current request language for the confirmation instructions', () => {
    const cases = [
      ['Accendi la luce del soggiorno', 'it', 'CONFERMA'],
      ['Allume la lumière du salon', 'fr', 'CONFIRMER'],
      ['Enciende la luz de la cocina', 'es', 'CONFIRMAR'],
      ['Schalte das Licht im Wohnzimmer ein', 'de', 'BESTÄTIGEN'],
      ['Turn on the living room light', 'en', 'CONFIRM'],
      ['打开客厅的灯', 'zh', '确认']
    ]
    cases.forEach(([question, language, confirmationToken]) => {
      expect(detectKnxAiLanguageFromText(question)).to.equal(language)
      const preview = formatKnxAiCommandPreview({
        commands: [{ destination: '1/2/3', dpt: '1.001', payload: true }],
        copy: getKnxAiConfirmationCopy(resolveKnxAiLanguage({}, 'en', question, ''))
      })
      expect(preview).to.include(confirmationToken)
    })
    expect(resolveKnxAiLanguage({}, 'en', 'Accendi la luce', '')).to.equal('it')
    expect(resolveKnxAiLanguage({ language: 'de' }, 'en', 'Accendi la luce', 'it')).to.equal('de')
  })

  it('provides delayed localized thinking feedback without adding it to the conversation', () => {
    expect(KNX_AI_THINKING_DELAY_MS).to.equal(1200)
    expect(getKnxAiThinkingCopy('en')).to.equal('I’m thinking…')
    expect(getKnxAiThinkingCopy('it')).to.equal('Sto pensando…')
    expect(getKnxAiThinkingCopy('de')).to.equal('Ich denke nach…')
    expect(getKnxAiThinkingCopy('fr')).to.equal('Je réfléchis…')
    expect(getKnxAiThinkingCopy('es')).to.equal('Estoy pensando…')
    expect(getKnxAiThinkingCopy('zh')).to.equal('我正在思考…')

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include("type: 'thinking'")
    expect(runtime).to.include('transient: true')
    expect(runtime).to.include('stopThinkingFeedback()')
    expect(runtime).not.to.match(/rememberConversationTurn\([^)]*thinking/s)
  })

  it('keeps the canvas status limited to incoming requests and thinking', () => {
    expect(getKnxAiRequestStatusLabel('en')).to.equal('Request')
    expect(getKnxAiRequestStatusLabel('it')).to.equal('Richiesta')
    expect(getKnxAiRequestStatusLabel('de')).to.equal('Anfrage')
    expect(getKnxAiRequestStatusLabel('fr')).to.equal('Demande')
    expect(getKnxAiRequestStatusLabel('es')).to.equal('Solicitud')
    expect(getKnxAiRequestStatusLabel('zh')).to.equal('请求')

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include("if (!status || status.scope !== 'conversation') return")
    expect(runtime).to.include("if (type === 'thinking')")
    expect(runtime).to.include("if (type !== 'request') return")
    expect(runtime).to.include('node.setNodeStatus = ({ text } = {}) => {')
    expect(runtime).not.to.include("text: GA + payload")
    expect(runtime).not.to.include("node.status({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })")
  })

  it('localizes every output pin through the node-scoped translation catalog', () => {
    const editor = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.html'), 'utf8')
    const outputKeys = ['summary', 'anomalies', 'assistant', 'knxCommands']

    outputKeys.forEach(key => {
      expect(editor).to.include(`this._('knxUltimateAI.outputs.${key}')`)
      expect(editor).not.to.include(`RED._('knxUltimateAI.outputs.${key}')`)
    })

    ;['en', 'it', 'de', 'fr', 'es', 'zh-CN'].forEach(language => {
      const catalogPath = path.join(__dirname, '..', 'nodes', 'locales', language, 'knxUltimateAI.json')
      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
      outputKeys.forEach(key => {
        expect(catalog.knxUltimateAI.outputs[key]).to.be.a('string').and.not.equal('')
      })
    })
  })

  it('gives local LLM providers a ten-minute minimum request timeout', () => {
    expect(KNX_AI_CLOUD_LLM_TIMEOUT_MIN_MS).to.equal(120000)
    expect(KNX_AI_LOCAL_LLM_TIMEOUT_MIN_MS).to.equal(600000)
    expect(resolveKnxAiLlmTimeoutMs({ provider: 'ollama', configuredTimeoutMs: 120000 })).to.equal(600000)
    expect(resolveKnxAiLlmTimeoutMs({ provider: 'lmstudio', configuredTimeoutMs: 30000 })).to.equal(600000)
    expect(resolveKnxAiLlmTimeoutMs({ provider: 'lmstudio', configuredTimeoutMs: 900000 })).to.equal(900000)
    expect(resolveKnxAiLlmTimeoutMs({ provider: 'anthropic', configuredTimeoutMs: 30000 })).to.equal(120000)
    expect(resolveKnxAiLlmTimeoutMs({ provider: 'openai_compat', configuredTimeoutMs: 180000 })).to.equal(180000)

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).not.to.include('Increase "Timeout ms"')
  })

  it('filters legacy completion-only models from the chat model picker', () => {
    expect(isProbablyChatModelId('gpt-5.4')).to.equal(true)
    expect(isProbablyChatModelId('gpt-4o-mini')).to.equal(true)
    expect(isProbablyChatModelId('gpt-3.5-turbo-instruct')).to.equal(false)
    expect(isProbablyChatModelId('davinci-002')).to.equal(false)
    expect(isProbablyChatModelId('babbage-002')).to.equal(false)
  })

  it('recognizes provider errors caused by a completion-only model', () => {
    expect(isChatCompletionsModelError(
      'This is not a chat model and thus not supported in the v1/chat/completions endpoint.'
    )).to.equal(true)
    expect(isChatCompletionsModelError('Invalid API key')).to.equal(false)
  })

  it('retries without temperature and with max_completion_tokens when required', async () => {
    const bodies = []
    const response = await postOpenAiCompatibleChatWithFallbacks({
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { authorization: 'Bearer test' },
      body: {
        model: 'gpt-5.4',
        temperature: 0.2,
        max_tokens: 600,
        messages: [{ role: 'user', content: 'test' }]
      },
      timeoutMs: 1000,
      model: 'gpt-5.4',
      post: async ({ body }) => {
        bodies.push(Object.assign({}, body))
        if (Object.prototype.hasOwnProperty.call(body, 'temperature')) {
          throw new Error("Unsupported value: 'temperature' does not support 0.2 with this model. Only the default (1) value is supported.")
        }
        if (Object.prototype.hasOwnProperty.call(body, 'max_tokens')) {
          throw new Error("Unsupported parameter: 'max_tokens'")
        }
        return { choices: [{ message: { content: 'ok' } }] }
      }
    })

    expect(isUnsupportedTemperatureError(
      "Unsupported value: 'temperature' does not support 0.2 with this model. Only the default (1) value is supported."
    )).to.equal(true)
    expect(bodies).to.have.length(3)
    expect(bodies[1]).not.to.have.property('temperature')
    expect(bodies[2]).not.to.have.property('max_tokens')
    expect(bodies[2]).to.have.property('max_completion_tokens', 600)
    expect(response.choices[0].message.content).to.equal('ok')
  })

  it('preserves LM Studio error strings instead of reducing them to HTTP 400', () => {
    expect(extractLlmHttpErrorDetail({
      json: { error: 'The requested max_tokens value exceeds the model context length.' },
      text: '{"error":"The requested max_tokens value exceeds the model context length."}'
    })).to.equal('The requested max_tokens value exceeds the model context length.')

    expect(extractLlmHttpErrorDetail({
      json: { error: { message: 'Model is not loaded' } },
      text: '{"error":{"message":"Model is not loaded"}}'
    })).to.equal('Model is not loaded')

    expect(extractLlmHttpErrorDetail({
      json: { raw: 'Bad Request' },
      text: 'Bad Request'
    })).to.equal('Bad Request')
  })

  it('lets LM Studio apply the loaded model token budget', () => {
    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include("const tokenLimitBody = node.llmProvider === 'lmstudio'")
    expect(runtime).to.include('body: Object.assign(tokenLimitBody, schemaBody)')
  })

  it('retries local context-length failures with progressively compact prompts', async () => {
    const originalMessages = [
      { role: 'system', content: `SYSTEM START ${'S'.repeat(10000)} SYSTEM END` },
      { role: 'user', content: `USER START ${'U'.repeat(20000)} CURRENT USER REQUEST: accendi la cucina` }
    ]
    const bodies = []
    const response = await postLocalLlmWithContextFallbacks({
      body: { model: 'gemma', messages: originalMessages },
      enabled: true,
      request: async body => {
        bodies.push(body)
        const chars = body.messages.reduce((total, message) => total + String(message.content || '').length, 0)
        if (chars > 5200) {
          throw new Error('HTTP 400: The number of tokens to keep from the initial prompt is greater than the context length.')
        }
        return { choices: [{ message: { content: 'ok' } }] }
      }
    })

    expect(KNX_AI_LOCAL_CONTEXT_RETRY_CHAR_BUDGETS).to.deep.equal([9000, 5000])
    expect(isLlmContextLengthError('tokens to keep from the initial prompt is greater than the context length')).to.equal(true)
    expect(isLlmContextLengthError('HTTP 401: invalid API key')).to.equal(false)
    expect(bodies).to.have.length(3)
    expect(bodies[0].messages).to.equal(originalMessages)
    const compactChars = bodies[2].messages.reduce((total, message) => total + String(message.content || '').length, 0)
    expect(compactChars).to.be.at.most(5000)
    expect(bodies[2].messages[0].content).to.include('SYSTEM START')
    expect(bodies[2].messages[0].content).to.include('SYSTEM END')
    expect(bodies[2].messages[1].content).to.include('USER START')
    expect(bodies[2].messages[1].content).to.include('CURRENT USER REQUEST: accendi la cucina')
    expect(response.choices[0].message.content).to.equal('ok')
  })

  it('compacts text parts without removing image parts', () => {
    const imagePart = { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,abc' } }
    const messages = compactLlmMessagesForContextRetry({
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: `QUESTION ${'x'.repeat(4000)} QUESTION END` },
          imagePart
        ]
      }],
      maxChars: 1024
    })
    expect(messages[0].content[0].text.length).to.be.at.most(1024)
    expect(messages[0].content[0].text).to.include('QUESTION')
    expect(messages[0].content[0].text).to.include('QUESTION END')
    expect(messages[0].content[1]).to.equal(imagePart)
  })

  it('reads and applies the maximum context declared by an LM Studio model', async () => {
    expect(deriveLmStudioNativeApiUrl(
      'http://localhost:1234/v1/chat/completions',
      '/api/v1/models'
    )).to.equal('http://localhost:1234/api/v1/models')
    expect(deriveLmStudioNativeApiUrl(
      'http://server.local/lmstudio/v1/chat/completions',
      '/api/v1/models/load'
    )).to.equal('http://server.local/lmstudio/api/v1/models/load')

    const catalogJson = {
      models: [
        {
          type: 'llm',
          key: 'google/gemma-3-12b',
          display_name: 'Gemma 3 12B',
          max_context_length: 131072,
          loaded_instances: [{ id: 'google/gemma-3-12b', config: { context_length: 4096 } }]
        },
        {
          type: 'embedding',
          key: 'nomic/embed',
          max_context_length: 2048,
          loaded_instances: []
        }
      ]
    }
    expect(normalizeLmStudioModelCatalog(catalogJson)).to.deep.equal([{
      id: 'google/gemma-3-12b',
      displayName: 'Gemma 3 12B',
      type: 'llm',
      architecture: '',
      maxContextLength: 131072,
      loadedContextLength: 4096,
      loadedInstances: [{ id: 'google/gemma-3-12b', contextLength: 4096 }],
      variants: [],
      selectedVariant: '',
      vision: false
    }])

    const requests = []
    const result = await ensureLmStudioModelMaxContext({
      baseUrl: 'http://localhost:1234/v1/chat/completions',
      model: 'google/gemma-3-12b',
      get: async request => {
        requests.push({ method: 'GET', request })
        return catalogJson
      },
      post: async request => {
        requests.push({ method: 'POST', request })
        if (request.url.endsWith('/models/load')) {
          return {
            status: 'loaded',
            instance_id: 'google/gemma-3-12b',
            load_config: { context_length: request.body.context_length }
          }
        }
        return { instance_id: request.body.instance_id }
      }
    })

    expect(requests.map(item => `${item.method} ${new URL(item.request.url).pathname}`)).to.deep.equal([
      'GET /api/v1/models',
      'POST /api/v1/models/unload',
      'POST /api/v1/models/load'
    ])
    expect(requests[2].request.body).to.deep.include({
      model: 'google/gemma-3-12b',
      context_length: 131072,
      echo_load_config: true
    })
    expect(result).to.deep.include({
      model: 'google/gemma-3-12b',
      contextLength: 131072,
      maxContextLength: 131072,
      changed: true
    })
  })

  it('does not reload an LM Studio model already using its maximum context', async () => {
    let postCount = 0
    const result = await ensureLmStudioModelMaxContext({
      model: 'google/gemma-3-12b',
      get: async () => ({
        models: [{
          type: 'llm',
          key: 'google/gemma-3-12b',
          max_context_length: 32768,
          loaded_instances: [{ id: 'gemma-ready', config: { context_length: 32768 } }]
        }]
      }),
      post: async () => { postCount += 1 }
    })
    expect(postCount).to.equal(0)
    expect(result).to.deep.include({ instanceId: 'gemma-ready', contextLength: 32768, changed: false })
  })

  it('reads the Ollama model maximum context and sends it as num_ctx', async () => {
    const showResponse = {
      capabilities: ['completion', 'vision'],
      model_info: {
        'clip.context_length': 77,
        'gemma3.context_length': 131072,
        'gemma3.embedding_length': 2560
      }
    }
    expect(extractOllamaModelMaxContextLength(showResponse)).to.equal(131072)

    const requests = []
    const result = await resolveOllamaModelMaxContext({
      baseUrl: 'http://localhost:11434/api/chat',
      model: 'gemma3:latest',
      post: async request => {
        requests.push(request)
        return showResponse
      }
    })
    expect(new URL(requests[0].url).pathname).to.equal('/api/show')
    expect(requests[0].body).to.deep.equal({ model: 'gemma3:latest', verbose: false })
    expect(result).to.deep.equal({
      model: 'gemma3:latest',
      maxContextLength: 131072,
      contextLength: 131072
    })

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include('{ num_ctx: Math.round(node.llmContextLength) }')
    expect(runtime).to.include("deriveOllamaApiUrl(tagsUrl, '/api/show')")
  })

  it('uses relevant compact context only for local models with limited windows', () => {
    expect(KNX_AI_MINIMAL_CONTEXT_MAX_TOKENS).to.equal(16384)
    expect(KNX_AI_COMPACT_CONTEXT_MAX_TOKENS).to.equal(65536)
    expect(resolveKnxAiPromptContextMode({ provider: 'ollama', contextLength: 8192 })).to.equal('minimal')
    expect(resolveKnxAiPromptContextMode({ provider: 'lmstudio', contextLength: 32768 })).to.equal('compact')
    expect(resolveKnxAiPromptContextMode({ provider: 'lmstudio', contextLength: 131072 })).to.equal('full')
    expect(resolveKnxAiPromptContextMode({ provider: 'openai_compat', contextLength: 8192 })).to.equal('full')

    const catalog = [
      { ga: '1/1/1', dpt: '1.001', label: 'Luce cucina comando', semantic: { area: 'cucina', kind: 'light' } },
      { ga: '1/1/2', dpt: '1.001', label: 'Luce cucina stato', semantic: { area: 'cucina', kind: 'light' } },
      { ga: '2/1/1', dpt: '9.001', label: 'Temperatura camera', semantic: { area: 'camera', kind: 'temperature' } }
    ]
    const selected = selectKnxAiCatalogForPrompt({
      catalog,
      question: 'Accendi la luce della cucina',
      mode: 'minimal'
    })
    expect(selected.map(item => item.ga)).to.deep.equal(['1/1/1', '1/1/2'])
    expect(selectKnxAiCatalogForPrompt({ catalog, question: 'anything', mode: 'full' })).to.deep.equal(catalog)

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include("promptContextMode === 'minimal'")
    expect(runtime).to.include('{ num_predict: localOutputTokenLimit }')
    expect(runtime).to.include('selectKnxAiCatalogForPrompt({ catalog, question, mode: contextMode })')
  })

  it('recognizes routine language and broadens limited local context with home capabilities', () => {
    expect(isLikelyKnxAiRoutineRequest('Sto uscendo di casa')).to.equal(true)
    expect(isLikelyKnxAiRoutineRequest('Good night, prepare the house')).to.equal(true)
    expect(isLikelyKnxAiRoutineRequest('Accendi la luce del tavolo')).to.equal(false)

    const routineCatalog = Array.from({ length: 35 }, (_, index) => ({
      ga: `0/0/${index + 1}`,
      dpt: '9.001',
      role: 'neutral',
      label: `Unrelated sensor ${index + 1}`,
      semantic: { kind: 'unknown' }
    })).concat([
      { ga: '1/1/1', dpt: '1.001', role: 'command', label: 'Luce cucina comando', semantic: { kind: 'light', area: 'cucina' } },
      { ga: '1/1/2', dpt: '1.001', role: 'status', label: 'Luce cucina stato', semantic: { kind: 'light', area: 'cucina' } },
      { ga: '2/1/2', dpt: '1.019', role: 'status', label: 'Finestra cucina', semantic: { kind: 'window', area: 'cucina' } }
    ])
    const selected = selectKnxAiRoutineCatalogForPrompt({
      catalog: routineCatalog,
      question: 'Sto uscendo di casa',
      mode: 'minimal'
    })
    expect(selected.map(item => item.ga)).to.include.members(['1/1/1', '1/1/2', '2/1/2'])
    expect(selected).to.have.length.at.most(48)

    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include('initialRoutine.active && inspectionCommands.length > 0')
    expect(runtime).to.include('routineInspectionResults = inspection.metadata')
    expect(runtime).to.include("phase: 'plan'")
    expect(runtime).to.include('deferRoutineSpeech = awaitingConfirmation && routine.active')
    expect(KNX_AI_ROUTINE_FEEDBACK_TIMEOUT_MS).to.equal(4000)
  })

  it('keeps the Education-only proactive policy, fourth output, help, and docs aligned in every locale', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    expect(editor).to.include('llmAllowKnxCommands: { value: false }')
    expect(editor).to.include('llmRequireCommandConfirmation: { value: true }')
    expect(editor).to.include('chatAdapterPreset: { value: "none" }')
    expect(editor).not.to.include('proactiveEnabled:')
    expect(editor).not.to.include('proactiveOpenMinutes:')
    expect(editor).not.to.include('homeMemoryMaxKb')
    expect(editor).to.include('maxlength="16000"')
    expect(editor).to.include('KNXAIChatAdapterMappings.js')
    expect(editor).to.include('outputs: 4')
    expect(editor).to.include("case 3: return this._('knxUltimateAI.outputs.knxCommands')")
    const runtime = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include('replyMessage.inputMessage = cloneInputMessage(inputMessage)')
    expect(runtime).to.include('inputMessage: cloneInputMessage(inputMessage)')
    expect(runtime).to.include('node.llmEnabled !== true || !education')
    ;[
      'proactiveEnabled',
      'proactiveRecipient',
      'proactiveOpenMinutes',
      'proactiveCooldownMinutes',
      'proactiveQuietStart',
      'proactiveQuietEnd'
    ].forEach(property => expect(runtime).not.to.include(`config.${property}`))
    expect(runtime).to.include("events: ['GroupValue_Response', 'GroupValue_Write']")
    expect(runtime).to.include('readResults = await Promise.allSettled(readWaiters)')
    expect(runtime).to.include('node.notifyreadrequest = true')
    expect(runtime).to.include('node.notifyresponse = true')
    expect(runtime).to.include('node.notifywrite = true')
    expect(runtime).to.include('node.enablePattern = true')
    expect(runtime).to.include('node.patternMaxLagMs = 1500')
    expect(runtime).to.include('node.patternMinCount = 8')
    expect(runtime).to.include('node.llmIncludeRaw = false')
    expect(runtime).to.include('node.llmIncludeDocsSnippets = true')
    expect(runtime).to.include('maxKb: HOME_MEMORY_DEFAULT_KB')
    expect(runtime).not.to.include('config.homeMemoryMaxKb')
    expect(runtime).not.to.include('highQuality: true')

    const locales = [
      ['en', 'KNX AI.md'],
      ['it', 'it-KNX AI.md'],
      ['de', 'de-KNX AI.md'],
      ['fr', 'fr-KNX AI.md'],
      ['es', 'es-KNX AI.md'],
      ['zh-CN', 'zh-CN-KNX AI.md']
    ]
    locales.forEach(([locale, docName]) => {
      const localeRoot = path.join(root, 'nodes', 'locales', locale)
      const messages = JSON.parse(fs.readFileSync(path.join(localeRoot, 'knxUltimateAI.json'), 'utf8'))
      expect(messages.knxUltimateAI.sections.quickSetup).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections.groupAssistant).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections.groupChatHome).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections.detectedAdapters).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections).not.to.have.property('groupKnxAnalysis')
      expect(messages.knxUltimateAI.sections).not.to.have.property('storage')
      expect(messages.knxUltimateAI.properties.llmAllowKnxCommands).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.llmRequireCommandConfirmation).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties).not.to.have.property('llmIncludeFlowContext')
      expect(messages.knxUltimateAI.sections.chatAdapter).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatAdapterPreset).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatInputCode).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatOutputCode).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.ttsUltimateNodeId).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.selectlists.ttsUltimate.select).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.ttsUltimateHint).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.lmStudioContextAvailable).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.lmStudioContextLoading).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.lmStudioContextConfigured).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.lmStudioContextFailed).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.lmStudioContextCurrentlyLoaded).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections.homeIntelligence).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections).not.to.have.property('homeIntelligenceAdvanced')
      expect(messages.knxUltimateAI.properties).not.to.have.property('homeMemoryMaxKb')
      ;[
        'analysisWindowSec',
        'historyWindowSec',
        'historyStoreToDisk',
        'historyStoreRetentionDays',
        'emitIntervalSec',
        'maxEvents',
        'topN',
        'proactiveEnabled',
        'proactiveRecipient',
        'proactiveOpenMinutes',
        'proactiveCooldownMinutes',
        'proactiveQuietStart',
        'proactiveQuietEnd'
      ].forEach(property => expect(messages.knxUltimateAI.properties).not.to.have.property(property))
      expect(messages.knxUltimateAI.properties.aiEducation).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.outputs.knxCommands).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.detectedAdaptersLoading).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.detectedAdaptersNone).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.messages.detectedAdapterDetected).to.be.a('string').and.not.equal('')

      const helpHtml = fs.readFileSync(path.join(localeRoot, 'knxUltimateAI.html'), 'utf8')
      const helpMatch = helpHtml.match(/<script[^>]*data-help-name="knxUltimateAI"[^>]*>([\s\S]*?)<\/script>/i)
      expect(helpMatch).to.not.equal(null)
      const helpBody = helpMatch[1].trim()
      expect(helpBody).to.include('msg.inputMessage')
      expect(helpBody).to.include('msg.event = "GroupValue_Read"')
      expect(helpBody).to.include('msg.readstatus = true')
      expect(helpBody).to.include('msg.knxAi.readResults')
      expect(helpBody).to.include('msg.knxAi.routine')
      expect(helpBody).to.include('verifiedCount')
      expect(helpBody).to.include('unverifiedCount')
      expect(helpBody).to.include('KNXAIChatAdapterMappings.js')
      expect(helpBody).to.include('node-red-contrib-tts-ultimate')
      expect(helpBody).to.include('msg.topic = "knx_ai_announcement"')
      expect(helpBody).to.include('RedBot / node-red-contrib-chatbot')
      expect(helpBody).to.include('chatbot-telegram-receive')
      expect(helpBody).to.include('chatbot-telegram-send')
      expect(helpBody).to.include('callback_query')
      expect(helpBody).to.include('options.reply_markup')
      expect(helpBody).to.include('proactive_notification')
      expect(helpBody).to.include('home-memory')
      expect(helpBody).not.to.include('proactiveOpenMinutes')
      expect(helpBody).not.to.include('proactiveCooldownMinutes')
      expect(helpBody).not.to.include('homeMemoryMaxKb')
      expect(helpBody).to.include('aiEducation')
      expect(helpBody).not.to.include('knxultimatestorage/knxai/history')
      const docsBody = fs.readFileSync(path.join(root, 'docs', 'wiki', docName), 'utf8')
        .replace(/^---\n[\s\S]*?\n---\n+/, '')
        .trim()
      expect(docsBody).to.equal(helpBody)
    })
  })

  it('ships a ready-to-import example for fresh reads and confirmed writes', () => {
    const examplePath = path.join(
      __dirname,
      '..',
      'examples',
      'KNX AI - Conversational Control with Confirmation.json'
    )
    const flow = JSON.parse(fs.readFileSync(examplePath, 'utf8'))
    const readInject = flow.find(node => node.id === 'inj_knx_ai_control_read')
    const routineInject = flow.find(node => node.id === 'inj_knx_ai_control_routine')
    const aiNode = flow.find(node => node.id === 'node_knx_ai_control')
    const universalNode = flow.find(node => node.id === 'node_knx_ai_control_universal')

    expect(readInject).to.be.an('object')
    expect(readInject.props.find(prop => prop.p === 'payload').v).to.include('temperatura attuale')
    expect(readInject.wires).to.deep.equal([['node_knx_ai_control']])
    expect(routineInject).to.be.an('object')
    expect(routineInject.props.find(prop => prop.p === 'payload').v).to.include('Sto uscendo')
    expect(routineInject.wires).to.deep.equal([['node_knx_ai_control']])
    expect(aiNode.llmAllowKnxCommands).to.equal(true)
    expect(aiNode.llmRequireCommandConfirmation).to.equal(true)
    expect(aiNode.wires[3]).to.include('node_knx_ai_control_universal')
    expect(universalNode.listenallga).to.equal(true)
    expect(universalNode.setTopicType).to.equal('listenAllGA')
  })

  it('ships a direct telegrambot receiver/event to KNX AI to sender example', () => {
    const examplePath = path.join(
      __dirname,
      '..',
      'examples',
      'KNX AI - Telegrambot Direct Chat.json'
    )
    const flow = JSON.parse(fs.readFileSync(examplePath, 'utf8'))
    const receiver = flow.find(node => node.id === 'telegram_receiver_knx_ai')
    const callbackEvent = flow.find(node => node.id === 'telegram_callback_knx_ai')
    const aiNode = flow.find(node => node.id === 'node_knx_ai_telegram')
    const sender = flow.find(node => node.id === 'telegram_sender_knx_ai')

    expect(receiver.type).to.equal('telegram receiver')
    expect(receiver.wires[0]).to.deep.equal(['node_knx_ai_telegram'])
    expect(callbackEvent.type).to.equal('telegram event')
    expect(callbackEvent.event).to.equal('callback_query')
    expect(callbackEvent.autoanswer).to.equal(true)
    expect(callbackEvent.wires[0]).to.deep.equal(['node_knx_ai_telegram'])
    expect(aiNode.wires[2]).to.include('telegram_sender_knx_ai')
    expect(aiNode.wires[3]).to.include('node_knx_ai_telegram_universal')
    expect(aiNode).not.to.have.property('proactiveEnabled')
    expect(aiNode).not.to.have.property('proactiveOpenMinutes')
    expect(aiNode).not.to.have.property('proactiveCooldownMinutes')
    expect(aiNode).not.to.have.property('homeMemoryMaxKb')
    expect(aiNode.aiEducation).to.include('persiana')
    expect(sender.type).to.equal('telegram sender')
  })

  it('keeps the streamlined options in two horizontal tabs', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    expect(editor).to.include('id="knx-ai-tabs"')
    expect(editor).to.include('id="knx-ai-detected-adapters-panel"')
    expect(editor).to.include('url: "knxUltimateAI/adapters"')
    expect(editor).to.include('$("#knx-ai-tabs").tabs({ active: 0 })')
    expect(editor).to.include('.knx-ai-accordion-subsection')
    expect(editor).not.to.include('id="knx-ai-accordion"')
    expect(editor).not.to.include('hue-vertical-tabs')
    expect(editor).not.to.include('.accordion(')
    expect(editor).not.to.include('<details')
    expect(editor).not.to.include('<summary')
    const preservedFieldIds = [
      'node-input-server',
      'node-input-name',
      'node-input-topic',
      'node-input-llmEnabled',
      'node-input-llmAllowKnxCommands',
      'node-input-llmRequireCommandConfirmation',
      'node-input-ttsUltimateNodeId'
    ]
    preservedFieldIds.forEach(id => expect(editor).to.include(`id="${id}"`))

    const template = editor.match(/<script[^>]*data-template-name="knxUltimateAI"[^>]*>([\s\S]*?)<\/script>/i)[1]
    const tabs = template.match(/<div id="knx-ai-tabs">([\s\S]*?)<div id="knx-ai-accordion-source"/i)[1]
    const chatHomeTab = tabs.match(/<div id="knx-ai-tabs-chat-home">([\s\S]*)$/i)[1]
    expect(chatHomeTab.indexOf('id="knx-ai-chat-context-panel"'))
      .to.be.greaterThan(chatHomeTab.indexOf('id="knx-ai-detected-adapters-panel"'))
    const orderedGroups = [
      'knxUltimateAI.sections.groupAssistant',
      'knxUltimateAI.sections.groupChatHome'
    ]
    orderedGroups.reduce((previousIndex, translationKey) => {
      const currentIndex = tabs.indexOf(translationKey)
      expect(currentIndex, translationKey).to.be.greaterThan(previousIndex)
      return currentIndex
    }, -1)
    expect((tabs.match(/href="#knx-ai-tabs-/g) || [])).to.have.length(2)
    expect((tabs.match(/class="knx-ai-accordion-subsection"/g) || [])).to.have.length(4)
    const mountPairs = [
      ['knx-ai-mount-assistant-setup', 'knx-ai-tab-llm-connection'],
      ['knx-ai-mount-assistant-advanced', 'knx-ai-tab-advanced'],
      ['knx-ai-mount-chat-adapter', 'knx-ai-tab-chat-adapter'],
      ['knx-ai-mount-home-intelligence', 'knx-ai-tab-home-intelligence']
    ]
    mountPairs.forEach(([mountId, sectionId]) => {
      expect(editor).to.include(`mountTabSection("#${mountId}", "#${sectionId}")`)
    })
    const quickSetup = template.match(/<div id="knx-ai-tab-llm-connection">([\s\S]*?)<div id="knx-ai-tab-chat-adapter">/i)[1]
    const chatAdapter = template.match(/<div id="knx-ai-tab-chat-adapter">([\s\S]*?)<div id="knx-ai-tab-home-intelligence">/i)[1]
    const homeIntelligence = template.match(/<div id="knx-ai-tab-home-intelligence">([\s\S]*?)<div id="knx-ai-tab-advanced">/i)[1]
    const advancedAi = template.match(/<div id="knx-ai-tab-advanced">([\s\S]*?)<\/div>\s*<\/div>\s*$/i)[1]

    const quickSetupFieldIds = [
      'node-input-llmEnabled',
      'node-input-llmProvider',
      'node-input-llmApiKey',
      'node-input-llmModel',
      'node-input-llmContextLength',
      'node-input-llmAllowKnxCommands',
      'node-input-llmRequireCommandConfirmation'
    ]
    quickSetupFieldIds.forEach(id => expect(quickSetup).to.include(`id="${id}"`))
    expect(quickSetup).to.include('option value="lmstudio"')
    expect(editor).to.include('http://localhost:1234/v1/chat/completions')
    expect(editor).to.include('url: "knxUltimateAI/lmstudio/select-model"')
    expect(editor).to.include('detail.maxContextLength')
    expect(editor).to.include('const configureSelectedLocalModel = () => {')
    expect(editor).to.include('id="knx-ai-local-context-status"')
    expect(quickSetup).not.to.include('id="node-input-llmBaseUrl"')
    expect(chatAdapter).to.include('id="node-input-chatAdapterPreset"')
    expect(chatAdapter).to.include('id="knx-ai-chat-adapter-fields" style="display:none;"')
    expect(chatAdapter).to.include('id="node-input-chatInputCode"')
    expect(chatAdapter).to.include('id="node-input-chatOutputCode"')
    expect(homeIntelligence).not.to.include('id="node-input-homeMemoryMaxKb"')
    expect(homeIntelligence).to.include('id="node-input-aiEducation"')
    expect(chatAdapter).to.include('id="node-input-chatInputCode-editor"')
    expect(chatAdapter).to.include('id="node-input-chatOutputCode-editor"')
    expect(editor).to.include('RED.editor.createEditor({')
    expect(editor).to.include('mode: "ace/mode/nrjavascript"')
    expect(editor).to.include('"editor.background": "#e8f5e9"')
    expect(editor).to.include('"editor.background": "#fffde7"')
    expect(editor).to.include('const hideAdapterMappingFields = () => {')
    expect(editor).to.include('$("#knx-ai-chat-adapter-fields").hide()')
    expect(editor).not.to.include('$("#knx-ai-chat-adapter-fields").toggle(')
    expect(editor).to.include('$button.find("i.fa-refresh").toggleClass("fa-spin", !!busy)')
    expect(editor).not.to.include('class="form-tips"')
    expect(editor).not.to.include('id="knx-ai-models-status"')
    expect(editor).not.to.include('knxUltimateAI.messages.loadedModels')
    expect(editor).not.to.include('": " + models.length')
    expect(editor).not.to.include('id="node-input-llmIncludeFlowContext"')
    expect(advancedAi).to.include('id="node-input-llmBaseUrl"')

    const uniqueFieldIds = [
      'node-input-llmBaseUrl',
      'node-input-llmContextLength',
      'node-input-chatAdapterPreset',
      'node-input-chatInputCode',
      'node-input-chatOutputCode',
      'node-input-ttsUltimateNodeId',
      'node-input-aiEducation'
    ]
    uniqueFieldIds.forEach(id => {
      expect((template.match(new RegExp(`id="${id}"`, 'g')) || [])).to.have.length(1)
    })

    const removedFieldIds = [
      'node-input-notifywrite',
      'node-input-notifyresponse',
      'node-input-notifyreadrequest',
      'node-input-enablePattern',
      'node-input-patternMaxLagMs',
      'node-input-patternMinCount',
      'node-input-rateWindowSec',
      'node-input-maxTelegramPerSecOverall',
      'node-input-maxTelegramPerSecPerGA',
      'node-input-flapWindowSec',
      'node-input-flapMaxChanges',
      'node-input-analysisWindowSec',
      'node-input-historyWindowSec',
      'node-input-historyStoreToDisk',
      'node-input-historyStoreRetentionDays',
      'node-input-emitIntervalSec',
      'node-input-maxEvents',
      'node-input-topN',
      'node-input-llmIncludeFlowContext',
      'node-input-llmSystemPrompt',
      'node-input-llmIncludeRaw',
      'node-input-llmIncludeDocsSnippets',
      'node-input-proactiveEnabled',
      'node-input-proactiveRecipient',
      'node-input-proactiveOpenMinutes',
      'node-input-proactiveQuietStart',
      'node-input-proactiveQuietEnd',
      'node-input-proactiveCooldownMinutes'
    ]
    removedFieldIds.forEach(id => expect(template).not.to.include(`id="${id}"`))
    expect(editor).not.to.include('homeMemoryMaxKb')
    const defaultsBlock = editor.match(/defaults:\s*\{([\s\S]*?)\n\s*\},\n\s*credentials:/)[1]
    expect((defaultsBlock.match(/required:\s*true/g) || [])).to.have.length(1)
    expect(defaultsBlock).to.include('server: { type: "knxUltimate-config", required: true }')
    ;[
      'analysisWindowSec',
      'historyWindowSec',
      'historyStoreToDisk',
      'historyStoreRetentionDays',
      'emitIntervalSec',
      'maxEvents',
      'topN'
    ].forEach(property => expect(defaultsBlock).not.to.include(`${property}:`))
    expect(defaultsBlock).not.to.include('llmIncludeFlowContext:')
  })

  it('uses the hidden traffic-analysis defaults and ignores legacy flow values', () => {
    expect(KNX_AI_TRAFFIC_DEFAULTS).to.deep.equal({
      analysisWindowSec: 120,
      historyWindowSec: 600,
      historyStoreToDisk: true,
      historyStoreRetentionDays: 10,
      emitIntervalSec: 0,
      maxEvents: 5000,
      topN: 12
    })
    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    ;[
      'analysisWindowSec',
      'historyWindowSec',
      'historyStoreToDisk',
      'historyStoreRetentionDays',
      'emitIntervalSec',
      'maxEvents',
      'topN'
    ].forEach(property => expect(runtime).not.to.include(`config.${property}`))
  })

  it('always includes the Node-RED project inventory without a legacy toggle', () => {
    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).not.to.include('config.llmIncludeFlowContext')
    expect(runtime).not.to.include('node.llmIncludeFlowContext')
    expect(runtime).to.include('flowContext = buildKnxUltimateProjectInventory()')
    expect(runtime).to.include('const wantsFunctionNodeSourceContext = shouldIncludeFunctionNodeSourceContext(question)')
  })

  it('summarizes automatically detected camera adapters for the editor', () => {
    const registry = {
      adapters: new Map([
        ['unifi-ultimate', {
          id: 'unifi-ultimate',
          title: 'UniFi Ultimate / Protect',
          packageName: 'node-red-contrib-unifi-ultimate',
          capabilities: ['snapshot', 'smart_events']
        }],
        ['hikvision-ultimate', {
          id: 'hikvision-ultimate',
          title: 'Hikvision Ultimate',
          packageName: 'node-red-contrib-hikvision-ultimate'
        }]
      ]),
      providers: new Map([
        ['unifi-controller-1', { adapterId: 'unifi-ultimate' }]
      ])
    }
    const node = {
      _cameraAdapters: new Map(),
      _cameraProviders: new Map(),
      _cameraCatalog: new Map([
        ['camera-1', { adapterId: 'unifi-ultimate', providerId: 'unifi-controller-1' }],
        ['camera-2', { adapterId: 'unifi-ultimate', providerId: 'unifi-controller-1' }]
      ])
    }
    expect(summarizeDetectedKnxAiCameraAdapters({ registry, node })).to.deep.equal([
      {
        id: 'hikvision-ultimate',
        title: 'Hikvision Ultimate',
        packageName: 'node-red-contrib-hikvision-ultimate',
        capabilities: [],
        providerCount: 0,
        cameraCount: 0
      },
      {
        id: 'unifi-ultimate',
        title: 'UniFi Ultimate / Protect',
        packageName: 'node-red-contrib-unifi-ultimate',
        capabilities: ['snapshot', 'smart_events'],
        providerCount: 1,
        cameraCount: 2
      }
    ])
  })

  it('detects every TTS Ultimate node across flows for the editor selector', () => {
    const configuredNodes = [
      { id: 'flow-upstairs', type: 'tab', label: 'Upstairs' },
      { id: 'flow-ground', type: 'tab', label: 'Ground floor' },
      { id: 'tts-bedroom', type: 'ttsultimate', z: 'flow-upstairs', name: 'Bedroom Sonos', playertype: 'sonos' },
      { id: 'tts-kitchen', type: 'ttsultimate', z: 'flow-ground', name: 'Kitchen Sonos', playertype: 'sonos' },
      { id: 'debug-1', type: 'debug', z: 'flow-ground', name: 'Ignore me' }
    ]
    const summary = summarizeDetectedKnxAiTtsAdapter({
      red: {
        nodes: {
          getType: type => type === 'ttsultimate' ? function TtsUltimate () {} : null,
          eachNode: callback => configuredNodes.forEach(callback)
        }
      },
      selectedNodeId: 'tts-bedroom'
    })

    expect(summary.detected).to.equal(true)
    expect(summary.adapter).to.deep.include({
      id: 'tts-ultimate',
      kind: 'tts',
      packageName: 'node-red-contrib-tts-ultimate',
      nodeCount: 2
    })
    expect(summary.nodes.map(item => item.id)).to.deep.equal(['tts-kitchen', 'tts-bedroom'])
    expect(summary.nodes.find(item => item.id === 'tts-bedroom')).to.include({
      flowName: 'Upstairs',
      playerType: 'sonos',
      selected: true
    })
  })

  it('injects an announcement only into the selected TTS Ultimate node', () => {
    const received = []
    const target = {
      id: 'tts-kitchen',
      type: 'ttsultimate',
      name: 'Kitchen Sonos',
      playertype: 'sonos',
      receive: message => received.push(message)
    }
    const result = dispatchKnxAiTtsUltimateAnnouncement({
      red: { nodes: { getNode: id => id === target.id ? target : null } },
      nodeId: target.id,
      text: 'La cena è pronta.',
      sourceNodeId: 'knx-ai-1',
      sessionId: 'telegram-123'
    })

    expect(result).to.include({ nodeId: target.id, nodeName: target.name, playerType: 'sonos' })
    expect(received).to.deep.equal([{
      topic: 'knx_ai_announcement',
      payload: 'La cena è pronta.',
      knxAi: {
        type: 'tts_announcement',
        sourceNodeId: 'knx-ai-1',
        targetNodeId: target.id,
        sessionId: 'telegram-123'
      }
    }])
    expect(() => dispatchKnxAiTtsUltimateAnnouncement({
      red: { nodes: { getNode: () => ({ type: 'debug', receive: () => {} }) } },
      nodeId: 'not-tts',
      text: 'Do not send'
    })).to.throw('TTS Ultimate node not available')
  })

  it('gives chat the full Assistant context unless the local model requires an adaptive compact view', () => {
    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include('const analysisContext = buildLLMPrompt({')
    expect(runtime).to.include("compact: contextMode === 'full' ? false : contextMode")
    expect(runtime).to.include("if (mode === 'full') return source.slice(0, 600)")
    expect(runtime).not.to.include('const analysisContext = buildLLMPrompt({ question, summary, compact: true })')
  })

  it('preserves saved configuration through an untouched accordion-editor round trip', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    const inlineScript = editor.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1]
    const elements = new Map()

    function jqueryStub (selector) {
      if (!elements.has(selector)) {
        const element = {
          length: selector === '#knxUltimateMatterControllerDeviceVerticalTabs' ? 0 : 1,
          _checked: false,
          _visible: true,
          _value: selector === '#node-input-llmProvider'
            ? 'openai_compat'
            : selector === '#node-input-llmBaseUrl'
              ? 'https://api.openai.com/v1/chat/completions'
              : selector === '#node-input-llmModel'
                ? 'gpt-5.4'
                : '',
          addClass: () => element,
          append: () => element,
          appendTo: () => element,
          appendTo: () => element,
          attr: () => element,
          empty: () => element,
          find: () => element,
          hide: () => {
            element._visible = false
            return element
          },
          is: () => element._checked,
          on: () => element,
          prop: () => element,
          removeClass: () => element,
          show: () => element,
          accordion: () => element,
          tabs: () => element,
          text: () => element,
          toggle: function (visible) {
            element._visible = !!visible
            return element
          },
          val: function (value) {
            if (arguments.length === 0) return element._value
            element._value = value
            return element
          }
        }
        elements.set(selector, element)
      }
      return elements.get(selector)
    }
    jqueryStub.ajax = () => ({
      always: () => {},
      done: () => ({ fail: () => ({ always: () => {} }) })
    })

    let definition
    const context = {
      $: jqueryStub,
      RED: {
        _: key => key,
        editor: {
          createEditor: ({ value }) => {
            let currentValue = String(value || '')
            return {
              destroy: () => {},
              getValue: () => currentValue,
              resize: () => {},
              setOptions: () => {},
              setShowPrintMargin: () => {},
              setValue: valueToSet => { currentValue = String(valueToSet || '') },
              updateOptions: () => {},
              session: {
                setValue: valueToSet => { currentValue = String(valueToSet || '') }
              }
            }
          }
        },
        nodes: { registerType: (name, value) => { definition = value } },
        notify: () => {},
        settings: {},
        sidebar: { show: () => {} },
        validators: { number: () => () => true }
      },
      URLSearchParams,
      console,
      window: { open: () => null }
    }
    vm.runInNewContext(inlineScript, context)

    const savedNode = {
      id: 'knx-ai-1',
      name: 'Assistant',
      topic: 'telegram',
      llmEnabled: true,
      llmProvider: 'openai_compat',
      llmModel: 'gpt-5.4',
      llmAllowKnxCommands: true,
      llmRequireCommandConfirmation: true,
      chatAdapterPreset: 'windkh-telegrambot',
      chatInputCode: 'msg.topic = "ask"; return msg;',
      chatOutputCode: 'return msg;',
      aiEducation: 'La persiana dello studio può restare aperta.'
    }
    const original = JSON.parse(JSON.stringify(savedNode))
    definition.oneditprepare.call(savedNode)
    expect(elements.get('#knx-ai-chat-adapter-fields')._visible).to.equal(false)
    definition.oneditsave.call(savedNode)
    expect(savedNode).to.deep.equal(original)
    definition.oneditprepare.call(savedNode)
    expect(savedNode.chatInputCodeEditor.getValue()).to.equal(original.chatInputCode)
    expect(savedNode.chatOutputCodeEditor.getValue()).to.equal(original.chatOutputCode)
    definition.oneditcancel.call(savedNode)
    expect(savedNode).to.deep.equal(original)

    const noAdapterNode = {
      id: 'knx-ai-no-adapter',
      chatAdapterPreset: 'none',
      chatInputCode: '',
      chatOutputCode: '',
      llmProvider: 'openai_compat',
      llmModel: 'gpt-5.4'
    }
    definition.oneditprepare.call(noAdapterNode)
    expect(elements.get('#knx-ai-chat-adapter-fields')._visible).to.equal(false)
    definition.oneditcancel.call(noAdapterNode)
  })
})

describe('KNX AI persistent chat context', () => {
  it('shares one live memory state across KNX AI node instances', () => {
    const registry = new Map()
    const firstNode = {}
    const secondNode = {}
    bindSharedKnxAiState({
      registry,
      filePath: '/memory/knxai-chat-context.md',
      node: firstNode,
      property: '_memory',
      initialValue: { value: 'first' }
    })
    bindSharedKnxAiState({
      registry,
      filePath: '/memory/knxai-chat-context.md',
      node: secondNode,
      property: '_memory',
      initialValue: { value: 'ignored' }
    })

    secondNode._memory = { value: 'shared' }
    expect(firstNode._memory).to.deep.equal({ value: 'shared' })
    releaseSharedKnxAiState({ registry, filePath: '/memory/knxai-chat-context.md', node: firstNode })
    expect(registry.size).to.equal(1)
    releaseSharedKnxAiState({ registry, filePath: '/memory/knxai-chat-context.md', node: secondNode })
    expect(registry.size).to.equal(0)
  })

  it('uses global memory filenames without a node id', () => {
    const runtime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include("path.join(baseDir, 'knxai', 'memory', 'knxai-home-memory.md')")
    expect(runtime).to.include("path.join(baseDir, 'knxai', 'memory', 'knxai-chat-context.md')")
    expect(runtime).not.to.match(/knxai-(?:home-memory|chat-context)-\$\{node\.id\}/)
  })

  it('recognizes explicit durable instructions in every supported language', () => {
    const instructions = [
      'Remember not to use the term unknown in replies.',
      'Ricordati di non usare il termine unknown nelle risposte.',
      'Merk dir, in Antworten nie den Begriff unknown zu verwenden.',
      'Souviens-toi de ne pas employer le terme unknown dans tes réponses.',
      'Recuerda no usar el término unknown en las respuestas.',
      '请记住不要在回答中使用 unknown 这个词。'
    ]
    instructions.forEach(instruction => {
      expect(extractExplicitKnxAiChatInstruction(instruction)).to.equal(instruction)
    })
    expect(extractExplicitKnxAiChatInstruction('Do you remember yesterday?')).to.equal('')
  })

  it('round-trips each session through the persistent Markdown context', () => {
    let context = createEmptyKnxAiChatContext()
    context = addKnxAiChatTurn(context, {
      sessionId: 'telegram-123',
      question: 'Ricordati di non usare il termine unknown nelle risposte.',
      reply: 'Va bene.'
    })
    context = addKnxAiChatTurn(context, {
      sessionId: 'telegram-123',
      question: 'Come sta la casa?',
      reply: 'Tutto regolare.'
    })
    const rendered = buildKnxAiChatContextMarkdown({ context })
    const restored = parseKnxAiChatContextMarkdown(rendered.markdown)
    const session = getKnxAiChatSession(restored, 'telegram-123')

    expect(session.turns).to.have.length(2)
    expect(session.instructions[0].text).to.equal('Ricordati di non usare il termine unknown nelle risposte.')
    const prompt = buildKnxAiChatPromptContext({ context: restored, sessionId: 'telegram-123' })
    expect(prompt).to.include('PERSISTENT CHAT INSTRUCTIONS AND PREFERENCES')
    expect(prompt).to.include('non usare il termine unknown')
    expect(prompt).to.include('RECENT CONVERSATION')
    expect(conversationMapFromKnxAiChatContext(restored).get('telegram-123')).to.have.length(2)
  })

  it('keeps sessions isolated and clears only the selected chat', () => {
    let context = createEmptyKnxAiChatContext()
    context = addKnxAiChatTurn(context, {
      sessionId: 'one',
      question: 'Remember to answer briefly.',
      reply: 'Understood.'
    })
    context = addKnxAiChatTurn(context, {
      sessionId: 'two',
      question: 'Remember to answer in Italian.',
      reply: 'Va bene.'
    })
    context = clearKnxAiChatSession(context, 'one')

    expect(getKnxAiChatSession(context, 'one').turns).to.deep.equal([])
    expect(getKnxAiChatSession(context, 'one').instructions).to.deep.equal([])
    expect(getKnxAiChatSession(context, 'two').instructions[0].text).to.include('Italian')
  })

  it('bounds turns, sessions, and the on-disk file', () => {
    let context = createEmptyKnxAiChatContext()
    for (let sessionIndex = 0; sessionIndex < CHAT_CONTEXT_MAX_SESSIONS + 10; sessionIndex += 1) {
      for (let turnIndex = 0; turnIndex < CHAT_CONTEXT_MAX_TURNS_PER_SESSION + 5; turnIndex += 1) {
        context = addKnxAiChatTurn(context, {
          sessionId: `session-${sessionIndex}`,
          question: `Question ${turnIndex} ${'q'.repeat(200)}`,
          reply: `Reply ${turnIndex} ${'r'.repeat(400)}`
        })
      }
    }
    const rendered = buildKnxAiChatContextMarkdown({ context, maxBytes: 64 * 1024 })
    const restored = parseKnxAiChatContextMarkdown(rendered.markdown)

    expect(rendered.bytes).to.be.at.most(64 * 1024)
    expect(restored.sessions.length).to.be.at.most(CHAT_CONTEXT_MAX_SESSIONS)
    restored.sessions.forEach(session => {
      expect(session.turns.length).to.be.at.most(CHAT_CONTEXT_MAX_TURNS_PER_SESSION)
    })
  })
})

describe('KNX AI camera adapters', () => {
  afterEach(() => {
    delete globalThis[KNX_AI_CAMERA_REGISTRY_KEY]
  })

  it('discovers any installed adapter and provider through the shared runtime registry', () => {
    const registry = getKnxAiCameraAdapterRegistry()
    const changes = []
    const unsubscribe = registry.subscribe(change => changes.push(change.type))
    const provider = { id: 'hikvision-ultimate:controller-1', adapterId: 'hikvision-ultimate' }
    registry.registerAdapter({ id: 'hikvision-ultimate', title: 'Hikvision Ultimate', capabilities: ['camera_catalog', 'snapshot'] })
    registry.registerProvider(provider)

    expect(registry.adapters.get('hikvision-ultimate').title).to.equal('Hikvision Ultimate')
    expect(registry.providers.get(provider.id)).to.equal(provider)
    expect(changes).to.deep.equal(['adapter_registered', 'provider_registered'])
    registry.unregisterProvider(provider.id)
    unsubscribe()
    expect(changes).to.deep.equal(['adapter_registered', 'provider_registered', 'provider_unregistered'])
  })

  it('resolves cameras and normalizes snapshot and line-watch actions without vendor-specific logic', () => {
    const cameras = [
      { id: 'controller-1:front', name: 'Ingresso principale', aliases: ['Porta ingresso'], state: 'DISCONNECTED', online: false, objectTypes: ['person', 'animal'], lines: [{ id: 'line-1', name: 'Vialetto' }] },
      { id: 'controller-1:garden', name: 'Giardino', aliases: ['Esterno'] }
    ]
    const frontCamera = resolveKnxAiCamera({ target: 'Porta ingresso', cameras }).camera
    expect(frontCamera).to.include({
      id: 'controller-1:front',
      state: 'DISCONNECTED',
      online: false
    })
    expect(frontCamera.objectTypes).to.deep.equal(['person', 'animal'])
    expect(resolveKnxAiCamera({ target: 'giard', cameras }).camera.id).to.equal('controller-1:garden')

    const actions = normalizeKnxAiCameraActions({
      cameras,
      actions: [
        { type: 'snapshot', camera: 'Porta ingresso' },
        { type: 'watch', camera: 'Ingresso principale', eventType: 'line crossing', scopeName: 'Vialetto', objectTypes: ['Person'] },
        { type: 'watch', camera: 'Giardino', eventType: 'motion', objectTypes: ['animale'] }
      ]
    })
    expect(actions[0]).to.include({ type: 'snapshot', cameraId: 'controller-1:front', cameraName: 'Ingresso principale' })
    expect(actions[1]).to.include({ type: 'watch', eventType: 'smartDetectLine', scopeId: 'line-1', scopeName: 'Vialetto', unresolvedScope: false })
    expect(actions[1].objectTypes).to.deep.equal(['person'])
    expect(actions[2]).to.include({ type: 'watch', eventType: 'smartDetect' })
    expect(actions[2].objectTypes).to.deep.equal(['animal'])
    expect(normalizeKnxAiCameraActions({
      cameras,
      actions: [{ type: 'snapshot', camera: 'Telecamera inventata' }]
    })[0]).to.include({ unresolved: true, unresolvedTarget: 'Telecamera inventata' })
  })

  it('matches active camera events to the exact persistent rule', () => {
    const event = normalizeKnxAiCameraEvent({
      cameraId: 'controller-1:front',
      cameraName: 'Ingresso principale',
      eventType: 'smartDetectLine',
      scopeId: 'line-1',
      scopeName: 'Vialetto',
      objectTypes: ['person'],
      active: true
    })
    expect(cameraWatchMatchesEvent({
      cameraId: 'controller-1:front',
      eventType: 'smartDetectLine',
      scopeName: 'Vialetto',
      objectTypes: ['person']
    }, event)).to.equal(true)
    expect(cameraWatchMatchesEvent({ cameraId: 'controller-1:front', eventType: 'smartDetectZone' }, event)).to.equal(false)
    expect(cameraWatchMatchesEvent({
      cameraId: 'controller-1:front',
      eventType: 'smartDetect',
      objectTypes: ['persona']
    }, event)).to.equal(true)
    expect(cameraWatchMatchesEvent({
      cameraId: 'controller-1:front',
      eventType: 'motion',
      objectTypes: ['person']
    }, event)).to.equal(true)
    expect(cameraWatchMatchesEvent({
      cameraId: 'controller-1:front',
      eventType: 'smartDetect',
      objectTypes: ['animal']
    }, event)).to.equal(false)
    expect(buildKnxAiCameraNotificationText({ language: 'it', event }))
      .to.equal('La telecamera Ingresso principale ha rilevato un attraversamento di linea (Vialetto — person).')
  })

  it('persists camera watches in the shared chat context file', () => {
    const context = addKnxAiCameraWatch(createEmptyKnxAiChatContext(), {
      sessionId: 'telegram-123',
      watch: {
        id: 'watch-1',
        cameraId: 'controller-1:front',
        cameraName: 'Ingresso principale',
        eventType: 'smartDetectZone',
        scopeName: 'Zona porta',
        objectTypes: ['person'],
        cooldownSeconds: 90,
        sendSnapshot: true,
        language: 'it'
      }
    })
    const rendered = buildKnxAiChatContextMarkdown({ context })
    const restored = parseKnxAiChatContextMarkdown(rendered.markdown)
    const watches = listAllKnxAiCameraWatches(restored)
    expect(watches).to.have.length(1)
    expect(watches[0]).to.include({ sessionId: 'telegram-123', cameraName: 'Ingresso principale', eventType: 'smartDetectZone', scopeName: 'Zona porta', cooldownSeconds: 90, sendSnapshot: true })
    expect(buildKnxAiChatPromptContext({ context: restored, sessionId: 'telegram-123' })).to.include('ACTIVE CAMERA WATCHES')
  })

  it('accepts supported binary images and rejects oversized snapshots', () => {
    expect(normalizeKnxAiCameraImage({ data: Buffer.from([1, 2, 3]), mediaType: 'image/jpeg' }))
      .to.include({ mediaType: 'image/jpeg', bytes: 3 })
    expect(() => normalizeKnxAiCameraImage({ data: Buffer.alloc(KNX_AI_CAMERA_IMAGE_MAX_BYTES + 1), mediaType: 'image/jpeg' }))
      .to.throw('exceeds')
  })
})
