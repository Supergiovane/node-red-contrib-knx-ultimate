/**
* (C) 2024 Supergiovane
*/
const util = require('util')
const logger = require('node-color-log')

const DEBUG_BUFFER_LIMIT = 5000
const debugBuffer = []
let debugSequence = 0

const cloneEntry = (entry) => ({
  seq: entry.seq,
  level: entry.level,
  prefix: entry.prefix,
  message: entry.message,
  timestamp: entry.timestamp,
  isoTimestamp: entry.isoTimestamp,
  sessionStart: entry.sessionStart
})

const normaliseLevel = (level) => {
  const allowed = ['success', 'debug', 'info', 'warn', 'error']
  if (allowed.includes(level)) return level
  return 'info'
}

const stringifyArg = (arg) => {
  if (arg === null) return 'null'
  if (arg === undefined) return 'undefined'
  if (arg instanceof Error) return arg.stack || `${arg.name || 'Error'}: ${arg.message}`
  const type = typeof arg
  if (type === 'string') return arg
  if (type === 'number' || type === 'boolean' || type === 'bigint') return String(arg)
  if (type === 'symbol') return arg.toString()
  try {
    return util.inspect(arg, { depth: 6, breakLength: 120, compact: false })
  } catch (error) {
    return String(arg)
  }
}

const formatArgs = (args) => {
  if (!args || !args.length) return ''
  return args.map(stringifyArg).join(' ')
}

const pushDebugEntry = (level, prefix, args, meta = {}) => {
  try {
    const effectiveLevel = normaliseLevel(level)
    const timestamp = Date.now()
    const isoTimestamp = new Date(timestamp).toISOString()
    const message = formatArgs(args)
    debugSequence += 1
    debugBuffer.push({
      seq: debugSequence,
      level: effectiveLevel,
      prefix: prefix || '',
      message,
      timestamp,
      isoTimestamp,
      sessionStart: !!meta.sessionStart
    })
    if (debugBuffer.length > DEBUG_BUFFER_LIMIT) {
      debugBuffer.splice(0, debugBuffer.length - DEBUG_BUFFER_LIMIT)
    }
  } catch (error) {
    // As a last resort, make sure the failure itself is recorded.
    debugSequence += 1
    debugBuffer.push({
      seq: debugSequence,
      level: 'error',
      prefix: prefix || '',
      message: `Logger buffer failure: ${error.message || error}`,
      timestamp: Date.now(),
      isoTimestamp: new Date().toISOString(),
      sessionStart: false
    })
    if (debugBuffer.length > DEBUG_BUFFER_LIMIT) {
      debugBuffer.splice(0, debugBuffer.length - DEBUG_BUFFER_LIMIT)
    }
  }
}

class loggerClass {
  logLevel = 'info'
  prefix = ''
  constructor (options = {}) {
    const possibleLevels = ['success', 'debug', 'info', 'warn', 'error', 'disable']
    this.prefix = options.setPrefix || ''
    if (this.prefix) {
      this.logger = logger.createNamedLogger(this.prefix)
    } else {
      this.logger = logger
    }
    let requestedLevel = options.loglevel
    if (!possibleLevels.includes(requestedLevel)) requestedLevel = 'info'
    if (requestedLevel === 'trace') requestedLevel = 'debug' // Backward compatibility
    if (requestedLevel === 'silent') requestedLevel = 'disable' // Backward compatibility
    this.logger.setLevel(requestedLevel)
    this.logger.setDate(() => (new Date()).toLocaleString())
    this.logLevel = requestedLevel
    pushDebugEntry('info', this.prefix, [`--- Logger session started (level: ${this.logLevel}) ---`], { sessionStart: true })
  }

  destroy = () => {
    // Placeholder for backward compatibility; kept for API symmetry.
  }

  record = (level, args) => {
    pushDebugEntry(level, this.prefix, args)
  }

  success = (...args) => {
    this.record('success', args)
    this.logger.success(...args)
  }

  debug = (...args) => {
    this.record('debug', args)
    this.logger.debug(...args)
  }

  info = (...args) => {
    this.record('info', args)
    this.logger.info(...args)
  }

  warn = (...args) => {
    this.record('warn', args)
    this.logger.warn(...args)
  }

  error = (...args) => {
    this.record('error', args)
    this.logger.error(...args)
  }
}

loggerClass.getDebugSnapshot = (options = {}) => {
  const sinceSeqRaw = options.sinceSeq
  const sinceSeq = Number.isInteger(sinceSeqRaw) ? sinceSeqRaw : null
  const source = sinceSeq === null ? debugBuffer : debugBuffer.filter((entry) => entry.seq > sinceSeq)
  const entries = source.map(cloneEntry)
  const latestSeq = debugBuffer.length ? debugBuffer[debugBuffer.length - 1].seq : (sinceSeq || 0)
  return {
    entries,
    latestSeq,
    total: debugBuffer.length,
    limit: DEBUG_BUFFER_LIMIT
  }
}

loggerClass.clearDebugBuffer = () => {
  debugBuffer.length = 0
  debugSequence = 0
}

loggerClass.DEBUG_BUFFER_LIMIT = DEBUG_BUFFER_LIMIT

module.exports = loggerClass
