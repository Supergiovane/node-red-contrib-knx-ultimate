/**
* (C) 2024 Supergiovane
*/
const winston = require('winston')
const { format: formatMessage } = require('util')

const { combine, timestamp, label, printf, colorize, splat } = winston.format
const colorizer = colorize()
const SPLAT = Symbol.for('splat')

// Keep the application log format aligned with the KNXUltimate engine while
// owning a separate logger instance for each Node-RED node/configuration node.
winston.addColors({
  time: 'grey',
  module: 'bold'
})

const normalizeLevel = (level) => {
  if (level === 'trace') return 'debug'
  if (level === 'silent') return 'disable'
  if (level === 'success') return 'info'
  if (['debug', 'info', 'warn', 'error', 'disable'].includes(level)) return level
  return 'info'
}

const loggerFormat = (prefix) => combine(
  winston.format((info) => {
    const args = info[SPLAT]
    if (Array.isArray(args) && args.length > 0) {
      // node-color-log printed every argument even without placeholders. Format
      // them before Winston's splat transform so existing diagnostics keep all
      // their values while regular %s/%o messages retain Winston semantics.
      info.message = formatMessage(info.message, ...args)
      delete info[SPLAT]
    }
    return info
  })(),
  splat(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format((info) => {
    info.level = String(info.level).toUpperCase()
    return info
  })(),
  label({ label: String(prefix || '-').toUpperCase() }),
  colorize({ level: true }),
  printf((info) => {
    const formattedTimestamp = colorizer.colorize('time', info.timestamp)
    const formattedLabel = colorizer.colorize('module', info.label || '-')
    return `${formattedTimestamp} ${info.level} ${formattedLabel}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
  })
)

class loggerClass {
  logLevel = 'info'
  prefix = ''
  constructor (options = {}) {
    this.prefix = options.setPrefix || ''
    const requestedLevel = normalizeLevel(options.loglevel)
    this.logLevel = requestedLevel
    this.logger = winston.createLogger({
      level: requestedLevel === 'disable' ? 'error' : requestedLevel,
      silent: requestedLevel === 'disable',
      format: loggerFormat(this.prefix),
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error']
        })
      ]
    })
  }

  destroy = () => {
    if (!this.logger) return
    this.logger.silent = true
    this.logger.close()
  }

  success = (...args) => {
    // Winston's npm levels do not include "success"; preserve the legacy API
    // and route it through the equivalent informational level.
    this.logger.info(...args)
  }

  debug = (...args) => {
    this.logger.debug(...args)
  }

  info = (...args) => {
    this.logger.info(...args)
  }

  warn = (...args) => {
    this.logger.warn(...args)
  }

  error = (...args) => {
    this.logger.error(...args)
  }
}

module.exports = loggerClass
