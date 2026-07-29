/**
* (C) 2024 Supergiovane
*/
const logger = require('node-color-log')

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
  }

  destroy = () => {
    // Placeholder for backward compatibility; kept for API symmetry.
  }

  success = (...args) => {
    this.logger.success(...args)
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
