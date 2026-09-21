(function (root, factory) {
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateUpgradeToV8 = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  const PACKAGE_NAME = 'node-red-contrib-knx-ultimate'
  const TARGET_VERSION = '8.0.1-beta.0'
  const HUE_PACKAGE = Object.freeze({
    name: 'node-red-contrib-hue-ultimate',
    version: '1.0.2',
    types: Object.freeze(['hueUltimateController', 'hue-ultimate-config'])
  })
  const MATTER_PACKAGE = Object.freeze({
    name: 'node-red-contrib-matter-ultimate',
    version: '1.0.3',
    types: Object.freeze(['matterUltimateController', 'matterUltimateBridge', 'matter-ultimate-config', 'matter-ultimate-bridge-config'])
  })
  const HUE_TYPE_MAP = Object.freeze({
    'hue-config': 'hue-ultimate-config',
    knxUltimateHueController: 'hueUltimateController',
    knxUltimateHueLight: 'hueUltimateController',
    knxUltimateHuePlug: 'hueUltimateController',
    knxUltimateHueButton: 'hueUltimateController',
    knxUltimateHueTapDial: 'hueUltimateController',
    knxUltimateHueMotion: 'hueUltimateController',
    knxUltimateHueAreaMotion: 'hueUltimateController',
    knxUltimateHueCameraMotion: 'hueUltimateController',
    knxUltimateHueContactSensor: 'hueUltimateController',
    knxUltimateHueLightSensor: 'hueUltimateController',
    knxUltimateHueTemperatureSensor: 'hueUltimateController',
    knxUltimateHueHumiditySensor: 'hueUltimateController',
    knxUltimateHueScene: 'hueUltimateController',
    knxUltimateHueBattery: 'hueUltimateController',
    knxUltimateHueZigbeeConnectivity: 'hueUltimateController',
    knxUltimateHuedevice_software_update: 'hueUltimateController'
  })
  const MATTER_TYPE_MAP = Object.freeze({
    'matter-config': 'matter-ultimate-config',
    'matterbridge-config': 'matter-ultimate-bridge-config',
    knxUltimateMatterControllerDevice: 'matterUltimateController',
    knxUltimateMatterBridge: 'matterUltimateBridge',
    // This short-lived beta type is still blocked by the version 8 install
    // guard. Its saved contract is compatible with the standalone Controller.
    knxUltimateMatterLight: 'matterUltimateController'
  })
  const AI_TYPES = Object.freeze(new Set(['knxUltimateAI', 'knxUltimateAIHomeAssistant']))
  const HUE_TARGET_TYPES = Object.freeze(new Set(HUE_PACKAGE.types))
  const MATTER_TARGET_TYPES = Object.freeze(new Set(MATTER_PACKAGE.types))
  const I18N_PREFIX = 'node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.v8_upgrade.'
  const EVENT_NAMESPACE = '.knxUltimateV8Upgrade'
  const installations = new WeakMap()
  const blockedUpgrades = new WeakSet()

  function translate (RED, key, fallback, values = {}) {
    const qualifiedKey = I18N_PREFIX + key
    let result
    try { result = RED._(qualifiedKey, values) } catch (error) { /* use fallback */ }
    result = result && result !== qualifiedKey ? result : fallback
    return String(result).replace(/{{\s*(\w+)\s*}}/g, (match, name) => (
      values[name] === undefined ? match : String(values[name])
    ))
  }

  function collectAllNodes (RED) {
    const nodes = new Map()
    const visit = node => {
      if (node && typeof node.id === 'string') nodes.set(node.id, node)
    }
    if (RED && RED.nodes) {
      if (typeof RED.nodes.eachNode === 'function') RED.nodes.eachNode(visit)
      if (typeof RED.nodes.eachConfig === 'function') RED.nodes.eachConfig(visit)
    }
    return Array.from(nodes.values())
  }

  function assertUnlocked (RED, node) {
    if (!node || !node.z) return
    const workspace = typeof RED.nodes.workspace === 'function' ? RED.nodes.workspace(node.z) : null
    const subflow = typeof RED.nodes.subflow === 'function' ? RED.nodes.subflow(node.z) : null
    if ((workspace && workspace.locked) || (subflow && subflow.locked) ||
        (RED.workspaces && typeof RED.workspaces.isLocked === 'function' && RED.workspaces.isLocked(node.z))) {
      throw new Error('A flow containing nodes that need conversion is locked: ' + node.z)
    }
  }

  function unknownOriginalValues (node) {
    if (!node || node.type !== 'unknown' || !node._orig) return {}
    const protectedKeys = new Set([
      'id', 'type', 'z', 'g', 'x', 'y', 'wires', '_def', '_', '_orig',
      'changed', 'dirty', 'resize', 'valid', 'validationErrors'
    ])
    return Object.keys(node._orig).reduce((values, key) => {
      if (!protectedKeys.has(key)) values[key] = node._orig[key]
      return values
    }, {})
  }

  function migrationSource (node, sourceType) {
    if (!node || node.type !== 'unknown' || !node._orig) return { ...node, type: sourceType }
    return {
      ...node._orig,
      id: node.id,
      type: sourceType,
      z: node.z,
      g: node.g,
      x: node.x,
      y: node.y,
      wires: node.wires
    }
  }

  function createMigrationPlan (RED, options = {}) {
    if (!RED || !RED.nodes) throw new Error('The Node-RED editor API is unavailable')
    const environment = options.environment || root || {}
    const utilityApi = options.utilityApi || environment.KNXUltimateUtilityMigration
    const hueApi = options.hueApi || environment.KNXUltimateHueControllerMigration
    if (!utilityApi || !utilityApi.LEGACY_NODE_PROFILES || typeof utilityApi.createLocalMigrationPatches !== 'function') {
      throw new Error('The KNX Utility migration component is unavailable')
    }
    if (!hueApi || !hueApi.LEGACY_NODE_PROFILES || typeof hueApi.createLocalMigrationPatches !== 'function') {
      throw new Error('The HUE migration component is unavailable')
    }

    const entries = []
    const ai = []
    const missingStandalone = { hue: [], matter: [] }
    const counts = { utility: 0, hue: 0, matter: 0, total: 0 }
    collectAllNodes(RED).forEach(node => {
      const originalType = node.type === 'unknown' && node._orig && node._orig.type
      const savedType = node.type === 'unknown'
        ? (originalType || node.name)
        : node.type
      if (node.type === 'unknown' && HUE_TARGET_TYPES.has(savedType)) {
        missingStandalone.hue.push(node)
        return
      }
      if (node.type === 'unknown' && MATTER_TARGET_TYPES.has(savedType)) {
        missingStandalone.matter.push(node)
        return
      }
      const sourceType = node.type === 'unknown' && originalType
        ? originalType
        : node.type
      const fromUnknown = node.type === 'unknown' && Boolean(originalType)
      if (AI_TYPES.has(savedType)) {
        ai.push(node)
        return
      }

      if (Object.prototype.hasOwnProperty.call(utilityApi.LEGACY_NODE_PROFILES, sourceType)) {
        assertUnlocked(RED, node)
        const patch = utilityApi.createLocalMigrationPatches([migrationSource(node, sourceType)])[0]
        const values = {
          ...unknownOriginalValues(node),
          utilityType: patch.utilityType,
          inputs: patch.inputs,
          outputs: patch.outputs
        }
        if (patch.haTranslationTable !== undefined) values.haTranslationTable = patch.haTranslationTable
        entries.push({ node, sourceType, targetType: 'knxUltimateUtility', family: 'utility', values, removeOriginal: fromUnknown })
        counts.utility += 1
        return
      }

      if (Object.prototype.hasOwnProperty.call(HUE_TYPE_MAP, sourceType)) {
        assertUnlocked(RED, node)
        const values = unknownOriginalValues(node)
        if (Object.prototype.hasOwnProperty.call(hueApi.LEGACY_NODE_PROFILES, sourceType)) {
          const patch = hueApi.createLocalMigrationPatches([migrationSource(node, sourceType)])[0]
          values.hueControllerType = patch.hueControllerType
          values.inputs = patch.inputs
          values.outputs = patch.outputs
        }
        entries.push({ node, sourceType, targetType: HUE_TYPE_MAP[sourceType], family: 'hue', values, removeOriginal: fromUnknown })
        counts.hue += 1
        return
      }

      if (Object.prototype.hasOwnProperty.call(MATTER_TYPE_MAP, sourceType)) {
        assertUnlocked(RED, node)
        const values = unknownOriginalValues(node)
        entries.push({ node, sourceType, targetType: MATTER_TYPE_MAP[sourceType], family: 'matter', values, removeOriginal: fromUnknown })
        counts.matter += 1
      }
    })
    counts.total = entries.length
    return {
      entries,
      ai,
      missingStandalone,
      counts,
      needsHue: counts.hue > 0 || missingStandalone.hue.length > 0,
      needsMatter: counts.matter > 0 || missingStandalone.matter.length > 0
    }
  }

  function snapshot (node, keys) {
    return keys.reduce((state, key) => {
      state[key] = Object.getOwnPropertyDescriptor(node, key)
      return state
    }, {})
  }

  function restore (node, state) {
    Object.keys(state).forEach(key => {
      const descriptor = state[key]
      if (key === 'changed' || key === 'moved') {
        // These assignments must pass through Node-RED's node Proxy so its
        // per-workspace dirty tracking is resynchronised after a rollback.
        const currentDescriptor = Object.getOwnPropertyDescriptor(node, key)
        const targetValue = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value')
          ? descriptor.value
          : undefined
        if (Boolean(currentDescriptor) !== Boolean(descriptor) || node[key] !== targetValue) node[key] = targetValue
      }
      if (descriptor) Object.defineProperty(node, key, descriptor)
      else delete node[key]
    })
  }

  function snapshotValidationState (RED) {
    const objects = new Set(collectAllNodes(RED))
    const collect = method => {
      if (RED.nodes && typeof RED.nodes[method] === 'function') RED.nodes[method](value => objects.add(value))
    }
    for (const method of ['eachGroup', 'eachJunction', 'eachSubflow', 'eachWorkspace']) collect(method)
    const keys = ['changed', 'moved', 'dirty', 'resize', 'valid', 'validationErrors']
    return Array.from(objects).filter(Boolean).map(value => ({ value, state: snapshot(value, keys) }))
  }

  function restoreValidationState (states) {
    states.forEach(item => restore(item.value, item.state))
  }

  function applyMigrationPlan (RED, plan) {
    if (!plan || !Array.isArray(plan.entries)) throw new Error('The version 8 migration plan is invalid')
    if (plan.ai && plan.ai.length) throw new Error('Legacy KNX AI nodes require manual migration')

    const previousDirty = typeof RED.nodes.dirty === 'function' ? RED.nodes.dirty() : false
    const validationState = snapshotValidationState(RED)
    const prepared = plan.entries.map(entry => {
      const currentType = entry.node && entry.node.type === 'unknown' && entry.node._orig
        ? entry.node._orig.type
        : entry.node && entry.node.type
      if (!entry.node || currentType !== entry.sourceType) throw new Error('A node changed while the version 8 upgrade was running')
      if (typeof RED.nodes.node === 'function' && RED.nodes.node(entry.node.id) !== entry.node) {
        throw new Error('A node changed while the version 8 upgrade was running')
      }
      assertUnlocked(RED, entry.node)
      const definition = RED.nodes.getType(entry.targetType)
      if (!definition) throw new Error('Target node type is not loaded: ' + entry.targetType)
      const values = {
        type: entry.targetType,
        _def: definition,
        _: definition._ || RED._,
        ...entry.values
      }
      const keys = [...Object.keys(values), '_orig', 'changed', 'moved', 'dirty', 'resize', 'valid', 'validationErrors', '_colorChanged', 'w']
      return {
        ...entry,
        values,
        state: snapshot(entry.node, keys)
      }
    })

    const applied = []
    try {
      prepared.forEach(entry => {
        applied.push(entry)
        Object.assign(entry.node, entry.values, { changed: true, dirty: true, resize: true })
        if (entry.removeOriginal) delete entry.node._orig
        delete entry.node.w
        delete entry.node._colorChanged
      })
    } catch (error) {
      applied.reverse().forEach(entry => restore(entry.node, entry.state))
      restoreValidationState(validationState)
      if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(previousDirty)
      try {
        if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw(true)
      } catch (refreshError) { /* preserve the migration error */ }
      throw error
    }

    try {
      if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(true)
    } catch (error) {
      prepared.slice().reverse().forEach(entry => restore(entry.node, entry.state))
      restoreValidationState(validationState)
      try {
        if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(previousDirty)
      } catch (restoreError) { /* preserve the migration error */ }
      throw error
    }
    let active = true
    const result = { ...plan.counts }
    Object.defineProperties(result, {
      commit: {
        value: function () { active = false }
      },
      rollback: {
        value: function () {
          if (!active) return
          active = false
          prepared.slice().reverse().forEach(entry => restore(entry.node, entry.state))
          restoreValidationState(validationState)
          if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(previousDirty)
          prepared.forEach(entry => {
            try {
              if (RED.events && typeof RED.events.emit === 'function') RED.events.emit('nodes:change', entry.node)
            } catch (error) { /* best-effort editor refresh */ }
          })
          try {
            if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw(true)
          } catch (error) { /* best-effort editor refresh */ }
        }
      }
    })
    return result
  }

  function legacyNodes (nodes) {
    const utilityTypes = new Set([
      'knxUltimateAlerter', 'knxUltimateAutoResponder', 'knxUltimateDateTime', 'knxUltimateWatchDog',
      'knxUltimateGlobalContext', 'knxUltimateLogger', 'knxUltimateStaircase', 'knxUltimateGarage',
      'knxUltimateSceneController', 'knxUltimateLoadControl', 'knxUltimateHATranslator'
    ])
    return nodes.filter(node => (
      utilityTypes.has(node.type) || Object.prototype.hasOwnProperty.call(HUE_TYPE_MAP, node.type) ||
      Object.prototype.hasOwnProperty.call(MATTER_TYPE_MAP, node.type) || AI_TYPES.has(node.type)
    ))
  }

  function assertNoLegacyNodes (RED) {
    const remaining = legacyNodes(collectAllNodes(RED))
    if (remaining.length) throw new Error('Legacy node types remain after conversion: ' + remaining.map(node => node.type).join(', '))
  }

  function validateDeployable (RED) {
    const invalid = []
    const unknown = []
    collectAllNodes(RED).forEach(node => {
      if (node.type === 'unknown' || (node._def && node._def.category === 'unknown')) {
        unknown.push(node.id)
        return
      }
      if (RED.editor && typeof RED.editor.validateNode === 'function') RED.editor.validateNode(node)
      if (node.valid === false && node.d !== true) invalid.push(node.id)
    })
    if (unknown.length) throw new Error('Unknown nodes must be resolved before the automatic upgrade: ' + unknown.join(', '))
    if (invalid.length) throw new Error('Invalid nodes must be corrected before the automatic upgrade: ' + invalid.join(', '))
  }

  function validatePreflight (RED, plan) {
    const migrating = new Set((plan && plan.entries ? plan.entries : []).map(entry => entry.node))
    const expectedUnknown = new Set([
      ...((plan && plan.missingStandalone && plan.missingStandalone.hue) || []),
      ...((plan && plan.missingStandalone && plan.missingStandalone.matter) || [])
    ])
    const invalid = []
    const unknown = []
    collectAllNodes(RED).forEach(node => {
      if (migrating.has(node) || expectedUnknown.has(node) || (plan && plan.ai && plan.ai.includes(node))) return
      if (node.type === 'unknown' || (node._def && node._def.category === 'unknown')) {
        unknown.push(node.id)
        return
      }
      if (RED.editor && typeof RED.editor.validateNode === 'function') RED.editor.validateNode(node)
      if (node.valid === false && node.d !== true) invalid.push(node.id)
    })
    if (unknown.length) throw new Error('Unknown nodes must be resolved before the automatic upgrade: ' + unknown.join(', '))
    if (invalid.length) throw new Error('Invalid nodes must be corrected before the automatic upgrade: ' + invalid.join(', '))
  }

  function requestError (xhr, fallback) {
    const detail = xhr && xhr.responseJSON && xhr.responseJSON.message
      ? xhr.responseJSON.message
      : xhr && xhr.responseText ? xhr.responseText : fallback
    const error = new Error(String(detail || 'Node-RED request failed'))
    if (xhr && xhr.status !== undefined) error.status = xhr.status
    if (xhr && xhr.responseJSON && xhr.responseJSON.code) error.code = xhr.responseJSON.code
    return error
  }

  function requestJson (options, settings) {
    if (typeof options.request === 'function') return Promise.resolve().then(() => options.request(settings))
    const $ = options.$ || (options.environment && options.environment.jQuery)
    if (!$ || typeof $.ajax !== 'function') return Promise.reject(new Error('The Node-RED HTTP API is unavailable'))
    return new Promise((resolve, reject) => {
      $.ajax(settings)
        .done((data) => resolve(data))
        .fail((xhr) => reject(requestError(xhr, settings.url)))
    })
  }

  function boundedRequestTimeout (options, key, fallback) {
    const configured = options[key] === undefined ? fallback : options[key]
    const cap = options.singleRequestTimeout
    if (cap === undefined) return configured
    return Math.max(1, Math.min(configured, cap))
  }

  function hasTypes (RED, types) {
    return types.every(type => Boolean(RED.nodes.getType(type)))
  }

  function waitForTypes (RED, types, options = {}) {
    if (hasTypes(RED, types)) return Promise.resolve()
    const environment = options.environment || root
    const timeout = options.typeLoadTimeout === undefined ? 30000 : options.typeLoadTimeout
    const interval = options.typeLoadInterval === undefined ? 100 : options.typeLoadInterval
    if (!environment || typeof environment.setTimeout !== 'function') {
      return Promise.reject(new Error('The browser timer API is unavailable'))
    }
    return new Promise((resolve, reject) => {
      const started = Date.now()
      const check = () => {
        if (hasTypes(RED, types)) return resolve()
        if (Date.now() - started >= timeout) return reject(new Error('Installed node types did not load: ' + types.join(', ')))
        environment.setTimeout(check, interval)
      }
      check()
    })
  }

  function isTransientRequestError (error) {
    return Boolean(error && (error.status === 0 || (error.status >= 500 && error.status <= 599)))
  }

  function isReconcileableDeployError (error) {
    return isTransientRequestError(error) || Boolean(error && error.status === 409)
  }

  async function getModuleInfo (descriptor, options) {
    return requestJson(options, {
      url: 'nodes/' + encodeURIComponent(descriptor.name),
      type: 'GET',
      cache: false,
      timeout: boundedRequestTimeout(options, 'moduleInfoRequestTimeout', 10000),
      headers: { Accept: 'application/json' }
    })
  }

  async function getOptionalModuleInfo (descriptor, options) {
    try {
      return await getModuleInfo(descriptor, options)
    } catch (error) {
      if (error && (error.status === 404 || error.code === 'not_found')) return null
      throw error
    }
  }

  function moduleIsEnabled (info) {
    return Boolean(info && Array.isArray(info.nodes) && info.nodes.every(nodeSet => nodeSet.enabled !== false))
  }

  function parseVersion (value) {
    const match = String(value || '').trim().match(/^[~^<>=\s]*v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/)
    if (!match) return null
    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
      prerelease: match[4] || ''
    }
  }

  function compareVersions (left, right) {
    for (const key of ['major', 'minor', 'patch']) {
      if (left[key] !== right[key]) return left[key] > right[key] ? 1 : -1
    }
    if (left.prerelease === right.prerelease) return 0
    if (!left.prerelease) return 1
    if (!right.prerelease) return -1
    return left.prerelease.localeCompare(right.prerelease)
  }

  function isCompatibleVersion (value, targetValue) {
    const current = parseVersion(value)
    const target = parseVersion(targetValue)
    return Boolean(current && target && current.major === target.major && compareVersions(current, target) >= 0)
  }

  function assertModuleUsable (info, descriptor) {
    const failed = info && Array.isArray(info.nodes)
      ? info.nodes.find(nodeSet => nodeSet.err || nodeSet.runtime === false)
      : null
    if (failed) throw new Error('The installed package could not start: ' + descriptor.name + (failed.err ? ' (' + failed.err + ')' : ''))
  }

  async function enableModule (descriptor, options) {
    return requestJson(options, {
      url: 'nodes/' + encodeURIComponent(descriptor.name),
      type: 'PUT',
      data: JSON.stringify({ enabled: true }),
      timeout: boundedRequestTimeout(options, 'moduleEnableRequestTimeout', 30000),
      contentType: 'application/json; charset=utf-8'
    })
  }

  async function requestModuleInstall (descriptor, options) {
    return requestJson(options, {
      url: 'nodes',
      type: 'POST',
      data: JSON.stringify({ module: descriptor.name, version: descriptor.version }),
      timeout: boundedRequestTimeout(options, 'moduleInstallRequestTimeout', 120000),
      contentType: 'application/json; charset=utf-8'
    })
  }

  async function waitForModuleVersion (descriptor, options) {
    const environment = options.environment || root
    const timeout = options.moduleLoadTimeout === undefined ? 30000 : options.moduleLoadTimeout
    const interval = options.moduleLoadInterval === undefined ? 500 : options.moduleLoadInterval
    const started = Date.now()
    do {
      try {
        const remaining = Math.max(1, timeout - (Date.now() - started))
        const info = await getOptionalModuleInfo(descriptor, { ...options, singleRequestTimeout: remaining })
        if (info && (info.pending_version || isCompatibleVersion(info.version, descriptor.version))) return info
      } catch (error) {
        if (error && (error.status === 401 || error.status === 403)) throw error
      }
      if (Date.now() - started >= timeout) break
      if (!environment || typeof environment.setTimeout !== 'function') break
      await new Promise(resolve => environment.setTimeout(resolve, interval))
    } while (Date.now() - started < timeout)
    return null
  }

  function standaloneRestartError (descriptors) {
    const names = descriptors.map(descriptor => descriptor.name).join(', ')
    const error = new Error('Updated standalone package' + (descriptors.length === 1 ? '' : 's') +
      ' ' + names + '. Restart the Node-RED service, reload the editor, then press the upgrade button again. No flows were changed.')
    error.code = 'standalone_restart_required'
    return error
  }

  function moduleInstallUncertainError (cause, descriptor) {
    const error = new Error('The package operation for ' + descriptor.name +
      ' may still be running. Restart the Node-RED service, reload the editor and press the upgrade button again. Do not deploy flows before restarting.')
    error.code = 'module_install_uncertain'
    error.moduleInstallUncertain = true
    if (cause && cause.status !== undefined) error.status = cause.status
    return error
  }

  async function ensureModule (RED, descriptor, options) {
    let info = await getOptionalModuleInfo(descriptor, options)
    if (info) {
      if (info.pending_version) {
        return { installed: false, updated: false, restartRequired: true, info }
      }
      if (!isCompatibleVersion(info.version, descriptor.version)) {
        const current = parseVersion(info.version)
        const target = parseVersion(descriptor.version)
        if (!current || !target || compareVersions(current, target) >= 0) {
          throw new Error('Package ' + descriptor.name + ' has an unsupported version: ' + String(info.version || 'unknown'))
        }
        try {
          info = await requestModuleInstall(descriptor, options)
        } catch (error) {
          if (!isTransientRequestError(error)) throw error
          info = await waitForModuleVersion(descriptor, options)
          if (!info) throw moduleInstallUncertainError(error, descriptor)
        }
        return { installed: false, updated: true, restartRequired: true, info }
      }
      if (!moduleIsEnabled(info)) info = await enableModule(descriptor, options)
      assertModuleUsable(info, descriptor)
      if (!hasTypes(RED, descriptor.types)) {
        try {
          await waitForTypes(RED, descriptor.types, options)
        } catch (error) {
          throw moduleInstallUncertainError(error, descriptor)
        }
      }
      return { installed: false, updated: false, restartRequired: false, info }
    }
    try {
      info = await requestModuleInstall(descriptor, options)
    } catch (error) {
      if (error.code === 'module_already_loaded' || /already loaded/i.test(error.message)) {
        info = await getOptionalModuleInfo(descriptor, options)
        if (!info) throw error
        return ensureModule(RED, descriptor, options)
      } else if (!isTransientRequestError(error)) {
        throw error
      } else {
        info = await waitForModuleVersion(descriptor, options)
        if (!info) throw moduleInstallUncertainError(error, descriptor)
      }
    }
    if (!info) info = await waitForModuleVersion(descriptor, options)
    if (!info) throw moduleInstallUncertainError(null, descriptor)
    if (info.pending_version) {
      return { installed: false, updated: true, restartRequired: true, info }
    }
    if (info.version && !isCompatibleVersion(info.version, descriptor.version)) {
      const current = parseVersion(info.version)
      const target = parseVersion(descriptor.version)
      if (current && target && compareVersions(current, target) < 0) {
        throw moduleInstallUncertainError(null, descriptor)
      }
      throw new Error('Package ' + descriptor.name + ' has an unsupported version: ' + String(info.version))
    }
    if (Array.isArray(info.nodes) && !moduleIsEnabled(info)) info = await enableModule(descriptor, options)
    assertModuleUsable(info, descriptor)
    try {
      await waitForTypes(RED, descriptor.types, options)
    } catch (error) {
      throw moduleInstallUncertainError(error, descriptor)
    }
    return { installed: true, updated: false, restartRequired: false, info }
  }

  function clearEditorStateAfterDeploy (RED, flows, response) {
    if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(false)
    if (typeof RED.nodes.version === 'function' && response && response.rev !== undefined) RED.nodes.version(response.rev)
    if (typeof RED.nodes.originalFlow === 'function') RED.nodes.originalFlow(flows)
    const flowsToLock = new Set()
    const ensureUnlocked = id => {
      const flow = id && ((typeof RED.nodes.workspace === 'function' && RED.nodes.workspace(id)) ||
        (typeof RED.nodes.subflow === 'function' && RED.nodes.subflow(id)))
      if (flow && flow.locked) {
        flow.locked = false
        flowsToLock.add(flow)
      }
    }
    try {
      const cleanCanvasNode = node => {
        ensureUnlocked(node.z)
        if (node.changed) { node.dirty = true; node.changed = false }
        if (node.moved) { node.dirty = true; node.moved = false }
      }
      if (typeof RED.nodes.eachNode === 'function') {
        RED.nodes.eachNode(node => {
          cleanCanvasNode(node)
          if (node.credentials) delete node.credentials
        })
      }
      if (typeof RED.nodes.eachGroup === 'function') RED.nodes.eachGroup(cleanCanvasNode)
      if (typeof RED.nodes.eachJunction === 'function') RED.nodes.eachJunction(cleanCanvasNode)
      if (typeof RED.nodes.eachConfig === 'function') {
        RED.nodes.eachConfig(node => {
          if (node.z) ensureUnlocked(node.z)
          node.changed = false
          if (node.credentials) delete node.credentials
        })
      }
      if (typeof RED.nodes.eachSubflow === 'function') RED.nodes.eachSubflow(subflow => { subflow.changed = false })
      if (typeof RED.nodes.eachWorkspace === 'function') {
        RED.nodes.eachWorkspace(workspace => {
          if (workspace.changed || workspace.added) {
            ensureUnlocked(workspace.z)
            workspace.changed = false
            delete workspace.added
            if (RED.events && typeof RED.events.emit === 'function') RED.events.emit('flows:change', workspace)
          }
        })
      }
    } finally {
      flowsToLock.forEach(flow => { flow.locked = true })
    }
    if (RED.history && typeof RED.history.markAllDirty === 'function') RED.history.markAllDirty()
    if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw()
    if (RED.events && typeof RED.events.emit === 'function') RED.events.emit('deploy')
  }

  function stableFlowSignature (flows) {
    function normalize (value) {
      if (Array.isArray(value)) return value.map(normalize)
      if (!value || typeof value !== 'object') return value
      const result = {}
      Object.keys(value).sort().forEach(key => {
        if (key !== 'credentials') result[key] = normalize(value[key])
      })
      return result
    }
    return JSON.stringify((flows || []).map(normalize))
  }

  function flowsContainCredentials (flows) {
    return (flows || []).some(node => node && Object.prototype.hasOwnProperty.call(node, 'credentials'))
  }

  function uncertainPersistenceError (cause, message) {
    const error = new Error(message)
    error.code = 'flow_persistence_uncertain'
    error.persistenceUncertain = true
    if (cause && cause.status !== undefined) error.status = cause.status
    return error
  }

  function flowConflictError (cause) {
    const error = new Error('Another editor changed the flow revision during the upgrade. The automatic conversion was rolled back locally. Review or export any pre-existing local changes, then reload the editor before trying again.')
    error.code = 'flow_revision_conflict'
    error.flowConflict = true
    if (cause && cause.status !== undefined) error.status = cause.status
    return error
  }

  async function waitForPersistedFlows (options, plan, expectedFlows, cause) {
    const conflict = Boolean(cause && cause.status === 409)
    const containsCredentials = flowsContainCredentials(expectedFlows)
    if (!conflict && containsCredentials) {
      throw uncertainPersistenceError(cause,
        'The flow deploy connection was interrupted while credentials were included, so the saved state cannot be verified safely. Reload the editor before trying again; no automatic rollback was applied.')
    }
    const environment = options.environment || root
    const timeout = conflict
      ? 0
      : (options.flowPersistTimeout === undefined ? 30000 : options.flowPersistTimeout)
    const interval = options.flowPersistInterval === undefined ? 500 : options.flowPersistInterval
    const started = Date.now()
    do {
      try {
        const remaining = Math.max(1, timeout - (Date.now() - started))
        const verifyOptions = timeout === 0 ? options : { ...options, singleRequestTimeout: remaining }
        const savedFlows = await verifySavedFlows(verifyOptions, plan)
        if (!containsCredentials && stableFlowSignature(savedFlows) === stableFlowSignature(expectedFlows)) return savedFlows
      } catch (error) {
        // A transient POST can complete after its client connection closes. Until
        // the timeout, an old flow or a temporary GET failure is not conclusive.
      }
      if (Date.now() - started >= timeout) break
      if (!environment || typeof environment.setTimeout !== 'function') break
      await new Promise(resolve => environment.setTimeout(resolve, interval))
    } while (Date.now() - started < timeout)

    if (conflict) throw flowConflictError(cause)
    throw uncertainPersistenceError(cause,
      'The flow deploy response was interrupted and the saved state could not be verified. Reload the editor before trying again; no automatic rollback was applied.')
  }

  async function deployFlows (RED, options) {
    const flows = RED.nodes.createCompleteNodeSet()
    if (!Array.isArray(flows)) throw new Error('The Node-RED flow export API returned invalid data')
    const payload = { flows }
    if (typeof RED.nodes.version === 'function') payload.rev = RED.nodes.version()
    let response
    if (RED.deploy && typeof RED.deploy.setDeployInflight === 'function') RED.deploy.setDeployInflight(true)
    try {
      try {
        response = await requestJson(options, {
          url: 'flows',
          type: 'POST',
          data: JSON.stringify(payload),
          timeout: boundedRequestTimeout(options, 'deployRequestTimeout', 60000),
          contentType: 'application/json; charset=utf-8',
          headers: {
            'Node-RED-API-Version': 'v2',
            'Node-RED-Deployment-Type': 'full'
          }
        })
      } catch (error) {
        if (!isReconcileableDeployError(error)) throw error
        const savedFlows = await waitForPersistedFlows(options, options.plan, flows, error)
        response = { rev: savedFlows.revision }
      }
      if (typeof options.onPersisted === 'function') options.onPersisted(response, flows)
      try {
        clearEditorStateAfterDeploy(RED, flows, response)
      } catch (error) {
        const logger = options.environment && options.environment.console
        if (logger && typeof logger.warn === 'function') logger.warn('KNX Ultimate v8 upgrade editor cleanup failed', error)
      }
    } finally {
      if (RED.deploy && typeof RED.deploy.setDeployInflight === 'function') RED.deploy.setDeployInflight(false)
    }
    return response
  }

  async function verifySavedFlows (options, plan) {
    const response = await requestJson(options, {
      url: 'flows',
      type: 'GET',
      cache: false,
      timeout: boundedRequestTimeout(options, 'flowRequestTimeout', 10000),
      headers: { 'Node-RED-API-Version': 'v2' }
    })
    const flows = Array.isArray(response) ? response : response && response.flows
    if (!Array.isArray(flows)) throw new Error('Unable to verify the deployed flow')
    const remaining = legacyNodes(flows)
    if (remaining.length) throw new Error('The deployed flow still contains legacy nodes: ' + remaining.map(node => node.type).join(', '))
    if (plan && Array.isArray(plan.entries)) {
      const savedById = new Map(flows.map(node => [node.id, node]))
      const mismatch = plan.entries.find(entry => !savedById.has(entry.node.id) || savedById.get(entry.node.id).type !== entry.targetType)
      if (mismatch) throw new Error('The deployed flow could not be verified for node: ' + mismatch.node.id)
    }
    Object.defineProperty(flows, 'revision', { value: response && response.rev })
    return flows
  }

  async function installKnxV8 (options) {
    const descriptor = { name: PACKAGE_NAME, version: TARGET_VERSION }
    const current = await getModuleInfo(descriptor, options)
    if (current && current.pending_version) {
      if (isCompatibleVersion(current.pending_version, TARGET_VERSION)) return current
      throw moduleInstallUncertainError(null, descriptor)
    }
    if (current && isCompatibleVersion(current.version, TARGET_VERSION)) return current
    const currentVersion = current && parseVersion(current.version)
    const targetVersion = parseVersion(TARGET_VERSION)
    if (currentVersion && targetVersion && compareVersions(currentVersion, targetVersion) > 0) {
      throw new Error('A newer incompatible KNX Ultimate version is already installed: ' + current.version)
    }
    try {
      const result = await requestModuleInstall(descriptor, options)
      if (result && result.pending_version) {
        if (!isCompatibleVersion(result.pending_version, TARGET_VERSION)) {
          throw moduleInstallUncertainError(null, descriptor)
        }
      } else if (result && result.version && !isCompatibleVersion(result.version, TARGET_VERSION)) {
        throw moduleInstallUncertainError(null, descriptor)
      }
      return result
    } catch (error) {
      if (!isTransientRequestError(error)) throw error
      // npm may keep running after a proxy timeout. Poll the registry instead
      // of starting a second package update over the first one.
      const info = await waitForModuleVersion(descriptor, options)
      if (info && info.pending_version) {
        if (isCompatibleVersion(info.pending_version, TARGET_VERSION)) return info
        throw moduleInstallUncertainError(error, descriptor)
      }
      if (info && isCompatibleVersion(info.version, TARGET_VERSION)) return info
      throw moduleInstallUncertainError(error, descriptor)
    }
  }

  function disposeStandaloneMigrationPrompts (environment) {
    for (const name of ['HueUltimateMigration', 'MatterUltimateMigration']) {
      const migration = environment && environment[name]
      try {
        if (migration && typeof migration.dispose === 'function') migration.dispose()
      } catch (error) { /* the upgrade owns the editor while it is running */ }
    }
  }

  async function runUpgrade (RED, plan, options = {}) {
    const environment = options.environment || root || {}
    const progress = typeof options.onProgress === 'function' ? options.onProgress : function () {}
    const replanAfterInstall = Boolean(plan.missingStandalone &&
      (((plan.missingStandalone.hue || []).length) || ((plan.missingStandalone.matter || []).length)))
    const restartDescriptors = []
    disposeStandaloneMigrationPrompts(environment)
    if (plan.needsHue) {
      progress('install_hue')
      const result = await ensureModule(RED, HUE_PACKAGE, { ...options, environment })
      if (result.restartRequired) restartDescriptors.push(HUE_PACKAGE)
      disposeStandaloneMigrationPrompts(environment)
    }
    if (plan.needsMatter) {
      progress('install_matter')
      let result
      try {
        result = await ensureModule(RED, MATTER_PACKAGE, { ...options, environment })
      } catch (error) {
        if (restartDescriptors.length) error.restartRequired = true
        throw error
      }
      if (result.restartRequired) restartDescriptors.push(MATTER_PACKAGE)
      disposeStandaloneMigrationPrompts(environment)
    }
    if (restartDescriptors.length) throw standaloneRestartError(restartDescriptors)
    if (replanAfterInstall) {
      plan = createMigrationPlan(RED, { ...options, environment })
      if (plan.ai.length) throw new Error('Legacy KNX AI nodes require manual migration')
      validatePreflight(RED, plan)
    }
    progress('convert')
    const counts = applyMigrationPlan(RED, plan)
    let deployed = false
    try {
      assertNoLegacyNodes(RED)
      validateDeployable(RED)
      progress('deploy')
      await deployFlows(RED, {
        ...options,
        environment,
        plan,
        onPersisted: function () {
          deployed = true
          if (typeof counts.commit === 'function') counts.commit()
        }
      })
    } catch (error) {
      if (!deployed && !error.persistenceUncertain && typeof counts.rollback === 'function') counts.rollback()
      if (error.flowConflict && typeof RED.nodes.dirty === 'function') RED.nodes.dirty(true)
      throw error
    }
    try {
      progress('verify')
      await verifySavedFlows({ ...options, environment }, plan)
      progress('install_v8')
      await installKnxV8({ ...options, environment })
    } catch (error) {
      error.flowsPersisted = true
      throw error
    }
    progress('complete')
    return counts
  }

  function closeEditor (RED, $) {
    try {
      if (RED.actions && typeof RED.actions.invoke === 'function') {
        RED.actions.invoke('core:cancel-edit-tray')
        return
      }
    } catch (error) { /* use the button fallback */ }
    if ($) $('#node-dialog-cancel:visible, #node-config-dialog-cancel:visible').first().trigger('click')
  }

  function lockEditorDeploy (RED, $) {
    let active = true
    let keyboardLocked = false
    const buttonStates = []
    let originalActionInvoke
    let guardedActionInvoke
    const blockDeployClick = event => {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    try {
      blockedUpgrades.add(RED)
      if (RED.keyboard && typeof RED.keyboard.disable === 'function') {
        RED.keyboard.disable()
        keyboardLocked = true
      }
      if (RED.actions && typeof RED.actions.invoke === 'function') {
        originalActionInvoke = RED.actions.invoke
        guardedActionInvoke = function (actionName, ...args) {
          if (actionName === 'knxUltimate:upgrade-to-v8' ||
              /^core:(?:deploy|restart-flows|start-flows|stop-flows)/.test(String(actionName))) return
          return originalActionInvoke.apply(this, [actionName, ...args])
        }
        RED.actions.invoke = guardedActionInvoke
      }
      if ($) {
        const deployButtons = $('#red-ui-header-button-deploy, #red-ui-header-button-deploy-options')
        if (deployButtons && deployButtons.length) {
          deployButtons.each(function () {
            const button = $(this)
            const state = {
              button,
              element: this,
              isMain: this.id === 'red-ui-header-button-deploy',
              wasDisabled: button.hasClass('disabled'),
              ariaDisabled: button.attr('aria-disabled'),
              pointerEvents: button.css('pointer-events')
            }
            buttonStates.push(state)
            button.addClass('disabled').attr('aria-disabled', 'true').css('pointer-events', 'none')
            if (typeof this.addEventListener === 'function') this.addEventListener('click', blockDeployClick, true)
          })
        }
      }
    } catch (error) {
      buttonStates.forEach(state => {
        if (state.element && typeof state.element.removeEventListener === 'function') {
          state.element.removeEventListener('click', blockDeployClick, true)
        }
        if (state.button && state.button.length) {
          state.button.css('pointer-events', state.pointerEvents || '')
          if (!state.wasDisabled) state.button.removeClass('disabled')
          if (state.ariaDisabled === undefined) state.button.removeAttr('aria-disabled')
          else state.button.attr('aria-disabled', state.ariaDisabled)
        }
      })
      blockedUpgrades.delete(RED)
      if (guardedActionInvoke && RED.actions && RED.actions.invoke === guardedActionInvoke) RED.actions.invoke = originalActionInvoke
      if (keyboardLocked && RED.keyboard && typeof RED.keyboard.enable === 'function') RED.keyboard.enable()
      throw error
    }
    return function unlockEditorDeploy (unlockOptions = {}) {
      if (!active) return
      active = false
      if (unlockOptions.keepDeployBlocked) return
      blockedUpgrades.delete(RED)
      const dirty = RED.nodes && typeof RED.nodes.dirty === 'function' ? RED.nodes.dirty() : true
      buttonStates.forEach(state => {
        if (state.element && typeof state.element.removeEventListener === 'function') {
          state.element.removeEventListener('click', blockDeployClick, true)
        }
        if (state.button && state.button.length) {
          state.button.css('pointer-events', state.pointerEvents || '')
          const shouldDisable = state.wasDisabled || (state.isMain && dirty === false)
          if (shouldDisable) {
            state.button.addClass('disabled').attr('aria-disabled', 'true')
          } else {
            state.button.removeClass('disabled')
            if (state.ariaDisabled === undefined) state.button.removeAttr('aria-disabled')
            else state.button.attr('aria-disabled', state.ariaDisabled)
          }
        }
      })
      if (guardedActionInvoke && RED.actions && RED.actions.invoke === guardedActionInvoke) RED.actions.invoke = originalActionInvoke
      if (keyboardLocked && RED.keyboard && typeof RED.keyboard.enable === 'function') RED.keyboard.enable()
    }
  }

  function makeMessage ($, title, paragraphs) {
    const message = $('<div></div>')
    $('<p></p>').append($('<strong></strong>').text(title)).appendTo(message)
    paragraphs.forEach(paragraph => $('<p></p>').text(paragraph).appendTo(message))
    return message
  }

  function open (RED, options = {}) {
    const environment = options.environment || root || {}
    const $ = options.$ || environment.jQuery
    if (!$ || typeof RED.notify !== 'function') throw new Error('The Node-RED editor notification API is unavailable')
    const t = (key, fallback, values) => translate(RED, key, fallback, values)
    if (blockedUpgrades.has(RED)) {
      return RED.notify(t('upgrade_locked', 'An upgrade is already running or Node-RED must be restarted/reloaded before it can be tried again.'), { type: 'warning', fixed: true })
    }
    let plan
    try {
      plan = createMigrationPlan(RED, { ...options, environment })
    } catch (error) {
      RED.notify(t('preflight_failed', 'Upgrade preflight failed:') + ' ' + error.message, { type: 'error', fixed: true })
      return
    }

    if (plan.ai.length) {
      const message = makeMessage($, t('title', 'Upgrade to KNX Ultimate 8'), [
        t('ai_blocked', 'Found {{count}} legacy KNX AI nodes. The automatic upgrade stopped before making changes. Replace or remove those nodes first; their configuration cannot be converted safely to Cerebrum Ultimate.', { count: plan.ai.length })
      ])
      return RED.notify(message, { type: 'error', fixed: true, modal: true })
    }
    try {
      validatePreflight(RED, plan)
    } catch (error) {
      RED.notify(t('preflight_failed', 'Upgrade preflight failed:') + ' ' + error.message, { type: 'error', fixed: true })
      return
    }
    const needsModuleInspection = plan.needsHue || plan.needsMatter
    if (RED.user && typeof RED.user.hasPermission === 'function' &&
        (!RED.user.hasPermission('flows.read') || !RED.user.hasPermission('flows.write') ||
         (needsModuleInspection && !RED.user.hasPermission('nodes.read')))) {
      return RED.notify(t('permission_denied', 'Your Node-RED account cannot install nodes or deploy flows.'), { type: 'error', fixed: true })
    }

    const values = plan.counts
    const message = makeMessage($, t('title', 'Upgrade to KNX Ultimate 8'), [
      t('summary', 'Ready to upgrade. Nodes/configurations to convert: KNX Utility {{utility}}, HUE {{hue}}, Matter {{matter}}.', values),
      t('confirm', 'A JSON backup of all flows will download first. The required HUE/Matter packages will then be installed, all current editor changes deployed, and KNX Ultimate 8 installed. IDs, wiring, configuration references, credentials and Matter storage are preserved. The current node editor will close and discard edits not yet saved in this form.', values),
      t('restart_note', 'When the process finishes, you must restart the Node-RED service and reload the editor.', values)
    ])
    let notification
    let running = false
    notification = RED.notify(message, {
      type: 'warning',
      fixed: true,
      modal: true,
      buttons: [
        { text: t('cancel', 'Cancel'), click: () => notification.close() },
        {
          text: t('start', 'Back up and upgrade'),
          class: 'primary',
          click: function () {
            if (running) return
            running = true
            try {
              const backupApi = options.backupApi || environment.KNXUltimateFlowMigrationBackup
              if (!backupApi || typeof backupApi.download !== 'function') throw new Error('The flow backup tool is unavailable')
              backupApi.download(RED, { environment, documentObject: environment.document, kind: 'v8' })
            } catch (error) {
              running = false
              RED.notify(t('backup_failed', 'Flow backup could not be started. Nothing was changed:') + ' ' + error.message, { type: 'error', fixed: true })
              return
            }
            notification.close()
            closeEditor(RED, $)
            let unlockEditor
            let progressNotice
            let progressText
            try {
              unlockEditor = lockEditorDeploy(RED, $)
              progressText = $('<span></span>').text(t('progress_start', 'Preparing the automatic upgrade…'))
              const progressMessage = $('<p></p>').append($('<i class="fa fa-circle-notch fa-spin" style="margin-right:8px;"></i>')).append(progressText)
              progressNotice = RED.notify(progressMessage, { type: 'info', fixed: true, modal: true })
            } catch (error) {
              if (unlockEditor) unlockEditor()
              RED.notify(t('failed', 'Automatic upgrade stopped safely. KNX Ultimate 8 was not activated:') + ' ' + error.message, { type: 'error', fixed: true })
              return
            }
            const onProgress = stage => progressText.text(t('progress_' + stage, stage))
            let keepDeployBlocked = false
            Promise.resolve().then(() => runUpgrade(RED, plan, { ...options, environment, $, onProgress }))
              .then(counts => {
                keepDeployBlocked = true
                if (progressNotice && typeof progressNotice.close === 'function') progressNotice.close()
                const done = makeMessage($, t('complete_title', 'KNX Ultimate 8 installed'), [
                  t('complete', 'Converted {{total}} nodes/configurations and installed KNX Ultimate 8. Restart the Node-RED service now, then reload this page. Do not edit or deploy flows before restarting.', counts)
                ])
                let doneNotice
                doneNotice = RED.notify(done, {
                  type: 'success',
                  fixed: true,
                  modal: true,
                  buttons: [{ text: t('close', 'Close'), click: () => doneNotice.close() }]
                })
              })
              .catch(error => {
                if (progressNotice && typeof progressNotice.close === 'function') progressNotice.close()
                let failureMessage
                if (error.code === 'standalone_restart_required') {
                  keepDeployBlocked = true
                  failureMessage = t('standalone_restart_required', 'A HUE/Matter package update is ready. Restart the Node-RED service, reload the editor, then press the upgrade button again. No flows were changed.')
                } else if (error.moduleInstallUncertain) {
                  keepDeployBlocked = true
                  failureMessage = t('module_install_uncertain', 'A package operation may still be running. Restart the Node-RED service, reload the editor and press the upgrade button again. Do not deploy flows before restarting.')
                } else if (error.restartRequired) {
                  keepDeployBlocked = true
                  failureMessage = t('standalone_restart_required', 'A HUE/Matter package update is ready. Restart the Node-RED service, reload the editor, then press the upgrade button again. No flows were changed.') + ' ' + error.message
                } else if (error.flowConflict) {
                  keepDeployBlocked = true
                  failureMessage = t('flow_conflict', 'Another editor changed the flow revision. The automatic conversion was rolled back locally. Review or export any pre-existing local changes, then reload the editor before trying again.')
                } else if (error.persistenceUncertain) {
                  keepDeployBlocked = true
                  failureMessage = t('persistence_uncertain', 'Node-RED did not confirm the flow save. No automatic rollback was applied. Reload the editor and review the saved flows before trying again.')
                } else if (error.flowsPersisted) {
                  keepDeployBlocked = true
                  failureMessage = t('flows_persisted', 'The converted flows were saved, but KNX Ultimate 8 was not installed. Do not deploy more changes. Resolve the reported error, reload the editor and press the upgrade button again:') + ' ' + error.message
                } else {
                  failureMessage = t('failed', 'Automatic upgrade stopped safely. KNX Ultimate 8 was not activated:') + ' ' + error.message
                }
                RED.notify(failureMessage, { type: 'error', fixed: true })
              })
              .finally(() => unlockEditor({ keepDeployBlocked }))
          }
        }
      ]
    })
    return notification
  }

  function install (RED, options = {}) {
    if (installations.has(RED)) return installations.get(RED)
    const environment = options.environment || root || {}
    const $ = options.$ || environment.jQuery
    if (!$ || !environment.document) throw new Error('The Node-RED editor DOM API is unavailable')
    const selector = '.knx-ultimate-v8-upgrade-button'
    const handler = function (event) {
      event.preventDefault()
      event.stopPropagation()
      open(RED, { ...options, environment, $ })
    }
    $(environment.document).off('click' + EVENT_NAMESPACE, selector).on('click' + EVENT_NAMESPACE, selector, handler)
    if (RED.actions && typeof RED.actions.add === 'function') RED.actions.add('knxUltimate:upgrade-to-v8', () => open(RED, { ...options, environment, $ }))
    const installation = {
      open: () => open(RED, { ...options, environment, $ }),
      dispose () {
        $(environment.document).off('click' + EVENT_NAMESPACE, selector)
        if (RED.actions && typeof RED.actions.remove === 'function') RED.actions.remove('knxUltimate:upgrade-to-v8')
        installations.delete(RED)
      }
    }
    installations.set(RED, installation)
    return installation
  }

  return {
    AI_TYPES,
    HUE_PACKAGE,
    HUE_TYPE_MAP,
    MATTER_PACKAGE,
    MATTER_TYPE_MAP,
    PACKAGE_NAME,
    TARGET_VERSION,
    applyMigrationPlan,
    assertNoLegacyNodes,
    collectAllNodes,
    createMigrationPlan,
    deployFlows,
    ensureModule,
    install,
    installKnxV8,
    legacyNodes,
    open,
    runUpgrade,
    stableFlowSignature,
    validateDeployable,
    validatePreflight,
    verifySavedFlows,
    waitForTypes
  }
}))
