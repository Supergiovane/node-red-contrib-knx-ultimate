/* global RED, $, htmlUtilsfullCSVSearch */
(function () {
  const MATTER_COLOR = '#8FE3D4'

  function ensureConfigSelection (selector) {
    if ($(selector).val() !== '_ADD_') return
    try { $(selector).prop('selectedIndex', 0) } catch (error) { }
  }

  function serverValue (selector, fallback) {
    const domValue = $(selector).val()
    if (domValue !== undefined && domValue !== null && domValue !== '' && domValue !== '_ADD_') return domValue
    return fallback || ''
  }

  function getJSONPromise (url) {
    return new Promise((resolve, reject) => { $.getJSON(url, resolve).fail(reject) })
  }

  function matterEndpointLabel (ep) {
    let val = null;
    (ep.clusters || []).forEach((c) => {
      (c.attributes || []).forEach((a) => {
        if (val === null && a.name === 'nodeLabel' && a.value != null && String(a.value).trim() !== '') val = String(a.value).trim()
      })
    })
    if (val === null) {
      (ep.clusters || []).forEach((c) => {
        (c.attributes || []).forEach((a) => {
          if (val === null && a.name === 'productLabel' && a.value != null && String(a.value).trim() !== '') val = String(a.value).trim()
        })
      })
    }
    return val
  }

  function prettyType (raw) {
    const key = String(raw || '').replace(/^ma-/i, '').replace(/([a-z])([A-Z])/g, '$1 $2')
    return key || 'Endpoint'
  }

  function endpointMatches (ep, spec) {
    const cluster = (ep.clusters || []).find((c) => Number(c.id) === Number(spec.clusterId))
    if (!cluster) return false
    if (!spec.attributeName) return true
    return (cluster.attributes || []).some((a) => a.name === spec.attributeName)
  }

  function buildDeviceItems (matterServerId, spec, node, respond, forceRefresh) {
    if (!matterServerId) {
      respond([])
      return
    }
    if (!forceRefresh && Array.isArray(node._cachedMatterDevices) && node._cachedMatterDevices.length > 0) {
      respond(node._cachedMatterDevices)
      return
    }
    getJSONPromise(`KNXUltimateMatterGetNodes?serverId=${encodeURIComponent(matterServerId)}&_=${Date.now()}`)
      .then((data) => {
        const devices = (data && Array.isArray(data.devices)) ? data.devices : []
        return Promise.all(devices.map((device) =>
          getJSONPromise(`KNXUltimateMatterGetStructure?serverId=${encodeURIComponent(matterServerId)}&nodeId=${encodeURIComponent(device.nodeId)}&_=${Date.now()}`)
            .then((structure) => ({ device, endpoints: (structure && Array.isArray(structure.endpoints)) ? structure.endpoints : [] }))
            .catch(() => ({ device, endpoints: [] }))
        ))
      })
      .then((results) => {
        const items = []
        results.forEach((entry) => {
          const eps = entry.endpoints.filter((ep) => Number(ep.endpointId) !== 0 && endpointMatches(ep, spec))
          const many = eps.length > 1
          eps.forEach((ep) => {
            const label = matterEndpointLabel(ep)
            const typeRaw = (Array.isArray(ep.deviceTypes) && ep.deviceTypes.length) ? ep.deviceTypes[0] : ep.name
            let text
            if (label) text = entry.device.name + ' > ' + label
            else if (many) text = entry.device.name + ' > ' + prettyType(typeRaw) + ' ' + ep.endpointId
            else text = entry.device.name + ' (' + prettyType(typeRaw) + ')'
            items.push({
              value: text,
              matterNodeId: String(entry.device.nodeId),
              matterEndpointId: String(ep.endpointId)
            })
          })
        })
        node._cachedMatterDevices = items
        respond(items)
      })
      .catch(() => {
        node._cachedMatterDevices = []
        respond([])
      })
  }

  function setupKnxAutocomplete (node, gaSelector, nameSelector, dptSelector, dptPrefixes) {
    const $ga = $(gaSelector)
    const $dpt = $(dptSelector)
    const knxServerId = () => serverValue('#node-input-server', node.server)
    const allowedDptValues = () => {
      const selected = $dpt.val()
      if (selected !== undefined && selected !== null && selected !== '') return [String(selected)]
      return dptPrefixes
    }
    const refreshDpt = () => {
      $dpt.empty()
      const serverId = knxServerId()
      if (!serverId) return
      $.getJSON(`knxUltimateDpts?serverId=${encodeURIComponent(serverId)}&_=${Date.now()}`, (data) => {
        data.forEach((dpt) => {
          if (dptPrefixes.some((prefix) => dpt.value.startsWith(prefix))) {
            $dpt.append($('<option></option>').attr('value', dpt.value).text(dpt.text))
          }
        })
        const stored = node[$dpt.attr('id').replace('node-input-', '')]
        if (stored) $dpt.val(stored)
      })
    }
    refreshDpt()
    $('#node-input-server').on('change.knxUltimateMatterSimple', refreshDpt)
    $ga.autocomplete({
      minLength: 0,
      source (request, response) {
        const serverId = knxServerId()
        if (!serverId) {
          response([])
          return
        }
        $.getJSON(`knxUltimatecsv?nodeID=${encodeURIComponent(serverId)}&_=${Date.now()}`, (data) => {
          const allowed = allowedDptValues()
          response($.map(data, (value) => {
            if (!value.dpt || !allowed.some((prefix) => value.dpt.startsWith(prefix))) return null
            const search = value.ga + ' ' + value.devicename + ' DPT' + value.dpt
            if (!htmlUtilsfullCSVSearch(search, request.term)) return null
            return {
              label: value.ga + ' # ' + value.devicename + ' # ' + value.dpt,
              value: value.ga
            }
          }))
        })
      },
      select (event, ui) {
        const parts = ui.item.label.split('#')
        if (parts[1]) $(nameSelector).val(parts[1].trim())
        if (parts[2]) {
          const wanted = parts[2].trim()
          const optVal = $dpt.find(`option:contains("${wanted}")`).attr('value')
          if (optVal) $dpt.val(optVal)
        }
      }
    }).focus(function () {
      $(this).autocomplete('search', $(this).val())
    })
  }

  function setupMatterDevicePicker (node, spec) {
    const $name = $('#node-input-matterDeviceName')
    const $nodeId = $('#node-input-matterNodeId')
    const $endpointId = $('#node-input-matterEndpointId')
    const currentNodeId = node.matterNodeId || $nodeId.val()
    const currentEndpointId = node.matterEndpointId || $endpointId.val()
    if (($nodeId.val() || '') === '' && currentNodeId) $nodeId.val(currentNodeId)
    if (($endpointId.val() || '') === '' && currentEndpointId) $endpointId.val(currentEndpointId)
    if (($name.val() || '').trim() === '' && node.matterDeviceName) $name.val(node.matterDeviceName)
    if (($name.val() || '').trim() === '' && currentNodeId) $name.val(`Node ${currentNodeId} EP ${currentEndpointId || 1}`)
    let selectedName = ($name.val() || '').trim()
    const source = (request, response) => {
      const matterServerId = serverValue('#node-input-serverMatter', node.serverMatter)
      buildDeviceItems(matterServerId, spec, node, (items) => {
        const cleaned = (request.term || '').replace(/exactmatch/gi, '').trim()
        response($.map(items, (item) => {
          if (cleaned !== '' && !htmlUtilsfullCSVSearch(item.value, cleaned)) return null
          return item
        }))
      }, false)
    }
    $name.autocomplete({
      minLength: 0,
      source,
      select (event, ui) {
        if (!ui.item || !ui.item.matterNodeId) {
          event.preventDefault()
          return
        }
        selectedName = ui.item.value || ''
        $name.val(selectedName)
        $('#node-input-name').val(selectedName)
        $nodeId.val(ui.item.matterNodeId)
        $endpointId.val(ui.item.matterEndpointId)
      },
      focus (event) {
        event.preventDefault()
      }
    }).focus(function () {
      $(this).autocomplete('search', `${$(this).val()}exactmatch`)
    }).on('input.knxUltimateMatterSimple', function () {
      const typed = $(this).val().trim()
      if (typed === '' || typed !== selectedName) {
        $nodeId.val('')
        $endpointId.val('')
      }
    })
    $('.matter-refresh-devices').on('click.knxUltimateMatterSimple', () => {
      const matterServerId = serverValue('#node-input-serverMatter', node.serverMatter)
      node._cachedMatterDevices = []
      buildDeviceItems(matterServerId, spec, node, () => {
        $name.autocomplete('search', `${$name.val()}exactmatch`)
      }, true)
    })
    $('#node-input-serverMatter').on('change.knxUltimateMatterSimple', () => {
      node._cachedMatterDevices = []
      $nodeId.val('')
      $endpointId.val('')
    })
  }

  function sensorTemplate (spec) {
    return function () {
      try { RED.sidebar.show('help') } catch (error) { }
      const node = this
      ensureConfigSelection('#node-input-serverMatter')
      setupMatterDevicePicker(node, spec)
      setupKnxAutocomplete(node, '#node-input-ga', '#node-input-gaName', '#node-input-dpt', spec.dptPrefixes || [spec.defaultDpt.split('.')[0] + '.'])
      $('#node-input-enableNodePINS').on('change.knxUltimateMatterSimple', function () {
        const enabled = $(this).val() === 'yes'
        node.outputs = enabled ? 1 : 0
      })
    }
  }

  function plugTemplate () {
    return function () {
      try { RED.sidebar.show('help') } catch (error) { }
      const node = this
      ensureConfigSelection('#node-input-serverMatter')
      setupMatterDevicePicker(node, { clusterId: 6 })
      setupKnxAutocomplete(node, '#node-input-GAPlugSwitch', '#node-input-namePlugSwitch', '#node-input-dptPlugSwitch', ['1.'])
      setupKnxAutocomplete(node, '#node-input-GAPlugState', '#node-input-namePlugState', '#node-input-dptPlugState', ['1.'])
      $('#node-input-enableNodePINS').on('change.knxUltimateMatterSimple', function () {
        const enabled = $(this).val() === 'yes'
        node.inputs = enabled ? 1 : 0
        node.outputs = enabled ? 1 : 0
      })
    }
  }

  function registerSensor (config) {
    RED.nodes.registerType(config.type, {
      category: 'KNX Ultimate Matter',
      color: MATTER_COLOR,
      defaults: {
        server: { type: 'knxUltimate-config', required: false },
        serverMatter: { type: 'matter-config', required: true },
        name: { value: '' },
        matterDeviceName: { value: '' },
        matterNodeId: { value: '' },
        matterEndpointId: { value: 1 },
        ga: { value: '' },
        dpt: { value: config.defaultDpt },
        gaName: { value: '' },
        readStatusAtStartup: { value: 'yes' },
        enableNodePINS: { value: 'yes' },
        outputs: { value: 1 },
        inputs: { value: 0 }
      },
      inputs: 0,
      outputs: 1,
      icon: 'node-matter-icon.svg',
      label () {
        return this.name || this.matterDeviceName || config.paletteLabel
      },
      paletteLabel: config.paletteLabel,
      oneditprepare: sensorTemplate(config),
      oneditsave () {
        this.matterDeviceName = ($('#node-input-matterDeviceName').val() || '').trim()
        this.matterNodeId = ($('#node-input-matterNodeId').val() || '').trim()
        this.matterEndpointId = Number($('#node-input-matterEndpointId').val() || 1)
        this.name = this.matterDeviceName || this.name || ''
        $('#node-input-name').val(this.name)
        this.outputs = $('#node-input-enableNodePINS').val() === 'yes' ? 1 : 0
      }
    })
  }

  function registerPlug (config) {
    RED.nodes.registerType(config.type, {
      category: 'KNX Ultimate Matter',
      color: MATTER_COLOR,
      defaults: {
        server: { type: 'knxUltimate-config', required: false },
        serverMatter: { type: 'matter-config', required: true },
        name: { value: '' },
        matterDeviceName: { value: '' },
        matterNodeId: { value: '' },
        matterEndpointId: { value: 1 },
        namePlugSwitch: { value: '' },
        GAPlugSwitch: { value: '' },
        dptPlugSwitch: { value: '1.001' },
        namePlugState: { value: '' },
        GAPlugState: { value: '' },
        dptPlugState: { value: '1.001' },
        readStatusAtStartup: { value: 'yes' },
        enableNodePINS: { value: 'no' },
        outputs: { value: 0 },
        inputs: { value: 0 }
      },
      inputs: 0,
      outputs: 0,
      icon: 'node-matter-icon.svg',
      label () {
        return this.name || this.matterDeviceName || config.paletteLabel
      },
      paletteLabel: config.paletteLabel,
      oneditprepare: plugTemplate(),
      oneditsave () {
        this.matterDeviceName = ($('#node-input-matterDeviceName').val() || '').trim()
        this.matterNodeId = ($('#node-input-matterNodeId').val() || '').trim()
        this.matterEndpointId = Number($('#node-input-matterEndpointId').val() || 1)
        this.name = this.matterDeviceName || this.name || ''
        $('#node-input-name').val(this.name)
        const enabled = $('#node-input-enableNodePINS').val() === 'yes'
        this.inputs = enabled ? 1 : 0
        this.outputs = enabled ? 1 : 0
      }
    })
  }

  window.KNXUltimateMatterSimpleEditor = { registerSensor, registerPlug }
}())
