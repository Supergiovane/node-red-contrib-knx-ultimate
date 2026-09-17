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

RED.nodes.registerType('knxUltimateLogger', {
  category: 'KNX Ultimate',
  color: '#C7E9C0',
  defaults: {
    server: { type: 'knxUltimate-config', required: true },
    topic: { value: '' },
    intervalCreateETSXML: { value: 15, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'autoStartTimerCreateETSXML') !== false) },
    name: { value: '' },
    autoStartTimerCreateETSXML: { value: true },
    maxRowsInETSXML: { value: 0, validate: utilityNumber(0, true) },
    saveMode: { value: 'emit' },
    filePath: { value: '' },
    autoStartTimerTelegramCounter: { value: false },
    intervalTelegramCount: { value: 60, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'autoStartTimerTelegramCounter') === true) }

  },
  inputs: 1,
  outputs: 2,
  outputLabels: ['ETS Diag file', 'Telegram Count'],
  icon: 'node-logger-icon.svg',
  label: function () {
    return ((this.name || 'KNX Logger') + ' ' + this.topic)
  },
  paletteLabel: 'KNX Logger',
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
    // Go to the help panel
    try {
      RED.sidebar.show('help')
    } catch (error) { }

    $('#mlxETSFileAccordion').accordion({
      header: 'h3',
      heightStyle: 'content',
      collapsible: true,
      active: false
    })

    const nodeId = this.id
    const resolveAdminRoot = () => {
      const raw = (RED.settings && typeof RED.settings.httpAdminRoot === 'string') ? RED.settings.httpAdminRoot : '/'
      const trimmed = String(raw || '/').trim()
      if (trimmed === '' || trimmed === '/') return ''
      return '/' + trimmed.replace(/^\/+|\/+$/g, '')
    }
    const resolveAccessToken = () => {
      try {
        const tokens = (RED.settings && typeof RED.settings.get === 'function') ? RED.settings.get('auth-tokens') : null
        const token = tokens && typeof tokens.access_token === 'string' ? tokens.access_token.trim() : ''
        return token
      } catch (error) {
        return ''
      }
    }

    const toggleFilePath = () => {
      const isEmitSave = $('#node-input-saveMode').val() === 'emit_save'
      const $filePathRow = $('#knx-logger-filePath-row')
      if (isEmitSave) {
        $filePathRow.show()
      } else {
        $filePathRow.hide()
      }
    }
    $('#node-input-saveMode').on('change.knxUtilityProfile', toggleFilePath)

    const currentFilePath = this.filePath || ''
    $('#node-input-filePath').val(currentFilePath)
    toggleFilePath()

    $('#knx-logger-downloadButton').on('click.knxUtilityProfile', function (evt) {
      evt.preventDefault()
      const filePathVal = $('#node-input-filePath').val() || ''
      if (!filePathVal) {
        try {
          const msg = (RED._ && RED._('node-red-contrib-knx-ultimate/knxUltimateLogger:knxUltimateLogger.noFilePath')) || 'File path is empty'
          RED.notify(msg, 'warning')
        } catch (error) {
          alert('File path is empty')
        }
        return
      }
      const adminRoot = resolveAdminRoot()
      const targetBase = adminRoot + '/knxUltimateUtility/logger/download'
      const params = new URLSearchParams()
      if (nodeId) params.set('nodeId', nodeId)
      params.set('_', String(Date.now()))
      const accessToken = resolveAccessToken()
      if (accessToken) params.set('access_token', accessToken)
      const target = targetBase + '?' + params.toString()
      const wnd = window.open(target, '_blank', 'noopener,noreferrer')
      try { if (wnd && typeof wnd.focus === 'function') wnd.focus() } catch (e) { }
    })
  },
  oneditcancel: function () {
    if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false
    $('#node-input-server').off('.knxUtilityProfile')
    try { RED.sidebar.show('info') } catch (error) { }
  },
  oneditsave: function () {
    // Return to the info tab
    try {
      RED.sidebar.show('info')
    } catch (error) { }

    this.filePath = $('#node-input-filePath').val() || ''
  }

})
