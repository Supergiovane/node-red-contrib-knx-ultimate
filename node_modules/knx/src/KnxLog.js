/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
const util = require('util');
var logger;

module.exports = {
  get: function(options) {
    if (!logger) {
      lvl = (options && options.debug && 'debug') ||
          (options && options.loglevel) ||
          'info';
      //console.trace('new logger, level='+lvl);
      logger = require('log-driver')({
        level: lvl,
        format: function() {
          // arguments[0] is the log level ie 'debug'
          var a  = Array.from(arguments);
          var ts = new Date().toISOString().replace(/T/, ' ').replace(/Z$/, '');
          if (a.length > 2) {
            // if more than one item to log, assume a fmt string is given
            var fmtargs = ['[%s] %s '+a[1], a[0], ts].concat(a.slice(2));
            return util.format.apply(util, fmtargs);
          } else {
            // arguments[1] is a plain string
            return util.format('[%s] %s %s', a[0], ts, a[1])
          }
        }
      });
    }
    return(logger);
  }
};
