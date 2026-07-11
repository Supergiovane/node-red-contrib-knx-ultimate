'use strict'
// Factory + registry for light engines. Adding a new ecosystem (e.g. Shelly)
// is a one-line registration here + one new *LightEngine file: the Light node
// and its behaviour logic stay untouched.
const { LightEngine } = require('./lightEngine')
const { HueLightEngine } = require('./hueLightEngine')
const { MatterLightEngine } = require('./matterLightEngine')

const ENGINES = {
  hue: HueLightEngine,
  matter: MatterLightEngine
  // shelly: ShellyLightEngine  <-- future: just add the class + this line
}

function createLightEngine (kind, opts = {}) {
  const Engine = ENGINES[kind]
  if (!Engine) {
    throw new Error(`Unknown light engine "${kind}". Available: ${Object.keys(ENGINES).join(', ')}`)
  }
  return new Engine(opts)
}

const availableEngines = () => Object.keys(ENGINES)

module.exports = { createLightEngine, availableEngines, LightEngine, HueLightEngine, MatterLightEngine }
