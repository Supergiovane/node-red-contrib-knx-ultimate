const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const migration = require('../resources/knxUtilityMigration')

function editorFixture (options = {}) {
  const definition = { defaults: { utilityType: { value: 'alerter' } }, _: key => key }
  const legacyNodes = Object.keys(migration.LEGACY_NODE_PROFILES).map((type, index) => ({
    id: `legacy-${index}`,
    type,
    _def: { defaults: {}, category: 'deprecated' },
    _: key => key,
    z: 'tab-1',
    g: 'group-1',
    name: `Utility ${index}`,
    server: 'knx-config',
    x: 100,
    y: 80 + index * 60,
    ...migration.LEGACY_NODE_PROFILES[type],
    utilityType: undefined,
    wires: Array.from({ length: migration.LEGACY_NODE_PROFILES[type].outputs }, (_, port) => [`target-${index}-${port}`]),
    changed: index === 1,
    rules: [{ topic: '1/2/3', devicename: 'Window', longdevicename: 'Kitchen window' }],
    commandText: '[{"ga":"1/1/1..3","dpt":"1.001","default":false}]',
    gaDateTime: '1/3/4',
    dptDateTime: '19.001',
    credentials: { untouched: true },
    customSetting: { nested: 'retained' }
  }))
  const config = { id: 'knx-config', type: 'knxUltimate-config', users: legacyNodes.slice() }
  const group = { id: 'group-1', type: 'group', nodes: legacyNodes.slice() }
  const debug = { id: 'target-1', type: 'debug' }
  const allNodes = [...legacyNodes, debug, config]
  const links = [{ source: debug, target: legacyNodes[0], sourcePort: 0 }]
  let dirty = options.dirty || false
  const history = []
  const notifications = []
  const changed = []
  const RED = {
    _: key => key,
    nodes: {
      eachNode: cb => allNodes.forEach(cb),
      node: id => allNodes.find(node => node.id === id),
      getType: type => type === 'knxUltimateUtility' ? definition : undefined,
      dirty: value => { if (value !== undefined) dirty = value; return dirty },
      workspace: () => ({ locked: Boolean(options.locked) })
    },
    history: { push: event => history.push(event) },
    editor: { validateNode: node => { node.valid = true } },
    events: { emit: (name, node) => changed.push({ name, node }) },
    view: { redraw: () => {} },
    notify: (message, settings) => {
      const notification = { message, settings, closed: false, close: () => { notification.closed = true } }
      notifications.push(notification)
      return notification
    }
  }
  return { RED, legacyNodes, allNodes, config, group, links, definition, history, notifications, changed }
}

// Exercise the edit/multi history contract used by Node-RED, including creation
// of the inverse edit for Redo and the outer event's dirty flag restoration.
function replayHistory (RED, event) {
  const inverse = { t: event.t, dirty: RED.nodes.dirty() }
  if (event.t === 'multi') {
    inverse.events = event.events.slice().reverse().map(child => replayHistory(RED, child))
  } else {
    inverse.node = event.node
    inverse.changed = event.node.changed
    inverse.changes = {}
    Object.keys(event.changes).forEach(key => {
      inverse.changes[key] = event.node[key]
      event.node[key] = event.changes[key]
    })
    event.node.changed = event.changed
    event.node.dirty = true
    if (event.callback) {
      inverse.callback = event.callback
      event.callback(event)
    }
    RED.editor.validateNode(event.node)
  }
  RED.nodes.dirty(event.dirty)
  return inverse
}

describe('KNX Utility migration', function () {
  it('selects only the eleven supported legacy types and derives their real port counts', function () {
    const fixture = editorFixture()
    expect(migration.collectLegacyUtilityNodes(fixture.RED)).to.deep.equal(fixture.legacyNodes)
    expect(migration.createLocalMigrationPatches(fixture.legacyNodes)).to.deep.equal([
      { index: 0, type: 'knxUltimateUtility', utilityType: 'alerter', inputs: 1, outputs: 3 },
      { index: 1, type: 'knxUltimateUtility', utilityType: 'autoresponder', inputs: 0, outputs: 0 },
      { index: 2, type: 'knxUltimateUtility', utilityType: 'datetime', inputs: 0, outputs: 0 },
      { index: 3, type: 'knxUltimateUtility', utilityType: 'watchdog', inputs: 1, outputs: 1 },
      { index: 4, type: 'knxUltimateUtility', utilityType: 'globalcontext', inputs: 0, outputs: 0 },
      { index: 5, type: 'knxUltimateUtility', utilityType: 'logger', inputs: 1, outputs: 2 },
      { index: 6, type: 'knxUltimateUtility', utilityType: 'staircase', inputs: 1, outputs: 1 },
      { index: 7, type: 'knxUltimateUtility', utilityType: 'garage', inputs: 1, outputs: 1 },
      { index: 8, type: 'knxUltimateUtility', utilityType: 'scenecontroller', inputs: 1, outputs: 1 },
      { index: 9, type: 'knxUltimateUtility', utilityType: 'loadcontrol', inputs: 1, outputs: 1 },
      { index: 10, type: 'knxUltimateUtility', utilityType: 'hatranslator', inputs: 1, outputs: 1, haTranslationTable: fixture.legacyNodes[10].commandText }
    ])
    ;[null, {}, { type: 'knxUltimateUtility' }, { type: 'knxUltimate' }, { type: 'toString' }].forEach(node => {
      expect(migration.isLegacyUtilityNode(node)).to.equal(false)
    })
    expect(() => migration.createLocalMigrationPatches(null)).to.throw(TypeError)
    expect(() => migration.createLocalMigrationPatches([{ type: 'debug' }])).to.throw(TypeError)
  })

  it('converts in place and preserves every setting, ID, config reference, link and group member', function () {
    const { RED, legacyNodes, config, group, links, definition, history, changed } = editorFixture()
    const before = legacyNodes.map(node => ({ ...node }))
    const linkBefore = { ...links[0] }
    expect(migration.applyLocalMigration(RED, legacyNodes)).to.equal(11)
    const updatedKeys = new Set(['type', '_def', '_', 'utilityType', 'changed', 'dirty', 'resize', '_colorChanged', 'valid'])
    legacyNodes.forEach((node, index) => {
      expect(node.type).to.equal('knxUltimateUtility')
      expect(node._def).to.equal(definition)
      expect(node.utilityType).to.equal(migration.LEGACY_NODE_PROFILES[before[index].type].utilityType)
      Object.keys(before[index]).filter(key => !updatedKeys.has(key)).forEach(key => {
        expect(node[key], `node ${index} setting ${key}`).to.equal(before[index][key])
      })
      expect(config.users[index]).to.equal(node)
      expect(group.nodes[index]).to.equal(node)
    })
    expect(links[0]).to.deep.equal(linkBefore)
    expect(history).to.have.length(1)
    expect(history[0]).to.include({ t: 'multi', dirty: false })
    expect(RED.nodes.dirty()).to.equal(true)
    expect(changed.map(event => event.node)).to.deep.equal(legacyNodes)
  })

  it('preserves every legacy editor setting and persistent storage identity through conversion and Undo/Redo', function () {
    const { RED, legacyNodes, history } = editorFixture()
    legacyNodes.forEach(node => {
      // Frozen version 7 defaults: no dependency on deleted public node editors.
      const legacyDefinition = require('./fixtures/knx7-utility-definitions.json')[node.type]
      expect(migration.LEGACY_NODE_PROFILES[node.type], node.type).to.include({ inputs: legacyDefinition.inputs, outputs: legacyDefinition.outputs })
      node._def = legacyDefinition
      Object.entries(legacyDefinition.defaults).forEach(([key, field]) => {
        if (key === 'server') return
        if (typeof field.value === 'boolean') node[key] = !field.value
        else if (typeof field.value === 'number') node[key] = field.value + 1
        else if (field.value && typeof field.value === 'object') node[key] = JSON.parse(JSON.stringify(field.value))
        else node[key] = `${node.type}-${key}-saved`
      })
    })
    const scene = legacyNodes.find(node => node.type === 'knxUltimateSceneController')
    scene.id = 'scene-with-recorded-values'
    scene.rules = [{ topic: '2/3/4', dpt: '5.001', value: '75', devicename: 'Living room brightness' }]
    const responder = legacyNodes.find(node => node.type === 'knxUltimateAutoResponder')
    responder.id = 'responder-with-cached-values'
    responder.commandText = '[{"ga":"2/4/1..3","dpt":"1.001","default":false}]'
    const globalContext = legacyNodes.find(node => node.type === 'knxUltimateGlobalContext')
    globalContext.name = 'KNXSharedState'
    globalContext.contextStorage = 'persistent'
    const logger = legacyNodes.find(node => node.type === 'knxUltimateLogger')
    logger.saveMode = 'file'
    logger.filePath = '/data/knx-traffic.xml'
    const before = legacyNodes.map(node => ({ ...node }))
    const preservedKeys = new Set(['type', '_def', '_', 'utilityType'])
    const assertPreservedSettings = () => {
      legacyNodes.forEach((node, index) => {
        Object.keys(before[index]).filter(key => !preservedKeys.has(key) && key !== 'changed').forEach(key => {
          expect(node[key], `${before[index].type}.${key}`).to.equal(before[index][key])
        })
      })
      expect(`SceneController_${scene.id}`).to.equal('SceneController_scene-with-recorded-values')
      expect(`knxpersist${responder.id}.json`).to.equal('knxpersistresponder-with-cached-values.json')
      expect(globalContext).to.include({ name: 'KNXSharedState', contextStorage: 'persistent' })
      expect(logger).to.include({ saveMode: 'file', filePath: '/data/knx-traffic.xml' })
    }
    migration.applyLocalMigration(RED, legacyNodes)
    assertPreservedSettings()
    const redo = replayHistory(RED, history[0])
    assertPreservedSettings()
    replayHistory(RED, redo)
    assertPreservedSettings()
  })

  it('preserves Home Assistant mappings and nested input paths without adding a gateway through Undo/Redo', function () {
    const { RED, legacyNodes, config, history } = editorFixture()
    const translator = legacyNodes.find(node => node.type === 'knxUltimateHATranslator')
    delete translator.server
    config.users = config.users.filter(node => node !== translator)
    translator.payloadPropName = 'data.new_state.state'
    translator.commandText = 'occupied:true\nempty:false\narmed_home:true\ndisarmed:false'
    translator.customSetting = { nested: { source: 'home-assistant' } }
    const before = { ...translator }
    const assertMappings = () => {
      expect(translator).to.include({ id: before.id, payloadPropName: before.payloadPropName, commandText: before.commandText })
      expect(translator).not.to.have.property('server')
      expect(translator.wires).to.equal(before.wires)
      expect(translator.customSetting).to.equal(before.customSetting)
      expect(config.users).not.to.include(translator)
    }
    expect(migration.applyLocalMigration(RED, [translator])).to.equal(1)
    expect(translator).to.include({ type: 'knxUltimateUtility', utilityType: 'hatranslator', inputs: 1, outputs: 1 })
    expect(translator.haTranslationTable).to.equal(before.commandText)
    assertMappings()
    const redo = replayHistory(RED, history[0])
    expect(translator.type).to.equal('knxUltimateHATranslator')
    expect(translator.haTranslationTable).to.equal(undefined)
    assertMappings()
    replayHistory(RED, redo)
    expect(translator.utilityType).to.equal('hatranslator')
    expect(translator.haTranslationTable).to.equal(before.commandText)
    assertMappings()
  })

  it('copies empty Home Assistant tables and rolls back an existing table when validation fails', function () {
    const { RED, legacyNodes, history } = editorFixture()
    const translator = legacyNodes.find(node => node.type === 'knxUltimateHATranslator')
    translator.commandText = ''
    translator.haTranslationTable = 'old:true'
    expect(migration.createLocalMigrationPatches([translator])[0].haTranslationTable).to.equal('')
    RED.editor.validateNode = () => { throw new Error('invalid') }
    expect(() => migration.applyLocalMigration(RED, [translator])).to.throw('invalid')
    expect(translator).to.include({ type: 'knxUltimateHATranslator', commandText: '', haTranslationTable: 'old:true' })
    expect(history).to.have.length(0)
    delete translator.haTranslationTable
    expect(() => migration.applyLocalMigration(RED, [translator])).to.throw('invalid')
    expect(translator).not.to.have.property('haTranslationTable')
    translator.haTranslationTable = 'old:true'
    RED.editor.validateNode = node => { node.valid = true }
    migration.applyLocalMigration(RED, [translator])
    expect(translator.haTranslationTable).to.equal('')
    const redo = replayHistory(RED, history[0])
    expect(translator.haTranslationTable).to.equal('old:true')
    replayHistory(RED, redo)
    expect(translator.haTranslationTable).to.equal('')
  })

  it('uses the legacy Home Assistant default when old flow JSON omitted its translation table', function () {
    const { legacyNodes } = editorFixture()
    const translator = legacyNodes.find(node => node.type === 'knxUltimateHATranslator')
    delete translator.commandText
    expect(migration.createLocalMigrationPatches([translator])[0].haTranslationTable).to.equal('on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false')
    translator._def.defaults.commandText = { value: 'custom:true' }
    expect(migration.createLocalMigrationPatches([translator])[0].haTranslationTable).to.equal('custom:true')
  })

  it('converts every legacy instance across tabs and subflows regardless of the active tab or selection', function () {
    const { RED, legacyNodes, allNodes, config, history, notifications, changed } = editorFixture()
    const otherInstances = ['tab-2', 'subflow-1'].flatMap(z => legacyNodes.map(node => ({
      ...node,
      id: `${z}-${node.id}`,
      z,
      g: `${z}-group`,
      wires: node.wires.map(output => output.slice()),
      selected: false
    })))
    const candidates = [...legacyNodes, ...otherInstances]
    allNodes.push(...otherInstances)
    config.users.push(...otherInstances)
    const otherFamilies = [
      { id: 'main-knx', type: 'knxUltimate', z: 'tab-1', server: config.id, topic: '1/2/3', wires: [[legacyNodes[0].id]] },
      { id: 'viewer', type: 'knxUltimateViewer', z: 'tab-2', server: config.id, wires: [] },
      { id: 'hue-legacy', type: 'knxUltimateHueLight', z: 'subflow-1', server: config.id, wires: [] },
      { id: 'hue-controller', type: 'knxUltimateHueController', z: 'tab-1', hueControllerType: 'light', wires: [] },
      { id: 'existing-utility', type: 'knxUltimateUtility', z: 'tab-2', utilityType: 'alerter', wires: [[], [], []] },
      { id: 'subflow-instance', type: 'subflow:subflow-1', z: 'tab-1', wires: [] }
    ]
    allNodes.push(...otherFamilies)
    const untouched = allNodes.filter(node => !candidates.includes(node))
    const untouchedBefore = untouched.map(node => ({ ...node }))
    const candidatesBefore = candidates.map(node => ({ ...node }))
    RED.workspaces = { active: () => 'tab-1' }
    RED.view.selection = () => ({ nodes: [legacyNodes[0]] })
    RED.view.getActiveNodes = () => allNodes.filter(node => node.z === 'tab-1')
    RED.nodes.workspace = id => ['tab-1', 'tab-2'].includes(id) ? { id, locked: false } : undefined
    RED.nodes.subflow = id => id === 'subflow-1' ? { id, type: 'subflow', locked: false } : undefined
    RED.actions = { invoke: () => {} }

    expect(migration.collectLegacyUtilityNodes(RED)).to.deep.equal(candidates)
    migration.migrate(RED, { environment: { setTimeout: callback => callback() }, backupApi: { download: () => {} } })
    expect(notifications[0].message).to.include('33')
    expect(history).to.have.length(0)
    expect(candidates.map(node => node.type)).to.deep.equal(candidatesBefore.map(node => node.type))
    notifications[0].settings.buttons[1].click()

    candidates.forEach((node, index) => {
      const before = candidatesBefore[index]
      const profile = migration.LEGACY_NODE_PROFILES[before.type]
      expect(node).to.include({ id: before.id, z: before.z, g: before.g, server: before.server, type: 'knxUltimateUtility', ...profile })
      expect(node.wires).to.equal(before.wires)
      expect(config.users).to.include(node)
    })
    untouched.forEach((node, index) => expect(node).to.deep.equal(untouchedBefore[index]))
    expect(changed.map(event => event.node)).to.deep.equal(candidates)
    expect(history).to.have.length(1)
    expect(history[0].t).to.equal('multi')
    expect(history[0].events).to.have.length(33)
    replayHistory(RED, history[0])
    candidates.forEach((node, index) => expect(node.type).to.equal(candidatesBefore[index].type))
    untouched.forEach((node, index) => expect(node).to.deep.equal(untouchedBefore[index]))
  })

  it('restores types, definitions, ports and dirty state with one Undo and supports Redo', function () {
    const { RED, legacyNodes, definition, history } = editorFixture()
    const before = legacyNodes.map(node => ({ ...node }))
    migration.applyLocalMigration(RED, legacyNodes)
    const redo = replayHistory(RED, history[0])
    expect(RED.nodes.dirty()).to.equal(false)
    legacyNodes.forEach((node, index) => {
      expect(node).to.include({ type: before[index].type, inputs: before[index].inputs, outputs: before[index].outputs, changed: before[index].changed })
      expect(node._def).to.equal(before[index]._def)
      expect(node._).to.equal(before[index]._)
      expect(node.utilityType).to.equal(undefined)
    })
    replayHistory(RED, redo)
    expect(RED.nodes.dirty()).to.equal(true)
    expect(legacyNodes.every(node => node.type === 'knxUltimateUtility' && node._def === definition)).to.equal(true)
  })

  it('keeps pre-existing unsaved changes dirty when the migration is undone', function () {
    const { RED, legacyNodes, history } = editorFixture({ dirty: true })
    migration.applyLocalMigration(RED, [legacyNodes[0]])
    expect(history[0].t).to.equal('edit')
    replayHistory(RED, history[0])
    expect(RED.nodes.dirty()).to.equal(true)
  })

  it('recreates only migrated SVG views with the right color, icon and button through Undo/Redo', function () {
    const { RED, legacyNodes, definition, history, links, config, group } = editorFixture()
    const elements = new Map()
    const hooks = []
    const oldDefinitions = legacyNodes.map((node, index) => {
      Object.assign(node._def, { color: '#E5F0E2', icon: `legacy-${index}.svg`, button: index === 2 ? {} : undefined })
      return node._def
    })
    Object.assign(definition, { color: '#C7E9C0', icon: 'utility.svg', button: {} })
    const render = node => {
      const element = {
        __data__: node,
        classList: { contains: name => name === 'red-ui-flow-node-group' },
        color: node._def.color,
        icon: node._def.icon,
        button: Boolean(node._def.button),
        remove: () => elements.delete(node.id)
      }
      elements.set(node.id, element)
      return element
    }
    legacyNodes.forEach(node => { node.w = 240; render(node) })
    const unrelated = { id: 'unrelated-svg' }
    elements.set(unrelated.id, unrelated)
    RED.hooks = { trigger: (name, value) => hooks.push({ name, ...value }) }
    RED.view.redraw = () => {
      legacyNodes.forEach(node => {
        const element = elements.get(node.id) || render(node)
        // The old implementation triggers the Node-RED 5.0.4 typo for
        // DateTime, and a missing button group for the other two profiles.
        if (node._colorChanged && element.button) throw new TypeError('settAttribute is not a function')
        if (node._def.button && !element.button) throw new TypeError('missing button group')
        if (node.resize) {
          const width = node.type === 'knxUltimateUtility' ? 180 : 240
          if (node.w !== undefined) node.x += (width - node.w) / 2
          node.w = width
          node.resize = false
        }
      })
    }
    const documentObject = { getElementById: id => elements.get(id) }
    const expectedView = definitions => {
      legacyNodes.forEach((node, index) => {
        const element = elements.get(node.id)
        expect(element).to.include({ color: definitions[index].color, icon: definitions[index].icon, button: Boolean(definitions[index].button) })
        expect(element.__data__).to.equal(node)
        expect(node.x).to.equal(100)
        expect(config.users[index]).to.equal(node)
        expect(group.nodes[index]).to.equal(node)
        expect(node).not.to.have.property('_colorChanged')
      })
      expect(elements.get(unrelated.id)).to.equal(unrelated)
      expect(links[0].target).to.equal(legacyNodes[0])
    }
    migration.applyLocalMigration(RED, legacyNodes, { documentObject })
    expectedView(legacyNodes.map(() => definition))
    const redo = replayHistory(RED, history[0])
    expectedView(oldDefinitions)
    replayHistory(RED, redo)
    expectedView(legacyNodes.map(() => definition))
    expect(hooks).to.have.length(33)
    expect(hooks.every(event => event.name === 'viewRemoveNode')).to.equal(true)
  })

  it('does not remove a DOM element unless both the node binding and canvas class match', function () {
    const { RED, legacyNodes } = editorFixture()
    let removed = 0
    const elements = [
      { __data__: {}, classList: { contains: () => true }, remove: () => { removed += 1 } },
      { __data__: legacyNodes[1], classList: { contains: () => false }, remove: () => { removed += 1 } }
    ]
    migration.applyLocalMigration(RED, legacyNodes, {
      documentObject: { getElementById: id => elements[legacyNodes.findIndex(node => node.id === id)] }
    })
    expect(removed).to.equal(0)
  })

  it('rolls back the entire batch, including the node whose validation fails', function () {
    const { RED, legacyNodes, history, changed } = editorFixture()
    legacyNodes.forEach(node => { delete node.utilityType })
    const before = legacyNodes.map(node => ({ ...node }))
    RED.editor.validateNode = node => {
      node.valid = false
      node.validationErrors = ['test failure']
      if (node === legacyNodes[2]) throw new Error('validation failed')
    }
    expect(() => migration.applyLocalMigration(RED, legacyNodes)).to.throw('validation failed')
    legacyNodes.forEach((node, index) => expect(node).to.deep.equal(before[index]))
    expect(history).to.have.length(0)
    expect(changed).to.have.length(0)
    expect(RED.nodes.dirty()).to.equal(false)
  })

  it('rejects locked flows, replaced nodes, duplicate entries and unavailable undo before changing nodes', function () {
    for (const scenario of ['locked', 'replaced', 'duplicate', 'no-history', 'no-definition']) {
      const { RED, legacyNodes, allNodes, history } = editorFixture({ locked: scenario === 'locked' })
      const before = legacyNodes.map(node => ({ ...node }))
      if (scenario === 'replaced') allNodes[0] = { ...legacyNodes[0] }
      if (scenario === 'no-history') delete RED.history
      if (scenario === 'no-definition') RED.nodes.getType = () => undefined
      const candidates = scenario === 'duplicate' ? [legacyNodes[0], legacyNodes[0]] : legacyNodes
      expect(() => migration.applyLocalMigration(RED, candidates), scenario).to.throw()
      legacyNodes.forEach((node, index) => expect(node, scenario).to.deep.equal(before[index]))
      expect(history).to.have.length(0)
    }
  })

  it('leaves an empty selection and its dirty/history state untouched', function () {
    const { RED, history } = editorFixture()
    expect(migration.applyLocalMigration(RED, [])).to.equal(0)
    expect(history).to.have.length(0)
    expect(RED.nodes.dirty()).to.equal(false)
  })

  it('starts one backup before closing the editor or converting and prevents repeated confirmation', function () {
    const { RED, legacyNodes, history, notifications } = editorFixture()
    const pending = []
    const actions = []
    const backups = []
    let closeCount = 0
    const typesBefore = legacyNodes.map(node => node.type)
    RED.actions = { invoke: action => actions.push(action) }
    const close = migration.migrate(RED, {
      environment: { setTimeout: callback => pending.push(callback) },
      onClose: () => { closeCount += 1 },
      backupApi: {
        download: (editor, options) => {
          expect(editor).to.equal(RED)
          expect(options.kind).to.equal('knx')
          expect(actions).to.have.length(0)
          expect(notifications[0].closed).to.equal(false)
          expect(legacyNodes.map(node => node.type)).to.deep.equal(typesBefore)
          backups.push(options)
        }
      }
    })
    expect(backups).to.have.length(0)
    expect(closeCount).to.equal(0)
    expect(history).to.have.length(0)
    expect(notifications[0].message).to.include('11 compatible legacy')
    expect(notifications[0].settings).to.include({ modal: true, fixed: true })
    const confirm = notifications[0].settings.buttons[1].click
    confirm()
    confirm()
    expect(closeCount).to.equal(1)
    expect(backups).to.have.length(1)
    expect(actions).to.deep.equal(['core:cancel-edit-tray'])
    expect(pending).to.have.length(1)
    expect(history).to.have.length(0)
    pending[0]()
    expect(legacyNodes.every(node => node.type === 'knxUltimateUtility')).to.equal(true)
    expect(history).to.have.length(1)
    expect(notifications[1].message).to.include('11 nodes converted')
    close()
    expect(closeCount).to.equal(1)
  })

  it('keeps the editor and nodes unchanged if the backup tool is missing or fails, and allows retry', function () {
    for (const missing of [false, true]) {
      const { RED, legacyNodes, history, notifications } = editorFixture({ dirty: true })
      const pending = []
      const actions = []
      let closeCount = 0
      const originalTypes = legacyNodes.map(node => node.type)
      RED.actions = { invoke: action => actions.push(action) }
      const environment = { setTimeout: callback => pending.push(callback) }
      if (!missing) environment.KNXUltimateFlowMigrationBackup = { download: () => { throw new Error('Download failed') } }
      migration.migrate(RED, { environment, onClose: () => { closeCount += 1 } })
      expect(closeCount).to.equal(0)
      const confirm = notifications[0].settings.buttons[1].click
      confirm()
      expect(notifications[0].closed).to.equal(false)
      expect(closeCount).to.equal(0)
      expect(notifications[1].message).to.include('Flow backup could not be started. No nodes were converted:')
      expect(actions).to.have.length(0)
      expect(pending).to.have.length(0)
      expect(history).to.have.length(0)
      expect(RED.nodes.dirty()).to.equal(true)
      expect(legacyNodes.map(node => node.type)).to.deep.equal(originalTypes)
      environment.KNXUltimateFlowMigrationBackup = { download: () => {} }
      confirm()
      expect(pending).to.have.length(1)
      pending[0]()
      expect(legacyNodes.every(node => node.type === 'knxUltimateUtility')).to.equal(true)
      expect(history).to.have.length(1)
      expect(closeCount).to.equal(1)
    }
  })

  it('cancels without changing nodes and reports an empty editor without conversion', function () {
    const { RED, history, notifications } = editorFixture()
    let downloads = 0
    let closeCount = 0
    const options = { backupApi: { download: () => { downloads++ } }, onClose: () => { closeCount += 1 } }
    const close = migration.migrate(RED, options)
    expect(closeCount).to.equal(0)
    notifications[0].settings.buttons[0].click()
    notifications[0].settings.buttons[1].click()
    close()
    expect(closeCount).to.equal(1)
    expect(notifications[0].closed).to.equal(true)
    expect(history).to.have.length(0)
    RED.nodes.eachNode = () => {}
    migration.migrate(RED, options)
    expect(notifications[1].message).to.include('No compatible legacy')
    expect(history).to.have.length(0)
    expect(downloads).to.equal(0)
    expect(closeCount).to.equal(2)
  })

  it('localizes legacy notices, migration controls and help in every supported language', function () {
    const root = path.resolve(__dirname, '..')
    const keys = ['migration_button', 'migration_button_title', 'migration_confirm', 'migration_cancel', 'migration_convert', 'migration_none', 'migration_success', 'migration_failed', 'migration_backup_failed']
    ;['en', 'it', 'de', 'fr', 'es', 'zh-CN'].forEach(locale => {
      const dir = path.join(root, 'nodes', 'locales', locale)
      const utility = JSON.parse(fs.readFileSync(path.join(dir, 'knxUltimateUtility.json'), 'utf8')).knxUltimateUtility
      keys.forEach(key => expect(utility[key], `${locale}/${key}`).to.be.a('string').and.not.be.empty)
    })
  })
})
