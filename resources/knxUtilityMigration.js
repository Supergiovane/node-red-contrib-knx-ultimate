(function (root, factory) {
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) {
    root.KNXUltimateUtilityMigration = api
    if (root.RED && root.jQuery && root.document) api.installLegacyButton(root.RED, root.jQuery, root.document)
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  const LEGACY_NODE_PROFILES = Object.freeze({
    knxUltimateAlerter: Object.freeze({ utilityType: 'alerter', inputs: 1, outputs: 3 }),
    knxUltimateAutoResponder: Object.freeze({ utilityType: 'autoresponder', inputs: 0, outputs: 0 }),
    knxUltimateDateTime: Object.freeze({ utilityType: 'datetime', inputs: 0, outputs: 0 }),
    knxUltimateWatchDog: Object.freeze({ utilityType: 'watchdog', inputs: 1, outputs: 1 }),
    knxUltimateGlobalContext: Object.freeze({ utilityType: 'globalcontext', inputs: 0, outputs: 0 }),
    knxUltimateLogger: Object.freeze({ utilityType: 'logger', inputs: 1, outputs: 2 }),
    knxUltimateStaircase: Object.freeze({ utilityType: 'staircase', inputs: 1, outputs: 1 }),
    knxUltimateGarage: Object.freeze({ utilityType: 'garage', inputs: 1, outputs: 1 }),
    knxUltimateSceneController: Object.freeze({ utilityType: 'scenecontroller', inputs: 1, outputs: 1 }),
    knxUltimateLoadControl: Object.freeze({ utilityType: 'loadcontrol', inputs: 1, outputs: 1 }),
    knxUltimateHATranslator: Object.freeze({ utilityType: 'hatranslator', inputs: 1, outputs: 1 })
  })
  const I18N_PREFIX = 'node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.'
  const EVENT_NAMESPACE = '.knxUltimateUtilityMigration'
  const HA_TRANSLATION_DEFAULT = 'on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false'
  let activeNotification

  function isLegacyUtilityNode (node) {
    return Boolean(node && typeof node === 'object' && Object.prototype.hasOwnProperty.call(LEGACY_NODE_PROFILES, node.type))
  }

  function collectLegacyUtilityNodes (RED) {
    const nodes = []
    if (RED && RED.nodes && typeof RED.nodes.eachNode === 'function') {
      RED.nodes.eachNode(node => { if (isLegacyUtilityNode(node)) nodes.push(node) })
    }
    return nodes
  }

  function createLocalMigrationPatches (legacyNodes) {
    if (!Array.isArray(legacyNodes)) throw new TypeError('Legacy KNX utility nodes must be an array')
    return legacyNodes.map(function (node, index) {
      if (!isLegacyUtilityNode(node)) throw new TypeError(`Entry ${index} is not a supported legacy KNX utility node`)
      const patch = { index, type: 'knxUltimateUtility', ...LEGACY_NODE_PROFILES[node.type] }
      if (patch.utilityType === 'hatranslator') {
        const legacyDefault = node._def && node._def.defaults && node._def.defaults.commandText
        patch.haTranslationTable = node.commandText !== undefined
          ? node.commandText
          : legacyDefault && legacyDefault.value !== undefined ? legacyDefault.value : HA_TRANSLATION_DEFAULT
      }
      return patch
    })
  }

  function snapshot (node, keys) {
    return keys.reduce((state, key) => {
      state[key] = Object.getOwnPropertyDescriptor(node, key)
      return state
    }, {})
  }

  function restore (node, state) {
    Object.keys(state).forEach(key => {
      if (state[key]) Object.defineProperty(node, key, state[key])
      else delete node[key]
    })
  }

  function refresh (RED) {
    if (RED.view && typeof RED.view.redraw === 'function') RED.view.redraw(true)
  }

  function rebuildNodeView (RED, node, documentObject) {
    // Node-RED's ordinary redraw cannot create/remove a button when a node's
    // type changes. Re-enter only this node's SVG view, keeping the flow object
    // (and every link/config/group reference to it) in place. Avoid the editor's
    // _colorChanged path, which also throws for button nodes in Node-RED 5.0.4.
    const element = documentObject && typeof documentObject.getElementById === 'function'
      ? documentObject.getElementById(node.id)
      : null
    if (element && element.__data__ === node && element.classList &&
        element.classList.contains('red-ui-flow-node-group')) {
      if (RED.hooks && typeof RED.hooks.trigger === 'function') {
        RED.hooks.trigger('viewRemoveNode', { node, el: element })
      }
      element.remove()
    }
    // Width is a canvas cache. Recalculate it without Node-RED shifting x to
    // preserve the old left edge when the replacement label changes width.
    delete node.w
    delete node._colorChanged
    node.resize = true
    node.dirty = true
  }

  function applyLocalMigration (RED, legacyNodes, options = {}) {
    if (!RED || !RED.nodes || typeof RED.nodes.getType !== 'function') throw new Error('The Node-RED editor API is unavailable')
    const patches = createLocalMigrationPatches(legacyNodes)
    if (patches.length === 0) return 0
    const definition = RED.nodes.getType('knxUltimateUtility')
    if (!definition) throw new Error('The KNX Utility node is not registered')
    if (!RED.history || typeof RED.history.push !== 'function') throw new Error('The Node-RED undo history is unavailable')
    const documentObject = options.documentObject || (root && root.document)

    const previousDirty = typeof RED.nodes.dirty === 'function' ? RED.nodes.dirty() : false
    const seen = new Set()
    const prepared = patches.map(function (patch, index) {
      const node = legacyNodes[index]
      if (seen.has(node)) throw new Error('A legacy KNX utility node is listed more than once')
      seen.add(node)
      if (typeof RED.nodes.node === 'function' && RED.nodes.node(node.id) !== node) {
        throw new Error('A legacy KNX utility node changed before conversion')
      }
      const workspace = typeof RED.nodes.workspace === 'function' ? RED.nodes.workspace(node.z) : null
      const subflow = typeof RED.nodes.subflow === 'function' ? RED.nodes.subflow(node.z) : null
      if ((workspace && workspace.locked) || (subflow && subflow.locked) ||
          (RED.workspaces && typeof RED.workspaces.isLocked === 'function' && RED.workspaces.isLocked(node.z))) {
        throw new Error('A flow containing a legacy KNX utility node is locked')
      }
      const oldValues = {
        type: node.type,
        _def: node._def,
        _: node._,
        utilityType: node.utilityType,
        inputs: node.inputs === undefined ? patch.inputs : node.inputs,
        outputs: node.outputs === undefined ? patch.outputs : node.outputs
      }
      if (patch.utilityType === 'hatranslator') oldValues.haTranslationTable = node.haTranslationTable
      return {
        node,
        patch,
        oldValues,
        oldChanged: node.changed,
        // Validation also changes these editor-only flags. Save their presence
        // so a failed batch restores even the node whose validation threw.
        state: snapshot(node, [...Object.keys(oldValues), 'changed', 'dirty', 'resize', 'valid', 'validationErrors', '_colorChanged'])
      }
    })

    const applied = []
    try {
      prepared.forEach(function (entry) {
        const { node, patch } = entry
        applied.push(entry)
        node.type = patch.type
        node._def = definition
        node._ = definition._ || RED._
        node.utilityType = patch.utilityType
        node.inputs = patch.inputs
        node.outputs = patch.outputs
        if (patch.utilityType === 'hatranslator') node.haTranslationTable = patch.haTranslationTable
        node.changed = true
        node.dirty = true
        node.resize = true
        if (RED.editor && typeof RED.editor.validateNode === 'function') RED.editor.validateNode(node)
      })
      const events = prepared.map(entry => ({
        t: 'edit',
        node: entry.node,
        changes: entry.oldValues,
        changed: entry.oldChanged,
        dirty: previousDirty,
        callback: function (event) {
          rebuildNodeView(RED, event.node, documentObject)
          refresh(RED)
        }
      }))
      // Node-RED restores the outer event's dirty flag after its child edits.
      RED.history.push(events.length === 1 ? events[0] : { t: 'multi', events, dirty: previousDirty })
    } catch (error) {
      applied.reverse().forEach(entry => restore(entry.node, entry.state))
      if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(previousDirty)
      refresh(RED)
      throw error
    }

    if (typeof RED.nodes.dirty === 'function') RED.nodes.dirty(true)
    prepared.forEach(entry => {
      rebuildNodeView(RED, entry.node, documentObject)
      if (RED.events && typeof RED.events.emit === 'function') RED.events.emit('nodes:change', entry.node)
    })
    refresh(RED)
    return prepared.length
  }

  function translate (RED, key, fallback, values) {
    const qualifiedKey = I18N_PREFIX + key
    let result
    try { result = RED._(qualifiedKey, values) } catch (error) { /* use fallback */ }
    result = result && result !== qualifiedKey ? result : fallback
    return result.replace(/{{\s*count\s*}}/g, String(values && values.count))
  }

  function closeEditor (RED, $) {
    try {
      if (RED.actions && typeof RED.actions.invoke === 'function') {
        RED.actions.invoke('core:cancel-edit-tray')
        return
      }
    } catch (error) { /* older Node-RED button fallback */ }
    if ($) $('#node-dialog-cancel:visible, #node-config-dialog-cancel:visible').first().trigger('click')
  }

  function migrate (RED, options = {}) {
    if (!RED || typeof RED.notify !== 'function') throw new Error('The Node-RED editor notification API is unavailable')
    const environment = options.environment || root
    const $ = options.$ || (environment && environment.jQuery)
    const legacyNodes = collectLegacyUtilityNodes(RED)
    const t = (key, fallback, values) => translate(RED, key, fallback, values)
    if (legacyNodes.length === 0) {
      RED.notify(t('migration_none', 'No compatible legacy KNX utility nodes were found.'), 'info')
      if (typeof options.onClose === 'function') options.onClose()
      return
    }
    if (activeNotification && typeof activeNotification.close === 'function') activeNotification.close()
    let running = false
    let closed = false
    let notification
    const close = () => {
      if (closed) return
      closed = true
      if (notification && typeof notification.close === 'function') notification.close()
      if (typeof options.onClose === 'function') options.onClose()
    }
    notification = RED.notify(t('migration_confirm', 'Convert all {{count}} compatible legacy KNX utility nodes in every flow and subflow to KNX Utility? Before conversion, the browser automatically starts downloading a JSON backup of all flows. Protected credentials are excluded, as in the standard Node-RED export. Your browser may ask where to save the file. The current node editor will close and discard unsaved edits. IDs, settings, connections and groups are preserved. Conversion happens in this browser, can be undone, and takes effect when you Deploy.', { count: legacyNodes.length }), {
      modal: true,
      fixed: true,
      type: 'warning',
      buttons: [
        { text: t('migration_cancel', 'Cancel'), click: close },
        {
          text: t('migration_convert', 'Convert to KNX Utility'),
          class: 'primary',
          click: function () {
            if (running || closed) return
            running = true
            try {
              const backupApi = options.backupApi || (environment && environment.KNXUltimateFlowMigrationBackup)
              if (!backupApi || typeof backupApi.download !== 'function') throw new Error('The flow backup tool is unavailable. Restart Node-RED after updating the package.')
              // Keep the snapshot and download inside the user's click, before
              // cancelling the editor or changing any of the legacy nodes.
              backupApi.download(RED, { environment, kind: 'knx' })
            } catch (error) {
              running = false
              RED.notify(t('migration_backup_failed', 'Flow backup could not be started. No nodes were converted:') + ' ' + (error && error.message ? error.message : String(error)), 'error')
              return
            }
            close()
            closeEditor(RED, $)
            const perform = () => {
              try {
                const count = applyLocalMigration(RED, legacyNodes)
                RED.notify(t('migration_success', 'The flow backup download has started. {{count}} nodes converted to KNX Utility. Review the result and click Deploy to apply it. You can undo the conversion with Undo.', { count }), 'success')
              } catch (error) {
                RED.notify(t('migration_failed', 'KNX Utility conversion failed:') + ' ' + (error && error.message ? error.message : String(error)), 'error')
              }
            }
            if (environment && typeof environment.setTimeout === 'function') environment.setTimeout(perform, 0)
            else perform()
          }
        }
      ]
    })
    activeNotification = notification
    return close
  }

  function installLegacyButton (RED, $, documentObject) {
    if (!RED || !$ || !documentObject) return
    $(documentObject).off('click' + EVENT_NAMESPACE, '.knx-utility-migrate-flow')
      .on('click' + EVENT_NAMESPACE, '.knx-utility-migrate-flow', function (event) {
        event.preventDefault()
        migrate(RED, { $ })
      })
  }

  return { LEGACY_NODE_PROFILES, isLegacyUtilityNode, collectLegacyUtilityNodes, createLocalMigrationPatches, applyLocalMigration, migrate, installLegacyButton }
}))
