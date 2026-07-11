'use strict'
// Boundary shim that lets the (copied) Hue Light logic drive a MATTER light untouched.
// The node keeps speaking Hue-native composite states ({on:{on}}, {dimming:{brightness}},
// {color:{xy}}, {color_temperature:{mirek}}); these pure functions translate them to the
// canonical light model (for MatterLightEngine) and Matter attribute reports back into
// Hue-shaped feedback patches.
const hueColorConverter = require('../colorManipulators/hueColorConverter')
const { matterToKnx } = require('../matterKnxConverter')

// Hue-native state object -> canonical patch { on, brightnessPct, colorTempK, rgb }.
function hueStateToCanonical (hueState) {
  try {
    return _hueStateToCanonical(hueState)
  } catch (error) {
    return null
  }
}
function _hueStateToCanonical (hueState) {
  if (!hueState || typeof hueState !== 'object') return null
  const patch = {}
  if (hueState.on && hueState.on.on !== undefined) patch.on = !!hueState.on.on
  if (hueState.dimming && hueState.dimming.brightness !== undefined) patch.brightnessPct = Number(hueState.dimming.brightness)
  if (hueState.color_temperature && hueState.color_temperature.mirek) patch.colorTempK = Math.round(1000000 / Number(hueState.color_temperature.mirek))
  if (hueState.color && hueState.color.xy && hueState.color.xy.x !== undefined) {
    const bri = patch.brightnessPct !== undefined ? patch.brightnessPct : 100
    try {
      const rgb = hueColorConverter.ColorConverter.xyBriToRgb(Number(hueState.color.xy.x), Number(hueState.color.xy.y), bri)
      patch.rgb = { r: rgb.r, g: rgb.g, b: rgb.b }
    } catch (error) { /* colour conversion failed: skip the colour part */ }
  }
  return Object.keys(patch).length ? patch : null
}

// Matter attribute report -> feedback patch for the node
// { on } | { brightnessPct } | { colorTempK, mirek } | { xyX } | { xyY } | null.
function matterEventToHuePatch (event) {
  try {
    if (!event || event.attributeName === undefined) return null
    switch (event.attributeName) {
      case 'onOff':
        return { on: event.value === true }
      case 'currentLevel': {
        const v = matterToKnx(Number(event.clusterId), 'currentLevel', event.value)
        return v === undefined ? null : { brightnessPct: Number(v) }
      }
      case 'colorTemperatureMireds': {
        const m = Number(event.value)
        return m > 0 ? { colorTempK: Math.round(1000000 / m), mirek: m } : null
      }
      case 'currentX': return { xyX: Number(event.value) / 65536 }
      case 'currentY': return { xyY: Number(event.value) / 65536 }
      default: return null
    }
  } catch (error) {
    return null
  }
}

module.exports = { hueStateToCanonical, matterEventToHuePatch }
