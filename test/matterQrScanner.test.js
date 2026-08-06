const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const {
  enableInvertedQrFallback,
  getCameraStatus,
  getResultText,
  invertCanvasPixels,
  isCameraPermissionError,
  normalizeMatterQrPayload,
  stopVideo
} = require('../resources/matterQrScanner')

describe('Matter QR scanner editor helpers', () => {
  const projectRoot = path.resolve(__dirname, '..')

  it('accepts a trimmed Matter QR payload and rejects unrelated QR content', () => {
    expect(normalizeMatterQrPayload('  MT:Y.K9042C00KA0648G00  ')).to.equal('MT:Y.K9042C00KA0648G00')
    expect(normalizeMatterQrPayload('https://example.com')).to.equal(null)
    expect(normalizeMatterQrPayload('MT:')).to.equal(null)
    expect(normalizeMatterQrPayload('mt:y.k9042c00ka0648g00')).to.equal(null)
  })

  it('extracts decoded text from ZXing-style results', () => {
    expect(getResultText({ getText: () => 'MT:ABC' })).to.equal('MT:ABC')
    expect(getResultText({ text: 'MT:DEF' })).to.equal('MT:DEF')
    expect(getResultText(null)).to.equal('')
  })

  it('explains when camera access needs HTTPS or browser support', () => {
    const mediaNavigator = { mediaDevices: { getUserMedia: () => {} } }
    expect(getCameraStatus({ isSecureContext: false }, mediaNavigator)).to.deep.equal({ available: false, reason: 'insecure' })
    expect(getCameraStatus({ isSecureContext: true }, {})).to.deep.equal({ available: false, reason: 'unsupported' })
    expect(getCameraStatus({ isSecureContext: true }, mediaNavigator)).to.deep.equal({ available: true, reason: null })
  })

  it('stops every active video track and clears the preview', () => {
    let stopped = 0
    let paused = 0
    const video = {
      srcObject: {
        getTracks: () => [
          { stop: () => { stopped += 1 } },
          { stop: () => { stopped += 1 } }
        ]
      },
      pause: () => { paused += 1 }
    }
    stopVideo(video)
    expect(stopped).to.equal(2)
    expect(paused).to.equal(1)
    expect(video.srcObject).to.equal(null)
  })

  it('recognizes camera permission failures', () => {
    expect(isCameraPermissionError({ name: 'NotAllowedError' })).to.equal(true)
    expect(isCameraPermissionError({ name: 'SecurityError' })).to.equal(true)
    expect(isCameraPermissionError({ name: 'NotFoundError' })).to.equal(false)
  })

  it('inverts RGB canvas pixels while preserving alpha for white-on-dark QR codes', () => {
    const pixels = new Uint8ClampedArray([
      255, 255, 255, 128,
      12, 34, 56, 255
    ])
    let written
    const canvas = {
      width: 2,
      height: 1,
      getContext: () => ({
        getImageData: () => ({ data: pixels }),
        putImageData: (imageData) => { written = imageData.data }
      })
    }
    expect(invertCanvasPixels(canvas)).to.equal(canvas)
    expect(Array.from(written)).to.deep.equal([
      0, 0, 0, 128,
      243, 221, 199, 255
    ])
  })

  it('retries a failed QR decode after inverting the canvas', () => {
    const pixels = new Uint8ClampedArray([255, 255, 255, 255])
    const canvas = {
      width: 1,
      height: 1,
      getContext: () => ({
        getImageData: () => ({ data: pixels }),
        putImageData: () => {}
      })
    }
    let attempts = 0
    const reader = enableInvertedQrFallback({
      decodeFromCanvas: () => {
        attempts += 1
        if (pixels[0] !== 0) throw new Error('not found')
        return { getText: () => 'MT:A9CA00O6147FOS75V00' }
      }
    })
    const result = reader.decodeFromCanvas(canvas)
    expect(attempts).to.equal(2)
    expect(result.getText()).to.equal('MT:A9CA00O6147FOS75V00')
  })

  it('ships a browser decoder and the complete editor lifecycle', () => {
    const decoder = fs.readFileSync(path.join(projectRoot, 'resources/zxing-browser-0.2.0.min.js'), 'utf8')
    const editor = fs.readFileSync(path.join(projectRoot, 'nodes/matter-config.html'), 'utf8')
    expect(decoder).to.include('BrowserQRCodeReader')
    expect(editor).to.include('id="matter-qr-camera"')
    expect(editor).to.include('id="matter-qr-image"')
    expect(editor).to.include('id="matter-qr-camera-warning"')
    expect(editor).to.include('qrUtils.enableInvertedQrFallback')
    expect(editor).to.include("$pairButton.trigger('click')")
    expect(editor.indexOf('id="matter-pairing-name"')).to.be.lessThan(editor.indexOf('id="matter-qr-camera"'))
    expect(editor.indexOf('id="matter-qr-camera"')).to.be.lessThan(editor.indexOf('id="matter-pairing-code"'))
    expect(editor.indexOf('id="matter-devices-body"')).to.be.lessThan(editor.indexOf('id="matter-storage-export"'))
    expect(editor).to.include('id="matterPairSpinner" role="alertdialog"')
    expect(editor).to.include('position:fixed; inset:0; z-index:100000')
    expect(editor).to.include('id="matter-pairing-progress" role="progressbar"')
    expect(editor).to.include('id="matter-pairing-progress-description" aria-live="polite"')
    expect(editor).to.include('id="matter-pairing-progress-device"')
    expect(editor).to.include('KNXUltimateMatterPairProgress?serverId=')
    expect(editor).not.to.include('fa-circle-notch fa-spin" aria-hidden="true"')
    expect(editor).to.include('$pairSpinner.show()')
    expect(editor).to.include('$pairSpinner.hide()')
    expect(editor).to.include('oneditcancel:')
    expect(editor).to.include('oneditdelete:')
  })

  it('keeps scanner messages and help aligned in every supported locale', () => {
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    const requiredKeys = [
      'qr_acquire',
      'qr_scan_camera',
      'qr_scan_image',
      'qr_stop_camera',
      'qr_camera_insecure',
      'qr_camera_unsupported',
      'qr_camera_permission_denied',
      'qr_camera_failed',
      'qr_image_failed',
      'qr_invalid_matter',
      'qr_found',
      'qr_decoder_unavailable'
    ]
    locales.forEach((locale) => {
      const messages = require(path.join(projectRoot, 'nodes/locales', locale, 'matter-config.json'))
      const properties = messages['matter-config'].properties
      requiredKeys.forEach((key) => expect(properties[key], `${locale}:${key}`).to.be.a('string').and.not.equal(''))

      const help = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, 'matter-config.html'), 'utf8')
      const wikiName = locale === 'en' ? 'Matter-Controller-Configuration.md' : `${locale}-Matter-Controller-Configuration.md`
      const wiki = fs.readFileSync(path.join(projectRoot, 'docs/wiki', wikiName), 'utf8')
      expect(help, `${locale}:help`).to.include('localhost')
      expect(help, `${locale}:commissioning progress`).to.include('Vendor ID')
      expect(wiki, `${locale}:wiki`).to.include('localhost')
      expect(wiki, `${locale}:commissioning progress`).to.include('Vendor ID')
      expect(wiki, `${locale}:controller overview hero`).to.include('data-matter-controller-overview="hero"')
      expect((wiki.match(/data-matter-controller-overview="hero"/g) || []), `${locale}:single controller hero`).to.have.length(1)
    })
  })

  it('registers an operation-isolated local commissioning progress endpoint', () => {
    const runtime = fs.readFileSync(path.join(projectRoot, 'nodes/commonFunctions.js'), 'utf8')
    expect(runtime).to.include("RED.httpAdmin.get('/KNXUltimateMatterPairProgress'")
    expect(runtime).to.include('Another Matter commissioning operation is already in progress.')
  })

  it('preserves saved configuration through an untouched open/save/reopen round trip', () => {
    const editor = fs.readFileSync(path.join(projectRoot, 'nodes/matter-config.html'), 'utf8')
    const inlineScript = editor.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1]
    const elements = new Map()

    function jqueryStub (selector) {
      if (!elements.has(selector)) {
        const element = {
          0: { pause: () => {}, srcObject: null },
          _value: '',
          append: () => element,
          empty: () => element,
          focus: () => element,
          hide: () => element,
          on: () => element,
          prop: () => element,
          show: () => element,
          text: () => element,
          trigger: () => element,
          val: function (value) {
            if (arguments.length === 0) return element._value
            element._value = value
            return element
          }
        }
        elements.set(selector, element)
      }
      return elements.get(selector)
    }
    jqueryStub.getJSON = () => ({ fail: () => {} })

    let definition
    const context = {
      $: jqueryStub,
      Date,
      Promise,
      RED: {
        _: (key) => key,
        nodes: { registerType: (name, value) => { definition = value } },
        settings: {},
        sidebar: { show: () => {} },
        notify: () => {}
      },
      URLSearchParams,
      console,
      navigator: {},
      window: {
        KNXUltimateMatterQrScanner: require('../resources/matterQrScanner'),
        isSecureContext: false
      }
    }
    vm.runInNewContext(inlineScript, context)

    const savedNode = { id: 'controller-1', name: 'Main Matter', fabricLabel: 'KNX Fabric' }
    definition.oneditprepare.call(savedNode)
    definition.oneditsave.call(savedNode)
    expect(savedNode.name).to.equal('Main Matter')
    expect(savedNode.fabricLabel).to.equal('KNX Fabric')

    definition.oneditprepare.call(savedNode)
    expect(savedNode.name).to.equal('Main Matter')
    expect(savedNode.fabricLabel).to.equal('KNX Fabric')
    definition.oneditcancel.call(savedNode)
  })
})
