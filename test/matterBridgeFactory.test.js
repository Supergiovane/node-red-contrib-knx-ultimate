const { expect } = require('chai')
const { EventEmitter } = require('events')
const fs = require('fs')
const os = require('os')
const path = require('path')

// The factory is an ES module: load it once for the whole suite
let factory
let MatterBridgeEngine
let OnOffServer
let LevelControlServer
before(async function () {
  this.timeout(20000)
  factory = await import('../nodes/utils/matterBridgeDeviceFactory.mjs')
  MatterBridgeEngine = (await import('../nodes/utils/matterBridgeEngine.mjs')).classMatterBridge
  OnOffServer = (await import('@matter/main/behaviors/on-off')).OnOffServer
  LevelControlServer = (await import('@matter/main/behaviors/level-control')).LevelControlServer
})

describe('matterBridgeDeviceFactory – knxValueToMatterPatch', () => {
  const patch = (def, fn, value) => factory.knxValueToMatterPatch(def, fn, value)

  it('converts on/off booleans', () => {
    expect(patch({ type: 'onofflight' }, 'onoff', true)).to.deep.equal({ onOff: { onOff: true } })
    expect(patch({ type: 'onofflight' }, 'onoff', 0)).to.deep.equal({ onOff: { onOff: false } })
  })

  it('converts KNX percent to Matter level 1-254', () => {
    expect(patch({ type: 'dimmablelight' }, 'level', 100).levelControl.currentLevel).to.equal(254)
    expect(patch({ type: 'dimmablelight' }, 'level', 50).levelControl.currentLevel).to.equal(127)
    expect(patch({ type: 'dimmablelight' }, 'level', 0).levelControl.currentLevel).to.equal(1)
  })

  it('converts temperature °C to centi-°C', () => {
    expect(patch({ type: 'temperaturesensor' }, 'temperature', 21.53).temperatureMeasurement.measuredValue).to.equal(2153)
  })

  it('converts humidity percent to centi-percent, clamped', () => {
    expect(patch({ type: 'humiditysensor' }, 'humidity', 55.5).relativeHumidityMeasurement.measuredValue).to.equal(5550)
    expect(patch({ type: 'humiditysensor' }, 'humidity', 150).relativeHumidityMeasurement.measuredValue).to.equal(10000)
  })

  it('converts lux to the Matter log scale', () => {
    expect(patch({ type: 'lightsensor' }, 'illuminance', 1000).illuminanceMeasurement.measuredValue).to.equal(30001)
    expect(patch({ type: 'lightsensor' }, 'illuminance', 0).illuminanceMeasurement.measuredValue).to.equal(0)
  })

  it('converts occupancy and contact booleans', () => {
    expect(patch({ type: 'occupancysensor' }, 'occupancy', 1).occupancySensing.occupancy.occupied).to.equal(true)
    expect(patch({ type: 'contactsensor' }, 'contact', false).booleanState.stateValue).to.equal(false)
  })

  it('converts cover position percent to percent100ths', () => {
    expect(patch({ type: 'windowcovering' }, 'position', 30).windowCovering.currentPositionLiftPercent100ths).to.equal(3000)
  })

  it('inverts the cover position when requested', () => {
    expect(patch({ type: 'windowcovering', invertPosition: true }, 'position', 30).windowCovering.currentPositionLiftPercent100ths).to.equal(7000)
  })

  it('converts thermostat temperatures and clamps the setpoint', () => {
    expect(patch({ type: 'thermostat' }, 'currenttemp', 19.8).thermostat.localTemperature).to.equal(1980)
    expect(patch({ type: 'thermostat' }, 'setpoint', 21.5).thermostat.occupiedHeatingSetpoint).to.equal(2150)
    expect(patch({ type: 'thermostat' }, 'setpoint', 99).thermostat.occupiedHeatingSetpoint).to.equal(3000)
  })

  it('converts KNX RGB (DPT 232.600) to Matter hue/saturation', () => {
    const red = patch({ type: 'rgblight' }, 'rgb', { red: 255, green: 0, blue: 0 })
    expect(red.colorControl.currentHue).to.equal(0)
    expect(red.colorControl.currentSaturation).to.equal(254)
    const cyan = patch({ type: 'rgblight' }, 'rgb', { red: 0, green: 255, blue: 255 })
    expect(Math.abs(cyan.colorControl.currentHue - 127)).to.be.at.most(2)
  })

  it('converts Kelvin to clamped mireds for the tunable white light', () => {
    expect(patch({ type: 'colortemperaturelight' }, 'colortemp', 4000).colorControl.colorTemperatureMireds).to.equal(250)
    expect(patch({ type: 'colortemperaturelight' }, 'colortemp', 10000).colorControl.colorTemperatureMireds).to.equal(153) // clamped to 6500K
    expect(patch({ type: 'colortemperaturelight' }, 'colortemp', 333).colorControl.colorTemperatureMireds).to.equal(333) // mireds accepted directly
  })

  it('converts smoke/CO alarms to alarm states', () => {
    const smoke = patch({ type: 'smokecoalarm' }, 'smoke', true)
    expect(smoke.smokeCoAlarm.smokeState).to.equal(2)
    expect(smoke.smokeCoAlarm.expressedState).to.equal(1)
    expect(patch({ type: 'smokecoalarm' }, 'smoke', false).smokeCoAlarm.smokeState).to.equal(0)
    expect(patch({ type: 'smokecoalarm' }, 'co', true).smokeCoAlarm.coState).to.equal(2)
  })

  it('converts CO2 ppm to measurement + air quality class', () => {
    const good = patch({ type: 'airqualitysensor' }, 'co2', 600)
    expect(good.carbonDioxideConcentrationMeasurement.measuredValue).to.equal(600)
    expect(good.airQuality.airQuality).to.equal(1) // Good
    expect(patch({ type: 'airqualitysensor' }, 'co2', 1250).airQuality.airQuality).to.equal(3) // Moderate
    expect(patch({ type: 'airqualitysensor' }, 'co2', 3500).airQuality.airQuality).to.equal(6) // ExtremelyPoor
  })

  it('converts fan speed percent with coupled fan mode', () => {
    const on = patch({ type: 'fan' }, 'fanspeed', 60)
    expect(on.fanControl.percentCurrent).to.equal(60)
    expect(on.fanControl.fanMode).to.equal(3)
    expect(patch({ type: 'fan' }, 'fanspeed', 0).fanControl.fanMode).to.equal(0)
  })

  it('converts robot vacuum states and modes', () => {
    expect(patch({ type: 'robotvacuum' }, 'rvcstate', 'docked').rvcOperationalState.operationalState).to.equal(0x42)
    expect(patch({ type: 'robotvacuum' }, 'rvcstate', 'running').rvcOperationalState.operationalState).to.equal(1)
    expect(patch({ type: 'robotvacuum' }, 'rvcmode', 'cleaning').rvcRunMode.currentMode).to.equal(1)
    expect(patch({ type: 'robotvacuum' }, 'rvcmode', 'boh')).to.equal(undefined)
  })

  it('returns undefined for invalid values and unknown functions', () => {
    expect(patch({ type: 'temperaturesensor' }, 'temperature', 'abc')).to.equal(undefined)
    expect(patch({ type: 'onofflight' }, 'nope', 1)).to.equal(undefined)
    expect(patch({ type: 'rgblight' }, 'rgb', 'notanobject')).to.equal(undefined)
  })
})

describe('matterBridgeDeviceFactory – BRIDGE_TYPES catalog', () => {
  it('covers all the device types exposed by the editor', () => {
    const expected = ['onofflight', 'onoffplug', 'dimmablelight', 'rgblight', 'colortemperaturelight', 'temperaturesensor', 'humiditysensor', 'lightsensor', 'occupancysensor', 'contactsensor', 'windowcovering', 'thermostat', 'smokecoalarm', 'waterleakdetector', 'airqualitysensor', 'fan', 'robotvacuum']
    expected.forEach((t) => {
      expect(factory.BRIDGE_TYPES, `missing type ${t}`).to.have.property(t)
    })
  })
})

describe('knxUltimateMatterBridge – optimistic cover feedback', () => {
  it('confirms a flow-only cover position to Matter', () => {
    let NodeConstructor
    const matterStateUpdates = []
    const sentMessages = []
    const logMessages = []
    const bridge = {
      registerDevice: () => {},
      getPairingInfo: () => ({ running: true, commissioned: true, fabrics: [] }),
      setDeviceState: (deviceId, fn, value) => matterStateUpdates.push({ deviceId, fn, value })
    }
    const knx = {
      addClient: () => {},
      removeClient: () => {}
    }
    const RED = {
      nodes: {
        createNode: (node, config) => {
          Object.setPrototypeOf(node, EventEmitter.prototype)
          EventEmitter.call(node)
          node.id = config.id
          node.send = (msg) => sentMessages.push(msg)
          node.status = () => {}
          node.log = (message) => logMessages.push(message)
        },
        getNode: (id) => ({ knx, bridge })[id],
        registerType: (_type, constructor) => { NodeConstructor = constructor }
      },
      log: { error: () => {} }
    }

    require('../nodes/knxUltimateMatterBridge.js')(RED)
    const node = new NodeConstructor({
      id: 'cover-1',
      server: 'knx',
      serverMatterBridge: 'bridge',
      name: 'Flow cover',
      deviceType: 'windowcovering',
      coverUpdateMode: 'optimistic',
      coverStatusTimeoutMs: 0,
      enableNodePINS: 'yes'
    })

    node.handleMatterCommand({
      fn: 'position',
      value: 57,
      matterDiagnostic: {
        handler: 'handleMovement',
        movementType: 0,
        reversed: false,
        direction: 2,
        directionName: 'DefinedByPosition',
        targetPercent100ths: 5700
      }
    })

    expect(sentMessages).to.have.length(1)
    expect(sentMessages[0].payload).to.equal(57)
    expect(matterStateUpdates).to.deep.equal([
      { deviceId: 'cover-1', fn: 'position', value: 57 }
    ])
    expect(logMessages).to.have.length(1)
    expect(logMessages[0]).to.include('"directionName":"DefinedByPosition"')
    expect(logMessages[0]).to.include('"targetPercent100ths":5700')
    expect(sentMessages[0].matter.matterDiagnostic).to.deep.equal({
      handler: 'handleMovement',
      movementType: 0,
      reversed: false,
      direction: 2,
      directionName: 'DefinedByPosition',
      targetPercent100ths: 5700
    })
    node.emit('close', () => {})
  })
})

describe('matterBridgeDeviceFactory – raw command output', () => {
  it('emits repeated On/Off and absolute level commands even when state is unchanged', async function () {
    this.timeout(10000)
    const storagePath = fs.mkdtempSync(path.join(os.tmpdir(), 'knxu-matter-raw-'))
    const port = 56000 + Math.floor(Math.random() * 8000)
    const logger = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} }
    const bridge = new MatterBridgeEngine(storagePath, `knxu-raw-${Date.now()}`, logger, { port, deviceName: 'Raw test' })
    const commands = []
    bridge.on('command', (command) => commands.push(command))

    try {
      await bridge.start([{ id: 'raw-light', type: 'dimmablelight', name: 'Raw light' }])
      const endpoint = bridge.endpoints.get('raw-light')
      await endpoint.act((agent) => agent.get(OnOffServer).off())
      await endpoint.act((agent) => agent.get(OnOffServer).off())
      await endpoint.act((agent) => agent.get(LevelControlServer).moveToLevelWithOnOff({ level: 127, transitionTime: null }))

      expect(commands.map(({ fn, value }) => ({ fn, value }))).to.deep.equal([
        { fn: 'onoff', value: false },
        { fn: 'onoff', value: false },
        { fn: 'level', value: 50 }
      ])
      expect(commands[2].matterCommand.command).to.equal('moveToLevelWithOnOff')
    } finally {
      await bridge.close()
      fs.rmSync(storagePath, { recursive: true, force: true })
    }
  })
})
