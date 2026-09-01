const { expect } = require('chai')

const {
  CEREBRUM_HABIT_MIN_CONFIDENCE,
  CEREBRUM_HABIT_MIN_OBSERVATION_SPAN_DAYS,
  CEREBRUM_HABIT_MIN_OBSERVED_DAYS,
  CEREBRUM_HABIT_MIN_SAMPLES,
  HOME_MEMORY_DEFAULT_KB,
  HOME_MEMORY_MAX_KB,
  addBoundedKnxAiNotification,
  addBoundedKnxAiObservation,
  applyKnxAiHabitDecision,
  buildKnxAiHomeMemoryMarkdown,
  buildKnxAiProactiveFallback,
  buildKnxAiStateMemoryContext,
  clampHomeMemoryKb,
  classifyKnxAiOpenState,
  createEmptyKnxAiHomeMemory,
  findKnxAiHabitCandidates,
  findKnxAiHabitPredictions,
  inferKnxAiHomeSemantic,
  isKnxAiQuietTime,
  parseKnxAiHomeMemoryMarkdown,
  parseKnxAiHomeMemoryMarkdownStrict,
  updateKnxAiCurrentState,
  updateKnxAiCoverHabit,
  updateKnxAiTemporalHabit
} = require('../nodes/utils/knxAiHomeMemory')

describe('KNX AI bounded home intelligence memory', () => {
  it('defaults and clamps the home-memory file to 5 MB', () => {
    expect(HOME_MEMORY_DEFAULT_KB).to.equal(5120)
    expect(HOME_MEMORY_MAX_KB).to.equal(5120)
    expect(clampHomeMemoryKb(undefined)).to.equal(5120)
    expect(clampHomeMemoryKb(9000)).to.equal(5120)
  })

  it('recognizes cover and room labels in every supported language', () => {
    const cases = [
      ['Persiana soggiorno stato', 'cover', 'living_room'],
      ['Living room roller blind status', 'cover', 'living_room'],
      ['Rollladen Wohnzimmer Status', 'cover', 'living_room'],
      ['Volet du salon état', 'cover', 'living_room'],
      ['Persiana sala de estar estado', 'cover', 'living_room'],
      ['客厅卷帘状态', 'cover', 'living_room']
    ]

    cases.forEach(([label, kind, area]) => {
      const semantic = inferKnxAiHomeSemantic({
        label,
        dpt: '5.001',
        role: 'status'
      })
      expect(semantic.kind, label).to.equal(kind)
      expect(semantic.area, label).to.equal(area)
      expect(semantic.confidence, label).to.be.greaterThan(0.9)
    })
  })

  it('keeps the Markdown file below the configured hard limit without mixing in configured Education', () => {
    let memory = createEmptyKnxAiHomeMemory()
    for (let index = 0; index < 500; index++) {
      memory = addBoundedKnxAiObservation(memory, {
        at: new Date(2026, 6, 30, 10, index % 60).toISOString(),
        ga: `1/2/${index}`,
        label: `Very long observation label ${index} ${'x'.repeat(300)}`,
        event: `state ${index} ${'y'.repeat(300)}`
      })
      memory = addBoundedKnxAiNotification(memory, {
        at: new Date(2026, 6, 30, 11, index % 60).toISOString(),
        ga: `1/2/${index}`,
        label: `Notification ${index} ${'z'.repeat(300)}`,
        reason: 'open_too_long'
      })
    }
    memory.semanticObjects = Array.from({ length: 500 }, (_, index) => ({
      ga: `2/3/${index}`,
      dpt: '5.001',
      kind: 'cover',
      area: 'living_room',
      role: 'status',
      confidence: 0.96,
      label: `Cover ${index} ${'s'.repeat(300)}`
    }))
    const education = 'NON avvisarmi durante la notte. Questa sezione appartiene solo all’utente.'
    const rendered = buildKnxAiHomeMemoryMarkdown({
      memory,
      education,
      maxKb: 64
    })

    expect(rendered.bytes).to.be.at.most(64 * 1024)
    expect(rendered.markdown).not.to.include(education)
    expect(rendered.markdown).to.include('AI Education — configured on the KNX AI node')
    expect(rendered.markdown).to.include('not stored in learned memory')
    const restored = parseKnxAiHomeMemoryMarkdown(rendered.markdown)
    expect(restored.observations.length).to.be.at.most(120)
    expect(restored.notifications.length).to.be.at.most(80)
    expect(restored.semanticObjects.length).to.be.at.most(300)
  })

  it('does not let multibyte Education consume the learned-memory byte budget', () => {
    const education = '🏠'.repeat(16000)
    const rendered = buildKnxAiHomeMemoryMarkdown({
      memory: createEmptyKnxAiHomeMemory(),
      education,
      maxKb: 64
    })

    expect(rendered.bytes).to.be.at.most(64 * 1024)
    expect(rendered.markdown).not.to.include('🏠')
    expect(rendered).not.to.have.property('education')
    expect(education).to.have.length(32000)
  })

  it('learns only aggregate cover duration habits with bounded samples', () => {
    let memory = createEmptyKnxAiHomeMemory()
    memory = updateKnxAiCoverHabit(memory, {
      ga: '1/2/3',
      label: 'Persiana soggiorno',
      area: 'living_room',
      durationMinutes: 60
    })
    memory = updateKnxAiCoverHabit(memory, {
      ga: '1/2/3',
      label: 'Persiana soggiorno',
      area: 'living_room',
      durationMinutes: 120
    })

    expect(memory.habits).to.have.length(1)
    expect(memory.habits[0]).to.include({
      type: 'cover_open_duration',
      samples: 2,
      averageMinutes: 90,
      lastMinutes: 120
    })
  })

  it('recognizes reliable open states but ignores command objects', () => {
    const semantic = { kind: 'cover', role: 'status', dpt: '5.001' }
    expect(classifyKnxAiOpenState({ semantic, dpt: '5.001', payload: 0 })).to.include({ open: true })
    expect(classifyKnxAiOpenState({ semantic, dpt: '5.001', payload: 100 })).to.include({ open: false })

    const binary = classifyKnxAiOpenState({
      semantic: { kind: 'window', role: 'status', dpt: '1.009' },
      dpt: '1.009',
      payload: true,
      valueOptions: [
        { value: 'false', label: 'Closed' },
        { value: 'true', label: 'Open' }
      ]
    })
    expect(binary).to.include({ open: true, reason: 'explicit_open_value' })
    expect(classifyKnxAiOpenState({
      semantic: { kind: 'cover', role: 'command', dpt: '5.001' },
      dpt: '5.001',
      payload: 0
    })).to.equal(null)
  })

  it('honours quiet hours across midnight', () => {
    expect(isKnxAiQuietTime({
      date: new Date(2026, 6, 30, 23, 30),
      start: '23:00',
      end: '07:00'
    })).to.equal(true)
    expect(isKnxAiQuietTime({
      date: new Date(2026, 6, 30, 6, 30),
      start: '23:00',
      end: '07:00'
    })).to.equal(true)
    expect(isKnxAiQuietTime({
      date: new Date(2026, 6, 30, 12, 0),
      start: '23:00',
      end: '07:00'
    })).to.equal(false)
  })

  it('provides proactive fallback text in every supported language', () => {
    const languages = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    languages.forEach(language => {
      const message = buildKnxAiProactiveFallback({
        language,
        label: 'Living room cover',
        durationMinutes: 125
      })
      expect(message).to.be.a('string').and.not.equal('')
      expect(message).to.include('2 h 5 min')
    })
  })

  it('learns repeated temporal state patterns but predicts only after occupant confirmation', () => {
    let memory = createEmptyKnxAiHomeMemory()
    ;[3, 4, 5, 6, 7, 10].forEach(day => {
      memory = updateKnxAiTemporalHabit(memory, {
        source: 'knx',
        objectId: '1/1/1',
        label: 'Kitchen light',
        area: 'kitchen',
        kind: 'light',
        value: true,
        event: 'GroupValue_Write',
        at: new Date(2026, 7, day, 7, 28 + (day % 5)).toISOString()
      })
    })

    expect(findKnxAiHabitCandidates(memory)).to.deep.equal([])

    ;[17, 18].forEach(day => {
      memory = updateKnxAiTemporalHabit(memory, {
        source: 'knx',
        objectId: '1/1/1',
        label: 'Kitchen light',
        area: 'kitchen',
        kind: 'light',
        value: true,
        event: 'GroupValue_Write',
        at: new Date(2026, 7, day, 7, 28 + (day % 5)).toISOString()
      })
    })

    const habit = memory.habits.find(item => item.type === 'temporal_state_pattern')
    expect(habit).to.include({
      source: 'knx',
      objectId: '1/1/1',
      value: 'true',
      dayType: 'weekday',
      samples: 8,
      observationDays: 8,
      observationSpanDays: 15
    })
    expect(habit.confidence).to.be.greaterThan(CEREBRUM_HABIT_MIN_CONFIDENCE)
    expect(habit.status).to.equal('learning')
    expect(findKnxAiHabitCandidates(memory)).to.have.length(1)
    expect(findKnxAiHabitPredictions(memory, {
      date: new Date(2026, 7, 11, 7, 30),
      windowMinutes: 20
    })).to.deep.equal([])

    memory = applyKnxAiHabitDecision(memory, {
      habitId: habit.id,
      operation: 'modify',
      userMessage: 'Sì, ma alle 07:45 nei giorni feriali.',
      userOverride: { timeMinute: 465, dayType: 'weekday', note: 'Preferisco le 07:45.' },
      sessionId: 'telegram:42'
    })
    expect(memory.habits[0].status).to.equal('confirmed')
    expect(memory.habitDecisions).to.have.length(1)
    expect(findKnxAiHabitPredictions(memory, {
      date: new Date(2026, 7, 11, 7, 45),
      windowMinutes: 20
    })).to.have.length(1)
    expect(findKnxAiHabitPredictions(memory, {
      date: new Date(2026, 7, 11, 12, 0),
      windowMinutes: 20
    })).to.deep.equal([])

    memory.habits[0].userOverride = { timeMinute: 10, dayType: 'everyday', value: '', note: 'After midnight' }
    expect(findKnxAiHabitPredictions(memory, {
      date: new Date(2026, 7, 11, 23, 50),
      windowMinutes: 30
    })[0].minutesUntil).to.equal(20)
  })

  it('does not mistake repeated events on one day for a mature habit', () => {
    let memory = createEmptyKnxAiHomeMemory()
    for (let index = 0; index < 12; index++) {
      memory = updateKnxAiTemporalHabit(memory, {
        source: 'home-assistant',
        objectId: 'light.kitchen',
        label: 'Kitchen light',
        area: 'kitchen',
        kind: 'light',
        value: true,
        event: 'state_changed',
        at: new Date(2026, 7, 3, 7, 10 + index).toISOString()
      })
    }

    const habit = memory.habits[0]
    expect(CEREBRUM_HABIT_MIN_SAMPLES).to.equal(8)
    expect(CEREBRUM_HABIT_MIN_OBSERVED_DAYS).to.equal(6)
    expect(CEREBRUM_HABIT_MIN_OBSERVATION_SPAN_DAYS).to.equal(14)
    expect(habit.samples).to.equal(12)
    expect(habit.observationDays).to.equal(1)
    expect(habit.observationSpanDays).to.equal(0)
    expect(habit.confidence).to.be.lessThan(0.2)
    expect(findKnxAiHabitCandidates(memory)).to.deep.equal([])
  })

  it('stores adaptive current states and returns a bounded relevance-ranked context', () => {
    let memory = createEmptyKnxAiHomeMemory()
    memory = updateKnxAiCurrentState(memory, {
      source: 'home-assistant',
      objectId: 'light.kitchen',
      label: 'Kitchen light',
      area: 'kitchen',
      kind: 'light',
      value: 'off',
      at: '2026-08-11T07:00:00.000Z',
      verified: true
    })
    memory = updateKnxAiCurrentState(memory, {
      source: 'knx',
      objectId: '1/2/3',
      label: 'Bedroom cover',
      area: 'bedroom',
      kind: 'cover',
      value: 100,
      at: '2026-08-11T07:01:00.000Z',
      verified: true
    })

    expect(memory.states).to.have.length(2)
    expect(memory.states.every(item => ['hot', 'warm', 'cold'].includes(item.tier))).to.equal(true)
    const context = buildKnxAiStateMemoryContext({
      memory,
      question: 'Is the kitchen light on?',
      maxStates: 1,
      maxChars: 1000,
      now: Date.parse('2026-08-11T07:02:00.000Z')
    })
    expect(context).to.include('home-assistant:light.kitchen')
    expect(context).not.to.include('knx:1/2/3')
  })

  it('round-trips occupant decisions through the editable authoritative JSON block', () => {
    let memory = createEmptyKnxAiHomeMemory()
    memory = updateKnxAiTemporalHabit(memory, {
      source: 'knx',
      objectId: '1/1/9',
      label: 'Hall light',
      value: true,
      at: '2026-08-10T20:00:00.000Z'
    })
    memory = applyKnxAiHabitDecision(memory, {
      habitId: memory.habits[0].id,
      operation: 'reject',
      userMessage: 'Questa non è una mia abitudine.',
      sessionId: 'telegram:42'
    })
    const rendered = buildKnxAiHomeMemoryMarkdown({ memory })
    const restored = parseKnxAiHomeMemoryMarkdownStrict(rendered.markdown)
    expect(restored.habits[0].status).to.equal('rejected')
    expect(restored.habitDecisions[0].userMessage).to.equal('Questa non è una mia abitudine.')
    expect(rendered.markdown).to.include('The JSON block at the top is authoritative')
    expect(rendered.markdown).to.include('## Current state cache')
  })

  it('renders an Italian read-only explanation without exposing JSON structure', async () => {
    const { formatCerebrumMemorySimpleText } = await import('../ui/knxUltimateAI-vue/src/cerebrumMemoryView.mjs')
    const memory = {
      updatedAt: '2026-08-18T07:35:00.000Z',
      habits: [{
        id: 'habit-1',
        type: 'temporal_state_pattern',
        label: 'Luce cucina',
        value: 'true',
        dayType: 'weekday',
        averageMinuteOfDay: 450,
        samples: 8,
        observationDays: 8,
        observationSpanDays: 15,
        confidence: 0.91,
        status: 'pending_confirmation'
      }],
      habitDecisions: [],
      states: [{ label: 'Luce cucina', value: 'on', area: 'cucina', source: 'knx', observedAt: '2026-08-18T07:30:00.000Z' }],
      observations: [],
      notifications: [],
      semanticObjects: [{ label: 'Luce cucina', kind: 'light', area: 'cucina' }],
      reconciler: { lastTickAt: '2026-08-18T07:34:00.000Z', knxReadCount: 2 }
    }

    const text = formatCerebrumMemorySimpleText(memory, { language: 'it' })
    expect(text).to.include('Memoria Cerebrum — vista semplificata')
    expect(text).to.include('Vista di sola lettura')
    expect(text).to.include('Luce cucina')
    expect(text).to.include('8 osservazioni')
    expect(text).to.include('15 giorni tra la prima e l’ultima osservazione')
    expect(text).not.to.include('"habits"')
    expect(text).not.to.include('{')
  })

  it('extracts editable JSON and preserves the backup envelope', async () => {
    const {
      formatCerebrumMemoryJson,
      replaceCerebrumMemoryJsonBlock
    } = await import('../ui/knxUltimateAI-vue/src/cerebrumMemoryView.mjs')
    const original = '<!-- KNX_AI_HOME_MEMORY_V1\n{"version":2,"habits":[]}\nKNX_AI_HOME_MEMORY_END -->\n\n# Readable backup\n'
    const json = formatCerebrumMemoryJson(original)
    expect(JSON.parse(json)).to.deep.equal({ version: 2, habits: [] })

    const replaced = replaceCerebrumMemoryJsonBlock(original, '{"version":2,"habits":[{"id":"one"}]}')
    expect(replaced).to.include('"id": "one"')
    expect(replaced).to.include('# Readable backup')
  })

  it('renders the native AI Chat Learning file as localized read-only text', async () => {
    const {
      formatChatLearningSimpleText,
      parseChatLearningNativeFile
    } = await import('../ui/knxUltimateAI-vue/src/chatLearningView.mjs')
    const nativeFile = [
      '# KNX AI native chat-learning context',
      'KNXAI_CHAT_CONTEXT\t3',
      'CREATED_AT\t2026-08-01T06:00:00.000Z',
      'UPDATED_AT\t2026-08-18T07:35:00.000Z',
      'SESSION\ttelegram:42\t2026-08-18T07:35:00.000Z',
      'INSTRUCTION\t2026-08-10T20:00:00.000Z\tPreferisco risposte concise.',
      'TURN\t2026-08-18T07:34:00.000Z\tAccendi la luce cucina.\tLa luce cucina è stata accesa.',
      'CAMERA_WATCH\twatch-1\t2026-08-12T09:00:00.000Z\tcamera-1\tIngresso\tmotion\tfront-door\tPorta principale\t60\ttrue\tit\tperson',
      'END_SESSION',
      ''
    ].join('\n')

    const parsed = parseChatLearningNativeFile(nativeFile)
    expect(parsed.sessions).to.have.length(1)
    expect(parsed.sessions[0].instructions[0].text).to.equal('Preferisco risposte concise.')
    expect(parsed.sessions[0].cameraWatches[0].objectTypes).to.deep.equal(['person'])

    const text = formatChatLearningSimpleText(nativeFile, { language: 'it' })
    expect(text).to.include('Apprendimento AI Chat — vista semplificata')
    expect(text).to.include('Vista di sola lettura')
    expect(text).to.include('Preferisco risposte concise.')
    expect(text).to.include('Occupante: Accendi la luce cucina.')
    expect(text).to.include('Cerebrum: La luce cucina è stata accesa.')
    expect(text).to.include('Telecamera: Ingresso')
    expect(text).not.to.include('KNXAI_CHAT_CONTEXT')
    expect(text).not.to.include('\t')
  })

  it('keeps the simplified AI Chat Learning view read-only and reports malformed native files', async () => {
    const { parseChatLearningNativeFile } = await import('../ui/knxUltimateAI-vue/src/chatLearningView.mjs')
    expect(() => parseChatLearningNativeFile('KNXAI_CHAT_CONTEXT\t3\nCREATED_AT\tnow\nUPDATED_AT\tnow\nSESSION\tbroken\tnow\n'))
      .to.throw('SESSION without END_SESSION')

    const fs = require('fs')
    const path = require('path')
    const webUi = fs.readFileSync(path.join(__dirname, '..', 'ui', 'knxUltimateAI-vue', 'src', 'App.vue'), 'utf8')
    expect(webUi).to.include('chatLearningViewMode: [\'native\', \'simple\'].includes')
    expect(webUi).to.include('state.chatLearningViewMode === \'native\'')
    expect(webUi).to.include('Simplified AI Chat Learning, read-only')
    expect(webUi).to.include('state.chatLearningViewMode !== \'native\'')
    expect(webUi).to.include('state.chatLearningViewMode === \'simple\'')
    expect(webUi).to.include('? chatLearningSimpleView.value')
  })
})
