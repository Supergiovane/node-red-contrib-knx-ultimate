RED.nodes.registerType('knxUltimateSceneController', {
  category: 'KNX Ultimate',
  color: '#C7E9C0',
  defaults: {
    server: { type: 'knxUltimate-config', required: true },
    name: { value: '' },
    outputtopic: { value: '' },
    topic: { value: '' },
    dpt: { value: '' },
    topicTrigger: { value: 'true' },
    topicSave: { value: '' },
    dptSave: { value: '' },
    topicSaveTrigger: { value: 'true' },

    rules: { value: [] }
  },
  inputs: 1,
  outputs: 1,
  icon: 'node-scene-icon.svg',
  label: function () {
    return (this.outputRBE == true ? '|rbe| ' : '') + (this.name || this.topic || 'KNX Scene Controller') + (this.inputRBE == true ? ' |rbe|' : '')
  },
  paletteLabel: 'KNX Scene Controller',
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

    const dptFields = []
    const dptRequests = new Map()
    const loadDptOptions = (field, savedValue, track = true) => {
      if (track) {
        dptFields.push(field)
        // Preserve persisted values even when Done is pressed before
        // the asynchronous DPT catalog has arrived.
        field.append($('<option></option>').attr('value', savedValue || '').text(savedValue || ''))
        field.val(savedValue || '')
      }
      const serverId = $('#node-input-server').val()
      if (!dptRequests.has(serverId)) {
        dptRequests.set(serverId, new Promise((resolve) => {
          profileGetJSON('knxUltimateDpts?serverId=' + encodeURIComponent(serverId || ''), resolve)
        }))
      }
      dptRequests.get(serverId).then((data) => {
        if (!editorSession.active || $('#node-input-server').val() !== serverId) return
        const selected = field.val()
        field.empty().append($('<option></option>').attr('value', '').text(''))
        const rows = Array.isArray(data) ? data : []
        rows.forEach((dpt) => field.append($('<option></option>').attr('value', dpt.value).text(dpt.text)))
        if (selected && !rows.some((dpt) => String(dpt.value) === String(selected))) {
          field.append($('<option></option>').attr('value', selected).text(selected))
        }
        field.val(selected || '')
      })
    }
    // Go to the help panel
    try {
      RED.sidebar.show('help')
    } catch (error) { }

    const node = this
    let oNodeServer = RED.nodes.node($('#node-input-server').val()) // Store the config-node

    // 19/02/2020 Used to get the server sooner als deploy.
    $('#node-input-server').off('.knxUtilityProfile').on('change.knxUtilityProfile', function () {
      try {
        oNodeServer = RED.nodes.node($(this).val())
        dptFields.forEach((field) => loadDptOptions(field, field.val(), false))
      } catch (error) { }
    })

    // DPT of Scene Recall
    // ########################
    loadDptOptions($('#node-input-dpt'), this.dpt)

    // Autocomplete suggestion with ETS csv File
    $('#node-input-topic').autocomplete({
      minLength: 0,
      source: function (request, response) {
        // profileGetJSON("csv", request, function( data, status, xhr ) {
        if (!oNodeServer || !oNodeServer.id) { response([]); return }
        profileGetJSON('knxUltimatecsv?nodeID=' + oNodeServer.id, (data) => {
          response($.map(data, function (value, key) {
            const sSearch = (value.ga + ' (' + value.devicename + ') DPT' + value.dpt)
            if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
              return {
                label: value.ga + ' # ' + value.devicename + ' # ' + value.dpt, // Label for Display
                value: value.ga // Value
              }
            } else {
              return null
            }
          }))
        })
      },
      select: function (event, ui) {
        // Sets Datapoint and device name automatically
        let sDevName = ui.item.label.split('#')[1].trim()
        try {
          sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim()
        } catch (error) {
        }
        $('#node-input-name').val('Recall: ' + sDevName + '/' + $('#node-input-name').val().split('/')[1])
        const optVal = $("#node-input-dpt option:contains('" + ui.item.label.split('#')[2].trim() + "')").attr('value')
        const $dptSelect = $('#node-input-dpt')
        if (optVal !== undefined && optVal !== null) {
          $dptSelect.val(optVal).trigger('change')
        } else {
          $dptSelect.trigger('change')
        }
      }
    }).focus(function () {
      $(this).autocomplete('search', $(this).val() + 'exactmatch')
    })
    try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting($('#node-input-topicSave'), oNodeServer.id) } catch (e) {}
    try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting($('#node-input-topic'), oNodeServer.id) } catch (e) {}

    // 19/03/2020 Adjust trigger value accordingly
    $('#node-input-dpt').on('change.knxUtilityProfile', function () {
      if ($(this).val() !== null) {
        if ($(this).val().indexOf('3.007') > -1) {
          // It's a DIM. Suggest the right value
          $('#node-input-topicTrigger').val('{decr_incr:1, data:5}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT3007'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        } else if ($(this).val().indexOf('18.001') > -1) {
          // It's a scene actuator. Suggest the right value
          $('#node-input-topicTrigger').val('{save_recall:0, scenenumber:2}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT18001'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        } else if ($(this).val().indexOf('232.600') > -1) {
          // It's a scene actuator. Suggest the right value
          $('#node-input-topicTrigger').val('{red:0, green:0, blue:0}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT232600'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        } else if ($(this).val().indexOf('251.600') > -1) {
          // It's a scene actuator. Suggest the right value
          $('#node-input-topicTrigger').val('{red:0, green:0, blue:0, white:0, mR:1, mG:1, mB:1, mW:1}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT251600'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        }
      }
    })
    // ########################

    // DPT of Scene Save
    // ########################
    loadDptOptions($('#node-input-dptSave'), this.dptSave)

    // Autocomplete suggestion with ETS csv File
    $('#node-input-topicSave').autocomplete({
      minLength: 0,
      source: function (request, response) {
        if (!oNodeServer || !oNodeServer.id) { response([]); return }
        profileGetJSON('knxUltimatecsv?nodeID=' + oNodeServer.id, (data) => {
          response($.map(data, function (value, key) {
            const sSearch = (value.ga + ' (' + value.devicename + ') DPT' + value.dpt)
            if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
              return {
                label: value.ga + ' # ' + value.devicename + ' # ' + value.dpt, // Label for Display
                value: value.ga // Value
              }
            } else {
              return null
            }
          }))
        })
      },
      select: function (event, ui) {
        // Sets Datapoint and device name automatically
        let sDevName = ui.item.label.split('#')[1].trim()
        try {
          sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim()
        } catch (error) {
        }
        $('#node-input-name').val($('#node-input-name').val().split('/')[0] + '/Save: ' + sDevName)
        const optVal = $("#node-input-dptSave option:contains('" + ui.item.label.split('#')[2].trim() + "')").attr('value')
        const $dptSelect = $('#node-input-dptSave')
        if (optVal !== undefined && optVal !== null) {
          $dptSelect.val(optVal).trigger('change')
        } else {
          $dptSelect.trigger('change')
        }
      }
    }).focus(function () {
      $(this).autocomplete('search', $(this).val() + 'exactmatch')
    })

    // 02/04/2020 Adjust trigger value accordingly
    $('#node-input-dptSave').on('change.knxUtilityProfile', function () {
      if ($(this).val() !== null) {
        if ($(this).val().indexOf('3.007') > -1) {
          // It's a DIM. Suggest the right value
          $('#node-input-topicSaveTrigger').val('{decr_incr:1, data:5}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT3007'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        } else if ($(this).val().indexOf('18.001') > -1) {
          // It's a scene actuator. Suggest the right value
          $('#node-input-topicSaveTrigger').val('{save_recall:1, scenenumber:2}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT18001'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        } else if ($(this).val().indexOf('232.600') > -1) {
          // It's a scene actuator. Suggest the right value
          $('#node-input-topicSaveTrigger').val('{red:0, green:0, blue:0}')
          var myNotification = RED.notify(node._('knxUltimateSceneController.advanced.notify-DPT232600'),
            {
              modal: true,
              fixed: true,
              type: 'info',
              buttons: [
                {
                  text: 'OK',
                  click: function (e) {
                    myNotification.close()
                  }
                }]
            })
        }
      }
    })
    // ########################

    // Scene configuration
    function resizeRule (rule) { }
    $('#node-input-rule-container').css('min-height', '150px').css('min-width', '450px').editableList({
      addItem: function (container, i, opt) { // row, index, data
        // opt.r is: { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}

        if (!opt.hasOwnProperty('r')) {
          opt.r = {}
        }
        const rule = opt.r
        if (!opt.hasOwnProperty('i')) {
          opt._i = Math.floor((0x99999 - 0x10000) * Math.random()).toString()
        }
        container.css({
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        })

        const row = $('<div class="form-row"/>').appendTo(container)
        const row2 = $('<div class="form-row"/>', { style: 'padding-top: 5px; padding-left: 5px;' }).appendTo(container)

        const oTopicField = $('<input/>', { class: 'rowRuleTopic', type: 'text', placeholder: '1/1/1, wait or device name', style: 'width:140px; margin-left: 5px; text-align: left;' }).appendTo(row)
        const oDPTField = $('<select/>', { class: 'rowRuleDPT', type: 'text', style: 'width:160px; margin-left: 5px; text-align: left;' }).appendTo(row)
        const finalspan = $('<span/>', { style: '' }).appendTo(row)
        finalspan.append(' &#8594; <span class="node-input-rule-index"></span> ')
        const oSendField = $('<input/>', { class: 'rowRuleSend', type: 'text', placeholder: 'Value', style: 'width:150px; margin-left: 5px; text-align: left;' }).appendTo(row)
        const orowRuleDeviceName = $('<input/>', { class: 'rowRuleDeviceName', type: 'text', style: 'width:95%; margin-left: 0px; text-align: left;font-style: italic;', placeholder: 'Device Name' }).appendTo(row2)

        oTopicField.on('change.knxUtilityProfile', function () {
          resizeRule(container)
        })

        loadDptOptions(oDPTField, rule.dpt)

        // Autocomplete suggestion with ETS csv File
        oTopicField.autocomplete({
          minLength: 0,
          source: function (request, response) {
            if (!oNodeServer || !oNodeServer.id) { response([]); return }
            profileGetJSON('knxUltimatecsv?nodeID=' + oNodeServer.id, (data) => {
              response($.map(data, function (value, key) {
                const sSearch = (value.ga + ' (' + value.devicename + ') DPT' + value.dpt)
                if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                  return {
                    label: value.ga + ' # ' + value.devicename + ' # ' + value.dpt, // Label for Display
                    value: value.ga // Value
                  }
                } else {
                  return null
                }
              }))
            })
          },
          select: function (event, ui) {
            // Sets Datapoint and device name automatically
            let sDevName = ui.item.label.split('#')[1].trim()
            try {
              sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim()
              orowRuleDeviceName.val(sDevName)
            } catch (error) {
            }
            const optVal = $(".rowRuleDPT option:contains('" + ui.item.label.split('#')[2].trim() + "')").attr('value')
            const $dptSelect = oDPTField
            if (optVal !== undefined && optVal !== null) {
              $dptSelect.val(optVal).trigger('change')
            } else {
              $dptSelect.trigger('change')
            }
          }
        })
        oTopicField.on('focus.knxUltimateSceneController click.knxUltimateSceneController', function () {
          try {
            $(this).autocomplete('search', '')
          } catch (error) { /* empty */ }
        })
        try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting(oTopicField, oNodeServer.id) } catch (e) {}

        oTopicField.val(rule.topic)
        oSendField.val(rule.send)
        orowRuleDeviceName.val(rule.devicename)
        oTopicField.change()
      },
      removeItem: function (opt) {
      },
      resizeItem: resizeRule,
      sortItems: function (rules) {
      },
      sortable: true,
      removable: true
    })

    // 10/03/2020 For each rule, create a row
    for (let i = 0; i < (this.rules || []).length; i++) {
      const rule = this.rules[i]
      $('#node-input-rule-container').editableList('addItem', { r: rule, i })
    }
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

    const node = this

    const rules = $('#node-input-rule-container').editableList('items')
    node.rules = []
    rules.each(function (i) {
      const rule = $(this)
      const rowRuleTopic = rule.find('.rowRuleTopic').val()
      const rowRuleDPT = rule.find('.rowRuleDPT').val()
      const rowRuleSend = rule.find('.rowRuleSend').val()
      const rowRuleDeviceName = rule.find('.rowRuleDeviceName').val()
      node.rules.push({ topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt: rowRuleDPT, send: rowRuleSend })
    })
  },
  oneditresize: function (size) {
    const list = $('#node-input-rule-container')
    const listTop = list.offset()
    const formTop = $('#dialog-form').offset()
    if (!size || !listTop || !formTop) return
    list.editableList('height', Math.max(180, size.height - (listTop.top - formTop.top) - 45))
  }
})
