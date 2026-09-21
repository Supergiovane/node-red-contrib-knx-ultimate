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

  const MIGRATION_USAGE_EMAIL = 'maxsupergiovane@icloud.com'
  const MIGRATION_DONATION_URL = 'https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758'

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

  function collectLegacyHueNodes (RED) {
    const nodes = []
    if (!RED || !RED.nodes || typeof RED.nodes.eachNode !== 'function') return nodes
    RED.nodes.eachNode(function (node) {
      if (isLegacyHueNode(node)) nodes.push(node)
    })
    return nodes
  }

  function createLocalMigrationPatches (legacyNodes) {
    if (!Array.isArray(legacyNodes)) throw new TypeError('Legacy HUE nodes must be an array')
    return legacyNodes.map(function (node, index) {
      if (!isLegacyHueNode(node)) throw new TypeError(`Entry ${index} is not a supported legacy HUE node`)
      const profile = LEGACY_NODE_PROFILES[node.type]
      const pinShape = derivePinShape(node, profile)
      return {
        index,
        type: 'knxUltimateHueController',
        hueControllerType: profile.controllerType,
        inputs: pinShape.inputs,
        outputs: pinShape.outputs
      }
    })
  }

  function createUsageMailto (convertedCount, options = {}) {
    if (!Number.isInteger(convertedCount) || convertedCount < 1) {
      throw new TypeError('Converted HUE node count must be a positive integer')
    }
    const subject = String(options.subject || 'KNX Ultimate - legacy HUE conversion used')
    const bodyTemplate = String(options.body || 'Hello Massimo,\n\nI used the legacy HUE node conversion button.\nConverted legacy HUE nodes: {{count}}.\n\nOptional notes:\n')
    const body = bodyTemplate.replace(/{{\s*count\s*}}/g, String(convertedCount))
    return `mailto:${MIGRATION_USAGE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function openUsageMailto (mailto, environment = {}) {
    if (typeof mailto !== 'string' || !mailto.startsWith('mailto:')) {
      throw new TypeError('A valid mailto link is required')
    }
    const documentObject = environment.document
    if (!documentObject || !documentObject.body || typeof documentObject.createElement !== 'function') {
      throw new Error('The browser cannot open the email draft')
    }
    const mailFrame = documentObject.createElement('iframe')
    mailFrame.setAttribute('aria-hidden', 'true')
    mailFrame.style.display = 'none'
    mailFrame.src = mailto
    documentObject.body.appendChild(mailFrame)
    const removeMailFrame = () => {
      try {
        if (mailFrame.parentNode) mailFrame.parentNode.removeChild(mailFrame)
      } catch (error) { /* best-effort cleanup */ }
    }
    if (typeof environment.setTimeout === 'function') environment.setTimeout(removeMailFrame, 1000)
    return mailFrame
  }

  function applyLocalMigration (RED, legacyNodes) {
    if (!RED || !RED.nodes || typeof RED.nodes.getType !== 'function') throw new Error('The Node-RED editor API is unavailable')
    const patches = createLocalMigrationPatches(legacyNodes)
    const controllerDefinition = RED.nodes.getType('knxUltimateHueController')
    if (!controllerDefinition) throw new Error('The HUE Controller node is not registered')

    const previousDirty = typeof RED.nodes.dirty === 'function' ? RED.nodes.dirty() : false
    const prepared = patches.map(function (patch, index) {
      const node = legacyNodes[index]
      if (!node || !isLegacyHueNode(node) || patch.index !== index) {
        throw new Error('A legacy HUE node changed before the local conversion')
      }
      if (RED.workspaces && typeof RED.workspaces.isLocked === 'function' && RED.workspaces.isLocked(node.z)) {
        throw new Error('A flow containing a legacy HUE node is locked')
      }
      return {
        node,
        oldValues: {
          type: node.type,
          _def: node._def,
          _: node._,
          hueControllerType: node.hueControllerType,
          inputs: node.inputs,
          outputs: node.outputs
        },
        oldChanged: node.changed,
        patch
      }
    })

    const applied = []
    try {
      prepared.forEach(function (entry) {
        const { node, patch } = entry
        node.type = patch.type
        node._def = controllerDefinition
        node._ = controllerDefinition._ || RED._
        node.hueControllerType = patch.hueControllerType
        node.inputs = patch.inputs
        node.outputs = patch.outputs
        node.changed = true
        node.dirty = true
        if (RED.editor && typeof RED.editor.validateNode === 'function') RED.editor.validateNode(node)
        if (RED.events && typeof RED.events.emit === 'function') RED.events.emit('nodes:change', node)
        applied.push(entry)
      })
    } catch (error) {
      applied.reverse().forEach(function (entry) {
        Object.entries(entry.oldValues).forEach(([key, value]) => { entry.node[key] = value })
        entry.node.changed = entry.oldChanged
        entry.node.dirty = true
      })
      if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(previousDirty)
      if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw(true)
      throw error
    }

    if (RED.history && typeof RED.history.push === 'function' && prepared.length > 0) {
      const events = prepared.map((entry) => ({
        t: 'edit',
        node: entry.node,
        changes: entry.oldValues,
        changed: entry.oldChanged,
        dirty: previousDirty
      }))
      RED.history.push(events.length === 1 ? events[0] : { t: 'multi', events })
    }
    if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(true)
    if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw(true)
    return prepared.length
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
    MIGRATION_DONATION_URL,
    MIGRATION_USAGE_EMAIL,
    applyLocalMigration,
    collectLegacyHueNodes,
    copyTextToClipboard,
    convertLegacyHueFlow,
    convertLegacyHueFlowJson,
    createLocalMigrationPatches,
    createUsageMailto,
    derivePinShape,
    isLegacyHueNode,
    openUsageMailto
  }
}))
