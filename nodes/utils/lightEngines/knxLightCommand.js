'use strict'
const { miredToKelvin } = require('./canonicalLight')

// Linear scale, mirrors hueColorConverter.ColorConverter.scale.
const scale = (v, [inMin, inMax], [outMin, outMax]) =>
  outMin + ((Number(v) - inMin) * (outMax - outMin)) / (inMax - inMin)

const truthy = (v) => v === true || v === 1 || v === '1' || v === 'true' || v === 'on'

// Pure, engine-agnostic mapping of a DECODED KNX light group-address value into a
// canonical patch. `value` is the already dpt-decoded payload, so this stays free
// of knxultimate/dptlib and is trivially unit-testable.
//
// Returns:
//   { patch }              -> a canonical patch to push to the engine
//   { unsupported: reason } -> a Hue-only behaviour with no Matter equivalent
//   null                   -> destination not handled by the light command path
function canonicalizeKnxLightCommand ({ config, destination, value, dayTime = true }) {
  switch (destination) {
    case config.GALightSwitch: {
      const on = truthy(value)
      const patch = { on }
      // Parity with the Hue switch-on preset (temperature mode): a Matter light
      // turns on with the same day/night brightness + colour temperature.
      if (on && config.specifySwitchOnBrightness === 'temperature') {
        const preset = (dayTime === false && config.enableDayNightLighting === 'temperature')
          ? config.colorAtSwitchOnNightTime
          : config.colorAtSwitchOnDayTime
        if (preset && typeof preset === 'object') {
          if (preset.brightness !== undefined) patch.brightnessPct = Number(preset.brightness)
          if (preset.kelvin !== undefined) patch.colorTempK = Number(preset.kelvin)
        }
      }
      return { patch }
    }
    case config.GALightBrightness: {
      const pct = Number(value)
      if (Number.isNaN(pct)) throw new Error('Invalid KNX brightness payload')
      return { patch: { brightnessPct: pct, on: pct > 0 } }
    }
    case config.GALightKelvin: {
      const kelvin = Math.min(6535, Math.max(2000, Number(value)))
      return { patch: { colorTempK: kelvin } }
    }
    case config.GALightKelvinPercentage: {
      if (config.dptLightKelvinPercentage !== '5.001') return null
      const mirek = scale(100 - Number(value), [0, 100], [153, 500])
      return { patch: { colorTempK: miredToKelvin(mirek) } }
    }
    case config.GALightColor: {
      if (!value || typeof value !== 'object') return null
      return { patch: { rgb: { r: value.red, g: value.green, b: value.blue } } }
    }
    case config.GALightDIM:
    case config.GALightHSV_H_DIM:
    case config.GALightHSV_S_DIM:
    case config.GALightKelvinDIM:
      return { unsupported: 'Relative/HSV dimming not supported on Matter' }
    case config.GALightBlink:
    case config.GALightColorCycle:
      return { unsupported: 'Effect not supported on Matter' }
    default:
      return null
  }
}

// The DPT that must be used to decode a given destination GA.
function dptForDestination (config, destination) {
  switch (destination) {
    case config.GALightSwitch: return config.dptLightSwitch
    case config.GALightBrightness: return config.dptLightBrightness
    case config.GALightKelvin: return config.dptLightKelvin
    case config.GALightKelvinPercentage: return config.dptLightKelvinPercentage
    case config.GALightColor: return config.dptLightColor
    default: return null
  }
}

module.exports = { canonicalizeKnxLightCommand, dptForDestination }
