const utilityFieldValue = (node, key) => {
  if (node._utilityEditor && typeof $ === 'function') {
    const field = $('#node-input-' + key)
    if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val()
  }
  return node[key]
}
const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
  if (!enabled(this)) return true
  const numeric = Number(value)
  return value !== null && value !== undefined && String(value).trim() !== '' &&
    Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric))
}

RED.nodes.registerType('knxUltimateGarage', {
  category: 'KNX Ultimate',
  color: '#C7E9C0',
  defaults: {
    server: { type: 'knxUltimate-config', required: true },
    name: { value: '' },
    outputtopic: { value: '' },
    gaCommand: { value: '', required: true },
    nameCommand: { value: '' },
    dptCommand: { value: '1.001' },
    gaImpulse: { value: '' },
    nameImpulse: { value: '' },
    dptImpulse: { value: '1.017' },
    gaHoldOpen: { value: '' },
    nameHoldOpen: { value: '' },
    dptHoldOpen: { value: '1.001' },
    gaDisable: { value: '' },
    nameDisable: { value: '' },
    dptDisable: { value: '1.001' },
    gaPhotocell: { value: '' },
    namePhotocell: { value: '' },
    dptPhotocell: { value: '1.001' },
    gaMoving: { value: '' },
    nameMoving: { value: '' },
    dptMoving: { value: '1.001' },
    gaObstruction: { value: '' },
    nameObstruction: { value: '' },
    dptObstruction: { value: '1.001' },
    autoCloseEnable: { value: true },
    autoCloseSeconds: { value: 120, validate: utilityNumber(0, false, (node) => utilityFieldValue(node, 'autoCloseEnable') !== false) },
    emitEvents: { value: false }
  },
  inputs: 1,
  outputs: 1,
  icon: 'node-knx-icon.svg',
  label: function () {
    return this.name || 'KNX Garage'
  },
  paletteLabel: 'KNX Garage',
  oneditprepare: function () {
    if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false
    const editorSession = { active: true }
    this._knxUtilityProfileSession = editorSession
    // Ignore responses belonging to a closed editor or a previous gateway.
    const profileGetJSON = (url, callback) => {
      const serverId = $('#node-input-server').val()
      return $.getJSON(url, (data) => {
        if (editorSession.active && $('#node-input-server').val() === serverId) callback(data)
      })
    }
    const node = this
    const $knxServerInput = $('#node-input-server')
    try { RED.sidebar.show('help') } catch (error) { /* ignore */ }
    const KNX_EMPTY_VALUES = new Set(['', '_ADD_', '__NONE__', 'none'])

    const resolveKnxServerValue = () => {
      const domValue = $knxServerInput.val()
      if (domValue !== undefined && domValue !== null) return KNX_EMPTY_VALUES.has(String(domValue)) ? '' : domValue
      if (node.server !== undefined && node.server !== null && node.server !== '') return node.server
      return ''
    }

    const hasKnxServerSelected = () => {
      const val = resolveKnxServerValue()
      return !(val === undefined || val === null || KNX_EMPTY_VALUES.has(String(val)))
    }

    const KNX_GA_CACHE = node._knxGaCache || (node._knxGaCache = new Map())

    const fetchGroupAddresses = (serverId) => {
      if (!serverId) return Promise.resolve([])
      if (KNX_GA_CACHE.has(serverId)) return Promise.resolve(KNX_GA_CACHE.get(serverId))
      return new Promise((resolve) => {
        profileGetJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
          const list = Array.isArray(data) ? data : []
          KNX_GA_CACHE.set(serverId, list)
          resolve(list)
        }).fail(() => resolve([]))
      })
    }

    const getGroupAddress = (gaSelector, nameSelector, dptSelector, prefixes) => {
      const $gaInput = $(gaSelector)
      const $nameInput = $(nameSelector)
      const $dptInput = $(dptSelector)
      if (!$gaInput.length) return

      const ensureAutocomplete = () => {
        const sourceFn = (request, response) => {
          if (!hasKnxServerSelected()) {
            response([])
            return
          }
          const serverId = resolveKnxServerValue()
          fetchGroupAddresses(serverId).then((data) => {
            if (!editorSession.active || resolveKnxServerValue() !== serverId) return
            const items = []
            data.forEach((entry) => {
              const dpt = entry.dpt || ''
              const allowed = prefixes.some((prefix) => prefix === '' || dpt.startsWith(prefix))
              if (!allowed) return
              const devName = entry.devicename || ''
              const searchStr = `${entry.ga} (${devName}) DPT${dpt}`
              if (!htmlUtilsfullCSVSearch(searchStr, request.term || '')) return
              items.push({
                label: `${entry.ga} # ${devName} # ${dpt}`,
                value: entry.ga,
                dpt
              })
            })
            response(items)
          })
        }

        if ($gaInput.data('knx-ga-initialised')) {
          $gaInput.autocomplete('option', 'source', sourceFn)
        } else {
          $gaInput
            .autocomplete({
              minLength: 0,
              source: sourceFn,
              select: (event, ui) => {
                let deviceName = ''
                try {
                  deviceName = ui.item.label.split('#')[1].trim()
                  deviceName = deviceName.replace(/^\)/, '').trim()
                } catch (error) { deviceName = '' }
                if ($nameInput.length) {
                  if (deviceName && deviceName !== '') {
                    $nameInput.val(deviceName)
                  } else if (!$nameInput.val()) {
                    $nameInput.val('')
                  }
                }
                try {
                  const parts = ui.item.label.split('#')
                  const dptFromLabel = parts.length >= 3 ? parts[2].trim() : ''
                  if (dptFromLabel !== '') {
                    $dptInput.val(dptFromLabel)
                  }
                } catch (error) { /* ignore */ }
              }
            })
            .on('focus.knxUltimateGarage click.knxUltimateGarage', function () {
              const currentValue = $(this).val() || ''
              try { $(this).autocomplete('search', `${currentValue} exactmatch`) } catch (error) { /* ignore */ }
            })
          $gaInput.data('knx-ga-initialised', true)
        }
        try {
          if (hasKnxServerSelected()) {
            const srv = RED.nodes.node(resolveKnxServerValue())
            if (srv && srv.id) KNX_enableSecureFormatting($gaInput, srv.id)
          }
        } catch (error) { /* ignore */ }
      }

      ensureAutocomplete()
    }

    const BINARY_PREFIX = ['1.']

    const refreshKnxBindings = () => {
      if (!hasKnxServerSelected()) return

      getGroupAddress('#node-input-gaCommand', '#node-input-nameCommand', '#node-input-dptCommand', BINARY_PREFIX)
      getGroupAddress('#node-input-gaImpulse', '#node-input-nameImpulse', '#node-input-dptImpulse', BINARY_PREFIX)
      getGroupAddress('#node-input-gaHoldOpen', '#node-input-nameHoldOpen', '#node-input-dptHoldOpen', BINARY_PREFIX)
      getGroupAddress('#node-input-gaDisable', '#node-input-nameDisable', '#node-input-dptDisable', BINARY_PREFIX)
      getGroupAddress('#node-input-gaPhotocell', '#node-input-namePhotocell', '#node-input-dptPhotocell', BINARY_PREFIX)
      getGroupAddress('#node-input-gaMoving', '#node-input-nameMoving', '#node-input-dptMoving', BINARY_PREFIX)
      getGroupAddress('#node-input-gaObstruction', '#node-input-nameObstruction', '#node-input-dptObstruction', BINARY_PREFIX)
    }

    $knxServerInput.off('.knxUtilityProfile').on('change.knxUtilityProfile', () => {
      KNX_GA_CACHE.clear()
      refreshKnxBindings()
    })
    if (hasKnxServerSelected()) refreshKnxBindings()

    const syncAutoClose = () => {
      const enabled = $('#node-input-autoCloseEnable').is(':checked')
      const $seconds = $('#node-input-autoCloseSeconds').closest('.form-row')
      $seconds.toggle(enabled)
    }

    $('#node-input-autoCloseEnable').on('change.knxUtilityProfile', syncAutoClose)
    syncAutoClose()
  },
  oneditcancel: function () {
    if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false
    $('#node-input-server').off('.knxUtilityProfile')
    try { RED.sidebar.show('info') } catch (error) { }
  }
})
