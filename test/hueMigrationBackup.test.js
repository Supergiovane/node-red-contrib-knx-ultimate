const assert = require('assert/strict')
const migrationDialog = require('../resources/hueControllerMigrationDialog')

function createHarness (options = {}) {
  const events = []
  const pending = []
  const notifications = []
  const nodes = options.nodes || [{ id: 'hue-1', type: 'knxUltimateHueLight', name: 'Kitchen' }]
  const documentObject = {}
  const elements = []
  let dialog
  let dialogOptions
  let backupError = options.backupError
  let backupCount = 0
  let backupSnapshot

  class Element {
    constructor (selector) {
      this.selector = selector
      this.properties = {}
      this.length = 1
      elements.push(this)
    }

    appendTo () { return this }
    css () { return this }
    text (value) { this.content = value; return this }
    off () { return this }
    remove () { this.removed = true; return this }
    parent () { return this }
    find (selector) { return elements.find(element => element.selector === selector) || new Element(selector) }
    prop (key, value) { this.properties[key] = value; return this }
    addClass () { return this }

    dialog (value) {
      if (typeof value === 'object') {
        dialog = this
        dialogOptions = value
        value.open()
      } else if (value === 'destroy') {
        events.push('close-dialog')
      } else if (value === 'close' && dialogOptions.beforeClose()) {
        dialogOptions.close()
      }
      return this
    }
  }

  const windowObject = {
    setTimeout (callback) {
      events.push('schedule')
      pending.push(callback)
    }
  }
  const $ = value => value === windowObject ? { width: () => 1000 } : value instanceof Element ? value : new Element(value)
  const RED = {
    notify (message, settings) { notifications.push({ message, settings }) },
    actions: {
      invoke (action) {
        assert.equal(action, 'core:cancel-edit-tray')
        events.push('close-editor')
        if (options.onCloseEditor) options.onCloseEditor(nodes)
      }
    }
  }
  const migrationApi = {
    MIGRATION_DONATION_URL: 'https://example.com/donate',
    collectLegacyHueNodes () { return nodes },
    createLocalMigrationPatches (selected) {
      assert.equal(selected, nodes)
      events.push('preflight')
      if (options.preflightError) throw options.preflightError
    },
    applyLocalMigration (red, selected) {
      assert.equal(red, RED)
      assert.equal(selected, nodes)
      events.push('apply')
      if (options.migrationError) throw options.migrationError
      nodes.forEach(node => { node.type = 'knxUltimateHueController' })
      return nodes.length
    },
    createUsageMailto (count) {
      assert.equal(count, nodes.length)
      events.push('create-mailto')
      return 'mailto:author@example.com'
    },
    openUsageMailto () { events.push('open-mailto') }
  }
  const backupApi = {
    download (red, settings) {
      assert.equal(red, RED)
      assert.deepEqual(settings, { environment: windowObject, documentObject, kind: 'hue' })
      events.push('backup')
      backupCount += 1
      if (backupError) throw backupError
      backupSnapshot = JSON.parse(JSON.stringify(nodes))
    }
  }
  if (!options.missingBackup) windowObject.KNXUltimateFlowMigrationBackup = backupApi
  const close = migrationDialog.open({ RED, $, windowObject, documentObject, migrationApi })
  return {
    events,
    pending,
    notifications,
    nodes,
    close,
    get dialog () { return dialog },
    get backupCount () { return backupCount },
    get backupSnapshot () { return backupSnapshot },
    get status () { return elements.find(element => element.selector.includes('hue-controller-migration-status')) },
    get convertButton () { return elements.find(element => element.selector === '.hue-controller-migration-convert') },
    get backupNote () { return elements.find(element => element.selector.includes('hue-controller-migration-backup')) },
    convert () { dialogOptions.buttons[1].click() },
    cancel () { dialogOptions.buttons[0].click.call(dialog) },
    flush () { while (pending.length) pending.shift()() },
    clearBackupError () { backupError = null }
  }
}

describe('HUE migration automatic flow backup', function () {
  it('downloads synchronously after preflight and before closing the editor or converting nodes', function () {
    const harness = createHarness({ onCloseEditor: nodes => { nodes[0].name = 'Restored editor value' } })
    harness.convert()
    assert.deepEqual(harness.events, ['preflight', 'backup', 'close-dialog', 'close-editor', 'schedule'])
    assert.equal(harness.backupSnapshot[0].name, 'Kitchen')
    assert.equal(harness.backupSnapshot[0].type, 'knxUltimateHueLight')
    assert.equal(harness.nodes[0].type, 'knxUltimateHueLight')
    harness.flush()
    assert.equal(harness.nodes[0].type, 'knxUltimateHueController')
    assert.deepEqual(harness.events.slice(-3), ['apply', 'create-mailto', 'open-mailto'])
    assert.equal(harness.notifications.at(-1).settings.type, 'success')
    assert.match(harness.backupNote.content, /automatically starts downloading a JSON backup of all flows/)
  })

  it('starts only one download and conversion for repeated confirmation clicks', function () {
    const harness = createHarness()
    harness.convert()
    harness.convert()
    harness.flush()
    harness.convert()
    harness.flush()
    assert.equal(harness.backupCount, 1)
    assert.equal(harness.events.filter(event => event === 'apply').length, 1)
  })

  it('keeps the editor and flow intact after a backup error and allows a retry', function () {
    const harness = createHarness({ backupError: new Error('Download is unavailable') })
    harness.convert()
    assert.deepEqual(harness.events, ['preflight', 'backup'])
    assert.match(harness.status.content, /Flow backup could not be started\. No nodes were converted: Download is unavailable/)
    assert.equal(harness.convertButton.properties.disabled, false)
    assert.equal(harness.dialog.removed, undefined)
    assert.equal(harness.nodes[0].type, 'knxUltimateHueLight')
    assert.equal(harness.pending.length, 0)
    harness.clearBackupError()
    harness.convert()
    harness.flush()
    assert.equal(harness.nodes[0].type, 'knxUltimateHueController')
  })

  it('blocks conversion when the shared backup helper is unavailable', function () {
    const harness = createHarness({ missingBackup: true })
    harness.convert()
    assert.deepEqual(harness.events, ['preflight'])
    assert.match(harness.status.content, /Flow backup could not be started/)
    assert.equal(harness.convertButton.properties.disabled, false)
    assert.equal(harness.dialog.removed, undefined)
    assert.equal(harness.pending.length, 0)
    assert.equal(harness.nodes[0].type, 'knxUltimateHueLight')
  })

  it('does not download or close the editor when migration preflight fails', function () {
    const harness = createHarness({ preflightError: new Error('Unsupported node') })
    harness.convert()
    assert.deepEqual(harness.events, ['preflight'])
    assert.match(harness.status.content, /HUE migration failed; the flow was not changed: Unsupported node/)
    assert.equal(harness.convertButton.properties.disabled, false)
    assert.equal(harness.dialog.removed, undefined)
    assert.equal(harness.backupCount, 0)
  })

  it('does not download for cancel, a closed dialog, or an empty conversion', function () {
    const harness = createHarness()
    harness.cancel()
    harness.convert()
    harness.flush()
    assert.deepEqual(harness.events, ['close-dialog'])
    assert.equal(harness.backupCount, 0)
    const empty = createHarness({ nodes: [] })
    assert.equal(empty.dialog, undefined)
    assert.deepEqual(empty.events, [])
    assert.match(empty.notifications[0].message, /No legacy HUE nodes/)
  })

  it('keeps the downloaded backup when conversion later fails and reports the migration error', function () {
    const harness = createHarness({ migrationError: new Error('Conversion rejected') })
    harness.convert()
    harness.flush()
    assert.equal(harness.backupCount, 1)
    assert.equal(harness.backupSnapshot[0].type, 'knxUltimateHueLight')
    assert.equal(harness.nodes[0].type, 'knxUltimateHueLight')
    assert.match(harness.notifications.at(-1).message, /HUE migration failed; the flow was not changed: Conversion rejected/)
    assert.equal(harness.events.includes('open-mailto'), false)
  })
})
