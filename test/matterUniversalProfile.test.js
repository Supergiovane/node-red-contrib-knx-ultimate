const { expect } = require('chai')
const { EventEmitter } = require('events')
const { UNIVERSAL_NODE_ID, setupUniversalProfile } = require('../nodes/utils/matterControllerProfiles/universal')

describe('Matter controller Universal profile', () => {
  const createFixture = ({ service = 'allEvents', batteryThreshold = 20, details = [], structures = {}, lowBatteryGA = '', lowBatteryTextGA = '' } = {}) => {
    const outputs = []
    const writes = []
    const reads = []
    const errors = []
    const clients = []
    const removed = []
    const statuses = []
    const knxTelegrams = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'universal-node',
      matterNodeId: UNIVERSAL_NODE_ID,
      matterEndpointId: 0,
      matterDeviceName: 'Universal Mode',
      status: (status) => statuses.push(status),
      send: (msg) => outputs.push(msg),
      error: (error) => errors.push(error),
      serverKNX: {
        addClient: () => {},
        removeClient: () => {},
        sendKNXTelegramToKNXEngine: (telegram) => knxTelegrams.push(telegram)
      },
      serverMatter: {
        addClient: (client) => clients.push(client),
        removeClient: (client) => removed.push(client),
        getCommissionedNodesDetails: () => details,
        getNodeStructure: (nodeId) => structures[nodeId],
        matterManager: {
          writeMatterQueueAdd: async (item) => writes.push(item),
          readAttribute: async (...args) => { reads.push(args); return 150 }
        }
      }
    })
    const RED = { log: { error: (message) => errors.push(message) } }
    setupUniversalProfile(RED, node, {
      name: 'Universal',
      universalService: service,
      universalBatteryThreshold: batteryThreshold,
      universalLowBatteryGA: lowBatteryGA,
      universalLowBatteryTextGA: lowBatteryTextGA
    })
    return { node, outputs, writes, reads, errors, clients, removed, statuses, knxTelegrams }
  }

  const input = (node, msg) => new Promise((resolve, reject) => {
    node.emit('input', msg, undefined, (error) => error ? reject(error) : resolve())
  })

  it('forwards attribute reports from every Matter node with complete metadata', () => {
    const { node, outputs } = createFixture()
    ;['100', '200', '300'].forEach((nodeId) => node.handleSendMatter({
      nodeId,
      endpointId: 2,
      clusterId: 47,
      clusterName: 'PowerSource',
      attributeId: 12,
      attributeName: 'batPercentRemaining',
      value: 150
    }))
    expect(outputs.map((msg) => msg.matter.nodeId)).to.deep.equal(['100', '200', '300'])
    expect(outputs[0]).to.include({
      topic: 'matter/100/2/47/batPercentRemaining',
      payload: 150
    })
    expect(outputs[0].matter).to.include({
      source: 'attributeReport',
      endpointId: 2,
      clusterId: 47,
      attributeName: 'batPercentRemaining',
      value: 150
    })
  })

  it('emits normalized complete low battery states and suppresses identical duplicates', () => {
    const { node, outputs } = createFixture({ service: 'batteryMonitor', batteryThreshold: 20 })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'featureMap', value: 2 })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'batPercentRemaining', value: 80 })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'batPercentRemaining', value: 30 })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'batPercentRemaining', value: 30 })
    node.handleSendMatter({ nodeId: '200', endpointId: 1, clusterId: 6, attributeName: 'onOff', value: false })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'batPercentRemaining', value: 60 })
    node.handleSendMatter({ nodeId: '100', endpointId: 2, clusterId: 47, attributeName: 'batPercentRemaining', value: 30 })
    expect(outputs).to.have.length(2)
    expect(outputs[0]).to.include({
      topic: 'matter/battery/100/2'
    })
    expect(outputs[0].payload).to.deep.include({
      nodeId: '100',
      endpointId: 2
    })
    expect(outputs[0].payload.battery).to.include({ percent: 15, rawPercentRemaining: 30, lowBattery: true, threshold: 20 })
    expect(outputs[0].matter).to.include({ source: 'batteryReport', clusterId: 47 })
  })

  it('ignores wired PowerSource endpoints that expose misleading battery defaults', async () => {
    const details = [{ nodeId: '2', name: 'Hue Bridge' }]
    const structures = {
      2: {
        endpoints: [{
          endpointId: 25,
          clusters: [{
            id: 47,
            name: 'PowerSource',
            attributes: [
              { id: 65532, name: 'featureMap', value: 1 },
              { id: 14, name: 'batChargeLevel', value: 2 },
              { id: 15, name: 'batReplacementNeeded', value: true }
            ]
          }]
        }]
      }
    }
    const { node, outputs } = createFixture({ service: 'batteryMonitor', details, structures })
    await new Promise((resolve) => setImmediate(resolve))
    expect(outputs).to.be.empty
    await input(node, { action: 'getAllBatteries' })
    expect(outputs[0].payload).to.deep.equal([])
  })

  it('shows the battery monitor state instead of unknown device states', () => {
    const { node, statuses } = createFixture({ service: 'batteryMonitor' })
    node.setNodeStatusMatter({ fill: 'yellow', shape: 'ring', text: 'unknown (0)' })
    expect(statuses.at(-1)).to.deep.equal({ fill: 'green', shape: 'dot', text: 'Batteries: 0' })
    node.setNodeStatusMatter({ fill: 'red', shape: 'ring', text: 'Matter Disconnected' })
    expect(statuses.at(-1)).to.deep.equal({ fill: 'red', shape: 'ring', text: 'Matter Disconnected' })
  })

  it('publishes the KNX alarm and cycles low-battery device names', async () => {
    const { node, knxTelegrams } = createFixture({
      service: 'batteryMonitor',
      lowBatteryGA: '1/1/1',
      lowBatteryTextGA: '1/1/2'
    })
    node.handleSendMatter({ nodeId: '10', endpointId: 1, clusterId: 47, attributeName: 'featureMap', value: 2 })
    node.handleSendMatter({ nodeId: '10', endpointId: 1, clusterId: 47, attributeName: 'batPercentRemaining', value: 20 })
    expect(knxTelegrams).to.deep.include({ grpaddr: '1/1/1', payload: true, dpt: '1.005', outputtype: 'write', nodecallerid: 'universal-node' })
    expect(knxTelegrams.some((telegram) => telegram.grpaddr === '1/1/2' && telegram.dpt === '16.001')).to.equal(true)
    node.handleSend({ knx: { event: 'GroupValue_Read', destination: '1/1/1' } })
    expect(knxTelegrams.at(-1)).to.include({ grpaddr: '1/1/1', payload: true, outputtype: 'response' })
    await new Promise((resolve) => node.emit('close', resolve))
  })

  it('forwards cluster events and node initialization', () => {
    const { node, outputs } = createFixture()
    node.handleMatterClusterEvent({
      nodeId: '200',
      endpointId: 1,
      clusterId: 59,
      eventId: 1,
      eventName: 'initialPress',
      events: { newPosition: 1 }
    })
    node.handleMatterNodeInitialized('300')
    expect(outputs[0]).to.include({
      topic: 'matter/200/1/59/event/initialPress'
    })
    expect(outputs[0].payload).to.deep.equal({ newPosition: 1 })
    expect(outputs[0].matter.source).to.equal('clusterEvent')
    expect(outputs[1]).to.include({ topic: 'matter/300/initialized', payload: true })
  })

  it('builds an initial battery snapshot and returns the cached inventory', async () => {
    const details = [{ nodeId: '300', name: 'Window sensor' }]
    const structures = {
      300: {
        endpoints: [{
          endpointId: 4,
          clusters: [{
            id: 47,
            name: 'PowerSource',
            attributes: [
              { id: 65532, name: 'featureMap', value: 2 },
              { id: 12, name: 'batPercentRemaining', value: 36 },
              { id: 14, name: 'batChargeLevel', value: 1 },
              { id: 16, name: 'batReplacementNeeded', value: false }
            ]
          }]
        }]
      }
    }
    const { node, outputs } = createFixture({ service: 'batteryMonitor', details, structures })
    await new Promise((resolve) => setImmediate(resolve))
    expect(outputs[0].payload).to.deep.include({ nodeId: '300', deviceName: 'Window sensor', endpointId: 4 })
    expect(outputs[0].payload.battery).to.include({ percent: 18, chargeLevel: 'warning', replacementNeeded: false, lowBattery: true })
    await input(node, { payload: { action: 'getAllBatteries' } })
    expect(outputs[1].matter.source).to.equal('getAllBatteries')
    expect(outputs[1].payload).to.have.length(1)
    expect(outputs[1].payload[0].battery.percent).to.equal(18)
  })

  it('queues dynamic commands and attribute writes', async () => {
    const { node, writes } = createFixture()
    await input(node, { nodeId: '100', endpointId: 1, clusterId: 6, command: 'on', args: {} })
    await input(node, { matter: { nodeId: '200', endpointId: 3, clusterId: 513, attribute: 'occupiedHeatingSetpoint', value: 2100 } })
    expect(writes).to.deep.equal([
      { nodeId: '100', endpointId: 1, clusterId: 6, kind: 'command', name: 'on', args: {} },
      { nodeId: '200', endpointId: 3, clusterId: 513, kind: 'attributeWrite', name: 'occupiedHeatingSetpoint', args: 2100 }
    ])
  })

  it('reads a dynamic attribute and preserves the input message', async () => {
    const { node, outputs, reads } = createFixture()
    await input(node, {
      requestId: 'abc',
      nodeId: '100',
      endpointId: 2,
      clusterId: 47,
      attribute: 'batPercentRemaining',
      requestFromRemote: true
    })
    expect(reads[0]).to.deep.equal(['100', 2, 47, 'batPercentRemaining', true])
    expect(outputs[0]).to.include({ requestId: 'abc', payload: 150 })
    expect(outputs[0].matter).to.include({
      source: 'inputRead',
      nodeId: '100',
      endpointId: 2,
      clusterId: 47,
      attribute: 'batPercentRemaining'
    })
  })

  it('rejects invalid input without calling the manager', async () => {
    const { node, writes, reads } = createFixture()
    let error
    try {
      await input(node, { nodeId: '100', endpointId: 1, clusterId: 6 })
    } catch (caught) {
      error = caught
    }
    expect(error.message).to.equal('Matter input requires command or attribute')
    expect(writes).to.have.length(0)
    expect(reads).to.have.length(0)
  })

  it('registers once after removal and unregisters on close', (done) => {
    const { node, clients, removed } = createFixture()
    expect(clients).to.deep.equal([node])
    expect(removed).to.deep.equal([node])
    node.emit('close', () => {
      expect(removed).to.deep.equal([node, node])
      done()
    })
  })
})
