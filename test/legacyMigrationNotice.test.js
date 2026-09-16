const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const notice = require('../resources/legacyMigrationNotice')
const hueMigration = require('../resources/hueControllerMigration')
const knxMigration = require('../resources/knxUtilityMigration')

function createHarness (initialNodes = []) {
  const nodes = initialNodes.map(node => ({ ...node }))
  const notifications = []
  const dialogs = []
  const writes = []
  const timers = new Map()
  let currentTime = 0
  let nextTimer = 0
  const $ = selector => ({
    selector,
    children: [],
    content: '',
    text (value) {
      if (value === undefined) return this.content + this.children.map(child => child.text()).join(' ')
      this.content = value
      return this
    },
    append (child) { this.children.push(child); return this },
    appendTo (parent) { parent.append(this); return this }
  })
  const RED = {
    _: key => key,
    events: new EventEmitter(),
    nodes: {
      eachNode: callback => nodes.forEach(callback),
      dirty: value => { if (value !== undefined) writes.push(['dirty', value]); return false }
    },
    history: { push: event => writes.push(['history', event]) },
    notify (message, settings) {
      const notification = {
        message,
        settings,
        closed: false,
        updates: 0,
        close () { this.closed = true },
        update (message, settings) { this.message = message; this.settings = settings; this.updates += 1 }
      }
      notifications.push(notification)
      return notification
    }
  }
  const openDialog = (kind, options) => {
    const dialog = {
      kind,
      options,
      closed: false,
      close () {
        if (this.closed) return
        this.closed = true
        options.onClose()
      }
    }
    dialogs.push(dialog)
    return () => dialog.close()
  }
  const environment = {
    document: {},
    setTimeout (callback, delay) {
      const id = ++nextTimer
      timers.set(id, { callback, due: currentTime + delay })
      return id
    },
    clearTimeout: id => timers.delete(id),
    KNXUltimateHueControllerMigration: hueMigration,
    KNXUltimateHueControllerMigrationDialog: { open: options => openDialog('hue', options) },
    KNXUltimateUtilityMigration: {
      ...knxMigration,
      migrate (red, options) {
        assert.equal(red, RED)
        return openDialog('knx', options)
      }
    }
  }
  const tick = (duration = 150) => {
    const target = currentTime + duration
    for (;;) {
      const next = [...timers.entries()].filter(([, timer]) => timer.due <= target)
        .sort((a, b) => a[1].due - b[1].due)[0]
      if (!next) break
      currentTime = next[1].due
      timers.delete(next[0])
      next[1].callback()
    }
    currentTime = target
  }
  return {
    RED,
    $,
    environment,
    nodes,
    dialogs,
    notifications,
    writes,
    timers,
    tick,
    install: () => notice.install(RED, { environment, $ }),
    get active () { return notifications.filter(notification => !notification.closed) },
    get latest () { return notifications.at(-1) }
  }
}

const hueNode = { id: 'hue-1', type: 'knxUltimateHueLight', z: 'tab-1' }
const knxNode = { id: 'knx-1', type: 'knxUltimateWatchDog', z: 'tab-1' }
const modernNodes = [
  { id: 'modern-hue', type: 'knxUltimateHueController' },
  { id: 'modern-knx', type: 'knxUltimateUtility' },
  { id: 'knx-device', type: 'knxUltimate' },
  { id: 'knx-config', type: 'knxUltimate-config' },
  { id: 'hue-config', type: 'hue-config' },
  { id: 'debug', type: 'debug' }
]

describe('Legacy migration editor notice', function () {
  it('does not display a notice for empty flows or flows containing only current nodes', function () {
    for (const nodes of [[], modernNodes]) {
      const harness = createHarness(nodes)
      const installation = harness.install()
      harness.tick()
      harness.RED.events.emit('deploy')
      harness.RED.events.emit('workspace:dirty', true)
      harness.tick()
      assert.equal(harness.notifications.length, 0)
      installation.dispose()
    }
  })

  it('detects asynchronous loading through debounced node events without a runtime-start event in safe mode', function () {
    const harness = createHarness()
    harness.install()
    harness.tick()
    harness.nodes.push({ ...hueNode })
    harness.RED.events.emit('nodes:add', harness.nodes[0])
    harness.tick(100)
    harness.nodes.push({ ...knxNode })
    harness.RED.events.emit('nodes:add', harness.nodes[1])
    harness.tick(149)
    assert.equal(harness.notifications.length, 0)
    harness.tick(1)
    assert.equal(harness.notifications.length, 1)
    assert.deepEqual(harness.latest.settings.buttons.map(button => button.text), ['Migrate HUE (1)', 'Migrate KNX (1)', 'Later'])
  })

  it('counts every supported legacy type across tabs and subflows using the migration collectors', function () {
    const legacy = [
      ...Object.keys(hueMigration.LEGACY_NODE_PROFILES),
      ...Object.keys(knxMigration.LEGACY_NODE_PROFILES)
    ].map((type, index) => ({ id: `legacy-${index}`, type, z: index % 2 ? 'subflow-1' : 'tab-2' }))
    const harness = createHarness([...legacy, ...modernNodes])
    harness.install()
    harness.tick()
    assert.match(harness.latest.message.text(), /flows and subflows: HUE: 15; KNX utility: 11/)
    assert.deepEqual(harness.latest.settings.buttons.map(button => button.text), ['Migrate HUE (15)', 'Migrate KNX (11)', 'Later'])
    assert.equal(harness.latest.settings.type, 'warning')
    assert.equal(harness.latest.settings.fixed, true)
    assert.equal(harness.latest.settings.modal, false)
    assert.deepEqual(harness.nodes, [...legacy, ...modernNodes])
    assert.deepEqual(harness.writes, [])
  })

  for (const [kind, node, label] of [['hue', hueNode, 'HUE'], ['knx', knxNode, 'KNX']]) {
    it(`offers only the ${label} migration for that family and opens its existing dialog without modifying flows`, function () {
      const harness = createHarness([node, ...modernNodes])
      harness.install()
      harness.tick()
      const notification = harness.latest
      assert.deepEqual(notification.settings.buttons.map(button => button.text), [`Migrate ${label} (1)`, 'Later'])
      notification.settings.buttons[0].click()
      notification.settings.buttons[0].click()
      assert.equal(notification.closed, true)
      assert.equal(harness.dialogs.length, 1)
      const dialog = harness.dialogs[0]
      assert.equal(dialog.kind, kind)
      assert.equal(typeof dialog.options.onClose, 'function')
      assert.equal(dialog.options.$, harness.$)
      if (kind === 'hue') {
        assert.equal(dialog.options.RED, harness.RED)
        assert.equal(dialog.options.windowObject, harness.environment)
        assert.equal(dialog.options.documentObject, harness.environment.document)
      } else {
        assert.equal(dialog.options.environment, harness.environment)
      }
      assert.deepEqual(harness.nodes, [node, ...modernNodes])
      assert.deepEqual(harness.writes, [])
      harness.RED.events.emit('nodes:change', harness.nodes[0])
      harness.tick()
      assert.equal(harness.active.length, 0)
      dialog.close()
      harness.tick()
      assert.equal(harness.active.length, 1)
      assert.deepEqual(harness.latest.settings.buttons.map(button => button.text), [`Migrate ${label} (1)`, 'Later'])
    })
  }

  it('refreshes the remaining family after conversion and leaves no notice when all legacy nodes are migrated', function () {
    const harness = createHarness([hueNode, knxNode])
    harness.install()
    harness.tick()
    harness.latest.settings.buttons[0].click()
    harness.nodes[0].type = 'knxUltimateHueController'
    harness.RED.events.emit('nodes:change', harness.nodes[0])
    harness.dialogs[0].close()
    harness.tick()
    assert.deepEqual(harness.latest.settings.buttons.map(button => button.text), ['Migrate KNX (1)', 'Later'])
    assert.match(harness.latest.message.text(), /HUE: 0; KNX utility: 1/)
    harness.latest.settings.buttons[0].click()
    harness.nodes[1].type = 'knxUltimateUtility'
    harness.RED.events.emit('nodes:change', harness.nodes[1])
    harness.dialogs[1].close()
    harness.tick()
    assert.equal(harness.active.length, 0)
    assert.equal(harness.notifications.length, 2)
  })

  it('updates an existing notice after flow edits, avoids duplicates and closes it after the last removal', function () {
    const harness = createHarness([hueNode, knxNode])
    harness.install()
    harness.tick()
    const notification = harness.latest
    harness.RED.events.emit('workspace:dirty', true)
    harness.RED.events.emit('deploy')
    harness.tick()
    assert.equal(harness.notifications.length, 1)
    assert.equal(notification.updates, 0)
    const removed = harness.nodes.shift()
    harness.RED.events.emit('nodes:remove', removed)
    harness.tick()
    assert.equal(harness.notifications.length, 1)
    assert.equal(notification.updates, 1)
    assert.deepEqual(notification.settings.buttons.map(button => button.text), ['Migrate KNX (1)', 'Later'])
    harness.RED.events.emit('nodes:remove', harness.nodes.pop())
    harness.tick()
    assert.equal(notification.closed, true)
    assert.equal(harness.active.length, 0)
  })

  it('keeps Later dismissed for this workspace and resets dismissal when another workspace loads', function () {
    const harness = createHarness([hueNode])
    harness.install()
    harness.tick()
    harness.latest.settings.buttons.at(-1).click()
    harness.nodes.push({ ...knxNode })
    for (const event of ['nodes:add', 'nodes:remove', 'nodes:change', 'workspace:dirty', 'deploy']) {
      harness.RED.events.emit(event)
      harness.tick()
    }
    assert.equal(harness.notifications.length, 1)
    assert.equal(harness.active.length, 0)
    harness.RED.events.emit('workspace:clear')
    harness.nodes.splice(0, harness.nodes.length, { ...knxNode, id: 'other-workspace-knx' })
    harness.RED.events.emit('nodes:add', harness.nodes[0])
    harness.tick()
    assert.equal(harness.notifications.length, 2)
    assert.deepEqual(harness.latest.settings.buttons.map(button => button.text), ['Migrate KNX (1)', 'Later'])
  })

  it('installs once per editor and removes timers, listeners and notifications on disposal', function () {
    const harness = createHarness([hueNode])
    const installation = harness.install()
    assert.equal(harness.install(), installation)
    assert.equal(harness.timers.size, 1)
    for (const event of harness.RED.events.eventNames()) assert.equal(harness.RED.events.listenerCount(event), 1)
    harness.tick()
    harness.RED.events.emit('nodes:change', harness.nodes[0])
    installation.dispose()
    assert.equal(harness.active.length, 0)
    assert.equal(harness.timers.size, 0)
    assert.deepEqual(harness.RED.events.eventNames(), [])
    harness.RED.events.emit('nodes:add', harness.nodes[0])
    harness.tick()
    assert.equal(harness.notifications.length, 1)
    assert.notEqual(harness.install(), installation)
    harness.tick()
    assert.equal(harness.active.length, 1)
  })

  it('closes an open migration dialog during disposal and ignores stale migration buttons', function () {
    const harness = createHarness([hueNode])
    const installation = harness.install()
    harness.tick()
    const button = harness.latest.settings.buttons[0]
    button.click()
    installation.dispose()
    assert.equal(harness.dialogs[0].closed, true)
    assert.equal(harness.timers.size, 0)
    button.click()
    harness.tick()
    assert.equal(harness.dialogs.length, 1)
    assert.equal(harness.active.length, 0)
  })
})
