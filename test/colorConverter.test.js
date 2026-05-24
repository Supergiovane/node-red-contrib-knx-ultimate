const { expect } = require('chai')
const { ColorConverter } = require('../nodes/utils/colorManipulators/hueColorConverter')
const XYFromRGB = require('../nodes/utils/colorManipulators/XYFromRGB_Supergiovane')

const HUE_GAMUT = {
  red: { x: 0.7, y: 0.298 },
  green: { x: 0.17, y: 0.7 },
  blue: { x: 0.15, y: 0.06 }
}

describe('ColorConverter – kelvin / mirek conversion', () => {
  it('converts 3000 K to mirek', () => {
    expect(ColorConverter.kelvinToMirek(3000)).to.equal(333)
  })

  it('converts 6500 K to mirek', () => {
    expect(ColorConverter.kelvinToMirek(6500)).to.equal(153)
  })

  it('converts 500 mirek to kelvin', () => {
    expect(ColorConverter.mirekToKelvin(500)).to.equal(2000)
  })

  it('converts 153 mirek to kelvin', () => {
    expect(ColorConverter.mirekToKelvin(153)).to.equal(6535)
  })

  it('kelvinToMirek and mirekToKelvin are approximate inverses', () => {
    const kelvin = 4000
    const mirek = ColorConverter.kelvinToMirek(kelvin)
    const backToKelvin = ColorConverter.mirekToKelvin(mirek)
    expect(backToKelvin).to.be.closeTo(kelvin, 5)
  })
})

describe('ColorConverter – scale (linear interpolation)', () => {
  it('maps 50% of [0,100] to 127.5 in [0,255]', () => {
    expect(ColorConverter.scale(50, [0, 100], [0, 255])).to.equal(127.5)
  })

  it('maps 0% to the minimum of the output range', () => {
    expect(ColorConverter.scale(0, [0, 100], [0, 255])).to.equal(0)
  })

  it('maps 100% to the maximum of the output range', () => {
    expect(ColorConverter.scale(100, [0, 100], [0, 255])).to.equal(255)
  })

  it('maps a value to [0,1] scale', () => {
    expect(ColorConverter.scale(50, [0, 100], [0, 1])).to.equal(0.5)
  })
})

describe('ColorConverter – getBrightnessFromRGBOrHex', () => {
  it('returns 0 for black', () => {
    expect(ColorConverter.getBrightnessFromRGBOrHex(0, 0, 0)).to.equal(0)
  })

  it('returns ~100 for white', () => {
    expect(ColorConverter.getBrightnessFromRGBOrHex(255, 255, 255)).to.be.closeTo(100, 1)
  })

  it('returns a value between 0 and 100 for a mid-tone', () => {
    const brightness = ColorConverter.getBrightnessFromRGBOrHex(128, 128, 128)
    expect(brightness).to.be.greaterThan(0).and.lessThan(100)
  })

  it('green appears brighter than blue (luminance weighting)', () => {
    const green = ColorConverter.getBrightnessFromRGBOrHex(0, 255, 0)
    const blue = ColorConverter.getBrightnessFromRGBOrHex(0, 0, 255)
    expect(green).to.be.greaterThan(blue)
  })
})

describe('ColorConverter – rgbToHsv', () => {
  it('pure red gives h=0, s=100, v=100', () => {
    expect(ColorConverter.rgbToHsv(255, 0, 0)).to.deep.equal({ h: 0, s: 100, v: 100 })
  })

  it('pure green gives h=33, s=100, v=100', () => {
    const result = ColorConverter.rgbToHsv(0, 255, 0)
    expect(result.s).to.equal(100)
    expect(result.v).to.equal(100)
    expect(result.h).to.be.within(33, 34)
  })

  it('pure blue gives s=100, v=100', () => {
    const result = ColorConverter.rgbToHsv(0, 0, 255)
    expect(result.s).to.equal(100)
    expect(result.v).to.equal(100)
  })

  it('black gives s=0, v=0', () => {
    const result = ColorConverter.rgbToHsv(0, 0, 0)
    expect(result.s).to.equal(0)
    expect(result.v).to.equal(0)
  })

  it('white gives s=0, v=100', () => {
    const result = ColorConverter.rgbToHsv(255, 255, 255)
    expect(result.s).to.equal(0)
    expect(result.v).to.equal(100)
  })
})

describe('ColorConverter – hsvToRgb', () => {
  it('pure red h=0,s=1,v=1 gives rgb(255,0,0)', () => {
    expect(ColorConverter.hsvToRgb(0, 1, 1)).to.deep.equal({ r: 255, g: 0, b: 0 })
  })

  it('black h=0,s=0,v=0 gives rgb(0,0,0)', () => {
    expect(ColorConverter.hsvToRgb(0, 0, 0)).to.deep.equal({ r: 0, g: 0, b: 0 })
  })

  it('white h=0,s=0,v=1 gives rgb(255,255,255)', () => {
    expect(ColorConverter.hsvToRgb(0, 0, 1)).to.deep.equal({ r: 255, g: 255, b: 255 })
  })

  it('rgbToHsv and hsvToRgb are approximate inverses (±15 tolerance due to integer flooring in rgbToHsv)', () => {
    const original = { r: 180, g: 60, b: 200 }
    const hsv = ColorConverter.rgbToHsv(original.r, original.g, original.b)
    const back = ColorConverter.hsvToRgb(hsv.h / 100, hsv.s / 100, hsv.v / 100)
    expect(back.r).to.be.closeTo(original.r, 15)
    expect(back.g).to.be.closeTo(original.g, 15)
    expect(back.b).to.be.closeTo(original.b, 15)
  })
})

describe('ColorConverter – hexRgb', () => {
  it('parses a 6-digit hex color', () => {
    expect(ColorConverter.hexRgb('#ff0000')).to.deep.include({ red: 255, green: 0, blue: 0 })
  })

  it('parses lowercase and uppercase hex equally', () => {
    const lower = ColorConverter.hexRgb('#aabbcc')
    const upper = ColorConverter.hexRgb('#AABBCC')
    expect(lower).to.deep.equal(upper)
  })

  it('parses a 3-digit shorthand hex color', () => {
    const result = ColorConverter.hexRgb('#f00')
    expect(result).to.deep.include({ red: 255, green: 0, blue: 0 })
  })

  it('throws on invalid hex input', () => {
    expect(() => ColorConverter.hexRgb('not-a-hex')).to.throw(TypeError)
  })

  it('parses hex without leading #', () => {
    const result = ColorConverter.hexRgb('00ff00')
    expect(result).to.deep.include({ red: 0, green: 255, blue: 0 })
  })
})

describe('ColorConverter – xyBriToRgb', () => {
  it('returns integer RGB values', () => {
    const rgb = ColorConverter.xyBriToRgb(0.3, 0.3, 80)
    expect(rgb.r).to.be.a('number').and.satisfy(Number.isInteger)
    expect(rgb.g).to.be.a('number').and.satisfy(Number.isInteger)
    expect(rgb.b).to.be.a('number').and.satisfy(Number.isInteger)
  })

  it('all components are within [0, 255]', () => {
    const rgb = ColorConverter.xyBriToRgb(0.25, 0.35, 60)
    expect(rgb.r).to.be.within(0, 255)
    expect(rgb.g).to.be.within(0, 255)
    expect(rgb.b).to.be.within(0, 255)
  })

  it('zero brightness produces black', () => {
    const rgb = ColorConverter.xyBriToRgb(0.3, 0.3, 0)
    expect(rgb).to.deep.equal({ r: 0, g: 0, b: 0 })
  })
})

describe('XYFromRGB_Supergiovane – calculateXYFromRGB', () => {
  it('returns x and y in [0, 1]', () => {
    const xy = XYFromRGB.calculateXYFromRGB(200, 100, 50, null)
    expect(xy.x).to.be.within(0, 1)
    expect(xy.y).to.be.within(0, 1)
  })

  it('black returns {x:0, y:0}', () => {
    const xy = XYFromRGB.calculateXYFromRGB(0, 0, 0, null)
    expect(xy.x).to.equal(0)
    expect(xy.y).to.equal(0)
  })

  it('pure red without gamut maps to known Hue CIE coordinates', () => {
    const xy = XYFromRGB.calculateXYFromRGB(255, 0, 0, null)
    expect(xy.x).to.be.closeTo(0.7006, 0.001)
    expect(xy.y).to.be.closeTo(0.2993, 0.001)
  })

  it('gamut-constrained result falls within gamut triangle', () => {
    const xy = XYFromRGB.calculateXYFromRGB(255, 0, 0, HUE_GAMUT)
    expect(xy.x).to.be.within(0, 1)
    expect(xy.y).to.be.within(0, 1)
  })

  it('different colors produce different XY coordinates', () => {
    const red = XYFromRGB.calculateXYFromRGB(255, 0, 0, null)
    const blue = XYFromRGB.calculateXYFromRGB(0, 0, 255, null)
    expect(red.x).to.not.equal(blue.x)
    expect(red.y).to.not.equal(blue.y)
  })
})
