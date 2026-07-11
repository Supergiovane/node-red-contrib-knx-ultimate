'use strict'
const { LightEngine } = require('./lightEngine')
const { clampByte, kelvinToMired, miredToKelvin, rgbToXy } = require('./canonicalLight')

// Hue speaks a single COMPOSITE, atomic state object (Hue API v2 shape):
//   { on:{on}, dimming:{brightness}, color:{xy}, color_temperature:{mirek} }
// so a canonical patch collapses into ONE writeHueQueueAdd call.
class HueLightEngine extends LightEngine {
  constructor (opts = {}) {
    super(opts)
    this.manager = opts.manager // hue-config's hueManager (writeHueQueueAdd)
    this.operation = opts.grouped ? 'setGroupedLight' : 'setLight'
  }

  get kind () { return 'hue' }

  capabilities () {
    return { onOff: true, dimming: true, colorTemp: true, color: true, effects: true }
  }

  translate (patch) {
    const state = {}
    if (patch.on !== undefined) state.on = { on: !!patch.on }
    if (patch.brightnessPct !== undefined) state.dimming = { brightness: clampByte(patch.brightnessPct, 100) }
    if (patch.colorTempK !== undefined) state.color_temperature = { mirek: kelvinToMired(patch.colorTempK) }
    if (patch.rgb !== undefined) state.color = { xy: { x: rgbToXy(patch.rgb)[0], y: rgbToXy(patch.rgb)[1] } }
    return state
  }

  applyState (patch) {
    const state = this.translate(patch)
    if (Object.keys(state).length === 0) return []
    if (this.manager && typeof this.manager.writeHueQueueAdd === 'function') {
      this.manager.writeHueQueueAdd(this.deviceId, state, this.operation)
    }
    return [{ api: 'writeHueQueueAdd', deviceId: this.deviceId, state, operation: this.operation }]
  }

  // Hue resource object (as delivered to handleSendHUE) -> canonical patch.
  parseIncoming (event) {
    if (!event) return null
    if (event.id !== undefined && event.id !== this.deviceId) return null
    const patch = {}
    if (event.on && event.on.on !== undefined) patch.on = !!event.on.on
    if (event.dimming && event.dimming.brightness !== undefined) patch.brightnessPct = Number(event.dimming.brightness)
    if (event.color_temperature && event.color_temperature.mirek) patch.colorTempK = miredToKelvin(event.color_temperature.mirek)
    return Object.keys(patch).length ? patch : null
  }
}

module.exports = { HueLightEngine }
