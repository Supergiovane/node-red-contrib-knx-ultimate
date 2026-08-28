const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const registerIoTBridgeRuntime = require('../nodes/knxUltimateIoTBridge')

const projectRoot = path.resolve(__dirname, '..')
const activeNodes = []

function loadIoTBridgeEditor () {
  const source = fs.readFileSync(path.join(projectRoot, 'nodes', 'knxUltimateIoTBridge.html'), 'utf8')
  const inlineScript = Array.from(source.matchAll(/<script type="text\/javascript"(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))
    .map(match => match[1])
    .find(script => script.includes("RED.nodes.registerType('knxUltimateIoTBridge'"))
  let definition
  const sandbox = {
    RED: {
      nodes: {
        registerType: (_type, value) => { definition = value }
      }
    },
    setTimeout: () => 0,
    clearTimeout: () => {}
  }
  vm.runInNewContext(inlineScript, sandbox)
  return { definition, sandbox, source }
}

function createBridge (mappings, config = {}) {
  let BridgeConstructor
  const sent = []
  const knxTelegrams = []
  const statuses = []
  const errors = []
  const clients = []

  const server = {
    id: 'gateway-1',
    loglevel: 'silent',
    linkStatus: 'connected',
    csv: [],
    addClient: client => clients.push(client),
    removeClient: client => {
      const index = clients.indexOf(client)
      if (index !== -1) clients.splice(index, 1)
    },
    applyStatusUpdate: (_node, status) => statuses.push(status),
    sendKNXTelegramToKNXEngine: telegram => knxTelegrams.push(telegram)
  }

  const RED = {
    nodes: {
      createNode: node => {
        const emitter = new EventEmitter()
        node.id = 'iot-bridge-1'
        node.type = 'knxUltimateIoTBridge'
        node.on = emitter.on.bind(emitter)
        node.once = emitter.once.bind(emitter)
        node.emit = emitter.emit.bind(emitter)
        node.removeListener = emitter.removeListener.bind(emitter)
        node.send = message => sent.push(message)
        node.status = status => statuses.push(status)
        node.error = (error, message) => errors.push({ error, message })
        node.warn = message => errors.push({ error: message })
      },
      getNode: id => id === 'gateway-1' ? server : undefined,
      registerType: (type, constructor) => {
        expect(type).to.equal('knxUltimateIoTBridge')
        BridgeConstructor = constructor
      }
    },
    util: {
      generateId: () => 'generated-mapping-id',
      cloneMessage: message => ({ ...message })
    },
    log: {
      error: error => errors.push({ error })
    }
  }

  registerIoTBridgeRuntime(RED)
  const node = new BridgeConstructor({
    server: 'gateway-1',
    name: 'IoT bridge test',
    nodeMode: 'iot',
    outputtopic: '',
    emitOnChangeOnly: false,
    readOnDeploy: false,
    acceptFlowInput: true,
    mappings,
    ...config
  })
  activeNodes.push(node)

  return { node, sent, knxTelegrams, statuses, errors, server, clients }
}

function legacyModbusMapping (overrides = {}) {
  return {
    id: 'legacy-map',
    label: 'Legacy register',
    ga: '1/1/1',
    dpt: '5.001',
    direction: 'bidirectional',
    iotType: 'modbus',
    target: '40010',
    method: 'POST',
    modbusFunction: 'writeHoldingRegister',
    scale: 2,
    offset: 1,
    template: '',
    property: '',
    enabled: true,
    timeout: 0,
    retry: 0,
    ...overrides
  }
}

function flexModbusMapping (overrides = {}) {
  return {
    id: 'flex-map',
    label: 'Flex register',
    ga: '2/1/1',
    dpt: '5.001',
    direction: 'bidirectional',
    iotType: 'modbus',
    target: '',
    method: 'POST',
    modbusFunction: 'writeHoldingRegister',
    modbusMessageFormat: 'flex',
    modbusUnitId: 1,
    modbusAddress: 10,
    modbusArea: 'holding-register',
    modbusDataType: 'uint16',
    scale: 1,
    offset: 0,
    template: '',
    property: '',
    enabled: true,
    timeout: 0,
    retry: 0,
    ...overrides
  }
}

function knxMessage (mapping, payload, event = 'GroupValue_Write', echoed = false) {
  return {
    topic: mapping.ga,
    payload,
    echoed,
    knx: {
      destination: mapping.ga,
      source: '1.1.20',
      event,
      echoed
    }
  }
}

function outputAt (sent, index) {
  return sent
    .map(message => Array.isArray(message) ? message[index] : (index === 0 ? message : null))
    .filter(message => message !== null && message !== undefined)
}

function deliverInput (node, msg, sent) {
  let doneCalled = 0
  let doneError
  node.emit('input', msg, message => sent.push(message), error => {
    doneCalled += 1
    doneError = error
  })
  return { doneCalled, doneError }
}

describe('KNX Ultimate IoT Bridge Modbus contracts', () => {
  afterEach(() => {
    while (activeNodes.length > 0) {
      const node = activeNodes.pop()
      node.emit('close', () => {})
    }
  })

  it('preserves the legacy scalar Modbus output and input contracts when format is absent', () => {
    const mapping = legacyModbusMapping()
    const { node, sent, knxTelegrams } = createBridge([mapping])

    node.handleSend(knxMessage(mapping, 10))

    const outbound = outputAt(sent, 0)
    expect(outbound).to.have.length(1)
    expect(outbound[0]).to.deep.include({
      topic: '40010',
      payload: 21,
      address: '40010',
      modbusFunction: 'writeHoldingRegister'
    })
    expect(outbound[0].bridge).to.deep.include({
      id: 'legacy-map',
      type: 'modbus',
      direction: 'knx-to-iot',
      target: '40010',
      scale: 2,
      offset: 1
    })

    deliverInput(node, {
      topic: '40010',
      iotType: 'modbus',
      payload: 21
    }, sent)

    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: '1/1/1',
      payload: 10,
      dpt: '5.001',
      outputtype: 'write'
    })
  })

  it('emits the direct Flex FC5 contract for a DPT 1 coil command', () => {
    const mapping = flexModbusMapping({
      ga: '2/1/2',
      dpt: '1.001',
      modbusArea: 'coil',
      modbusDataType: 'bool',
      modbusUnitId: 7,
      modbusAddress: 0
    })
    const { node, sent } = createBridge([mapping])

    node.handleSend(knxMessage(mapping, true))

    const outbound = outputAt(sent, 0)
    expect(outbound).to.have.length(1)
    expect(outbound[0].payload).to.deep.equal({
      value: true,
      fc: 5,
      unitid: 7,
      address: 0,
      quantity: 1
    })
    expect(outbound[0].topic).to.match(/^knxultimate\/modbus\/iot-bridge-1\/flex-map\/write/)
    expect(outbound[0].bridge.modbus).to.deep.include({
      contract: 'flex-v1',
      operation: 'write',
      fc: 5,
      area: 'coil',
      dataType: 'bool'
    })
  })

  it('encodes holding-register uint16 and int16 commands as FC6 words', () => {
    const unsigned = flexModbusMapping({
      id: 'unsigned',
      ga: '2/2/1',
      modbusAddress: 20,
      modbusDataType: 'uint16'
    })
    const signed = flexModbusMapping({
      id: 'signed',
      ga: '2/2/2',
      modbusAddress: 21,
      modbusDataType: 'int16'
    })
    const { node, sent } = createBridge([unsigned, signed])

    node.handleSend(knxMessage(unsigned, 65535))
    node.handleSend(knxMessage(signed, -2))

    const outbound = outputAt(sent, 0)
    expect(outbound).to.have.length(2)
    expect(outbound[0].payload).to.deep.equal({
      value: 65535,
      fc: 6,
      unitid: 1,
      address: 20,
      quantity: 1
    })
    expect(outbound[1].payload).to.deep.equal({
      value: 65534,
      fc: 6,
      unitid: 1,
      address: 21,
      quantity: 1
    })
  })

  it('never turns GroupValue_Response or GroupValue_Read into a Flex write', () => {
    const mapping = flexModbusMapping()
    const { node, sent } = createBridge([mapping])

    node.handleSend(knxMessage(mapping, 42, 'GroupValue_Response'))
    node.handleSend(knxMessage(mapping, null, 'GroupValue_Read'))

    expect(outputAt(sent, 0)).to.deep.equal([])
  })

  it('maps a Flex Getter block offset to KNX and reverses scale and offset', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/1/1',
      dpt: '9.001',
      modbusUnitId: 4,
      modbusAddress: 101,
      scale: 10,
      offset: 5
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    const result = deliverInput(node, {
      topic: 'external/modbus/read',
      payload: [999, 215, 300],
      modbusRequest: {
        fc: 3,
        unitid: 4,
        address: 100,
        quantity: 3
      }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.oneOf([undefined, null])
    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: '3/1/1',
      payload: 21,
      dpt: '9.001',
      outputtype: 'write'
    })
    expect(outputAt(sent, 1)).to.have.length(1)
    expect(outputAt(sent, 1)[0].payload).to.equal(21)
  })

  it('decodes a signed holding register from a Flex Getter response', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/1/2',
      modbusAddress: 40,
      modbusDataType: 'int16'
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    deliverInput(node, {
      payload: [65534],
      modbusRequest: { fc: 3, unitid: 1, address: 40, quantity: 1 }
    }, sent)

    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0].payload).to.equal(-2)
  })

  it('accepts the raw second output shape from Modbus Flex Getter', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/1/3',
      dpt: '9.001',
      modbusAddress: 42,
      scale: 10
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    deliverInput(node, {
      payload: { data: [200, 225], buffer: Buffer.from([0, 200, 0, 225]) },
      values: [200, 225],
      modbusRequest: { fc: 3, unitid: 1, address: 41, quantity: 2 }
    }, sent)

    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: '3/1/3',
      payload: 22.5,
      dpt: '9.001',
      outputtype: 'write'
    })
  })

  it('accepts request metadata in msg.input.payload from modbus-read', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/1/6',
      modbusAddress: 71
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    const result = deliverInput(node, {
      payload: [100, 321],
      input: {
        payload: { fc: 3, unitid: 1, address: 70, quantity: 2 }
      }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.oneOf([undefined, null])
    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: '3/1/6',
      payload: 321,
      dpt: '5.001',
      outputtype: 'write'
    })
  })

  it('forces discrete inputs and input registers to remain read-only', () => {
    const discrete = flexModbusMapping({
      id: 'discrete',
      ga: '3/1/4',
      dpt: '1.001',
      direction: 'bidirectional',
      modbusArea: 'discrete-input',
      modbusDataType: 'bool',
      modbusAddress: 43
    })
    const inputRegister = flexModbusMapping({
      id: 'input-register',
      ga: '3/1/5',
      direction: 'bidirectional',
      modbusArea: 'input-register',
      modbusDataType: 'uint16',
      modbusAddress: 44
    })
    const { node, sent, knxTelegrams } = createBridge([discrete, inputRegister])

    node.handleSend(knxMessage(discrete, true))
    node.handleSend(knxMessage(inputRegister, 123))
    expect(outputAt(sent, 0)).to.deep.equal([])

    deliverInput(node, {
      payload: [true],
      modbusRequest: { fc: 2, unitid: 1, address: 43, quantity: 1 }
    }, sent)
    deliverInput(node, {
      payload: [123],
      modbusRequest: { fc: 4, unitid: 1, address: 44, quantity: 1 }
    }, sent)

    expect(knxTelegrams.map(telegram => telegram.payload)).to.deep.equal([true, 123])
  })

  it('does not treat either Flex Write output shape as Modbus state', () => {
    const coil = flexModbusMapping({
      id: 'coil',
      ga: '3/2/1',
      dpt: '1.001',
      modbusArea: 'coil',
      modbusDataType: 'bool',
      modbusAddress: 7
    })
    const holding = flexModbusMapping({
      id: 'holding',
      ga: '3/2/2',
      modbusAddress: 8
    })
    const { node, sent, knxTelegrams } = createBridge([coil, holding])

    const firstAck = deliverInput(node, {
      topic: 'knxultimate/modbus/iot-bridge-1/coil/write',
      payload: { value: true, fc: 5, unitid: 1, address: 7, quantity: 1 },
      responseBuffer: { address: 7, value: true }
    }, sent)
    const secondAck = deliverInput(node, {
      topic: 'knxultimate/modbus/iot-bridge-1/holding/write',
      payload: { address: 8, value: 123 },
      values: { value: 123, fc: 6, unitid: 1, address: 8, quantity: 1 },
      input: { payload: { value: 123, fc: 6, unitid: 1, address: 8, quantity: 1 } },
      bridge: {
        id: 'holding',
        type: 'modbus',
        modbus: { contract: 'flex-v1', operation: 'write', fc: 6, unitid: 1, address: 8, quantity: 1 }
      }
    }, sent)

    expect(firstAck.doneCalled).to.equal(1)
    expect(secondAck.doneCalled).to.equal(1)
    expect(knxTelegrams).to.deep.equal([])
  })

  it('handles a Flex Getter error from bridge.modbus without generic input fallback', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/2/3',
      modbusAddress: 9
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    const result = deliverInput(node, {
      topic: mapping.target,
      payload: [123],
      error: new Error('Modbus gateway timeout'),
      bridge: {
        id: mapping.id,
        type: 'modbus',
        target: mapping.target,
        modbus: {
          contract: 'flex-v1',
          operation: 'read',
          fc: 3,
          unitid: 1,
          address: 9,
          quantity: 1
        }
      }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.an('error').with.property('message', 'Modbus gateway timeout')
    expect(knxTelegrams).to.deep.equal([])
    expect(outputAt(sent, 1)).to.deep.equal([])
  })

  it('deduplicates equal Getter values when emit-on-change is enabled', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      ga: '3/3/1',
      modbusAddress: 50
    })
    const { node, sent, knxTelegrams } = createBridge([mapping], { emitOnChangeOnly: true })
    const response = {
      payload: [123],
      modbusRequest: { fc: 3, unitid: 1, address: 50, quantity: 1 }
    }

    deliverInput(node, { ...response, payload: [...response.payload] }, sent)
    deliverInput(node, { ...response, payload: [...response.payload] }, sent)

    expect(knxTelegrams).to.have.length(1)
  })

  it('suppresses only a matching echoed KNX telegram while its Getter write is pending', () => {
    const mapping = flexModbusMapping({
      ga: '3/3/2',
      modbusAddress: 51
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    deliverInput(node, {
      payload: [45],
      modbusRequest: { fc: 3, unitid: 1, address: 51, quantity: 1 }
    }, sent)
    expect(knxTelegrams).to.have.length(1)

    node.handleSend(knxMessage(mapping, 46, 'GroupValue_Write', true))
    node.handleSend(knxMessage(mapping, 45, 'GroupValue_Write', true))
    node.handleSend(knxMessage(mapping, 45, 'GroupValue_Write', false))
    node.handleSend(knxMessage(mapping, 45, 'GroupValue_Write', true))

    const outbound = outputAt(sent, 0)
    expect(outbound.map(message => message.payload.value)).to.deep.equal([46, 45, 45])
    outbound.forEach(message => {
      expect(message.payload).to.deep.include({
        fc: 6,
        unitid: 1,
        address: 51,
        quantity: 1
      })
    })
  })

  it('falls back to a legacy mapping when incidental transport metadata has no Flex match', () => {
    const legacy = legacyModbusMapping()
    const unrelatedFlex = flexModbusMapping({
      id: 'unrelated-flex',
      direction: 'iot-to-knx',
      modbusAddress: 80
    })
    const { node, sent, knxTelegrams } = createBridge([legacy, unrelatedFlex])

    const result = deliverInput(node, {
      topic: legacy.target,
      iotType: 'modbus',
      payload: 21,
      modbusRequest: { fc: 3, unitid: 7, address: 900, quantity: 1 }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.oneOf([undefined, null])
    expect(knxTelegrams).to.have.length(1)
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: legacy.ga,
      payload: 10,
      dpt: legacy.dpt,
      outputtype: 'write'
    })
  })

  it('never falls back to a legacy mapping for an explicit flex-v1 contract', () => {
    const legacy = legacyModbusMapping()
    const { node, sent, knxTelegrams } = createBridge([legacy])

    const result = deliverInput(node, {
      topic: legacy.target,
      payload: 21,
      bridge: {
        id: legacy.id,
        type: 'modbus',
        target: legacy.target,
        modbus: {
          contract: 'flex-v1',
          operation: 'read',
          fc: 3,
          unitid: 1,
          address: 90,
          quantity: 1
        }
      }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.oneOf([undefined, null])
    expect(knxTelegrams).to.deep.equal([])
    expect(outputAt(sent, 1)).to.deep.equal([])
  })

  it('ignores Getter responses for the wrong Unit ID, area FC or address range', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      modbusUnitId: 2,
      modbusAddress: 60
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    deliverInput(node, {
      payload: [10],
      modbusRequest: { fc: 3, unitid: 3, address: 60, quantity: 1 }
    }, sent)
    deliverInput(node, {
      payload: [10],
      modbusRequest: { fc: 4, unitid: 2, address: 60, quantity: 1 }
    }, sent)
    deliverInput(node, {
      payload: [10],
      modbusRequest: { fc: 3, unitid: 2, address: 61, quantity: 1 }
    }, sent)

    expect(knxTelegrams).to.deep.equal([])
  })

  it('never treats a failed legacy Modbus transport response as KNX data', () => {
    const mapping = legacyModbusMapping()
    const { node, sent, knxTelegrams } = createBridge([mapping])

    const result = deliverInput(node, {
      topic: '40010',
      payload: 21,
      error: new Error('read failed'),
      modbusRequest: { fc: 3, unitid: 1, address: 9, quantity: 1 }
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.an('error').with.property('message', 'read failed')
    expect(knxTelegrams).to.deep.equal([])
  })

  it('validates Flex address, Unit ID and scale instead of falling back to a dangerous write', () => {
    const invalidOverrides = [
      { modbusAddress: '' },
      { modbusAddress: -1 },
      { modbusAddress: 65536 },
      { modbusAddress: 1.5 },
      { modbusAddress: 'register-ten' },
      { modbusUnitId: -1 },
      { modbusUnitId: 256 },
      { modbusUnitId: 1.5 },
      { modbusUnitId: 'device-one' },
      { scale: 0 },
      { scale: 'not-a-number' }
    ]

    invalidOverrides.forEach((overrides, index) => {
      const mapping = flexModbusMapping({
        id: `invalid-${index}`,
        ga: `4/1/${index + 1}`,
        target: '',
        ...overrides
      })
      const { node, sent } = createBridge([mapping])
      node.handleSend(knxMessage(mapping, 1))
      expect(outputAt(sent, 0), JSON.stringify(overrides)).to.deep.equal([])
    })
  })

  it('validates a scalar flow input for a Flex mapping before writing KNX', () => {
    const mapping = flexModbusMapping({
      direction: 'iot-to-knx',
      target: '',
      modbusAddress: ''
    })
    const { node, sent, knxTelegrams } = createBridge([mapping])

    const result = deliverInput(node, {
      bridge: { id: mapping.id, type: 'modbus' },
      payload: 123
    }, sent)

    expect(result.doneCalled).to.equal(1)
    expect(result.doneError).to.be.an('error')
    expect(knxTelegrams).to.deep.equal([])
  })

  it('accepts zero-based boundary addresses, Unit IDs and the legacy target fallback', () => {
    const first = flexModbusMapping({
      id: 'first',
      ga: '4/2/1',
      modbusUnitId: 0,
      modbusAddress: 0
    })
    const last = flexModbusMapping({
      id: 'last',
      ga: '4/2/2',
      modbusUnitId: 255,
      modbusAddress: 65535
    })
    const fallback = flexModbusMapping({
      id: 'fallback',
      ga: '4/2/3',
      target: '17',
      modbusAddress: ''
    })
    const { node, sent } = createBridge([first, last, fallback])

    node.handleSend(knxMessage(first, 1))
    node.handleSend(knxMessage(last, 2))
    node.handleSend(knxMessage(fallback, 3))

    expect(outputAt(sent, 0).map(message => message.payload)).to.deep.equal([
      { value: 1, fc: 6, unitid: 0, address: 0, quantity: 1 },
      { value: 2, fc: 6, unitid: 255, address: 65535, quantity: 1 },
      { value: 3, fc: 6, unitid: 1, address: 17, quantity: 1 }
    ])
  })
})

describe('KNX Ultimate IoT Bridge Modbus editor and examples', () => {
  const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']

  it('declares the Flex mapping fields in the editor', () => {
    const editor = fs.readFileSync(path.join(projectRoot, 'nodes', 'knxUltimateIoTBridge.html'), 'utf8')
    ;[
      'modbusMessageFormat',
      'modbusUnitId',
      'modbusAddress',
      'modbusArea',
      'modbusDataType'
    ].forEach(field => expect(editor, field).to.include(field))
  })

  it('validates Flex rows in the editor and blocks Done while a live row is invalid', () => {
    const { definition, sandbox, source } = loadIoTBridgeEditor()
    const validate = definition.defaults.mappings.validate
    const valid = flexModbusMapping({ modbusUnitId: 0, modbusAddress: 0 })

    expect(validate.call({ nodeMode: 'iot' }, [valid])).to.equal(true)
    expect(validate.call({ nodeMode: 'iot' }, [{ ...valid, scale: 0 }])).to.equal(false)
    expect(validate.call({ nodeMode: 'iot' }, [{ ...valid, modbusAddress: 65536 }])).to.equal(false)
    expect(validate.call({ nodeMode: 'homeassistant' }, [{ ...valid, scale: 0 }])).to.equal(true)
    expect(source).to.include("$('#node-dialog-ok').prop('disabled', !valid)")
    expect(source).to.include("row.data('validate-flex', validateFlexInputs)")

    const savedField = sandbox.knxUltimateIoTBridgeSavedFlexField
    expect(savedField({ modbusAddress: 0 }, 'modbusAddress', true, 99)).to.deep.equal({ present: true, value: 0 })
    expect(savedField({}, 'modbusAddress', true, 99)).to.deep.equal({ present: false })
    expect(savedField({ modbusAddress: 0 }, 'modbusAddress', false, 99)).to.deep.equal({ present: true, value: 99 })
  })

  it('ships every Modbus editor label in all supported locales', () => {
    const fieldKeys = ['modbusMessageFormat', 'modbusUnitId', 'modbusArea', 'modbusDataType']
    const modbusKeys = [
      'formatLegacy',
      'formatFlex',
      'areaCoil',
      'areaDiscreteInput',
      'areaHoldingRegister',
      'areaInputRegister',
      'dataTypeBool',
      'dataTypeUint16',
      'dataTypeInt16',
      'zeroBasedHint',
      'flexHint',
      'readOnlyHint'
    ]

    locales.forEach(locale => {
      const localePath = path.join(projectRoot, 'nodes', 'locales', locale, 'knxUltimateIoTBridge.json')
      const messages = JSON.parse(fs.readFileSync(localePath, 'utf8')).knxUltimateIoTBridge
      expect(messages.fields, `${locale} fields`).to.include.all.keys(fieldKeys)
      expect(messages.modbus, `${locale} Modbus labels`).to.include.all.keys(modbusKeys)
    })
  })

  it('documents Flex Getter and Flex Write in every help and wiki language', () => {
    locales.forEach(locale => {
      const help = fs.readFileSync(path.join(projectRoot, 'nodes', 'locales', locale, 'knxUltimateIoTBridge.html'), 'utf8')
      expect(help, `${locale} help Flex Getter`).to.include('modbus-flex-getter')
      expect(help, `${locale} help Flex Write`).to.include('modbus-flex-write')
    })

    const wikiFiles = [
      'IoT-Bridge-Configuration.md',
      'it-IoT-Bridge-Configuration.md',
      'de-IoT-Bridge-Configuration.md',
      'fr-IoT-Bridge-Configuration.md',
      'es-IoT-Bridge-Configuration.md',
      'zh-CN-IoT-Bridge-Configuration.md'
    ]
    wikiFiles.forEach(file => {
      const wiki = fs.readFileSync(path.join(projectRoot, 'docs', 'wiki', file), 'utf8')
      expect(wiki, `${file} Flex Getter`).to.include('modbus-flex-getter')
      expect(wiki, `${file} Flex Write`).to.include('modbus-flex-write')
    })
  })

  it('provides an importable Flex example with preserved response metadata', () => {
    const examplePath = path.join(projectRoot, 'examples', 'IoT Bridge - Modbus Flex Adapter.json')
    expect(fs.existsSync(examplePath)).to.equal(true)
    const flow = JSON.parse(fs.readFileSync(examplePath, 'utf8'))
    const bridge = flow.find(node => node.type === 'knxUltimateIoTBridge')
    const getter = flow.find(node => node.type === 'modbus-flex-getter')
    const writer = flow.find(node => node.type === 'modbus-flex-write')

    expect(bridge).to.be.an('object')
    expect(bridge.mappings).to.be.an('array').that.is.not.empty
    expect(bridge.mappings.some(mapping => mapping.iotType === 'modbus' && mapping.modbusMessageFormat === 'flex')).to.equal(true)
    expect(getter).to.be.an('object')
    expect(writer).to.be.an('object')
    expect([true, 'true']).to.include(getter.keepMsgProperties)
    expect([true, 'true']).to.include(writer.keepMsgProperties)

    flow.filter(node => node.type === 'inject').forEach(inject => {
      expect([false, 'false', undefined], `${inject.name || inject.id} once`).to.include(inject.once)
      expect(['', undefined], `${inject.name || inject.id} repeat`).to.include(inject.repeat)
    })
  })
})
