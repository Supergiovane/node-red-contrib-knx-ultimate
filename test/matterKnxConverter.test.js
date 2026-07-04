const { expect } = require('chai')
const { knxToMatter, matterToKnx, CLUSTER } = require('../nodes/utils/matterKnxConverter')

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
