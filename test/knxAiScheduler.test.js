const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

const {
  KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES,
  KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES,
  KNX_AI_SCHEDULE_ONE_TIME_LEASE_MS,
  applyKnxAiScheduleActions,
  buildKnxAiScheduleMarkdown,
  claimDueKnxAiSchedules,
  completeKnxAiScheduleRun,
  listActiveKnxAiSchedules,
  normalizeIntervalMinutes,
  normalizeKnxAiScheduleActions,
  normalizeKnxAiScheduleStore
} = require('../nodes/utils/knxAiScheduler')

const MINUTE_MS = 60 * 1000

const makeStore = (tasks, now) => ({
  version: 1,
  createdAt: new Date(now).toISOString(),
  updatedAt: new Date(now).toISOString(),
  tasks
})

const makeTask = (overrides = {}) => ({
  id: 'schedule-test',
  kind: 'monitor',
  title: 'A future action',
  instruction: 'Perform the model-authored action described here.',
  sourceRequest: '',
  sessionId: 'chat-a',
  language: 'en',
  createdAt: '2026-08-29T08:00:00.000Z',
  startAt: '2026-08-29T09:00:00.000Z',
  nextRunAt: '2026-08-29T09:00:00.000Z',
  intervalMinutes: 60,
  expiresAt: '',
  status: 'active',
  runCount: 0,
  lastRunAt: '',
  lastStatus: '',
  lastError: '',
  lastNotificationAt: '',
  lastNotificationFingerprint: '',
  reason: '',
  ...overrides
})

describe('Cerebrum Ultimate semantic scheduler', () => {
  it('passes the resolved Markdown filename through the atomic writer filePath contract', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(source).to.include('writeAtomicUtf8File({ filePath: markdownPath, content: buildKnxAiScheduleMarkdown(node._scheduleStore) })')
    expect(source).not.to.include('writeAtomicUtf8File({ markdownPath, content: buildKnxAiScheduleMarkdown(node._scheduleStore) })')
  })

  it('creates, lists and cancels schedules only for the owning chat', () => {
    const now = Date.parse('2026-08-29T08:00:00.000Z')
    const actionFor = title => ({
      operation: 'create',
      kind: 'command',
      title,
      instruction: `Esegui liberamente: ${title}`,
      startAt: '2026-08-29T10:00:00.000Z'
    })

    let outcome = applyKnxAiScheduleActions({
      store: makeStore([], now),
      actions: [actionFor('Azione della chat A')],
      sessionId: 'chat-a',
      language: 'it',
      now,
      idFactory: () => 'owner-a'
    })
    expect(outcome.results[0]).to.include({ operation: 'create', ok: true })

    outcome = applyKnxAiScheduleActions({
      store: outcome.store,
      actions: [actionFor('Azione della chat B')],
      sessionId: 'chat-b',
      language: 'it',
      now,
      idFactory: () => 'owner-b'
    })
    const storeWithBothOwners = outcome.store

    const listedForA = applyKnxAiScheduleActions({
      store: storeWithBothOwners,
      actions: [{ operation: 'list' }],
      sessionId: 'chat-a',
      now
    })
    expect(listedForA.results[0].tasks.map(task => task.id)).to.deep.equal(['schedule-owner-a'])

    const foreignCancellation = applyKnxAiScheduleActions({
      store: storeWithBothOwners,
      actions: [{ operation: 'cancel', taskId: 'schedule-owner-b' }],
      sessionId: 'chat-a',
      now
    })
    expect(foreignCancellation.results[0]).to.include({ operation: 'cancel', ok: false, count: 0 })
    expect(listActiveKnxAiSchedules(foreignCancellation.store, { now })).to.have.length(2)

    const ownCancellation = applyKnxAiScheduleActions({
      store: foreignCancellation.store,
      actions: [{ operation: 'cancel', all: true }],
      sessionId: 'chat-a',
      now
    })
    expect(ownCancellation.results[0]).to.include({ operation: 'cancel', ok: true, count: 1 })
    expect(listActiveKnxAiSchedules(ownCancellation.store, { sessionId: 'chat-a', now })).to.deep.equal([])
    expect(listActiveKnxAiSchedules(ownCancellation.store, { sessionId: 'chat-b', now }).map(task => task.id))
      .to.deep.equal(['schedule-owner-b'])
  })

  it('stores a recurring five-day monitor from semantic action data without inspecting its wording', () => {
    const now = Date.parse('2026-08-29T08:00:00.000Z')
    const startAt = new Date(now + (15 * MINUTE_MS)).toISOString()
    const expiresAt = new Date(Date.parse(startAt) + (5 * 24 * 60 * MINUTE_MS)).toISOString()
    const sourceRequest = 'Per i prossimi cinque giorni, fai questa verifica e avvisami quando serve.'
    const instruction = 'Consulta le fonti disponibili per Cortemaggiore; se emerge il fenomeno descritto dall’utente, usa TTS Ultimate per avvisarlo.'
    const outcome = applyKnxAiScheduleActions({
      store: makeStore([], now),
      actions: [{
        operation: 'create',
        kind: 'monitor',
        title: 'Verifica periodica a Cortemaggiore',
        instruction,
        startAt,
        intervalMinutes: 60,
        expiresAt,
        reason: 'Richiesta futura ricorrente espressa in linguaggio naturale.'
      }],
      sessionId: 'chat-massimo',
      language: 'it',
      sourceRequest,
      now,
      idFactory: () => 'five-days'
    })

    expect(outcome.rejected).to.deep.equal([])
    expect(outcome.results[0]).to.include({ operation: 'create', ok: true })
    expect(outcome.results[0].task).to.include({
      id: 'schedule-five-days',
      kind: 'monitor',
      instruction,
      sourceRequest,
      sessionId: 'chat-massimo',
      language: 'it',
      startAt,
      nextRunAt: startAt,
      intervalMinutes: 60,
      expiresAt,
      status: 'active'
    })
  })

  it('rounds and clamps recurring intervals while preserving zero as one-time execution', () => {
    expect(normalizeIntervalMinutes(0)).to.equal(0)
    expect(normalizeIntervalMinutes('not-a-number')).to.equal(0)
    expect(normalizeIntervalMinutes(1)).to.equal(KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES)
    expect(normalizeIntervalMinutes(12.6)).to.equal(13)
    expect(normalizeIntervalMinutes(KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES + 1000))
      .to.equal(KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES)

    const normalized = normalizeKnxAiScheduleActions([{
      operation: 'create',
      kind: 'reminder',
      title: 'Intervallo minimo',
      instruction: 'Testo semantico deciso dal modello.',
      startAt: '2026-08-29T10:00:00.000Z',
      repeatEveryMinutes: 1
    }], { now: Date.parse('2026-08-29T08:00:00.000Z') })

    expect(normalized.rejected).to.deep.equal([])
    expect(normalized.accepted[0].intervalMinutes).to.equal(KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES)
  })

  it('rejects unsupported kinds, invalid start dates and expiry at or before the first run', () => {
    const normalized = normalizeKnxAiScheduleActions([
      {
        operation: 'create',
        kind: 'weather-intent',
        title: 'Tipo non supportato',
        instruction: 'Qualunque testo.',
        startAt: '2026-08-29T10:00:00.000Z'
      },
      {
        operation: 'create',
        kind: 'command',
        title: 'Data non valida',
        instruction: 'Qualunque testo.',
        startAt: 'quando capita'
      },
      {
        operation: 'create',
        kind: 'monitor',
        title: 'Scadenza non valida',
        instruction: 'Qualunque testo.',
        startAt: '2026-08-29T10:00:00.000Z',
        expiresAt: '2026-08-29T10:00:00.000Z'
      }
    ], { now: Date.parse('2026-08-29T08:00:00.000Z') })

    expect(normalized.accepted).to.deep.equal([])
    expect(normalized.rejected.map(item => item.reason)).to.deep.equal([
      'schedule kind must be monitor, reminder, or command',
      'schedule startAt is not a valid absolute date and time',
      'schedule expiresAt must be later than startAt'
    ])
  })

  it('rejects a malformed explicit expiry instead of silently making the schedule permanent', () => {
    const normalized = normalizeKnxAiScheduleActions([{
      operation: 'create',
      kind: 'monitor',
      title: 'Scadenza illeggibile',
      instruction: 'Esegui la verifica soltanto nel periodo richiesto.',
      startAt: '2026-08-29T10:00:00.000Z',
      expiresAt: 'fra cinque giorni circa'
    }], { now: Date.parse('2026-08-29T08:00:00.000Z') })

    expect(normalized.accepted).to.deep.equal([])
    expect(normalized.rejected).to.deep.equal([{
      sourceIndex: 0,
      reason: 'schedule expiresAt is not a valid absolute date and time'
    }])
  })

  it('requires absolute zoned timestamps and rejects malformed recurrence values', () => {
    const normalized = normalizeKnxAiScheduleActions([
      {
        operation: 'create',
        kind: 'command',
        title: 'Orario privo di fuso',
        instruction: 'Esegui il comando una volta.',
        startAt: '2026-08-29T10:00:00'
      },
      {
        operation: 'create',
        kind: 'monitor',
        title: 'Intervallo non numerico',
        instruction: 'Ripeti la verifica.',
        startAt: '2026-08-29T10:00:00+02:00',
        intervalMinutes: 'ogni tanto'
      },
      {
        operation: 'create',
        kind: 'monitor',
        title: 'Intervallo negativo',
        instruction: 'Ripeti la verifica.',
        startAt: '2026-08-29T10:00:00+02:00',
        intervalMinutes: -5
      }
    ], { now: Date.parse('2026-08-29T07:00:00.000Z') })

    expect(normalized.accepted).to.deep.equal([])
    expect(normalized.rejected.map(item => item.reason)).to.deep.equal([
      'schedule startAt is not a valid absolute date and time',
      'schedule intervalMinutes must be zero or a positive number',
      'schedule intervalMinutes must be zero or a positive number'
    ])
  })

  it('claims an overdue recurrence once and advances directly beyond now without a catch-up burst', () => {
    const now = Date.parse('2026-08-29T13:37:00.000Z')
    const initialStore = makeStore([makeTask({
      nextRunAt: '2026-08-29T08:00:00.000Z',
      startAt: '2026-08-29T08:00:00.000Z',
      runCount: 7
    })], Date.parse('2026-08-29T07:00:00.000Z'))

    const firstClaim = claimDueKnxAiSchedules({ store: initialStore, now, limit: 8 })
    expect(firstClaim.claimed).to.have.length(1)
    expect(firstClaim.claimed[0]).to.include({
      id: 'schedule-test',
      nextRunAt: '2026-08-29T14:00:00.000Z',
      lastRunAt: '2026-08-29T13:37:00.000Z',
      lastStatus: 'running',
      runCount: 8,
      status: 'active'
    })

    const duplicateClaim = claimDueKnxAiSchedules({ store: firstClaim.store, now, limit: 8 })
    expect(duplicateClaim.claimed).to.deep.equal([])
    expect(duplicateClaim.store.tasks[0].nextRunAt).to.equal('2026-08-29T14:00:00.000Z')
    expect(duplicateClaim.store.tasks[0].runCount).to.equal(8)
  })

  it('retries an interrupted one-time reminder but never replays a claimed one-time command', () => {
    const now = Date.parse('2026-08-29T10:00:00.000Z')
    const initialStore = makeStore([
      makeTask({
        id: 'schedule-reminder-once',
        kind: 'reminder',
        intervalMinutes: 0,
        startAt: '2026-08-29T10:00:00.000Z',
        nextRunAt: '2026-08-29T10:00:00.000Z'
      }),
      makeTask({
        id: 'schedule-command-once',
        kind: 'command',
        intervalMinutes: 0,
        startAt: '2026-08-29T10:00:00.000Z',
        nextRunAt: '2026-08-29T10:00:00.000Z'
      })
    ], Date.parse('2026-08-29T08:00:00.000Z'))

    const reminderClaim = claimDueKnxAiSchedules({ store: initialStore, now, limit: 1 })
    expect(reminderClaim.claimed[0]).to.include({ id: 'schedule-reminder-once', status: 'running' })
    expect(reminderClaim.store.tasks.find(task => task.id === 'schedule-reminder-once')).to.include({
      status: 'active',
      lastStatus: 'running',
      nextRunAt: new Date(now + KNX_AI_SCHEDULE_ONE_TIME_LEASE_MS).toISOString()
    })
    const reminderOnlyStore = makeStore(
      reminderClaim.store.tasks.filter(task => task.id === 'schedule-reminder-once'),
      now
    )
    expect(claimDueKnxAiSchedules({ store: reminderOnlyStore, now: now + 15000 }).claimed).to.deep.equal([])

    const reminderCompletion = completeKnxAiScheduleRun({
      store: reminderClaim.store,
      taskId: 'schedule-reminder-once',
      ok: true,
      now: now + 1000
    })
    expect(reminderCompletion.task).to.include({ status: 'completed', lastStatus: 'completed' })

    const commandClaim = claimDueKnxAiSchedules({ store: reminderCompletion.store, now, limit: 1 })
    expect(commandClaim.claimed[0]).to.include({ id: 'schedule-command-once', status: 'completed' })
    expect(commandClaim.store.tasks.find(task => task.id === 'schedule-command-once')).to.include({
      status: 'completed',
      lastStatus: 'running'
    })
  })

  it('expires elapsed tasks and recovers interrupted persisted runs safely on restart', () => {
    const now = Date.parse('2026-08-29T12:00:00.000Z')
    const normalized = normalizeKnxAiScheduleStore(makeStore([
      makeTask({
        id: 'schedule-recurring-running',
        status: 'running',
        nextRunAt: '2026-08-29T13:00:00.000Z',
        expiresAt: '2026-08-30T13:00:00.000Z'
      }),
      makeTask({
        id: 'schedule-one-time-running',
        kind: 'command',
        status: 'running',
        intervalMinutes: 0,
        nextRunAt: '2026-08-29T11:00:00.000Z'
      }),
      makeTask({
        id: 'schedule-elapsed',
        status: 'active',
        nextRunAt: '2026-08-29T11:00:00.000Z',
        expiresAt: '2026-08-29T12:00:00.000Z'
      })
    ], Date.parse('2026-08-29T08:00:00.000Z')), { now })

    expect(normalized.tasks.find(task => task.id === 'schedule-recurring-running')).to.include({
      status: 'active',
      nextRunAt: '2026-08-29T13:00:00.000Z'
    })
    expect(normalized.tasks.find(task => task.id === 'schedule-one-time-running')).to.include({
      status: 'completed',
      nextRunAt: ''
    })
    expect(normalized.tasks.find(task => task.id === 'schedule-elapsed')).to.include({
      status: 'expired',
      nextRunAt: ''
    })
  })

  it('allows cancellation while the claimed final recurrence is running and ignores its late completion', () => {
    const runAt = Date.parse('2026-08-29T10:00:00.000Z')
    const initialStore = makeStore([makeTask({
      nextRunAt: '2026-08-29T10:00:00.000Z',
      expiresAt: '2026-08-29T11:00:00.000Z'
    })], Date.parse('2026-08-29T08:00:00.000Z'))
    const claimed = claimDueKnxAiSchedules({ store: initialStore, now: runAt })

    expect(claimed.claimed[0]).to.include({ status: 'expired', lastStatus: 'running' })
    const cancelled = applyKnxAiScheduleActions({
      store: claimed.store,
      actions: [{ operation: 'cancel', taskId: 'schedule-test' }],
      sessionId: 'chat-a',
      now: runAt + 1000
    })
    expect(cancelled.results[0]).to.include({ operation: 'cancel', ok: true, count: 1 })
    expect(cancelled.store.tasks[0]).to.include({ status: 'cancelled', lastStatus: 'cancelled' })

    const lateCompletion = completeKnxAiScheduleRun({
      store: cancelled.store,
      taskId: 'schedule-test',
      ok: true,
      notified: true,
      notificationFingerprint: 'late-result',
      now: runAt + 2000
    })
    expect(lateCompletion.task).to.include({
      status: 'cancelled',
      lastStatus: 'cancelled',
      lastNotificationAt: '',
      lastNotificationFingerprint: ''
    })
  })

  it('records completion errors and bounded notification fingerprints', () => {
    const runAt = Date.parse('2026-08-29T10:00:00.000Z')
    const claimed = claimDueKnxAiSchedules({
      store: makeStore([makeTask({
        nextRunAt: '2026-08-29T10:00:00.000Z'
      })], Date.parse('2026-08-29T08:00:00.000Z')),
      now: runAt
    })
    const fingerprint = `meteo:${'x'.repeat(200)}`
    const completed = completeKnxAiScheduleRun({
      store: claimed.store,
      taskId: 'schedule-test',
      ok: false,
      error: 'servizio meteo temporaneamente non disponibile',
      notified: true,
      notificationFingerprint: fingerprint,
      now: runAt + 5000
    })

    expect(completed.task).to.include({
      status: 'active',
      lastStatus: 'error',
      lastError: 'servizio meteo temporaneamente non disponibile',
      lastNotificationAt: '2026-08-29T10:00:05.000Z'
    })
    expect(completed.task.lastNotificationFingerprint).to.equal(fingerprint.slice(0, 128))
  })

  it('persists the original human request and renders it in the generated Markdown', () => {
    const now = Date.parse('2026-08-29T08:00:00.000Z')
    const sourceRequest = 'Avvisami per cinque giorni\n  soltanto se la verifica dà esito positivo.'
    const outcome = applyKnxAiScheduleActions({
      store: makeStore([], now),
      actions: [{
        operation: 'create',
        kind: 'reminder',
        title: 'Promemoria espresso liberamente',
        instruction: 'Ricostruisci il contesto e svolgi il compito richiesto.',
        startAt: '2026-08-29T09:00:00.000Z'
      }],
      sessionId: 'chat-a',
      language: 'it',
      sourceRequest,
      now,
      idFactory: () => 'markdown'
    })

    expect(outcome.store.tasks[0].sourceRequest).to.equal(sourceRequest)
    const markdown = buildKnxAiScheduleMarkdown(outcome.store, { now })
    expect(markdown).to.include('# Cerebrum Ultimate Plans and Reminders')
    expect(markdown).to.include('## Promemoria espresso liberamente')
    expect(markdown).to.include('- ID: `schedule-markdown`')
    expect(markdown).to.include('- Instruction: Ricostruisci il contesto e svolgi il compito richiesto.')
    expect(markdown).to.include('- Original user request: Avvisami per cinque giorni soltanto se la verifica dà esito positivo.')
    expect(markdown).to.include('- Repeat every: one time')
  })
})
