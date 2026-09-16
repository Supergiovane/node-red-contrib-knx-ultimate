const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')

const {
  buildKnxAiCerebrumPromptContext,
  buildKnxAiHomeAssistantStateContext,
  getKnxAiHomeAutomationRegistry,
  inspectKnxAiCerebrumFlow,
  normalizeKnxAiFlowSendEvent,
  normalizeKnxAiHomeAutomationEvent
} = require('../nodes/utils/knxAiCerebrum')
const { buildKnxAiSetupDoctorSnapshot, summarizeKnxAiFlowWiring } = require('../nodes/knxUltimateAI').__test

describe('Cerebrum Ultimate Cerebrum discovery and Home Assistant bridge', () => {
  it('keeps legacy runtime types registered while hiding their palette entries', () => {
    const aiEditor = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.html'), 'utf8')
    const bridgeEditor = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAIHomeAssistant.html'), 'utf8')
    const aiRuntime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    const bridgeRuntime = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAIHomeAssistant.js'), 'utf8')

    expect(aiEditor).to.include("RED.nodes.registerType('knxUltimateAI'")
    expect(aiEditor).to.include("RED.palette.remove('knxUltimateAI')")
    expect(bridgeEditor).to.include("RED.nodes.registerType('knxUltimateAIHomeAssistant'")
    expect(bridgeEditor).to.include("RED.palette.remove('knxUltimateAIHomeAssistant')")
    expect(aiRuntime).to.include("RED.nodes.registerType('knxUltimateAI'")
    expect(bridgeRuntime).to.include("RED.nodes.registerType('knxUltimateAIHomeAssistant'")
  })

  it('discovers flow logic, HUE, Matter and a complete ha-api round trip', () => {
    const flowNodes = [
      { id: 'ha-server', type: 'server', addon: true },
      { id: 'bridge', type: 'knxUltimateAIHomeAssistant', wires: [['ha-api']] },
      { id: 'ha-api', type: 'ha-api', wires: [['bridge']] },
      { id: 'ha-events', type: 'server-state-changed', wires: [['bridge']] },
      { id: 'logic', type: 'function', func: 'return msg', wires: [] },
      { id: 'hue', type: 'knxUltimateHueController', wires: [] },
      { id: 'matter', type: 'knxUltimateMatterControllerDevice', wires: [] }
    ]
    const snapshot = inspectKnxAiCerebrumFlow({ flowNodes, env: {} })

    expect(snapshot.logicNodeCount).to.equal(1)
    expect(snapshot.hue.nodeCount).to.equal(1)
    expect(snapshot.matter.nodeCount).to.equal(1)
    expect(snapshot.homeAssistant).to.include({
      addonDetected: true,
      apiNodePresent: true,
      bridgeNodePresent: true,
      roundTripWired: true,
      ready: true,
      recommendationCode: 'ready'
    })
    expect(snapshot.tools.map(tool => tool.id)).to.include.members([
      'hue.flow-events',
      'matter.flow-events',
      'node-red.flow-logic',
      'home-assistant.api',
      'home-assistant.events'
    ])
    expect(buildKnxAiCerebrumPromptContext(snapshot)).to.include('CEREBRUM FLOW DISCOVERY')
  })

  it('asks Setup Doctor for ha-api when the Home Assistant add-on is detected', () => {
    const snapshot = inspectKnxAiCerebrumFlow({ flowNodes: [], env: { SUPERVISOR_TOKEN: 'present' } })
    expect(snapshot.homeAssistant).to.include({
      addonDetected: true,
      apiNodePresent: false,
      ready: false,
      recommendationCode: 'add_ha_api'
    })
    const doctor = buildKnxAiSetupDoctorSnapshot({
      language: 'it',
      gateway: { configured: true, connectionState: 'connected' },
      llm: { enabled: true, provider: 'ollama', baseUrl: 'http://localhost/api/chat', model: 'local' },
      catalog: [{ ga: '1/1/1', dpt: '1.001', label: 'Luce', semantic: { kind: 'light' } }],
      wiring: summarizeKnxAiFlowWiring({ wires: [[], [], [], [], []] }),
      integrations: { cerebrum: snapshot },
      providerProbe: { state: 'reachable', modelCount: 1 }
    })
    const check = doctor.checks.find(item => item.id === 'homeAssistant')
    expect(check).to.include({ status: 'warn', blocking: false })
    expect(check.detail).to.include('ha-api')
  })

  it('normalizes Home Assistant state events without retaining the raw message', () => {
    const event = normalizeKnxAiHomeAutomationEvent({
      payload: {
        event: {
          event_type: 'state_changed',
          time_fired: '2026-09-01T08:30:00+02:00',
          data: {
            entity_id: 'light.kitchen',
            old_state: { state: 'off' },
            new_state: { state: 'on', entity_id: 'light.kitchen', attributes: { friendly_name: 'Kitchen light' } }
          }
        }
      }
    }, { adapterId: 'home-assistant', providerId: 'bridge' })

    expect(event).to.include({
      adapterId: 'home-assistant',
      providerId: 'bridge',
      entityId: 'light.kitchen',
      resourceType: 'light',
      resourceName: 'Kitchen light',
      state: 'on',
      previousState: 'off'
    })
  })

  it('observes useful Node-RED messages without retaining secrets or binary content', () => {
    const event = normalizeKnxAiFlowSendEvent({
      source: { node: { id: 'logic-1', type: 'function', name: 'Evening logic', z: 'tab-1' } },
      destination: { node: { id: 'hue-1', type: 'knxUltimateHueLight' } },
      msg: {
        topic: 'living-room',
        payload: {
          brightness: 42,
          access_token: 'must-not-leak',
          image: Buffer.from('must-not-leak'),
          nested: { active: true }
        }
      }
    }, { at: '2026-09-01T08:30:00.000Z' })

    expect(event).to.include({
      adapterId: 'node-red-flow',
      eventType: 'flow_message',
      resourceId: 'logic-1',
      resourceType: 'function'
    })
    expect(event.details.payload).to.deep.equal({ brightness: 42, nested: { active: true } })
    expect(JSON.stringify(event)).not.to.include('must-not-leak')
  })

  it('registers a passive runtime hook and publishes filtered flow events', () => {
    let pluginDefinition
    let hook
    const RED = {
      plugins: {
        registerPlugin (id, definition) {
          expect(id).to.equal('knxUltimateCerebrumRuntime')
          pluginDefinition = definition
        }
      },
      hooks: {
        add (id, callback) {
          expect(id).to.equal('onSend.knxUltimateCerebrum')
          hook = callback
        },
        remove () {}
      }
    }
    require('../nodes/plugins/knxUltimate-cerebrum-runtime-plugin')(RED)
    pluginDefinition.onadd()
    const provider = getKnxAiHomeAutomationRegistry().providers.get('knx-ultimate:cerebrum-runtime')
    const received = []
    const unsubscribe = provider.subscribe(event => received.push(event))

    hook([{
      source: { node: { id: 'matter-1', type: 'knxUltimateMatterControllerDevice', name: 'Matter light' } },
      msg: { payload: { on: true } }
    }])
    hook([{
      source: { node: { id: 'debug-1', type: 'debug', name: 'Not observed' } },
      msg: { payload: 'ignored' }
    }])

    expect(received).to.have.length(1)
    expect(received[0]).to.include({ adapterId: 'matter', eventType: 'state_changed', resourceId: 'matter-1', state: '{"on":true}' })
    unsubscribe()
    getKnxAiHomeAutomationRegistry().unregisterProvider('knx-ultimate:cerebrum-runtime')
  })

  it('builds a bounded request-relevant read-only Home Assistant state catalog', () => {
    const context = buildKnxAiHomeAssistantStateContext({
      question: 'temperatura cucina',
      states: [
        { entity_id: 'light.kitchen', state: 'off', attributes: { friendly_name: 'Kitchen light' } },
        { entity_id: 'sensor.kitchen_temperature', state: '21.7', last_changed: '2026-09-01T08:00:00Z', attributes: { friendly_name: 'Temperatura cucina', device_class: 'temperature', unit_of_measurement: '°C', access_token: 'must-not-leak' } },
        { entity_id: 'cover.bedroom', state: 'closed', attributes: { friendly_name: 'Bedroom cover' } }
      ],
      maxEntities: 1,
      maxChars: 2000
    })
    expect(context).to.include('HOME ASSISTANT STATE SNAPSHOT')
    expect(context).to.include('sensor.kitchen_temperature')
    expect(context).to.include('state=21.7 °C')
    expect(context).not.to.include('cover.bedroom |')
    expect(context).not.to.include('must-not-leak')
  })

  it('routes dynamic get_states requests through ha-api and correlates the response', async () => {
    let Constructor
    const sent = []
    const RED = {
      nodes: {
        createNode (node) {
          const emitter = new EventEmitter()
          node.id = 'ha-bridge-test'
          node.type = 'knxUltimateAIHomeAssistant'
          node.on = emitter.on.bind(emitter)
          node.emit = emitter.emit.bind(emitter)
          node.send = message => sent.push(message)
          node.status = () => {}
          node.error = () => {}
        },
        registerType (type, ctor) {
          if (type === 'knxUltimateAIHomeAssistant') Constructor = ctor
        }
      }
    }
    require('../nodes/knxUltimateAIHomeAssistant')(RED)
    const bridge = new Constructor({ requestTimeoutMs: 3000 })
    const registry = getKnxAiHomeAutomationRegistry()
    const provider = registry.providers.get('ha-bridge-test')
    const pending = provider.listEntities()

    expect(sent).to.have.length(1)
    expect(sent[0].payload).to.deep.include({ protocol: 'websocket', location: 'payload', locationType: 'msg' })
    expect(sent[0].payload.data).to.deep.equal({ type: 'get_states' })
    bridge.emit('input', {
      payload: [{ entity_id: 'sensor.temperature', state: '21.5' }],
      knxAiCerebrum: sent[0].knxAiCerebrum
    })
    expect(await pending).to.deep.equal([{ entity_id: 'sensor.temperature', state: '21.5' }])

    let deniedError
    try {
      await provider.callService({ domain: 'light', service: 'turn_on' })
    } catch (error) {
      deniedError = error
    }
    expect(deniedError).to.be.an('error')
    expect(deniedError.message).to.include('confirmation authorization')

    await new Promise(resolve => bridge.emit('close', resolve))
    expect(registry.providers.has('ha-bridge-test')).to.equal(false)
  })
})
