/* eslint-disable */
// GENERATED FILE — do not edit directly.
// Canonical sources: scripts/knx-utility-profiles/
// Rebuild with: npm run knx-utility:generate
//
// This bundle is deliberately self-contained. It does not import, query or
// require any deprecated KNX node, editor template or localization namespace.
(function (root, factory) {
  // UMD-style export: Node-RED receives the browser global, while unit tests can
  // require the same artifact through CommonJS without maintaining a test copy.
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateUtilityProfiles = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  // Values on the left are persisted in utilityType. Values on the
  // right are private editor/translation namespace identifiers, not registry
  // lookups. Keeping them preserves all existing field and i18n contracts.
  const PROFILE_TYPES = Object.freeze(  {
    "alerter": "knxUltimateAlerter",
    "autoresponder": "knxUltimateAutoResponder",
    "datetime": "knxUltimateDateTime",
    "watchdog": "knxUltimateWatchDog",
    "globalcontext": "knxUltimateGlobalContext",
    "logger": "knxUltimateLogger",
    "staircase": "knxUltimateStaircase",
    "garage": "knxUltimateGarage",
    "scenecontroller": "knxUltimateSceneController",
    "loadcontrol": "knxUltimateLoadControl",
    "hatranslator": "knxUltimateHATranslator"
  })

  // Factories are the private copies of the mature editor definitions. They are
  // inert until getDefinition() asks for one of them.
  const PROFILE_FACTORIES = {
    "alerter": function (RED) {
      RED.nodes.registerType('knxUltimateAlerter', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: false },
                  name: { value: "" },
                  rules: { value: [] },
                  whentostart: { value: "ifnewalert" },
                  timerinterval: { value: "2" },
                  initialreadGAInRules: { value: "1" },
              },
              inputs: 1,
              outputs: 3,
              outputLabels: function (index) {
                  if (index === 0) return "Emits a message for each alerted device, at selectable intervals.";
                  if (index === 1) return "Emits a unique message containing all alerted devices.";
                  if (index === 2) return "Emits a message containing only the last alerted device.";
              },
              icon: "node-alerter-icon.svg",
              label: function () {
                  return (this.outputRBE == true ? "|rbe| " : "") + (this.name || this.topic || "KNX Alerter") + (this.inputRBE == true ? " |rbe|" : "")
              },
              paletteLabel: "KNX Alerter",
              oneditprepare: function () {
                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }

                  var node = this;
                  var oNodeServer = RED.nodes.node($("#node-input-server").val()); // Store the config-node

                  // 19/02/2020 Used to get the server sooner als deploy.
                  $("#node-input-server").off('.knxUtilityProfile').on('change.knxUtilityProfile', function () {
                      try {
                          oNodeServer = RED.nodes.node($(this).val());
                      } catch (error) { }
                  });




                  // Scene configuration
                  function resizeRule(rule) {

                  }
                  $("#node-input-rule-container").css('min-height', '350px').css('min-width', '450px').editableList({
                      addItem: function (container, i, opt) { // row, index, data

                          // opt.r is: { topic: rowRuleTopic, devicename: rowRuleDeviceName, longdevicename: rowRuleLongDeviceName}

                          var rule = opt.r || { topic: '', devicename: '', longdevicename: '' };
                          if (!opt.hasOwnProperty('i')) {
                              opt._i = Math.floor((0x99999 - 0x10000) * Math.random()).toString();
                          }
                          container.css({
                              overflow: 'hidden',
                              whiteSpace: 'nowrap'
                          });
                          var row = $('<div class="form-row"/>').appendTo(container);

                          var oTopicField = $("<input/>", { class: "rowRuleTopic", type: "text", placeholder: "GA or devicename", style: "width:20%; margin-left: 5px; text-align: left;" }).appendTo(row);
                          var finalspan = $('<span/>', { style: "" }).appendTo(row);
                          finalspan.append(' <span class="node-input-rule-index"></span> ');
                          var orowRuleDeviceName = $('<input/>', { maxlength: "14", class: "rowRuleDeviceName", type: "text", style: "width:30%; margin-left: 0px; text-align: left;font-style: italic;", placeholder: "Name (max 14 chars)" }).appendTo(row);
                          var orowRuleLongDeviceName = $('<input/>', { class: "rowRuleLongDeviceName", type: "text", style: "width:45%; margin-left: 0px; text-align: left;", placeholder: "Long name" }).appendTo(row);

                          oTopicField.on("change", function () {
                              resizeRule(container);
                          });


                          // Autocomplete suggestion with ETS csv File
                          oTopicField.autocomplete({
                              minLength: 0,
                              source: function (request, response) {
                                  if (!oNodeServer || !oNodeServer.id) { response([]); return; }
                                  $.getJSON("knxUltimatecsv?nodeID=" + oNodeServer.id, (data) => {
                                      response($.map(data, function (value, key) {
                                          var sSearch = (value.ga + " (" + value.devicename + ") DPT" + value.dpt);
                                          if (htmlUtilsfullCSVSearch(sSearch, request.term + " 1.")) {
                                              return {
                                                  label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                                                  value: value.ga // Value
                                              }
                                          } else {
                                              return null;
                                          }
                                      }));
                                  });
                              }, select: function (event, ui) {
                                  // Sets Datapoint and device name automatically
                                  var sDevName = ui.item.label.split("#")[1].trim();
                                  try {
                                      sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                                      orowRuleDeviceName.val(sDevName.substr(0, 14));
                                      orowRuleLongDeviceName.val(sDevName);
                                  } catch (error) {
                                  }

                              }
                          });
                          oTopicField.on('focus.knxUltimateAlerter click.knxUltimateAlerter', function () {
                              try {
                                  $(this).autocomplete('search', '');
                              } catch (error) { /* empty */ }
                          });
                          try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting(oTopicField, oNodeServer.id); } catch (e) {}

                          oTopicField.val(rule.topic);
                          orowRuleDeviceName.val(rule.devicename);
                          orowRuleLongDeviceName.val(rule.longdevicename);
                          oTopicField.change();

                      },
                      removeItem: function (opt) {

                      },
                      resizeItem: resizeRule,
                      sortItems: function (rules) {
                      },
                      sortable: true,
                      removable: true
                  });

                  // 10/03/2020 For each rule, create a row
                  for (var i = 0; i < (this.rules || []).length; i++) {
                      var rule = this.rules[i];
                      $("#node-input-rule-container").editableList('addItem', { r: rule, i: i });
                  }


              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }

                  var node = this;

                  var rules = $("#node-input-rule-container").editableList('items');
                  node.rules = [];
                  rules.each(function (i) {
                      var rule = $(this);
                      var rowRuleTopic = rule.find(".rowRuleTopic").val();
                      var rowRuleDeviceName = rule.find(".rowRuleDeviceName").val();
                      var rowRuleLongDeviceName = rule.find(".rowRuleLongDeviceName").val();
                      node.rules.push({ topic: rowRuleTopic, devicename: rowRuleDeviceName, longdevicename: rowRuleLongDeviceName });
                  });
              },
              oneditcancel: function () {
                  $("#node-input-server").off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              },
              oneditresize: function (size) {
                  const list = $("#node-input-rule-container");
                  const form = $('#dialog-form');
                  const listTop = list.offset();
                  const formTop = form.offset();
                  if (!size || !listTop || !formTop) return;
                  // The fragment is nested in Utility, so measure the actual list
                  // offset instead of assuming it is a direct child of dialog-form.
                  list.editableList('height', Math.max(180, size.height - (listTop.top - formTop.top) - 45));
              }
          })
    },
    "autoresponder": function (RED) {
      RED.nodes.registerType('knxUltimateAutoResponder', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: true },
                  name: { value: "Auto responder", required: false },
                  commandText: {
                      value: '[]', required: false,
                      validate: function (value) {
                          try {
                              const entries = JSON.parse(value);
                              return Array.isArray(entries) && entries.every((entry) => (
                                  entry && typeof entry === 'object' &&
                                  typeof entry.ga === 'string' && entry.ga.trim() !== '' &&
                                  Object.prototype.hasOwnProperty.call(entry, 'default')
                              ));
                          } catch (error) { return false; }
                      }
                  }
              },
              inputs: 0,
              outputs: 0,
              icon: "node-knx-icon.svg",
              label: function () {
                  return (this.name || "KNX Auto Responder");
              },
              paletteLabel: "KNX Auto Responder",
      	        oneditprepare: function () {
      	            // Go to the help panel
      	            try {
      	                RED.sidebar.show("help");
      	            } catch (error) { }

      	            var node = this;

      	            $("#node-input-commandText").typedInput({
      	                type: "json",
      	                types: ["json"]
      	            })

      	            try {
      	                if (node.commandText !== undefined) {
      	                    $("#node-input-commandText").typedInput('value', node.commandText)
      	                }
      	            } catch (error) { }

      	        },
      	        oneditsave: function () {
      	            // Return to the info tab
      	            try {
      	                RED.sidebar.show("info");
      	            } catch (error) { }

      	            try {
      	                this.commandText = $("#node-input-commandText").typedInput('value')
      	            } catch (error) { }

      	        },
              oneditcancel: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }


              }
          })
    },
    "datetime": function (RED) {
      const KNX_ULTIMATE_DATETIME_KEYWORDS = {
          datetime: [/date\s*\/\s*time/i, /date\s*time/i, /datetime/i, /data\s*\/\s*ora/i, /data\s*ora/i],
          date: [/\bdate\b/i, /\bdata\b/i, /\bdatum\b/i, /\bfecha\b/i],
          time: [/\btime\b/i, /\bora\b/i, /\bheure\b/i, /\bzeit\b/i, /\bhora\b/i, /\borologio\b/i, /\bclock\b/i]
        }

        const KNX_ULTIMATE_DATETIME_STOPWORDS = new Set([
          'date', 'datetime', 'time', 'data', 'ora', 'orologio', 'clock', 'bus', 'knx', 'set', 'sync', 'sincro', 'synchronization'
        ])

        const knxDateTimeNormalizeTokens = (value) => {
          const str = (value || '').toString().toLowerCase()
          const cleaned = str
            .replace(/dpt\s*\d+(\.\d+)?/g, ' ')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
          if (!cleaned) return []
          return cleaned
            .split(/\s+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 1 && !KNX_ULTIMATE_DATETIME_STOPWORDS.has(t))
        }

        const knxDateTimeTokenSimilarity = (aTokens, bTokens) => {
          if (!Array.isArray(aTokens) || !Array.isArray(bTokens) || aTokens.length === 0 || bTokens.length === 0) return 0
          const a = new Set(aTokens)
          const b = new Set(bTokens)
          let inter = 0
          a.forEach((t) => { if (b.has(t)) inter += 1 })
          const union = a.size + b.size - inter
          return union > 0 ? inter / union : 0
        }

        const knxDateTimeParseGA = (ga) => {
          const parts = (ga || '').toString().trim().split('/')
          if (parts.length !== 3) return null
          const nums = parts.map((p) => Number(p))
          if (nums.some((n) => !Number.isInteger(n) || n < 0)) return null
          return nums
        }

        const knxDateTimeCompareGA = (a, b) => {
          const aa = knxDateTimeParseGA(a)
          const bb = knxDateTimeParseGA(b)
          if (!aa && !bb) return 0
          if (!aa) return 1
          if (!bb) return -1
          for (let i = 0; i < 3; i++) {
            if (aa[i] !== bb[i]) return aa[i] - bb[i]
          }
          return 0
        }

        const knxGetKnxUltimateConfigs = () => {
          const configs = []
          try {
            if (RED && RED.nodes) {
              if (typeof RED.nodes.eachConfig === 'function') {
                RED.nodes.eachConfig((cfg) => {
                  if (cfg && cfg.type === 'knxUltimate-config') configs.push(cfg)
                })
              } else if (typeof RED.nodes.eachNode === 'function') {
                RED.nodes.eachNode((n) => {
                  if (n && n.type === 'knxUltimate-config') configs.push(n)
                })
              }
              if (configs.length === 0 && typeof RED.nodes.filterNodes === 'function') {
                try {
                  const filtered = RED.nodes.filterNodes({ type: 'knxUltimate-config' })
                  if (Array.isArray(filtered)) filtered.forEach((n) => configs.push(n))
                } catch (error) { /* ignore */ }
              }
            }
          } catch (error) { /* ignore */ }
          return configs
        }

        const knxFetchGroupAddresses = (serverId) => {
          return new Promise((resolve) => {
            if (!serverId) return resolve([])
            $.getJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
              resolve(Array.isArray(data) ? data : [])
            }).fail(() => resolve([]))
          })
        }

        const knxScoreEntry = (entry, kind, baseTokens) => {
          if (!entry) return -1
          const dpt = (entry.dpt || '').toString()
          const name = (entry.devicename || '').toString()
          const tokens = knxDateTimeNormalizeTokens(name)

          let score = 0

          if (kind === 'datetime') {
            if (dpt === '19.001') score += 60
            else if (dpt.startsWith('19.')) score += 45
            KNX_ULTIMATE_DATETIME_KEYWORDS.datetime.forEach((re) => { if (re.test(name)) score += 20 })
            KNX_ULTIMATE_DATETIME_KEYWORDS.time.forEach((re) => { if (re.test(name)) score += 6 })
            KNX_ULTIMATE_DATETIME_KEYWORDS.date.forEach((re) => { if (re.test(name)) score += 6 })
          } else if (kind === 'date') {
            if (dpt === '11.001') score += 60
            else if (dpt.startsWith('11.')) score += 45
            KNX_ULTIMATE_DATETIME_KEYWORDS.date.forEach((re) => { if (re.test(name)) score += 18 })
          } else if (kind === 'time') {
            if (dpt === '10.001') score += 60
            else if (dpt.startsWith('10.')) score += 45
            KNX_ULTIMATE_DATETIME_KEYWORDS.time.forEach((re) => { if (re.test(name)) score += 18 })
          }

          if (Array.isArray(baseTokens) && baseTokens.length > 0) {
            score += Math.round(knxDateTimeTokenSimilarity(tokens, baseTokens) * 30)
          }

          return score
        }

        const knxPickBest = (entries, kind, baseTokens) => {
          if (!Array.isArray(entries) || entries.length === 0) return null
          let best = null
          let bestScore = -1
          entries.forEach((e) => {
            const s = knxScoreEntry(e, kind, baseTokens)
            if (s > bestScore) {
              bestScore = s
              best = e
            } else if (s === bestScore && best) {
              const cmp = knxDateTimeCompareGA(e.ga, best.ga)
              if (cmp < 0) best = e
            }
          })
          return best
        }

        const knxSuggestFromCsv = (csvRows) => {
          const rows = Array.isArray(csvRows) ? csvRows : []
          const datetimeRows = rows.filter((r) => (r && typeof r.dpt === 'string' && r.dpt.startsWith('19.')))
          const dateRows = rows.filter((r) => (r && typeof r.dpt === 'string' && r.dpt.startsWith('11.')))
          const timeRows = rows.filter((r) => (r && typeof r.dpt === 'string' && r.dpt.startsWith('10.')))

          const bestDateTime = knxPickBest(datetimeRows, 'datetime', [])
          const baseTokens = bestDateTime ? knxDateTimeNormalizeTokens(bestDateTime.devicename || '') : []

          const bestDate = knxPickBest(dateRows, 'date', baseTokens)
          const bestTime = knxPickBest(timeRows, 'time', baseTokens)

          return {
            dateTime: bestDateTime,
            date: bestDate,
            time: bestTime
          }
        }

        const knxAutoConfigureDateTimeNode = async (node, { updateDom = false, preferExistingServer = true, canApply = () => true } = {}) => {
          try {
            if (!node || !canApply()) return

            const hasAnyGA = !!((node.gaDateTime || '').trim() || (node.gaDate || '').trim() || (node.gaTime || '').trim())
            if (hasAnyGA) return

            // If server already selected and it has ETS rows, reuse it.
            const currentServerId = preferExistingServer ? (node.server || '') : ''
            if (currentServerId && currentServerId !== '_ADD_') {
              const rows = await knxFetchGroupAddresses(currentServerId)
              if (rows.length > 0) {
                const suggestions = knxSuggestFromCsv(rows)
                return knxApplySuggestions(node, currentServerId, suggestions, { updateDom, canApply })
              }
            }

            // Otherwise, select the first knxUltimate-config that has an ETS CSV imported (non-empty parsed GA list).
            const configs = knxGetKnxUltimateConfigs()
            if (configs.length === 0) return

            // Fast path: config node already carries an ETS file/path in its `csv` property.
            for (let i = 0; i < configs.length; i++) {
              const cfg = configs[i]
              const id = cfg && cfg.id ? cfg.id : null
              const csvHint = cfg && typeof cfg.csv === 'string' ? cfg.csv.trim() : ''
              if (!id || !csvHint) continue
              const rows = await knxFetchGroupAddresses(id)
              if (rows.length === 0) continue
              const suggestions = knxSuggestFromCsv(rows)
              return knxApplySuggestions(node, id, suggestions, { updateDom, canApply })
            }

            const maxCandidates = Math.min(10, configs.length)
            const checks = configs.slice(0, maxCandidates).map((cfg) => {
              const id = cfg && cfg.id ? cfg.id : null
              return knxFetchGroupAddresses(id).then((rows) => ({ id, rows }))
            })
            const results = await Promise.all(checks)

            let selected = null
            for (let i = 0; i < results.length; i++) {
              if (results[i] && results[i].id && Array.isArray(results[i].rows) && results[i].rows.length > 0) {
                selected = results[i]
                break
              }
            }
            if (!selected) return

            const suggestions = knxSuggestFromCsv(selected.rows)
            return knxApplySuggestions(node, selected.id, suggestions, { updateDom, canApply })
          } catch (error) {
            try { console.warn('knxUltimateDateTime auto-config failed', error) } catch (e) { /* ignore */ }
          }
        }

        const knxAutoConfigureDateTimeNodeForServer = async (node, serverId, { updateDom = false, overwrite = false, canApply = () => true } = {}) => {
          try {
            if (!node || !serverId || !canApply()) return
            const rows = await knxFetchGroupAddresses(serverId)
            if (!Array.isArray(rows) || rows.length === 0) return
            const suggestions = knxSuggestFromCsv(rows)
            return knxApplySuggestions(node, serverId, suggestions, { updateDom, overwrite, canApply })
          } catch (error) {
            try { console.warn('knxUltimateDateTime auto-config for server failed', error) } catch (e) { /* ignore */ }
          }
        }

        const knxApplySuggestions = (node, serverId, suggestions, { updateDom = false, overwrite = false, canApply = () => true } = {}) => {
          // The Utility wrapper can replace this fragment while ETS requests are in
          // flight. Never let a late response update its successor's fields.
          if (!node || !serverId || !canApply()) return
          if (!suggestions) return

          // Avoid repeating the same automation multiple times.
          if (node._knxDateTimeAutoConfigured === true && overwrite !== true) return

          node.server = serverId

          if (suggestions.dateTime && suggestions.dateTime.ga && (overwrite || !(node.gaDateTime || '').trim())) {
            node.gaDateTime = suggestions.dateTime.ga
            node.nameDateTime = suggestions.dateTime.devicename || ''
          }
          if (suggestions.date && suggestions.date.ga && (overwrite || !(node.gaDate || '').trim())) {
            node.gaDate = suggestions.date.ga
            node.nameDate = suggestions.date.devicename || ''
          }
          if (suggestions.time && suggestions.time.ga && (overwrite || !(node.gaTime || '').trim())) {
            node.gaTime = suggestions.time.ga
            node.nameTime = suggestions.time.devicename || ''
          }

          node._knxDateTimeAutoConfigured = true
          node._knxDateTimeAutoConfiguredServer = serverId

          if (updateDom) {
            try {
              $('#node-input-server').val(serverId).trigger('change')
              if (node.gaDateTime) $('#node-input-gaDateTime').val(node.gaDateTime)
              if (node.nameDateTime) $('#node-input-nameDateTime').val(node.nameDateTime)
              if (node.gaDate) $('#node-input-gaDate').val(node.gaDate)
              if (node.nameDate) $('#node-input-nameDate').val(node.nameDate)
              if (node.gaTime) $('#node-input-gaTime').val(node.gaTime)
              if (node.nameTime) $('#node-input-nameTime').val(node.nameTime)
            } catch (error) { /* ignore */ }
          } else {
            try {
              if (RED && RED.nodes && typeof RED.nodes.dirty === 'function') RED.nodes.dirty(true)
            } catch (error) { /* ignore */ }
            try { if (RED && RED.view && typeof RED.view.redraw === 'function') RED.view.redraw() } catch (error) { /* ignore */ }
          }
        }

        const knxDateTimeOptionalNumber = (toggle) => function (value) {
          let enabled = this[toggle] === undefined || this[toggle] === true || this[toggle] === 'true';
          // The wrapper validates the saved node while its draft is open. Read the
          // active checkbox only in that case; unrelated nodes use their saved flag.
          if (this._utilityEditor && typeof $ === 'function') {
            const field = $('#node-input-' + toggle)
            if (field.length) enabled = field.is(':checked')
          }
          return !enabled || RED.validators.number()(value)
        }

        RED.nodes.registerType('knxUltimateDateTime', {
          category: 'KNX Ultimate',
          color: '#C7E9C0',
          defaults: {
            server: { type: 'knxUltimate-config', required: true },
            name: { value: '' },
            outputtopic: { value: '' },
            gaDateTime: { value: '' },
            nameDateTime: { value: '' },
            dptDateTime: { value: '19.001' },
            gaDate: { value: '' },
            nameDate: { value: '' },
            dptDate: { value: '11.001' },
            gaTime: { value: '' },
            nameTime: { value: '' },
            dptTime: { value: '10.001' },
            sendOnDeploy: { value: true },
            sendOnDeployDelay: { value: 30, validate: knxDateTimeOptionalNumber('sendOnDeploy') },
            periodicSend: { value: true },
            periodicSendInterval: { value: 60, validate: knxDateTimeOptionalNumber('periodicSend') },
            periodicSendUnit: { value: 'm' }
          },
          inputs: 0,
          outputs: 0,
          icon: 'node-knx-icon.svg',
          label: function () {
            return this.name || 'KNX DateTime'
          },
          paletteLabel: function () {
            try {
              return RED._('node-red-contrib-knx-ultimate/knxUltimateDateTime:knxUltimateDateTime.paletteLabel') || 'DateTime'
            } catch (error) {
              return 'DateTime'
            }
          },
          onadd: function () {
            // Auto-select a KNX gateway (first one with ETS CSV imported) and prefill coherent group addresses.
            // This runs when the node is dragged from the palette. Best-effort, non-blocking.
            const node = this
            setTimeout(() => {
              knxAutoConfigureDateTimeNode(node, {
                updateDom: false,
                preferExistingServer: true,
                canApply: () => node.utilityType === 'datetime'
              })
            }, 50)
          },
          button: {
            enabled: function () {
              return !this.changed
            },
            visible: function () {
              return true
            },
            onclick: function () {
              const node = this
              $.ajax({
                type: 'POST',
                url: 'knxUltimateUtility/sendNow',
                data: { id: node.id },
                success: function (response) {
                  const queued = response && response.queued === true
                  const message = queued
                    ? (RED._('node-red-contrib-knx-ultimate/knxUltimateDateTime:knxUltimateDateTime.notifyQueued') || 'Queued (gateway not connected yet)')
                    : (RED._('node-red-contrib-knx-ultimate/knxUltimateDateTime:knxUltimateDateTime.notifySent') || 'Sent to KNX')
                  RED.notify(message, 'success')
                },
                error: function (xhr) {
                  let message = 'Error'
                  try {
                    if (xhr && xhr.responseJSON && xhr.responseJSON.error) message = xhr.responseJSON.error
                  } catch (error) { /* ignore */ }
                  RED.notify(message, 'error')
                }
              })
            }
          },
          oneditprepare: function () {
            const node = this
            if (node._knxDateTimeEditorSession) node._knxDateTimeEditorSession.active = false
            const editorSession = { active: true }
            node._knxDateTimeEditorSession = editorSession
            const $knxServerInput = $('#node-input-server')
            const KNX_EMPTY_VALUES = new Set(['', '_ADD_', '__NONE__', 'none'])
            const KNX_GA_CACHE = node._knxGaCache || (node._knxGaCache = new Map())

            try { RED.sidebar.show('help') } catch (error) { /* ignore */ }

            const resolveKnxServerValue = () => {
              const domValue = $knxServerInput.val()
              if (domValue !== undefined && domValue !== null && domValue !== '') return domValue
              if (node.server !== undefined && node.server !== null && node.server !== '') return node.server
              return ''
            }

            const addressFields = ['gaDateTime', 'nameDateTime', 'dptDateTime', 'gaDate', 'nameDate', 'dptDate', 'gaTime', 'nameTime', 'dptTime']
            const addressSnapshot = () => JSON.stringify(addressFields.map((field) => $('#node-input-' + field).val() || ''))

            const hasKnxServerSelected = () => {
              const val = resolveKnxServerValue()
              return !(val === undefined || val === null || KNX_EMPTY_VALUES.has(String(val)))
            }

            const fetchGroupAddresses = (serverId) => {
              if (!serverId) return Promise.resolve([])
              if (KNX_GA_CACHE.has(serverId)) return Promise.resolve(KNX_GA_CACHE.get(serverId))
              return new Promise((resolve) => {
                $.getJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
                  const list = Array.isArray(data) ? data : []
                  KNX_GA_CACHE.set(serverId, list)
                  resolve(list)
                }).fail(() => resolve([]))
              })
            }

            const setupGA = (gaSelector, nameSelector, dptSelector, allowedPrefixes, defaultDpt) => {
              const $gaInput = $(gaSelector)
              const $nameInput = $(nameSelector)
              const $dptInput = $(dptSelector)
              if (!$gaInput.length) return

              if ($dptInput.length && (!$dptInput.val() || $dptInput.val() === '')) $dptInput.val(defaultDpt)

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
                    const allowed = allowedPrefixes.some((prefix) => prefix === '' || dpt.startsWith(prefix))
                    if (!allowed) return
                    const devName = entry.devicename || ''
                    const searchStr = `${entry.ga} (${devName}) DPT${dpt}`
                    if (!htmlUtilsfullCSVSearch(searchStr, request.term || '')) return
                    items.push({
                      label: `${entry.ga} # ${devName} # ${dpt}`,
                      value: entry.ga,
                      ga: entry.ga
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
                      } catch (error) { deviceName = '' }
                      if ($nameInput.length) {
                        $nameInput.val(deviceName || '')
                      }
                      try {
                        const parts = ui.item.label.split('#')
                        const dptFromLabel = parts.length >= 3 ? parts[2].trim() : ''
                        $dptInput.val(dptFromLabel || defaultDpt)
                      } catch (error) {
                        $dptInput.val(defaultDpt)
                      }
                    }
                  })
                  .on('focus.knxUltimateDateTime click.knxUltimateDateTime', function () {
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

            const refresh = () => {
              setupGA('#node-input-gaDateTime', '#node-input-nameDateTime', '#node-input-dptDateTime', ['19.'], '19.001')
              setupGA('#node-input-gaDate', '#node-input-nameDate', '#node-input-dptDate', ['11.'], '11.001')
              setupGA('#node-input-gaTime', '#node-input-nameTime', '#node-input-dptTime', ['10.'], '10.001')
            }

            $knxServerInput.off('.knxUtilityProfile').on('change.knxUtilityProfile', () => {
              KNX_GA_CACHE.clear()
              refresh()
              try {
                const sid = resolveKnxServerValue()
                if (!sid || sid === '_ADD_') return
                const hasAnyGAInUi = !!(
                  ($('#node-input-gaDateTime').val() || '').toString().trim() ||
                  ($('#node-input-gaDate').val() || '').toString().trim() ||
                  ($('#node-input-gaTime').val() || '').toString().trim()
                )
                // If the current values were auto-filled, allow overwrite when server changes.
                const shouldOverwrite = node._knxDateTimeAutoConfigured === true && node._knxDateTimeAutoConfiguredServer && node._knxDateTimeAutoConfiguredServer !== sid
                const beforeRequest = addressSnapshot()
                // Otherwise fill only empty fields (do not override manual config).
                knxAutoConfigureDateTimeNodeForServer(node, sid, {
                  updateDom: true,
                  overwrite: shouldOverwrite || !hasAnyGAInUi,
                  canApply: () => editorSession.active && resolveKnxServerValue() === sid && addressSnapshot() === beforeRequest
                })
              } catch (error) { /* ignore */ }
            })

            refresh()

            // Auto-select server + fill GAs only for a brand new node (all GAs empty).
            const initialServer = resolveKnxServerValue()
            const initialAddresses = addressSnapshot()
            editorSession.timer = setTimeout(() => {
              knxAutoConfigureDateTimeNode(node, {
                updateDom: true,
                preferExistingServer: true,
                canApply: () => editorSession.active && resolveKnxServerValue() === initialServer && addressSnapshot() === initialAddresses
              })
            }, 50)

            const syncUi = () => {
              const sendOnDeploy = $('#node-input-sendOnDeploy').is(':checked')
              $('.knx-datetime-deploy-options').toggle(sendOnDeploy)
              const periodicSend = $('#node-input-periodicSend').is(':checked')
              $('.knx-datetime-periodic-options').toggle(periodicSend)
            }

            $('#node-input-sendOnDeploy').on('change.knxUtilityProfile', syncUi)
            $('#node-input-periodicSend').on('change.knxUtilityProfile', syncUi)
            syncUi()
          },
          oneditcancel: function () {
            const session = this._knxDateTimeEditorSession
            if (session) {
              session.active = false
              clearTimeout(session.timer)
            }
            $('#node-input-server').off('.knxUtilityProfile')
            $('#node-input-sendOnDeploy').off('.knxUtilityProfile')
            $('#node-input-periodicSend').off('.knxUtilityProfile')
          }
        })
    },
    "watchdog": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

      RED.nodes.registerType('knxUltimateWatchDog', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: true },
                  topic: { value: "12/0/0" },
                  maxRetry: { value: 6, validate: utilityNumber(0, true) }, // Zero reports failure on the first unsuccessful check.
                  retryInterval: { value: 10, validate: utilityNumber(0.001) },
                  name: { value: "" },
                  autoStart: { value: true },
                  listenToKnxUltimateNodeErrors: { value: true },
                  checkLevel: { value: "Ethernet" }
              },
              inputs: 1,
              outputs: 1,
              outputLabels: ["Output"],
              icon: "node-watchdog-icon.svg",
              label: function () {
                  return ((this.name || "KNX Watchdog") + " " + (this.checkLevel == "Ethernet" ? "Gateway IP" : this.topic));
              },
              paletteLabel: "KNX WatchDog",
              oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };
                  const node = this;
                  const $knxServerInput = $("#node-input-server");
                  const $gaInput = $("#node-input-topic");
                  const KNX_EMPTY_VALUES = new Set(['', '_ADD_', '__NONE__', 'none']);

                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }

                  $("#advancedOptionsAccordion").accordion({
                      header: "h3",
                      heightStyle: "content",
                      collapsible: true,
                      active: false
                  });

                  const KNX_GA_CACHE = node._knxGaCache || (node._knxGaCache = new Map());

                  const resolveKnxServerValue = () => {
                      const domValue = $knxServerInput.val();
                      if (domValue !== undefined && domValue !== null) {
                          return KNX_EMPTY_VALUES.has(String(domValue)) ? '' : domValue;
                      }
                      if (node.server !== undefined && node.server !== null && !KNX_EMPTY_VALUES.has(String(node.server))) {
                          return node.server;
                      }
                      return '';
                  };

                  const fetchGroupAddresses = (serverId) => {
                      if (!serverId) return Promise.resolve([]);
                      if (KNX_GA_CACHE.has(serverId)) return Promise.resolve(KNX_GA_CACHE.get(serverId));
                      return new Promise((resolve) => {
                          profileGetJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
                              const list = Array.isArray(data) ? data : [];
                              KNX_GA_CACHE.set(serverId, list);
                              resolve(list);
                          }).fail(() => resolve([]));
                      });
                  };

                  const ensureGaAutocomplete = () => {
                      const serverId = resolveKnxServerValue();
                      if (!serverId) {
                          if ($gaInput.data('ui-autocomplete')) {
                              $gaInput.autocomplete('disable');
                          }
                          return;
                      }

                      const sourceFn = (request, response) => {
                          fetchGroupAddresses(serverId).then((data) => {
                              if (!editorSession.active || resolveKnxServerValue() !== serverId) return;
                              const items = [];
                              (data || []).forEach((entry) => {
                                  const dpt = typeof entry.dpt === 'string' ? entry.dpt : '';
                                  if (!dpt.startsWith('1.')) return; // Watchdog only accepts boolean GAs
                                  const devName = entry.devicename || '';
                                  const searchStr = `${entry.ga} (${devName}) DPT${dpt}`;
                                  if (!htmlUtilsfullCSVSearch(searchStr, request.term || '')) return;
                                  items.push({
                                      label: `${entry.ga} # ${devName} # ${dpt}`,
                                      value: entry.ga
                                  });
                              });
                              response(items);
                          });
                      };

                      if ($gaInput.data('knx-watchdog-ga')) {
                          $gaInput.autocomplete('option', 'source', sourceFn);
                          $gaInput.autocomplete('enable');
                      } else {
                          $gaInput.autocomplete({
                              minLength: 0,
                              source: sourceFn,
                              select: function (event, ui) {
                                  event.preventDefault();
                                  $(this).val(ui.item.value);
                                  const parts = ui.item.label.split('#');
                                  let deviceName = (parts[1] || '').trim().replace(/^\)/, '').trim();
                                  if (deviceName.indexOf('/') > -1) {
                                      deviceName = deviceName.split('/').pop().trim();
                                  }
                                  const $nameInput = $('#node-input-name');
                                  if (deviceName && $nameInput.length) {
                                      $nameInput.val(deviceName);
                                  }
                              }
                          }).on('focus.knxUltimateWatchDog click.knxUltimateWatchDog', function () {
                              const currentValue = $(this).val() || '';
                              try {
                                  $(this).autocomplete('search', currentValue ? `${currentValue} exactmatch` : '');
                              } catch (error) { }
                          });
                          $gaInput.data('knx-watchdog-ga', true);
                      }

                      try {
                          const srv = RED.nodes.node(serverId);
                          if (srv && srv.id) KNX_enableSecureFormatting($gaInput, srv.id);
                      } catch (error) { }
                  };

                  $knxServerInput.off('.knxUtilityProfile').on('change.knxUtilityProfile', () => {
                      KNX_GA_CACHE.clear();
                      ensureGaAutocomplete();
                  });
                  ensureGaAutocomplete();

                  const syncDivHost = () => {
                      const level = $("#node-input-checkLevel").val() || node.checkLevel || "Ethernet";
                      if (level === "Ethernet") {
                          $("#divHost").hide();
                      } else {
                          $("#divHost").show();
                      }
                  };

                  $("#node-input-checkLevel").on('change.knxUtilityProfile', function () {
                      syncDivHost();
                  });
                  syncDivHost();
              },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }


              }

          })
    },
    "globalcontext": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

      RED.nodes.registerType('knxUltimateGlobalContext', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: true },
                  name: { value: "KNXGlobalContext", validate: function (value) { return /^[a-zA-Z]+$/.test(value || ''); } },
                  exposeAsVariable: { value: "exposeAsVariableREADWRITE", required: false },
                  writeExecutionInterval: { value: 1000, validate: utilityNumber(1) },
                  contextStorage: { value: "" }
              },
              inputs: 0,
              outputs: 0,
              icon: "node-knx-icon.svg",
              label: function () {
                  return (this.name);
              },
              paletteLabel: "KNX Global Context",
              oneditprepare: function () {
                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }



              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }



              },
              oneditcancel: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }


              }
          })
    },
    "logger": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

      RED.nodes.registerType('knxUltimateLogger', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: true },
                  topic: { value: "" },
                  intervalCreateETSXML: { value: 15, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'autoStartTimerCreateETSXML') !== false) },
                  name: { value: "" },
                  autoStartTimerCreateETSXML: { value: true },
                  maxRowsInETSXML: { value: 0, validate: utilityNumber(0, true) },
                  saveMode: { value: "emit" },
                  filePath: { value: "" },
                  autoStartTimerTelegramCounter: { value: false },
                  intervalTelegramCount: { value: 60, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'autoStartTimerTelegramCounter') === true) }

              },
              inputs: 1,
              outputs: 2,
              outputLabels: ["ETS Diag file", "Telegram Count"],
              icon: "node-logger-icon.svg",
              label: function () {
                  return ((this.name || "KNX Logger") + " " + this.topic);
              },
              paletteLabel: "KNX Logger",
              oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };
                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }

                  $("#mlxETSFileAccordion").accordion({
                      header: "h3",
                      heightStyle: "content",
                      collapsible: true,
                      active: false
                  });

                  const nodeId = this.id;
                  const resolveAdminRoot = () => {
                      const raw = (RED.settings && typeof RED.settings.httpAdminRoot === "string") ? RED.settings.httpAdminRoot : "/";
                      const trimmed = String(raw || "/").trim();
                      if (trimmed === "" || trimmed === "/") return "";
                      return "/" + trimmed.replace(/^\/+|\/+$/g, "");
                  };
                  const resolveAccessToken = () => {
                      try {
                          const tokens = (RED.settings && typeof RED.settings.get === "function") ? RED.settings.get("auth-tokens") : null;
                          const token = tokens && typeof tokens.access_token === "string" ? tokens.access_token.trim() : "";
                          return token;
                      } catch (error) {
                          return "";
                      }
                  };

                  const toggleFilePath = () => {
                      const isEmitSave = $("#node-input-saveMode").val() === "emit_save";
                      const $filePathRow = $("#knx-logger-filePath-row");
                      if (isEmitSave) {
                          $filePathRow.show();
                      } else {
                          $filePathRow.hide();
                      }
                  };
                  $("#node-input-saveMode").on("change.knxUtilityProfile", toggleFilePath);

                  const currentFilePath = this.filePath || "";
                  $("#node-input-filePath").val(currentFilePath);
                  toggleFilePath();

                  $("#knx-logger-downloadButton").on("click.knxUtilityProfile", function (evt) {
                      evt.preventDefault();
                      const filePathVal = $("#node-input-filePath").val() || "";
                      if (!filePathVal) {
                          try {
                              const msg = (RED._ && RED._("node-red-contrib-knx-ultimate/knxUltimateLogger:knxUltimateLogger.noFilePath")) || "File path is empty";
                              RED.notify(msg, "warning");
                          } catch (error) {
                              alert("File path is empty");
                          }
                          return;
                      }
                      const adminRoot = resolveAdminRoot();
                      const targetBase = adminRoot + "/knxUltimateUtility/logger/download";
                      const params = new URLSearchParams();
                      if (nodeId) params.set("nodeId", nodeId);
                      params.set("_", String(Date.now()));
                      const accessToken = resolveAccessToken();
                      if (accessToken) params.set("access_token", accessToken);
                      const target = targetBase + "?" + params.toString();
                      const wnd = window.open(target, "_blank", "noopener,noreferrer");
                      try { if (wnd && typeof wnd.focus === "function") wnd.focus(); } catch (e) { }
                  });
              },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }

                  this.filePath = $("#node-input-filePath").val() || "";


              }

          })
    },
    "staircase": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

      RED.nodes.registerType('knxUltimateStaircase', {
          category: 'KNX Ultimate',
          color: '#C7E9C0',
          defaults: {
            server: { type: 'knxUltimate-config', required: true },
            name: { value: '' },
            outputtopic: { value: '' },
            gaTrigger: { value: '', required: true },
            nameTrigger: { value: '' },
            dptTrigger: { value: '1.001' },
            gaOutput: { value: '', required: true },
            nameOutput: { value: '' },
            dptOutput: { value: '1.001' },
            gaStatus: { value: '' },
            nameStatus: { value: '' },
            dptStatus: { value: '1.001' },
            gaOverride: { value: '' },
            nameOverride: { value: '' },
            dptOverride: { value: '1.001' },
            gaBlock: { value: '' },
            nameBlock: { value: '' },
            dptBlock: { value: '1.001' },
            timerSeconds: { value: 120, required: true, validate: utilityNumber(1) },
            extendMode: { value: 'restart' },
            triggerOffCancels: { value: 'yes' },
            preWarnEnable: { value: false },
            preWarnSeconds: { value: 15, validate: utilityNumber(0, false, (node) => utilityFieldValue(node, 'preWarnEnable') === true) },
            preWarnMode: { value: 'status' },
            preWarnFlashMs: { value: 400, validate: utilityNumber(100, false, (node) => utilityFieldValue(node, 'preWarnEnable') === true && utilityFieldValue(node, 'preWarnMode') === 'flash') },
            blockAction: { value: 'off' },
            emitEvents: { value: false }
          },
          inputs: 1,
          outputs: 1,
          icon: 'node-knx-icon.svg',
          label: function () {
            return this.name || 'KNX Staircase';
          },
          paletteLabel: 'KNX Staircase',
          oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };
            const node = this;
            const $knxServerInput = $('#node-input-server');
            try { RED.sidebar.show('help'); } catch (error) { /* ignore */ }
            const KNX_EMPTY_VALUES = new Set(['', '_ADD_', '__NONE__', 'none']);

            const resolveKnxServerValue = () => {
              const domValue = $knxServerInput.val();
              if (domValue !== undefined && domValue !== null) return KNX_EMPTY_VALUES.has(String(domValue)) ? '' : domValue;
              if (node.server !== undefined && node.server !== null && node.server !== '') return node.server;
              return '';
            };

            const hasKnxServerSelected = () => {
              const val = resolveKnxServerValue();
              return !(val === undefined || val === null || KNX_EMPTY_VALUES.has(String(val)));
            };

            const KNX_GA_CACHE = node._knxGaCache || (node._knxGaCache = new Map());

            const fetchGroupAddresses = (serverId) => {
              if (!serverId) return Promise.resolve([]);
              if (KNX_GA_CACHE.has(serverId)) return Promise.resolve(KNX_GA_CACHE.get(serverId));
              return new Promise((resolve) => {
                profileGetJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
                  const list = Array.isArray(data) ? data : [];
                  KNX_GA_CACHE.set(serverId, list);
                  resolve(list);
                }).fail(() => resolve([]));
              });
            };

            const getGroupAddress = (gaSelector, nameSelector, dptSelector, prefixes) => {
              const $gaInput = $(gaSelector);
              const $nameInput = $(nameSelector);
              const $dptInput = $(dptSelector);
              if (!$gaInput.length) return;

              const ensureAutocomplete = () => {
                const sourceFn = (request, response) => {
                  if (!hasKnxServerSelected()) {
                    response([]);
                    return;
                  }
                  const serverId = resolveKnxServerValue();
                  fetchGroupAddresses(serverId).then((data) => {
                              if (!editorSession.active || resolveKnxServerValue() !== serverId) return;
                    const items = [];
                    data.forEach((entry) => {
                      const dpt = entry.dpt || '';
                      const allowed = prefixes.some((prefix) => prefix === '' || dpt.startsWith(prefix));
                      if (!allowed) return;
                      const devName = entry.devicename || '';
                      const searchStr = `${entry.ga} (${devName}) DPT${dpt}`;
                      if (!htmlUtilsfullCSVSearch(searchStr, request.term || '')) return;
                      items.push({
                        label: `${entry.ga} # ${devName} # ${dpt}`,
                        value: entry.ga,
                        ga: entry.ga
                      });
                    });
                    response(items);
                  });
                };

                if ($gaInput.data('knx-ga-initialised')) {
                  $gaInput.autocomplete('option', 'source', sourceFn);
                } else {
                  $gaInput
                    .autocomplete({
                      minLength: 0,
                      source: sourceFn,
                      select: (event, ui) => {
                        let deviceName = '';
                        try {
                          deviceName = ui.item.label.split('#')[1].trim();
                          deviceName = deviceName.replace(/^\)/, '').trim();
                        } catch (error) { deviceName = ''; }
                        if ($nameInput.length) {
                          if (deviceName && deviceName !== '') {
                            $nameInput.val(deviceName);
                          } else if (!$nameInput.val()) {
                            $nameInput.val('');
                          }
                        }
                        try {
                          const parts = ui.item.label.split('#');
                          const dptFromLabel = parts.length >= 3 ? parts[2].trim() : '';
                          if (dptFromLabel !== '') {
                            $dptInput.val(dptFromLabel);
                          }
                        } catch (error) { /* ignore */ }
                      }
                    })
                    .on('focus.knxUltimateStaircase click.knxUltimateStaircase', function () {
                      const currentValue = $(this).val() || '';
                      try { $(this).autocomplete('search', `${currentValue} exactmatch`); } catch (error) { /* ignore */ }
                    });
                  $gaInput.data('knx-ga-initialised', true);
                }
                try {
                  if (hasKnxServerSelected()) {
                    const srv = RED.nodes.node(resolveKnxServerValue());
                    if (srv && srv.id) KNX_enableSecureFormatting($gaInput, srv.id);
                  }
                } catch (error) { /* ignore */ }
              };

              ensureAutocomplete();
            };

            const BINARY_PREFIX = ['1.'];
            const ANY_ANALOG_PREFIX = ['1.', '2.', '5.', '6.', '7.', '8.', '9.', '12.', '13.', '14.', '16.', '20.'];

            const refreshKnxBindings = () => {
              if (!hasKnxServerSelected()) {
                return;
              }

              getGroupAddress('#node-input-gaTrigger', '#node-input-nameTrigger', '#node-input-dptTrigger', BINARY_PREFIX);
              getGroupAddress('#node-input-gaOutput', '#node-input-nameOutput', '#node-input-dptOutput', ANY_ANALOG_PREFIX);
              getGroupAddress('#node-input-gaStatus', '#node-input-nameStatus', '#node-input-dptStatus', ANY_ANALOG_PREFIX);
              getGroupAddress('#node-input-gaOverride', '#node-input-nameOverride', '#node-input-dptOverride', BINARY_PREFIX);
              getGroupAddress('#node-input-gaBlock', '#node-input-nameBlock', '#node-input-dptBlock', BINARY_PREFIX);
            };

            $knxServerInput.off('.knxUtilityProfile').on('change.knxUtilityProfile', () => {
              KNX_GA_CACHE.clear();
              refreshKnxBindings();
            });

            refreshKnxBindings();

            const $preWarnRows = $('.knx-staircase-prewarn');
            const $flashRow = $('.knx-staircase-prewarn-flash');

            function syncPreWarnMode() {
              const enabled = $('#node-input-preWarnEnable').is(':checked');
              $preWarnRows.toggle(enabled);
              if (!enabled) {
                $flashRow.hide();
                return;
              }
              const mode = $('#node-input-preWarnMode').val();
              $flashRow.toggle(mode === 'flash');
            }

            $('#node-input-preWarnEnable').on('change.knxUtilityProfile', syncPreWarnMode);
            $('#node-input-preWarnMode').on('change.knxUtilityProfile', syncPreWarnMode);
            syncPreWarnMode();
          },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              }
        });
    },
    "garage": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

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
            return this.name || 'KNX Garage';
          },
          paletteLabel: 'KNX Garage',
          oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };
            const node = this;
            const $knxServerInput = $('#node-input-server');
            try { RED.sidebar.show('help'); } catch (error) { /* ignore */ }
            const KNX_EMPTY_VALUES = new Set(['', '_ADD_', '__NONE__', 'none']);

            const resolveKnxServerValue = () => {
              const domValue = $knxServerInput.val();
              if (domValue !== undefined && domValue !== null) return KNX_EMPTY_VALUES.has(String(domValue)) ? '' : domValue;
              if (node.server !== undefined && node.server !== null && node.server !== '') return node.server;
              return '';
            };

            const hasKnxServerSelected = () => {
              const val = resolveKnxServerValue();
              return !(val === undefined || val === null || KNX_EMPTY_VALUES.has(String(val)));
            };

            const KNX_GA_CACHE = node._knxGaCache || (node._knxGaCache = new Map());

            const fetchGroupAddresses = (serverId) => {
              if (!serverId) return Promise.resolve([]);
              if (KNX_GA_CACHE.has(serverId)) return Promise.resolve(KNX_GA_CACHE.get(serverId));
              return new Promise((resolve) => {
                profileGetJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
                  const list = Array.isArray(data) ? data : [];
                  KNX_GA_CACHE.set(serverId, list);
                  resolve(list);
                }).fail(() => resolve([]));
              });
            };

            const getGroupAddress = (gaSelector, nameSelector, dptSelector, prefixes) => {
              const $gaInput = $(gaSelector);
              const $nameInput = $(nameSelector);
              const $dptInput = $(dptSelector);
              if (!$gaInput.length) return;

              const ensureAutocomplete = () => {
                const sourceFn = (request, response) => {
                  if (!hasKnxServerSelected()) {
                    response([]);
                    return;
                  }
                  const serverId = resolveKnxServerValue();
                  fetchGroupAddresses(serverId).then((data) => {
                              if (!editorSession.active || resolveKnxServerValue() !== serverId) return;
                    const items = [];
                    data.forEach((entry) => {
                      const dpt = entry.dpt || '';
                      const allowed = prefixes.some((prefix) => prefix === '' || dpt.startsWith(prefix));
                      if (!allowed) return;
                      const devName = entry.devicename || '';
                      const searchStr = `${entry.ga} (${devName}) DPT${dpt}`;
                      if (!htmlUtilsfullCSVSearch(searchStr, request.term || '')) return;
                      items.push({
                        label: `${entry.ga} # ${devName} # ${dpt}`,
                        value: entry.ga,
                        dpt
                      });
                    });
                    response(items);
                  });
                };

                if ($gaInput.data('knx-ga-initialised')) {
                  $gaInput.autocomplete('option', 'source', sourceFn);
                } else {
                  $gaInput
                    .autocomplete({
                      minLength: 0,
                      source: sourceFn,
                      select: (event, ui) => {
                        let deviceName = '';
                        try {
                          deviceName = ui.item.label.split('#')[1].trim();
                          deviceName = deviceName.replace(/^\)/, '').trim();
                        } catch (error) { deviceName = ''; }
                        if ($nameInput.length) {
                          if (deviceName && deviceName !== '') {
                            $nameInput.val(deviceName);
                          } else if (!$nameInput.val()) {
                            $nameInput.val('');
                          }
                        }
                        try {
                          const parts = ui.item.label.split('#');
                          const dptFromLabel = parts.length >= 3 ? parts[2].trim() : '';
                          if (dptFromLabel !== '') {
                            $dptInput.val(dptFromLabel);
                          }
                        } catch (error) { /* ignore */ }
                      }
                    })
                    .on('focus.knxUltimateGarage click.knxUltimateGarage', function () {
                      const currentValue = $(this).val() || '';
                      try { $(this).autocomplete('search', `${currentValue} exactmatch`); } catch (error) { /* ignore */ }
                    });
                  $gaInput.data('knx-ga-initialised', true);
                }
                try {
                  if (hasKnxServerSelected()) {
                    const srv = RED.nodes.node(resolveKnxServerValue());
                    if (srv && srv.id) KNX_enableSecureFormatting($gaInput, srv.id);
                  }
                } catch (error) { /* ignore */ }
              };

              ensureAutocomplete();
            };

            const BINARY_PREFIX = ['1.'];

            const refreshKnxBindings = () => {
              if (!hasKnxServerSelected()) return;

              getGroupAddress('#node-input-gaCommand', '#node-input-nameCommand', '#node-input-dptCommand', BINARY_PREFIX);
              getGroupAddress('#node-input-gaImpulse', '#node-input-nameImpulse', '#node-input-dptImpulse', BINARY_PREFIX);
              getGroupAddress('#node-input-gaHoldOpen', '#node-input-nameHoldOpen', '#node-input-dptHoldOpen', BINARY_PREFIX);
              getGroupAddress('#node-input-gaDisable', '#node-input-nameDisable', '#node-input-dptDisable', BINARY_PREFIX);
              getGroupAddress('#node-input-gaPhotocell', '#node-input-namePhotocell', '#node-input-dptPhotocell', BINARY_PREFIX);
              getGroupAddress('#node-input-gaMoving', '#node-input-nameMoving', '#node-input-dptMoving', BINARY_PREFIX);
              getGroupAddress('#node-input-gaObstruction', '#node-input-nameObstruction', '#node-input-dptObstruction', BINARY_PREFIX);
            };

            $knxServerInput.off('.knxUtilityProfile').on('change.knxUtilityProfile', () => {
              KNX_GA_CACHE.clear();
              refreshKnxBindings();
            });
            if (hasKnxServerSelected()) refreshKnxBindings();

            const syncAutoClose = () => {
              const enabled = $('#node-input-autoCloseEnable').is(':checked');
              const $seconds = $('#node-input-autoCloseSeconds').closest('.form-row');
              $seconds.toggle(enabled);
            };

            $('#node-input-autoCloseEnable').on('change.knxUtilityProfile', syncAutoClose);
            syncAutoClose();
          },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              }
        });
    },
    "scenecontroller": function (RED) {
      RED.nodes.registerType('knxUltimateSceneController', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: true },
                  name: { value: "" },
                  outputtopic: { value: "" },
                  topic: { value: "" },
                  dpt: { value: "" },
                  topicTrigger: { value: "true" },
                  topicSave: { value: "" },
                  dptSave: { value: "" },
                  topicSaveTrigger: { value: "true" },

                  rules: { value: [] }
              },
              inputs: 1,
              outputs: 1,
              icon: "node-scene-icon.svg",
              label: function () {
                  return (this.outputRBE == true ? "|rbe| " : "") + (this.name || this.topic || "KNX Scene Controller") + (this.inputRBE == true ? " |rbe|" : "")
              },
              paletteLabel: "KNX Scene Controller",
              oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };

                  const dptFields = [];
                  const dptRequests = new Map();
                  const loadDptOptions = (field, savedValue, track = true) => {
                      if (track) {
                          dptFields.push(field);
                          // Preserve persisted values even when Done is pressed before
                          // the asynchronous DPT catalog has arrived.
                          field.append($('<option></option>').attr('value', savedValue || '').text(savedValue || ''));
                          field.val(savedValue || '');
                      }
                      const serverId = $('#node-input-server').val();
                      if (!dptRequests.has(serverId)) {
                          dptRequests.set(serverId, new Promise((resolve) => {
                              profileGetJSON('knxUltimateDpts?serverId=' + encodeURIComponent(serverId || ''), resolve);
                          }));
                      }
                      dptRequests.get(serverId).then((data) => {
                          if (!editorSession.active || $('#node-input-server').val() !== serverId) return;
                          const selected = field.val();
                          field.empty().append($('<option></option>').attr('value', '').text(''));
                          const rows = Array.isArray(data) ? data : [];
                          rows.forEach((dpt) => field.append($('<option></option>').attr('value', dpt.value).text(dpt.text)));
                          if (selected && !rows.some((dpt) => String(dpt.value) === String(selected))) {
                              field.append($('<option></option>').attr('value', selected).text(selected));
                          }
                          field.val(selected || '');
                      });
                  };
                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }

                  var node = this;
                  var oNodeServer = RED.nodes.node($("#node-input-server").val()); // Store the config-node

                  // 19/02/2020 Used to get the server sooner als deploy.
                  $("#node-input-server").off(".knxUtilityProfile").on("change.knxUtilityProfile", function () {
                      try {
                          oNodeServer = RED.nodes.node($(this).val());
                          dptFields.forEach((field) => loadDptOptions(field, field.val(), false));
                      } catch (error) { }
                  });



                  // DPT of Scene Recall
                  // ########################
                  loadDptOptions($("#node-input-dpt"), this.dpt);

                  // Autocomplete suggestion with ETS csv File
                  $("#node-input-topic").autocomplete({
                      minLength: 0,
                      source: function (request, response) {
                          //profileGetJSON("csv", request, function( data, status, xhr ) {
                          if (!oNodeServer || !oNodeServer.id) { response([]); return; }
                          profileGetJSON("knxUltimatecsv?nodeID=" + oNodeServer.id, (data) => {
                              response($.map(data, function (value, key) {
                                  var sSearch = (value.ga + " (" + value.devicename + ") DPT" + value.dpt);
                                  if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                                      return {
                                          label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                                          value: value.ga // Value
                                      }
                                  } else {
                                      return null;
                                  }
                              }));
                          });
                      }, select: function (event, ui) {
                          // Sets Datapoint and device name automatically
                          var sDevName = ui.item.label.split("#")[1].trim();
                          try {
                              sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                          } catch (error) {
                          }
                          $('#node-input-name').val("Recall: " + sDevName + "/" + $('#node-input-name').val().split("/")[1]);
                          var optVal = $("#node-input-dpt option:contains('" + ui.item.label.split("#")[2].trim() + "')").attr('value');
                          var $dptSelect = $("#node-input-dpt");
                          if (optVal !== undefined && optVal !== null) {
                              $dptSelect.val(optVal).trigger('change');
                          } else {
                              $dptSelect.trigger('change');
                          }
                      }
                  }).focus(function () {
                      $(this).autocomplete('search', $(this).val() + 'exactmatch');
                  });
                  try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting($("#node-input-topicSave"), oNodeServer.id); } catch (e) {}
                  try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting($("#node-input-topic"), oNodeServer.id); } catch (e) {}

                  // 19/03/2020 Adjust trigger value accordingly
                  $("#node-input-dpt").on("change.knxUtilityProfile", function () {
                      if ($(this).val() !== null) {
                          if ($(this).val().indexOf("3.007") > -1) {
                              // It's a DIM. Suggest the right value
                              $("#node-input-topicTrigger").val("{decr_incr:1, data:5}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT3007"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })
                          } else if ($(this).val().indexOf("18.001") > -1) {
                              // It's a scene actuator. Suggest the right value
                              $("#node-input-topicTrigger").val("{save_recall:0, scenenumber:2}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT18001"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })

                          } else if ($(this).val().indexOf("232.600") > -1) {
                              // It's a scene actuator. Suggest the right value
                              $("#node-input-topicTrigger").val("{red:0, green:0, blue:0}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT232600"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })

                          } else if ($(this).val().indexOf("251.600") > -1) {
                              // It's a scene actuator. Suggest the right value
                              $("#node-input-topicTrigger").val("{red:0, green:0, blue:0, white:0, mR:1, mG:1, mB:1, mW:1}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT251600"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })

                          }

                      }
                  });
                  // ########################



                  // DPT of Scene Save
                  // ########################
                  loadDptOptions($("#node-input-dptSave"), this.dptSave);

                  // Autocomplete suggestion with ETS csv File
                  $("#node-input-topicSave").autocomplete({
                      minLength: 0,
                      source: function (request, response) {
                          if (!oNodeServer || !oNodeServer.id) { response([]); return; }
                          profileGetJSON("knxUltimatecsv?nodeID=" + oNodeServer.id, (data) => {
                              response($.map(data, function (value, key) {
                                  var sSearch = (value.ga + " (" + value.devicename + ") DPT" + value.dpt);
                                  if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                                      return {
                                          label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                                          value: value.ga // Value
                                      }
                                  } else {
                                      return null;
                                  }
                              }));
                          });
                      }, select: function (event, ui) {
                          // Sets Datapoint and device name automatically
                          var sDevName = ui.item.label.split("#")[1].trim();
                          try {
                              sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                          } catch (error) {
                          }
                          $('#node-input-name').val($('#node-input-name').val().split("/")[0] + "/Save: " + sDevName);
                          var optVal = $("#node-input-dptSave option:contains('" + ui.item.label.split("#")[2].trim() + "')").attr('value');
                          var $dptSelect = $("#node-input-dptSave");
                          if (optVal !== undefined && optVal !== null) {
                              $dptSelect.val(optVal).trigger('change');
                          } else {
                              $dptSelect.trigger('change');
                          }
                      }
                  }).focus(function () {
                      $(this).autocomplete('search', $(this).val() + 'exactmatch');
                  });

                  // 02/04/2020 Adjust trigger value accordingly
                  $("#node-input-dptSave").on("change.knxUtilityProfile", function () {
                      if ($(this).val() !== null) {
                          if ($(this).val().indexOf("3.007") > -1) {
                              // It's a DIM. Suggest the right value
                              $("#node-input-topicSaveTrigger").val("{decr_incr:1, data:5}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT3007"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })
                          } else if ($(this).val().indexOf("18.001") > -1) {
                              // It's a scene actuator. Suggest the right value
                              $("#node-input-topicSaveTrigger").val("{save_recall:1, scenenumber:2}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT18001"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })

                          } else if ($(this).val().indexOf("232.600") > -1) {
                              // It's a scene actuator. Suggest the right value
                              $("#node-input-topicSaveTrigger").val("{red:0, green:0, blue:0}");
                              var myNotification = RED.notify(node._("knxUltimateSceneController.advanced.notify-DPT232600"),
                                  {
                                      modal: true,
                                      fixed: true,
                                      type: 'info',
                                      buttons: [
                                          {
                                              text: "OK",
                                              click: function (e) {
                                                  myNotification.close();
                                              }
                                          }]
                                  })

                          }

                      }
                  });
                  // ########################


                  // Scene configuration
                  function resizeRule(rule) { }
                  $("#node-input-rule-container").css('min-height', '150px').css('min-width', '450px').editableList({
                      addItem: function (container, i, opt) { // row, index, data
                          // opt.r is: { topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt:rowRuleDPT, send: rowRuleSend}

                          if (!opt.hasOwnProperty('r')) {
                              opt.r = {};
                          }
                          var rule = opt.r;
                          if (!opt.hasOwnProperty('i')) {
                              opt._i = Math.floor((0x99999 - 0x10000) * Math.random()).toString();
                          }
                          container.css({
                              overflow: 'hidden',
                              whiteSpace: 'nowrap'
                          });


                          var row = $('<div class="form-row"/>').appendTo(container);
                          var row2 = $('<div class="form-row"/>', { style: "padding-top: 5px; padding-left: 5px;" }).appendTo(container);

                          var oTopicField = $("<input/>", { class: "rowRuleTopic", type: "text", placeholder: "1/1/1, wait or device name", style: "width:140px; margin-left: 5px; text-align: left;" }).appendTo(row);
                          var oDPTField = $('<select/>', { class: "rowRuleDPT", type: "text", style: "width:160px; margin-left: 5px; text-align: left;" }).appendTo(row);
                          var finalspan = $('<span/>', { style: "" }).appendTo(row);
                          finalspan.append(' &#8594; <span class="node-input-rule-index"></span> ');
                          var oSendField = $('<input/>', { class: "rowRuleSend", type: "text", placeholder: "Value", style: "width:150px; margin-left: 5px; text-align: left;" }).appendTo(row);
                          var orowRuleDeviceName = $('<input/>', { class: "rowRuleDeviceName", type: "text", style: "width:95%; margin-left: 0px; text-align: left;font-style: italic;", placeholder: "Device Name" }).appendTo(row2);

                          oTopicField.on("change.knxUtilityProfile", function () {
                              resizeRule(container);
                          });

                          loadDptOptions(oDPTField, rule.dpt);

                          // Autocomplete suggestion with ETS csv File
                          oTopicField.autocomplete({
                              minLength: 0,
                              source: function (request, response) {
                                  if (!oNodeServer || !oNodeServer.id) { response([]); return; }
                                  profileGetJSON("knxUltimatecsv?nodeID=" + oNodeServer.id, (data) => {
                                      response($.map(data, function (value, key) {
                                          var sSearch = (value.ga + " (" + value.devicename + ") DPT" + value.dpt);
                                          if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                                              return {
                                                  label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                                                  value: value.ga // Value
                                              }
                                          } else {
                                              return null;
                                          }
                                      }));
                                  });
                              }, select: function (event, ui) {
                                  // Sets Datapoint and device name automatically
                                  var sDevName = ui.item.label.split("#")[1].trim();
                                  try {
                                      sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                                      orowRuleDeviceName.val(sDevName);
                                  } catch (error) {
                                  }
                                  var optVal = $(".rowRuleDPT option:contains('" + ui.item.label.split("#")[2].trim() + "')").attr('value');
                                  var $dptSelect = oDPTField;
                                  if (optVal !== undefined && optVal !== null) {
                                      $dptSelect.val(optVal).trigger('change');
                                  } else {
                                      $dptSelect.trigger('change');
                                  }
                              }
                          });
                          oTopicField.on('focus.knxUltimateSceneController click.knxUltimateSceneController', function () {
                              try {
                                  $(this).autocomplete('search', '');
                              } catch (error) { /* empty */ }
                          });
                          try { if (oNodeServer && oNodeServer.id) KNX_enableSecureFormatting(oTopicField, oNodeServer.id); } catch (e) {}

                          oTopicField.val(rule.topic);
                          oSendField.val(rule.send);
                          orowRuleDeviceName.val(rule.devicename);
                          oTopicField.change();
                      },
                      removeItem: function (opt) {
                      },
                      resizeItem: resizeRule,
                      sortItems: function (rules) {
                      },
                      sortable: true,
                      removable: true
                  });


                  // 10/03/2020 For each rule, create a row
                  for (var i = 0; i < (this.rules || []).length; i++) {
                      var rule = this.rules[i];
                      $("#node-input-rule-container").editableList('addItem', { r: rule, i: i });
                  }


              },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }

                  var node = this;

                  var rules = $("#node-input-rule-container").editableList('items');
                  node.rules = [];
                  rules.each(function (i) {
                      var rule = $(this);
                      var rowRuleTopic = rule.find(".rowRuleTopic").val();
                      var rowRuleDPT = rule.find(".rowRuleDPT").val();
                      var rowRuleSend = rule.find(".rowRuleSend").val();
                      var rowRuleDeviceName = rule.find(".rowRuleDeviceName").val();
                      node.rules.push({ topic: rowRuleTopic, devicename: rowRuleDeviceName, dpt: rowRuleDPT, send: rowRuleSend });
                  });
              },
              oneditresize: function (size) {
                  const list = $('#node-input-rule-container');
                  const listTop = list.offset();
                  const formTop = $('#dialog-form').offset();
                  if (!size || !listTop || !formTop) return;
                  list.editableList('height', Math.max(180, size.height - (listTop.top - formTop.top) - 45));
              }
          })
    },
    "loadcontrol": function (RED) {
      const utilityFieldValue = (node, key) => {
        if (node._utilityEditor && typeof $ === 'function') {
          const field = $('#node-input-' + key);
          if (field.length) return field.is(':checkbox') ? field.is(':checked') : field.val();
        }
        return node[key];
      };
      const utilityNumber = (minimum, integer = false, enabled = () => true) => function (value) {
        if (!enabled(this)) return true;
        const numeric = Number(value);
        return value !== null && value !== undefined && String(value).trim() !== '' &&
          Number.isFinite(numeric) && numeric >= minimum && (!integer || Number.isInteger(numeric));
      };

      RED.nodes.registerType('knxUltimateLoadControl', {
              category: "KNX Ultimate",
              color: '#C7E9C0',
              defaults: {
                  server: { type: "knxUltimate-config", required: false },
                  name: { value: "" },
                  controlMode: { value: "auto" },
                  topic: { value: "" },
                  dpt: { value: "" },
                  wattLimit: { value: 3000, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'controlMode') !== 'msg') },
                  sheddingCheckInterval: { value: 15, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'controlMode') !== 'msg') },
                  sheddingRestoreDelay: { value: 60, validate: utilityNumber(0.001, false, (node) => utilityFieldValue(node, 'controlMode') !== 'msg') },
                  GA1: { value: "" },
                  DPT1: { value: "" },
                  Name1: { value: "" },
                  autoRestore1: { value: true },
                  MonitorGA1: { value: "" },
                  MonitorDPT1: { value: "" },
                  MonitorName1: { value: "" },
                  GA2: { value: "" },
                  DPT2: { value: "" },
                  Name2: { value: "" },
                  autoRestore2: { value: true },
                  MonitorGA2: { value: "" },
                  MonitorDPT2: { value: "" },
                  MonitorName2: { value: "" },
                  GA3: { value: "" },
                  DPT3: { value: "" },
                  Name3: { value: "" },
                  autoRestore3: { value: true },
                  MonitorGA3: { value: "" },
                  MonitorDPT3: { value: "" },
                  MonitorName3: { value: "" },
                  GA4: { value: "" },
                  DPT4: { value: "" },
                  Name4: { value: "" },
                  autoRestore4: { value: true },
                  MonitorGA4: { value: "" },
                  MonitorDPT4: { value: "" },
                  MonitorName4: { value: "" },
                  GA5: { value: "" },
                  DPT5: { value: "" },
                  Name5: { value: "" },
                  autoRestore5: { value: true },
                  MonitorGA5: { value: "" },
                  MonitorDPT5: { value: "" },
                  MonitorName5: { value: "" }
              },
              inputs: 1,
              outputs: 1,
              icon: "node-alerter-icon.svg",
              label: function () {
                  return (this.name || this.topic || "KNX Load Control");
              },
              paletteLabel: "KNX Load Control",
              oneditprepare: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  const editorSession = { active: true };
                  this._knxUtilityProfileSession = editorSession;
                  // Ignore responses belonging to a closed editor or a previous gateway.
                  const profileGetJSON = (url, callback) => {
                      const serverId = $('#node-input-server').val();
                      return $.getJSON(url, (data) => {
                          if (editorSession.active && $('#node-input-server').val() === serverId) callback(data);
                      });
                  };

                  const dptFields = [];
                  const dptRequests = new Map();
                  const loadDptOptions = (field, savedValue, track = true) => {
                      if (track) {
                          dptFields.push(field);
                          // Preserve persisted values even when Done is pressed before
                          // the asynchronous DPT catalog has arrived.
                          field.append($('<option></option>').attr('value', savedValue || '').text(savedValue || ''));
                          field.val(savedValue || '');
                      }
                      const serverId = $('#node-input-server').val();
                      if (!dptRequests.has(serverId)) {
                          dptRequests.set(serverId, new Promise((resolve) => {
                              profileGetJSON('knxUltimateDpts?serverId=' + encodeURIComponent(serverId || ''), resolve);
                          }));
                      }
                      dptRequests.get(serverId).then((data) => {
                          if (!editorSession.active || $('#node-input-server').val() !== serverId) return;
                          const selected = field.val();
                          field.empty().append($('<option></option>').attr('value', '').text(''));
                          const rows = Array.isArray(data) ? data : [];
                          rows.forEach((dpt) => field.append($('<option></option>').attr('value', dpt.value).text(dpt.text)));
                          if (selected && !rows.some((dpt) => String(dpt.value) === String(selected))) {
                              field.append($('<option></option>').attr('value', selected).text(selected));
                          }
                          field.val(selected || '');
                      });
                  };
                  // Go to the help panel
                  try {
                      RED.sidebar.show("help");
                  } catch (error) { }

                  var node = this;
                  var oNodeServer = RED.nodes.node($("#node-input-server").val()); // Store the config-node

                  // 19/02/2020 Used to get the server sooner als deploy.
                  $("#node-input-server").off(".knxUtilityProfile").on("change.knxUtilityProfile", function () {
                      try {
                          oNodeServer = RED.nodes.node($(this).val());
                          dptFields.forEach((field) => loadDptOptions(field, field.val(), false));
                      } catch (error) { }
                  });



                  loadDptOptions($('#node-input-dpt'), this.dpt);
                  for (let index = 1; index < 6; index++) {
                      loadDptOptions($('#node-input-DPT' + index), this['DPT' + index]);
                      loadDptOptions($('#node-input-MonitorDPT' + index), this['MonitorDPT' + index]);
                  }

                  const toggleAutoFields = () => {
                      const mode = ($("#node-input-controlMode").val() || "auto").toString();
                      if (mode === "msg") {
                          $(".knx-lc-auto-only").hide();
                      } else {
                          $(".knx-lc-auto-only").show();
                      }
                  };

                  $("#node-input-controlMode").on("change.knxUtilityProfile", toggleAutoFields);

                  // Autocomplete suggestion with ETS csv File
                  this.autoComplete = (_Name, _DPT) => {
                      let paramAutoComplete = {
                          minLength: 0,
                          source: function (request, response) {
                              if (!oNodeServer || !oNodeServer.id) { response([]); return; }
                              profileGetJSON("knxUltimatecsv?nodeID=" + oNodeServer.id, (data) => {
                                  response($.map(data, function (value, key) {
                                      var sSearch = (value.ga + " (" + value.devicename + ") DPT" + value.dpt);
                                      if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                                          return {
                                              label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                                              value: value.ga // Value
                                          }
                                      } else {
                                          return null;
                                      }
                                  }));
                              });
                          }, select: function (event, ui) {
                              // Sets Datapoint and device name automatically
                              var sDevName = ui.item.label.split("#")[1].trim();
                              try {
                                  sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                              } catch (error) {
                              }
                              if (_Name === "name") {
                                  $("#node-input-" + _Name).val("Load Control for " + sDevName);
                              } else {
                                  $("#node-input-" + _Name).val(sDevName);
                              }

                              var optVal = $("#node-input-dpt option:contains('" + ui.item.label.split("#")[2].trim() + "')").attr('value');
                              var $dptSelect = $("#node-input-" + _DPT);
                              if (optVal !== undefined && optVal !== null) {
                                  $dptSelect.val(optVal).trigger('change');
                              } else {
                                  $dptSelect.trigger('change');
                              }
                          }
                      };
                      return paramAutoComplete;
                  };

                  $("#node-input-topic").autocomplete(this.autoComplete("name", "dpt")).on('focus.knxUltimateLoadControl click.knxUltimateLoadControl', function () {
                      try {
                          $(this).autocomplete('search', '');
                      } catch (error) { /* empty */ }
                  });
                  try { var srv = RED.nodes.node($("#node-input-server").val()); if (srv && srv.id) KNX_enableSecureFormatting($("#node-input-topic"), srv.id); } catch (e) {}
                  for (let index = 1; index < 6; index++) {
                      $("#node-input-GA" + index).autocomplete(this.autoComplete("Name" + index, "DPT" + index)).on('focus.knxUltimateLoadControl click.knxUltimateLoadControl', function () {
                          try {
                              $(this).autocomplete('search', '');
                          } catch (error) { /* empty */ }
                      });
                      $("#node-input-MonitorGA" + index).autocomplete(this.autoComplete("MonitorName" + index, "MonitorDPT" + index)).on('focus.knxUltimateLoadControl click.knxUltimateLoadControl', function () {
                          try {
                              $(this).autocomplete('search', '');
                          } catch (error) { /* empty */ }
                      });
                      try { var srv2 = RED.nodes.node($("#node-input-server").val()); if (srv2 && srv2.id) KNX_enableSecureFormatting($("#node-input-GA" + index), srv2.id); } catch (e) {}
                      try { var srv3 = RED.nodes.node($("#node-input-server").val()); if (srv3 && srv3.id) KNX_enableSecureFormatting($("#node-input-MonitorGA" + index), srv3.id); } catch (e) {}
                  }

                  toggleAutoFields();


              },
              oneditcancel: function () {
                  if (this._knxUtilityProfileSession) this._knxUtilityProfileSession.active = false;
                  $('#node-input-server').off('.knxUtilityProfile');
                  try { RED.sidebar.show('info'); } catch (error) { }
              },
              oneditsave: function () {
                  // Return to the info tab
                  try {
                      RED.sidebar.show("info");
                  } catch (error) { }


              },
              oneditresize: function (size) {

              }
          })
    },
    "hatranslator": function (RED) {
      const defaultTranslations = 'on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false';

      RED.nodes.registerType('knxUltimateHATranslator', {
          category: 'KNX Ultimate',
          defaults: {
              name: { value: '' },
              payloadPropName: { value: 'payload', required: false },
              haTranslationTable: { value: defaultTranslations, required: false }
          },
          inputs: 1,
          outputs: 1,
          icon: 'node-ha-icon.svg',
          label: function () { return this.name || 'HA -> KNX'; },
          color: '#AED6F1',
          paletteLabel: 'Home Assistant translator',
          oneditprepare: function () {
              this.editor = RED.editor.createEditor({
                  id: 'node-input-editorcommandText',
                  mode: 'ace/mode/text',
                  value: this.haTranslationTable === undefined || this.haTranslationTable === null ? defaultTranslations : this.haTranslationTable
              });
          },
          oneditsave: function () {
              // The Utility collects drafts before switching function. Cleanup is a
              // separate step, so repeated collection must leave Ace usable.
              if (this.editor) this.haTranslationTable = this.editor.getValue();
          },
          oneditresize: function () {
              if (this.editor) this.editor.resize();
          },
          oneditcancel: function () {
              // Called for both Done and Cancel, and whenever the profile unmounts.
              // Clear the reference first so cleanup remains idempotent.
              const editor = this.editor;
              delete this.editor;
              if (editor) editor.destroy();
          }
      });
    }
  }

  // Form fragments are mounted inside #knx-utility-profile-editor. The gateway
  // and name fields remain owned by the outer Utility template.
  const PROFILE_TEMPLATES = {
    "alerter": "<div class=\"form-row\">\n    <label for=\"node-input-whentostart\"><i class=\"fa fa-repeat\"></i> <span data-i18n=\"knxUltimateAlerter.properties.node-input-whentostart\"></span> </label>\n    <select id=\"node-input-whentostart\">\n        <option value=\"manualstart\" data-i18n=\"knxUltimateAlerter.selectlists.manualstart\"></option>\n        <option value=\"ifnewalert\" data-i18n=\"knxUltimateAlerter.selectlists.ifnewalert\"></option>\n    </select>\n</div>\n\n<div class=\"form-row\">\n    <label for=\"node-input-timerinterval\" style=\"width:70%\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateAlerter.properties.node-input-timerinterval\"></span> </label>\n    <input type=\"text\" id=\"node-input-timerinterval\" style=\"width:10%\">       \n</div>\n\n<br/>\n<br/>\n<dt><i class=\"fa fa-code-fork\"></i>&nbsp; <span data-i18n=\"knxUltimateAlerter.other.sceneConfig\"></span></dt>\n    <br/>\n    <div class=\"form-row\" id=\"divNode-input-initialreadGAInRules\">\n        &nbsp;&nbsp;<label style=\"width:60%\" for=\"node-input-initialreadGAInRules\">\n            <i class=\"fa fa-question-circle-o\"></i>\n            <span data-i18n=\"knxUltimateAlerter.properties.node-input-initialreadGAInRules\"></span>\n        </label>\n        <select style=\"width:30%\" id=\"node-input-initialreadGAInRules\">\n            <option value=\"0\" data-i18n=\"knxUltimateAlerter.properties.node-input-initialread0\"></option>\n            <option value=\"1\" data-i18n=\"knxUltimateAlerter.properties.node-input-initialread1\"></option>\n        </select>\n    \n    </div>\n<div class=\"form-row node-input-rule-container-row\">\n    <ol id=\"node-input-rule-container\"></ol>\n</div>\n\n<div class=\"form-row\">\n    <p><span data-i18n=\"knxUltimateAlerter.other.add\"></span></p>\n</div>",
    "autoresponder": "<div class=\"form-row\">\n    <label  for=\"node-input-commandText\"><i class=\"fa fa-tasks\"></i> <span data-i18n=\"knxUltimateAutoResponder.respondTo\"></span></label>\n    <input  type=\"text\" id=\"node-input-commandText\">\n</div>",
    "datetime": "<hr>\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateDateTime.section_addresses\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaDateTime\" style=\"width:155px\"><i class=\"fa fa-calendar\"></i> <span data-i18n=\"knxUltimateDateTime.gaDateTime\"></span></label>\n    <input type=\"text\" id=\"node-input-gaDateTime\" style=\"width:110px\" placeholder=\"1/7/1\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameDateTime\" style=\"flex:1; min-width:70px\" placeholder=\"DateTime object\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.nameDateTime\">\n    <label for=\"node-input-dptDateTime\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptDateTime\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaDate\" style=\"width:155px\"><i class=\"fa fa-calendar-o\"></i> <span data-i18n=\"knxUltimateDateTime.gaDate\"></span></label>\n    <input type=\"text\" id=\"node-input-gaDate\" style=\"width:110px\" placeholder=\"1/7/2\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameDate\" style=\"flex:1; min-width:70px\" placeholder=\"Date object\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.nameDate\">\n    <label for=\"node-input-dptDate\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptDate\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaTime\" style=\"width:155px\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateDateTime.gaTime\"></span></label>\n    <input type=\"text\" id=\"node-input-gaTime\" style=\"width:110px\" placeholder=\"1/7/3\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameTime\" style=\"flex:1; min-width:70px\" placeholder=\"Time object\" data-i18n=\"[placeholder]knxUltimateDateTime.placeholders.nameTime\">\n    <label for=\"node-input-dptTime\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptTime\" style=\"width:75px\" readonly>\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateDateTime.section_send\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-sendOnDeploy\" style=\"width:180px\"><i class=\"fa fa-play\"></i> <span data-i18n=\"knxUltimateDateTime.node-input-sendOnDeploy\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-sendOnDeploy\" style=\"width:auto\">\n  </div>\n\n  <div class=\"form-row knx-datetime-deploy-options\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-sendOnDeployDelay\" style=\"width:180px\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateDateTime.node-input-sendOnDeployDelay\"></span></label>\n    <input type=\"number\" id=\"node-input-sendOnDeployDelay\" style=\"width:120px\">\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-periodicSend\" style=\"width:180px\"><i class=\"fa fa-repeat\"></i> <span data-i18n=\"knxUltimateDateTime.node-input-periodicSend\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-periodicSend\" style=\"width:auto\">\n  </div>\n\n  <div class=\"form-row knx-datetime-periodic-options\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-periodicSendInterval\" style=\"width:180px\"><i class=\"fa fa-hourglass\"></i> <span data-i18n=\"knxUltimateDateTime.node-input-periodicSendInterval\"></span></label>\n    <input type=\"number\" id=\"node-input-periodicSendInterval\" style=\"width:120px\">\n    <select id=\"node-input-periodicSendUnit\" style=\"width:160px\">\n      <option value=\"s\" data-i18n=\"knxUltimateDateTime.unit_seconds\"></option>\n      <option value=\"m\" data-i18n=\"knxUltimateDateTime.unit_minutes\"></option>\n    </select>\n  </div>",
    "watchdog": "<div class=\"form-row\">\n        <label for=\"node-input-checkLevel\"><i class=\"fa fa-search\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-checkLevel\"></span> </label>\n        <select id=\"node-input-checkLevel\">\n            <option value=\"Ethernet\" data-i18n=\"knxUltimateWatchDog.selectlists.Ethernet\"></option>\n            <option value=\"Eth+KNX\" data-i18n=\"knxUltimateWatchDog.selectlists.EthKNX\"></option>\n        </select>\n    </div>\n    <div class=\"form-row\" id=\"divHost\">\n        <label for=\"node-input-topic\"><i class=\"fa fa-tasks\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-topic\"></span></label>\n        <input style=\"width:90px;\" type=\"text\" id=\"node-input-topic\" data-i18n=\"[placeholder]knxUltimateWatchDog.placeholder.monitor\"> <span data-i18n=\"knxUltimateWatchDog.booleanHint\"></span>\n    </div>  \n    \n    <div class=\"form-row\">\n        <input type=\"checkbox\" id=\"node-input-autoStart\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n        <label style=\"width:auto\" for=\"node-input-autoStart\">&nbsp;&nbsp;<i class=\"fa fa-play-circle\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-autoStart\"></span> </label>\n    </div>\n    <div class=\"form-row\">\n        <input type=\"checkbox\" id=\"node-input-listenToKnxUltimateNodeErrors\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n        <label style=\"width:auto\" for=\"node-input-listenToKnxUltimateNodeErrors\">&nbsp;&nbsp;<i class=\"fa fa-exclamation-triangle\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-listenToKnxUltimateNodeErrors\"></span> </label>\n    </div>\n    \n    <div id=\"advancedOptionsAccordion\">\n        <h3><span data-i18n=\"knxUltimateWatchDog.properties.advancedOptionsAccordion\"></span></h3>\n        <div>\n            <p>\n                <div class=\"form-row\">\n                    <label for=\"node-input-retryInterval\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-retryInterval\"></span></label>\n                    <input type=\"text\" id=\"node-input-retryInterval\">\n                </div>\n                <div class=\"form-row\">\n                    <label for=\"node-input-maxRetry\"><i class=\"fa fa-undo\"></i> <span data-i18n=\"knxUltimateWatchDog.properties.node-input-maxRetry\"></span></label>\n                    <input type=\"text\" id=\"node-input-maxRetry\">\n                </div>\n            </p>\n        </div>\n    </div>",
    "globalcontext": "<div class=\"form-tips\" style=\"margin-bottom:16px\" data-i18n=\"knxUltimateGlobalContext.advanced.warning\"></div>\n\n<div class=\"form-row\">\n    <label for=\"node-input-exposeAsVariable\" style=\"width:60%;\">\n        <i class=\"fa fa-link\"></i>\n        <span data-i18n=\"knxUltimateGlobalContext.advanced.exposeAsVariable\"></span>\n    </label>\n    <select id=\"node-input-exposeAsVariable\" style=\"width:35%;\">\n        <option value=\"exposeAsVariableNO\" data-i18n=\"knxUltimateGlobalContext.advanced.exposeAsVariableNO\"></option>\n        <option value=\"exposeAsVariableREADONLY\" data-i18n=\"knxUltimateGlobalContext.advanced.exposeAsVariableREADONLY\"></option>\n        <option value=\"exposeAsVariableREADWRITE\" data-i18n=\"knxUltimateGlobalContext.advanced.exposeAsVariableREADWRITE\"></option>\n    </select>\n</div>\n\n<div class=\"form-row\">\n    <label for=\"node-input-writeExecutionInterval\" style=\"width:60%;\">\n        <i class=\"fa fa-link\"></i>\n        <span data-i18n=\"knxUltimateGlobalContext.advanced.writeExecutionInterval\"></span>\n    </label>\n    <select id=\"node-input-writeExecutionInterval\" style=\"width:35%;\">\n        <option value=250 data-i18n=\"knxUltimateGlobalContext.interval_250ms\"></option>\n        <option value=500 data-i18n=\"knxUltimateGlobalContext.interval_500ms\"></option>\n        <option value=1000 data-i18n=\"knxUltimateGlobalContext.interval_1000ms_default\"></option>\n        <option value=1500 data-i18n=\"knxUltimateGlobalContext.interval_1500ms\"></option>\n        <option value=2000 data-i18n=\"knxUltimateGlobalContext.interval_2000ms\"></option>\n    </select>\n</div>\n\n<div class=\"form-row\">\n    <label for=\"node-input-contextStorage\" style=\"width:60%;\">\n        <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateGlobalContext.contextStorage\"></span>\n    </label>\n    <input style=\"width:35%;\" type=\"text\" id=\"node-input-contextStorage\" data-i18n=\"[placeholder]knxUltimateGlobalContext.contextStoragePlaceholder\" />\n</div>",
    "logger": "<div class=\"form-row\">\n        <label for=\"node-input-topic\"><i class=\"fa fa-tasks\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-topic\"></span></label>\n        <input type=\"text\" id=\"node-input-topic\" data-i18n=\"[placeholder]knxUltimateLogger.properties.node-input-topic\">\n    </div>\n    \n      \n    \n    <div id=\"mlxETSFileAccordion\">\n        <h3><span data-i18n=\"knxUltimateLogger.properties.mlxETSFileAccordion\"></span></h3>\n        <div>\n            <p>\n                 <div class=\"form-row\">\n                    <input type=\"checkbox\" id=\"node-input-autoStartTimerCreateETSXML\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n                    <label style=\"width:auto\" for=\"node-input-autoStartTimerCreateETSXML\">&nbsp;&nbsp;<i class=\"fa fa-play-circle\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-autoStartTimerCreateETSXML\"></span> </label>\n                </div> \n                 <div class=\"form-row\">\n                    <label style=\"width:290px\" for=\"node-input-saveMode\"><i class=\"fa fa-save\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-saveMode\"></span></label>\n                    <select style=\"width:100%\" id=\"node-input-saveMode\">\n                        <option value=\"emit\" data-i18n=\"knxUltimateLogger.selectlists.saveMode.emit\"></option>\n                        <option value=\"emit_save\" data-i18n=\"knxUltimateLogger.selectlists.saveMode.emit_save\"></option>\n                    </select>\n                </div>\n                <div class=\"form-row\" id=\"knx-logger-filePath-row\">\n                    <label style=\"width:290px\" for=\"node-input-filePath\"><i class=\"fa fa-file-text-o\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-filePath\"></span></label>\n                    <input style=\"width:calc(100% - 80px)\" type=\"text\" id=\"node-input-filePath\" data-i18n=\"[placeholder]knxUltimateLogger.placeholder.node-input-filePath\">\n                    <button type=\"button\" class=\"red-ui-button\" id=\"knx-logger-downloadButton\" style=\"margin-left:6px;\" title=\"Download\">\n                        <i class=\"fa fa-download\"></i>\n                    </button>\n                </div>                \n                <div class=\"form-row\">\n                    <label style=\"width:290px\" for=\"node-input-intervalCreateETSXML\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-intervalCreateETSXML\"></span></label>\n                    <input style=\"width:90px\" type=\"number\" id=\"node-input-intervalCreateETSXML\">\n                </div>\n                <div class=\"form-row\">\n                    <label style=\"width:290px\" for=\"node-input-maxRowsInETSXML\"><i class=\"fa fa-bars\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-maxRowsInETSXML\"></span></label>\n                    <input style=\"width:90px\" type=\"number\" id=\"node-input-maxRowsInETSXML\">\n                </div>               \n            </p>\n        </div>\n\n        <h3><span data-i18n=\"knxUltimateLogger.properties.telegramCounter\"></span></h3>\n        <div>\n            <p>\n                <div class=\"form-row\">\n                    <input type=\"checkbox\" id=\"node-input-autoStartTimerTelegramCounter\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n                    <label style=\"width:auto\" for=\"node-input-autoStartTimerTelegramCounter\">&nbsp;&nbsp;<i class=\"fa fa-play-circle\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-autoStartTimerCreateETSXML\"></span> </label>\n                </div>  \n                <div class=\"form-row\">\n                    <label style=\"width:290px\" for=\"node-input-intervalTelegramCount\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateLogger.properties.node-input-intervalTelegramCount\"></span></label>\n                    <input style=\"width:90px\" type=\"number\" id=\"node-input-intervalTelegramCount\">\n                </div>                \n            </p>\n        </div>\n    </div>",
    "staircase": "<div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-outputtopic\" style=\"width:180px\"><i class=\"fa fa-comment\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-outputtopic\"></span></label>\n    <input type=\"text\" id=\"node-input-outputtopic\" style=\"flex:1\" placeholder=\"events/staircase\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.outputtopic\">\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateStaircase.section_commands\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaOutput\" style=\"width:155px\"><i class=\"fa fa-lightbulb-o\"></i> <span data-i18n=\"knxUltimateStaircase.output\"></span></label>\n    <input type=\"text\" id=\"node-input-gaOutput\" style=\"width:110px\" placeholder=\"1/1/2\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameOutput\" style=\"flex:1; min-width:70px\" placeholder=\"Staircase actuator\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.outputName\">\n    <label for=\"node-input-dptOutput\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptOutput\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaStatus\" style=\"width:155px\"><i class=\"fa fa-info-circle\"></i> <span data-i18n=\"knxUltimateStaircase.status\"></span></label>\n    <input type=\"text\" id=\"node-input-gaStatus\" style=\"width:110px\" placeholder=\"1/1/3\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameStatus\" style=\"flex:1; min-width:70px\" placeholder=\"Status LED\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.statusName\">\n    <label for=\"node-input-dptStatus\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptStatus\" style=\"width:75px\" readonly>\n  </div>\n\n  <div style=\"border-top:1px solid #ccc; margin:10px 0 6px;\"></div>\n\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateStaircase.section_inputs\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaTrigger\" style=\"width:155px\"><i class=\"fa fa-bolt\"></i> <span data-i18n=\"knxUltimateStaircase.trigger\"></span></label>\n    <input type=\"text\" id=\"node-input-gaTrigger\" style=\"width:110px\" placeholder=\"1/1/1\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameTrigger\" style=\"flex:1; min-width:70px\" placeholder=\"Living room switch\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.triggerName\">\n    <label for=\"node-input-dptTrigger\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptTrigger\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaOverride\" style=\"width:155px\"><i class=\"fa fa-toggle-on\"></i> <span data-i18n=\"knxUltimateStaircase.override\"></span></label>\n    <input type=\"text\" id=\"node-input-gaOverride\" style=\"width:110px\" placeholder=\"1/1/4\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameOverride\" style=\"flex:1; min-width:70px\" placeholder=\"Maintenance override\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.overrideName\">\n    <label for=\"node-input-dptOverride\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptOverride\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaBlock\" style=\"width:155px\"><i class=\"fa fa-hand-paper-o\"></i> <span data-i18n=\"knxUltimateStaircase.block\"></span></label>\n    <input type=\"text\" id=\"node-input-gaBlock\" style=\"width:110px\" placeholder=\"1/1/5\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameBlock\" style=\"flex:1; min-width:70px\" placeholder=\"Block command\" data-i18n=\"[placeholder]knxUltimateStaircase.placeholders.blockName\">\n    <label for=\"node-input-dptBlock\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptBlock\" style=\"width:75px\" readonly>\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-timerSeconds\" style=\"width:180px\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-timerSeconds\"></span></label>\n    <input type=\"number\" id=\"node-input-timerSeconds\" style=\"width:140px\" min=\"1\">\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-extendMode\" style=\"width:180px\"><i class=\"fa fa-repeat\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-extendMode\"></span></label>\n    <select id=\"node-input-extendMode\" style=\"flex:1\">\n      <option value=\"restart\" data-i18n=\"knxUltimateStaircase.extend_restart\"></option>\n      <option value=\"extend\" data-i18n=\"knxUltimateStaircase.extend_extend\"></option>\n      <option value=\"ignore\" data-i18n=\"knxUltimateStaircase.extend_ignore\"></option>\n    </select>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-triggerOffCancels\" style=\"width:180px\"><i class=\"fa fa-power-off\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-triggerOffCancels\"></span></label>\n    <select id=\"node-input-triggerOffCancels\" style=\"flex:1\">\n      <option value=\"yes\" data-i18n=\"knxUltimateStaircase.opt_yes\"></option>\n      <option value=\"no\" data-i18n=\"knxUltimateStaircase.opt_no\"></option>\n    </select>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-blockAction\" style=\"width:180px\"><i class=\"fa fa-ban\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-blockAction\"></span></label>\n    <select id=\"node-input-blockAction\" style=\"flex:1\">\n      <option value=\"off\" data-i18n=\"knxUltimateStaircase.block_off\"></option>\n      <option value=\"keep\" data-i18n=\"knxUltimateStaircase.block_keep\"></option>\n    </select>\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-preWarnEnable\" style=\"width:180px\"><i class=\"fa fa-exclamation-triangle\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-preWarnEnable\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-preWarnEnable\" style=\"width:auto\">\n  </div>\n\n  <div class=\"form-row knx-staircase-prewarn\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-preWarnSeconds\" style=\"width:180px\"><i class=\"fa fa-hourglass-end\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-preWarnSeconds\"></span></label>\n    <input type=\"number\" id=\"node-input-preWarnSeconds\" style=\"width:140px\" min=\"1\">\n  </div>\n\n  <div class=\"form-row knx-staircase-prewarn\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-preWarnMode\" style=\"width:180px\"><i class=\"fa fa-bullhorn\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-preWarnMode\"></span></label>\n    <select id=\"node-input-preWarnMode\" style=\"flex:1\">\n      <option value=\"status\" data-i18n=\"knxUltimateStaircase.prewarn_status\"></option>\n      <option value=\"flash\" data-i18n=\"knxUltimateStaircase.prewarn_flash\"></option>\n    </select>\n  </div>\n\n  <div class=\"form-row knx-staircase-prewarn knx-staircase-prewarn-flash\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-preWarnFlashMs\" style=\"width:180px\"><i class=\"fa fa-lightbulb-o\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-preWarnFlashMs\"></span></label>\n    <input type=\"number\" id=\"node-input-preWarnFlashMs\" style=\"width:140px\" min=\"50\">\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-emitEvents\" style=\"width:180px\"><i class=\"fa fa-sign-out\"></i> <span data-i18n=\"knxUltimateStaircase.node-input-emitEvents\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-emitEvents\" style=\"width:auto\">\n  </div>\n\n  <br/><br/><br/><br/>",
    "garage": "<div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-outputtopic\" style=\"width:180px\"><i class=\"fa fa-comment\"></i> <span data-i18n=\"knxUltimateGarage.node-input-outputtopic\"></span></label>\n    <input type=\"text\" id=\"node-input-outputtopic\" style=\"flex:1\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.outputtopic\">\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateGarage.section_commands\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaCommand\" style=\"width:155px\"><i class=\"fa fa-exchange\"></i> <span data-i18n=\"knxUltimateGarage.command\"></span></label>\n    <input type=\"text\" id=\"node-input-gaCommand\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameCommand\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.commandName\">\n    <label for=\"node-input-dptCommand\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptCommand\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaImpulse\" style=\"width:155px\"><i class=\"fa fa-bolt\"></i> <span data-i18n=\"knxUltimateGarage.impulse\"></span></label>\n    <input type=\"text\" id=\"node-input-gaImpulse\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameImpulse\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.impulseName\">\n    <label for=\"node-input-dptImpulse\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptImpulse\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaMoving\" style=\"width:155px\"><i class=\"fa fa-arrows-h\"></i> <span data-i18n=\"knxUltimateGarage.moving\"></span></label>\n    <input type=\"text\" id=\"node-input-gaMoving\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameMoving\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.movingName\">\n    <label for=\"node-input-dptMoving\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptMoving\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaObstruction\" style=\"width:155px\"><i class=\"fa fa-exclamation-triangle\"></i> <span data-i18n=\"knxUltimateGarage.obstruction\"></span></label>\n    <input type=\"text\" id=\"node-input-gaObstruction\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameObstruction\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.obstructionName\">\n    <label for=\"node-input-dptObstruction\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptObstruction\" style=\"width:75px\" readonly>\n  </div>\n\n  <div style=\"border-top:1px solid #ccc; margin:10px 0 6px;\"></div>\n\n  <div class=\"form-row\" style=\"margin:4px 0 2px;\">\n    <span style=\"font-weight:bold;\" data-i18n=\"knxUltimateGarage.section_inputs\"></span>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaHoldOpen\" style=\"width:155px\"><i class=\"fa fa-pause\"></i> <span data-i18n=\"knxUltimateGarage.holdOpen\"></span></label>\n    <input type=\"text\" id=\"node-input-gaHoldOpen\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameHoldOpen\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.holdOpenName\">\n    <label for=\"node-input-dptHoldOpen\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptHoldOpen\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaDisable\" style=\"width:155px\"><i class=\"fa fa-ban\"></i> <span data-i18n=\"knxUltimateGarage.disable\"></span></label>\n    <input type=\"text\" id=\"node-input-gaDisable\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-nameDisable\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.disableName\">\n    <label for=\"node-input-dptDisable\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptDisable\" style=\"width:75px\" readonly>\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px;\">\n    <label for=\"node-input-gaPhotocell\" style=\"width:155px\"><i class=\"fa fa-lightbulb-o\"></i> <span data-i18n=\"knxUltimateGarage.photocell\"></span></label>\n    <input type=\"text\" id=\"node-input-gaPhotocell\" style=\"width:110px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.ga\">\n    <input type=\"text\" id=\"node-input-namePhotocell\" style=\"flex:1; min-width:70px\" data-i18n=\"[placeholder]knxUltimateGarage.placeholders.photocellName\">\n    <label for=\"node-input-dptPhotocell\" style=\"width:30px; text-align:right\">DPT</label>\n    <input type=\"text\" id=\"node-input-dptPhotocell\" style=\"width:75px\" readonly>\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-autoCloseEnable\" style=\"width:180px\"><i class=\"fa fa-clock-o\"></i> <span data-i18n=\"knxUltimateGarage.autoCloseEnable\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-autoCloseEnable\" style=\"width:auto\">\n  </div>\n\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-autoCloseSeconds\" style=\"width:180px\"><i class=\"fa fa-hourglass-end\"></i> <span data-i18n=\"knxUltimateGarage.autoCloseSeconds\"></span></label>\n    <input type=\"number\" id=\"node-input-autoCloseSeconds\" style=\"width:140px\" min=\"1\">\n  </div>\n\n  <hr>\n  <div class=\"form-row\" style=\"display:flex; align-items:center;\">\n    <label for=\"node-input-emitEvents\" style=\"width:180px\"><i class=\"fa fa-sign-out\"></i> <span data-i18n=\"knxUltimateGarage.node-input-emitEvents\"></span></label>\n    <input type=\"checkbox\" id=\"node-input-emitEvents\" style=\"width:auto\">\n  </div>\n\n  <br/><br/><br/><br/>",
    "scenecontroller": "<div id=\"GAandDPT\">\n    <div class=\"form-row\">\n        <label for=\"node-input-topic\" style=\"width:100px;\"><i class=\"fa fa-play\"></i> <span data-i18n=\"knxUltimateSceneController.properties.node-input-topic\"></span></label>\n        <input type=\"text\" id=\"node-input-topic\" placeholder=\"Ex: 1/1/1\" style=\"width:80px;margin-left: 5px; text-align: left;\">\n       \n        <label for=\"node-input-dpt\" style=\"width:90px; margin-left: 0px; text-align: right;\"><i class=\"fa fa-microchip\"></i>\n            <span data-i18n=\"knxUltimateSceneController.properties.node-input-dpt\"></span> </label>\n        <select id=\"node-input-dpt\" style=\"width:140px;\"></select>\n       \n        <label for=\"node-input-topicTrigger\" style=\"width:60px;text-align: right;\"><i class=\"fa fa-bolt\"></i> <span data-i18n=\"knxUltimateSceneController.properties.node-input-topicTrigger\"></span></label>\n        <input type=\"text\" id=\"node-input-topicTrigger\" placeholder=\"Ex: 5 or true\" style=\"width:100px;margin-left: 5px; text-align: left;\">\n        \n    </div>\n    <div class=\"form-row\">\n        <label for=\"node-input-topicSave\" style=\"width:100px;\"><i class=\"fa fa-floppy-o\"></i> <span data-i18n=\"knxUltimateSceneController.properties.node-input-topicSave\"></span></label>\n        <input type=\"text\" id=\"node-input-topicSave\" placeholder=\"Ex: 1/1/2\" style=\"width:80px;margin-left: 5px; text-align: left;\">\n        \n        <label for=\"node-input-dptSave\" style=\"width:90px; margin-left: 0px; text-align: right;\"><i class=\"fa fa-microchip\"></i>\n            <span data-i18n=\"knxUltimateSceneController.properties.node-input-dpt\"></span> </label>\n        <select id=\"node-input-dptSave\" style=\"width:140px;\"></select>\n\n        <label for=\"node-input-topicSaveTrigger\" style=\"width:60px;text-align: right;\"><i class=\"fa fa-bolt\"></i>  <span data-i18n=\"knxUltimateSceneController.properties.node-input-topicTrigger\"></span></label>\n        <input type=\"text\" id=\"node-input-topicSaveTrigger\" data-i18n=\"[placeholder]knxUltimateSceneController.placeholder.valueexample\" style=\"width:100px;margin-left: 5px; text-align: left;\">\n    </div>\n</div>\n\n<div class=\"form-row\" id=\"divTopic\">\n    <label for=\"node-input-outputtopic\"><i class=\"fa fa-tasks\"></i>  <span data-i18n=\"knxUltimateSceneController.properties.node-input-outputtopic\"></span> </label>\n    <input type=\"text\" id=\"node-input-outputtopic\" data-i18n=\"[placeholder]knxUltimateSceneController.placeholder.leaveempty\">\n</div>\n\n\n<dt><i class=\"fa fa-code-fork\"></i>&nbsp; <span data-i18n=\"knxUltimateSceneController.other.sceneConfig\"></span></dt>\n<div class=\"form-row node-input-rule-container-row\">\n    <ol id=\"node-input-rule-container\"></ol>\n</div>\n\n<div class=\"form-row\">\n    <p><span data-i18n=\"knxUltimateSceneController.other.add\"></span></p>\n</div>",
    "loadcontrol": "<div class=\"form-row\">\n    <i class=\"fa fa-sliders\"></i>\n    <label style=\"width:100px\" for=\"node-input-controlMode\">\n            <span data-i18n=\"knxUltimateLoadControl.properties.node-input-controlMode\"></span>\n    </label>\n    <select style=\"width:40%\" id=\"node-input-controlMode\">\n        <option value=\"auto\" data-i18n=\"knxUltimateLoadControl.selectlists.controlModeAuto\"></option>\n        <option value=\"msg\" data-i18n=\"knxUltimateLoadControl.selectlists.controlModeMsg\"></option>\n    </select>\n</div>\n\n<div class=\"form-row knx-lc-auto-only\">\n    <i class=\"fa fa-battery-full\"></i>\n    <label style=\"width:100px\" for=\"node-input-topic\">\n            <span data-i18n=\"knxUltimateLoadControl.properties.node-input-topic\"></span>\n    </label>\n    <input style=\"width:15%\" type=\"text\" id=\"node-input-topic\" placeholder=\"Ex: 1/1/1\" />\n    <select style=\"width:15%\" id=\"node-input-dpt\"></select>\n</div>\n\n<div class=\"form-row knx-lc-auto-only\">\n    <i class=\"fa fa-exclamation\"></i>\n    <label style=\"width:125px\" for=\"node-input-wattLimit\">\n            <span data-i18n=\"knxUltimateLoadControl.properties.node-input-wattLimit\"></span>\n    </label>\n    <input style=\"width:40%\" type=\"text\" id=\"node-input-wattLimit\" placeholder=\"Ex. 3000\">      \n</div>\n\n<div class=\"form-row knx-lc-auto-only\">\n    <i class=\"fa fa-toggle-off\"></i>\n    <label style=\"width:125px\" for=\"node-input-sheddingCheckInterval\">\n            <span data-i18n=\"knxUltimateLoadControl.properties.node-input-sheddingCheckInterval\"></span>\n    </label>\n    <input style=\"width:40%\" type=\"text\" id=\"node-input-sheddingCheckInterval\" placeholder=\"\">      \n</div>\n\n<div class=\"form-row knx-lc-auto-only\">\n    <i class=\"fa fa-toggle-on\"></i>\n    <label style=\"width:125px\" for=\"node-input-sheddingRestoreDelay\">\n            <span data-i18n=\"knxUltimateLoadControl.properties.node-input-sheddingRestoreDelay\"></span>\n    </label>\n    <input style=\"width:40%\" type=\"text\" id=\"node-input-sheddingRestoreDelay\" placeholder=\"\">      \n</div>\n\n\n\n<!-- LOAD CONTROL -->\n<hr>\n<b><span data-i18n=\"knxUltimateLoadControl.title\"></span> 1</b>&nbsp;<span data-i18n=\"knxUltimateLoadControl.primoaldistacco\"></span> <br/><br/>\n\n\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-power-off\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-GA1\" placeholder=\"Ex: 1/1/1\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-DPT1\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-Name1\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-battery-half\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-MonitorGA1\" placeholder=\"Optional\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-MonitorDPT1\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-MonitorName1\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\">\n    <input type=\"checkbox\" id=\"node-input-autoRestore1\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n    &nbsp;\n    <label style=\"width:85%\" for=\"node-input-autoRestore1\">\n        <i class=\"fa fa-toggle-on\"></i>\n        <span data-i18n=\"knxUltimateLoadControl.properties.node-input-autoRestore\"></span>\n    </label>\n</div>\n\n<hr>\n<b><span data-i18n=\"knxUltimateLoadControl.title\"></span> 2</b><br/><br/>\n\n\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-power-off\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-GA2\" placeholder=\"Control GA\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-DPT2\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-Name2\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-battery-half\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-MonitorGA2\" placeholder=\"Optional\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-MonitorDPT2\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-MonitorName2\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\">\n    <input type=\"checkbox\" id=\"node-input-autoRestore2\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n    &nbsp;\n    <label style=\"width:85%\" for=\"node-input-autoRestore2\">\n        <i class=\"fa fa-toggle-on\"></i>\n        <span data-i18n=\"knxUltimateLoadControl.properties.node-input-autoRestore\"></span>\n    </label>\n</div>\n\n<hr>\n<b><span data-i18n=\"knxUltimateLoadControl.title\"></span> 3</b><br/><br/>\n\n\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-power-off\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-GA3\" placeholder=\"Control GA\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-DPT3\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-Name3\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-battery-half\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-MonitorGA3\" placeholder=\"Optional\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-MonitorDPT3\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-MonitorName3\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\">\n    <input type=\"checkbox\" id=\"node-input-autoRestore3\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n    &nbsp;\n    <label style=\"width:85%\" for=\"node-input-autoRestore3\">\n        <i class=\"fa fa-toggle-on\"></i>\n        <span data-i18n=\"knxUltimateLoadControl.properties.node-input-autoRestore\"></span>\n    </label>\n</div>\n\n<hr>\n<b><span data-i18n=\"knxUltimateLoadControl.title\"></span> 4</b><br/><br/>\n\n\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-power-off\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-GA4\" placeholder=\"Control GA\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-DPT4\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-Name4\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-battery-half\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-MonitorGA4\" placeholder=\"Optional\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-MonitorDPT4\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-MonitorName4\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\">\n    <input type=\"checkbox\" id=\"node-input-autoRestore4\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n    &nbsp;\n    <label style=\"width:85%\" for=\"node-input-autoRestore4\">\n        <i class=\"fa fa-toggle-on\"></i>\n        <span data-i18n=\"knxUltimateLoadControl.properties.node-input-autoRestore\"></span>\n    </label>\n</div>\n\n<hr>\n<b><span data-i18n=\"knxUltimateLoadControl.title\"></span> 5</b><br/><br/>\n\n\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-power-off\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-GA5\" placeholder=\"Control GA\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-DPT5\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-Name5\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\" style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n    <i class=\"fa fa-battery-half\"></i>\n    \n    <input style=\"width:95px; flex:0 0 95px; min-width:0\" type=\"text\" id=\"node-input-MonitorGA5\" placeholder=\"Optional\" />\n    <select style=\"width:105px; flex:0 0 105px; min-width:0\" id=\"node-input-MonitorDPT5\"></select>\n    <input style=\"flex:1 1 120px; min-width:90px\" type=\"text\" id=\"node-input-MonitorName5\" data-i18n=\"[placeholder]knxUltimateLoadControl.properties.node-input-name\">\n</div>\n<div class=\"form-row\">\n    <input type=\"checkbox\" id=\"node-input-autoRestore5\" style=\"display:inline-block; width:auto; vertical-align:top;\">\n    &nbsp;\n    <label style=\"width:85%\" for=\"node-input-autoRestore5\">\n        <i class=\"fa fa-toggle-on\"></i>\n        <span data-i18n=\"knxUltimateLoadControl.properties.node-input-autoRestore\"></span>\n    </label>\n</div>\n\n</br>\n</br>\n</br>\n</br>",
    "hatranslator": "<div class=\"form-row\">\n    <label for=\"node-input-payloadPropName\"><i class=\"fa fa-ellipsis-h\"></i> <span data-i18n=\"knxUltimateHATranslator.inputProperty\"></span></label>\n    <input type=\"text\" id=\"node-input-payloadPropName\" placeholder=\"payload\">\n</div>\n<div class=\"form-tips\" style=\"margin-bottom:16px\" data-i18n=\"knxUltimateHATranslator.inputHint\"></div>\n<div class=\"form-row\">\n    <label for=\"node-input-editorcommandText\" style=\"width:100%\"><i class=\"fa fa-tasks\"></i> <span data-i18n=\"knxUltimateHATranslator.translations\"></span></label>\n    <div style=\"height:250px; min-height:150px; width:100%;\" class=\"node-text-editor\" id=\"node-input-editorcommandText\"></div>\n</div>\n<div class=\"form-tips\" data-i18n=\"knxUltimateHATranslator.translationHint\"></div>"
  }

  // All supported locales travel with the Utility. The bundle therefore
  // keeps working after the legacy locale files and node types are removed.
  const PROFILE_TRANSLATIONS = {"en":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"KNX Alerter","title":"Alerter node","properties":{"node-input-server":"Gateway","node-input-name":"Name","node-input-timerinterval":"Interval between each MSG (in seconds)","node-input-whentostart":"Alerting cycle start type","node-input-initialread":"Read value of each device on connection/reconnect","node-input-initialread0":"No","node-input-initialread1":"Read from KNX BUS","node-input-initialreadGAInRules":"Read states at start/reconnection"},"selectlists":{"manualstart":"Start alert cycle manually via incoming message","ifnewalert":"Start the alert cycle with each new alerted device"},"other":{"sceneConfig":"Devices to monitor (DPT MUST BE BOOLEAN)","add":"Press Add, to add a device"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"KNX Auto Responder","respondTo":"Respond to"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"Date/Time","paletteLabel":"DateTime","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for node output","section_addresses":"Group addresses","gaDateTime":"DateTime GA (DPT 19.001)","gaDate":"Date GA (DPT 11.001)","gaTime":"Time GA (DPT 10.001)","section_send":"Send options","node-input-sendOnDeploy":"Send on deploy/startup","node-input-sendOnDeployDelay":"Startup delay (seconds)","node-input-periodicSend":"Periodic send","node-input-periodicSendInterval":"Interval","unit_seconds":"Seconds","unit_minutes":"Minutes","notifySent":"Sent to KNX","notifyQueued":"Queued (gateway not connected yet)","placeholders":{"outputtopic":"Optional output topic","ga":"e.g. 1/7/1","nameDateTime":"Optional ETS device name","nameDate":"Optional ETS device name","nameTime":"Optional ETS device name"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"KNX WatchDog","title":"Watchdog","properties":{"node-input-server":"Gateway","node-input-checkLevel":"Check level (please see the wiki)","node-input-topic":"Group Address to monitor","node-input-name":"Node Name","node-input-autoStart":"Auto start the watchdog timer","node-input-listenToKnxUltimateNodeErrors":"Listen to KNX-Ultimate node errors","advancedOptionsAccordion":"Advanced Options","node-input-retryInterval":"Retry interval (in seconds)","node-input-maxRetry":"Number of retry before giving an error"},"placeholder":{"monitor":"Ex: 12/0/0. For 'Only Ethernet' checks, please use a non existent Group Address."},"selectlists":{"Ethernet":"Only Ethernet unicast (Default), using ping. Works ONLY with KNX Interfaces (not routers)","EthKNX":"Ethernet + KNX Twisted Pair, using a real KNX device"},"booleanHint":"DPT must be 1.x (Boolean)"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"KNX Global Context","title":"KNX Global Context","node-input-name":"Variable Name (no spaces, only chars [a-z])","advanced":{"exposeAsVariable":"Expose as Global variable","exposeAsVariableNO":"No","exposeAsVariableREADONLY":"Read Only","exposeAsVariableREADWRITE":"Read/Write","node-input-server":"Gateway","writeExecutionInterval":"BUS write interval","warning":"Warning: a single node is shared between ALL FLOWS. You don't need more than one node; regardless of where it is, you can see the variable GLOBALLY."},"interval_250ms":"250ms","interval_500ms":"500ms","interval_1000ms_default":"1000ms (Default)","interval_1500ms":"1500ms","interval_2000ms":"2000ms","contextStorage":"Context storage","contextStoragePlaceholder":"Optional context storage name"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"KNX Logger","title":"KNX logger for ETS","properties":{"node-input-server":"Gateway","node-input-topic":"Topic","node-input-name":"Node Name","node-input-autoStartTimerCreateETSXML":"Auto start timer","mlxETSFileAccordion":"ETS compatible BUS Diagnostic File","node-input-intervalCreateETSXML":"New payload every (in minutes)","node-input-maxRowsInETSXML":"Max number of rows (0 = no limit)","node-input-saveMode":"Action","node-input-filePath":"File path (absolute or relative)","telegramCounter":"KNX Telegram Counter","node-input-intervalTelegramCount":"Count interval (in seconds)"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"Emit payload only","emit_save":"Emit payload and save to file"}},"noFilePath":"File path is empty"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Staircase light","paletteLabel":"Staircase","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","trigger":"Trigger GA","output":"Output GA","status":"Status GA","override":"Override GA","block":"Block GA","node-input-timerSeconds":"Timer duration (seconds)","node-input-extendMode":"On new trigger","extend_restart":"Restart timer","extend_extend":"Extend remaining time","extend_ignore":"Ignore the trigger","node-input-triggerOffCancels":"0 command cancels the cycle","opt_yes":"Yes","opt_no":"No","node-input-blockAction":"When blocked","block_off":"Force light OFF","block_keep":"Leave current state","node-input-preWarnEnable":"Send pre-warning before timeout","node-input-preWarnSeconds":"Pre-warning offset (seconds)","node-input-preWarnMode":"Pre-warning mode","prewarn_status":"Toggle status GA","prewarn_flash":"Flash output","node-input-preWarnFlashMs":"Flash duration (ms)","node-input-emitEvents":"Emit events on node output","help":{"intro":"Implements a staircase light logic with KNX integration, handling timer, pre-warning, manual override and blocking.","trigger":"Triggers","trigger_ga":"A rising edge (value = 1) on the trigger GA starts the timer. If enabled, a value of 0 will immediately cancel the cycle.","extend":"The \"On new trigger\" option controls how subsequent pulses behave: restart the timer, extend the remaining time or ignore the pulse.","off":"When override is active the timer is paused and the light stays on. Blocking disables new pulses and optionally forces the output off.","outputs":"Group addresses","output_ga":"Output GA is driven with DPT 1.001 by default. Configure other DPTs if required.","status_ga":"Status GA mirrors the stair light state (and the pre-warning flag when enabled).","override_ga":"Override GA keeps the light on while true and suspends the timer.","block_ga":"Block GA prevents new activations. When false, normal behaviour resumes.","prewarn":"Pre-warning","prewarn_desc":"Enable a pre-warning to alert occupants before the light turns off. You can either flash the output or toggle the status GA.","events":"Node output","events_desc":"When enabled the node emits structured events (trigger, extend, prewarn, timeout, override, block) with the remaining time and state information."},"placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/1/5","triggerName":"Trigger device name","outputName":"Output actuator name","statusName":"Status feedback name","overrideName":"Override channel name","blockName":"Block command name"},"section_commands":"Command group addresses","section_inputs":"Input group addresses"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Garage door","paletteLabel":"Garage","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","command":"Command GA (true=open, false=close)","impulse":"Impulse GA","holdOpen":"Hold-open GA","disable":"Disable GA","photocell":"Photocell GA","moving":"Moving GA","obstruction":"Obstruction GA","autoCloseEnable":"Enable auto re-close","autoCloseSeconds":"Auto re-close delay (seconds)","node-input-emitEvents":"Emit events on node output","placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/2/3","commandName":"Door actuator","impulseName":"Impulse input","holdOpenName":"Hold-open switch","disableName":"Disable command","photocellName":"Photocell sensor","movingName":"Movement indicator","obstructionName":"Obstruction indicator"},"help":{"intro":"Controls a KNX garage door with direct open/close commands, impulse inputs, safety sensors and automatic re-close.","commands":"Commands","command_ga":"Use the command GA for boolean control: true opens, false closes. The node also emits this when the auto close triggers.","impulse_ga":"An impulse GA toggles the door. Rising edges toggle the internal state; it is also used if no direct command GA is configured.","holdopen_ga":"Hold-open GA keeps the door open and cancels the auto re-close until it returns to false.","disable_ga":"Disable GA stops the node from issuing new commands. Useful for maintenance or manual mode.","safety":"Safety and status","photocell_ga":"The photocell GA should go true when the beam is interrupted. The node re-opens the door and flags obstruction.","moving_ga":"Movement GA (optional) is pulsed whenever the node commands the door to move, allowing other devices to follow the motion.","obstruction_ga":"Obstruction GA mirrors the obstruction state so other KNX components can react.","auto":"Automatic re-close","auto_close":"Enable the auto re-close timer to close the door automatically after the configured delay once it is open, unless hold-open or disable are active.","events":"Node output","events_desc":"With event emission enabled the node outputs structured messages (open, close, toggle, obstruction, disabled, hold-open, auto-close) for flow logic."},"section_commands":"Command group addresses","section_inputs":"Input / sensor group addresses"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"KNX Scene Controller","title":"Scene controller","properties":{"node-input-server":"Gateway","node-input-topic":"Scene Recall","node-input-dpt":"DPT","node-input-topicTrigger":"Trigger","node-input-topicSave":"Scene Save","node-input-name":"Node Name","node-input-outputtopic":"Topic"},"placeholder":{"leaveempty":"Leave empty to use Group Address","valueexample":"Ex: false, true, otherwise any value"},"other":{"sceneConfig":"Scene default values configuration","add":"Press ADD, to add a device in the scene"},"advanced":{"notify-DPT3007":"You selected a relative DIM. Please <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming'>click here to view this sample</a> and learn how to handle such payload.","notify-DPT18001":"You selected a scene DPT. Please <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator'>click here to view this sample</a> and learn how to handle such payload.","notify-DPT232600":"You selected an RGB DPT. Please <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color'>click here to view this sample</a> and learn how to handle such payload.","notify-DPT251600":"You selected an RGBW DPT. Please <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White'>click here to view this sample</a> and learn how to handle such payload."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"KNX Load Control","title":"Load control","primoaldistacco":"(this is the first to be switched off)","properties":{"node-input-server":"Gateway","node-input-name":"NoNameme","node-input-controlMode":"Mode","node-input-dpt":"DPT","node-input-topic":"Monitor W","node-input-controlGA":"Load","node-input-monitorGA":"In use","node-input-wattLimit":"Limit W","node-input-sheddingCheckInterval":"Delay switch off (s)","node-input-sheddingRestoreDelay":"Delay switch on (s)","node-input-autoRestore":"Automatic recovery"},"selectlists":{"controlModeAuto":"Automatic (internal)","controlModeMsg":"Manual (msg.shedding)"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Home Assistant Translator","inputProperty":"Input property","inputHint":"Message property to translate, for example payload or payload.state.","translations":"Translations (Home Assistant → KNX)","translationHint":"One translation per line, in the format state:true or state:false. For example: on:true and off:false."}}},"it":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"Allertatore KNX","title":"Nodo Alerter","properties":{"node-input-server":"Gateway","node-input-name":"Nome nodo","node-input-timerinterval":"Intervallo tra ciascun messaggio (in secondi)","node-input-whentostart":"Modalità avvio allerta","node-input-initialread":"Leggi il valore di ogni dispositivo alla connessione/riconnessione","node-input-initialread0":"No","node-input-initialread1":"Leggi dal BUS KNX","node-input-initialreadGAInRules":"Leggi stati alla connessione/riconnessione"},"selectlists":{"manualstart":"Avvia ciclo allerta manualmente tramite messaggio in ingresso","ifnewalert":"Avvia il ciclo di allerta a ogni nuovo dispositivo in allarme"},"other":{"sceneConfig":"Dispositivi da monitorare (IL DPT DEVE ESSERE BOOLEANO)","add":"Premi Aggiungi per aggiungere un dispositivo"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"KNX Auto Responder","respondTo":"Rispondi a"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"Data/Ora","paletteLabel":"DataOra","node-input-server":"Gateway KNX","node-input-name":"Nome","node-input-outputtopic":"Topic in uscita del nodo","section_addresses":"Indirizzi di gruppo","gaDateTime":"GA Data/Ora (DPT 19.001)","gaDate":"GA Data (DPT 11.001)","gaTime":"GA Ora (DPT 10.001)","section_send":"Opzioni invio","node-input-sendOnDeploy":"Invia al deploy/avvio","node-input-sendOnDeployDelay":"Ritardo avvio (secondi)","node-input-periodicSend":"Invio periodico","node-input-periodicSendInterval":"Intervallo","unit_seconds":"Secondi","unit_minutes":"Minuti","notifySent":"Inviato su KNX","notifyQueued":"Accodato (gateway non ancora connesso)","placeholders":{"outputtopic":"Topic opzionale in uscita","ga":"es. 1/7/1","nameDateTime":"Nome dispositivo ETS (opz.)","nameDate":"Nome dispositivo ETS (opz.)","nameTime":"Nome dispositivo ETS (opz.)"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"WatchDog KNX","title":"Watchdog","properties":{"node-input-server":"Gateway","node-input-checkLevel":"Livello controllo (vedi Wiki)","node-input-topic":"Indirizzo di gruppo da monitorare","node-input-name":"Nome nodo","node-input-autoStart":"Avvia il watchdog automaticamente","node-input-listenToKnxUltimateNodeErrors":"Ascolta gli errori dei nodi KNX-Ultimate","advancedOptionsAccordion":"Opzioni avanzate","node-input-retryInterval":"Riprova ogni (in secondi)","node-input-maxRetry":"Dopo questo numero di tentativi, segnala l'errore"},"placeholder":{"monitor":"Es: 12/0/0. Per 'Solo Ethernet', usa un GA inesistente."},"selectlists":{"Ethernet":"Solo Ethernet unicast (predefinito), tramite ping. Funziona SOLO con interfacce IP (non con router)","EthKNX":"Ethernet + KNX Twisted Pair, usando un vero dispositivo KNX esistente"},"booleanHint":"Il DPT deve essere 1.x (booleano)"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"Contesto globale KNX","title":"Variabile Globale KNX","node-input-name":"Nome variabile (no spazi, solo [a-z])","advanced":{"exposeAsVariable":"Esponi come variabile globale","exposeAsVariableNO":"No","exposeAsVariableREADONLY":"Sola lettura","exposeAsVariableREADWRITE":"Lettura/Scrittura","node-input-server":"Gateway","writeExecutionInterval":"Intervallo scrittura su BUS","warning":"Attenzione: è sufficiente UN SOLO NODO in tutto il progetto. La variabile verrà vista da tutti i flow, indipendentemente da dove sia stato messo il nodo."},"interval_250ms":"250ms","interval_500ms":"500ms","interval_1000ms_default":"1000ms (Default)","interval_1500ms":"1500ms","interval_2000ms":"2000ms","contextStorage":"Archivio del contesto","contextStoragePlaceholder":"Nome facoltativo dell’archivio del contesto"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"Logger KNX","title":"Logger KNX per ETS","properties":{"node-input-server":"Gateway","node-input-topic":"Topic","node-input-name":"Nome","node-input-autoStartTimerCreateETSXML":"Avvia il timer automaticamente","mlxETSFileAccordion":"File compatibile con diagnostica ETS","node-input-intervalCreateETSXML":"Nuovo payload ogni (in minuti)","node-input-maxRowsInETSXML":"Numero massimo di righe (0 = nessun limite)","node-input-saveMode":"Azione","node-input-filePath":"Percorso file (assoluto o relativo)","telegramCounter":"Contatore telegrammi KNX","node-input-intervalTelegramCount":"Intervallo conteggio (in secondi)"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"Emetti solo il payload","emit_save":"Emetti il payload e salva su file"}},"noFilePath":"Il percorso del file è vuoto"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Temporizzatore scale","paletteLabel":"Temporizzatore scale","node-input-server":"Gateway KNX","node-input-name":"Nome","node-input-outputtopic":"Topic eventi emessi","trigger":"GA impulso","output":"GA uscita","status":"GA stato","override":"GA override","block":"GA blocco","node-input-timerSeconds":"Durata timer (secondi)","node-input-extendMode":"Nuovo impulso","extend_restart":"Riavvia il timer","extend_extend":"Estendi il tempo residuo","extend_ignore":"Ignora l'impulso","node-input-triggerOffCancels":"Il valore 0 annulla il ciclo","opt_yes":"Sì","opt_no":"No","node-input-blockAction":"Quando è bloccato","block_off":"Forza lo spegnimento","block_keep":"Lascia lo stato attuale","node-input-preWarnEnable":"Invia preavviso prima dello spegnimento","node-input-preWarnSeconds":"Preavviso (secondi)","node-input-preWarnMode":"Modalità preavviso","prewarn_status":"Attiva GA stato","prewarn_flash":"Fai lampeggiare l'uscita","node-input-preWarnFlashMs":"Durata lampeggio (ms)","node-input-emitEvents":"Emetti eventi in uscita","help":{"intro":"Gestisce una luce scala con timer KNX, includendo preavviso, override manuale e blocco.","trigger":"Impulsi","trigger_ga":"Un fronte attivo (valore = 1) sulla GA di impulso avvia il timer. Se abilitato, il valore 0 interrompe immediatamente il ciclo.","extend":"L'opzione \"Nuovo impulso\" definisce come comportarsi: riavviare il timer, aggiungere tempo residuo oppure ignorare l'impulso.","off":"Con l'override attivo il timer è sospeso e la luce rimane accesa. Il blocco inibisce nuovi impulsi e, se configurato, spegne l'uscita.","outputs":"Indirizzi di gruppo","output_ga":"La GA di uscita è pilotata in DPT 1.001 (accensione/spegnimento). È possibile indicare altri DPT se necessario.","status_ga":"La GA di stato replica lo stato della scala (e il flag di preavviso quando attivato).","override_ga":"La GA di override mantiene la luce accesa finché vale 1 e sospende il timer.","block_ga":"La GA di blocco evita nuove attivazioni. A 0 il funzionamento torna normale.","prewarn":"Preavviso","prewarn_desc":"Il preavviso avvisa gli occupanti prima dello spegnimento: si può far lampeggiare l'uscita oppure cambiare lo stato sulla GA dedicata.","events":"Uscita del nodo","events_desc":"Se abilitato il nodo emette messaggi strutturati (trigger, extend, prewarn, timeout, override, block) con tempo residuo e stato corrente."},"placeholders":{"outputtopic":"Topic opzionale per gli eventi","ga":"es. 1/1/5","triggerName":"Nome dispositivo impulso","outputName":"Nome attuatore uscita","statusName":"Nome indicatore stato","overrideName":"Nome canale override","blockName":"Nome comando blocco"},"section_commands":"GA di comando","section_inputs":"GA di ingresso"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Portone garage","paletteLabel":"Garage","node-input-server":"Gateway KNX","node-input-name":"Nome","node-input-outputtopic":"Topic eventi emessi","command":"GA comando (true=apre, false=chiude)","impulse":"GA impulso","holdOpen":"GA blocco richiusura","disable":"GA disabilitazione","photocell":"GA fotocellula","moving":"GA in movimento","obstruction":"GA ostruzione","autoCloseEnable":"Abilita richiusura automatica","autoCloseSeconds":"Tempo richiusura automatica (secondi)","node-input-emitEvents":"Emetti eventi in uscita","placeholders":{"outputtopic":"Topic opzionale per gli eventi","ga":"es. 1/2/3","commandName":"Attuatore portone","impulseName":"Ingresso impulso","holdOpenName":"Comando blocco richiusura","disableName":"Comando disabilitazione","photocellName":"Sensore fotocellula","movingName":"Indicatore movimento","obstructionName":"Indicatore ostruzione"},"help":{"intro":"Gestisce un portone garage KNX con comandi diretti, impulso, sensori di sicurezza e richiusura automatica.","commands":"Comandi","command_ga":"La GA comando esegue apertura (true) o chiusura (false). Il nodo la usa anche per la richiusura automatica.","impulse_ga":"La GA impulso commuta il portone. I fronti attivi aggiornano lo stato interno e vengono usati se non è disponibile un comando diretto.","holdopen_ga":"La GA blocco richiusura mantiene il portone aperto e annulla il timer finché torna a false.","disable_ga":"La GA disabilitazione sospende qualsiasi automatismo del nodo (utile in manutenzione).","safety":"Sicurezze e stati","photocell_ga":"La GA fotocellula deve andare a true quando l'ostruzione interrompe il fascio: il nodo riapre subito il portone e segnala l'ostruzione.","moving_ga":"La GA in movimento (opzionale) viene pulsata quando il nodo comanda il portone, così altri dispositivi possono sincronizzarsi.","obstruction_ga":"La GA ostruzione replica lo stato d'allarme per altri componenti KNX.","auto":"Richiusura automatica","auto_close":"Abilita il timer per chiudere automaticamente il portone dopo il tempo impostato, salvo blocco richiusura o disabilitazione attiva.","events":"Uscita del nodo","events_desc":"Con gli eventi attivi il nodo genera messaggi strutturati (open, close, toggle, obstruction, disabled, hold-open, auto-close) per la logica del flow."},"section_commands":"GA di comando","section_inputs":"GA di ingresso/sensori"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"Controller Scene KNX","title":"Controller scena","properties":{"node-input-server":"Gateway","node-input-topic":"Richiama Scena","node-input-dpt":"DPT","node-input-topicTrigger":"Trigger","node-input-topicSave":"Salva Scena","node-input-name":"Nome nodo","node-input-outputtopic":"Topic"},"placeholder":{"leaveempty":"Lascia vuoto per usare l'indirizzo di gruppo","valueexample":"Es: false, true, altrimenti qualsiasi valore"},"other":{"sceneConfig":"Configurazione dei valori predefiniti della scena","add":"Premi Aggiungi per aggiungere un dispositivo alla scena"},"advanced":{"notify-DPT3007":"Hai selezionato un DIM relativo. Per favore <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming'>clicca qui per vedere un esempio</a> e capire come gestire il relativo payload.","notify-DPT18001":"Hai selezionato un DPT scena. Per favore <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator'>clicca qui per vedere un esempio</a> per capire come gestire il relativo payload.","notify-DPT232600":"Hai selezionato un DPT RGB. Per favore <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color'>clicca qui per vedere un esempio</a> per capire come gestire il relativo payload.","notify-DPT251600":"Hai selezionato un DPT RGBW. Per favore <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White'>clicca qui per vedere un esempio</a> per capire come gestire il relativo payload."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"Controllo carichi KNX","title":"Controllo Carichi","primoaldistacco":"(è il primo che verrà staccato)","properties":{"node-input-server":"Gateway","node-input-name":"Nome","node-input-dpt":"DPT","node-input-topic":"Monitor W","node-input-controlGA":"Carico","node-input-monitorGA":"In uso","node-input-controlMode":"Modalità","node-input-wattLimit":"Soglia W","node-input-sheddingCheckInterval":"Ritardo distacco (s)","node-input-sheddingRestoreDelay":"Ritardo ripristino (s)","node-input-autoRestore":"Ripristino automatico"},"selectlists":{"controlModeAuto":"Automatica (interna)","controlModeMsg":"Manuale (msg.shedding)"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Traduttore Home Assistant","inputProperty":"Proprietà in ingresso","inputHint":"Proprietà del messaggio da tradurre, ad esempio payload o payload.state.","translations":"Traduzioni (Home Assistant → KNX)","translationHint":"Una traduzione per riga, nel formato stato:true oppure stato:false. Ad esempio: on:true e off:false."}}},"de":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"KNX Alarmierer","title":"Alerter Knot","properties":{"node-input-server":"Gateway","node-input-name":"Name","node-input-timerinterval":"Intervall zwischen jedem MSG (in Sekunden)","node-input-whentostart":"Starttyp des Alarmierungszyklus","node-input-initialread":"Bei Verbindung/Wiederverbindung je Gerat-Wert lesen","node-input-initialread0":"Nein","node-input-initialread1":"Lesen vom KNX-BUS","node-input-initialreadGAInRules":"Bei Verbindung/Wiederverbindung je Gerat-Wert lesen"},"selectlists":{"manualstart":"Starten den Alarmzyklus manuell über eine eingehende MSG","ifnewalert":"Starten den Alarmzyklus mit jedem neuen alarmierten Gerät"},"other":{"sceneConfig":"Zu überwachende Geräte (DPT MUSS BOOLEAN SEIN)","add":"Drücken Sie Hinzufügen, um ein Gerät hinzuzufügen"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"KNX Auto-Responder","respondTo":"Antworten auf"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"Datum/Uhrzeit","paletteLabel":"Datum/Uhrzeit","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic für Node-Ausgabe","section_addresses":"Gruppenadressen","gaDateTime":"Datum/Uhrzeit GA (DPT 19.001)","gaDate":"Datum GA (DPT 11.001)","gaTime":"Uhrzeit GA (DPT 10.001)","section_send":"Sendeoptionen","node-input-sendOnDeploy":"Beim Deploy/Start senden","node-input-sendOnDeployDelay":"Startverzögerung (Sekunden)","node-input-periodicSend":"Periodisch senden","node-input-periodicSendInterval":"Intervall","unit_seconds":"Sekunden","unit_minutes":"Minuten","notifySent":"An KNX gesendet","notifyQueued":"In Warteschlange (Gateway noch nicht verbunden)","placeholders":{"outputtopic":"Optionales Output-Topic","ga":"z.B. 1/7/1","nameDateTime":"Optionaler ETS-Name","nameDate":"Optionaler ETS-Name","nameTime":"Optionaler ETS-Name"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"KNX WatchDog","title":"Watchdog","properties":{"node-input-server":"Gateway","node-input-checkLevel":"Check level (siehe wiki)","node-input-topic":"Gruppenadresse monitor","node-input-name":"Name","node-input-autoStart":"Watchdog-Timer automatisch starten","node-input-listenToKnxUltimateNodeErrors":"Fehler von KNX-Ultimate-Nodes überwachen","advancedOptionsAccordion":"Erweiterte Optionen","node-input-retryInterval":"Wiederholungsintervall (in Sekunden)","node-input-maxRetry":"Anzahl der Wiederholungen, bevor ein Fehler ausgegeben wird"},"placeholder":{"monitor":"Beispiel: 12/0/0. Bitte für 'Nur Ethernet', verwenden Sie eine nicht vorhandene Gruppenadresse."},"selectlists":{"Ethernet":"Nur Ethernet unicast (Default) mit ping. Funktioniert NUR mit KNX Interface (kein Router)","EthKNX":"Ethernet + KNX Twisted Pair, mit einem echten KNX-Gerät"},"booleanHint":"Der DPT muss 1.x (Boolesch) sein"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"KNX Globaler Kontext","title":"KNX Global Context","node-input-name":"Variablenname (keine Leerzeichen, nur Zeichen [a-z])","advanced":{"exposeAsVariable":"Als globale Variable verfügbar machen","exposeAsVariableNO":"Nein","exposeAsVariableREADONLY":"Nur Lesen","exposeAsVariableREADWRITE":"Lesen/Schreiben","node-input-server":"Gateway","writeExecutionInterval":"BUS-Schreibintervall","warning":"Achtung: Ein einzelner Knoten wird von ALLEN FLOWS gemeinsam genutzt. Sie benötigen nicht mehr als einen Knoten. Unabhängig davon, wo es sich befindet, sie können die Variable auf globaler Ebene sehen."},"interval_250ms":"250ms","interval_500ms":"500ms","interval_1000ms_default":"1000ms (Standard)","interval_1500ms":"1500ms","interval_2000ms":"2000ms","contextStorage":"Kontextspeicher","contextStoragePlaceholder":"Optionaler Name des Kontextspeichers"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"KNX Logger","title":"KNX Logger für ETS","properties":{"node-input-server":"Gateway","node-input-topic":"Topic","node-input-name":"Node Name","node-input-autoStartTimerCreateETSXML":"Timer für automatischen Start","mlxETSFileAccordion":"ETS-kompatible BUS-Diagnosedatei","node-input-intervalCreateETSXML":"Neue Payload-Ausgabe alle (in Minuten)","node-input-maxRowsInETSXML":"Maximale Anzahl von Zeilen (0 = keine Begrenzung)","node-input-saveMode":"Aktion","node-input-filePath":"Dateipfad (absolut oder relativ)","telegramCounter":"KNX Telegrammzähler","node-input-intervalTelegramCount":"Zählintervall (in Sekunden)"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"Nur Payload senden","emit_save":"Payload senden und in Datei speichern"}},"noFilePath":"Der Dateipfad ist leer"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Staircase light","paletteLabel":"Staircase","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","trigger":"Trigger GA","output":"Output GA","status":"Status GA","override":"Override GA","block":"Block GA","node-input-timerSeconds":"Timer duration (seconds)","node-input-extendMode":"On new trigger","extend_restart":"Restart timer","extend_extend":"Extend remaining time","extend_ignore":"Ignore the trigger","node-input-triggerOffCancels":"0 command cancels the cycle","opt_yes":"Yes","opt_no":"No","node-input-blockAction":"When blocked","block_off":"Force light OFF","block_keep":"Leave current state","node-input-preWarnEnable":"Send pre-warning before timeout","node-input-preWarnSeconds":"Pre-warning offset (seconds)","node-input-preWarnMode":"Pre-warning mode","prewarn_status":"Toggle status GA","prewarn_flash":"Flash output","node-input-preWarnFlashMs":"Flash duration (ms)","node-input-emitEvents":"Emit events on node output","help":{"intro":"Implements a staircase light logic with KNX integration, handling timer, pre-warning, manual override and blocking.","trigger":"Triggers","trigger_ga":"A rising edge (value = 1) on the trigger GA starts the timer. If enabled, a value of 0 will immediately cancel the cycle.","extend":"The \"On new trigger\" option controls how subsequent pulses behave: restart the timer, extend the remaining time or ignore the pulse.","off":"When override is active the timer is paused and the light stays on. Blocking disables new pulses and optionally forces the output off.","outputs":"Group addresses","output_ga":"Output GA is driven with DPT 1.001 by default. Configure other DPTs if required.","status_ga":"Status GA mirrors the stair light state (and the pre-warning flag when enabled).","override_ga":"Override GA keeps the light on while true and suspends the timer.","block_ga":"Block GA prevents new activations. When false, normal behaviour resumes.","prewarn":"Pre-warning","prewarn_desc":"Enable a pre-warning to alert occupants before the light turns off. You can either flash the output or toggle the status GA.","events":"Node output","events_desc":"When enabled the node emits structured events (trigger, extend, prewarn, timeout, override, block) with the remaining time and state information."},"placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/1/5","triggerName":"Trigger device name","outputName":"Output actuator name","statusName":"Status feedback name","overrideName":"Override channel name","blockName":"Block command name"},"section_commands":"Command group addresses","section_inputs":"Input group addresses"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Garage door","paletteLabel":"Garage","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","command":"Command GA (true=open, false=close)","impulse":"Impulse GA","holdOpen":"Hold-open GA","disable":"Disable GA","photocell":"Photocell GA","moving":"Moving GA","obstruction":"Obstruction GA","autoCloseEnable":"Enable auto re-close","autoCloseSeconds":"Auto re-close delay (seconds)","node-input-emitEvents":"Emit events on node output","placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/2/3","commandName":"Door actuator","impulseName":"Impulse input","holdOpenName":"Hold-open switch","disableName":"Disable command","photocellName":"Photocell sensor","movingName":"Movement indicator","obstructionName":"Obstruction indicator"},"help":{"intro":"Controls a KNX garage door with direct open/close commands, impulse inputs, safety sensors and automatic re-close.","commands":"Commands","command_ga":"Use the command GA for boolean control: true opens, false closes. The node also emits this when the auto close triggers.","impulse_ga":"An impulse GA toggles the door. Rising edges toggle the internal state; it is also used if no direct command GA is configured.","holdopen_ga":"Hold-open GA keeps the door open and cancels the auto re-close until it returns to false.","disable_ga":"Disable GA stops the node from issuing new commands. Useful for maintenance or manual mode.","safety":"Safety and status","photocell_ga":"The photocell GA should go true when the beam is interrupted. The node re-opens the door and flags obstruction.","moving_ga":"Movement GA (optional) is pulsed whenever the node commands the door to move, allowing other devices to follow the motion.","obstruction_ga":"Obstruction GA mirrors the obstruction state so other KNX components can react.","auto":"Automatic re-close","auto_close":"Enable the auto re-close timer to close the door automatically after the configured delay once it is open, unless hold-open or disable are active.","events":"Node output","events_desc":"With event emission enabled the node outputs structured messages (open, close, toggle, obstruction, disabled, hold-open, auto-close) for flow logic."},"section_commands":"Command group addresses","section_inputs":"Input / sensor group addresses"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"KNX Szenensteuerung","title":"Szene Kontroller","properties":{"node-input-server":"Gateway","node-input-topic":"Szenenrückruf","node-input-dpt":"DPT","node-input-topicTrigger":"Trigger","node-input-topicSave":"Szene speichern","node-input-name":"Node Name","node-input-outputtopic":"Topic"},"placeholder":{"leaveempty":"Lassen Sie leer, um die Gruppenadresse zu verwenden","valueexample":"Beispiel: false, true, sonst ein beliebiger Wert"},"other":{"sceneConfig":"Szenenkonfiguration, default Werte","add":"Drücken Sie Hinzufuegen, um ein Gerät zur Szene hinzuzufügen"},"advanced":{"notify-DPT3007":"Du haßt ein relatives DIM ausgewählt. Bitte <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming'>klicke hier, um dieses Beispiel anzuzeigen</a> und lernen, wie den Payload handeln.","notify-DPT18001":"Du haßt Szene DPT ausgewählt. Bitte <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator'>klicke hier, um dieses Beispiel anzuzeigen</a> und lernen, wie den Payload handeln.","notify-DPT232600":"Du haßt einen RGB DPT ausgewählt. Bitte <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color'>klicke hier, um dieses Beispiel anzuzeigen</a> und lernen, wie den Payload handeln.","notify-DPT251600":"Du haßt einen RGBW DPT ausgewählt. Bitte <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White'>klicke hier, um dieses Beispiel anzuzeigen</a> und lernen, wie den Payload handeln."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"KNX Laststeuerung","title":"Load control","primoaldistacco":"(this is the first to be switched off)","properties":{"node-input-server":"Gateway","node-input-name":"Name","node-input-controlMode":"Modus","node-input-dpt":"DPT","node-input-topic":"Monitor W","node-input-controlGA":"Load","node-input-monitorGA":"In use","node-input-wattLimit":"Limit W","node-input-sheddingCheckInterval":"Ausschaltverzögerung (s)","node-input-sheddingRestoreDelay":"Einschaltverzögerung (s)","node-input-autoRestore":"Automatic recovery"},"selectlists":{"controlModeAuto":"Automatisch (intern)","controlModeMsg":"Manuell (msg.shedding)"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Home Assistant Übersetzer","inputProperty":"Eingangseigenschaft","inputHint":"Zu übersetzende Nachrichteneigenschaft, zum Beispiel payload oder payload.state.","translations":"Übersetzungen (Home Assistant → KNX)","translationHint":"Eine Übersetzung pro Zeile im Format zustand:true oder zustand:false. Zum Beispiel: on:true und off:false."}}},"fr":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"Alerter KNX","title":"Nœud d'alerte","properties":{"node-input-server":"Porte","node-input-name":"Nom","node-input-timerinterval":"Intervalle entre chaque MSG (en secondes)","node-input-whentostart":"Type de démarrage du cycle d'alerte","node-input-initialread":"Lire la valeur de chaque périphérique sur la connexion / reconnecter","node-input-initialread0":"Non","node-input-initialread1":"Lire depuis KNX Bus","node-input-initialreadGAInRules":"Lire les états au début / reconnexion"},"selectlists":{"manualstart":"Démarrer le cycle d'alerte manuellement via un message entrant","ifnewalert":"Démarrez le cycle d'alerte avec chaque nouvel appareil alerté"},"other":{"sceneConfig":"Appareils à surveiller (DPT doit être booléen)","add":"Appuyez sur Ajouter, pour ajouter un appareil"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"Répondant automatique KNX","respondTo":"Répondre à"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"Date/Heure","paletteLabel":"Date/Heure","node-input-server":"Passerelle KNX","node-input-name":"Nom","node-input-outputtopic":"Topic de sortie du nœud","section_addresses":"Adresses de groupe","gaDateTime":"GA Date/Heure (DPT 19.001)","gaDate":"GA Date (DPT 11.001)","gaTime":"GA Heure (DPT 10.001)","section_send":"Options d'envoi","node-input-sendOnDeploy":"Envoyer au déploiement/démarrage","node-input-sendOnDeployDelay":"Délai au démarrage (secondes)","node-input-periodicSend":"Envoi périodique","node-input-periodicSendInterval":"Intervalle","unit_seconds":"Secondes","unit_minutes":"Minutes","notifySent":"Envoyé sur KNX","notifyQueued":"Mis en file d'attente (passerelle pas encore connectée)","placeholders":{"outputtopic":"Topic de sortie optionnel","ga":"ex. 1/7/1","nameDateTime":"Nom ETS (optionnel)","nameDate":"Nom ETS (optionnel)","nameTime":"Nom ETS (optionnel)"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"Chien de garde de KNX","title":"Chien de garde","properties":{"node-input-server":"Porte","node-input-checkLevel":"Vérifier le niveau (veuillez consulter le wiki)","node-input-topic":"Adresse du groupe à surveiller","node-input-name":"Nom de nœud","node-input-autoStart":"Démarrer automatiquement la minuterie de chien de garde","node-input-listenToKnxUltimateNodeErrors":"Écouter les erreurs des nœuds KNX-Ultimate","advancedOptionsAccordion":"Options avancées","node-input-retryInterval":"Réessier l'intervalle (en quelques secondes)","node-input-maxRetry":"Nombre de réessayer avant de donner une erreur"},"placeholder":{"monitor":"Ex: 12/0/0. Pour les vérifications «seulement Ethernet», veuillez utiliser une adresse de groupe non existante."},"selectlists":{"Ethernet":"Seul Ethernet Unicast (par défaut), en utilisant un ping. Fonctionne uniquement avec les interfaces KNX (pas les routeurs)","EthKNX":"Paire torsadé Ethernet + KNX, en utilisant un réel appareil KNX"},"booleanHint":"Le DPT doit être 1.x (booléen)"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"Contexte mondial KNX","title":"Contexte mondial KNX","node-input-name":"Nom variable (pas d'espaces, seulement Chars [A-Z])","advanced":{"exposeAsVariable":"Exposer en tant que variable globale","exposeAsVariableNO":"Non","exposeAsVariableREADONLY":"Lire uniquement","exposeAsVariableREADWRITE":"Lire / écrire","node-input-server":"Porte","writeExecutionInterval":"Intervalle d'écriture de bus","warning":"Avertissement: un seul nœud est partagé entre tous les flux. Vous n'avez pas besoin de plus d'un nœud; Peu importe où il se trouve, vous pouvez voir la variable à l'échelle mondiale."},"interval_250ms":"250 ms","interval_500ms":"500 ms","interval_1000ms_default":"1000 ms (par défaut)","interval_1500ms":"1500 ms","interval_2000ms":"2000 ms","contextStorage":"Stockage du contexte","contextStoragePlaceholder":"Nom facultatif du stockage du contexte"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"KNX Logger","title":"KNX Logger pour ETS","properties":{"node-input-server":"Porte","node-input-topic":"Sujet","node-input-name":"Nom de nœud","node-input-autoStartTimerCreateETSXML":"Minuterie de démarrage automatique","mlxETSFileAccordion":"Fichier de diagnostic de bus compatible ETS","node-input-intervalCreateETSXML":"Nouveau payload toutes les (en minutes)","node-input-maxRowsInETSXML":"Nombre maximum de lignes (0 = pas de limite)","node-input-saveMode":"Action","node-input-filePath":"Chemin de fichier (absolu ou relatif)","telegramCounter":"Compteur de télégramme KNX","node-input-intervalTelegramCount":"Compter l'intervalle (en quelques secondes)"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"Envoyer uniquement le payload","emit_save":"Envoyer le payload et enregistrer dans un fichier"}},"noFilePath":"Le chemin du fichier est vide"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Minuterie d'escalier","paletteLabel":"Escalier","node-input-server":"Passerelle KNX","node-input-name":"Nom","node-input-outputtopic":"Topic des événements","trigger":"GA impulsion","output":"GA sortie","status":"GA état","override":"GA override","block":"GA blocage","node-input-timerSeconds":"Durée du minuteur (secondes)","node-input-extendMode":"Nouvelle impulsion","extend_restart":"Redémarrer le minuteur","extend_extend":"Ajouter du temps","extend_ignore":"Ignorer","node-input-triggerOffCancels":"La valeur 0 annule le cycle","opt_yes":"Oui","opt_no":"Non","node-input-blockAction":"En cas de blocage","block_off":"Forcer l'arrêt","block_keep":"Conserver l'état","node-input-preWarnEnable":"Envoyer un préavis avant l'extinction","node-input-preWarnSeconds":"Préavis (secondes)","node-input-preWarnMode":"Mode de préavis","prewarn_status":"Basculer la GA d'état","prewarn_flash":"Faire clignoter la sortie","node-input-preWarnFlashMs":"Durée du clignotement (ms)","node-input-emitEvents":"Émettre des événements sur la sortie","help":{"intro":"Gère une lumière d'escalier avec temporisation KNX, préavis, override manuel et blocage.","trigger":"Impulsions","trigger_ga":"Une valeur 1 sur la GA d'impulsion démarre le minuteur. Si activé, la valeur 0 stoppe immédiatement le cycle.","extend":"L'option \"Nouvelle impulsion\" définit si le minuteur repart, s'allonge ou ignore la nouvelle impulsion.","off":"Avec l'override actif la temporisation est suspendue et la lumière reste allumée. Le blocage interdit les nouvelles impulsions et peut forcer l'arrêt.","outputs":"Adresses de groupe","output_ga":"La GA de sortie utilise le DPT 1.001 par défaut. Modifiez-le si nécessaire.","status_ga":"La GA d'état reflète l'activité de la minuterie et le préavis lorsqu'il est actif.","override_ga":"La GA d'override maintient l'éclairage tant qu'elle vaut 1.","block_ga":"La GA de blocage empêche les activations. Avec 0 le fonctionnement redevient normal.","prewarn":"Préavis","prewarn_desc":"Vous pouvez prévenir avant l'extinction en faisant clignoter la sortie ou en agissant sur la GA d'état.","events":"Sortie du nœud","events_desc":"Si activé, le nœud émet des événements structurés (trigger, extend, prewarn, timeout, override, block) avec le temps restant et l'état courant."},"placeholders":{"outputtopic":"Topic optionnel pour les événements","ga":"ex. 1/1/5","triggerName":"Nom dispositif impulsion","outputName":"Nom actionneur sortie","statusName":"Nom indicateur d'état","overrideName":"Nom canal override","blockName":"Nom commande blocage"},"section_commands":"Adresses de commande","section_inputs":"Adresses d’entrée"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Porte de garage","paletteLabel":"Garage","node-input-server":"Passerelle KNX","node-input-name":"Nom","node-input-outputtopic":"Topic des événements","command":"GA commande (true=ouvre, false=ferme)","impulse":"GA impulsion","holdOpen":"GA maintien ouvert","disable":"GA désactivation","photocell":"GA cellule photo","moving":"GA en mouvement","obstruction":"GA obstruction","autoCloseEnable":"Activer la refermeture automatique","autoCloseSeconds":"Délai de refermeture (secondes)","node-input-emitEvents":"Émettre des événements en sortie","placeholders":{"outputtopic":"Topic optionnel pour les événements","ga":"ex. 1/2/3","commandName":"Actionneur porte","impulseName":"Entrée impulsion","holdOpenName":"Maintien ouvert","disableName":"Commande désactivation","photocellName":"Capteur phot cellule","movingName":"Indicateur mouvement","obstructionName":"Indicateur obstruction"},"help":{"intro":"Pilote une porte de garage KNX avec commandes directes, impulsion, sécurités et refermeture automatique.","commands":"Commandes","command_ga":"La GA commande reçoit true pour ouvrir et false pour fermer. Le noeud l'utilise aussi pour le rappel automatique.","impulse_ga":"La GA impulsion commute la porte via un front actif et sert si aucune commande booléenne n'est disponible.","holdopen_ga":"La GA maintien ouvert annule le timer tant qu'elle reste à true.","disable_ga":"La GA désactivation bloque toute action du nœud (mode maintenance).","safety":"Sécurité et état","photocell_ga":"La GA cellule photo passe à true en cas d'obstacle; le nœud rouvre et signale l'obstruction.","moving_ga":"La GA en mouvement (optionnelle) est pulsée lorsque le nœud commande la porte, pour informer les autres équipements.","obstruction_ga":"La GA obstruction diffuse l'état d'alarme aux autres participants KNX.","auto":"Refermeture automatique","auto_close":"Active la refermeture après le délai défini sauf maintien ouvert ou désactivation.","events":"Sortie du nœud","events_desc":"Avec l'émission d'événements activée le nœud génère des messages structurés (open, close, toggle, obstruction, disabled, hold-open, auto-close) pour la logique du flow."},"section_commands":"Adresses de commande","section_inputs":"Adresses d’entrée / capteurs"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"Contrôleur de scène KNX","title":"Contrôleur de scène","properties":{"node-input-server":"Porte","node-input-topic":"Rappel de la scène","node-input-dpt":"DPT","node-input-topicTrigger":"Déclenchement","node-input-topicSave":"Sage à l'exception","node-input-name":"Nom de nœud","node-input-outputtopic":"Sujet"},"placeholder":{"leaveempty":"Laisser vide pour utiliser l'adresse du groupe","valueexample":"Ex: faux, vrai, sinon toute valeur"},"other":{"sceneConfig":"Configuration des valeurs par défaut de scène","add":"Appuyez sur Ajouter, pour ajouter un appareil dans la scène"},"advanced":{"notify-DPT3007":"Vous avez sélectionné un dim relatif. Veuillez __ph_0__ cliquez ici pour afficher cet exemple__ph_1__ et apprenez à gérer une telle charge utile.","notify-DPT18001":"Vous avez sélectionné un DPT de scène. Veuillez __ph_0__ cliquez ici pour afficher cet exemple__ph_1__ et apprenez à gérer une telle charge utile.","notify-DPT232600":"Vous avez sélectionné un DPT RVB. Veuillez __ph_0__ cliquez ici pour afficher cet exemple__ph_1__ et apprenez à gérer une telle charge utile.","notify-DPT251600":"Vous avez sélectionné un DPT RGBW. Veuillez __ph_0__ cliquez ici pour afficher cet exemple__ph_1__ et apprenez à gérer une telle charge utile."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"Contrôle de charge KNX","title":"Contrôle de la charge","primoaldistacco":"(c'est le premier à être éteint)","properties":{"node-input-server":"Porte","node-input-name":"Non-mémoire","node-input-controlMode":"Mode","node-input-dpt":"DPT","node-input-topic":"Surveiller W","node-input-controlGA":"Charger","node-input-monitorGA":"Utilisé","node-input-wattLimit":"Limiter w","node-input-sheddingCheckInterval":"Retarder l'éteint (s)","node-input-sheddingRestoreDelay":"Retarder l'interrupteur sur (s)","node-input-autoRestore":"Récupération automatique"},"selectlists":{"controlModeAuto":"Automatique (interne)","controlModeMsg":"Manuel (msg.shedding)"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Traducteur Home Assistant","inputProperty":"Propriété d’entrée","inputHint":"Propriété du message à traduire, par exemple payload ou payload.state.","translations":"Traductions (Home Assistant → KNX)","translationHint":"Une traduction par ligne, au format état:true ou état:false. Par exemple : on:true et off:false."}}},"es":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"Knx alerter","title":"Nodo de alerter","properties":{"node-input-server":"Puerta","node-input-name":"Nombre","node-input-timerinterval":"Intervalo entre cada MSG (en segundos)","node-input-whentostart":"Tipo de inicio del ciclo de alerta","node-input-initialread":"Valor de lectura de cada dispositivo en conexión/reconectación","node-input-initialread0":"No","node-input-initialread1":"Leer del autobús KNX","node-input-initialreadGAInRules":"Leer estados al inicio/reconexión"},"selectlists":{"manualstart":"Inicie el ciclo de alerta manualmente a través del mensaje entrante","ifnewalert":"Inicie el ciclo de alerta con cada nuevo dispositivo alertado"},"other":{"sceneConfig":"Dispositivos para monitorear (DPT debe ser booleano)","add":"Presione Agregar, para agregar un dispositivo"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"KNX Auto Responder","respondTo":"Responder a"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"Fecha/Hora","paletteLabel":"Fecha/Hora","node-input-server":"Gateway KNX","node-input-name":"Nombre","node-input-outputtopic":"Topic de salida del nodo","section_addresses":"Direcciones de grupo","gaDateTime":"GA Fecha/Hora (DPT 19.001)","gaDate":"GA Fecha (DPT 11.001)","gaTime":"GA Hora (DPT 10.001)","section_send":"Opciones de envío","node-input-sendOnDeploy":"Enviar al desplegar/iniciar","node-input-sendOnDeployDelay":"Retardo de inicio (segundos)","node-input-periodicSend":"Envío periódico","node-input-periodicSendInterval":"Intervalo","unit_seconds":"Segundos","unit_minutes":"Minutos","notifySent":"Enviado a KNX","notifyQueued":"En cola (gateway aún no conectado)","placeholders":{"outputtopic":"Topic de salida opcional","ga":"p.ej. 1/7/1","nameDateTime":"Nombre ETS (opc.)","nameDate":"Nombre ETS (opc.)","nameTime":"Nombre ETS (opc.)"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"KNX Watchdog","title":"Perro guardián","properties":{"node-input-server":"Puerta","node-input-checkLevel":"Verificar el nivel (consulte el wiki)","node-input-topic":"Dirección de grupo para monitorear","node-input-name":"Nombre de nodo","node-input-autoStart":"Auto Iniciar el temporizador de vigilancia","node-input-listenToKnxUltimateNodeErrors":"Escuchar errores de los nodos KNX-Ultimate","advancedOptionsAccordion":"Opciones avanzadas","node-input-retryInterval":"Vuelva a intentar el intervalo (en segundos)","node-input-maxRetry":"Número de reintento antes de dar un error"},"placeholder":{"monitor":"Ej: 12/0/0. Para verificaciones 'únicas Ethernet', utilice una dirección de grupo no existente."},"selectlists":{"Ethernet":"Solo Ethernet Unicast (predeterminado), usando ping. Funciona solo con interfaces KNX (no enrutadores)","EthKNX":"Ethernet + KNX Twisted Par, usando un dispositivo KNX real"},"booleanHint":"El DPT debe ser 1.x (booleano)"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"Contexto global de KNX","title":"Contexto global de KNX","node-input-name":"Nombre de la variable (sin espacios, solo chars [A-Z])","advanced":{"exposeAsVariable":"Exponer como variable global","exposeAsVariableNO":"No","exposeAsVariableREADONLY":"Solo lectura","exposeAsVariableREADWRITE":"Leer/escribir","node-input-server":"Puerta","writeExecutionInterval":"Intervalo de escritura de autobús","warning":"Advertencia: se comparte un solo nodo entre todos los flujos. No necesitas más de un nodo; Independientemente de dónde esté, puede ver la variable a nivel mundial."},"interval_250ms":"250 ms","interval_500ms":"500 ms","interval_1000ms_default":"1000 ms (predeterminado)","interval_1500ms":"1500 ms","interval_2000ms":"2000 ms","contextStorage":"Almacén de contexto","contextStoragePlaceholder":"Nombre opcional del almacén de contexto"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"Logger KNX","title":"Logger KNX para ETS","properties":{"node-input-server":"Puerta","node-input-topic":"Tema","node-input-name":"Nombre de nodo","node-input-autoStartTimerCreateETSXML":"Temporizador de inicio automático","mlxETSFileAccordion":"Archivo de diagnóstico de bus compatible con ETS","node-input-intervalCreateETSXML":"Nuevo payload cada (en minutos)","node-input-maxRowsInETSXML":"Número máximo de filas (0 = sin límite)","node-input-saveMode":"Acción","node-input-filePath":"Ruta de archivo (absoluta o relativa)","telegramCounter":"Contador de telegrama de knx","node-input-intervalTelegramCount":"Intervalo de conteo (en segundos)"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"Emitir solo el payload","emit_save":"Emitir el payload y guardar en archivo"}},"noFilePath":"La ruta del archivo está vacía"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Escalera temporizada","paletteLabel":"Escalera","node-input-server":"Gateway KNX","node-input-name":"Nombre","node-input-outputtopic":"Topic para eventos","trigger":"GA disparo","output":"GA salida","status":"GA estado","override":"GA override","block":"GA bloqueo","node-input-timerSeconds":"Duración del temporizador (segundos)","node-input-extendMode":"Nuevo impulso","extend_restart":"Reiniciar temporizador","extend_extend":"Extender tiempo restante","extend_ignore":"Ignorar impulso","node-input-triggerOffCancels":"El valor 0 cancela el ciclo","opt_yes":"Sí","opt_no":"No","node-input-blockAction":"Cuando está bloqueado","block_off":"Forzar apagado","block_keep":"Mantener estado","node-input-preWarnEnable":"Enviar aviso antes de apagar","node-input-preWarnSeconds":"Aviso (segundos)","node-input-preWarnMode":"Modo de aviso","prewarn_status":"Conmutar GA estado","prewarn_flash":"Parpadear la salida","node-input-preWarnFlashMs":"Duración del parpadeo (ms)","node-input-emitEvents":"Emitir eventos por la salida","help":{"intro":"Implementa una luz de escalera con lógica KNX: temporizador, preaviso, override manual y bloqueo.","trigger":"Disparos","trigger_ga":"Un valor 1 en la GA de disparo inicia el temporizador. Si está activo, el valor 0 detiene inmediatamente el ciclo.","extend":"La opción \"Nuevo impulso\" define si se reinicia el temporizador, se suma tiempo o se ignora el nuevo impulso.","off":"Con override activo el temporizador se pausa y la luz permanece encendida. El bloqueo evita nuevos disparos y, opcionalmente, apaga la salida.","outputs":"Direcciones de grupo","output_ga":"La GA de salida se envía en DPT 1.001 por defecto. Cambie el DPT si necesita otro formato.","status_ga":"La GA de estado refleja si la luz está activa y el estado de preaviso.","override_ga":"La GA de override mantiene la luz encendida mientras sea 1.","block_ga":"La GA de bloqueo impide nuevas activaciones. Con 0 vuelve el funcionamiento normal.","prewarn":"Preaviso","prewarn_desc":"Puede avisar antes de apagar parpadeando la salida o activando la GA de estado.","events":"Salida del nodo","events_desc":"Si está habilitado, el nodo emite eventos estructurados (trigger, extend, prewarn, timeout, override, block) con el tiempo restante y el estado actual."},"placeholders":{"outputtopic":"Topic opcional para eventos","ga":"ej. 1/1/5","triggerName":"Nombre dispositivo de disparo","outputName":"Nombre actuador de salida","statusName":"Nombre indicador de estado","overrideName":"Nombre canal override","blockName":"Nombre comando bloqueo"},"section_commands":"Direcciones de mando","section_inputs":"Direcciones de entrada"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Puerta de garaje","paletteLabel":"Garaje","node-input-server":"Gateway KNX","node-input-name":"Nombre","node-input-outputtopic":"Topic para eventos","command":"GA mando (true=abre, false=cierra)","impulse":"GA impulso","holdOpen":"GA mantener abierto","disable":"GA deshabilitación","photocell":"GA fotocélula","moving":"GA movimiento","obstruction":"GA obstrucción","autoCloseEnable":"Activar cierre automático","autoCloseSeconds":"Retardo cierre automático (segundos)","node-input-emitEvents":"Emitir eventos por la salida","placeholders":{"outputtopic":"Topic opcional para eventos","ga":"ej. 1/2/3","commandName":"Actuador puerta","impulseName":"Entrada impulso","holdOpenName":"Bloqueo cierre","disableName":"Comando deshabilitación","photocellName":"Sensor fotocélula","movingName":"Indicador movimiento","obstructionName":"Indicador obstrucción"},"help":{"intro":"Controla una puerta de garaje KNX con mando directo, impulsos, sensores de seguridad y cierre automático.","commands":"Mandos","command_ga":"La GA mando recibe true para abrir y false para cerrar. El nodo la utiliza también en el cierre automático.","impulse_ga":"La GA impulso conmuta la puerta con un flanco. Se usa también cuando no hay comando directo configurado.","holdopen_ga":"La GA mantener abierto cancela el temporizador de cierre hasta que vuelva a false.","disable_ga":"La GA deshabilitación bloquea cualquier comando emitido por el nodo (modo mantenimiento).","safety":"Seguridad y estado","photocell_ga":"La GA fotocélula debe ponerse a true cuando detecta una obstrucción; el nodo vuelve a abrir y marca la alarma.","moving_ga":"La GA movimiento (opcional) se activa cada vez que el nodo ordena movimiento, facilitando la sincronización en KNX.","obstruction_ga":"La GA obstrucción replica el estado de alarma para otros dispositivos.","auto":"Cierre automático","auto_close":"Activa el cierre automático tras el tiempo configurado, salvo que esté activo mantener abierto o la deshabilitación.","events":"Salida del nodo","events_desc":"Con la emisión de eventos el nodo produce mensajes estructurados (open, close, toggle, obstruction, disabled, hold-open, auto-close) para la lógica del flow."},"section_commands":"Direcciones de mando","section_inputs":"Direcciones de entrada/sensores"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"Controlador de escena KNX","title":"Controlador de escena","properties":{"node-input-server":"Puerta","node-input-topic":"Recuerdo de la escena","node-input-dpt":"DPT","node-input-topicTrigger":"Desencadenar","node-input-topicSave":"Guardar escena","node-input-name":"Nombre de nodo","node-input-outputtopic":"Tema"},"placeholder":{"leaveempty":"Dejar vacío para usar la dirección de grupo","valueexample":"Ej: falso, verdadero, de lo contrario cualquier valor"},"other":{"sceneConfig":"Configuración de valores predeterminados de la escena","add":"Presione Agregar, para agregar un dispositivo en la escena"},"advanced":{"notify-DPT3007":"Usted seleccionó un tenue relativo. Por favor, __ph_0__ haga clic aquí para ver esta muestra__ph_1__ y aprenda cómo manejar dicha carga útil.","notify-DPT18001":"Usted seleccionó un DPT de la escena. Por favor, __ph_0__ haga clic aquí para ver esta muestra__ph_1__ y aprenda cómo manejar dicha carga útil.","notify-DPT232600":"Seleccionó un DPT RGB. Por favor, __ph_0__ haga clic aquí para ver esta muestra__ph_1__ y aprenda cómo manejar dicha carga útil.","notify-DPT251600":"Seleccionó un DPT RGBW. Por favor, __ph_0__ haga clic aquí para ver esta muestra__ph_1__ y aprenda cómo manejar dicha carga útil."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"Control de carga KNX","title":"Control de carga","primoaldistacco":"(Este es el primero en apagarse)","properties":{"node-input-server":"Puerta","node-input-name":"No ameme","node-input-controlMode":"Modo","node-input-dpt":"DPT","node-input-topic":"Monitor W","node-input-controlGA":"Carga","node-input-monitorGA":"En uso","node-input-wattLimit":"Límite w","node-input-sheddingCheckInterval":"Apagado (s) apagado (s)","node-input-sheddingRestoreDelay":"Interruptor de retraso (s) (s) (s)","node-input-autoRestore":"Recuperación automática"},"selectlists":{"controlModeAuto":"Automático (interno)","controlModeMsg":"Manual (msg.shedding)"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Traductor Home Assistant","inputProperty":"Propiedad de entrada","inputHint":"Propiedad del mensaje que se desea traducir, por ejemplo payload o payload.state.","translations":"Traducciones (Home Assistant → KNX)","translationHint":"Una traducción por línea, con el formato estado:true o estado:false. Por ejemplo: on:true y off:false."}}},"zh-CN":{"knxUltimateAlerter":{"knxUltimateAlerter":{"paletteLabel":"KNX 警报器","title":"KNX 警报节点","properties":{"node-input-server":"网关","node-input-name":"名称","node-input-timerinterval":"每条数据间隔发送时间 (秒)","node-input-whentostart":"警报周期启动类型","node-input-initialread":"在连接/重新连接时读取每个设备的值","node-input-initialread0":"不使用","node-input-initialread1":"从KNX总线读取","node-input-initialreadGAInRules":"Read states at start/reconnection"},"selectlists":{"manualstart":"通过传入消息手动启动警报周期","ifnewalert":"使用每个新的警报设备启动警报周期"},"other":{"sceneConfig":"监控设备 (DPT 必须是布尔值)","add":"点击添加，添加设备"}}},"knxUltimateAutoResponder":{"knxUltimateAutoResponder":{"paletteLabel":"KNX 自动应答","respondTo":"响应地址"}},"knxUltimateDateTime":{"knxUltimateDateTime":{"title":"日期/时间","paletteLabel":"日期/时间","node-input-server":"KNX 网关","node-input-name":"名称","node-input-outputtopic":"节点输出 Topic","section_addresses":"组地址","gaDateTime":"日期/时间 GA（DPT 19.001）","gaDate":"日期 GA（DPT 11.001）","gaTime":"时间 GA（DPT 10.001）","section_send":"发送选项","node-input-sendOnDeploy":"部署/启动时发送","node-input-sendOnDeployDelay":"启动延时（秒）","node-input-periodicSend":"周期发送","node-input-periodicSendInterval":"间隔","unit_seconds":"秒","unit_minutes":"分钟","notifySent":"已发送到 KNX","notifyQueued":"已加入队列（网关尚未连接）","placeholders":{"outputtopic":"可选输出 Topic","ga":"例如 1/7/1","nameDateTime":"ETS 名称（可选）","nameDate":"ETS 名称（可选）","nameTime":"ETS 名称（可选）"}}},"knxUltimateWatchDog":{"knxUltimateWatchDog":{"paletteLabel":"KNX 看门狗","title":"看门狗","properties":{"node-input-server":"网关","node-input-checkLevel":"检查等级 (请查阅wiki)","node-input-topic":"需要监控的组地址","node-input-name":"节点名称","node-input-autoStart":"自动启动看门狗定时器","node-input-listenToKnxUltimateNodeErrors":"监听 KNX-Ultimate 节点错误","advancedOptionsAccordion":"高级选项","node-input-retryInterval":"重试间隔 (秒)","node-input-maxRetry":"出错前的重试次数"},"placeholder":{"monitor":" 对于“仅以太网”检查，请使用不存在的组地址.例如：12/0/0。"},"selectlists":{"Ethernet":"仅以太网单播（默认），使用 ping。 仅适用于 KNX 接口（而非路由器）","EthKNX":"以太网 + KNX 双绞线，使用真正的 KNX 设备"},"booleanHint":"DPT 必须为 1.x（布尔值）"}},"knxUltimateGlobalContext":{"knxUltimateGlobalContext":{"paletteLabel":"KNX 全局上下文","title":"KNX 全局变量节点","node-input-name":"变量名 (不能有空格，只能用小写字母)","advanced":{"exposeAsVariable":"作为全局变量公开","exposeAsVariableNO":"No","exposeAsVariableREADONLY":"只读取","exposeAsVariableREADWRITE":"读取/写入","node-input-server":"网关","writeExecutionInterval":"总线写入间隔时间","warning":"警告：所有流之间共享单个节点。您不需要多个节点；不管它在哪里，你都可以看到变量 GLOBALLY."},"interval_250ms":"250毫秒","interval_500ms":"500毫秒","interval_1000ms_default":"1000毫秒（默认）","interval_1500ms":"1500毫秒","interval_2000ms":"2000毫秒","contextStorage":"上下文存储","contextStoragePlaceholder":"可选的上下文存储名称"}},"knxUltimateLogger":{"knxUltimateLogger":{"paletteLabel":"KNX 日志","title":"KNX 日志节点","properties":{"node-input-server":"网关","node-input-topic":"主题名","node-input-name":"节点名称","node-input-autoStartTimerCreateETSXML":"自动启动定时器","mlxETSFileAccordion":"ETS 兼容总线诊断文件","node-input-intervalCreateETSXML":"新的 payload 每 (分钟)","node-input-maxRowsInETSXML":"最大行数 (0 = 没有限制)","node-input-saveMode":"操作","node-input-filePath":"文件路径（绝对或相对）","telegramCounter":"KNX 电报计数","node-input-intervalTelegramCount":"计数间隔（秒）"},"placeholder":{"node-input-filePath":"/var/tmp/knx-logger.xml"},"selectlists":{"saveMode":{"emit":"仅发送 payload","emit_save":"发送 payload 并保存到文件"}},"noFilePath":"文件路径为空"}},"knxUltimateStaircase":{"knxUltimateStaircase":{"title":"Staircase light","paletteLabel":"Staircase","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","trigger":"Trigger GA","output":"Output GA","status":"Status GA","override":"Override GA","block":"Block GA","node-input-timerSeconds":"Timer duration (seconds)","node-input-extendMode":"On new trigger","extend_restart":"Restart timer","extend_extend":"Extend remaining time","extend_ignore":"Ignore the trigger","node-input-triggerOffCancels":"0 command cancels the cycle","opt_yes":"Yes","opt_no":"No","node-input-blockAction":"When blocked","block_off":"Force light OFF","block_keep":"Leave current state","node-input-preWarnEnable":"Send pre-warning before timeout","node-input-preWarnSeconds":"Pre-warning offset (seconds)","node-input-preWarnMode":"Pre-warning mode","prewarn_status":"Toggle status GA","prewarn_flash":"Flash output","node-input-preWarnFlashMs":"Flash duration (ms)","node-input-emitEvents":"Emit events on node output","help":{"intro":"Implements a staircase light logic with KNX integration, handling timer, pre-warning, manual override and blocking.","trigger":"Triggers","trigger_ga":"A rising edge (value = 1) on the trigger GA starts the timer. If enabled, a value of 0 will immediately cancel the cycle.","extend":"The \"On new trigger\" option controls how subsequent pulses behave: restart the timer, extend the remaining time or ignore the pulse.","off":"When override is active the timer is paused and the light stays on. Blocking disables new pulses and optionally forces the output off.","outputs":"Group addresses","output_ga":"Output GA is driven with DPT 1.001 by default. Configure other DPTs if required.","status_ga":"Status GA mirrors the stair light state (and the pre-warning flag when enabled).","override_ga":"Override GA keeps the light on while true and suspends the timer.","block_ga":"Block GA prevents new activations. When false, normal behaviour resumes.","prewarn":"Pre-warning","prewarn_desc":"Enable a pre-warning to alert occupants before the light turns off. You can either flash the output or toggle the status GA.","events":"Node output","events_desc":"When enabled the node emits structured events (trigger, extend, prewarn, timeout, override, block) with the remaining time and state information."},"placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/1/5","triggerName":"Trigger device name","outputName":"Output actuator name","statusName":"Status feedback name","overrideName":"Override channel name","blockName":"Block command name"},"section_commands":"Command group addresses","section_inputs":"Input group addresses"}},"knxUltimateGarage":{"knxUltimateGarage":{"title":"Garage door","paletteLabel":"Garage","node-input-server":"KNX Gateway","node-input-name":"Name","node-input-outputtopic":"Topic for emitted events","command":"Command GA (true=open, false=close)","impulse":"Impulse GA","holdOpen":"Hold-open GA","disable":"Disable GA","photocell":"Photocell GA","moving":"Moving GA","obstruction":"Obstruction GA","autoCloseEnable":"Enable auto re-close","autoCloseSeconds":"Auto re-close delay (seconds)","node-input-emitEvents":"Emit events on node output","placeholders":{"outputtopic":"Optional topic for node events","ga":"e.g. 1/2/3","commandName":"Door actuator","impulseName":"Impulse input","holdOpenName":"Hold-open switch","disableName":"Disable command","photocellName":"Photocell sensor","movingName":"Movement indicator","obstructionName":"Obstruction indicator"},"help":{"intro":"Controls a KNX garage door with direct open/close commands, impulse inputs, safety sensors and automatic re-close.","commands":"Commands","command_ga":"Use the command GA for boolean control: true opens, false closes. The node also emits this when the auto close triggers.","impulse_ga":"An impulse GA toggles the door. Rising edges toggle the internal state; it is also used if no direct command GA is configured.","holdopen_ga":"Hold-open GA keeps the door open and cancels the auto re-close until it returns to false.","disable_ga":"Disable GA stops the node from issuing new commands. Useful for maintenance or manual mode.","safety":"Safety and status","photocell_ga":"The photocell GA should go true when the beam is interrupted. The node re-opens the door and flags obstruction.","moving_ga":"Movement GA (optional) is pulsed whenever the node commands the door to move, allowing other devices to follow the motion.","obstruction_ga":"Obstruction GA mirrors the obstruction state so other KNX components can react.","auto":"Automatic re-close","auto_close":"Enable the auto re-close timer to close the door automatically after the configured delay once it is open, unless hold-open or disable are active.","events":"Node output","events_desc":"With event emission enabled the node outputs structured messages (open, close, toggle, obstruction, disabled, hold-open, auto-close) for flow logic."},"section_commands":"Command group addresses","section_inputs":"Input / sensor group addresses"}},"knxUltimateSceneController":{"knxUltimateSceneController":{"paletteLabel":"KNX 场景控制器","title":"KNX 场景节点","properties":{"node-input-server":"网关","node-input-topic":"调用场景","node-input-dpt":"DPT","node-input-topicTrigger":"调用","node-input-topicSave":"保存","node-input-name":"节点名称","node-input-outputtopic":"主题名称"},"placeholder":{"leaveempty":"如果留空则使用组地址","valueexample":"案例: 0 是 false, 1 是 true, 否则是任意值"},"other":{"sceneConfig":"场景配置 (default values)","add":"点击添加, 就在场景中添加一个设备"},"advanced":{"notify-DPT3007":"你选择了相对调光类型. 请 <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming'>点击这个连接参考案例</a> 并学习如何处理此类消息.","notify-DPT18001":"你选择了场景 DPT. 请 <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator'>点击这个连接参考案例</a> 并学习如何处理此类消息.","notify-DPT232600":"你选择了 RGB DPT. 请 <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color'>点击这个连接参考案例</a> 并学习如何处理此类消息.","notify-DPT251600":"你选择了 RGBW DPT. 请 <a target='_blank' href='https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White'>点击这个连接参考案例</a> 并学习如何处理此类消息."}}},"knxUltimateLoadControl":{"knxUltimateLoadControl":{"paletteLabel":"KNX 负载控制","title":"Load control","primoaldistacco":"(this is the first to be switched off)","properties":{"node-input-server":"Gateway","node-input-name":"Name","node-input-controlMode":"模式","node-input-dpt":"DPT","node-input-topic":"Monitor W","node-input-controlGA":"Load","node-input-monitorGA":"In use","node-input-wattLimit":"Limit W","node-input-sheddingCheckInterval":"Delay switch off (s)","node-input-sheddingRestoreDelay":"Delay switch on (s)","node-input-autoRestore":"Automatic recovery"},"selectlists":{"controlModeAuto":"自动（内部）","controlModeMsg":"手动（msg.shedding）"},"other":{}}},"knxUltimateHATranslator":{"knxUltimateHATranslator":{"paletteLabel":"Home Assistant 转换器","inputProperty":"输入属性","inputHint":"需要转换的消息属性，例如 payload 或 payload.state。","translations":"转换映射（Home Assistant → KNX）","translationHint":"每行一条映射，格式为 state:true 或 state:false。例如：on:true 和 off:false。"}}}}

  // Editor definitions contain closure state. Cache one definition per profile
  // and RED editor instance, matching Node-RED's normal registration lifetime.
  // WeakMap prevents a discarded test/editor RED object from being retained.
  const definitionCaches = new WeakMap()

  const normalizeUtilityType = (utilityType) => (
    Object.prototype.hasOwnProperty.call(PROFILE_TYPES, utilityType) ? utilityType : 'alerter'
  )

  const normalizeLocale = (locale) => {
    const value = String(locale || '').trim()
    if (!value) return 'en'
    if (/^zh(?:[-_]|$)/i.test(value)) return 'zh-CN'
    const shortLocale = value.split(/[-_]/)[0].toLowerCase()
    return Object.prototype.hasOwnProperty.call(PROFILE_TRANSLATIONS, shortLocale) ? shortLocale : 'en'
  }

  const UTILITY_LOCALE_KEY = 'node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.locale'

  const nodeRedLocale = (RED) => {
    try {
      if (RED && typeof RED._ === 'function') {
        const translated = RED._(UTILITY_LOCALE_KEY)
        if (translated && translated !== UTILITY_LOCALE_KEY) return translated
      }
    } catch (error) { /* use the compatibility fallbacks below */ }
    return undefined
  }

  const currentLocale = (RED) => {
    // Ask Node-RED's active catalog first. documentElement.lang can remain
    // English even while the editor has loaded another locale.
    const candidates = [
      nodeRedLocale(RED),
      RED && RED.settings && RED.settings.lang,
      root && root.document && root.document.documentElement && root.document.documentElement.lang,
      root && root.navigator && root.navigator.language
    ]
    return normalizeLocale(candidates.find((candidate) => candidate))
  }

  const nestedValue = (object, key) => String(key || '').split('.').reduce((value, part) => (
    value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined
  ), object)

  const interpolate = (value, replacements) => {
    if (typeof value !== 'string' || !replacements || typeof replacements !== 'object') return value
    return value.replace(/{{\s*([^{}]+?)\s*}}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
    ))
  }

  const translationLookup = (utilityType, key, RED, replacements) => {
    let selectedType = normalizeUtilityType(utilityType)
    let localKey = String(key || '')
    const separatorIndex = localKey.lastIndexOf(':')
    if (separatorIndex >= 0) {
      // Fully qualified keys may name a different private profile. Resolve that
      // namespace locally instead of delegating to a legacy Node-RED node type.
      const namespace = localKey.slice(0, separatorIndex)
      localKey = localKey.slice(separatorIndex + 1)
      const namespaceNodeType = namespace.split('/').pop()
      const matchedType = Object.keys(PROFILE_TYPES).find((type) => PROFILE_TYPES[type] === namespaceNodeType)
      if (matchedType) selectedType = matchedType
    }

    const nodeType = PROFILE_TYPES[selectedType]
    const locale = currentLocale(RED)
    const localized = nestedValue(PROFILE_TRANSLATIONS[locale] && PROFILE_TRANSLATIONS[locale][nodeType], localKey)
    const fallback = nestedValue(PROFILE_TRANSLATIONS.en && PROFILE_TRANSLATIONS.en[nodeType], localKey)
    return interpolate(localized === undefined ? fallback : localized, replacements)
  }

  const translate = (utilityType, key, RED, replacements) => {
    const translated = translationLookup(utilityType, key, RED, replacements)
    if (translated !== undefined) return translated
    // Unknown keys may belong to Node-RED itself or the outer Utility. Only
    // those keys are allowed to fall through to the real editor translator.
    if (RED && typeof RED._ === 'function') {
      try { return RED._(key, replacements) } catch (error) { /* use the key below */ }
    }
    return key
  }

  const createDefinition = (utilityType, RED) => {
    const selectedType = normalizeUtilityType(utilityType)
    let capturedDefinition

    // Object.create keeps every real RED editor service available (nodes.node,
    // sidebar, events, notify, and so on) while replacing only the registration
    // boundary and translation resolver used by the private editor source.
    const redFacade = Object.create(RED)
    redFacade.nodes = Object.create((RED && RED.nodes) || null)
    redFacade.nodes.registerType = (nodeType, definition) => {
      if (nodeType === PROFILE_TYPES[selectedType]) capturedDefinition = definition
    }
    redFacade._ = (key, replacements) => translate(selectedType, key, RED, replacements)

    PROFILE_FACTORIES[selectedType](redFacade)
    if (!capturedDefinition) throw new Error('Unable to load KNX Utility editor profile: ' + selectedType)

    // Node-RED normally attaches a scoped translator while registering a type.
    // Because registration is captured, attach the equivalent private resolver.
    capturedDefinition._ = (key, replacements) => translate(selectedType, key, RED, replacements)
    return capturedDefinition
  }

  const getDefinition = (utilityType, RED) => {
    const selectedType = normalizeUtilityType(utilityType)
    let cache = definitionCaches.get(RED)
    if (!cache) {
      cache = new Map()
      definitionCaches.set(RED, cache)
    }
    if (!cache.has(selectedType)) cache.set(selectedType, createDefinition(selectedType, RED))
    return cache.get(selectedType)
  }

  const getTemplate = (utilityType) => PROFILE_TEMPLATES[normalizeUtilityType(utilityType)]

  // Expose only the narrow API consumed by knxUltimateUtility.html and
  // tests. The implementation tables remain private and cannot be mutated.
  return Object.freeze({
    PROFILE_TYPES,
    createDefinition,
    getDefinition,
    getTemplate,
    normalizeUtilityType,
    normalizeLocale,
    currentLocale,
    translate
  })
}))
