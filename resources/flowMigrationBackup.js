(function (root, factory) {
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateFlowMigrationBackup = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  function filenameFor (kind, now) {
    const date = new Date(now)
    if (!Number.isFinite(date.getTime())) throw new Error('The backup timestamp is invalid')
    const pad = (value, length = 2) => String(value).padStart(length, '0')
    // Use local time, as displayed in the editor user's browser.
    return `flows-backup-before-${kind}-conversion-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}-${pad(date.getMilliseconds(), 3)}.json`
  }

  function download (RED, options = {}) {
    const environment = options.environment || root
    const documentObject = options.documentObject || (environment && environment.document)
    const kind = options.kind || 'knx'
    if (kind !== 'knx' && kind !== 'hue') throw new Error('The migration backup kind is invalid')
    if (!RED || !RED.nodes || typeof RED.nodes.createCompleteNodeSet !== 'function') {
      throw new Error('The Node-RED flow export API is unavailable')
    }
    if (!environment || typeof environment.Blob !== 'function' || !environment.URL ||
        typeof environment.URL.createObjectURL !== 'function' || typeof environment.URL.revokeObjectURL !== 'function' ||
        typeof environment.setTimeout !== 'function' || !documentObject ||
        typeof documentObject.createElement !== 'function' || !documentObject.body ||
        typeof documentObject.body.appendChild !== 'function') {
      throw new Error('This browser cannot download a flow backup')
    }

    // Export everything currently in the editor, including undeployed changes.
    // Protected credentials are deliberately excluded, just like a normal export.
    const nodes = RED.nodes.createCompleteNodeSet({ credentials: false, includeModuleConfig: true })
    if (!Array.isArray(nodes) || nodes.some(node => !node || typeof node !== 'object' || Array.isArray(node))) {
      throw new Error('The Node-RED flow export did not return a valid node array')
    }
    // Serialize before invoking any browser API: conversion must never alter this
    // snapshot, even if the export contains references to current editor objects.
    const json = JSON.stringify(nodes, null, 4)
    if (typeof json !== 'string' || json[0] !== '[') throw new Error('The flow backup could not be serialized')
    const filename = filenameFor(kind, options.now === undefined ? Date.now() : options.now)
    const anchor = documentObject.createElement('a')
    if (!anchor || typeof anchor.click !== 'function' || !('download' in anchor)) {
      throw new Error('This browser cannot download a flow backup')
    }
    const blob = new environment.Blob([json], { type: 'application/json;charset=utf-8' })
    const objectURL = environment.URL.createObjectURL(blob)
    let failure
    try {
      anchor.href = objectURL
      anchor.download = filename
      anchor.hidden = true
      documentObject.body.appendChild(anchor)
      // Keep this synchronous, inside the user's Convert button click gesture.
      anchor.click()
    } catch (error) {
      failure = error
    } finally {
      try {
        if (anchor.parentNode) anchor.parentNode.removeChild(anchor)
      } catch (error) {
        failure = failure || error
      }
      try {
        // Give the browser time to consume the Blob after the temporary link is
        // removed. Triggering a download cannot confirm that a file was saved.
        environment.setTimeout(function () {
          environment.URL.revokeObjectURL(objectURL)
        }, 30000)
      } catch (error) {
        failure = failure || error
        try { environment.URL.revokeObjectURL(objectURL) } catch (cleanupError) { /* preserve the original failure */ }
      }
    }
    if (failure) throw failure
    return { filename, nodeCount: nodes.length }
  }

  return { download }
}))
