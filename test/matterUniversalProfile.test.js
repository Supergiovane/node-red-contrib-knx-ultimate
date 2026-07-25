const { expect } = require('chai')
const { EventEmitter } = require('events')
const { UNIVERSAL_NODE_ID, setupUniversalProfile } = require('../nodes/utils/matterControllerProfiles/universal')

describe('Matter controller Universal profile', () => {
  const createFixture = () => {
    const outputs = []
    const writes = []
    const reads = []
    const errors = []
    const clients = []
    const removed = []
    const node = new EventEmitter()
    Object.assign(node, {
      id: 'universal-node',
      matterNodeId: UNIVERSAL_NODE_ID,
      matterEndpointId: 0,
      matterDeviceName: 'Universal Mode',
      status: () => {},
      send: (msg) => outputs.push(msg),
      error: (error) => errors.push(error),
      serverMatter: {
        addClient: (client) => clients.push(client),
        removeClient: (client) => removed.push(client),
        matterManager: {
          writeMatterQueueAdd: async (item) => writes.push(item),
          readAttribute: async (...args) => { reads.push(args); return 150 }
        }
      }
    })
    const RED = { log: { error: (message) => errors.push(message) } }
    setupUniversalProfile(RED, node, { name: 'Universal' })
    return { node, outputs, writes, reads, errors, clients, removed }
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
