const COPY = {
  en: {
    title: 'AI Chat Learning — simplified view', readOnly: 'Read-only view. Switch to Native file to make changes.', updated: 'Last update', summary: 'Summary', sessions: 'conversations', instructions: 'learned instructions', turns: 'recent exchanges', watches: 'camera watches', session: 'Conversation', learned: 'Learned instructions', recent: 'Recent exchanges', cameras: 'Camera watches', none: 'Nothing recorded yet.', user: 'Occupant', cerebrum: 'Cerebrum', camera: 'Camera', event: 'event', scope: 'scope', objects: 'objects', cooldown: 'minimum interval', seconds: 'seconds', snapshot: 'snapshot', yes: 'yes', no: 'no'
  },
  it: {
    title: 'Apprendimento AI Chat — vista semplificata', readOnly: 'Vista di sola lettura. Passa a File nativo per effettuare modifiche.', updated: 'Ultimo aggiornamento', summary: 'Riepilogo', sessions: 'conversazioni', instructions: 'istruzioni apprese', turns: 'scambi recenti', watches: 'sorveglianze telecamera', session: 'Conversazione', learned: 'Istruzioni apprese', recent: 'Scambi recenti', cameras: 'Sorveglianze telecamera', none: 'Nessuna informazione registrata.', user: 'Occupante', cerebrum: 'Cerebrum', camera: 'Telecamera', event: 'evento', scope: 'ambito', objects: 'oggetti', cooldown: 'intervallo minimo', seconds: 'secondi', snapshot: 'istantanea', yes: 'sì', no: 'no'
  },
  de: {
    title: 'KI-Chat-Lernen — vereinfachte Ansicht', readOnly: 'Schreibgeschützte Ansicht. Zum Ändern zu Native Datei wechseln.', updated: 'Letzte Aktualisierung', summary: 'Zusammenfassung', sessions: 'Unterhaltungen', instructions: 'gelernte Anweisungen', turns: 'letzte Dialoge', watches: 'Kameraüberwachungen', session: 'Unterhaltung', learned: 'Gelernte Anweisungen', recent: 'Letzte Dialoge', cameras: 'Kameraüberwachungen', none: 'Noch keine Informationen gespeichert.', user: 'Bewohner', cerebrum: 'Cerebrum', camera: 'Kamera', event: 'Ereignis', scope: 'Bereich', objects: 'Objekte', cooldown: 'Mindestintervall', seconds: 'Sekunden', snapshot: 'Momentaufnahme', yes: 'ja', no: 'nein'
  },
  fr: {
    title: 'Apprentissage du chat IA — vue simplifiée', readOnly: 'Vue en lecture seule. Passez à Fichier natif pour apporter des modifications.', updated: 'Dernière mise à jour', summary: 'Résumé', sessions: 'conversations', instructions: 'instructions apprises', turns: 'échanges récents', watches: 'surveillances caméra', session: 'Conversation', learned: 'Instructions apprises', recent: 'Échanges récents', cameras: 'Surveillances caméra', none: 'Aucune information enregistrée.', user: 'Occupant', cerebrum: 'Cerebrum', camera: 'Caméra', event: 'événement', scope: 'zone', objects: 'objets', cooldown: 'intervalle minimal', seconds: 'secondes', snapshot: 'instantané', yes: 'oui', no: 'non'
  },
  es: {
    title: 'Aprendizaje del chat IA — vista simplificada', readOnly: 'Vista de solo lectura. Cambia a Archivo nativo para realizar modificaciones.', updated: 'Última actualización', summary: 'Resumen', sessions: 'conversaciones', instructions: 'instrucciones aprendidas', turns: 'intercambios recientes', watches: 'vigilancias de cámara', session: 'Conversación', learned: 'Instrucciones aprendidas', recent: 'Intercambios recientes', cameras: 'Vigilancias de cámara', none: 'Todavía no hay información registrada.', user: 'Ocupante', cerebrum: 'Cerebrum', camera: 'Cámara', event: 'evento', scope: 'ámbito', objects: 'objetos', cooldown: 'intervalo mínimo', seconds: 'segundos', snapshot: 'captura', yes: 'sí', no: 'no'
  },
  'zh-CN': {
    title: 'AI 聊天学习 — 简化视图', readOnly: '此视图为只读。若要修改，请切换到原生文件。', updated: '最后更新', summary: '摘要', sessions: '个对话', instructions: '条已学习指令', turns: '次最近交流', watches: '项摄像头监控', session: '对话', learned: '已学习指令', recent: '最近交流', cameras: '摄像头监控', none: '尚未记录信息。', user: '住户', cerebrum: 'Cerebrum', camera: '摄像头', event: '事件', scope: '范围', objects: '对象', cooldown: '最短间隔', seconds: '秒', snapshot: '快照', yes: '是', no: '否'
  }
}

const normalizeLanguage = value => {
  const raw = String(value || '').trim().toLowerCase()
  if (raw.startsWith('it')) return 'it'
  if (raw.startsWith('de')) return 'de'
  if (raw.startsWith('fr')) return 'fr'
  if (raw.startsWith('es')) return 'es'
  if (raw.startsWith('zh')) return 'zh-CN'
  return 'en'
}

const oneLine = (value, fallback = '', maxChars = 1200) => {
  const text = String(value === undefined || value === null ? '' : value).replace(/\s+/g, ' ').trim()
  return (text || fallback).slice(0, Math.max(1, Number(maxChars) || 1200))
}

const formatDate = (value, language) => {
  const raw = oneLine(value)
  if (!raw) return '—'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  try {
    return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  } catch (error) {
    return raw
  }
}

const unescapeField = value => {
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

export function parseChatLearningNativeFile (value) {
  const context = { version: 3, createdAt: '', updatedAt: '', sessions: [] }
  let headerSeen = false
  let currentSession = null
  String(value || '').split(/\r?\n/).forEach((line, lineIndex) => {
    if (!line.trim() || line.trimStart().startsWith('#')) return
    const fields = line.split('\t').map(unescapeField)
    const record = fields.shift()
    const fail = message => { throw new Error(`Invalid AI Chat Learning file at line ${lineIndex + 1}: ${message}`) }
    if (!headerSeen) {
      if (record !== 'KNXAI_CHAT_CONTEXT' || String(fields[0] || '') !== '3') fail('expected KNXAI_CHAT_CONTEXT 3 header')
      headerSeen = true
      return
    }
    if (record === 'CREATED_AT' || record === 'UPDATED_AT') {
      if (currentSession) fail(`${record} is not allowed inside a session`)
      context[record === 'CREATED_AT' ? 'createdAt' : 'updatedAt'] = fields[0] || ''
      return
    }
    if (record === 'SESSION') {
      if (currentSession) fail('nested SESSION record')
      if (!oneLine(fields[0])) fail('SESSION id is required')
      currentSession = { id: fields[0], updatedAt: fields[1] || '', instructions: [], turns: [], cameraWatches: [] }
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
      if (fields.length < 2 || !oneLine(fields[1])) fail('INSTRUCTION requires timestamp and text')
      currentSession.instructions.push({ at: fields[0], text: fields[1] })
      return
    }
    if (record === 'TURN') {
      if (fields.length < 3 || (!oneLine(fields[1]) && !oneLine(fields[2]))) fail('TURN requires timestamp, question and reply')
      currentSession.turns.push({ at: fields[0], question: fields[1], reply: fields[2] })
      return
    }
    if (record === 'CAMERA_WATCH') {
      if (fields.length < 10) fail('CAMERA_WATCH has missing fields')
      if (fields[8] !== 'true' && fields[8] !== 'false') fail('CAMERA_WATCH snapshot flag must be true or false')
      currentSession.cameraWatches.push({
        id: fields[0], createdAt: fields[1], cameraId: fields[2], cameraName: fields[3], eventType: fields[4], scopeId: fields[5], scopeName: fields[6], cooldownSeconds: Number(fields[7]) || 0, sendSnapshot: fields[8] === 'true', language: fields[9], objectTypes: fields.slice(10)
      })
      return
    }
    fail(`unknown ${record || 'empty'} record`)
  })
  if (!headerSeen) throw new Error('The file does not contain a KNXAI_CHAT_CONTEXT 3 header')
  if (currentSession) throw new Error('Invalid AI Chat Learning file: SESSION without END_SESSION')
  if (!context.createdAt || !context.updatedAt) throw new Error('Invalid AI Chat Learning file: CREATED_AT and UPDATED_AT are required')
  return context
}

export function formatChatLearningSimpleText (value, { language = 'en' } = {}) {
  const context = typeof value === 'string' ? parseChatLearningNativeFile(value) : (value || {})
  const lang = normalizeLanguage(language)
  const t = COPY[lang] || COPY.en
  const sessions = Array.isArray(context.sessions) ? context.sessions : []
  const instructionCount = sessions.reduce((sum, session) => sum + (Array.isArray(session.instructions) ? session.instructions.length : 0), 0)
  const turnCount = sessions.reduce((sum, session) => sum + (Array.isArray(session.turns) ? session.turns.length : 0), 0)
  const watchCount = sessions.reduce((sum, session) => sum + (Array.isArray(session.cameraWatches) ? session.cameraWatches.length : 0), 0)
  const lines = [
    t.title,
    t.readOnly,
    '',
    `${t.updated}: ${formatDate(context.updatedAt, lang)}`,
    `${t.summary}: ${sessions.length} ${t.sessions} · ${instructionCount} ${t.instructions} · ${turnCount} ${t.turns} · ${watchCount} ${t.watches}`
  ]
  if (!sessions.length) lines.push('', t.none)
  sessions.forEach((session, sessionIndex) => {
    const instructions = Array.isArray(session.instructions) ? session.instructions : []
    const turns = Array.isArray(session.turns) ? session.turns : []
    const watches = Array.isArray(session.cameraWatches) ? session.cameraWatches : []
    lines.push('', `${t.session} ${sessionIndex + 1} — ${oneLine(session.id, 'default', 160)}`)
    lines.push(`${t.updated}: ${formatDate(session.updatedAt, lang)}`)
    lines.push('', t.learned.toUpperCase())
    if (!instructions.length) lines.push(t.none)
    instructions.forEach((instruction, index) => lines.push(`${index + 1}. ${formatDate(instruction.at, lang)} — ${oneLine(instruction.text)}`))
    lines.push('', t.recent.toUpperCase())
    if (!turns.length) lines.push(t.none)
    turns.forEach((turn, index) => {
      lines.push(`${index + 1}. ${formatDate(turn.at, lang)}`)
      lines.push(`   ${t.user}: ${oneLine(turn.question, '—')}`)
      lines.push(`   ${t.cerebrum}: ${oneLine(turn.reply, '—')}`)
    })
    lines.push('', t.cameras.toUpperCase())
    if (!watches.length) lines.push(t.none)
    watches.forEach((watch, index) => {
      const camera = oneLine(watch.cameraName || watch.cameraId, '—')
      const scope = oneLine(watch.scopeName || watch.scopeId)
      const objects = Array.isArray(watch.objectTypes) ? watch.objectTypes.map(item => oneLine(item)).filter(Boolean) : []
      lines.push(`${index + 1}. ${t.camera}: ${camera} · ${t.event}: ${oneLine(watch.eventType, '—')}`)
      if (scope) lines.push(`   ${t.scope}: ${scope}`)
      if (objects.length) lines.push(`   ${t.objects}: ${objects.join(', ')}`)
      lines.push(`   ${t.cooldown}: ${Math.max(0, Number(watch.cooldownSeconds) || 0)} ${t.seconds} · ${t.snapshot}: ${watch.sendSnapshot ? t.yes : t.no}`)
    })
  })
  return `${lines.join('\n').trim()}\n`
}
