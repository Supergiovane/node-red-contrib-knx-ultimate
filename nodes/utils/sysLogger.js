/**
* (C) 2024 Supergiovane
*/

class loggerEngine {
  constructor() {
    const possibleLEvels = ['success', 'error', 'warn', 'info', 'debug']

  }
  get = (options) => {
    let logger = require('node-color-log');
    try {
      //levels: ['silent', 'error', 'warn', 'info', 'debug', 'trace'],     
      if (options.setPrefix !== undefined) {
        logger = logger.createNamedLogger(options.setPrefix);
      }
      if (options.loglevel === 'trace') options.loglevel = 'debug' // Backwart compatibility
      if (options.loglevel === 'silent') options.loglevel = 'disable' // Backwart compatibility
      logger.setLevel(options.loglevel);
      logger.setDate(() => (new Date()).toLocaleString())
      return logger
    } catch (error) {
      return logger
    }
  }
  destroy = () => {
    // 16/08/2020 Supergiovane Destruction of the logger
    logger = null
  }

}
const colorlog = new loggerEngine();
module.exports = colorlog;
