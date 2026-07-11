const { expect } = require('chai')
const { canonicalizeKnxLightCommand, dptForDestination } = require('../nodes/utils/lightEngines/knxLightCommand')
const { createLightEngine } = require('../nodes/utils/lightEngines')

// A representative light config (only the fields the command path reads).
const config = {
  GALightSwitch: '1/1/1', dptLightSwitch: '1.001',
  GALightBrightness: '1/1/2', dptLightBrightness: '5.001',
  GALightKelvin: '1/1/3', dptLightKelvin: '7.600',
  GALightKelvinPercentage: '1/1/4', dptLightKelvinPercentage: '5.001',
  GALightColor: '1/1/5', dptLightColor: '232.600',
  GALightDIM: '1/1/6',
  GALightBlink: '1/1/7',
  GALightColorCycle: '1/1/8',
  specifySwitchOnBrightness: 'temperature',
  enableDayNightLighting: 'temperature',
  colorAtSwitchOnDayTime: { kelvin: 3000, brightness: 100 },
  colorAtSwitchOnNightTime: { kelvin: 2700, brightness: 20 }
}

describe('knxLightCommand – KNX light GA -> canonical patch', () => {
  it('resolves the right DPT for a destination', () => {
    expect(dptForDestination(config, '1/1/3')).to.equal('7.600')
    expect(dptForDestination(config, '9/9/9')).to.equal(null)
  })

  it('switch OFF -> { on: false }', () => {
    const r = canonicalizeKnxLightCommand({ config, destination: '1/1/1', value: false })
    expect(r.patch).to.deep.equal({ on: false })
  })

  it('switch ON (daytime) applies the day preset brightness + kelvin', () => {
    const r = canonicalizeKnxLightCommand({ config, destination: '1/1/1', value: true, dayTime: true })
    expect(r.patch).to.deep.equal({ on: true, brightnessPct: 100, colorTempK: 3000 })
  })

  it('switch ON (nighttime) applies the night preset', () => {
    const r = canonicalizeKnxLightCommand({ config, destination: '1/1/1', value: true, dayTime: false })
    expect(r.patch).to.deep.equal({ on: true, brightnessPct: 20, colorTempK: 2700 })
  })

  it('absolute brightness maps to brightnessPct and derives on/off', () => {
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/2', value: 60 }).patch).to.deep.equal({ brightnessPct: 60, on: true })
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/2', value: 0 }).patch).to.deep.equal({ brightnessPct: 0, on: false })
  })

  it('kelvin is clamped to 2000..6535', () => {
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/3', value: 9000 }).patch).to.deep.equal({ colorTempK: 6535 })
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/3', value: 1500 }).patch).to.deep.equal({ colorTempK: 2000 })
  })

  it('tunable-white percentage maps to a colour temperature (inverted scale)', () => {
    // 100% warm -> inv 0 -> mirek 153 -> ~6536K ; 0% -> inv 100 -> mirek 500 -> 2000K
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/4', value: 0 }).patch.colorTempK).to.equal(2000)
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/5', value: { red: 255, green: 0, blue: 0 } }).patch).to.deep.equal({ rgb: { r: 255, g: 0, b: 0 } })
  })

  it('reports Hue-only behaviours as unsupported on Matter', () => {
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/6', value: {} }).unsupported).to.match(/dimming/)
    expect(canonicalizeKnxLightCommand({ config, destination: '1/1/7', value: true }).unsupported).to.match(/Effect/)
  })

  it('returns null for an unrelated destination', () => {
    expect(canonicalizeKnxLightCommand({ config, destination: '9/9/9', value: 1 })).to.equal(null)
  })

  // End-to-end: KNX switch-on -> canonical patch -> Matter engine native commands.
  it('a KNX switch-on flows through the Matter engine as on + level + colour-temp', () => {
    const calls = []
    const engine = createLightEngine('matter', {
      nodeId: 5,
      manager: { writeMatterQueueAdd: (item) => calls.push(item) }
    })
    const { patch } = canonicalizeKnxLightCommand({ config, destination: '1/1/1', value: true, dayTime: true })
    engine.applyState(patch)
    expect(calls.map((c) => c.name)).to.deep.equal(['on', 'moveToLevelWithOnOff', 'moveToColorTemperature'])
    expect(calls[1].args.level).to.equal(254) // 100% -> 254
    expect(calls[2].args.colorTemperatureMireds).to.equal(333) // 3000K -> 333 mired
  })
})
