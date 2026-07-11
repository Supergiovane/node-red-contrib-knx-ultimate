const { expect } = require('chai')
const { hueStateToCanonical, matterEventToHuePatch } = require('../nodes/utils/lightEngines/matterHueShim')
const { createLightEngine } = require('../nodes/utils/lightEngines')

describe('matterHueShim - Hue-native boundary for the Matter Light node', () => {
  describe('hueStateToCanonical', () => {
    it('maps switch ON', () => {
      expect(hueStateToCanonical({ on: { on: true } })).to.deep.equal({ on: true })
    })
    it('maps switch OFF', () => {
      expect(hueStateToCanonical({ on: { on: false } })).to.deep.equal({ on: false })
    })
    it('maps the composite switch-on preset (on + dimming + colour temperature)', () => {
      const patch = hueStateToCanonical({ on: { on: true }, dimming: { brightness: 100 }, color_temperature: { mirek: 333 } })
      expect(patch.on).to.equal(true)
      expect(patch.brightnessPct).to.equal(100)
      expect(patch.colorTempK).to.equal(3003)
    })
    it('maps xy colour to rgb', () => {
      const patch = hueStateToCanonical({ dimming: { brightness: 100 }, color: { xy: { x: 0.675, y: 0.322 } } })
      expect(patch.rgb).to.be.an('object')
      expect(patch.rgb.r).to.be.greaterThan(patch.rgb.b) // reddish
    })
    it('ignores unknown/empty states', () => {
      expect(hueStateToCanonical({})).to.equal(null)
      expect(hueStateToCanonical(null)).to.equal(null)
      expect(hueStateToCanonical({ dynamics: { duration: 0 } })).to.equal(null)
    })
  })

  describe('end-to-end: KNX switch toggle through the shim reaches Matter', () => {
    it('hue-native {on:{on:true}} becomes the Matter on command', () => {
      const calls = []
      const engine = createLightEngine('matter', { nodeId: '5', endpointId: 2, manager: { writeMatterQueueAdd: (i) => calls.push(i) } })
      engine.applyState(hueStateToCanonical({ on: { on: true } }))
      expect(calls).to.have.lengthOf(1)
      expect(calls[0].name).to.equal('on')
      expect(calls[0].endpointId).to.equal(2)
    })
    it('the day preset becomes on + moveToLevelWithOnOff + moveToColorTemperature', () => {
      const calls = []
      const engine = createLightEngine('matter', { nodeId: '5', endpointId: 2, manager: { writeMatterQueueAdd: (i) => calls.push(i) } })
      engine.applyState(hueStateToCanonical({ on: { on: true }, dimming: { brightness: 100 }, color_temperature: { mirek: 370 } }))
      expect(calls.map((c) => c.name)).to.deep.equal(['on', 'moveToLevelWithOnOff', 'moveToColorTemperature'])
    })
  })

  describe('matterEventToHuePatch (feedback)', () => {
    it('onOff report', () => {
      expect(matterEventToHuePatch({ clusterId: 6, attributeName: 'onOff', value: true })).to.deep.equal({ on: true })
    })
    it('currentLevel report -> brightness %', () => {
      expect(matterEventToHuePatch({ clusterId: 8, attributeName: 'currentLevel', value: 254 })).to.deep.equal({ brightnessPct: 100 })
    })
    it('colorTemperatureMireds report -> kelvin + mirek', () => {
      expect(matterEventToHuePatch({ clusterId: 768, attributeName: 'colorTemperatureMireds', value: 370 })).to.deep.equal({ colorTempK: 2703, mirek: 370 })
    })
    it('currentX/currentY reports -> xy fractions', () => {
      expect(matterEventToHuePatch({ clusterId: 768, attributeName: 'currentX', value: 32768 }).xyX).to.be.closeTo(0.5, 0.001)
      expect(matterEventToHuePatch({ clusterId: 768, attributeName: 'currentY', value: 16384 }).xyY).to.be.closeTo(0.25, 0.001)
    })
    it('irrelevant attributes are ignored', () => {
      expect(matterEventToHuePatch({ clusterId: 6, attributeName: 'globalSceneControl', value: 1 })).to.equal(null)
    })
  })
})
