'use strict'
const fs = require('fs')
const path = require('path')

// Loads the git-ignored config.local.json. Fails loudly with guidance if missing.
function loadConfig () {
  const p = path.join(__dirname, '..', 'config.local.json')
  if (!fs.existsSync(p)) {
    throw new Error(`Missing ${p}\n  -> cp test/integration/config.example.json test/integration/config.local.json\n  -> then fill in your REAL values (the file is git-ignored).`)
  }
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (!cfg.knx || !cfg.knx.ipAddr) {
    throw new Error('config.local.json: knx.ipAddr is empty. Set your KNX/IP gateway address first.')
  }
  return cfg
}

module.exports = { loadConfig }
