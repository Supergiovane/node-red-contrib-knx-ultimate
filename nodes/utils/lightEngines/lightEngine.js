'use strict'
// Abstract LightEngine: the single seam between the Light node's engine-agnostic
// behaviour logic and a concrete ecosystem (Hue, Matter, ...future Shelly).
//
// A concrete engine must implement:
//   - applyState(patch): push a canonical patch toward the ecosystem
//   - parseIncoming(event): turn a native ecosystem event into a canonical patch
//   - capabilities(): advertise what it can honour, so the node can degrade
//     gracefully (e.g. native Hue effects have no Matter equivalent)

class LightEngine {
  constructor (opts = {}) {
    this.deviceId = opts.deviceId
    this._onState = typeof opts.onStateChange === 'function' ? opts.onStateChange : () => {}
  }

  get kind () { return 'abstract' }

  capabilities () {
    return { onOff: false, dimming: false, colorTemp: false, color: false, effects: false }
  }

  // Canonical patch -> native ecosystem call(s). Returns the list of native
  // operations issued (useful for tests and status/debug).
  applyState (_patch) {
    throw new Error(`${this.kind}: applyState not implemented`)
  }

  // Native ecosystem event -> canonical patch, or null when irrelevant.
  parseIncoming (_event) {
    return null
  }

  // Feed a native event and, when relevant, emit the canonical patch upward
  // (to the node, which writes it to KNX). Keeps parseIncoming pure/testable.
  handleIncoming (event) {
    let patch = null
    try {
      patch = this.parseIncoming(event)
      if (patch && Object.keys(patch).length > 0) this._onState(patch)
    } catch (error) { /* a bad event / feedback sink must never crash the caller */ }
    return patch
  }
}

module.exports = { LightEngine }
