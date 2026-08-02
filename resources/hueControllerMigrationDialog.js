(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) {
    root.KNXUltimateHueControllerMigrationDialog = api
    if (root.RED && root.jQuery && root.document) {
      api.installLegacyButton(root.RED, root.jQuery, root, root.document)
    }
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict'

  const EVENT_NAMESPACE = '.knxUltimateHueControllerMigrationDialog'
  const BUTTON_SELECTOR = '.hue-legacy-migrate-flow'
  const I18N_PREFIX = 'node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.'
  let closeActiveDialog = function () {}

  function defaultTranslate (RED, key, fallback, values) {
    try {
      const qualifiedKey = `${I18N_PREFIX}${key}`
      const translated = RED._(qualifiedKey, values)
      if (translated && translated !== qualifiedKey) return translated
    } catch (error) { /* use fallback */ }
    return fallback
  }

  function closeEditorTray (RED, $) {
    try {
      if (RED.actions && typeof RED.actions.invoke === 'function') {
        RED.actions.invoke('core:cancel-edit-tray')
        return
      }
    } catch (error) { /* use the compatible button fallback */ }
    const $cancel = $('#node-dialog-cancel:visible, #node-config-dialog-cancel:visible').first()
    if ($cancel.length) $cancel.trigger('click')
  }

  function reserveDonationWindow (windowObject) {
    try {
      if (!windowObject || typeof windowObject.open !== 'function') return undefined
      const donationWindow = windowObject.open('', '_blank')
      if (donationWindow) {
        try { donationWindow.opener = null } catch (error) { /* best-effort isolation */ }
      }
      return donationWindow
    } catch (error) {
      return undefined
    }
  }

  function closeDonationWindow (donationWindow) {
    try {
      if (donationWindow && typeof donationWindow.close === 'function') donationWindow.close()
    } catch (error) { /* best effort after a failed conversion */ }
  }

  function showCompletionMessage (RED, translate, convertedCount) {
    if (!RED || typeof RED.notify !== 'function') return
    const message = translate('migration_success', 'Process finished. {{count}} legacy HUE nodes were converted. Inspect every modified node, including its function, configuration, pins and wiring, before clicking Deploy.')
      .replace('{{count}}', String(convertedCount))
    let notification
    try {
      notification = RED.notify(message, {
        modal: true,
        fixed: true,
        type: 'success',
        buttons: [{
          text: translate('migration_ok', 'OK'),
          class: 'primary',
          click () {
            if (notification && typeof notification.close === 'function') notification.close()
          }
        }]
      })
    } catch (error) { /* the conversion is already complete */ }
  }

  function open (options = {}) {
    const RED = options.RED
    const $ = options.$
    const windowObject = options.windowObject
    const documentObject = options.documentObject
    const migrationApi = options.migrationApi || (windowObject && windowObject.KNXUltimateHueControllerMigration)
    const translate = typeof options.translate === 'function'
      ? options.translate
      : (key, fallback, values) => defaultTranslate(RED, key, fallback, values)

    if (!RED || !$ || !windowObject || !documentObject || !migrationApi ||
        typeof migrationApi.collectLegacyHueNodes !== 'function' ||
        typeof migrationApi.createLocalMigrationPatches !== 'function' ||
        typeof migrationApi.applyLocalMigration !== 'function' ||
        typeof migrationApi.createUsageMailto !== 'function' ||
        typeof migrationApi.openUsageMailto !== 'function' ||
        typeof migrationApi.MIGRATION_DONATION_URL !== 'string') {
      if (RED && typeof RED.notify === 'function') {
        RED.notify(translate('migration_unavailable', 'The HUE migration tool is unavailable. Restart Node-RED after updating the package.'), 'error')
      }
      return function () {}
    }

    const legacyNodes = migrationApi.collectLegacyHueNodes(RED)
    if (legacyNodes.length === 0) {
      if (typeof RED.notify === 'function') RED.notify(translate('migration_none', 'No legacy HUE nodes were found.'), 'warning')
      return function () {}
    }

    const $dialog = $('<div class="hue-controller-migration-dialog"></div>').appendTo('body')
    $('<div class="hue-controller-migration-summary"></div>')
      .text(translate('migration_confirm', '{{count}} legacy HUE nodes will be converted directly in the editor.').replace('{{count}}', String(legacyNodes.length)))
      .css({ marginBottom: '10px', fontWeight: 'bold' })
      .appendTo($dialog)
    $('<div class="hue-controller-migration-note"></div>')
      .text(translate('migration_privacy', 'Conversion happens entirely in this browser. No flow, node, configuration, credential, group address, or wiring data is transmitted or retained.'))
      .css({ marginBottom: '10px', padding: '8px 10px', borderLeft: '4px solid #2980b9', background: '#eaf4fb' })
      .appendTo($dialog)
    $('<div class="hue-controller-migration-email"></div>')
      .text(translate('migration_email_notice', 'After conversion, your email app will open an editable draft addressed to the author without navigating away from Node-RED, and a new browser window will open the donation page. The draft contains only the number of converted nodes and space for optional notes; nothing is sent automatically and no flow data is added to the donation link.'))
      .css({ marginBottom: '10px' })
      .appendTo($dialog)
    $('<div class="form-tips hue-controller-migration-backup"></div>')
      .text(translate('migration_deploy_notice', 'Before continuing, export a backup of your flows. The current editor will close. Only the legacy HUE nodes will be changed; all config nodes and wiring remain untouched. Review the result, then click Deploy yourself.'))
      .css({ marginBottom: '10px', padding: '8px 10px', borderLeft: '4px solid #d79b00', background: '#fff8df' })
      .appendTo($dialog)
    $('<div class="form-tips hue-controller-migration-review"></div>')
      .text(translate('migration_review_notice', 'Safety check: after conversion, inspect every modified HUE node in the flow. Verify its selected function, configuration references, input/output pins and wiring before clicking Deploy.'))
      .css({ marginBottom: '12px', padding: '8px 10px', borderLeft: '4px solid #d79b00', background: '#fff8df' })
      .appendTo($dialog)
    const $status = $('<div class="hue-controller-migration-status"></div>')
      .css({ minHeight: '20px', marginTop: '8px' })
      .appendTo($dialog)

    let closed = false
    let running = false
    let $convert
    const closeDialog = () => {
      if (closed) return
      closed = true
      if ($convert) $convert.off(EVENT_NAMESPACE)
      try { $dialog.dialog('destroy') } catch (error) { /* already detached */ }
      $dialog.remove()
    }

    const performMigration = () => {
      if (running) return
      running = true
      $convert.prop('disabled', true)
      let donationWindow
      try {
        migrationApi.createLocalMigrationPatches(legacyNodes)
        donationWindow = reserveDonationWindow(windowObject)
        closeDialog()
        closeEditorTray(RED, $)
        windowObject.setTimeout(() => {
          let convertedCount
          try {
            convertedCount = migrationApi.applyLocalMigration(RED, legacyNodes)
          } catch (error) {
            closeDonationWindow(donationWindow)
            const message = error && error.message ? error.message : String(error)
            RED.notify(`${translate('migration_failed', 'HUE migration failed; the flow was not changed:')} ${message}`, 'error')
            return
          }
          try {
            if (donationWindow && !donationWindow.closed && donationWindow.location) {
              donationWindow.location.href = migrationApi.MIGRATION_DONATION_URL
            } else if (typeof windowObject.open === 'function') {
              const opened = windowObject.open(migrationApi.MIGRATION_DONATION_URL, '_blank', 'noopener,noreferrer')
              if (!opened) throw new Error('The browser blocked the donation window')
            } else {
              throw new Error('Browser window opening is unavailable')
            }
          } catch (error) {
            RED.notify(translate('migration_donation_failed', 'The nodes were converted, but the donation page could not be opened.'), 'warning')
          }
          try {
            const mailto = migrationApi.createUsageMailto(convertedCount, {
              subject: translate('migration_email_subject', 'KNX Ultimate - legacy HUE conversion used'),
              body: translate('migration_email_body', 'Hello Massimo,\n\nI used the legacy HUE node conversion button.\nConverted legacy HUE nodes: {{count}}.\n\nOptional notes:\n')
            })
            migrationApi.openUsageMailto(mailto, {
              document: documentObject,
              setTimeout: (callback, delay) => windowObject.setTimeout(callback, delay)
            })
          } catch (error) {
            RED.notify(translate('migration_email_failed', 'The nodes were converted, but the email draft could not be opened.'), 'warning')
          }
          showCompletionMessage(RED, translate, convertedCount)
        }, 0)
      } catch (error) {
        closeDonationWindow(donationWindow)
        running = false
        $convert.prop('disabled', false)
        const message = error && error.message ? error.message : String(error)
        $status.text(`${translate('migration_failed', 'HUE migration failed; the flow was not changed:')} ${message}`).css('color', '#b00020')
      }
    }

    $dialog.dialog({
      modal: true,
      width: Math.min(680, Math.max(520, $(windowObject).width() - 80)),
      title: translate('migration_title', 'Convert legacy HUE nodes'),
      beforeClose: () => !running,
      close: closeDialog,
      buttons: [
        {
          text: translate('migration_close', 'Cancel'),
          click () { if (!running) $(this).dialog('close') }
        },
        {
          text: translate('migration_convert', 'Convert HUE nodes'),
          class: 'hue-controller-migration-convert',
          click: performMigration
        }
      ],
      open () {
        $convert = $dialog.parent().find('.hue-controller-migration-convert')
        $convert.addClass('primary')
      }
    })
    return closeDialog
  }

  function installLegacyButton (RED, $, windowObject, documentObject) {
    if (!RED || !$ || !documentObject) return
    const $document = $(documentObject)
    $document.off(`click${EVENT_NAMESPACE}`, BUTTON_SELECTOR)
    $document.on(`click${EVENT_NAMESPACE}`, BUTTON_SELECTOR, (event) => {
      event.preventDefault()
      closeActiveDialog()
      closeActiveDialog = open({ RED, $, windowObject, documentObject })
    })
  }

  return { installLegacyButton, open }
}))
