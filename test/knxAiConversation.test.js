const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const {
  buildKnxAiConfirmationRequest,
  buildKnxAiUniversalMessage,
  classifyKnxAiConfirmation,
  cloneKnxAiInputMessage,
  compileKnxAiChatAdapter,
  coerceKnxAiCommandPayload,
  detectKnxAiLanguageFromText,
  executeKnxAiChatAdapter,
  extractKnxAiQuestion,
  formatKnxAiCommandPreview,
  formatKnxAiReadResults,
  getKnxAiConfirmationCopy,
  isChatCompletionsModelError,
  isProbablyChatModelId,
  isUnsupportedTemperatureError,
  normalizeKnxAiCommandCandidates,
  parseKnxAiConversationResponse,
  postOpenAiCompatibleChatWithFallbacks,
  resolveKnxAiLanguage,
  resolveKnxAiOperationEvent,
  resolveKnxAiSessionId,
  safeKnxAiSend
} = require('../nodes/knxUltimateAI').__test
const chatAdapterMappings = require('../resources/KNXAIChatAdapterMappings')

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
    const parsed = parseKnxAiConversationResponse('```json\n{"reply":"Accendo la luce.","language":"it","commands":[{"destination":"1/2/3","payload":true}]}\n```')
    expect(parsed.reply).to.equal('Accendo la luce.')
    expect(parsed.language).to.equal('it')
    expect(parsed.commands).to.have.length(1)
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

  it('keeps the opt-in editor field, fourth output, help, and docs aligned in every locale', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    expect(editor).to.include('llmAllowKnxCommands: { value: false }')
    expect(editor).to.include('llmRequireCommandConfirmation: { value: true }')
    expect(editor).to.include('chatAdapterPreset: { value: "none" }')
    expect(editor).to.include('KNXAIChatAdapterMappings.js')
    expect(editor).to.include('outputs: 4')
    expect(editor).to.include("case 3: return RED._('knxUltimateAI.outputs.knxCommands')")
    const runtime = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(runtime).to.include('replyMessage.inputMessage = cloneInputMessage(inputMessage)')
    expect(runtime).to.include('inputMessage: cloneInputMessage(inputMessage)')
    expect(runtime).to.include("events: ['GroupValue_Response', 'GroupValue_Write']")
    expect(runtime).to.include('readResults = await Promise.allSettled(readWaiters)')

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
      expect(messages.knxUltimateAI.properties.llmAllowKnxCommands).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.llmRequireCommandConfirmation).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.sections.chatAdapter).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatAdapterPreset).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatInputCode).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.properties.chatOutputCode).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateAI.outputs.knxCommands).to.be.a('string').and.not.equal('')

      const helpHtml = fs.readFileSync(path.join(localeRoot, 'knxUltimateAI.html'), 'utf8')
      const helpMatch = helpHtml.match(/<script[^>]*data-help-name="knxUltimateAI"[^>]*>([\s\S]*?)<\/script>/i)
      expect(helpMatch).to.not.equal(null)
      const helpBody = helpMatch[1].trim()
      expect(helpBody).to.include('msg.inputMessage')
      expect(helpBody).to.include('msg.event = "GroupValue_Read"')
      expect(helpBody).to.include('msg.readstatus = true')
      expect(helpBody).to.include('msg.knxAi.readResults')
      expect(helpBody).to.include('KNXAIChatAdapterMappings.js')
      expect(helpBody).to.include('callback_query')
      expect(helpBody).to.include('options.reply_markup')
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
    const aiNode = flow.find(node => node.id === 'node_knx_ai_control')
    const universalNode = flow.find(node => node.id === 'node_knx_ai_control_universal')

    expect(readInject).to.be.an('object')
    expect(readInject.props.find(prop => prop.p === 'payload').v).to.include('temperatura attuale')
    expect(readInject.wires).to.deep.equal([['node_knx_ai_control']])
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
    expect(sender.type).to.equal('telegram sender')
  })

  it('uses the shared Matter-style vertical tabs without changing field ids', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    const matterEditor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateMatterBridge.html'), 'utf8')
    const sharedSelectors = [
      '.hue-vertical-tabs.ui-tabs.ui-widget.ui-widget-content.ui-corner-all',
      '.hue-vertical-tabs > ul.ui-tabs-nav',
      '.hue-vertical-tabs > ul.ui-tabs-nav li.ui-tabs-active a::after',
      '.hue-vertical-tabs .ui-tabs-panel'
    ]

    sharedSelectors.forEach(selector => {
      expect(editor).to.include(selector)
      expect(matterEditor).to.include(selector)
    })
    expect(editor).to.include('id="knx-ai-tabs"')
    expect(editor).to.include('$tabs.addClass("hue-vertical-tabs")')
    expect(editor).to.include('$tabs.tabs()')
    expect(editor).not.to.include('id="knx-ai-accordion"')
    const preservedFieldIds = [
      'node-input-server',
      'node-input-name',
      'node-input-topic',
      'node-input-notifywrite',
      'node-input-historyWindowSec',
      'node-input-llmEnabled',
      'node-input-llmAllowKnxCommands',
      'node-input-llmRequireCommandConfirmation'
    ]
    preservedFieldIds.forEach(id => expect(editor).to.include(`id="${id}"`))

    const template = editor.match(/<script[^>]*data-template-name="knxUltimateAI"[^>]*>([\s\S]*?)<\/script>/i)[1]
    const quickSetup = template.match(/<div id="knx-ai-tab-llm-connection">([\s\S]*?)<div id="knx-ai-tab-chat-adapter">/i)[1]
    const chatAdapter = template.match(/<div id="knx-ai-tab-chat-adapter">([\s\S]*?)<div id="knx-ai-tab-llm-context">/i)[1]
    const aiContext = template.match(/<div id="knx-ai-tab-llm-context">([\s\S]*?)<div id="knx-ai-tab-advanced">/i)[1]
    const advancedAi = template.match(/<div id="knx-ai-tab-advanced">([\s\S]*?)<\/div>\s*<\/div>\s*$/i)[1]

    const quickSetupFieldIds = [
      'node-input-llmEnabled',
      'node-input-llmProvider',
      'node-input-llmApiKey',
      'node-input-llmModel',
      'node-input-llmAllowKnxCommands',
      'node-input-llmRequireCommandConfirmation'
    ]
    quickSetupFieldIds.forEach(id => expect(quickSetup).to.include(`id="${id}"`))
    expect(quickSetup).not.to.include('id="node-input-llmBaseUrl"')
    expect(chatAdapter).to.include('id="node-input-chatAdapterPreset"')
    expect(chatAdapter).to.include('id="node-input-chatInputCode"')
    expect(chatAdapter).to.include('id="node-input-chatOutputCode"')
    expect(editor).to.include('width: 100% !important;')
    expect(editor).to.include('max-width: none !important;')
    expect(aiContext).to.include('id="node-input-llmSystemPrompt"')
    expect(advancedAi).to.include('id="node-input-llmBaseUrl"')

    const uniqueFieldIds = [
      'node-input-analysisWindowSec',
      'node-input-maxEvents',
      'node-input-topN',
      'node-input-patternMaxLagMs',
      'node-input-patternMinCount',
      'node-input-rateWindowSec',
      'node-input-maxTelegramPerSecOverall',
      'node-input-maxTelegramPerSecPerGA',
      'node-input-flapWindowSec',
      'node-input-flapMaxChanges',
      'node-input-llmSystemPrompt',
      'node-input-llmBaseUrl',
      'node-input-chatAdapterPreset',
      'node-input-chatInputCode',
      'node-input-chatOutputCode'
    ]
    uniqueFieldIds.forEach(id => {
      expect((template.match(new RegExp(`id="${id}"`, 'g')) || [])).to.have.length(1)
    })
  })

  it('preserves saved configuration through an untouched tabbed-editor round trip', () => {
    const root = path.join(__dirname, '..')
    const editor = fs.readFileSync(path.join(root, 'nodes', 'knxUltimateAI.html'), 'utf8')
    const inlineScript = editor.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1]
    const elements = new Map()

    function jqueryStub (selector) {
      if (!elements.has(selector)) {
        const element = {
          length: selector === '#knxUltimateMatterControllerDeviceVerticalTabs' ? 0 : 1,
          _checked: false,
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
          hide: () => element,
          is: () => element._checked,
          on: () => element,
          prop: () => element,
          removeClass: () => element,
          show: () => element,
          tabs: () => element,
          text: () => element,
          toggle: () => element,
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
      analysisWindowSec: 240,
      historyWindowSec: 1200
    }
    const original = JSON.parse(JSON.stringify(savedNode))
    definition.oneditprepare.call(savedNode)
    definition.oneditsave.call(savedNode)
    expect(savedNode).to.deep.equal(original)
    definition.oneditprepare.call(savedNode)
    expect(savedNode).to.deep.equal(original)
    definition.oneditcancel.call(savedNode)
  })
})
