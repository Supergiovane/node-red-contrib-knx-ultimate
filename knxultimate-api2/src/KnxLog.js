/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* (C) 2021 Supergiovane
*/
const util = require('util')
const possibleLEvels = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
let logger

/*
 * Logger-Level importance levels:
 *  trace < info < warn < error
 */

const determineLogLevel = options => {
  let level

  // 24/03/2021 Supergiovane fixed logLevel capitalization to lowercase
  if (options) {
    if (options.loglevel) {
      level = options.loglevel
    } else {
      options.debug ? level = 'debug' : level = 'info'
    }
  } else {
    level = 'info'
  }
  if (!possibleLEvels.includes(level)) level = "error";
  return level
}

module.exports = {
  get: function (options) {
    if (!logger) {
      //console.log('BANANA new logger, level',determineLogLevel(options),(options && options.debug && 'debug') ||
      //(options && options.loglevel) ||
      //'error');
      logger = require('log-driver')({
        levels: possibleLEvels,
        level: determineLogLevel(options),
        format: function () {
          // arguments[0] is the log level ie 'debug'
          const a = Array.from(arguments)
          var ts;
          var dt = new Date();
          //var ts = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
          try {
            ts = dt.toLocaleString().replace(/T/, ' ').replace(/Z$/, '') + "." + dt.getMilliseconds() + " KnxUltimate-API2:"; // 18/10/2021 Added millisecs
          } catch (error) {
            ts = dt.toISOString().replace(/T/, ' ').replace(/Z$/, '') + "." + dt.getMilliseconds() + " KnxUltimate-API2:"; // 18/10/2021 Added millisecs
          }

          if (a.length > 2) {
            // if more than one item to log, assume a fmt string is given
            const fmtargs = ['[%s] %s ' + a[1], a[0], ts].concat(a.slice(2))
            return util.format.apply(util, fmtargs)
          } else {
            // arguments[1] is a plain string
            return util.format('[%s] %s %s', a[0], ts, a[1])
          }
        }
      })
    }
    return (logger)
  },
  destroy: function () {
    // 16/08/2020 Supergiovane Destruction of the logger
    logger = null;
  }
}
