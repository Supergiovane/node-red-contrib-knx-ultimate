'use strict'
// Canonical, engine-agnostic light model.
//
// The Light node's behaviour logic (dimming ramps, day/night presets, blink,
// colour cycle, HSV...) speaks ONLY this vocabulary. Each concrete engine
// (Hue, Matter, future Shelly) translates a canonical patch into its native
// shape and back. Keeping the node blind to the ecosystem is what prevents the
// "if engine === 'hue'" spaghetti.
//
// A canonical patch is a plain object with any subset of:
//   { on: boolean,
//     brightnessPct: number 0..100,
//     colorTempK: number (kelvin),
//     rgb: { r, g, b } (0..255) }

const clamp = (v, min, max) => Math.min(max, Math.max(min, Number(v)))

const clampByte = (v, max = 254) => {
  let n = Math.round(Number(v))
  if (Number.isNaN(n)) n = 0
  if (n < 0) n = 0
  if (n > max) n = max
  return n
}

// Kelvin <-> mired. Same physical unit; Hue calls it "mirek", Matter "mireds".
const kelvinToMired = (kelvin) => {
  const k = Number(kelvin)
  if (!k || Number.isNaN(k)) return 0
  return Math.round(1000000 / k)
}
const miredToKelvin = (mired) => {
  const m = Number(mired)
  if (!m || Number.isNaN(m)) return 0
  return Math.round(1000000 / m)
}

// sRGB (0..255) -> CIE 1931 xy, using the Wide RGB D65 conversion Philips Hue expects.
const rgbToXy = ({ r, g, b }) => {
  const norm = (c) => {
    const v = clamp(c, 0, 255) / 255
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92
  }
  const rn = norm(r)
  const gn = norm(g)
  const bn = norm(b)
  const X = rn * 0.649926 + gn * 0.103455 + bn * 0.197109
  const Y = rn * 0.234327 + gn * 0.743075 + bn * 0.022598
  const Z = rn * 0.0000000 + gn * 0.053077 + bn * 1.035763
  const sum = X + Y + Z
  if (sum === 0) return [0, 0]
  return [Number((X / sum).toFixed(4)), Number((Y / sum).toFixed(4))]
}

// RGB (0..255) -> HSV. hue in 0..360, sat/val in 0..1.
const rgbToHsv = ({ r, g, b }) => {
  const rn = clamp(r, 0, 255) / 255
  const gn = clamp(g, 0, 255) / 255
  const bn = clamp(b, 0, 255) / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

module.exports = { clamp, clampByte, kelvinToMired, miredToKelvin, rgbToXy, rgbToHsv }
