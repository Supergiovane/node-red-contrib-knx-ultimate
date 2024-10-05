/**
* (C) 2024 Supergiovane
*/
const logger = require('node-color-log');
const fs = require('fs');
const path = './KNXUltimateDebugLog.txt';

class loggerClass {
  logLevel = 'info';
  newlyInstantiated = false
  prefix = '';
  constructor(options) {
    const possibleLevels = ['success', 'debug', 'info', 'warn', 'error'];
    if (options.setPrefix !== undefined) {
      this.logger = logger.createNamedLogger(options.setPrefix);
    } else {
      this.logger = logger;
    }
    if (!possibleLevels.includes(options.loglevel)) options.loglevel = 'info';
    if (options.loglevel === 'trace') options.loglevel = 'debug' // Backward compatibility
    if (options.loglevel === 'silent') options.loglevel = 'disable' // Backward compatibility
    this.logger.setLevel(options.loglevel);
    this.logger.setDate(() => (new Date()).toLocaleString());
    this.logLevel = options.loglevel;
    this.newlyInstantiated = true;
    this.prefix = options.setPrefix;
  }


  // Funzione per aggiungere una nuova linea
  addLineToFile(...args) {
    let line = '';
    for (let index = 0; index < args.length; index++) {
      // Contruct a line with the args
      let curLine = args[index];
      try {
        if (typeof curLine === 'object') curLine = JSON.stringify(curLine);
        line += curLine + ' ';
      } catch (error) {
      }
    }

    let data = '';
    try {
      data = fs.readFileSync(path, 'utf8');
    } catch (error) {
      data = "START LOG FILE --------------------------------------------\n";
    }

    // Dividi il contenuto in linee
    const lines = data.split('\n').filter(Boolean); // Rimuove eventuali linee vuote

    // Se il file ha più di 99 linee, taglia le più vecchie
    if (lines.length >= 5000) {
      lines.splice(0, lines.length - 4999);
    }

    let outStr = "-> ";

    if (this.newlyInstantiated === true) {
      outStr += (new Date()).toLocaleString() + ' [' + this.prefix + '] NEW LOG SESSION --------------------------------------------';
      lines.push();
    } else {
      outStr += (new Date()).toLocaleString() + ' [' + this.prefix + '] [' + this.logLevel + '] ' + line;
    }
    this.newlyInstantiated = false;

    // Aggiungi la nuova linea
    lines.push(outStr);

    // Scrivi il file aggiornato
    try {
      fs.writeFileSync(path, lines.join('\n') + '\n');
    } catch (error) {
    }
  }

  destroy = () => {
    // 16/08/2020 Supergiovane Destruction of the logger
    try {
      addLineToFile("-------------------------------------------- END LOG SESSION")
    } catch (error) {
    }
    logger = null
  }

  success = (...args) => {
    this.logger.success(...args);
    // Log to file as well, limited in line numbers
    this.addLineToFile(...args);
  }
  debug = (...args) => {
    this.logger.debug(...args);
    // Log to file as well, limited in line numbers
    this.addLineToFile(...args);
  }
  info = (...args) => {
    this.logger.info(...args);
    // Log to file as well, limited in line numbers
    this.addLineToFile(...args);
  }
  warn = (...args) => {
    this.logger.warn(...args);
    // Log to file as well, limited in line numbers
    this.addLineToFile(...args);
  }
  error = (...args) => {
    this.logger.error(...args);
    // Log to file as well, limited in line numbers
    this.addLineToFile(...args);
  }


}

module.exports = loggerClass;
