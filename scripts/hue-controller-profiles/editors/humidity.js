// Canonical private editor profile for HUE Controller: humidity.
// This source is captured into a private definition; it never registers a palette node.
(function () {
  let $tabs = null
  let $requiresBridgeElems = null
  let $knxSections = null
  let $readStatusRow = null
  let $deviceName = null
  let $refreshButton = null
  let $loadingIndicator = null
  let $dptSelect = null
  let cachedDevices = []
  let defaultDevicePlaceholder = ''
  let showingNoDevicesPlaceholder = false
  let currentNode = null
  let $outputInfo = null
  let $enablePinsSelect = null
  const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined'])

  const ensureVerticalTabsStyle = () => {
    if ($('#knxUltimateHueLightVerticalTabs').length) return
    const style = `
        <style id="knxUltimateHueLightVerticalTabs">
          .hue-vertical-tabs.ui-tabs.ui-widget.ui-widget-content.ui-corner-all {
            display: flex;
            border: none;
            padding: 0;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav {
            flex: 0 0 144px;
            border-right: 1px solid #ccc;
            border-left: none;
            border-top: none;
            border-bottom: none;
            padding: 0.5em 0.3em;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav li {
            float: none;
            width: 100%;
            margin: 0 0 2px 0;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav li a {
            display: block;
            width: 100%;
            white-space: nowrap;
            position: relative;
            border-bottom: none !important;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav li.ui-tabs-active {
            border-bottom: none !important;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav li.ui-tabs-active a::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50%;
            height: 3px;
            background: currentColor;
          }
          .hue-vertical-tabs .ui-tabs-panel {
            flex: 1;
            padding: 0.8em 1em;
            box-sizing: border-box;
            border: none;
            background: transparent;
          }
          .hue-vertical-tabs .form-row {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            gap: 4px;
          }
          .hue-vertical-tabs .form-row > dt {
            flex: 1 1 auto;
            margin: 0;
          }
          .hue-vertical-tabs hr {
            width: 100%;
            border: 0;
            border-top: 1px solid #ccc;
            margin: 8px 0;
          }
          .hue-vertical-tabs .hue-form-tip {
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            margin-left: 0 !important;
            max-width: none;
            color: #1b7d33;
            margin-bottom: 6px;
            padding: 6px 10px;
            box-sizing: border-box;
          }
          .hue-vertical-tabs .hue-form-tip .fa {
            color: forestgreen;
            flex: 0 0 auto;
          }
          .hue-vertical-tabs .hue-form-tip span {
            flex: 1 1 auto;
            min-width: 0;
            white-space: normal;
          }
        </style>`
    $('head').append(style)
  }

  const detachHandlers = () => {
    $('#node-input-server').off('.knxUltimateHueHumiditySensor')
    $('#node-input-serverHue').off('.knxUltimateHueHumiditySensor')
    $('.hue-refresh-devices').off('.knxUltimateHueHumiditySensor')
    const $gaInput = $('#node-input-GAhumiditysensor')
    $gaInput.off('.knxUltimateHueHumiditySensor')
    if ($gaInput.data('ui-autocomplete')) {
      try { $gaInput.autocomplete('destroy') } catch (error) { /* empty */ }
    }
    if ($deviceName) {
      $deviceName.off('.knxUltimateHueHumiditySensor')
      if ($deviceName.data('ui-autocomplete')) {
        try { $deviceName.autocomplete('destroy') } catch (error) { /* empty */ }
      }
    }
    if ($enablePinsSelect) {
      $enablePinsSelect.off('.knxUltimateHueHumiditySensor')
    }
  }

  const ensureConfigSelection = (selector) => {
    if ($(selector).val() !== '_ADD_') return
    try { $(selector).prop('selectedIndex', 0) } catch (error) { /* empty */ }
  }

  const resolveServerId = (value) => {
    if (value === undefined || value === null) return null
    if (value === false) return null
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed === '') return null
      if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null
      return trimmed
    }
    const asString = String(value).trim()
    if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null
    return value
  }

  const normalizePinsValue = (value) => {
    if (value === undefined || value === null || value === '') return 'no'
    if (value === true || value === 'true') return 'yes'
    if (value === false || value === 'false') return 'no'
    return value
  }

  const applyNoDevicesPlaceholder = (hasDevices) => {
    if (!$deviceName) return
    if (hasDevices) {
      if (showingNoDevicesPlaceholder) {
        showingNoDevicesPlaceholder = false
        $deviceName.attr('placeholder', defaultDevicePlaceholder)
      }
      return
    }
    const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueHumiditySensor:knxUltimateHueHumiditySensor.no_devices')
    showingNoDevicesPlaceholder = true
    $deviceName.attr('placeholder', message)
    if (($deviceName.val() || '').trim() === '') {
      $deviceName.val('')
    }
  }

  const filterDevices = (devices, term) => {
    const cleaned = (term || '').replace(/exactmatch/gi, '').trim()
    return $.map(devices, (value) => {
      const sSearch = value.name
      if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
        return {
          hueDevice: value.id,
          value: value.name,
          deviceObject: value.deviceObject || value
        }
      }
      return null
    })
  }

  const loadDPTOptions = (serverId, node) => {
    if (!$dptSelect) return
    $dptSelect.empty()
    const validId = resolveServerId(serverId)
    if (!validId) {
      return
    }
    $.getJSON(`knxUltimateDpts?serverId=${validId}`, (data) => {
      data.forEach((dpt) => {
        if (dpt.value.startsWith('9.007')) {
          $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text))
        }
      })
      const referenceNode = node || currentNode || {}
      const targetDpt = (referenceNode.dpthumiditysensor && referenceNode.dpthumiditysensor !== '') ? referenceNode.dpthumiditysensor : '9.007'
      if (targetDpt) {
        $dptSelect.val(targetDpt)
      }
    })
  }

  const hasKNXServerSelected = () => {
    let domValue = $('#node-input-server').val()
    if (domValue === undefined) {
      domValue = currentNode ? currentNode.server : null
    }
    const knxServerId = resolveServerId(domValue)
    return Boolean(knxServerId)
  }

  const getGroupAddress = ($sourceWidget, $nameWidget, $dptWidget) => {
    $sourceWidget.off('.knxUltimateHueHumiditySensor')
    $sourceWidget.autocomplete({
      minLength: 0,
      source (request, response) {
        const serverId = $('#node-input-server').val()
        const knxServerId = resolveServerId(serverId)
        if (!knxServerId) { response([]); return }
        const server = RED.nodes.node(knxServerId)
        if (!server) { response([]); return }
        $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
          response($.map(data, (value) => {
            const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`
            if (htmlUtilsfullCSVSearch(sSearch, `${request.term} 9.007`)) {
              return {
                label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                value: value.ga
              }
            }
            return null
          }))
        })
      },
      select (event, ui) {
        let sDevName = ui.item.label.split('#')[1].trim()
        try {
          sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim()
        } catch (error) { /* empty */ }
        $nameWidget.val(sDevName)
        const optVal = $dptWidget.find(`option:contains('${ui.item.label.split('#')[2].trim()}')`).attr('value')
        if (optVal !== undefined && optVal !== null) {
          $dptWidget.val(optVal).trigger('change')
        } else {
          $dptWidget.trigger('change')
        }
      }
    })
    $sourceWidget.on('focus.knxUltimateHueHumiditySensor', function () {
      $(this).autocomplete('search', `${$(this).val()}exactmatch`)
    })
    try {
      const serverId = $('#node-input-server').val()
      const server = RED.nodes.node(serverId)
      if (server && server.id) KNX_enableSecureFormatting($sourceWidget, server.id)
    } catch (error) { /* empty */ }
  }

  const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
    if (!hueServer) {
      applyNoDevicesPlaceholder(true)
      response([])
      return
    }
    if (!forceRefresh && cachedDevices.length > 0) {
      applyNoDevicesPlaceholder(cachedDevices.length > 0)
      response(filterDevices(cachedDevices, term))
      return
    }
    if ($loadingIndicator) $loadingIndicator.show()
    const refreshQuery = forceRefresh ? '&forceRefresh=1' : ''
    $.getJSON(`KNXUltimateGetResourcesHUE?rtype=humidity&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
      const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : [])
      cachedDevices = listCandidates.map((value) => {
        if (value.deviceObject) return value
        return {
          id: value.id || value.rid,
          name: value.name || value.metadata?.name || '',
          deviceObject: value
        }
      })
      if (currentNode) currentNode._cachedHumidityDevices = cachedDevices
      applyNoDevicesPlaceholder(cachedDevices.length > 0)
      response(filterDevices(cachedDevices, term))
    }).always(() => {
      if ($loadingIndicator) $loadingIndicator.hide()
    }).fail(() => {
      cachedDevices = []
      if (currentNode) currentNode._cachedHumidityDevices = cachedDevices
      applyNoDevicesPlaceholder(false)
      response([])
    })
  }

  const updateTabsVisibility = () => {
    if (!$tabs) return
    const hueServerId = resolveServerId($('#node-input-serverHue').val())
    const knxSelected = hasKNXServerSelected()
    if (hueServerId) {
      $requiresBridgeElems.show()
    } else {
      $requiresBridgeElems.hide()
    }

    if (hueServerId && knxSelected) {
      $tabs.show()
      $tabs.tabs('refresh')
    } else {
      $tabs.hide()
    }

    if ($outputInfo) {
      if (knxSelected) {
        $outputInfo.hide()
      } else {
        $outputInfo.show()
      }
    }
    if ($enablePinsSelect && $enablePinsSelect.length) {
      const desiredPins = knxSelected ? 'no' : 'yes'
      if ($enablePinsSelect.val() !== desiredPins) {
        $enablePinsSelect.val(desiredPins).trigger('change')
      }
    }
  }

  const updateKNXVisibility = () => {
    const knxSelected = hasKNXServerSelected()
    if (knxSelected) {
      $knxSections.show()
      if ($readStatusRow) $readStatusRow.show()
    } else {
      $knxSections.hide()
      if ($readStatusRow) $readStatusRow.hide()
    }
    if ($outputInfo) {
      if (knxSelected) {
        $outputInfo.hide()
      } else {
        $outputInfo.show()
      }
    }
    updateTabsVisibility()
  }

  RED.nodes.registerType('knxUltimateHueHumiditySensor', {
    category: 'KNX Ultimate HUE (Legacy)',
    color: '#E7E9F6',
    defaults: {
      server: { type: 'knxUltimate-config', required: false },
      serverHue: { type: 'hue-config', required: true },
      name: { value: '' },

      namehumiditysensor: { value: '' },
      GAhumiditysensor: { value: '' },
      dpthumiditysensor: { value: '' },
      readStatusAtStartup: { value: 'yes' },
      enableNodePINS: { value: 'yes' },

      hueDevice: { value: '' },
      outputs: { value: 1 }
    },
    inputs: 0,
    outputs: 1,
    icon: 'node-hue-icon.svg',
    label () {
      return `${this.name || 'Hue Humidity Sensor'} (deprecated)`
    },
    paletteLabel: 'Hue Humidity Sensor (deprecated)',
    oneditprepare () {
      try { RED.sidebar.show('help') } catch (error) { /* empty */ }
      const node = this
      currentNode = node

      ensureConfigSelection('#node-input-serverHue')
      ensureVerticalTabsStyle()

      $tabs = $('#tabs')
      $requiresBridgeElems = $('.hue-requires-bridge')
      $knxSections = $('.hue-knx-section')
      $readStatusRow = $('#node-input-readStatusAtStartup').closest('.form-row')
      $deviceName = $('#node-input-name')
      $refreshButton = $('.hue-refresh-devices')
      $loadingIndicator = $('.hue-devices-loading')
      $dptSelect = $('#node-input-dpthumiditysensor')
      $outputInfo = $('.hue-output-info')
      $enablePinsSelect = $('#node-input-enableNodePINS')

      cachedDevices = Array.isArray(node._cachedHumidityDevices) ? node._cachedHumidityDevices : []
      node._cachedHumidityDevices = cachedDevices

      defaultDevicePlaceholder = $deviceName.attr('placeholder') || ''
      showingNoDevicesPlaceholder = false

      $tabs.addClass('hue-vertical-tabs')
      $tabs.tabs()
      $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left')

      const initialServerDomValue = $('#node-input-server').val()
      const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue
      loadDPTOptions(initialServerId, node)

      const $gaInput = $('#node-input-GAhumiditysensor')
      const $nameInput = $('#node-input-namehumiditysensor')
      getGroupAddress($gaInput, $nameInput, $dptSelect)

      if ($deviceName) {
        $deviceName.off('.knxUltimateHueHumiditySensor')
      }
      $deviceName.autocomplete({
        minLength: 0,
        source (request, response) {
          const hueDomValue = $('#node-input-serverHue').val()
          const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue)
          const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null
          if (!hueServer) { response([]); return }
          fetchDevices(hueServer, request.term, response)
        },
        select (event, ui) {
          $('#node-input-hueDevice').val(ui.item.hueDevice)
        }
      })
      $deviceName.on('focus.knxUltimateHueHumiditySensor', function () {
        $(this).autocomplete('search', `${$(this).val()}exactmatch`)
      })

      $refreshButton.on('click.knxUltimateHueHumiditySensor', () => {
        cachedDevices = []
        node._cachedHumidityDevices = cachedDevices
        const hueDomValue = $('#node-input-serverHue').val()
        const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue)
        const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null
        if (!hueServer) return
        fetchDevices(hueServer, '', () => {
          $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`)
        }, { forceRefresh: true })
      })

      $('#node-input-server').on('change.knxUltimateHueHumiditySensor', function () {
        const serverId = $(this).val()
        loadDPTOptions(serverId, node)
        updateKNXVisibility()
      })

      $('#node-input-serverHue').on('change.knxUltimateHueHumiditySensor', function () {
        const hueServerId = resolveServerId($(this).val())
        cachedDevices = []
        node._cachedHumidityDevices = cachedDevices
        if ($loadingIndicator) $loadingIndicator.hide()
        showingNoDevicesPlaceholder = false
        $deviceName.attr('placeholder', defaultDevicePlaceholder)
        if (!hueServerId) {
          applyNoDevicesPlaceholder(true)
        }
        updateTabsVisibility()
      })

      $('#node-input-readStatusAtStartup').val(node.readStatusAtStartup || 'yes')
      if ($enablePinsSelect) {
        const initialPins = normalizePinsValue(node.enableNodePINS || 'yes')
        $enablePinsSelect.val(initialPins)
        $enablePinsSelect.on('change.knxUltimateHueHumiditySensor', function () {
          const val = normalizePinsValue($(this).val())
          node.enableNodePINS = val
          node.outputs = val === 'yes' ? 1 : 0
        })
        $enablePinsSelect.trigger('change')
      }

      updateKNXVisibility()
    },
    oneditsave () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      cachedDevices = []
      const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes'
      this.enableNodePINS = pinsSelection
      this.outputs = pinsSelection === 'yes' ? 1 : 0
      this._cachedHumidityDevices = []
      currentNode = null
    },
    oneditcancel () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      cachedDevices = []
      this._cachedHumidityDevices = []
      currentNode = null
    }
  })
}())
