// Canonical private editor profile for HUE Controller: light_level.
// This source is captured into a private definition; it never registers a palette node.
(function () {
  let $tabs = null
  let $requiresBridgeElems = null
  let $knxSections = null
  let $deviceName = null
  let $refreshButton = null
  let $loadingIndicator = null
  let $dptSelect = null
  let $readStatusSelect = null
  let $enablePinsSelect = null
  let $outputInfo = null
  let cachedDevices = []
  let defaultDevicePlaceholder = ''
  let showingNoDevicesPlaceholder = false
  let currentNode = null

  const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined'])

  const ensureVerticalTabsStyle = () => {
    if ($('#knxUltimateHueLightSensorVerticalTabs').length) return
    const style = `
        <style id="knxUltimateHueLightSensorVerticalTabs">
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
    $('#node-input-server').off('.knxUltimateHueLightSensor')
    $('#node-input-serverHue').off('.knxUltimateHueLightSensor')
    if ($deviceName) {
      $deviceName.off('.knxUltimateHueLightSensor')
      if ($deviceName.data('ui-autocomplete')) {
        try { $deviceName.autocomplete('destroy') } catch (error) { /* empty */ }
      }
    }
    if ($refreshButton) $refreshButton.off('.knxUltimateHueLightSensor')
    const $gaInput = $('#node-input-GAlightsensor')
    if ($gaInput.length && $gaInput.data('ui-autocomplete')) {
      try { $gaInput.autocomplete('destroy') } catch (error) { /* empty */ }
    }
    if ($enablePinsSelect) $enablePinsSelect.off('.knxUltimateHueLightSensor')
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
    if (value === undefined || value === null || value === '') return 'yes'
    if (value === true || value === 'true') return 'yes'
    if (value === false || value === 'false') return 'no'
    return value
  }

  const getKnxServer = (allowFallback = true) => {
    const resolved = resolveServerId($('#node-input-server').val())
    if (resolved) return RED.nodes.node(resolved)
    if (!allowFallback) return null
    const fallback = resolveServerId(currentNode ? currentNode.server : null)
    return fallback ? RED.nodes.node(fallback) : null
  }

  const getHueServer = (allowFallback = true) => {
    const resolved = resolveServerId($('#node-input-serverHue').val())
    if (resolved) return RED.nodes.node(resolved)
    if (!allowFallback) return null
    const fallback = resolveServerId(currentNode ? currentNode.serverHue : null)
    return fallback ? RED.nodes.node(fallback) : null
  }

  const hasKnxSelection = () => {
    const resolved = resolveServerId($('#node-input-server').val())
    if (resolved) return true
    if ($('#node-input-server').length) return false
    return resolveServerId(currentNode ? currentNode.server : null) !== null
  }

  const hasHueSelection = () => {
    const resolved = resolveServerId($('#node-input-serverHue').val())
    if (resolved) return true
    if ($('#node-input-serverHue').length) return false
    return resolveServerId(currentNode ? currentNode.serverHue : null) !== null
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
    const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueLightSensor:knxUltimateHueLightSensor.no_devices')
    showingNoDevicesPlaceholder = true
    $deviceName.attr('placeholder', message)
    if (($deviceName.val() || '').trim() === '') $deviceName.val('')
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
    $.getJSON(`KNXUltimateGetResourcesHUE?rtype=light_level&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
      const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : [])
      cachedDevices = listCandidates.map((value) => ({
        id: value.id || value.rid,
        name: value.name || value.metadata?.name || '',
        deviceObject: value.deviceObject || value
      }))
      if (currentNode) currentNode._cachedLightDevices = cachedDevices
      applyNoDevicesPlaceholder(cachedDevices.length > 0)
      response(filterDevices(cachedDevices, term))
    }).always(() => {
      if ($loadingIndicator) $loadingIndicator.hide()
    }).fail(() => {
      cachedDevices = []
      if (currentNode) currentNode._cachedLightDevices = cachedDevices
      applyNoDevicesPlaceholder(false)
      response([])
    })
  }

  const loadDPTOptions = (serverCandidate, nodeRef) => {
    if (!$dptSelect) return
    $dptSelect.empty()
    const server = (() => {
      const resolved = resolveServerId(serverCandidate)
      if (resolved) return RED.nodes.node(resolved)
      return getKnxServer(false)
    })()
    if (!server) return
    $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
      data.forEach((dpt) => {
        if (dpt.value.startsWith('9.004')) {
          $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text))
        }
      })
      const referenceNode = nodeRef || currentNode || {}
      const targetDpt = referenceNode.dptlightsensor || '9.004'
      if ($dptSelect.children().length) $dptSelect.val(targetDpt)
    })
  }

  const attachGroupAddressAutocomplete = () => {
    const $input = $('#node-input-GAlightsensor')
    const $nameWidget = $('#node-input-namelightsensor')
    if (!$input.length) return
    $input.autocomplete({
      minLength: 0,
      source (request, response) {
        const server = getKnxServer(false)
        if (!server) { response([]); return }
        $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
          const matches = []
          data.forEach((value) => {
            if (!value.dpt || !value.dpt.startsWith('9.004')) return
            const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`
            if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
              matches.push({
                label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                value: value.ga
              })
            }
          })
          response(matches)
        })
      },
      select (event, ui) {
        let sDevName = ui.item.label.split('#')[1]?.trim() || ''
        try {
          sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim()
        } catch (error) { /* empty */ }
        if ($nameWidget) $nameWidget.val(sDevName)
        const dptLabel = ui.item.label.split('#')[2]?.trim()
        const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined
        if (optVal !== undefined && optVal !== null) {
          $dptSelect.val(optVal).trigger('change')
        } else {
          $dptSelect.trigger('change')
        }
      }
    })
    $input.on('focus.knxUltimateHueLightSensor', function () {
      $(this).autocomplete('search', `${$(this).val()}exactmatch`)
    })
    const server = getKnxServer(false)
    if (server && server.id) KNX_enableSecureFormatting($input, server.id)
  }

  const updateKnxVisibility = () => {
    const knxSelected = hasKnxSelection()
    if (knxSelected) {
      $knxSections.show()
    } else {
      $knxSections.hide()
    }
    updateTabsVisibility()
  }

  const updateTabsVisibility = () => {
    if (!$tabs) return
    const hueSelected = hasHueSelection()
    const knxSelected = hasKnxSelection()
    if (hueSelected) {
      $requiresBridgeElems.show()
    } else {
      $requiresBridgeElems.hide()
    }
    if (hueSelected && knxSelected) {
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

  const updatePinsState = () => {
    if (!$enablePinsSelect || !currentNode) return
    const val = normalizePinsValue($enablePinsSelect.val())
    currentNode.enableNodePINS = val
    currentNode.outputs = val === 'yes' ? 1 : 0
  }

  RED.nodes.registerType('knxUltimateHueLightSensor', {
    category: 'KNX Ultimate HUE (Legacy)',
    color: '#E7E9F6',
    defaults: {
      server: { type: 'knxUltimate-config', required: false },
      serverHue: { type: 'hue-config', required: true },
      name: { value: '' },
      namelightsensor: { value: '' },
      GAlightsensor: { value: '' },
      dptlightsensor: { value: '9.004' },
      readStatusAtStartup: { value: 'yes' },
      enableNodePINS: { value: 'yes' },
      hueDevice: { value: '' },
      outputs: { value: 1 }
    },
    inputs: 0,
    outputs: 1,
    icon: 'node-hue-icon.svg',
    label () {
      return `${this.name || 'Hue Light Sensor'} (deprecated)`
    },
    paletteLabel: 'Hue Light Sensor (deprecated)',
    oneditprepare () {
      try { RED.sidebar.show('help') } catch (error) { /* empty */ }
      const node = this
      currentNode = node

      ensureConfigSelection('#node-input-serverHue')
      ensureVerticalTabsStyle()

      $tabs = $('#hue-light-sensor-tabs')
      $requiresBridgeElems = $('.hue-requires-bridge')
      $knxSections = $('.hue-knx-section')
      $deviceName = $('#node-input-name')
      $refreshButton = $('.hue-refresh-devices')
      $loadingIndicator = $('.hue-devices-loading')
      $dptSelect = $('#node-input-dptlightsensor')
      $readStatusSelect = $('#node-input-readStatusAtStartup')
      $enablePinsSelect = $('#node-input-enableNodePINS')
      $outputInfo = $('.hue-output-info')

      cachedDevices = Array.isArray(node._cachedLightDevices) ? node._cachedLightDevices : []
      node._cachedLightDevices = cachedDevices

      defaultDevicePlaceholder = $deviceName.attr('placeholder') || ''
      showingNoDevicesPlaceholder = false

      $tabs.addClass('hue-vertical-tabs')
      $tabs.tabs()
      $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left')

      const initialServerDomValue = $('#node-input-server').val()
      const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue
      loadDPTOptions(initialServerId, node)

      attachGroupAddressAutocomplete()

      if ($deviceName) {
        $deviceName.autocomplete({
          minLength: 0,
          source (request, response) {
            const hueServer = getHueServer(false)
            if (!hueServer) { response([]); return }
            fetchDevices(hueServer, request.term, response)
          },
          select (event, ui) {
            $('#node-input-hueDevice').val(ui.item.hueDevice)
          }
        })
        $deviceName.on('focus.knxUltimateHueLightSensor', function () {
          $(this).autocomplete('search', `${$(this).val()}exactmatch`)
        })
      }

      if ($refreshButton) {
        $refreshButton.on('click.knxUltimateHueLightSensor', () => {
          cachedDevices = []
          node._cachedLightDevices = cachedDevices
          const hueServer = getHueServer(false)
          if (!hueServer) return
          fetchDevices(hueServer, '', () => {
            if ($deviceName) {
              $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`)
            }
          }, { forceRefresh: true })
        })
      }

      if ($readStatusSelect) {
        $readStatusSelect.val(node.readStatusAtStartup || 'yes')
      }

      if ($enablePinsSelect) {
        $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS))
        $enablePinsSelect.on('change.knxUltimateHueLightSensor', updatePinsState)
        updatePinsState()
      }

      $('#node-input-server').on('change.knxUltimateHueLightSensor', function () {
        const serverId = $(this).val()
        loadDPTOptions(serverId, node)
        attachGroupAddressAutocomplete()
        updateKnxVisibility()
      })

      $('#node-input-serverHue').on('change.knxUltimateHueLightSensor', function () {
        cachedDevices = []
        node._cachedLightDevices = cachedDevices
        if ($loadingIndicator) $loadingIndicator.hide()
        showingNoDevicesPlaceholder = false
        if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder)
        if (!hasHueSelection()) {
          applyNoDevicesPlaceholder(true)
        }
        updateTabsVisibility()
      })

      updateKnxVisibility()
    },
    oneditsave () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      cachedDevices = []
      const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes'
      this.enableNodePINS = pinsSelection
      this.outputs = pinsSelection === 'yes' ? 1 : 0
      this._cachedLightDevices = []
      currentNode = null
    },
    oneditcancel () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      cachedDevices = []
      this._cachedLightDevices = []
      currentNode = null
    }
  })
}())
