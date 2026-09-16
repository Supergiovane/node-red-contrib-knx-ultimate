(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateLegacyMigrationNotice = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const I18N_PREFIX = 'node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.startup_migration.'
  const installations = new WeakMap()

  function install (RED, options = {}) {
    if (installations.has(RED)) return installations.get(RED)
    const environment = options.environment || globalThis
    const $ = options.$ || environment.jQuery
    const documentObject = environment.document
    let notification
    let timer
    let dismissed = false
    let disposed = false
    let migrating = false
    let closeMigration
    let lastCounts = ''

    function translate (key, fallback, values = {}) {
      const qualifiedKey = I18N_PREFIX + key
      let result
      try { result = RED._(qualifiedKey, values) } catch (error) { /* use fallback */ }
      result = result && result !== qualifiedKey ? result : fallback
      return result.replace(/{{\s*(\w+)\s*}}/g, (match, name) => values[name] === undefined ? match : String(values[name]))
    }

    function closeNotice () {
      if (notification) notification.close()
      notification = undefined
      lastCounts = ''
    }

    // Defer scans until the current import, undo or conversion batch finishes.
    // Node events also cover initial loading in Node-RED's safe mode.
    function schedule () {
      if (disposed) return
      if (timer !== undefined) environment.clearTimeout(timer)
      timer = environment.setTimeout(refresh, 150)
    }

    function migrationClosed () {
      migrating = false
      closeMigration = undefined
      schedule()
    }

    function openMigration (kind) {
      if (disposed || migrating) return
      closeNotice()
      migrating = true
      try {
        if (kind === 'hue') {
          closeMigration = environment.KNXUltimateHueControllerMigrationDialog.open({
            RED, $, windowObject: environment, documentObject, onClose: migrationClosed
          })
        } else {
          closeMigration = environment.KNXUltimateUtilityMigration.migrate(RED, {
            environment, $, onClose: migrationClosed
          })
        }
      } catch (error) {
        migrationClosed()
        RED.notify(translate('unavailable', 'The migration tool is unavailable. Reload the editor after restarting Node-RED.'), 'error')
      }
    }

    function refresh () {
      timer = undefined
      if (disposed || dismissed || migrating) return
      const hueApi = environment.KNXUltimateHueControllerMigration
      const knxApi = environment.KNXUltimateUtilityMigration
      if (!hueApi || !knxApi) return
      const hue = hueApi.collectLegacyHueNodes(RED).length
      const knx = knxApi.collectLegacyUtilityNodes(RED).length
      if (!hue && !knx) {
        closeNotice()
        return
      }
      const counts = `${hue}:${knx}`
      if (notification && counts === lastCounts) return
      lastCounts = counts

      const message = $('<div></div>')
      $('<p></p>').append($('<strong></strong>').text(translate('title', 'Legacy KNX Ultimate nodes'))).appendTo(message)
      $('<p></p>').text(translate('message', 'Legacy nodes found in your flows and subflows: HUE: {{hue}}; KNX utility: {{knx}}. These nodes still work, but are hidden from the palette. Migrate them to HUE Controller and KNX Utility. Each migration downloads a flow backup; review the result before deploying.', { hue, knx })).appendTo(message)
      const buttons = []
      if (hue) buttons.push({
        text: translate('hue_button', 'Migrate HUE ({{count}})', { count: hue }),
        click: () => openMigration('hue')
      })
      if (knx) buttons.push({
        text: translate('knx_button', 'Migrate KNX ({{count}})', { count: knx }),
        click: () => openMigration('knx')
      })
      buttons.push({
        text: translate('later', 'Later'),
        click () {
          dismissed = true
          closeNotice()
        }
      })
      const settings = { type: 'warning', fixed: true, modal: false, buttons, silent: true }
      if (notification) notification.update(message, settings)
      else notification = RED.notify(message, settings)
    }

    function reset () {
      dismissed = false
      closeNotice()
      if (closeMigration) closeMigration()
      migrating = false
      schedule()
    }

    const events = ['nodes:add', 'nodes:remove', 'nodes:change', 'workspace:dirty', 'deploy']
    events.forEach(event => RED.events.on(event, schedule))
    RED.events.on('workspace:clear', reset)
    const dispose = () => {
      disposed = true
      if (timer !== undefined) environment.clearTimeout(timer)
      events.forEach(event => RED.events.off(event, schedule))
      RED.events.off('workspace:clear', reset)
      if (closeMigration) closeMigration()
      closeNotice()
      installations.delete(RED)
    }
    const installation = { dispose }
    installations.set(RED, installation)
    schedule()
    return installation
  }

  return { install }
}))
