'use strict'
const { LightEngine } = require('./lightEngine')
const { CLUSTER, matterToKnx } = require('../matterKnxConverter')
const { clampByte, kelvinToMired, rgbToHsv } = require('./canonicalLight')

// Standard "options" arguments required by several Matter cluster commands.
const LEVEL_OPTS = { optionsMask: {}, optionsOverride: {} }

// Matter speaks DISCRETE, per-cluster commands, so a single canonical patch
// DECOMPOSES into N writeMatterQueueAdd calls (on + moveToLevel + colour...).
// This engine wraps matter-config's matterManager (the controller), NOT the
// generic Matter controller paths.
class MatterLightEngine extends LightEngine {
  constructor (opts = {}) {
    super(opts)
    this.manager = opts.manager // matter-config's matterManager (writeMatterQueueAdd)
    this.nodeId = opts.nodeId !== undefined ? opts.nodeId : opts.deviceId // commissioned Matter node id
    this.endpointId = opts.endpointId !== undefined ? opts.endpointId : 1
  }

  get kind () { return 'matter' }

  capabilities () {
    // No native "effects" (candle/fire/prism) equivalent -> node emulates or skips.
    return { onOff: true, dimming: true, colorTemp: true, color: true, effects: false }
  }

  translate (patch) {
    const ops = []
    if (patch.on !== undefined) {
      ops.push({ clusterId: CLUSTER.ON_OFF, kind: 'command', name: patch.on ? 'on' : 'off', args: undefined })
    }
    if (patch.brightnessPct !== undefined) {
      ops.push({
        clusterId: CLUSTER.LEVEL_CONTROL,
        kind: 'command',
        name: 'moveToLevelWithOnOff',
        args: { level: clampByte(Number(patch.brightnessPct) * 254 / 100, 254), transitionTime: 0, ...LEVEL_OPTS }
      })
    }
    if (patch.colorTempK !== undefined) {
      ops.push({
        clusterId: CLUSTER.COLOR_CONTROL,
        kind: 'command',
        name: 'moveToColorTemperature',
        args: { colorTemperatureMireds: kelvinToMired(patch.colorTempK), transitionTime: 0, ...LEVEL_OPTS }
      })
    }
    if (patch.rgb !== undefined) {
      const { h, s } = rgbToHsv(patch.rgb)
      ops.push({
        clusterId: CLUSTER.COLOR_CONTROL,
        kind: 'command',
        name: 'moveToHue',
        args: { hue: clampByte(h * 254 / 360, 254), direction: 0, transitionTime: 0, ...LEVEL_OPTS }
      })
      ops.push({
        clusterId: CLUSTER.COLOR_CONTROL,
        kind: 'command',
        name: 'moveToSaturation',
        args: { saturation: clampByte(s * 254, 254), transitionTime: 0, ...LEVEL_OPTS }
      })
    }
    return ops
  }

  applyState (patch) {
    const issued = []
    let ops = []
    try {
      ops = this.translate(patch)
    } catch (error) {
      ops = []
    }
    ops.forEach((op) => {
      const item = {
        nodeId: this.nodeId,
        endpointId: this.endpointId,
        clusterId: op.clusterId,
        kind: op.kind,
        name: op.name,
        args: op.args
      }
      try {
        if (this.manager && typeof this.manager.writeMatterQueueAdd === 'function') {
          const ret = this.manager.writeMatterQueueAdd(item)
          // writeMatterQueueAdd is async: swallow a late rejection so this
          // fire-and-forget call can never become an unhandled rejection (process crash).
          if (ret && typeof ret.catch === 'function') ret.catch(() => { })
        }
      } catch (error) { /* one failed write must never break the batch */ }
      issued.push({ api: 'writeMatterQueueAdd', ...item })
    })
    return issued
  }

  // Matter attribute report -> canonical patch. Reuses matterToKnx value scaling
  // (currentLevel -> percent, colorTemperatureMireds -> kelvin, onOff -> bool).
  parseIncoming (event) {
    try {
      if (!event) return null
      if (event.nodeId !== undefined && this.nodeId !== undefined && event.nodeId !== this.nodeId) return null
      const value = matterToKnx(Number(event.clusterId), event.attributeName, event.value)
      if (value === undefined) return null
      switch (event.attributeName) {
        case 'onOff': return { on: !!value }
        case 'currentLevel': return { brightnessPct: Number(value) }
        case 'colorTemperatureMireds': return { colorTempK: Number(value) }
        default: return null
      }
    } catch (error) {
      return null
    }
  }
}

module.exports = { MatterLightEngine }
