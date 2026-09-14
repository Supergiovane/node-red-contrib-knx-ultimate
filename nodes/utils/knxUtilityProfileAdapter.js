'use strict'

// Private implementations are owned by Utility and never depend on legacy
// palette registrations. Only the selected profile constructs a live node.
const RUNTIME_MODULES = Object.freeze({
  alerter: './knxUtilityProfiles/runtime/alerter',
  autoresponder: './knxUtilityProfiles/runtime/autoresponder',
  datetime: './knxUtilityProfiles/runtime/datetime',
  watchdog: './knxUtilityProfiles/runtime/watchdog',
  globalcontext: './knxUtilityProfiles/runtime/globalcontext',
  logger: './knxUtilityProfiles/runtime/logger',
  staircase: './knxUtilityProfiles/runtime/staircase',
  garage: './knxUtilityProfiles/runtime/garage',
  scenecontroller: './knxUtilityProfiles/runtime/scenecontroller',
  loadcontrol: './knxUtilityProfiles/runtime/loadcontrol',
  hatranslator: './knxUtilityProfiles/runtime/hatranslator'
})

const constructors = new WeakMap()
const isSupportedType = utilityType => Object.prototype.hasOwnProperty.call(RUNTIME_MODULES, utilityType)

const normalizeUtilityType = (config = {}) => {
  const utilityType = String(config.utilityType || '').trim()
  if (!isSupportedType(utilityType)) {
    // Never fall back to an active bus service for corrupt or future profiles.
    throw new Error(`Unsupported KNX Utility function: ${utilityType || '(missing)'}`)
  }
  return utilityType
}

const captureRuntimeConstructor = (RED, utilityType) => {
  if (!isSupportedType(utilityType)) return undefined
  let cache = constructors.get(RED)
  if (!cache) {
    cache = new Map()
    constructors.set(RED, cache)
  }
  if (cache.has(utilityType)) return cache.get(utilityType)

  let RuntimeConstructor
  const redFacade = Object.create(RED)
  redFacade.nodes = Object.create(RED.nodes)
  redFacade.nodes.registerType = (_type, constructor) => {
    RuntimeConstructor = constructor
  }
  require(RUNTIME_MODULES[utilityType])(redFacade)
  if (typeof RuntimeConstructor !== 'function') {
    throw new Error(`Unable to load KNX Utility runtime for ${utilityType}`)
  }
  cache.set(utilityType, RuntimeConstructor)
  return RuntimeConstructor
}

const setupKnxUtilityRuntime = (RED, node, config) => {
  const utilityType = normalizeUtilityType(config)
  const RuntimeConstructor = captureRuntimeConstructor(RED, utilityType)
  RuntimeConstructor.call(node, config)
  node.utilityType = utilityType
}

module.exports = {
  RUNTIME_MODULES,
  normalizeUtilityType,
  captureRuntimeConstructor,
  setupKnxUtilityRuntime
}
