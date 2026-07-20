const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const { knxToMatter, matterToKnx, CLUSTER } = require('../nodes/utils/matterKnxConverter')
const { LOCK_STATE, lockStateToBoolean, setupDoorLockProfile } = require('../nodes/utils/matterControllerProfiles/doorLock')
const { PROFILE_SETUPS, setupMatterControllerProfile } = require('../nodes/utils/matterControllerProfiles')
const { isValidGroupAddress, parseMappings, setupMappedEndpointProfile } = require('../nodes/utils/matterControllerProfiles/mappedEndpoint')

describe('matterKnxConverter – knxToMatter', () => {
  describe('OnOff cluster', () => {
    it('maps a true KNX payload to the on command', () => {
      const action = knxToMatter({ clusterId: CLUSTER.ON_OFF, targetKind: 'command', target: 'on' }, true)
      expect(action).to.deep.equal({ kind: 'command', name: 'on', args: undefined })
    })

    it('maps a false KNX payload to the off command even if "on" is the mapped target', () => {
      const action = knxToMatter({ clusterId: CLUSTER.ON_OFF, targetKind: 'command', target: 'on' }, false)
      expect(action.name).to.equal('off')
    })

    it('keeps toggle as toggle regardless of the payload', () => {
      const action = knxToMatter({ clusterId: CLUSTER.ON_OFF, targetKind: 'command', target: 'toggle' }, false)
      expect(action.name).to.equal('toggle')
    })
  })

  describe('LevelControl cluster', () => {
    it('converts KNX percent to Matter level 0-254', () => {
      const action = knxToMatter({ clusterId: CLUSTER.LEVEL_CONTROL, targetKind: 'command', target: 'moveToLevelWithOnOff' }, 50)
      expect(action.name).to.equal('moveToLevelWithOnOff')
      expect(action.args.level).to.equal(127)
      expect(action.args.transitionTime).to.equal(0)
    })

    it('clamps out of range percentages', () => {
      const action = knxToMatter({ clusterId: CLUSTER.LEVEL_CONTROL, targetKind: 'command', target: 'moveToLevel' }, 150)
      expect(action.args.level).to.equal(254)
    })
  })

  describe('WindowCovering cluster', () => {
    it('maps DPT 1.008 payloads to up/down commands', () => {
      expect(knxToMatter({ clusterId: CLUSTER.WINDOW_COVERING, targetKind: 'command', target: 'upOrOpen' }, false).name).to.equal('upOrOpen')
      expect(knxToMatter({ clusterId: CLUSTER.WINDOW_COVERING, targetKind: 'command', target: 'upOrOpen' }, true).name).to.equal('downOrClose')
    })

    it('converts percent to percent100ths for goToLiftPercentage', () => {
      const action = knxToMatter({ clusterId: CLUSTER.WINDOW_COVERING, targetKind: 'command', target: 'goToLiftPercentage' }, 75)
      expect(action.args.liftPercent100thsValue).to.equal(7500)
    })
  })

  describe('Thermostat attribute writes', () => {
    it('converts °C to centi-°C for setpoints', () => {
      const action = knxToMatter({ clusterId: CLUSTER.THERMOSTAT, targetKind: 'attribute', target: 'occupiedHeatingSetpoint' }, 21.5)
      expect(action).to.deep.equal({ kind: 'attributeWrite', name: 'occupiedHeatingSetpoint', args: 2150 })
    })
  })

  describe('ColorControl cluster', () => {
    it('converts Kelvin to mireds', () => {
      const action = knxToMatter({ clusterId: CLUSTER.COLOR_CONTROL, targetKind: 'command', target: 'moveToColorTemperature' }, 4000)
      expect(action.args.colorTemperatureMireds).to.equal(250)
    })

    it('accepts mireds directly for small values', () => {
      const action = knxToMatter({ clusterId: CLUSTER.COLOR_CONTROL, targetKind: 'command', target: 'moveToColorTemperature' }, 250)
      expect(action.args.colorTemperatureMireds).to.equal(250)
    })
  })

  describe('generic fallback', () => {
    it('passes object payloads through as command arguments', () => {
      const action = knxToMatter({ clusterId: 9999, targetKind: 'command', target: 'someCommand' }, { foo: 1 })
      expect(action).to.deep.equal({ kind: 'command', name: 'someCommand', args: { foo: 1 } })
    })
  })
})

describe('matterKnxConverter – matterToKnx', () => {
  it('passes onOff through as boolean', () => {
    expect(matterToKnx(CLUSTER.ON_OFF, 'onOff', true)).to.equal(true)
  })

  it('converts currentLevel to percent', () => {
    expect(matterToKnx(CLUSTER.LEVEL_CONTROL, 'currentLevel', 254)).to.equal(100)
    expect(matterToKnx(CLUSTER.LEVEL_CONTROL, 'currentLevel', 127)).to.equal(50)
  })

  it('converts lift percent100ths to percent', () => {
    expect(matterToKnx(CLUSTER.WINDOW_COVERING, 'currentPositionLiftPercent100ths', 7500)).to.equal(75)
  })

  it('converts thermostat centi-°C to °C', () => {
    expect(matterToKnx(CLUSTER.THERMOSTAT, 'localTemperature', 2150)).to.equal(21.5)
  })

  it('converts temperature measurement centi-units', () => {
    expect(matterToKnx(CLUSTER.TEMPERATURE, 'measuredValue', 2312)).to.equal(23.12)
  })

  it('converts illuminance log scale to Lux', () => {
    expect(matterToKnx(CLUSTER.ILLUMINANCE, 'measuredValue', 1)).to.equal(1)
    expect(matterToKnx(CLUSTER.ILLUMINANCE, 'measuredValue', 40001)).to.equal(10000)
  })

  it('converts occupancy bitmap objects to boolean', () => {
    expect(matterToKnx(CLUSTER.OCCUPANCY, 'occupancy', { occupied: true })).to.equal(true)
    expect(matterToKnx(CLUSTER.OCCUPANCY, 'occupancy', 0)).to.equal(false)
  })

  it('converts mireds to Kelvin', () => {
    expect(matterToKnx(CLUSTER.COLOR_CONTROL, 'colorTemperatureMireds', 250)).to.equal(4000)
  })

  it('converts battery half-percent units', () => {
    expect(matterToKnx(CLUSTER.POWER_SOURCE, 'batPercentRemaining', 200)).to.equal(100)
  })

  it('converts electrical power mW to W', () => {
    expect(matterToKnx(CLUSTER.ELECTRICAL_POWER, 'activePower', 60000)).to.equal(60)
  })

  it('converts cumulative energy mWh to kWh', () => {
    expect(matterToKnx(CLUSTER.ELECTRICAL_ENERGY, 'cumulativeEnergyImported', { energy: 1500000 })).to.equal(1.5)
  })

  it('skips null values', () => {
    expect(matterToKnx(CLUSTER.ON_OFF, 'onOff', null)).to.equal(undefined)
  })

  it('converts lockState enum to boolean locked', () => {
    expect(matterToKnx(CLUSTER.DOOR_LOCK, 'lockState', 1)).to.equal(true)
    expect(matterToKnx(CLUSTER.DOOR_LOCK, 'lockState', 2)).to.equal(false)
  })
})

describe('Matter controller Door Lock profile', () => {
  const createFixture = ({ pin = '', capabilities = {} } = {}) => {
    const knxWrites = []
    const matterWrites = []
    const outputs = []
    const errors = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'door-lock-node',
      credentials: { doorLockPin: pin },
      matterNodeId: '123',
      matterEndpointId: 4,
      matterDeviceName: 'Front door',
      status: () => {},
      send: (msg) => outputs.push(msg),
      error: (error) => errors.push(error),
      serverKNX: {
        addClient: (client) => client.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Node initialized.' }),
        removeClient: () => {},
        sendKNXTelegramToKNXEngine: (item) => knxWrites.push(item)
      },
      serverMatter: {
        addClient: () => {},
        removeClient: () => {},
        matterManager: {
          writeMatterQueueAdd: (item) => matterWrites.push(item),
          getCachedAttribute: () => undefined
        }
      }
    })
    const RED = { log: { error: (message) => errors.push(message) } }
    setupDoorLockProfile(RED, node, {
      name: 'Front door',
      matterDeviceCapabilities: JSON.stringify({ profile: 'doorLock', lockDoor: true, unlockDoor: true, ...capabilities }),
      GALightSwitch: '1/1/1',
      dptLightSwitch: '1.001',
      GALightState: '1/1/2',
      dptLightState: '1.001',
      enableNodePINS: 'yes'
    })
    return { node, knxWrites, matterWrites, outputs, errors }
  }

  it('keeps not-fully-locked and unlatched distinct from binary KNX states', () => {
    expect(lockStateToBoolean(LOCK_STATE.LOCKED)).to.equal(true)
    expect(lockStateToBoolean(LOCK_STATE.UNLOCKED)).to.equal(false)
    expect(lockStateToBoolean(LOCK_STATE.NOT_FULLY_LOCKED)).to.equal(undefined)
    expect(lockStateToBoolean(LOCK_STATE.UNLATCHED)).to.equal(undefined)
  })

  it('routes KNX writes to Door Lock commands and includes a configured credential PIN', () => {
    const { node, matterWrites, knxWrites } = createFixture({ pin: '2468' })
    node.handleSend({ knx: { destination: '1/1/1', event: 'GroupValue_Write', rawValue: Buffer.from([1]) } })
    node.handleSend({ knx: { destination: '1/1/1', event: 'GroupValue_Write', rawValue: Buffer.from([0]) } })
    expect(matterWrites.map((item) => item.name)).to.deep.equal(['lockDoor', 'unlockDoor'])
    expect(Buffer.from(matterWrites[0].args.pinCode).toString('utf8')).to.equal('2468')
    expect(knxWrites).to.have.length(0)
  })

  it('publishes only unambiguous Matter lockState feedback to KNX without command reflection', () => {
    const { node, matterWrites, knxWrites, outputs } = createFixture()
    node.handleSendMatter({ nodeId: '123', endpointId: 4, clusterId: CLUSTER.DOOR_LOCK, attributeName: 'lockState', value: LOCK_STATE.LOCKED })
    node.handleSendMatter({ nodeId: '123', endpointId: 4, clusterId: CLUSTER.DOOR_LOCK, attributeName: 'lockState', value: LOCK_STATE.UNLATCHED })
    expect(knxWrites).to.have.length(1)
    expect(knxWrites[0]).to.include({ grpaddr: '1/1/2', payload: true, outputtype: 'write' })
    expect(matterWrites).to.have.length(0)
    expect(outputs[1].matter.lockStateName).to.equal('unlatched')
  })

  it('rejects a command not advertised by the endpoint', () => {
    const { node, matterWrites, errors } = createFixture({ capabilities: { unlockDoor: false } })
    node.handleSend({ knx: { destination: '1/1/1', event: 'GroupValue_Write', rawValue: Buffer.from([0]) } })
    expect(matterWrites).to.have.length(0)
    expect(errors.join(' ')).to.match(/does not expose unlockDoor/)
  })

  it('keeps the last lock state visible when the controller reports ready', () => {
    const statuses = []
    const { node } = createFixture()
    node.status = (status) => statuses.push(status)
    node.handleSendMatter({ nodeId: '123', endpointId: 4, clusterId: CLUSTER.DOOR_LOCK, attributeName: 'lockState', value: LOCK_STATE.UNLOCKED })
    node.setNodeStatusMatter({ fill: 'green', shape: 'ring', text: 'Ready' })
    expect(statuses.at(-1)).to.deep.equal({ fill: 'blue', shape: 'dot', text: 'Matter: unlocked' })
    node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'READ' })
    expect(statuses.at(-1)).to.deep.equal({ fill: 'blue', shape: 'dot', text: 'Matter: unlocked | KNX: READ' })
  })
})

describe('Matter controller multi-purpose profile routing', () => {
  it('leaves the existing light path untouched when no non-light profile is selected', () => {
    expect(setupMatterControllerProfile(undefined, {}, {}, {})).to.equal(false)
    expect(setupMatterControllerProfile('lightLegacy', {}, {}, {})).to.equal(false)
  })

  it('retains only complete persisted mappings', () => {
    const valid = { ga: '1/1/1', dpt: '1.001', target: 'on' }
    expect(parseMappings(JSON.stringify([valid, { ga: '', dpt: '1.001', target: 'on' }, { ga: '1/1/2', dpt: '' }]))).to.deep.equal([valid])
    expect(isValidGroupAddress('32/0/1')).to.equal(false)
  })

  it('routes a mapped sensor report to KNX and a mapped actuator telegram to Matter', () => {
    const knxWrites = []
    const matterWrites = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'mapped-node',
      matterNodeId: '55',
      matterEndpointId: 2,
      matterDeviceName: 'Mapped endpoint',
      status: () => {},
      send: () => {},
      serverKNX: {
        addClient: (client) => client.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Node initialized.' }), removeClient: () => {},
        sendKNXTelegramToKNXEngine: (item) => knxWrites.push(item)
      },
      serverMatter: {
        addClient: () => {}, removeClient: () => {},
        matterManager: {
          writeMatterQueueAdd: (item) => matterWrites.push(item),
          getCachedAttribute: () => undefined
        }
      }
    })
    const mappings = [
      { direction: 'command', ga: '1/2/1', dpt: '1.001', endpointId: 2, clusterId: CLUSTER.ON_OFF, targetKind: 'command', target: 'on' },
      { direction: 'status', ga: '1/2/2', dpt: '9.001', endpointId: 2, clusterId: CLUSTER.TEMPERATURE, targetKind: 'attribute', target: 'measuredValue' }
    ]
    setupMappedEndpointProfile({ log: { error: () => {} } }, node, { name: '', matterMappings: JSON.stringify(mappings), enableNodePINS: 'no' })
    node.handleSend({ knx: { destination: '1/2/1', event: 'GroupValue_Write', rawValue: Buffer.from([1]) } })
    node.handleSendMatter({ nodeId: '55', endpointId: 2, clusterId: CLUSTER.TEMPERATURE, attributeName: 'measuredValue', value: 2150 })
    expect(matterWrites[0]).to.include({ clusterId: CLUSTER.ON_OFF, name: 'on' })
    expect(knxWrites[0]).to.include({ grpaddr: '1/2/2', payload: 21.5, dpt: '9.001' })
  })

  it('reads an attribute with numeric ID zero from top-level flow fields', async () => {
    const outputs = []
    const reads = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'mapped-read-node', matterNodeId: '55', matterEndpointId: 2, status: () => {},
      send: (msg) => outputs.push(msg),
      serverMatter: {
        addClient: () => {}, removeClient: () => {},
        matterManager: {
          readAttribute: async (...args) => { reads.push(args); return true },
          writeMatterQueueAdd: () => {}
        }
      }
    })
    setupMappedEndpointProfile({ log: { error: () => {} } }, node, { matterMappings: '[]', enableNodePINS: 'yes' })
    await new Promise((resolve, reject) => node.emit('input', { clusterId: 6, attribute: 0 }, undefined, (error) => error ? reject(error) : resolve()))
    expect(reads[0]).to.deep.equal(['55', 2, 6, 0, false])
    expect(outputs[0]).to.include({ payload: true })
    expect(outputs[0].matter).to.include({ source: 'inputRead', clusterId: 6, attribute: 0 })
  })

  it('keeps attribute writes distinct from attribute reads', async () => {
    const writes = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'mapped-write-node', matterNodeId: '55', matterEndpointId: 2, status: () => {}, send: () => {},
      serverMatter: {
        addClient: () => {}, removeClient: () => {},
        matterManager: { readAttribute: async () => { throw new Error('unexpected read') }, writeMatterQueueAdd: (item) => writes.push(item) }
      }
    })
    setupMappedEndpointProfile({ log: { error: () => {} } }, node, { matterMappings: '[]', enableNodePINS: 'yes' })
    await new Promise((resolve, reject) => node.emit('input', { clusterId: CLUSTER.THERMOSTAT, attribute: 'occupiedHeatingSetpoint', value: 21 }, undefined, (error) => error ? reject(error) : resolve()))
    expect(writes).to.have.length(1)
    expect(writes[0]).to.include({ kind: 'attributeWrite', name: 'occupiedHeatingSetpoint' })
  })

  it('rejects Matter selectors nested in msg.payload', async () => {
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'mapped-contract-node', matterNodeId: '55', matterEndpointId: 2, status: () => {}, send: () => {},
      serverMatter: { addClient: () => {}, removeClient: () => {}, matterManager: { readAttribute: async () => true, writeMatterQueueAdd: () => {} } }
    })
    setupMappedEndpointProfile({ log: { error: () => {} } }, node, { matterMappings: '[]', enableNodePINS: 'yes' })
    const error = await new Promise((resolve) => node.emit('input', { payload: { clusterId: 6, attribute: 0 } }, undefined, resolve))
    expect(error.message).to.equal('Matter input requires clusterId and command or attribute')
  })
})

describe('Matter controller editor persistence and terminology', () => {
  const editorPath = path.join(__dirname, '..', 'nodes', 'knxUltimateMatterControllerDevice.html')
  const editor = fs.readFileSync(editorPath, 'utf8')

  it('does not overwrite the saved flow PIN selection when the editor opens', () => {
    expect(editor).not.to.match(/const desiredPins\s*=\s*knxSelected/)
    expect(editor).to.match(/if \(\$\("#node-input-enableNodePINS"\)\.val\(\) === "yes"\)/)
    expect(editor).to.match(/this\.outputs = 1;\s*this\.inputs = 1;/)
    expect(editor).to.match(/this\.outputs = 0;\s*this\.inputs = 0;/)
  })

  it('selects dedicated profiles for cover, thermostat, fan and switch clusters', () => {
    expect(editor).to.include("getMatterCluster(ep, 258) ? 'windowCovering'")
    expect(editor).to.include("getMatterCluster(ep, 513) ? 'thermostat'")
    expect(editor).to.include("getMatterCluster(ep, 514) ? 'fan'")
    expect(editor).to.include("getMatterCluster(ep, 59) ? 'switch'")
    expect(PROFILE_SETUPS).to.include.all.keys('windowCovering', 'thermostat', 'fan', 'switch')
  })

  it('uses Matter terminology in the rendered English help', () => {
    const help = editor.split('<script type="text/markdown" data-help-name="knxUltimateMatterControllerDevice">')[1] || ''
    // Lowercase "hue" remains a valid Matter Color Control concept (HSV hue).
    expect(help).not.to.match(/Philips Hue|\bHUE\b/)
  })

  it('uses Matter terminology in every localized editor string', () => {
    for (const locale of ['en', 'it', 'de', 'fr', 'es', 'zh-CN']) {
      const localePath = path.join(__dirname, '..', 'nodes', 'locales', locale, 'knxUltimateMatterControllerDevice.json')
      const values = []
      const collectStrings = (value) => {
        if (typeof value === 'string') values.push(value)
        else if (value && typeof value === 'object') Object.values(value).forEach(collectStrings)
      }
      collectStrings(JSON.parse(fs.readFileSync(localePath, 'utf8')))
      expect(values.join('\n'), `${locale} still contains a Hue label`).not.to.match(/hue/i)
    }
  })
})

describe('Matter controller dedicated mapped profiles', () => {
  const createProfileFixture = (profile, mappings = []) => {
    const outputs = []
    const statuses = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: `${profile}-node`, matterNodeId: '77', matterEndpointId: 3,
      status: (value) => statuses.push(value), send: (msg) => outputs.push(msg),
      serverMatter: { addClient: () => {}, removeClient: () => {}, matterManager: { getCachedAttribute: () => undefined, writeMatterQueueAdd: () => {} } }
    })
    setupMatterControllerProfile(profile, { log: { error: () => {} } }, node, {
      matterMappings: JSON.stringify(mappings), enableNodePINS: 'yes'
    })
    return { node, outputs, statuses }
  }

  it('formats Window Covering position while preserving mapped routing', () => {
    const { node, outputs, statuses } = createProfileFixture('windowCovering')
    node.handleSendMatter({ nodeId: '77', endpointId: 3, clusterId: CLUSTER.WINDOW_COVERING, attributeName: 'currentPositionLiftPercent100ths', value: 4250 })
    expect(node.matterProfile).to.equal('windowCovering')
    expect(outputs[0].payload).to.equal(4250)
    expect(statuses.at(-1).text).to.equal('Matter cover: 43%')
  })

  it('formats thermostat and fan state using their native units', () => {
    const thermostat = createProfileFixture('thermostat')
    thermostat.node.handleSendMatter({ nodeId: '77', endpointId: 3, clusterId: CLUSTER.THERMOSTAT, attributeName: 'localTemperature', value: 2150 })
    expect(thermostat.statuses.at(-1).text).to.equal('Matter thermostat: 21.5 °C')
    const fan = createProfileFixture('fan')
    fan.node.handleSendMatter({ nodeId: '77', endpointId: 3, clusterId: CLUSTER.FAN_CONTROL, attributeName: 'percentCurrent', value: 37 })
    expect(fan.statuses.at(-1).text).to.equal('Matter fan: 37%')
  })

  it('exposes only Switch-cluster events through the switch profile', () => {
    const { node, outputs, statuses } = createProfileFixture('switch')
    node.handleMatterClusterEvent({ nodeId: '77', endpointId: 3, clusterId: 6, eventName: 'foreign', events: {} })
    node.handleMatterClusterEvent({ nodeId: '77', endpointId: 3, clusterId: 59, eventName: 'initialPress', events: { newPosition: 1 } })
    expect(outputs).to.have.length(1)
    expect(outputs[0]).to.include({ topic: '59.initialPress' })
    expect(statuses.at(-1).text).to.equal('Matter switch: initialPress')
  })
})

describe('Matter controller rename after commissioning', () => {
  it('waits for the root BasicInformation cluster to become available', async () => {
    const { classMatter } = await import('../nodes/utils/matterEngine.mjs')
    const manager = new classMatter('', 'rename-test', 'test', null, { startQueue: false })
    const labels = []
    const basicInformation = { id: 40 }
    const clusterClient = { attributes: { nodeLabel: { set: async (value) => labels.push(value) } } }
    let attempts = 0
    manager._api = { BasicInformation: basicInformation }
    manager.pairedNodes.set('123', {
      getRootClusterClient: () => (++attempts >= 2 ? clusterClient : undefined),
      getRootEndpoint: () => undefined,
      getDevices: () => []
    })

    const result = await manager.renameNode('123', 'Shelly Plug')

    expect(result).to.equal('Shelly Plug')
    expect(labels).to.deep.equal(['Shelly Plug'])
    expect(attempts).to.be.at.least(2)
  })
})

describe('Matter controller attribute lookup', () => {
  it('resolves attribute identifier zero as well as its name', async () => {
    const { classMatter } = await import('../nodes/utils/matterEngine.mjs')
    const manager = new classMatter('', 'attribute-read-test', 'test', null, { startQueue: false })
    const onOff = { id: 0, get: async (remote) => remote ? 'remote' : 'cached', getLocal: () => true }
    manager.pairedNodes.set('55', {})
    manager._findClusterClient = () => ({ name: 'OnOff', attributes: { onOff } })
    expect(await manager.readAttribute('55', 2, 6, 0, true)).to.equal('remote')
    expect(manager.getCachedAttribute('55', 2, 6, 0)).to.equal(true)
    expect(await manager.readAttribute('55', 2, 6, 'onOff')).to.equal('cached')
  })
})
