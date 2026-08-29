const KNX_AI_SCHEDULE_STORE_VERSION = 1
const KNX_AI_SCHEDULE_MAX_ACTIVE_TASKS = 32
const KNX_AI_SCHEDULE_MAX_STORED_TASKS = 64
const KNX_AI_SCHEDULE_MAX_ACTIONS = 8
const KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES = 5
const KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES = 365 * 24 * 60
const KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS = 4000
const KNX_AI_SCHEDULE_ONE_TIME_LEASE_MS = 60 * 1000

const clonePlain = (value, fallback) => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    return fallback
  }
}

const clampText = (value, maxChars) => {
  const text = String(value === undefined || value === null ? '' : value).trim()
  return text.length > maxChars ? text.slice(0, maxChars) : text
}

const toIso = (value) => {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(String(value || ''))
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : ''
}

const toAbsoluteIso = (value) => {
  const text = String(value === undefined || value === null ? '' : value).trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(text)) return ''
  return toIso(text)
}

const normalizeIntervalMinutes = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return 0
  return Math.max(
    KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES,
    Math.min(KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES, Math.round(numeric))
  )
}

const createEmptyKnxAiScheduleStore = () => ({
  version: KNX_AI_SCHEDULE_STORE_VERSION,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tasks: []
})

const normalizeKnxAiScheduleTask = (value, { now = Date.now() } = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const id = clampText(source.id, 96).replace(/[^A-Za-z0-9_.-]/g, '')
  const instruction = clampText(source.instruction, KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS)
  const startAt = toIso(source.startAt || source.createdAt)
  let nextRunAt = toIso(source.nextRunAt || startAt)
  const expiresAt = toIso(source.expiresAt)
  const intervalMinutes = normalizeIntervalMinutes(source.intervalMinutes)
  const kind = ['monitor', 'reminder', 'command'].includes(String(source.kind || '').trim().toLowerCase())
    ? String(source.kind).trim().toLowerCase()
    : 'reminder'
  const runCount = Math.max(0, Math.floor(Number(source.runCount) || 0))
  const allowedStatuses = new Set(['active', 'running', 'completed', 'cancelled', 'expired'])
  let status = allowedStatuses.has(String(source.status || '').trim().toLowerCase())
    ? String(source.status).trim().toLowerCase()
    : 'active'
  const expiresAtMs = expiresAt ? Date.parse(expiresAt) : 0
  if (status === 'running') status = intervalMinutes > 0 || kind !== 'command' ? 'active' : 'completed'
  if (status === 'active' && expiresAtMs > 0 && expiresAtMs <= Number(now)) {
    status = 'expired'
    nextRunAt = ''
  }
  if (status === 'active' && !nextRunAt) nextRunAt = startAt || new Date(Number(now)).toISOString()
  if (status !== 'active') nextRunAt = ''
  return {
    id,
    kind,
    title: clampText(source.title || instruction, 200),
    instruction,
    sourceRequest: clampText(source.sourceRequest, KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS),
    sessionId: clampText(source.sessionId || 'default', 160) || 'default',
    language: clampText(source.language || 'en', 16) || 'en',
    createdAt: toIso(source.createdAt) || new Date(Number(now)).toISOString(),
    startAt: startAt || new Date(Number(now)).toISOString(),
    nextRunAt,
    intervalMinutes,
    expiresAt,
    status,
    runCount,
    lastRunAt: toIso(source.lastRunAt),
    lastStatus: clampText(source.lastStatus, 32),
    lastError: clampText(source.lastError, 1000),
    lastNotificationAt: toIso(source.lastNotificationAt),
    lastNotificationFingerprint: clampText(source.lastNotificationFingerprint, 128),
    reason: clampText(source.reason, 1000)
  }
}

const normalizeKnxAiScheduleStore = (value, { now = Date.now() } = {}) => {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const seen = new Set()
  const tasks = (Array.isArray(source.tasks) ? source.tasks : [])
    .map(task => normalizeKnxAiScheduleTask(task, { now }))
    .filter(task => {
      if (!task.id || !task.instruction || seen.has(task.id)) return false
      seen.add(task.id)
      return true
    })
  const active = tasks.filter(task => task.status === 'active')
  const inactive = tasks
    .filter(task => task.status !== 'active')
    .sort((left, right) => String(right.lastRunAt || right.createdAt).localeCompare(String(left.lastRunAt || left.createdAt)))
  const bounded = active.concat(inactive.slice(0, Math.max(0, KNX_AI_SCHEDULE_MAX_STORED_TASKS - active.length)))
    .slice(0, KNX_AI_SCHEDULE_MAX_STORED_TASKS)
  return {
    version: KNX_AI_SCHEDULE_STORE_VERSION,
    createdAt: toIso(source.createdAt) || new Date(Number(now)).toISOString(),
    updatedAt: toIso(source.updatedAt) || new Date(Number(now)).toISOString(),
    tasks: bounded
  }
}

const normalizeKnxAiScheduleActions = (value, { now = Date.now() } = {}) => {
  const accepted = []
  const rejected = []
  ;(Array.isArray(value) ? value : []).slice(0, KNX_AI_SCHEDULE_MAX_ACTIONS).forEach((candidate, index) => {
    const source = candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate : {}
    const operation = String(source.operation || '').trim().toLowerCase()
    if (!['create', 'cancel', 'list'].includes(operation)) {
      rejected.push({ sourceIndex: index, reason: 'unsupported schedule operation' })
      return
    }
    if (operation === 'list') {
      accepted.push({
        operation,
        taskId: '',
        all: false,
        kind: 'reminder',
        title: '',
        instruction: '',
        startAt: '',
        intervalMinutes: 0,
        expiresAt: '',
        reason: clampText(source.reason, 1000)
      })
      return
    }
    if (operation === 'cancel') {
      const taskId = clampText(source.taskId || source.id, 96).replace(/[^A-Za-z0-9_.-]/g, '')
      const all = source.all === true
      if (!taskId && !all) {
        rejected.push({ sourceIndex: index, reason: 'schedule cancellation needs an exact task id or all=true' })
        return
      }
      accepted.push({
        operation,
        taskId,
        all,
        kind: 'reminder',
        title: '',
        instruction: '',
        startAt: '',
        intervalMinutes: 0,
        expiresAt: '',
        reason: clampText(source.reason, 1000)
      })
      return
    }
    const title = clampText(source.title, 200)
    const kind = String(source.kind || '').trim().toLowerCase()
    const instruction = clampText(source.instruction || source.task || source.text, KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS)
    const requestedStartAt = toAbsoluteIso(source.startAt || source.runAt)
    const rawIntervalMinutes = source.intervalMinutes !== undefined ? source.intervalMinutes : source.repeatEveryMinutes
    const intervalText = String(rawIntervalMinutes === undefined || rawIntervalMinutes === null ? '' : rawIntervalMinutes).trim()
    const numericIntervalMinutes = intervalText === '' ? 0 : Number(rawIntervalMinutes)
    const intervalMinutes = normalizeIntervalMinutes(numericIntervalMinutes)
    const rawExpiresAt = source.expiresAt !== undefined ? source.expiresAt : source.endAt
    const expiresAt = String(rawExpiresAt === undefined || rawExpiresAt === null ? '' : rawExpiresAt).trim()
      ? toAbsoluteIso(rawExpiresAt)
      : ''
    if (!title) {
      rejected.push({ sourceIndex: index, reason: 'schedule title is empty' })
      return
    }
    if (!['monitor', 'reminder', 'command'].includes(kind)) {
      rejected.push({ sourceIndex: index, reason: 'schedule kind must be monitor, reminder, or command' })
      return
    }
    if (!instruction) {
      rejected.push({ sourceIndex: index, reason: 'schedule instruction is empty' })
      return
    }
    if (!requestedStartAt) {
      rejected.push({ sourceIndex: index, reason: 'schedule startAt is not a valid absolute date and time' })
      return
    }
    if (!Number.isFinite(numericIntervalMinutes) || numericIntervalMinutes < 0) {
      rejected.push({ sourceIndex: index, reason: 'schedule intervalMinutes must be zero or a positive number' })
      return
    }
    if (String(rawExpiresAt === undefined || rawExpiresAt === null ? '' : rawExpiresAt).trim() && !expiresAt) {
      rejected.push({ sourceIndex: index, reason: 'schedule expiresAt is not a valid absolute date and time' })
      return
    }
    const startAtMs = Math.max(Number(now), Date.parse(requestedStartAt))
    const normalizedStartAt = new Date(startAtMs).toISOString()
    const expiresAtMs = expiresAt ? Date.parse(expiresAt) : 0
    if (expiresAt && expiresAtMs <= startAtMs) {
      rejected.push({ sourceIndex: index, reason: 'schedule expiresAt must be later than startAt' })
      return
    }
    accepted.push({
      operation,
      taskId: '',
      all: false,
      kind,
      title,
      instruction,
      startAt: normalizedStartAt,
      intervalMinutes,
      expiresAt,
      reason: clampText(source.reason, 1000)
    })
  })
  return { accepted, rejected }
}

const createScheduleId = ({ now, idFactory, existingIds }) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const generated = typeof idFactory === 'function'
      ? String(idFactory())
      : `${Number(now).toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    const candidate = `schedule-${generated}`.replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 96)
    if (candidate && !existingIds.has(candidate)) return candidate
  }
  throw new Error('unable to allocate a unique schedule id')
}

const applyKnxAiScheduleActions = ({ store, actions, sessionId = 'default', language = 'en', sourceRequest = '', now = Date.now(), idFactory } = {}) => {
  const target = normalizeKnxAiScheduleStore(store, { now })
  const normalized = normalizeKnxAiScheduleActions(actions, { now })
  const results = normalized.rejected.map(item => ({ operation: 'invalid', ok: false, error: item.reason, sourceIndex: item.sourceIndex }))
  const ownerSessionId = clampText(sessionId || 'default', 160) || 'default'
  const ownerLanguage = clampText(language || 'en', 16) || 'en'
  const existingIds = new Set(target.tasks.map(task => task.id))
  normalized.accepted.forEach(action => {
    if (action.operation === 'list') {
      results.push({
        operation: 'list',
        ok: true,
        tasks: target.tasks
          .filter(task => task.sessionId === ownerSessionId && task.status === 'active')
          .map(task => clonePlain(task, {}))
      })
      return
    }
    if (action.operation === 'cancel') {
      const matches = target.tasks.filter(task => {
        if (task.sessionId !== ownerSessionId || (task.status !== 'active' && task.lastStatus !== 'running')) return false
        return action.all === true || task.id === action.taskId
      })
      matches.forEach(task => {
        task.status = 'cancelled'
        task.nextRunAt = ''
        task.lastStatus = 'cancelled'
        task.lastError = ''
      })
      results.push({
        operation: 'cancel',
        ok: matches.length > 0,
        taskId: action.taskId,
        all: action.all === true,
        count: matches.length,
        error: matches.length ? '' : 'no matching active schedule was found for this chat'
      })
      return
    }
    const activeCount = target.tasks.filter(task => task.status === 'active').length
    if (activeCount >= KNX_AI_SCHEDULE_MAX_ACTIVE_TASKS) {
      results.push({ operation: 'create', ok: false, error: `the active schedule limit (${KNX_AI_SCHEDULE_MAX_ACTIVE_TASKS}) has been reached` })
      return
    }
    let id
    try {
      id = createScheduleId({ now, idFactory, existingIds })
    } catch (error) {
      results.push({ operation: 'create', ok: false, error: error.message || String(error) })
      return
    }
    existingIds.add(id)
    const task = normalizeKnxAiScheduleTask({
      id,
      kind: action.kind,
      title: action.title,
      instruction: action.instruction,
      sourceRequest: clampText(sourceRequest, KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS),
      sessionId: ownerSessionId,
      language: ownerLanguage,
      createdAt: new Date(Number(now)).toISOString(),
      startAt: action.startAt,
      nextRunAt: action.startAt,
      intervalMinutes: action.intervalMinutes,
      expiresAt: action.expiresAt,
      status: 'active',
      reason: action.reason
    }, { now })
    target.tasks.push(task)
    results.push({ operation: 'create', ok: true, task: clonePlain(task, {}) })
  })
  target.updatedAt = new Date(Number(now)).toISOString()
  return {
    store: normalizeKnxAiScheduleStore(target, { now }),
    results,
    accepted: normalized.accepted,
    rejected: normalized.rejected
  }
}

const claimDueKnxAiSchedules = ({ store, now = Date.now(), limit = 1 } = {}) => {
  const target = normalizeKnxAiScheduleStore(store, { now })
  const due = target.tasks
    .filter(task => task.status === 'active' && task.nextRunAt && Date.parse(task.nextRunAt) <= Number(now))
    .sort((left, right) => String(left.nextRunAt).localeCompare(String(right.nextRunAt)))
    .slice(0, Math.max(1, Math.floor(Number(limit) || 1)))
  const claimed = []
  due.forEach(task => {
    const scheduledForMs = Date.parse(task.nextRunAt)
    const intervalMs = task.intervalMinutes > 0 ? task.intervalMinutes * 60 * 1000 : 0
    task.lastRunAt = new Date(Number(now)).toISOString()
    task.lastStatus = 'running'
    task.lastError = ''
    task.runCount += 1
    if (intervalMs > 0) {
      const elapsedIntervals = Math.max(1, Math.floor((Number(now) - scheduledForMs) / intervalMs) + 1)
      const nextRunMs = scheduledForMs + (elapsedIntervals * intervalMs)
      const expiresAtMs = task.expiresAt ? Date.parse(task.expiresAt) : 0
      if (expiresAtMs > 0 && nextRunMs >= expiresAtMs) {
        task.status = 'expired'
        task.nextRunAt = ''
      } else {
        task.nextRunAt = new Date(nextRunMs).toISOString()
      }
    } else {
      task.status = task.kind === 'command' ? 'completed' : 'running'
      task.nextRunAt = task.kind === 'command'
        ? ''
        : new Date(Number(now) + KNX_AI_SCHEDULE_ONE_TIME_LEASE_MS).toISOString()
    }
    claimed.push(clonePlain(task, {}))
  })
  target.updatedAt = new Date(Number(now)).toISOString()
  return { store: normalizeKnxAiScheduleStore(target, { now }), claimed }
}

const completeKnxAiScheduleRun = ({ store, taskId, ok = true, error = '', notified = false, notificationFingerprint = '', now = Date.now() } = {}) => {
  const target = normalizeKnxAiScheduleStore(store, { now })
  const task = target.tasks.find(item => item.id === String(taskId || ''))
  if (!task) return { store: target, task: null }
  if (task.status !== 'cancelled') {
    if (task.intervalMinutes <= 0) {
      task.status = 'completed'
      task.nextRunAt = ''
    }
    task.lastStatus = ok ? 'completed' : 'error'
    task.lastError = ok ? '' : clampText(error, 1000)
    if (notified) {
      task.lastNotificationAt = new Date(Number(now)).toISOString()
      task.lastNotificationFingerprint = clampText(notificationFingerprint, 128)
    }
  }
  target.updatedAt = new Date(Number(now)).toISOString()
  return { store: normalizeKnxAiScheduleStore(target, { now }), task: clonePlain(task, {}) }
}

const listActiveKnxAiSchedules = (store, { sessionId, now = Date.now() } = {}) => {
  const owner = sessionId === undefined ? null : String(sessionId || 'default')
  return normalizeKnxAiScheduleStore(store, { now }).tasks
    .filter(task => task.status === 'active' && (owner === null || task.sessionId === owner))
    .sort((left, right) => String(left.nextRunAt).localeCompare(String(right.nextRunAt)))
    .map(task => clonePlain(task, {}))
}

const buildKnxAiSchedulePromptContext = (store, { sessionId, maxChars = 12000, now = Date.now() } = {}) => {
  const tasks = listActiveKnxAiSchedules(store, { sessionId, now })
  if (!tasks.length) return '(no active schedules for this chat)'
  const lines = tasks.map(task => {
    return `${task.id} | kind ${task.kind} | ${task.title} | instruction ${JSON.stringify(task.instruction)} | next ${task.nextRunAt || '-'} | every ${task.intervalMinutes || 0} minute(s) | expires ${task.expiresAt || 'never'}`
  })
  return clampText(lines.join('\n'), Math.max(200, Number(maxChars) || 12000))
}

const buildKnxAiScheduleMarkdown = (store, { now = Date.now() } = {}) => {
  const target = normalizeKnxAiScheduleStore(store, { now })
  const lines = [
    '# KNX AI Plans and Reminders',
    '',
    'This file is generated by KNX AI. Manage these tasks in natural-language chat; the JSON file is the authoritative runtime state.',
    '',
    `Updated: ${target.updatedAt}`,
    ''
  ]
  if (!target.tasks.length) lines.push('_No plans or reminders have been stored._', '')
  target.tasks.forEach(task => {
    const instruction = String(task.instruction || '').replace(/\s+/g, ' ').trim()
    lines.push(`## ${task.title || task.id}`)
    lines.push('')
    lines.push(`- ID: \`${task.id}\``)
    lines.push(`- Status: ${task.status}`)
    lines.push(`- Kind: ${task.kind}`)
    lines.push(`- Instruction: ${instruction}`)
    if (task.sourceRequest) lines.push(`- Original user request: ${String(task.sourceRequest).replace(/\s+/g, ' ').trim()}`)
    lines.push(`- First run: ${task.startAt || '-'}`)
    lines.push(`- Next run: ${task.nextRunAt || '-'}`)
    lines.push(`- Repeat every: ${task.intervalMinutes > 0 ? `${task.intervalMinutes} minutes` : 'one time'}`)
    lines.push(`- Expires: ${task.expiresAt || 'never'}`)
    lines.push(`- Last result: ${task.lastStatus || 'not run yet'}${task.lastError ? ` — ${task.lastError}` : ''}`)
    if (task.lastNotificationAt) lines.push(`- Last notification: ${task.lastNotificationAt}${task.lastNotificationFingerprint ? ` (fingerprint ${task.lastNotificationFingerprint})` : ''}`)
    lines.push('')
  })
  return lines.join('\n')
}

module.exports = {
  KNX_AI_SCHEDULE_MAX_ACTIONS,
  KNX_AI_SCHEDULE_MAX_ACTIVE_TASKS,
  KNX_AI_SCHEDULE_MAX_INSTRUCTION_CHARS,
  KNX_AI_SCHEDULE_MAX_INTERVAL_MINUTES,
  KNX_AI_SCHEDULE_MAX_STORED_TASKS,
  KNX_AI_SCHEDULE_MIN_INTERVAL_MINUTES,
  KNX_AI_SCHEDULE_ONE_TIME_LEASE_MS,
  KNX_AI_SCHEDULE_STORE_VERSION,
  applyKnxAiScheduleActions,
  buildKnxAiScheduleMarkdown,
  buildKnxAiSchedulePromptContext,
  claimDueKnxAiSchedules,
  completeKnxAiScheduleRun,
  createEmptyKnxAiScheduleStore,
  listActiveKnxAiSchedules,
  normalizeIntervalMinutes,
  normalizeKnxAiScheduleActions,
  normalizeKnxAiScheduleStore,
  normalizeKnxAiScheduleTask
}
