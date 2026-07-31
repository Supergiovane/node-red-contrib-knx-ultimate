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

  function open (options = {}) {
    const RED = options.RED
    const $ = options.$
    const windowObject = options.windowObject
    const documentObject = options.documentObject
    const migrationApi = options.migrationApi || (windowObject && windowObject.KNXUltimateHueControllerMigration)
    const translate = typeof options.translate === 'function'
      ? options.translate
      : (key, fallback, values) => defaultTranslate(RED, key, fallback, values)

    if (!RED || !$ || !windowObject || !documentObject || !migrationApi || typeof migrationApi.convertLegacyHueFlowJson !== 'function') {
      if (RED && typeof RED.notify === 'function') {
        RED.notify(translate('migration_unavailable', 'The HUE migration tool is unavailable. Restart Node-RED after updating the package.'), 'error')
      }
      return function () {}
    }

    const $dialog = $('<div class="hue-controller-migration-dialog"></div>').appendTo('body')
    $('<div class="hue-controller-migration-note"></div>')
      .text(translate('migration_privacy', 'Paste an exported Node-RED flow. Conversion happens locally and does not modify the open flow.'))
      .css({ marginBottom: '8px' })
      .appendTo($dialog)
    $('<div class="hue-controller-migration-credentials"></div>')
      .text(translate('migration_credentials_notice', 'Node-RED deliberately excludes keys and passwords from exported flows. The converter cannot read or recreate them.'))
      .css({ marginBottom: '12px', padding: '8px 10px', borderLeft: '4px solid #d79b00', background: '#fff8df' })
      .appendTo($dialog)
    $('<label for="hue-controller-migration-input"></label>')
      .text(translate('migration_input', 'Original flow JSON'))
      .css({ display: 'block', fontWeight: 'bold', marginBottom: '4px' })
      .appendTo($dialog)
    const $input = $('<textarea id="hue-controller-migration-input"></textarea>')
      .attr('placeholder', translate('migration_input_placeholder', 'Paste the complete Node-RED flow export here'))
      .css({ width: '100%', height: '190px', boxSizing: 'border-box', fontFamily: 'monospace', resize: 'vertical' })
      .appendTo($dialog)
    const $reuseConfigsRow = $('<div></div>')
      .css({ margin: '10px 0' })
      .appendTo($dialog)
    const $reuseConfigs = $('<input type="checkbox" id="hue-controller-migration-reuse-configs">')
      .prop('checked', true)
      .appendTo($reuseConfigsRow)
    $('<label for="hue-controller-migration-reuse-configs"></label>')
      .text(` ${translate('migration_reuse_configs', 'Reuse existing Hue and KNX config nodes (recommended)')}`)
      .css({ display: 'inline', fontWeight: 'bold' })
      .appendTo($reuseConfigsRow)
    $('<div></div>')
      .text(translate('migration_reuse_configs_help', 'Keep this selected when importing back into the same Node-RED installation. Referenced config nodes are omitted from the result, so their stored credentials remain untouched.'))
      .css({ margin: '4px 0 0 22px', color: '#666' })
      .appendTo($reuseConfigsRow)
    const $toolbar = $('<div></div>')
      .css({ display: 'flex', gap: '8px', alignItems: 'center', margin: '10px 0' })
      .appendTo($dialog)
    const $convert = $('<button type="button" class="red-ui-button"></button>')
      .append($('<i class="fa fa-exchange"></i>'))
      .append(documentObject.createTextNode(` ${translate('migration_convert', 'Convert')}`))
      .appendTo($toolbar)
    const $copy = $('<button type="button" class="red-ui-button"></button>')
      .append($('<i class="fa fa-clipboard"></i>'))
      .append(documentObject.createTextNode(` ${translate('migration_copy', 'Copy converted flow')}`))
      .prop('disabled', true)
      .appendTo($toolbar)
    const $status = $('<span class="hue-controller-migration-status"></span>')
      .css({ marginLeft: '4px' })
      .appendTo($toolbar)
    $('<label for="hue-controller-migration-output"></label>')
      .text(translate('migration_output', 'Converted flow JSON'))
      .css({ display: 'block', fontWeight: 'bold', marginBottom: '4px' })
      .appendTo($dialog)
    const $output = $('<textarea id="hue-controller-migration-output" readonly></textarea>')
      .css({ width: '100%', height: '230px', boxSizing: 'border-box', fontFamily: 'monospace', resize: 'vertical' })
      .appendTo($dialog)

    $convert.on(`click${EVENT_NAMESPACE}`, () => {
      try {
        const result = migrationApi.convertLegacyHueFlowJson($input.val(), {
          reuseConfigNodes: $reuseConfigs.prop('checked')
        })
        $output.val(result.json).scrollTop(0)
        $copy.prop('disabled', false)
        if (result.convertedCount === 0) {
          $status.text(translate('migration_none', 'No legacy HUE nodes were found.')).css('color', '#a15c00')
        } else {
          let summary = translate('migration_summary', '{{count}} legacy HUE nodes converted.')
            .replace('{{count}}', String(result.convertedCount))
          let statusColor = '#1b7d33'
          if (result.omittedConfigCount > 0) {
            summary += ` ${translate('migration_summary_reused', '{{count}} referenced config nodes will be reused with their existing credentials.')
              .replace('{{count}}', String(result.omittedConfigCount))}`
          } else if (!$reuseConfigs.prop('checked')) {
            summary += ` ${translate('migration_configs_included_warning', 'Config nodes are included without exported credentials; enter their keys and passwords after import.')}`
            statusColor = '#a15c00'
          }
          $status.text(summary).css('color', statusColor)
        }
      } catch (error) {
        $output.val('')
        $copy.prop('disabled', true)
        const message = error && error.message ? error.message : String(error)
        $status.text(`${translate('migration_invalid', 'Invalid flow JSON:')} ${message}`).css('color', '#b00020')
      }
    })

    $copy.on(`click${EVENT_NAMESPACE}`, () => {
      const convertedJson = $output.val()
      if (!convertedJson) return
      $copy.prop('disabled', true)
      migrationApi.copyTextToClipboard(convertedJson, {
        navigator: windowObject.navigator,
        document: documentObject
      }).then(() => {
        RED.notify(translate('migration_copy_success', 'Converted flow copied.'), 'success')
      }).catch(() => {
        const outputElement = $output.get(0)
        if (outputElement) {
          outputElement.focus()
          outputElement.select()
          if (typeof outputElement.setSelectionRange === 'function') {
            outputElement.setSelectionRange(0, convertedJson.length)
          }
        }
        RED.notify(translate('migration_copy_failed', 'Clipboard access was blocked. The converted JSON has been selected; copy it manually.'), 'error')
      }).finally(() => {
        $copy.prop('disabled', false)
      })
    })

    let closed = false
    const closeDialog = () => {
      if (closed) return
      closed = true
      $convert.off(EVENT_NAMESPACE)
      $copy.off(EVENT_NAMESPACE)
      try { $dialog.dialog('destroy') } catch (error) { /* already detached */ }
      $dialog.remove()
    }

    $dialog.dialog({
      modal: true,
      width: Math.min(920, Math.max(620, $(windowObject).width() - 80)),
      height: Math.min(760, Math.max(600, $(windowObject).height() - 60)),
      title: translate('migration_title', 'Convert legacy HUE flow'),
      close: closeDialog,
      buttons: [{
        text: translate('migration_close', 'Close'),
        click () { $(this).dialog('close') }
      }]
    })
    setTimeout(() => $input.trigger('focus'), 0)
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
