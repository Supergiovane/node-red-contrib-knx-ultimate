const { expect } = require('chai')

const {
  addBoundedKnxAiNotification,
  addBoundedKnxAiObservation,
  buildKnxAiHomeMemoryMarkdown,
  buildKnxAiProactiveFallback,
  classifyKnxAiOpenState,
  createEmptyKnxAiHomeMemory,
  inferKnxAiHomeSemantic,
  isKnxAiQuietTime,
  parseKnxAiHomeMemoryMarkdown,
  updateKnxAiCoverHabit
} = require('../nodes/utils/knxAiHomeMemory')

describe('KNX AI bounded home intelligence memory', () => {
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

  it('keeps the Markdown file below the configured hard limit and preserves education', () => {
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
    expect(rendered.markdown).to.include(education)
    expect(rendered.markdown).to.include('AI Education — user managed, read only for AI')
    const restored = parseKnxAiHomeMemoryMarkdown(rendered.markdown)
    expect(restored.observations.length).to.be.at.most(120)
    expect(restored.notifications.length).to.be.at.most(80)
    expect(restored.semanticObjects.length).to.be.at.most(300)
  })

  it('enforces the byte limit even when user education contains multibyte text', () => {
    const education = '🏠'.repeat(16000)
    const rendered = buildKnxAiHomeMemoryMarkdown({
      memory: createEmptyKnxAiHomeMemory(),
      education,
      maxKb: 64
    })

    expect(rendered.bytes).to.be.at.most(64 * 1024)
    expect(rendered.education.length).to.be.greaterThan(0)
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
})
