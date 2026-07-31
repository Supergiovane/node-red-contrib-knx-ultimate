'use strict'

// These are the canonical runtime implementations owned by HUE Controller.
// They deliberately keep the familiar "module receives RED, then calls
// registerType" shape: that lets us preserve the well-tested lifecycle of each
// dedicated Hue implementation without registering fifteen more public nodes.
//
// None of these paths is listed under `node-red.nodes` in package.json. Node-RED
// therefore never loads them as palette nodes, and deleting a legacy entry point
// cannot remove code required by HUE Controller.
const RUNTIME_MODULES = Object.freeze({
  light: './hueControllerProfiles/runtime/light',
  plug: './hueControllerProfiles/runtime/plug',
  button: './hueControllerProfiles/runtime/button',
  relative_rotary: './hueControllerProfiles/runtime/relative_rotary',
  motion: './hueControllerProfiles/runtime/motion',
  area_motion: './hueControllerProfiles/runtime/area_motion',
  camera_motion: './hueControllerProfiles/runtime/camera_motion',
  contact: './hueControllerProfiles/runtime/contact',
  light_level: './hueControllerProfiles/runtime/light_level',
  temperature: './hueControllerProfiles/runtime/temperature',
  humidity: './hueControllerProfiles/runtime/humidity',
  scene: './hueControllerProfiles/runtime/scene',
  device_power: './hueControllerProfiles/runtime/device_power',
  zigbee_connectivity: './hueControllerProfiles/runtime/zigbee_connectivity',
  device_software_update: './hueControllerProfiles/runtime/device_software_update'
})

// A constructor closes over the RED instance used while loading its module.
// Cache by RED first (rather than globally) so tests, embedded runtimes and future
// hot-reload scenarios never accidentally share constructors across runtimes.
// WeakMap also means an abandoned RED instance is not kept alive by this adapter.
const constructors = new WeakMap()

const getConstructorCache = (RED) => {
  let cache = constructors.get(RED)
  if (!cache) {
    cache = new Map()
    constructors.set(RED, cache)
  }
  return cache
}

const captureRuntimeConstructor = (RED, controllerType) => {
  const modulePath = RUNTIME_MODULES[controllerType]
  if (!modulePath) return undefined

  const cache = getConstructorCache(RED)
  if (cache.has(controllerType)) return cache.get(controllerType)

  let capturedConstructor

  // The private modules believe they are registering an ordinary node. The
  // facade delegates every real RED service through the prototype chain but
  // intercepts only registerType, turning registration into constructor capture.
  // The real Node-RED registry is never touched here.
  const redFacade = Object.create(RED)
  redFacade.nodes = Object.create(RED.nodes)
  redFacade.nodes.registerType = (_type, constructor) => {
    capturedConstructor = constructor
  }

  // CommonJS itself caches the module source; our per-RED cache stores the
  // constructor produced by invoking its exported registration function.
  require(modulePath)(redFacade)
  if (typeof capturedConstructor !== 'function') {
    throw new Error(`Unable to load HUE Controller runtime for ${controllerType}`)
  }

  cache.set(controllerType, capturedConstructor)
  return capturedConstructor
}

const normalizeControllerType = (config = {}) => {
  // `hueControllerType` is the authoritative new field. The resource suffix is
  // a compatibility safety net for imported or partially migrated flows.
  const configuredType = String(config.hueControllerType || '').trim()
  if (RUNTIME_MODULES[configuredType]) return configuredType

  const resourceType = String(config.hueDevice || '').split('#')[1] || ''
  if (RUNTIME_MODULES[resourceType]) return resourceType

  // grouped_light intentionally falls through to light: both resource kinds
  // use the same mature light runtime and there is no separate grouped profile.
  return 'light'
}

const setupHueControllerRuntime = (RED, node, config) => {
  const controllerType = normalizeControllerType(config)
  const RuntimeConstructor = captureRuntimeConstructor(RED, controllerType)

  // Execute the selected constructor *on the Controller instance*. Its own
  // RED.nodes.createNode call installs all normal Node-RED lifecycle hooks,
  // while the persisted public type remains knxUltimateHueController.
  RuntimeConstructor.call(node, config)
  node.hueControllerType = controllerType
}

module.exports = {
  RUNTIME_MODULES,
  captureRuntimeConstructor,
  normalizeControllerType,
  setupHueControllerRuntime
}
