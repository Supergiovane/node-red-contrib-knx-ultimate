/* global RED */
/* eslint-disable no-undef */

;(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.UltimateEditorNotifications = api
  try {
    const editor = typeof RED !== 'undefined' ? RED : (root && root.RED)
    if (editor) api.install(editor)
  } catch (error) { /* Node-RED will call install when the resource loads again. */ }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const PATCH_MARKER = '__ultimateCloseButtonPatched'
  const CLOSE_BUTTON_CLASS = 'ultimate-notification-close'

  const closeLabel = (RED) => {
    const key = 'common.label.close'
    try {
      const translated = RED && typeof RED._ === 'function' ? RED._(key) : undefined
      if (translated && translated !== key) return translated
    } catch (error) { /* use the language-neutral fallback below */ }
    return 'Close'
  }

  const normalizeOptions = (options, fixed, timeout) => {
    if (options && typeof options === 'object') return { ...options }
    const normalized = {}
    if (options !== undefined && options !== null) normalized.type = options
    if (fixed !== undefined) normalized.fixed = fixed
    if (timeout !== undefined) normalized.timeout = timeout
    return normalized
  }

  const closesNotification = (button) => {
    if (!button || typeof button !== 'object') return false
    if (String(button.class || '').split(/\s+/).includes(CLOSE_BUTTON_CLASS)) return true
    if (typeof button.click !== 'function') return false

    // Existing project buttons close either the notification directly or a
    // named close/dismiss helper. Recognising them avoids duplicate buttons.
    const source = Function.prototype.toString.call(button.click)
    return /\.close\s*\(|\.dialog\s*\(\s*['"]close['"]|\b(?:close|dismiss)\w*\s*\(/i.test(source)
  }

  const withCloseButton = (RED, options, getNotification) => {
    const normalized = { ...options }
    const buttons = Array.isArray(normalized.buttons) ? normalized.buttons.slice() : []
    if (!buttons.some(closesNotification)) {
      buttons.push({
        text: closeLabel(RED),
        class: CLOSE_BUTTON_CLASS,
        click: function () {
          const notification = getNotification()
          if (notification && typeof notification.close === 'function') notification.close()
        }
      })
    }
    normalized.buttons = buttons
    return normalized
  }

  const install = (RED) => {
    if (!RED || typeof RED.notify !== 'function') return false
    if (RED.notify[PATCH_MARKER]) return true

    const originalNotify = RED.notify
    const notifyWithClose = function (message, options, fixed, timeout) {
      const notificationRef = { current: null }
      const normalized = withCloseButton(
        RED,
        normalizeOptions(options, fixed, timeout),
        () => notificationRef.current
      )
      notificationRef.current = originalNotify.call(this, message, normalized)
      const notification = notificationRef.current

      if (notification && typeof notification.update === 'function' && !notification.update[PATCH_MARKER]) {
        const originalUpdate = notification.update
        const updateWithClose = function (updatedMessage, updatedOptions) {
          const options = typeof updatedOptions === 'number'
            ? { timeout: updatedOptions }
            : normalizeOptions(updatedOptions)
          return originalUpdate.call(this, updatedMessage, withCloseButton(RED, options, () => notification))
        }
        Object.defineProperty(updateWithClose, PATCH_MARKER, { value: true })
        notification.update = updateWithClose
      }

      return notification
    }

    Object.defineProperty(notifyWithClose, PATCH_MARKER, { value: true })
    Object.defineProperty(notifyWithClose, '__ultimateOriginalNotify', { value: originalNotify })
    RED.notify = notifyWithClose
    return true
  }

  return Object.freeze({ install })
}))
