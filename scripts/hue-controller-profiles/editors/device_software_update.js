// Canonical private editor profile for HUE Controller: device_software_update.
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
    if ($('#knxUltimateHuedeviceSoftwareUpdateVerticalTabs').length) return
    const style = `
        <style id="knxUltimateHuedeviceSoftwareUpdateVerticalTabs">
          .hue-vertical-tabs.ui-tabs.ui-widget.ui-widget-content.ui-corner-all {
            display: flex;
            border: none;
            padding: 0;
          }
          .hue-vertical-tabs > ul.ui-tabs-nav {
            flex: 0 0 160px;
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
    $('#node-input-server').off('.knxUltimateHuedeviceSWUpdate')
    $('#node-input-serverHue').off('.knxUltimateHuedeviceSWUpdate')
    if ($deviceName) {
      $deviceName.off('.knxUltimateHuedeviceSWUpdate')
      if ($deviceName.data('ui-autocomplete')) {
        try { $deviceName.autocomplete('destroy') } catch (error) { /* empty */ }
      }
    }
    if ($refreshButton) {
      $refreshButton.off('.knxUltimateHuedeviceSWUpdate')
    }
    const $gaInput = $('#node-input-GAdevice_software_update')
    if ($gaInput.length) {
      $gaInput.off('.knxUltimateHuedeviceSWUpdate')
      if ($gaInput.data('ui-autocomplete')) {
        try { $gaInput.autocomplete('destroy') } catch (error) { /* empty */ }
      }
    }
    if ($enablePinsSelect) {
      $enablePinsSelect.off('.knxUltimateHuedeviceSWUpdate')
    }
    if ($tabs && $tabs.data('ui-tabs')) {
      try { $tabs.tabs('destroy') } catch (error) { /* empty */ }
    }
  }

  const ensureConfigSelection = (selector) => {
    const $select = $(selector)
    if (!$select.length) return
    if ($select.val() !== '_ADD_') return
    try { $select.prop('selectedIndex', 0) } catch (error) { /* empty */ }
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

  const normalizePinsValue = (value) => {
    if (value === undefined || value === null || value === '') return 'yes'
    if (value === true || value === 'true') return 'yes'
    if (value === false || value === 'false') return 'no'
    return value === 'no' ? 'no' : 'yes'
  }

  const applyNoDevicesPlaceholder = (hasDevices) => {
    if (!$deviceName) return
    const noDevicesText = RED._('node-red-contrib-knx-ultimate/knxUltimateHuedevice_software_update:knxUltimateHuedevice_software_update.no_devices')
    if (hasDevices) {
      if (showingNoDevicesPlaceholder) {
        $deviceName.attr('placeholder', defaultDevicePlaceholder)
        showingNoDevicesPlaceholder = false
      }
      return
    }
    if (!showingNoDevicesPlaceholder) {
      $deviceName.attr('placeholder', noDevicesText)
      showingNoDevicesPlaceholder = true
    }
  }

  const filterDevices = (devices, term) => {
    const cleaned = (term || '').replace(/exactmatch/gi, '').trim().toLowerCase()
    return devices
      .filter((value) => (value.name || '').toLowerCase().includes(cleaned))
      .map((value) => ({ hueDevice: value.id, value: value.name }))
  }

  const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
    if (!hueServer) {
      applyNoDevicesPlaceholder(false)
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
    $.getJSON(`KNXUltimateGetResourcesHUE?rtype=device_software_update&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
      const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : [])
      cachedDevices = listCandidates.map((value) => ({
        id: value.id || value.rid,
        name: value.name || value.metadata?.name || ''
      }))
      if (currentNode) currentNode._cachedSoftwareUpdateDevices = cachedDevices
      applyNoDevicesPlaceholder(cachedDevices.length > 0)
      response(filterDevices(cachedDevices, term))
    }).always(() => {
      if ($loadingIndicator) $loadingIndicator.hide()
    }).fail(() => {
      cachedDevices = []
      if (currentNode) currentNode._cachedSoftwareUpdateDevices = cachedDevices
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
        if (dpt.value.startsWith('1.')) {
          $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text))
        }
      })
      const target = nodeRef?.dptdevice_software_update && nodeRef.dptdevice_software_update !== ''
        ? nodeRef.dptdevice_software_update
        : ($dptSelect.children().first().attr('value') || '1.001')
      $dptSelect.val(target)
    })
  }

  const attachGroupAddressAutocomplete = () => {
    const $input = $('#node-input-GAdevice_software_update')
    const $nameWidget = $('#node-input-namedevice_software_update')
    if (!$input.length) return
    if ($input.data('ui-autocomplete')) {
      try { $input.autocomplete('destroy') } catch (error) { /* empty */ }
    }
    $input.autocomplete({
      minLength: 0,
      source (request, response) {
        const server = getKnxServer(false)
        if (!server) { response([]); return }
        $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
          const matches = []
          data.forEach((value) => {
            if (!value.dpt || !value.dpt.startsWith('1.')) return
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
    $input.on('focus.knxUltimateHuedeviceSWUpdate', function () {
      $(this).autocomplete('search', `${$(this).val()}exactmatch`)
    })
    const server = getKnxServer(false)
    if (server && server.id) {
      try { KNX_enableSecureFormatting($input, server.id) } catch (error) { /* empty */ }
    }
  }

  const updateTabsVisibility = () => {
    if (!$tabs) return
    const hueSelected = hasHueSelection()
    const knxSelected = hasKnxSelection()
    if ($requiresBridgeElems) {
      if (hueSelected) {
        $requiresBridgeElems.show()
      } else {
        $requiresBridgeElems.hide()
      }
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

  const updateKnxVisibility = () => {
    const knxSelected = hasKnxSelection()
    if ($knxSections) {
      if (knxSelected) {
        $knxSections.show()
      } else {
        $knxSections.hide()
      }
    }
    updateTabsVisibility()
  }

  const updatePinsState = () => {
    if (!$enablePinsSelect || !currentNode) return
    const val = normalizePinsValue($enablePinsSelect.val())
    currentNode.enableNodePINS = val
    currentNode.outputs = val === 'yes' ? 1 : 0
  }

  RED.nodes.registerType('knxUltimateHuedevice_software_update', {
    category: 'KNX Ultimate HUE (Legacy)',
    color: '#E7E9F6',
    defaults: {
      server: { type: 'knxUltimate-config', required: false },
      serverHue: { type: 'hue-config', required: true },
      name: { value: '' },
      namedevice_software_update: { value: '' },
      GAdevice_software_update: { value: '' },
      dptdevice_software_update: { value: '1.001' },
      readStatusAtStartup: { value: 'yes' },
      hueDevice: { value: '' },
      enableNodePINS: { value: 'yes' },
      outputs: { value: 1 }
    },
    inputs: 0,
    outputs: 1,
    icon: 'node-hue-icon.svg',
    label () {
      return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHuedevice_software_update:knxUltimateHuedevice_software_update.paletteLabel')} (deprecated)`
    },
    paletteLabel: 'Hue Software Update (deprecated)',
    oneditprepare () {
      try { RED.sidebar.show('help') } catch (error) { /* empty */ }
      const node = this
      currentNode = node

      ensureConfigSelection('#node-input-serverHue')
      ensureVerticalTabsStyle()

      $tabs = $('#hue-device-sw-tabs')
      $requiresBridgeElems = $('.hue-requires-bridge')
      $knxSections = $('.hue-knx-section')
      $deviceName = $('#node-input-name')
      $refreshButton = $('.hue-refresh-devices')
      $loadingIndicator = $('.hue-devices-loading')
      $dptSelect = $('#node-input-dptdevice_software_update')
      $readStatusSelect = $('#node-input-readStatusAtStartup')
      $enablePinsSelect = $('#node-input-enableNodePINS')
      $outputInfo = $('.hue-output-info')

      cachedDevices = Array.isArray(node._cachedSoftwareUpdateDevices) ? node._cachedSoftwareUpdateDevices : []
      node._cachedSoftwareUpdateDevices = cachedDevices

      defaultDevicePlaceholder = $deviceName.attr('placeholder') || ''
      showingNoDevicesPlaceholder = false
      applyNoDevicesPlaceholder(cachedDevices.length > 0)

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
            updateTabsVisibility()
          }
        })
        $deviceName.on('focus.knxUltimateHuedeviceSWUpdate', function () {
          $(this).autocomplete('search', `${$(this).val()}exactmatch`)
        })
      }

      if ($refreshButton) {
        $refreshButton.on('click.knxUltimateHuedeviceSWUpdate', () => {
          cachedDevices = []
          node._cachedSoftwareUpdateDevices = cachedDevices
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
        $enablePinsSelect.on('change.knxUltimateHuedeviceSWUpdate', updatePinsState)
        updatePinsState()
      }

      $('#node-input-server').on('change.knxUltimateHuedeviceSWUpdate', function () {
        const serverId = $(this).val()
        loadDPTOptions(serverId, node)
        attachGroupAddressAutocomplete()
        updateKnxVisibility()
      })

      $('#node-input-serverHue').on('change.knxUltimateHuedeviceSWUpdate', () => {
        cachedDevices = []
        node._cachedSoftwareUpdateDevices = cachedDevices
        if ($deviceName) {
          $deviceName.val('')
          $('#node-input-hueDevice').val('')
          applyNoDevicesPlaceholder(false)
        }
        updateTabsVisibility()
      })

      updateKnxVisibility()
    },
    oneditsave () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes'
      this.enableNodePINS = pinsSelection
      this.outputs = pinsSelection === 'yes' ? 1 : 0
      this._cachedSoftwareUpdateDevices = cachedDevices
      currentNode = null
    },
    oneditcancel () {
      try { RED.sidebar.show('info') } catch (error) { /* empty */ }
      detachHandlers()
      cachedDevices = []
      this._cachedSoftwareUpdateDevices = []
      currentNode = null
    }
  })
}())
