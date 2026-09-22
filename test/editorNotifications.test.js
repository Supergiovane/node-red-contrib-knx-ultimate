/* global describe, it */

const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')
const notifications = require('../resources/editorNotifications')
const pkg = require('../package.json')

function createEditor () {
  const calls = []
  const updates = []
  const notice = {
    closed: false,
    close () { this.closed = true },
    update (message, options) {
      updates.push({ message, options })
      return this
    }
  }
  const RED = {
    _: key => key === 'common.label.close' ? 'Chiudi' : key,
    notify (message, options) {
      calls.push({ message, options })
      return notice
    }
  }
  return { RED, calls, updates, notice }
}

describe('Editor notifications', () => {
  it('adds an explicit localized close button to shorthand notifications', () => {
    const editor = createEditor()
    assert.equal(notifications.install(editor.RED), true)

    const returned = editor.RED.notify('Example', 'warning')

    assert.equal(returned, editor.notice)
    assert.equal(editor.calls.length, 1)
    assert.equal(editor.calls[0].options.type, 'warning')
    assert.equal(editor.calls[0].options.buttons.length, 1)
    assert.equal(editor.calls[0].options.buttons[0].text, 'Chiudi')
    editor.calls[0].options.buttons[0].click()
    assert.equal(editor.notice.closed, true)
  })

  it('preserves existing actions, does not mutate caller options, and installs only once', () => {
    const editor = createEditor()
    const action = { text: 'Continue', click () {} }
    const options = { type: 'info', fixed: true, buttons: [action] }
    const originalNotify = editor.RED.notify

    notifications.install(editor.RED)
    const patchedNotify = editor.RED.notify
    notifications.install(editor.RED)
    editor.RED.notify('Example', options)

    assert.notEqual(patchedNotify, originalNotify)
    assert.equal(editor.RED.notify, patchedNotify)
    assert.deepEqual(options.buttons, [action])
    assert.equal(editor.calls[0].options.buttons[0], action)
    assert.equal(editor.calls[0].options.buttons[1].class, 'ultimate-notification-close')
  })

  it('does not duplicate an existing dismiss action', () => {
    const editor = createEditor()
    const dismiss = { text: 'OK', click: function () { editor.notice.close() } }

    notifications.install(editor.RED)
    editor.RED.notify('Example', { fixed: true, buttons: [dismiss] })

    assert.deepEqual(editor.calls[0].options.buttons, [dismiss])
  })

  it('preserves the legacy positional fixed and timeout arguments', () => {
    const editor = createEditor()

    notifications.install(editor.RED)
    editor.RED.notify('Example', 'warning', true, 9000)

    assert.equal(editor.calls[0].options.type, 'warning')
    assert.equal(editor.calls[0].options.fixed, true)
    assert.equal(editor.calls[0].options.timeout, 9000)
  })

  it('keeps updated notifications dismissible', () => {
    const editor = createEditor()

    notifications.install(editor.RED)
    const notice = editor.RED.notify('Starting', 'info')
    const returned = notice.update('Still working', 1500)

    assert.equal(returned, notice)
    assert.equal(editor.updates[0].options.timeout, 1500)
    assert.equal(editor.updates[0].options.buttons.length, 1)
    editor.updates[0].options.buttons[0].click()
    assert.equal(editor.notice.closed, true)
  })

  it('loads the global guard before every migration notification resource', () => {
    const pluginPath = pkg['node-red'].plugins.knxUltimateV8MigrationRecovery
    const plugin = fs.readFileSync(path.join(__dirname, '..', pluginPath), 'utf8')
    const guard = plugin.indexOf('editorNotifications.js')

    assert(guard >= 0)
    for (const resource of ['knxUtilityMigration.js', 'upgradeToV8.js']) {
      assert(guard < plugin.indexOf(resource), `${resource} loads before the notification guard`)
    }
  })
})
