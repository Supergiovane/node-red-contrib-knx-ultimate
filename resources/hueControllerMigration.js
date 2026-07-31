(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateHueControllerMigration = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const LEGACY_NODE_PROFILES = Object.freeze({
    knxUltimateHueLight: { controllerType: 'light', pinMode: 'dual', pinsDefault: false },
    knxUltimateHuePlug: { controllerType: 'plug', pinMode: 'dual', pinsDefault: false },
    knxUltimateHueButton: { controllerType: 'button', pinMode: 'output', pinsDefault: true },
    knxUltimateHueTapDial: { controllerType: 'relative_rotary', pinMode: 'output', pinsDefault: true },
    knxUltimateHueMotion: { controllerType: 'motion', pinMode: 'output', pinsDefault: true },
    knxUltimateHueAreaMotion: { controllerType: 'area_motion', pinMode: 'output', pinsDefault: true },
    knxUltimateHueCameraMotion: { controllerType: 'camera_motion', pinMode: 'output', pinsDefault: true },
    knxUltimateHueContactSensor: { controllerType: 'contact', pinMode: 'output', pinsDefault: true },
    knxUltimateHueLightSensor: { controllerType: 'light_level', pinMode: 'output', pinsDefault: true },
    knxUltimateHueTemperatureSensor: { controllerType: 'temperature', pinMode: 'output', pinsDefault: true },
    knxUltimateHueHumiditySensor: { controllerType: 'humidity', pinMode: 'output', pinsDefault: true },
    knxUltimateHueScene: { controllerType: 'scene', pinMode: 'dual', pinsDefault: false },
    knxUltimateHueBattery: { controllerType: 'device_power', pinMode: 'output', pinsDefault: true },
    knxUltimateHueZigbeeConnectivity: { controllerType: 'zigbee_connectivity', pinMode: 'output', pinsDefault: true },
    knxUltimateHuedevice_software_update: { controllerType: 'device_software_update', pinMode: 'output', pinsDefault: true }
  })

  const CONFIG_NODE_REFERENCE_FIELDS = Object.freeze({
    'knxUltimate-config': 'server',
    'hue-config': 'serverHue'
  })

  // Kept as a tiny public predicate so the editor can decide whether the
  // migration entry point is relevant without duplicating the canonical type
  // catalog. It only classifies an object; it never reads or changes a flow.
  function isLegacyHueNode (node) {
    return Boolean(node && typeof node === 'object' && LEGACY_NODE_PROFILES[node.type])
  }

  function hasEnabledPins (node, profile) {
    const rawValue = node.enableNodePINS
    if (rawValue === true) return true
    if (rawValue === false) return false
    if (typeof rawValue === 'string' && rawValue.trim() !== '') {
      return rawValue.trim().toLowerCase() === 'yes'
    }
    return profile.pinsDefault === true
  }

  function readPinCount (value) {
    if (value === undefined || value === null || value === '') return undefined
    const numericValue = Number(value)
    if (!Number.isInteger(numericValue) || numericValue < 0) return undefined
    return numericValue
  }

  function derivePinShape (node, profile) {
    const enabled = hasEnabledPins(node, profile)
    const defaults = profile.pinMode === 'dual'
      ? { inputs: enabled ? 1 : 0, outputs: enabled ? 1 : 0 }
      : { inputs: 0, outputs: enabled ? 1 : 0 }
    const exportedInputs = readPinCount(node.inputs)
    const exportedOutputs = readPinCount(node.outputs)
    const wiredOutputs = Array.isArray(node.wires) ? node.wires.length : undefined

    return {
      inputs: exportedInputs === undefined ? defaults.inputs : exportedInputs,
      outputs: exportedOutputs === undefined
        ? (wiredOutputs === undefined ? defaults.outputs : wiredOutputs)
        : exportedOutputs
    }
  }

  function cloneFlowNode (node, index) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      throw new TypeError(`Flow entry ${index} is not a Node-RED node object`)
    }
    return JSON.parse(JSON.stringify(node))
  }

  function copyTextWithTemporaryTextarea (text, documentObject) {
    if (!documentObject || !documentObject.body || typeof documentObject.createElement !== 'function') {
      throw new Error('Clipboard fallback is unavailable')
    }

    const temporary = documentObject.createElement('textarea')
    temporary.value = String(text)
    temporary.readOnly = true
    temporary.setAttribute('aria-hidden', 'true')
    temporary.style.position = 'fixed'
    temporary.style.left = '-9999px'
    temporary.style.top = '0'
    documentObject.body.appendChild(temporary)

    try {
      temporary.focus()
      temporary.select()
      if (typeof temporary.setSelectionRange === 'function') {
        temporary.setSelectionRange(0, temporary.value.length)
      }
      if (typeof documentObject.execCommand !== 'function' || documentObject.execCommand('copy') !== true) {
        throw new Error('The browser refused clipboard access')
      }
      return true
    } finally {
      if (temporary.parentNode) temporary.parentNode.removeChild(temporary)
    }
  }

  function copyTextToClipboard (text, environment = {}) {
    const value = String(text)
    const navigatorObject = environment.navigator
    const documentObject = environment.document
    const clipboard = navigatorObject && navigatorObject.clipboard
    const fallback = () => copyTextWithTemporaryTextarea(value, documentObject)

    if (clipboard && typeof clipboard.writeText === 'function') {
      try {
        return Promise.resolve(clipboard.writeText(value))
          .then(() => true)
          .catch(fallback)
      } catch (error) {
        return Promise.resolve().then(fallback)
      }
    }
    return Promise.resolve().then(fallback)
  }

  function convertLegacyHueFlow (sourceFlow, options = {}) {
    if (!Array.isArray(sourceFlow)) {
      throw new TypeError('The pasted Node-RED flow must be a JSON array')
    }

    let convertedCount = 0
    const convertedByType = {}
    const referencedConfigIds = new Set()
    const flow = sourceFlow.map(function (sourceNode, index) {
      const node = cloneFlowNode(sourceNode, index)
      const profile = LEGACY_NODE_PROFILES[node.type]
      if (!profile) return node

      const oldType = node.type
      const pinShape = derivePinShape(node, profile)
      node.type = 'knxUltimateHueController'
      node.hueControllerType = profile.controllerType
      node.inputs = pinShape.inputs
      node.outputs = pinShape.outputs
      Object.values(CONFIG_NODE_REFERENCE_FIELDS).forEach(function (field) {
        if (typeof node[field] === 'string' && node[field].trim() !== '') {
          referencedConfigIds.add(node[field])
        }
      })
      convertedCount += 1
      convertedByType[oldType] = (convertedByType[oldType] || 0) + 1
      return node
    })

    const reuseConfigNodes = options.reuseConfigNodes !== false
    const omittedConfigByType = {}
    const convertedFlow = reuseConfigNodes && convertedCount > 0
      ? flow.filter(function (node) {
          const referenceField = CONFIG_NODE_REFERENCE_FIELDS[node.type]
          const omitNode = Boolean(referenceField && referencedConfigIds.has(node.id))
          if (omitNode) omittedConfigByType[node.type] = (omittedConfigByType[node.type] || 0) + 1
          return !omitNode
        })
      : flow
    const omittedConfigCount = Object.values(omittedConfigByType)
      .reduce((total, count) => total + count, 0)

    return {
      flow: convertedFlow,
      convertedCount,
      convertedByType,
      omittedConfigCount,
      omittedConfigByType
    }
  }

  function convertLegacyHueFlowJson (rawJson, options = {}) {
    if (typeof rawJson !== 'string' || rawJson.trim() === '') {
      throw new TypeError('Paste a Node-RED flow before starting the conversion')
    }
    const sourceFlow = JSON.parse(rawJson)
    const result = convertLegacyHueFlow(sourceFlow, options)
    return {
      ...result,
      json: JSON.stringify(result.flow, null, 2)
    }
  }

  return {
    CONFIG_NODE_REFERENCE_FIELDS,
    LEGACY_NODE_PROFILES,
    copyTextToClipboard,
    convertLegacyHueFlow,
    convertLegacyHueFlowJson,
    derivePinShape,
    isLegacyHueNode
  }
}))
