const { expect } = require('chai')
const { createLightEngine, availableEngines } = require('../nodes/utils/lightEngines')

// A spy that mimics the two real managers (hue-config.hueManager /
// matter-config.matterManager) so we can assert what each engine issued.
function spyManager () {
  const calls = []
  return {
    calls,
    writeHueQueueAdd: (id, state, op) => calls.push({ api: 'writeHueQueueAdd', id, state, op }),
    writeMatterQueueAdd: (item) => calls.push({ api: 'writeMatterQueueAdd', item })
  }
}

describe('lightEngines – the adapter seam', () => {
  it('registers hue and matter engines', () => {
    expect(availableEngines()).to.include.members(['hue', 'matter'])
  })

  // The whole point: ONE canonical command, driven identically, produces the
  // correct — but different — native calls per ecosystem.
  describe('same canonical patch { on:true, brightnessPct:80 }', () => {
    const patch = { on: true, brightnessPct: 80 }

    it('HUE -> one composite writeHueQueueAdd', () => {
      const mgr = spyManager()
      const engine = createLightEngine('hue', { manager: mgr, deviceId: 'lamp-1' })
      engine.applyState(patch)
      expect(mgr.calls).to.have.lengthOf(1)
      expect(mgr.calls[0].api).to.equal('writeHueQueueAdd')
      expect(mgr.calls[0].id).to.equal('lamp-1')
      expect(mgr.calls[0].state).to.deep.equal({ on: { on: true }, dimming: { brightness: 80 } })
      expect(mgr.calls[0].op).to.equal('setLight')
    })

    it('MATTER -> two discrete writeMatterQueueAdd (on + moveToLevelWithOnOff)', () => {
      const mgr = spyManager()
      const engine = createLightEngine('matter', { manager: mgr, nodeId: 42, endpointId: 1 })
      engine.applyState(patch)
      expect(mgr.calls).to.have.lengthOf(2)
      expect(mgr.calls.map((c) => c.item.name)).to.deep.equal(['on', 'moveToLevelWithOnOff'])
      // 80% -> 203 on the 0..254 Matter scale
      expect(mgr.calls[1].item.args.level).to.equal(203)
      expect(mgr.calls[1].item.clusterId).to.equal(8)
      expect(mgr.calls[1].item.nodeId).to.equal(42)
    })
  })

  describe('colour temperature { colorTempK: 2700 }', () => {
    it('HUE uses mirek', () => {
      const engine = createLightEngine('hue', { deviceId: 'lamp-1' })
      const [op] = engine.applyState({ colorTempK: 2700 })
      expect(op.state.color_temperature).to.deep.equal({ mirek: 370 })
    })
    it('MATTER uses colorTemperatureMireds via moveToColorTemperature', () => {
      const engine = createLightEngine('matter', { nodeId: 1 })
      const [op] = engine.applyState({ colorTempK: 2700 })
      expect(op.name).to.equal('moveToColorTemperature')
      expect(op.args.colorTemperatureMireds).to.equal(370)
    })
  })

  describe('feedback: native event -> canonical patch (and upward emit)', () => {
    it('HUE dimming event -> brightnessPct', () => {
      let emitted = null
      const engine = createLightEngine('hue', { deviceId: 'lamp-1', onStateChange: (p) => { emitted = p } })
      const patch = engine.handleIncoming({ id: 'lamp-1', dimming: { brightness: 42 } })
      expect(patch).to.deep.equal({ brightnessPct: 42 })
      expect(emitted).to.deep.equal({ brightnessPct: 42 })
    })

    it('HUE event for a different device is ignored', () => {
      const engine = createLightEngine('hue', { deviceId: 'lamp-1' })
      expect(engine.parseIncoming({ id: 'other', dimming: { brightness: 10 } })).to.equal(null)
    })

    it('MATTER currentLevel report -> brightnessPct (0..254 -> 0..100)', () => {
      const engine = createLightEngine('matter', { nodeId: 7 })
      const patch = engine.parseIncoming({ nodeId: 7, clusterId: 8, attributeName: 'currentLevel', value: 127 })
      expect(patch).to.deep.equal({ brightnessPct: 50 })
    })

    it('MATTER colorTemperatureMireds report -> colorTempK', () => {
      const engine = createLightEngine('matter', { nodeId: 7 })
      const patch = engine.parseIncoming({ nodeId: 7, clusterId: 768, attributeName: 'colorTemperatureMireds', value: 370 })
      expect(patch).to.deep.equal({ colorTempK: 2703 })
    })
  })

  describe('capabilities differ so the node can degrade gracefully', () => {
    it('hue advertises native effects, matter does not', () => {
      expect(createLightEngine('hue').capabilities().effects).to.equal(true)
      expect(createLightEngine('matter').capabilities().effects).to.equal(false)
    })
  })

  it('unknown engine throws a helpful error', () => {
    expect(() => createLightEngine('zigbee')).to.throw(/Unknown light engine "zigbee"/)
  })
})
