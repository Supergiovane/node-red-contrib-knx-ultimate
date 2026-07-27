(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateMatterQrScanner = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  function normalizeMatterQrPayload (rawValue) {
    const value = typeof rawValue === 'string' ? rawValue.trim() : ''
    if (!/^MT:[0-9A-Z.-]+$/.test(value)) return null
    return value
  }

  function getResultText (result) {
    if (result && typeof result.getText === 'function') return result.getText()
    if (result && typeof result.text === 'string') return result.text
    return ''
  }

  function getCameraStatus (browserWindow, browserNavigator) {
    if (!browserWindow || browserWindow.isSecureContext !== true) {
      return { available: false, reason: 'insecure' }
    }
    if (!browserNavigator || !browserNavigator.mediaDevices || typeof browserNavigator.mediaDevices.getUserMedia !== 'function') {
      return { available: false, reason: 'unsupported' }
    }
    return { available: true, reason: null }
  }

  function stopVideo (videoElement) {
    if (!videoElement) return
    const stream = videoElement.srcObject
    if (stream && typeof stream.getTracks === 'function') {
      stream.getTracks().forEach(function (track) {
        try {
          track.stop()
        } catch (error) { /* empty */ }
      })
    }
    try {
      videoElement.pause()
    } catch (error) { /* empty */ }
    try {
      videoElement.srcObject = null
    } catch (error) { /* empty */ }
  }

  function isCameraPermissionError (error) {
    return Boolean(error && (error.name === 'NotAllowedError' || error.name === 'SecurityError'))
  }

  function invertCanvasPixels (canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new Error('Canvas is not available')
    let context
    try {
      context = canvas.getContext('2d', { willReadFrequently: true })
    } catch (error) {
      context = canvas.getContext('2d')
    }
    if (!context) throw new Error('Canvas 2D context is not available')
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    for (let index = 0; index < imageData.data.length; index += 4) {
      imageData.data[index] = 255 - imageData.data[index]
      imageData.data[index + 1] = 255 - imageData.data[index + 1]
      imageData.data[index + 2] = 255 - imageData.data[index + 2]
    }
    context.putImageData(imageData, 0, 0)
    return canvas
  }

  function enableInvertedQrFallback (reader) {
    if (!reader || typeof reader.decodeFromCanvas !== 'function') throw new Error('QR reader is not available')
    const decodeFromCanvas = reader.decodeFromCanvas.bind(reader)
    reader.decodeFromCanvas = function (canvas) {
      try {
        return decodeFromCanvas(canvas)
      } catch (normalError) {
        try {
          invertCanvasPixels(canvas)
          return decodeFromCanvas(canvas)
        } catch (invertedError) {
          throw normalError
        }
      }
    }
    return reader
  }

  return {
    enableInvertedQrFallback,
    getCameraStatus,
    getResultText,
    invertCanvasPixels,
    isCameraPermissionError,
    normalizeMatterQrPayload,
    stopVideo
  }
}))
