// Canonical private editor profile for HUE Controller: light.
// This source is captured into a private definition; it never registers a palette node.
(function () {

    RED.nodes.registerType("knxUltimateHueLight", {
      category: "KNX Ultimate HUE (Legacy)",
      color: "#E7E9F6",
      defaults: {
        //buttonState: {value: true},
        server: { type: "knxUltimate-config", required: false },
        serverHue: { type: "hue-config", required: true },
        name: { value: "" },

        nameLightSwitch: { value: "" },
        GALightSwitch: { value: "" },
        dptLightSwitch: { value: "" },

        nameLightState: { value: "" },
        GALightState: { value: "" },
        dptLightState: { value: "" },

        nameLightDIM: { value: "" },
        GALightDIM: { value: "" },
        dptLightDIM: { value: "" },

        // TAB Color ---------------------------
        nameLightColor: { value: "" },
        GALightColor: { value: "" },
        dptLightColor: { value: "" },

        nameLightColorState: { value: "" },
        GALightColorState: { value: "" },
        dptLightColorState: { value: "" },

        // HSV H hue Color change
        nameLightHSV_H_DIM: { value: "" },
        GALightHSV_H_DIM: { value: "" },
        dptLightHSV_H_DIM: { value: "" },

        nameLightHSV_H_State: { value: "" },
        GALightHSV_H_State: { value: "" },
        dptLightHSV_H_State: { value: "" },

        // HSV S saturation change
        nameLightHSV_S_DIM: { value: "" },
        GALightHSV_S_DIM: { value: "" },
        dptLightHSV_S_DIM: { value: "" },

        nameLightHSV_S_State: { value: "" },
        GALightHSV_S_State: { value: "" },
        dptLightHSV_S_State: { value: "" },
        // -------------------------------------

        nameLightKelvinDIM: { value: "" },
        GALightKelvinDIM: { value: "" },
        dptLightKelvinDIM: { value: "" },

        nameLightKelvinPercentage: { value: "" },
        GALightKelvinPercentage: { value: "" },
        dptLightKelvinPercentage: { value: "" },

        nameLightKelvinPercentageState: { value: "" },
        GALightKelvinPercentageState: { value: "" },
        dptLightKelvinPercentageState: { value: "" },

        nameLightKelvin: { value: "" },
        GALightKelvin: { value: "" },
        dptLightKelvin: { value: "" },

        nameLightKelvinState: { value: "" },
        GALightKelvinState: { value: "" },
        dptLightKelvinState: { value: "" },

        nameLightBrightness: { value: "" },
        GALightBrightness: { value: "" },
        dptLightBrightness: { value: "" },

        nameLightBrightnessState: { value: "" },
        GALightBrightnessState: { value: "" },
        dptLightBrightnessState: { value: "" },

        nameLightBlink: { value: "" },
        GALightBlink: { value: "" },
        dptLightBlink: { value: "" },

        nameLightColorCycle: { value: "" },
        GALightColorCycle: { value: "" },
        dptLightColorCycle: { value: "" },

        nameLightEffect: { value: "" },
        GALightEffect: { value: "" },
        dptLightEffect: { value: "" },

        nameLightEffectStatus: { value: "" },
        GALightEffectStatus: { value: "" },
        dptLightEffectStatus: { value: "" },

        effectRules: { value: '[]' },

        nameDaylightSensor: { value: "" },
        GADaylightSensor: { value: "" },
        dptDaylightSensor: { value: "" },

        specifySwitchOnBrightness: { value: "temperature" },
        colorAtSwitchOnDayTime: { value: '{"kelvin":3000, "brightness":100 }' },

        enableDayNightLighting: { value: "no" },
        colorAtSwitchOnNightTime: { value: '{ "kelvin":2700, "brightness":20 }' },

        invertDayNight: { value: false },
        invertDimTunableWhiteDirection: { value: false },

        updateKNXBrightnessStatusOnHUEOnOff: { value: "no" },
        dimSpeed: { value: 5000, required: false },
        HSVDimSpeed: { value: 5000, required: false },
        minDimLevelLight: { value: 10, required: false },
        maxDimLevelLight: { value: 100, required: false },
        readStatusAtStartup: { value: "yes" },
        enableNodePINS: { value: "no" },

        outputs: { value: 0 },
        inputs: { value: 0 },

        hueDevice: { value: "" },
        hueDeviceObject: { value: {} },

        restoreDayMode: { value: "no" }, // Starting from v 4.1.31
        updateLocalStateFromKNXWrite: { value: true } // Starting from v 4.1.31
      },
      inputs: 0,
      outputs: 0,
      icon: "node-hue-icon.svg",
      label: function () {
        return `${this.name || "Hue Light/Outlet"} (deprecated)`;
      },
      paletteLabel: "Hue Light/Outlet (deprecated)",
      oneditprepare: function () {
        // Go to the help panel
        try {
          RED.sidebar.show("help");
        } catch (error) { }


        var node = this; // Starting from v 4.1.31
        $("#node-input-updateLocalStateFromKNXWrite").prop("checked", node.updateLocalStateFromKNXWrite === true || node.updateLocalStateFromKNXWrite === "true"); // Starting from v 4.1.31
        const ensureConfigSelection = (selector) => {
          if ($(selector).val() !== "_ADD_") return;
          try {
            $(selector).prop("selectedIndex", 0);
          } catch (error) {
            // Ignore UI quirks for legacy Node-RED versions
          }
        };
        ["#node-input-serverHue"].forEach(ensureConfigSelection);

        function ensureVerticalTabsStyle() {
          if ($('#knxUltimateHueLightVerticalTabs').length) return;
          const style = `
            <style id="knxUltimateHueLightVerticalTabs">
              .hue-vertical-tabs.ui-tabs.ui-widget.ui-widget-content.ui-corner-all {
                display: flex;
                border: none;
                padding: 0;
              }
              .hue-vertical-tabs > ul.ui-tabs-nav {
                flex: 0 0 180px;
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
                white-space: normal;
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
            </style>`;
          $('head').append(style);
        }

        function onEditPrepare() {
          ensureVerticalTabsStyle();
          const $knxServerInput = $("#node-input-server");
          const KNX_EMPTY_VALUES = new Set(['', 'none', '_add_', '__none__']);
          const $hueServerInput = $("#node-input-serverHue");
          const $hueDeviceInput = $("#node-input-hueDevice");
          const $deviceNameInput = $("#node-input-name");
          const $refreshDevicesButton = $(".hue-refresh-devices");
          const $locateDeviceButton = $(".hue-locate-device");
          const $hueDevicesLoading = $(".hue-devices-loading");
          let cachedHueDevices = Array.isArray(node._cachedHueLightDevices) ? node._cachedHueLightDevices : [];
          node._cachedHueLightDevices = cachedHueDevices;
          const defaultHueDevicePlaceholder = $deviceNameInput.attr('placeholder') || '';
          let showingNoHueDevicesPlaceholder = false;
          const HUE_EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);
          let locateSessionActive = false;
          let locateAutoResetTimer = null;
          let locatePendingRequest = null;
          node.__stopHueLocateSession = null;
          node.__cleanupNodeRemovalListener = null;
          if (!node.__locateSessionInfo) node.__locateSessionInfo = null;
          node.__hueLocateActive = false;

          const clearLocateAutoReset = () => {
            if (locateAutoResetTimer !== null) {
              clearTimeout(locateAutoResetTimer);
              locateAutoResetTimer = null;
            }
          };

          const scheduleLocateAutoReset = (durationMs) => {
            clearLocateAutoReset();
            const ms = Number(durationMs);
            if (!Number.isFinite(ms) || ms <= 0) return;
            locateAutoResetTimer = setTimeout(() => {
              updateLocateButtonState(false);
            }, ms);
          };

          const updateLocateButtonState = (isActive) => {
            locateSessionActive = !!isActive;
            node.__hueLocateActive = locateSessionActive;
            if (!locateSessionActive) {
              clearLocateAutoReset();
              node.__locateSessionInfo = null;
            }
            if (!$locateDeviceButton.length) return;
            const $icon = $locateDeviceButton.find('i').first();
            if ($icon.length) {
              $icon.removeClass('fa-stop fa-play').addClass(locateSessionActive ? 'fa fa-stop' : 'fa fa-play');
            }
            const title = locateSessionActive
              ? (node._('knxUltimateHueLight.locate_stop_title') || 'Stop Hue locate')
              : (node._('knxUltimateHueLight.locate_start_title') || 'Locate selected Hue device');
            $locateDeviceButton.attr('title', title);
          };

          const removeNodeRemovalListener = () => {
            if (typeof node.__cleanupNodeRemovalListener === 'function') {
              try {
                RED.events.removeListener('nodes:remove', node.__cleanupNodeRemovalListener);
              } catch (error) { /* empty */ }
              node.__cleanupNodeRemovalListener = null;
            }
          };

          const collectRemovedIds = (input, bucket = new Set()) => {
            if (!input) return bucket;
            if (Array.isArray(input)) {
              input.forEach((entry) => collectRemovedIds(entry, bucket));
              return bucket;
            }
            if (typeof input === 'string') {
              bucket.add(input);
              return bucket;
            }
            if (typeof input === 'object') {
              if (input.id) bucket.add(input.id);
              if (input.nodes) collectRemovedIds(input.nodes, bucket);
            }
            return bucket;
          };

          const handleNodeRemoved = (payload) => {
            const ids = collectRemovedIds(payload);
            if (ids.has(node.id) && typeof node.__stopHueLocateSession === 'function') {
              node.__stopHueLocateSession();
              removeNodeRemovalListener();
            }
          };
          try {
            RED.events.on('nodes:remove', handleNodeRemoved);
            node.__cleanupNodeRemovalListener = handleNodeRemoved;
          } catch (error) {
            // Locate and the mapping editor must remain usable even when an
            // older/custom Node-RED editor does not expose the event bus.
            node.__cleanupNodeRemovalListener = null;
          }

          const notifyEditorError = (error, stage) => {
            const detail = error && error.message ? error.message : String(error || 'Unknown error');
            const fallback = `Hue editor error (${stage}): ${detail}`;
            let message = fallback;
            try {
              message = node._('knxUltimateHueLight.editor_init_error', { stage, error: detail }) || fallback;
            } catch (translationError) { /* use fallback */ }
            try {
              RED.notify(message, { type: 'error', fixed: true });
            } catch (notifyError) { /* console fallback below */ }
            try { console.error(fallback, error); } catch (consoleError) { /* empty */ }
          };

          const getHueDeviceValue = ({ allowStored = false } = {}) => {
            if ($hueDeviceInput.length) {
              const domValue = $hueDeviceInput.val();
              if (domValue !== undefined && domValue !== null && domValue !== '') {
                return domValue;
              }
            }
            if (node.hueDevice !== undefined && node.hueDevice !== null && node.hueDevice !== '') {
              return node.hueDevice;
            }
            if (allowStored && node.__locateSessionInfo && node.__locateSessionInfo.deviceId) {
              const suffix = node.__locateSessionInfo.deviceType || 'light';
              return `${node.__locateSessionInfo.deviceId}#${suffix}`;
            }
            return '';
          };

          const buildLocateContext = ({ allowStored = false } = {}) => {
            const hueServerId = resolveHueServerValue({ allowStored });
            const rawDevice = getHueDeviceValue({ allowStored });
            if (!hueServerId || !rawDevice) return null;
            const parts = String(rawDevice).split('#');
            const deviceId = (parts[0] || '').trim();
            if (deviceId === '') return null;
            const deviceType = (parts[1] || 'light').trim() || 'light';
            return { serverId: hueServerId, deviceId, deviceType };
          };

          const performLocateRequest = ({ silent = false, allowStoredContext = false, action } = {}) => {
            const context = buildLocateContext({ allowStored: allowStoredContext });
            if (!context) {
              if (!silent) {
                const message = !resolveHueServerValue({ allowStored: true })
                  ? (node._('knxUltimateHueLight.locate_no_bridge') || 'Select a Hue bridge first')
                  : (node._('knxUltimateHueLight.locate_no_device') || 'Select a Hue device first');
                RED.notify(message, 'warning');
              }
              updateLocateButtonState(false);
              return null;
            }
            if ($locateDeviceButton.length) {
              $locateDeviceButton.prop('disabled', true);
            }
            const effectiveAction = action || (locateSessionActive ? 'stop' : 'start');
            const request = $.ajax({
              type: 'POST',
              url: 'KNXUltimateLocateHueDevice',
              data: {
                serverId: context.serverId,
                deviceId: context.deviceId,
                deviceType: context.deviceType,
                action: effectiveAction
              }
            });
            locatePendingRequest = request;
            if (!allowStoredContext && effectiveAction === 'start') {
              node.__locateSessionInfo = {
                serverId: context.serverId,
                deviceId: context.deviceId,
                deviceType: context.deviceType
              };
            } else if (!node.__locateSessionInfo && effectiveAction !== 'stop') {
              node.__locateSessionInfo = {
                serverId: context.serverId,
                deviceId: context.deviceId,
                deviceType: context.deviceType
              };
            }
            request.done((response) => {
              const statusValue = (response && typeof response.status === 'string') ? response.status.toLowerCase() : 'started';
              let messageKey;
              if (effectiveAction === 'stop' || statusValue === 'stopped') {
                messageKey = 'knxUltimateHueLight.locate_stopped';
                node.__locateSessionInfo = null;
                updateLocateButtonState(false);
                clearLocateAutoReset();
              } else if (effectiveAction === 'start' || statusValue === 'started') {
                messageKey = 'knxUltimateHueLight.locate_started';
                node.__locateSessionInfo = {
                  serverId: context.serverId,
                  deviceId: context.deviceId,
                  deviceType: context.deviceType
                };
                updateLocateButtonState(true);
                scheduleLocateAutoReset(response && typeof response.expiresInMs === 'number' ? response.expiresInMs : 600000);
              } else {
                messageKey = 'knxUltimateHueLight.locate_success';
                node.__locateSessionInfo = null;
                updateLocateButtonState(false);
                clearLocateAutoReset();
              }
              if (!silent) {
                const message = node._(messageKey) || (statusValue === 'stopped' ? 'Locate stopped' : 'Locate command sent');
                RED.notify(message, 'success');
              }
            }).fail((xhr) => {
              let message;
              if (xhr && xhr.responseJSON && xhr.responseJSON.error) {
                message = xhr.responseJSON.error;
              }
              updateLocateButtonState(false);
              clearLocateAutoReset();
              if (!silent) {
                RED.notify(message || (node._('knxUltimateHueLight.locate_error') || 'Unable to locate Hue device'), { type: 'error', fixed: true });
              }
            }).always(() => {
              locatePendingRequest = null;
              if ($locateDeviceButton.length) {
                $locateDeviceButton.prop('disabled', false);
              }
            });
            return request;
          };

          // Bind Locate before tabs, effects and KNX widgets are initialized.
          // A failure in an unrelated editor widget must never leave a visible
          // Locate button without a click handler or user feedback.
          if ($locateDeviceButton.length) {
            $locateDeviceButton.off('.knxUltimateHueLight').on('click.knxUltimateHueLight', () => {
              const desiredAction = locateSessionActive ? 'stop' : 'start';
              performLocateRequest({ silent: false, action: desiredAction });
            });
            updateLocateButtonState(false);
          }

          const resolveKnxServerValue = () => {
            const domValue = $knxServerInput.val();
            if (domValue !== undefined && domValue !== null) {
              const normalized = String(domValue).trim();
              if (!KNX_EMPTY_VALUES.has(normalized.toLowerCase())) return normalized;
            }
            if (node.server !== undefined && node.server !== null) {
              const stored = String(node.server).trim();
              if (!KNX_EMPTY_VALUES.has(stored.toLowerCase())) return stored;
            }
            return '';
          };

          const hasKnxServerSelected = () => {
            return resolveKnxServerValue() !== '';
          };

          const $tabs = $("#tabs");
          const $pinSectionRow = $("#node-input-enableNodePINS").closest('.form-row');
          const $pinSelect = $("#node-input-enableNodePINS");
          const $pinInfoRow = $pinSectionRow.next('.form-tips');
          const updateTabsVisibility = () => {
            const knxSelected = hasKnxServerSelected();
            const hueDeviceSelected = getHueDeviceValue() !== '';
            const shouldShowTabs = knxSelected && hueDeviceSelected;

            if (shouldShowTabs) {
              $tabs.show();
              try { $tabs.tabs('refresh'); } catch (error) { /* tabs may not be initialized yet */ }
            } else {
              $tabs.hide();
            }

            if ($pinSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($pinSelect.val() !== desiredPins) {
                $pinSelect.val(desiredPins).trigger('change');
              }
            }

            if ($pinSectionRow.length) $pinSectionRow.show();
            if ($pinInfoRow.length) $pinInfoRow.show();
          };

          // Reveal the mapping container before initializing optional widgets.
          // This also provides a usable fallback if one of those widgets fails.
          updateTabsVisibility();

          const resolveHueServerValue = ({ allowStored = false } = {}) => {
            if ($hueServerInput.length) {
              const domValue = $hueServerInput.val();
              if (domValue !== undefined && domValue !== null) {
                const trimmed = String(domValue).trim();
                if (trimmed !== '' && !HUE_EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return trimmed;
              }
            }
            if (node.serverHue !== undefined && node.serverHue !== null) {
              const stored = String(node.serverHue).trim();
              if (stored !== '' && !HUE_EMPTY_SERVER_VALUES.has(stored.toLowerCase())) return stored;
            }
            if (allowStored && node.__locateSessionInfo && node.__locateSessionInfo.serverId) {
              return node.__locateSessionInfo.serverId;
            }
            return '';
          };

          const getHueServerConfig = () => {
            const id = resolveHueServerValue();
            if (id === '') return null;
            try {
              return RED.nodes.node(id) || null;
            } catch (error) {
              return null;
            }
          };

          const resolveDeviceTypeSuffix = (deviceType) => {
            const normalized = (deviceType || '').toLowerCase();
            return normalized === 'grouped_light' ? '#grouped_light' : '#light';
          };

          const applyHueDevicesPlaceholder = (hasDevices) => {
            if (!$deviceNameInput.length) return;
            if (hasDevices) {
              if (showingNoHueDevicesPlaceholder) {
                showingNoHueDevicesPlaceholder = false;
                $deviceNameInput.attr('placeholder', defaultHueDevicePlaceholder);
              }
              return;
            }
            const message = node._('knxUltimateHueLight.no_devices') || defaultHueDevicePlaceholder;
            showingNoHueDevicesPlaceholder = true;
            $deviceNameInput.attr('placeholder', message);
            if (($deviceNameInput.val() || '').trim() === '') {
              $deviceNameInput.val('');
            }
          };

          const filterHueDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              if (!value || !value.id) return null;
              const deviceName = value.name || value.id;
              if (cleaned !== '' && !htmlUtilsfullCSVSearch(deviceName, cleaned)) {
                return null;
              }
              const suffix = resolveDeviceTypeSuffix(value.deviceType);
              return {
                hueDevice: `${value.id}${suffix}`,
                value: deviceName,
                deviceObject: value.deviceObject || value,
                deviceType: value.deviceType || 'light'
              };
            });
          };

          const fetchHueDevices = (term, respond, { forceRefresh = false } = {}) => {
            const hueServer = getHueServerConfig();
            if (!hueServer) {
              applyHueDevicesPlaceholder(true);
              if (typeof respond === 'function') respond([]);
              node.__locateSessionInfo = null;
              updateLocateButtonState(false);
              return;
            }
            if (!forceRefresh && Array.isArray(cachedHueDevices) && cachedHueDevices.length > 0) {
              applyHueDevicesPlaceholder(cachedHueDevices.length > 0);
              if (typeof respond === 'function') respond(filterHueDevices(cachedHueDevices, term));
              return;
            }
            if ($hueDevicesLoading.length) {
              $hueDevicesLoading.show();
            }
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=light&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedHueDevices = listCandidates.map((value) => {
                const deviceObject = value.deviceObject || value;
                const rawId = deviceObject?.id || value.id || value.rid || '';
                const trimmedId = typeof rawId === 'string' ? rawId.trim() : rawId;
                if (trimmedId === undefined || trimmedId === null || String(trimmedId).trim() === '') return null;
                return {
                  id: String(trimmedId).trim(),
                  name: value.name || value.metadata?.name || deviceObject?.metadata?.name || '',
                  deviceType: deviceObject?.type || value.type || '',
                  deviceObject
                };
              }).filter(Boolean);
              node._cachedHueLightDevices = cachedHueDevices;
              applyHueDevicesPlaceholder(cachedHueDevices.length > 0);
              if (typeof respond === 'function') respond(filterHueDevices(cachedHueDevices, term));
            }).always(() => {
              if ($hueDevicesLoading.length) {
                $hueDevicesLoading.hide();
              }
            }).fail(() => {
              cachedHueDevices = [];
              node._cachedHueLightDevices = cachedHueDevices;
              applyHueDevicesPlaceholder(false);
              if ($hueDevicesLoading.length) {
                $hueDevicesLoading.hide();
              }
              if (typeof respond === 'function') respond([]);
              node.__locateSessionInfo = null;
              updateLocateButtonState(false);
            });
          };

          // TIMER BLINK ####################################################
          let blinkStatus = 2;
          let timerBlinkBackground;
          function blinkBackground(_elementIDwithHashAtTheBeginning) {
            if (timerBlinkBackground !== undefined) clearInterval(timerBlinkBackground);
            timerBlinkBackground = setInterval(() => {
              if (isEven(blinkStatus)) $(_elementIDwithHashAtTheBeginning).css("background-color", "lightgreen");
              if (!isEven(blinkStatus)) $(_elementIDwithHashAtTheBeginning).css("background-color", "");
              blinkStatus += 1;
              if (blinkStatus >= 14) {
                clearInterval(timerBlinkBackground);
                blinkStatus = 2;
                $(_elementIDwithHashAtTheBeginning).css("background-color", "");
              }
            }, 100);
          }
          function isEven(n) {
            return (n % 2 == 0);
          }
          // ################################################################

          const $effectStorage = $("#node-input-effectRules");
          let parsedEffectRules = [];
          if (Array.isArray(node.effectRules)) {
            parsedEffectRules = JSON.parse(JSON.stringify(node.effectRules));
          } else {
            try {
              parsedEffectRules = JSON.parse(node.effectRules || '[]');
            } catch (error) {
              parsedEffectRules = [];
            }
          }
          if (!Array.isArray(parsedEffectRules)) parsedEffectRules = [];
          node.effectRules = parsedEffectRules;
          const $effectList = $("#node-input-effect-rule-container");
          const syncEffectRulesStorage = () => {
            try {
              $effectStorage.val(JSON.stringify(node.effectRules || []));
            } catch (error) {
              $effectStorage.val('[]');
            }
          };
          const rebuildEffectRulesFromUI = () => {
            const collected = [];
            try {
              const items = $effectList.editableList('items');
              items.each(function () {
                const $row = $(this);
                const knxValue = $row.find('.rowEffectKNXValue').val();
                const hueEffect = $row.find('.rowEffectHueEffect').val();
                if (hueEffect && hueEffect !== '') {
                  collected.push({
                    knxValue: knxValue !== undefined && knxValue !== null ? knxValue : '',
                    hueEffect
                  });
                }
              });
            } catch (error) { }
            node.effectRules = collected;
            syncEffectRulesStorage();
          };
          const bindEffectRowEvents = ($row) => {
            $row.find('.rowEffectKNXValue').on('input change', rebuildEffectRulesFromUI);
            $row.find('.rowEffectHueEffect').on('change', rebuildEffectRulesFromUI);
          };
          syncEffectRulesStorage();
          const $effectContainer = $("#divHueEffectsContainer");
          const $effectContent = $("#divHueEffectsContent");
          const $effectNoSupport = $("#divHueEffectsNoSupport");
          let effectOptions = [];

          const normalizeEffectEntry = (effect, { fallbackLabel } = {}) => {
            if (effect === undefined || effect === null) return null;
            if (typeof effect === 'string') {
              const trimmed = effect.trim();
              return trimmed === '' ? null : { value: trimmed, label: trimmed };
            }
            if (typeof effect === 'object') {
              const nested = (candidate) => {
                if (!candidate || typeof candidate !== 'object') return undefined;
                return candidate.value ?? candidate.effect ?? candidate.id ?? candidate.code ?? candidate.type ?? candidate.name ?? candidate.title;
              };
              const statusCandidate = typeof effect.status === 'object' ? nested(effect.status) : undefined;
              const rawValue = effect.value ?? effect.effect ?? statusCandidate ?? effect.status ?? effect.id ?? effect.type ?? effect.code;
              const rawLabel = effect.label ?? effect.name ?? effect.title ?? effect.display ?? effect.display_name ?? effect.text ?? effect.description ?? (typeof effect.status === 'object' ? (effect.status.name ?? effect.status.title ?? effect.status.label) : undefined);
              const value = rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : '';
              const labelSource = rawLabel !== undefined && rawLabel !== null ? rawLabel : (fallbackLabel !== undefined ? fallbackLabel : rawValue);
              const label = labelSource !== undefined && labelSource !== null ? String(labelSource).trim() : '';
              if (value === '') return null;
              return { value, label: label === '' ? value : label };
            }
            const stringified = String(effect).trim();
            return stringified === '' ? null : { value: stringified, label: stringified };
          };

          const collectEffectFallbacks = () => {
            const fallback = [];
            if (Array.isArray(node.effectRules)) {
              node.effectRules.forEach((rule) => {
                const entry = normalizeEffectEntry(rule ? rule.hueEffect : null);
                if (entry) fallback.push(entry);
              });
            }
            return fallback;
          };

          const collectHueDeviceObjectEffects = () => {
            const fallback = [];
            if (node.hueDeviceObject && node.hueDeviceObject.effects && Array.isArray(node.hueDeviceObject.effects.status_values)) {
              node.hueDeviceObject.effects.status_values.forEach((raw) => {
                const entry = normalizeEffectEntry(raw);
                if (entry) fallback.push(entry);
              });
            }
            return fallback;
          };

          const getAllEffectOptions = () => {
            const combined = [];
            const pushUnique = (entry, { forceFront = false } = {}) => {
              if (!entry || !entry.value) return;
              const existingIndex = combined.findIndex((candidate) => candidate.value === entry.value);
              if (existingIndex !== -1) {
                if (forceFront && existingIndex > 0) {
                  const [existing] = combined.splice(existingIndex, 1);
                  combined.unshift(existing);
                }
                return;
              }
              if (forceFront) {
                combined.unshift(entry);
              } else {
                combined.push(entry);
              }
            };

            pushUnique({ value: 'no_effect', label: 'no_effect' }, { forceFront: true });

            effectOptions.forEach((option) => pushUnique(option));
            collectHueDeviceObjectEffects().forEach((option) => pushUnique(option));
            collectEffectFallbacks().forEach((option) => pushUnique(option));

            return combined;
          };

          function populateEffectSelect($select, selectedValue) {
            const targetValue = selectedValue !== undefined && selectedValue !== null
              ? String(selectedValue).trim()
              : '';
            const entries = getAllEffectOptions();
            $select.empty();
            entries.forEach((entry) => {
              $select.append($("<option></option>").attr("value", entry.value).text(entry.label));
            });
            if (targetValue && entries.some((entry) => entry.value === targetValue)) {
              $select.val(targetValue);
            } else if (!targetValue && entries.length > 0) {
              $select.val(entries[0].value);
            }
            return entries.map((entry) => entry.value);
          }

          function decorateEffectValueInput() { }

          function refreshEffectRows() {
            if (!$effectList.data('effectListInitialized')) return;
            const items = $effectList.editableList('items');
            items.each(function () {
              const $row = $(this);
              const $select = $row.find('select.rowEffectHueEffect');
              const currentValue = $select.val();
              populateEffectSelect($select, currentValue);
              decorateEffectValueInput($row.find('.rowEffectKNXValue'));
            });
          }

          function setAvailableEffects(effects) {
            const sanitized = [];
            if (Array.isArray(effects)) {
              effects.forEach((raw) => {
                const entry = normalizeEffectEntry(raw);
                if (entry) sanitized.push(entry);
              });
            }
            effectOptions = sanitized;
            const hasMappings = Array.isArray(node.effectRules) && node.effectRules.length > 0;
            const hasOptions = effectOptions.length > 0;

            if (!hasOptions && !hasMappings) {
              $effectContainer.show();
              $effectContent.hide();
              $effectNoSupport.show();
            } else {
              $effectContainer.show();
              $effectContent.show();
              $effectNoSupport.toggle(!hasOptions);
            }

            $("#node-input-effect-autofill").prop('disabled', !hasOptions);
            refreshEffectRows();
          }

          function decorateEffectValueInput() { }

          function ensureEffectEditableList() {
            if ($effectList.data('effectListInitialized')) return;
            $effectList.editableList({
              addItem: function (container, i, opt) {
                const data = opt && opt.rule ? opt.rule : (opt || {});
                const row = $('<div/>', { class: 'form-row effect-rule-row' }).appendTo(container);
                const $valueInput = $('<input/>', {
                  class: 'rowEffectKNXValue',
                  type: 'text',
                  placeholder: node._('knxUltimateHueLight.effect_knx_value_placeholder') || 'Value',
                  style: 'width:40%; margin-left:0; text-align:left;'
                }).appendTo(row);
                $valueInput.val(data.knxValue || '');
                decorateEffectValueInput($valueInput);
                $('<span/>', { html: '&nbsp;&rarr;&nbsp;', style: 'display:inline-block; margin:0 8px;' }).appendTo(row);
                const $select = $('<select/>', {
                  class: 'rowEffectHueEffect',
                  style: 'width:45%;'
                }).appendTo(row);
                const availableOptions = populateEffectSelect($select, data.hueEffect);
                if ((!data || !data.hueEffect) && availableOptions.length > 0) {
                  $select.val(availableOptions[0]);
                }
                bindEffectRowEvents(row);
              },
              removable: true,
              sortable: false,
              removeItem: function () {
                rebuildEffectRulesFromUI();
              }
            });
            $effectList.data('effectListInitialized', true);
          }

          try {
            ensureEffectEditableList();
            const initialEffects = (node.hueDeviceObject && node.hueDeviceObject.effects && Array.isArray(node.hueDeviceObject.effects.status_values))
              ? node.hueDeviceObject.effects.status_values
              : [];
            setAvailableEffects(initialEffects);
            if (Array.isArray(node.effectRules) && node.effectRules.length > 0) {
              const items = $effectList.editableList('items');
              items.each(function () { $(this).remove(); });
              node.effectRules.forEach((rule) => {
                $effectList.editableList('addItem', { rule });
              });
              refreshEffectRows();
              rebuildEffectRulesFromUI();
            }
          } catch (error) {
            notifyEditorError(error, 'effects');
          }

          $("#node-input-effect-autofill").off('click').on('click', function () {
            if (effectOptions.length === 0) return;
            const items = $effectList.editableList('items');
            items.each(function () { $(this).remove(); });
            effectOptions.forEach((effect) => {
              if (!effect || !effect.value) return;
              $effectList.editableList('addItem', { rule: { knxValue: effect.value, hueEffect: effect.value } });
            });
            refreshEffectRows();
            rebuildEffectRulesFromUI();
          });

          $('#node-input-dptLightEffect').on('change', () => {
            const items = $effectList.editableList('items');
            items.each(function () {
              decorateEffectValueInput($(this).find('.rowEffectKNXValue'));
            });
          });

          $tabs.addClass('hue-vertical-tabs');
          try {
            $tabs.tabs(); // Tabs gestione KNX
            $tabs.find('ul').addClass('ui-tabs-nav');
            $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');
          } catch (error) {
            // Keep the raw sections visible and report the exact widget error.
            // Locate was already bound above and remains fully operational.
            notifyEditorError(error, 'tabs');
          }

          function getDPT(_dpt, _destinationWidget) {
            // DPT Switch command
            // ########################
            const prefixes = Array.isArray(_dpt) ? _dpt : [_dpt];
            $(_destinationWidget).empty();
            if (!hasKnxServerSelected()) {
              return;
            }
            const serverId = resolveKnxServerValue();
            $.getJSON(`knxUltimateDpts?serverId=${serverId}&_=${Date.now()}`, (data) => {
              data.forEach((dpt) => {
                if (prefixes.some((prefix) => prefix === "" || dpt.value.startsWith(prefix))) {
                  // Adjustment for HUE Temperature
                  if (dpt.value.startsWith("7.600")) {
                    $(_destinationWidget).append($("<option></option>").attr("value", dpt.value).text(dpt.text + " - KNX Kelvin range 2000-6535k (Homeassistant color_temperature_mode: absolute)"));
                  } else if (dpt.value.startsWith("9.002")) {
                    $(_destinationWidget).append($("<option></option>").attr("value", dpt.value).text(dpt.text + " - HUE Kelvin range 2000-6535k (Homeassistant color_temperature_mode: absolute_float)"));
                  } else if (dpt.value.startsWith("5.001")) {
                    $(_destinationWidget).append($("<option></option>").attr("value", dpt.value).text(dpt.text + " - Homeassistant color_temperature_mode: relative"));
                  } else {
                    $(_destinationWidget).append($("<option></option>").attr("value", dpt.value).text(dpt.text));
                  }
                }
              });
              // Eval
              const format = "node." + _destinationWidget.replace("#node-input-", "");
              try {
                if (format !== undefined) $(_destinationWidget).val(eval(format).toString());
              } catch (error) { }
              if (_destinationWidget === '#node-input-dptLightEffect') {
                $(_destinationWidget).trigger('change');
              }
            });
          }

          function getGroupAddress(_sourceWidgetAutocomplete, _destinationWidgetName, _destinationWidgetDPT, _additionalSearchTerm) {
            $(_sourceWidgetAutocomplete).autocomplete({
              minLength: 0,
              source: function (request, response) {
                if (!hasKnxServerSelected()) {
                  response([]);
                  return;
                }
                const serverId = resolveKnxServerValue();
                $.getJSON(`knxUltimatecsv?nodeID=${serverId}&_=${Date.now()}`, (data) => {
                  response(
                    $.map(data, function (value, key) {
                      var sSearch = value.ga + " (" + value.devicename + ") DPT" + value.dpt;
                      for (let index = 0; index < _additionalSearchTerm.length; index++) {
                        const sDPT = _additionalSearchTerm[index];
                        if (htmlUtilsfullCSVSearch(sSearch, request.term + " " + sDPT)) {
                          return {
                            label: value.ga + " # " + value.devicename + " # " + value.dpt, // Label for Display
                            value: value.ga, // Value
                          };
                        }
                      };
                    })
                  );
                });
              },
              select: function (event, ui) {
                // Sets Datapoint and device name automatically
                var sDevName = ui.item.label.split("#")[1].trim();
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(")") + 1).trim();
                } catch (error) { }
                $(_destinationWidgetName).val(sDevName);
                var optVal = $(_destinationWidgetDPT + " option:contains('" + ui.item.label.split("#")[2].trim() + "')").attr("value");
                const $dptSelect = $(_destinationWidgetDPT);
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  // Ensure downstream widgets refresh even when the DPT is missing
                  $dptSelect.trigger('change');
                }
              },
            }).focus(function () {
              $(this).autocomplete('search', $(this).val() + 'exactmatch');
            });
            try {
              if (hasKnxServerSelected()) {
                const srv = RED.nodes.node(resolveKnxServerValue());
                if (srv && srv.id) KNX_enableSecureFormatting($(_sourceWidgetAutocomplete), srv.id);
              }
            } catch (e) { }
          }

          const effectDptPrefixes = ["1.", "2.", "5.", "6.", "7.", "8.", "9.", "16.", "20."];

          const refreshKnxBindings = () => {
            getDPT("1.", "#node-input-dptLightSwitch");
            getGroupAddress("#node-input-GALightSwitch", "#node-input-nameLightSwitch", "#node-input-dptLightSwitch", ["1."]);

            getDPT("1.", "#node-input-dptLightState");
            getGroupAddress("#node-input-GALightState", "#node-input-nameLightState", "#node-input-dptLightState", ["1."]);

            getDPT("3.007", "#node-input-dptLightDIM");
            getGroupAddress("#node-input-GALightDIM", "#node-input-nameLightDIM", "#node-input-dptLightDIM", ["3.007"]);

            getDPT("5.001", "#node-input-dptLightBrightness");
            getGroupAddress("#node-input-GALightBrightness", "#node-input-nameLightBrightness", "#node-input-dptLightBrightness", ["5.001"]);

            getDPT("5.001", "#node-input-dptLightBrightnessState");
            getGroupAddress("#node-input-GALightBrightnessState", "#node-input-nameLightBrightnessState", "#node-input-dptLightBrightnessState", ["5.001"]);

            getDPT("232.600", "#node-input-dptLightColor");
            getGroupAddress("#node-input-GALightColor", "#node-input-nameLightColor", "#node-input-dptLightColor", ["232.600"]);

            getDPT("232.600", "#node-input-dptLightColorState");
            getGroupAddress("#node-input-GALightColorState", "#node-input-nameLightColorState", "#node-input-dptLightColorState", ["232.600"]);

            getDPT("3.007", "#node-input-dptLightKelvinDIM");
            getGroupAddress("#node-input-GALightKelvinDIM", "#node-input-nameLightKelvinDIM", "#node-input-dptLightKelvinDIM", ["3.007"]);

            getDPT("5.001", "#node-input-dptLightKelvinPercentage");
            getGroupAddress("#node-input-GALightKelvinPercentage", "#node-input-nameLightKelvinPercentage", "#node-input-dptLightKelvinPercentage", ["5.001"]);

            getDPT("5.001", "#node-input-dptLightKelvinPercentageState");
            getGroupAddress("#node-input-GALightKelvinPercentageState", "#node-input-nameLightKelvinPercentageState", "#node-input-dptLightKelvinPercentageState", ["5.001"]);

            getDPT("1.", "#node-input-dptLightBlink");
            getGroupAddress("#node-input-GALightBlink", "#node-input-nameLightBlink", "#node-input-dptLightBlink", ["1."]);

            getDPT("1.", "#node-input-dptLightColorCycle");
            getGroupAddress("#node-input-GALightColorCycle", "#node-input-nameLightColorCycle", "#node-input-dptLightColorCycle", ["1."]);

            getDPT(effectDptPrefixes, "#node-input-dptLightEffect");
            getGroupAddress("#node-input-GALightEffect", "#node-input-nameLightEffect", "#node-input-dptLightEffect", effectDptPrefixes);

            getDPT(effectDptPrefixes, "#node-input-dptLightEffectStatus");
            getGroupAddress("#node-input-GALightEffectStatus", "#node-input-nameLightEffectStatus", "#node-input-dptLightEffectStatus", effectDptPrefixes);

            getDPT("1.", "#node-input-dptDaylightSensor");
            getGroupAddress("#node-input-GADaylightSensor", "#node-input-nameDaylightSensor", "#node-input-dptDaylightSensor", ["1."]);

            getDPT("7.600", "#node-input-dptLightKelvin");
            getDPT("9.002", "#node-input-dptLightKelvin");
            getDPT("9.002", "#node-input-dptLightKelvinState");
            getDPT("7.600", "#node-input-dptLightKelvinState");
            getGroupAddress("#node-input-GALightKelvin", "#node-input-nameLightKelvin", "#node-input-dptLightKelvin", ["7.600", "9.002"]);
            getGroupAddress("#node-input-GALightKelvinState", "#node-input-nameLightKelvinState", "#node-input-dptLightKelvinState", ["7.600", "9.002"]);

            // HSV ----------------------
            // H
            getDPT("3.007", "#node-input-dptLightHSV_H_DIM");
            getGroupAddress("#node-input-GALightHSV_H_DIM", "#node-input-nameLightHSV_H_DIM", "#node-input-dptLightHSV_H_DIM", ["3.007"]);

            getDPT("5.001", "#node-input-dptLightHSV_H_State");
            getGroupAddress("#node-input-GALightHSV_H_State", "#node-input-nameLightHSV_H_State", "#node-input-dptLightHSV_H_State", ["5.001"]);

            // S
            getDPT("3.007", "#node-input-dptLightHSV_S_DIM");
            getGroupAddress("#node-input-GALightHSV_S_DIM", "#node-input-nameLightHSV_S_DIM", "#node-input-dptLightHSV_S_DIM", ["3.007"]);

            getDPT("5.001", "#node-input-dptLightHSV_S_State");
            getGroupAddress("#node-input-GALightHSV_S_State", "#node-input-nameLightHSV_S_State", "#node-input-dptLightHSV_S_State", ["5.001"]);

            // V
            getDPT("3.007", "#node-input-dptLightHSV_V_DIM");
            getGroupAddress("#node-input-GALightHSV_V_DIM", "#node-input-nameLightHSV_V_DIM", "#node-input-dptLightHSV_V_DIM", ["3.007"]);

            getDPT("5.001", "#node-input-dptLightHSV_V_State");
            getGroupAddress("#node-input-GALightHSV_V_State", "#node-input-nameLightHSV_V_State", "#node-input-dptLightHSV_V_State", ["5.001"]);
            // END HSV ----------------------
          };

          refreshKnxBindings();

          updateTabsVisibility();

          $knxServerInput.on('change.knxUltimateHueLight', () => {
            refreshKnxBindings();
            updateTabsVisibility();
          });

          $hueDeviceInput.on('change.knxUltimateHueLight input.knxUltimateHueLight', updateTabsVisibility);

          if (($deviceNameInput.val() || '').trim() !== '') {
            applyHueDevicesPlaceholder(true);
          } else {
            applyHueDevicesPlaceholder(cachedHueDevices.length > 0);
          }

          if ($deviceNameInput.length) {
            if ($deviceNameInput.data('ui-autocomplete')) {
              try { $deviceNameInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            $deviceNameInput.autocomplete({
              minLength: 0,
              source(request, response) {
                fetchHueDevices(request.term, response);
              },
              select(event, ui) {
                if (!ui.item || !ui.item.hueDevice || ui.item.hueDevice === 'error') {
                  event.preventDefault();
                  return;
                }
                $deviceNameInput.val(ui.item.value || '');
                node.name = ui.item.value || node.name;
                $hueDeviceInput.val(ui.item.hueDevice);
                node.hueDevice = ui.item.hueDevice;
                node.hueDeviceObject = ui.item.deviceObject || { type: ui.item.deviceType };
                node.__locateSessionInfo = null;
                updateTabsVisibility();
                setTimeout(() => {
                  try { $deviceNameInput.autocomplete('close'); } catch (error) { /* empty */ }
                  Go();
                }, 0);
              },
              focus(event, ui) {
                event.preventDefault();
                $deviceNameInput.val(ui.item && ui.item.value ? ui.item.value : '');
              }
            }).focus(function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            }).on('input.knxUltimateHueLight', function () {
              if ($(this).val().trim() === '') {
                $hueDeviceInput.val('');
                node.hueDevice = '';
                node.__locateSessionInfo = null;
                updateTabsVisibility();
                updateLocateButtonState(false);
              }
            });
          }

          if ($refreshDevicesButton.length) {
            $refreshDevicesButton.off('.knxUltimateHueLight').on('click.knxUltimateHueLight', () => {
              cachedHueDevices = [];
              node._cachedHueLightDevices = cachedHueDevices;
              fetchHueDevices('', () => {
                if ($deviceNameInput.length) {
                  $deviceNameInput.autocomplete('search', `${$deviceNameInput.val()}exactmatch`);
                }
              }, { forceRefresh: true });
            });
          }

          if ($hueServerInput.length) {
            $hueServerInput.off('.knxUltimateHueLightDevices').on('change.knxUltimateHueLightDevices', () => {
              cachedHueDevices = [];
              node._cachedHueLightDevices = cachedHueDevices;
              showingNoHueDevicesPlaceholder = false;
              applyHueDevicesPlaceholder(true);
              node.__locateSessionInfo = null;
              updateLocateButtonState(false);
              if ($hueDevicesLoading.length) {
                $hueDevicesLoading.hide();
              }
            });
          }

          node.__stopHueLocateSession = () => {
            clearLocateAutoReset();
            removeNodeRemovalListener();
            const pending = locatePendingRequest;
            if (pending && typeof pending.always === 'function') {
              pending.always(() => {
                if (node.__locateSessionInfo || locateSessionActive) {
                  const followUp = performLocateRequest({ silent: true, allowStoredContext: true, action: 'stop' });
                  if (!followUp || typeof followUp.then !== 'function') {
                    updateLocateButtonState(false);
                  }
                } else {
                  updateLocateButtonState(false);
                }
              });
              return;
            }
            if (locateSessionActive || (node.__locateSessionInfo && node.__locateSessionInfo.deviceId)) {
              const request = performLocateRequest({ silent: true, allowStoredContext: true, action: 'stop' });
              if (!request || typeof request.then !== 'function') {
                updateLocateButtonState(false);
              }
            } else {
              updateLocateButtonState(false);
            }
          };

          // Get the HUE capabilities to enable/disable UI parts
          var getJsonPromise;
          const initialHueDeviceRaw = getHueDeviceValue();
          if (initialHueDeviceRaw === '') {
            updateTabsVisibility();
            return;
          } else {
            $hueDeviceInput.val(initialHueDeviceRaw);
            updateTabsVisibility();
            if (getJsonPromise !== undefined) getJsonPromise.abort();
            // HUE Controller temporarily selects Node-RED's `_ADD_` sentinel
            // while it bootstraps this mature editor. Reading the select here
            // would therefore query an inexistent bridge and return `{}` even
            // though the selected light has dimming, colour or tunable-white
            // capabilities. Resolve the real persisted config-node ID through
            // the same helper used by resource discovery and Locate instead.
            const capabilityServerId = resolveHueServerValue({ allowStored: true });
            const capabilityResourceId = initialHueDeviceRaw.split("#")[0];
            const applyHueCapabilities = (data) => {
              let oLight = data || {};
              const effects = (oLight && oLight.effects && Array.isArray(oLight.effects.status_values))
                ? oLight.effects.status_values
                : [];
              setAvailableEffects(effects);
              // Check if grouped, to hide/show the "Get current" buttons
              if (oLight.type === "grouped_light") {
                $("#tabs").tabs("enable", "#tabs-4");
                $("#tabs").tabs("enable", "#tabs-3");
                $("#tabs").tabs("enable", "#tabs-2");
                $("#getColorAtSwitchOnDayTimeButton").show();
                $("#getColorAtSwitchOnNightTimeButton").show();
                $("#node-input-specifySwitchOnBrightness").empty().append(
                  $("<option>")
                    .val("no")
                    .text(node._("knxUltimateHueLight.none"))
                ).append(
                  $("<option>")
                    .val("yes")
                    .text(node._("knxUltimateHueLight.select_color"))
                ).append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_temperature_brightness"))
                );
                $("#node-input-enableDayNightLighting").empty().append(
                  $("<option>")
                    .val("no")
                    .text(node._("knxUltimateHueLight.opt_no"))
                ).append(
                  $("<option>")
                    .val("yes")
                    .text(node._("knxUltimateHueLight.select_color"))
                ).append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_temperature_brightness"))
                );
                $("#node-input-specifySwitchOnBrightness").val(node.specifySwitchOnBrightness).trigger('change');
                $("#node-input-enableDayNightLighting").val(node.enableDayNightLighting).trigger('change');
                return;
              } else {

                $("#getColorAtSwitchOnDayTimeButton").show();
                $("#getColorAtSwitchOnNightTimeButton").show();
                $("#node-input-specifySwitchOnBrightness").empty().append(
                  $("<option>")
                    .val("no")
                    .text(node._("knxUltimateHueLight.none"))
                );
                $("#node-input-enableDayNightLighting").empty().append(
                  $("<option>")
                    .val("no")
                    .text(node._("knxUltimateHueLight.opt_no"))
                );
              }

              $("#tabs").tabs("disable", "#tabs-4");
              $("#tabs").tabs("disable", "#tabs-3");
              $("#tabs").tabs("disable", "#tabs-2");
              $("#divColorsAtSwitchOn").hide();
              $("#divColorsAtSwitchOnNightTime").hide();
              $("#divTemperatureAtSwitchOn").hide();
              $("#divTemperatureAtSwitchOnNightTime").hide();
              $("#divColorCycle").hide();
              $("#divUpdateKNXBrightnessStatusOnHUEOnOff").hide();
              $("#divBehaviourBrightness").hide();
              $("#comboTemperatureAtSwitchOn").hide();
              $("#comboTemperatureAtSwitchOnNightTime").hide();

              // Enable options/tabs one by one
              if (oLight.dimming !== undefined) {
                $("#tabs").tabs("enable", "#tabs-2");
                $("#divBehaviourBrightness").show();
              }
              if (oLight.color !== undefined) {
                $("#tabs").tabs("enable", "#tabs-4");
                $("#divColorsAtSwitchOn").show();
                $("#divColorsAtSwitchOnNightTime").show();
                $("#divColorCycle").show();
                $("#node-input-specifySwitchOnBrightness").append(
                  $("<option>")
                    .val("yes")
                    .text(node._("knxUltimateHueLight.select_color"))
                );
                $("#node-input-enableDayNightLighting").append(
                  $("<option>")
                    .val("yes")
                    .text(node._("knxUltimateHueLight.select_color"))
                );
              }
              // Check temperature (if the light supports temperature, it support dimming as well)
              if (oLight.color_temperature !== undefined) {
                $("#tabs").tabs("enable", "#tabs-3");
                //$("#tabs").tabs("enable", "#tabs-2");
                $("#node-input-specifySwitchOnBrightness").append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_temperature_brightness"))
                );
                $("#node-input-enableDayNightLighting").append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_temperature_brightness"))
                );
                $("#divTemperatureAtSwitchOn").show();
                $("#divTemperatureAtSwitchOnNightTime").show();
                $("#divUpdateKNXBrightnessStatusOnHUEOnOff").show();
                $("#divBehaviourBrightness").show();
                $("#comboTemperatureAtSwitchOn").show();
                $("#comboTemperatureAtSwitchOnNightTime").show();
              } else {
                //$("#tabs").tabs("enable", "#tabs-2");
                $("#node-input-specifySwitchOnBrightness").append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_brightness"))
                );
                $("#node-input-enableDayNightLighting").append(
                  $("<option>")
                    .val("temperature")
                    .text(node._("knxUltimateHueLight.select_brightness"))
                );
                $("#comboTemperatureAtSwitchOn").val(0);
                $("#comboTemperatureAtSwitchOnNightTime").val(0);
                $("#divTemperatureAtSwitchOn").show();
                $("#divTemperatureAtSwitchOnNightTime").show();
                $("#divUpdateKNXBrightnessStatusOnHUEOnOff").show();
                //$("#divBehaviourBrightness").show();
              }
              $("#node-input-specifySwitchOnBrightness").val(node.specifySwitchOnBrightness).trigger('change');
              $("#node-input-enableDayNightLighting").val(node.enableDayNightLighting).trigger('change');
            };
            getJsonPromise = $.getJSON(`knxUltimateGetLightObject?id=${encodeURIComponent(capabilityResourceId)}&serverId=${encodeURIComponent(capabilityServerId)}&_=${Date.now()}`, (data) => {
              try {
                applyHueCapabilities(data);
              } catch (error) {
                notifyEditorError(error, 'capabilities');
              }
            }).fail((xhr, textStatus, errorThrown) => {
              if (textStatus === 'abort') return;
              const detail = xhr && xhr.responseJSON && xhr.responseJSON.error
                ? xhr.responseJSON.error
                : (errorThrown || textStatus || 'Unable to load Hue capabilities');
              notifyEditorError(new Error(detail), 'capabilities request');
            });
            setTimeout(function () { if (getJsonPromise !== undefined) getJsonPromise.abort(); }, 10000);
          }
          // Show/Hide the div of the color at swich on
          if (node.specifySwitchOnBrightness === "yes") {
            $("#divColorsAtSwitchOn").show();
            $("#divTemperatureAtSwitchOn").hide();
          } else if (node.specifySwitchOnBrightness === "temperature") {
            $("#divColorsAtSwitchOn").hide();
            $("#divTemperatureAtSwitchOn").show();
          } else {
            $("#divColorsAtSwitchOn").hide();
            $("#divTemperatureAtSwitchOn").hide();
          }

          $("#node-input-specifySwitchOnBrightness").on("change", function () {
            if ($("#node-input-specifySwitchOnBrightness").val() === "yes") {
              $("#divColorsAtSwitchOn").show();
              $("#divTemperatureAtSwitchOn").hide();
              blinkBackground("#colorPickerDay");
            } else if ($("#node-input-specifySwitchOnBrightness").val() === "temperature") {
              $("#divColorsAtSwitchOn").hide();
              $("#divTemperatureAtSwitchOn").show();
            } else {
              $("#divColorsAtSwitchOn").hide();
              $("#divTemperatureAtSwitchOn").hide();
            }
          });

          // Show/Hide and enable/disable day/night Lighting behaviour
          if (node.enableDayNightLighting === "yes") {
            $("#divEnableDayNightLighting").show();
            $("#divCCSBoxAtNightLighting").css({ border: "1px solid dimgrey", "border-radius": "12px", padding: "5px" }); // Add little box to better understand the property page
            $("#divColorsAtSwitchOnNightTime").show();
            $("#divTemperatureAtSwitchOnNightTime").hide();
          } else if (node.enableDayNightLighting === "temperature") {
            $("#divEnableDayNightLighting").show();
            $("#divCCSBoxAtNightLighting").css({ border: "1px solid dimgrey", "border-radius": "12px", padding: "5px" }); // Add little box to better understand the property page
            $("#divColorsAtSwitchOnNightTime").hide();
            $("#divTemperatureAtSwitchOnNightTime").show();
          } else {
            $("#divEnableDayNightLighting").hide();
            $("#divCCSBoxAtNightLighting").css({ border: "", "border-radius": "", padding: "" });
          }

          $("#node-input-enableDayNightLighting").on("change", function () {
            if ($("#node-input-enableDayNightLighting").val() === "yes") {
              $("#divEnableDayNightLighting").show();
              $("#divCCSBoxAtNightLighting").css({ border: "1px solid dimgrey", "border-radius": "12px", padding: "5px" }); // Add little box to better understand the property page
              $("#divColorsAtSwitchOnNightTime").show();
              $("#divTemperatureAtSwitchOnNightTime").hide();
              blinkBackground("#colorPickerNight")
              $("#getColorAtSwitchOnDayTimeButton").text(node._("knxUltimateHueLight.get_current"));
            } else if ($("#node-input-enableDayNightLighting").val() === "temperature") {
              $("#divEnableDayNightLighting").show();
              $("#divCCSBoxAtNightLighting").css({ border: "1px solid dimgrey", "border-radius": "12px", padding: "5px" }); // Add little box to better understand the property page
              $("#divColorsAtSwitchOnNightTime").hide();
              $("#divTemperatureAtSwitchOnNightTime").show();
            } else {
              $("#divEnableDayNightLighting").hide();
              $("#divCCSBoxAtNightLighting").css({ border: "", "border-radius": "", padding: "" });
            }
          });

          $("#getColorAtSwitchOnDayTimeButton").on("click", function () {
            $("#getColorAtSwitchOnDayTimeButton").text(node._("knxUltimateHueLight.wait"));
            let jRet;
            let sQuery;
            if ($("#node-input-specifySwitchOnBrightness").val() === "yes") sQuery = "knxUltimateGetHueColor";
            if ($("#node-input-specifySwitchOnBrightness").val() === "temperature") sQuery = "knxUltimateGetKelvinColor";
            $.getJSON(sQuery + "?id=" + $("#node-input-hueDevice").val().split("#")[0] + "&serverId=" + $("#node-input-serverHue").val() + "&" + { _: new Date().getTime() }, (data) => {
              $("#node-input-colorAtSwitchOnDayTime").val(data);
              $("#colorPickerDay").val(data);
              blinkBackground("#colorPickerDay")
              $("#getColorAtSwitchOnDayTimeButton").text(node._("knxUltimateHueLight.get_again"));
            });
          });

          $("#getColorAtSwitchOnNightTimeButton").on("click", function () {
            $("#getColorAtSwitchOnNightTimeButton").text(node._("knxUltimateHueLight.wait"));
            let jRet;
            let sQuery;
            if ($("#node-input-enableDayNightLighting").val() === "yes") sQuery = "knxUltimateGetHueColor";
            if ($("#node-input-enableDayNightLighting").val() === "temperature") sQuery = "knxUltimateGetKelvinColor";
            $.getJSON(sQuery + "?id=" + $("#node-input-hueDevice").val().split("#")[0] + "&" + { _: new Date().getTime() }, (data) => {
              $("#node-input-colorAtSwitchOnNightTime").val(data);
              $("#colorPickerNight").val(data);
              blinkBackground("#colorPickerNight")
              $("#getColorAtSwitchOnNightTimeButton").text(node._("knxUltimateHueLight.get_again"));
            });
          });

          // Fill options for minDimLevel and maxDimLevel and comboBrightnessAtSwitchOn (for color brightness at switch on, with temperature toghedher)
          for (let index = 100; index >= 0; index -= 5) {
            if (index === 0) {
              $("#node-input-minDimLevelLight").append($("<option>").val(index).text(index.toString() + "% " + node._("knxUltimateHueLight.switch_off")));
              $("#comboBrightnessAtSwitchOn").append($("<option>").val(index).text(index.toString() + "% " + node._("knxUltimateHueLight.switch_off")));
              $("#comboBrightnessAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + "% " + node._("knxUltimateHueLight.switch_off")));
            } else {
              $("#node-input-minDimLevelLight").append($("<option>").val(index).text(index.toString() + "%"));
              $("#comboBrightnessAtSwitchOn").append($("<option>").val(index).text(index.toString() + "%"));
              $("#comboBrightnessAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + "%"));
            }
          }
          // Temperatures, from 2000 to 6535K (circa)
          for (let index = 2000; index <= 6500; index += 100) {
            if (index === 2200) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_2200")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_2200")));
            } else if (index === 2700) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_2700")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_2700")));
            } else if (index === 3000) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_3000")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_3000")));
            } else if (index === 3500) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_3500_day")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_3500_night")));
            } else if (index === 4100) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_4100_day")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_4100_night")));
            } else if (index === 5000) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_5000_day")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_5000_night")));
            } else if (index === 6500) {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_6500_day")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix") + " " + node._("knxUltimateHueLight.temp_desc_6500_night")));
            } else {
              $("#comboTemperatureAtSwitchOn").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix")));
              $("#comboTemperatureAtSwitchOnNightTime").append($("<option>").val(index).text(index.toString() + node._("knxUltimateHueLight.k_suffix")));
            }
          }


          // Calculate kelvin/color
          let json;
          node.colorAtSwitchOnDayTime = node.colorAtSwitchOnDayTime.replace("geen", "green"); // Old bug in "geen" property
          node.colorAtSwitchOnNightTime = node.colorAtSwitchOnNightTime.replace("geen", "green"); // Old bug in "geen" property
          try {
            json = JSON.parse(node.colorAtSwitchOnDayTime);
          } catch (error) {
            console.log("json = JSON.parse(node.colorAtSwitchOnDayTime) in HTML: " + error.message)
          }
          if (json !== undefined && json.kelvin !== undefined) {
            // Kelvin
            $("#comboTemperatureAtSwitchOn").val(json.kelvin);
            $("#comboBrightnessAtSwitchOn").val(json.brightness);
            if (node.specifySwitchOnBrightness !== 'no') $("#node-input-specifySwitchOnBrightness").val('temperature'); // Adjust in case of mismatch (from old geen bug)
          } else if (json !== undefined && json.red !== undefined) {
            // Must transform RGB into HTML HEX color
            try {
              $("#node-input-colorAtSwitchOnDayTime").val("#" + rgbHex(json.red, json.green, json.blue));
            } catch (error) {
            }
            $("#colorPickerDay").val($("#node-input-colorAtSwitchOnDayTime").val());
            if (node.specifySwitchOnBrightness !== 'no') $("#node-input-specifySwitchOnBrightness").val('yes'); // Adjust in case of mismatch (from old geen bug)
          } else {
            // It's already an HEX color
            $("#colorPickerDay").val(node.colorAtSwitchOnDayTime);
            if (node.specifySwitchOnBrightness !== 'no') $("#node-input-specifySwitchOnBrightness").val('yes'); // Adjust in case of mismatch (from old geen bug)
          }
          //Night
          json = undefined;
          try {
            json = JSON.parse(node.colorAtSwitchOnNightTime);
          } catch (error) { }
          if (json !== undefined && json.kelvin !== undefined) {
            // Kelvin
            $("#comboTemperatureAtSwitchOnNightTime").val(json.kelvin);
            $("#comboBrightnessAtSwitchOnNightTime").val(json.brightness);
            if (node.enableDayNightLighting !== 'no') $("#node-input-enableDayNightLighting").val('temperature'); // Adjust in case of mismatch (from old geen bug)
          } else if (json !== undefined && json.red !== undefined) {
            // Must transform RGB into HTML HEX color
            try {
              $("#node-input-colorAtSwitchOnNightTime").val("#" + rgbHex(json.red, json.green, json.blue));
            } catch (error) {
            }
            $("#colorPickerNight").val($("#node-input-colorAtSwitchOnNightTime").val());
            if (node.enableDayNightLighting !== 'no') $("#node-input-enableDayNightLighting").val('yes'); // Adjust in case of mismatch (from old geen bug)
          } else {
            // It's already an HEX color
            $("#colorPickerNight").val(node.colorAtSwitchOnNightTime);
            if (node.enableDayNightLighting !== 'no') $("#node-input-enableDayNightLighting").val('yes'); // Adjust in case of mismatch (from old geen bug)
          }


          $("#comboTemperatureAtSwitchOn, #comboBrightnessAtSwitchOn").on("change", function () {
            $("#node-input-colorAtSwitchOnDayTime").val('{ "kelvin":' + $("#comboTemperatureAtSwitchOn").val() + ', "brightness":' + $("#comboBrightnessAtSwitchOn").val() + ' }');
          });
          $("#comboTemperatureAtSwitchOnNightTime, #comboBrightnessAtSwitchOnNightTime").on("change", function () {
            $("#node-input-colorAtSwitchOnNightTime").val('{ "kelvin":' + $("#comboTemperatureAtSwitchOnNightTime").val() + ', "brightness":' + $("#comboBrightnessAtSwitchOnNightTime").val() + ' }');
          });

          // Create and put the JSON to node-input-colorAtSwitchOnDayTime
          $("#colorPickerDay").on("change", function () {
            $("#node-input-colorAtSwitchOnDayTime").val(this.value);
          });
          $("#colorPickerNight").on("change", function () {
            $("#node-input-colorAtSwitchOnNightTime").val(this.value);
          });


          $("#node-input-minDimLevelLight").val(node.minDimLevelLight);
          for (let index = 100; index >= 10; index--) {
            $("#node-input-maxDimLevelLight").append(
              $("<option>")
                .val(index)
                .text(index.toString() + "%")
            );
          }
          $("#node-input-maxDimLevelLight").val(node.maxDimLevelLight);

        }

        function Go() {
          if (typeof node.__stopHueConnectionWait === 'function') {
            node.__stopHueConnectionWait();
          }
          $("#waitWindow").hide();
          $("#mainWindow").show();
          // $.post("banana", { func: "getNameAndTime" }, function (data) {
          //   //alert(data.body); // John
          // }, "json");
          try {
            RED.sidebar.show("help");
          } catch (error) { }
          try {
            onEditPrepare();
          } catch (error) {
            // Never leave the editor silently half-rendered. Locate and tab
            // visibility are initialized first inside onEditPrepare, while this
            // fixed Node-RED message exposes any later unexpected failure.
            const detail = error && error.message ? error.message : String(error || 'Unknown error');
            const fallback = `Hue editor error (initialization): ${detail}`;
            let message = fallback;
            try {
              message = node._('knxUltimateHueLight.editor_init_error', {
                stage: 'initialization',
                error: detail
              }) || fallback;
            } catch (translationError) { /* use fallback */ }
            try {
              RED.notify(message, { type: 'error', fixed: true });
            } catch (notifyError) { /* console fallback below */ }
            try { console.error(fallback, error); } catch (consoleError) { /* empty */ }
          }
          // HUE Controller owns a device-first picker covering every supported
          // Hue API v2 resource. onEditPrepare installs the mature Light-only
          // autocomplete, so let the wrapper restore its unified source after
          // this asynchronous readiness callback completes.
          if (typeof node.__configureHueControllerDeviceControl === 'function') {
            node.__configureHueControllerDeviceControl();
          }
        }


        // Bounded Hue Bridge readiness wait ##############################################
        // The legacy editor stored its timeout on `this`. HUE Controller bundles
        // private profiles in strict mode, where a plain function call has no
        // `this`; keeping the state in this closure avoids a TypeError and makes
        // cancellation deterministic when the editor is closed or remounted.
        const HUE_CONNECTION_POLL_MS = 500;
        const HUE_CONNECTION_MAX_ATTEMPTS = 20;
        const HUE_CONNECTION_EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);
        let hueConnectionAttempts = 0;
        let hueConnectionTimer = null;
        let hueConnectionGeneration = 0;

        const resolveConnectionHueServerId = () => {
          const domValue = $("#node-input-serverHue").val();
          if (domValue !== undefined && domValue !== null) {
            const normalized = String(domValue).trim();
            return HUE_CONNECTION_EMPTY_SERVER_VALUES.has(normalized.toLowerCase()) ? '' : normalized;
          }
          const storedValue = node.serverHue === undefined || node.serverHue === null
            ? ''
            : String(node.serverHue).trim();
          return HUE_CONNECTION_EMPTY_SERVER_VALUES.has(storedValue.toLowerCase()) ? '' : storedValue;
        };

        const stopHueConnectionWait = () => {
          hueConnectionGeneration += 1;
          if (hueConnectionTimer !== null) {
            clearTimeout(hueConnectionTimer);
            hueConnectionTimer = null;
          }
        };
        node.__stopHueConnectionWait = stopHueConnectionWait;

        const finishHueConnectionTimeout = () => {
          stopHueConnectionWait();
          hueConnectionAttempts = 0;
          $("#waitWindow").hide();
          $("#mainWindow").show();
          $("#tabs").hide();
          const message = node._("knxUltimateHueLight.connection_timeout")
            || "The Hue Bridge is not ready yet. Check its configuration, deploy and retry.";
          RED.notify(message, "error");
        };

        const checkConnection = (generation) => {
          if (generation !== hueConnectionGeneration) return;
          const hueServerId = resolveConnectionHueServerId();
          if (!hueServerId || $("#node-input-serverHue").val() === undefined) {
            Go();
            return;
          }
          if (hueConnectionTimer !== null) clearTimeout(hueConnectionTimer);
          hueConnectionTimer = setTimeout(() => {
            hueConnectionTimer = null;
            if (generation !== hueConnectionGeneration) return;
            hueConnectionAttempts += 1;
            if (hueConnectionAttempts > HUE_CONNECTION_MAX_ATTEMPTS) {
              finishHueConnectionTimeout();
              return;
            }
            $.getJSON(`knxultimateCheckHueConnected?serverId=${encodeURIComponent(hueServerId)}&_=${Date.now()}`)
              .done((data) => {
                if (generation !== hueConnectionGeneration) return;
                if (data && data.ready === true) Go();
                else checkConnection(generation);
              })
              .fail(() => {
                if (generation === hueConnectionGeneration) checkConnection(generation);
              });
          }, HUE_CONNECTION_POLL_MS);
        };

        const startHueConnectionWait = () => {
          stopHueConnectionWait();
          hueConnectionAttempts = 0;
          const hueServerId = resolveConnectionHueServerId();
          if (!hueServerId) {
            Go();
            return;
          }
          $("#waitWindow").show();
          $("#mainWindow").hide();
          const generation = hueConnectionGeneration;
          checkConnection(generation);
        };

        $("#node-input-serverHue")
          .off("change.knxUltimateHueControllerConnectionWait")
          .on("change.knxUltimateHueControllerConnectionWait", startHueConnectionWait);
        startHueConnectionWait();
        // ################################################################

      },

      oneditsave: function () {
        // Return to the info tab
        try {
          RED.sidebar.show("info");
        } catch (error) { }

        //RED.sidebar.removeTab("tabNRColor");
        if ($("#node-input-enableNodePINS").val() === "yes") {
          this.outputs = 1;
          this.inputs = 1;
        } else {
          this.outputs = 0;
          this.inputs = 0;
        }

        const nodeRef = this;
        let collectedEffectRules = [];
        try {
          const effectItems = $("#node-input-effect-rule-container").editableList('items');
          effectItems.each(function () {
            const $row = $(this);
            const knxValue = $row.find('.rowEffectKNXValue').val();
            const hueEffect = $row.find('.rowEffectHueEffect').val();
            if (hueEffect && hueEffect !== '') {
              collectedEffectRules.push({
                knxValue: knxValue !== undefined && knxValue !== null ? knxValue : '',
                hueEffect
              });
            }
          });
        } catch (error) {
          collectedEffectRules = [];
        }
        nodeRef.effectRules = collectedEffectRules;
        const serialized = JSON.stringify(collectedEffectRules);
        $("#node-input-effectRules").val(serialized);
        this.effectRules = serialized;
        this.updateLocalStateFromKNXWrite = $("#node-input-updateLocalStateFromKNXWrite").is(":checked"); // Starting from v 4.1.31
        this._cachedHueLightDevices = [];
        if (typeof this.__stopHueConnectionWait === 'function') {
          try { this.__stopHueConnectionWait(); } catch (error) { /* empty */ }
          this.__stopHueConnectionWait = null;
        }
        if (typeof this.__stopHueLocateSession === 'function') {
          try { this.__stopHueLocateSession(); } catch (error) { /* empty */ }
          this.__stopHueLocateSession = null;
        }
        if (typeof this.__cleanupNodeRemovalListener === 'function') {
          try { RED.events.removeListener('nodes:remove', this.__cleanupNodeRemovalListener); } catch (error) { /* empty */ }
          this.__cleanupNodeRemovalListener = null;
        }
        this.__locateSessionInfo = null;
      },
      oneditcancel: function () {
        // Return to the info tab
        try {
          RED.sidebar.show("info");
        } catch (error) { }
        //RED.sidebar.removeTab("tabNRColor");
        //RED.sidebar.show("help");

        this._cachedHueLightDevices = [];
        if (typeof this.__stopHueConnectionWait === 'function') {
          try { this.__stopHueConnectionWait(); } catch (error) { /* empty */ }
          this.__stopHueConnectionWait = null;
        }
        if (typeof this.__stopHueLocateSession === 'function') {
          try { this.__stopHueLocateSession(); } catch (error) { /* empty */ }
          this.__stopHueLocateSession = null;
        }
        if (typeof this.__cleanupNodeRemovalListener === 'function') {
          try { RED.events.removeListener('nodes:remove', this.__cleanupNodeRemovalListener); } catch (error) { /* empty */ }
          this.__cleanupNodeRemovalListener = null;
        }
        this.__locateSessionInfo = null;
      },
      oneditdelete: function () {
        if (typeof this.oneditclose === 'function') {
          try { this.oneditclose(); } catch (error) { /* empty */ }
        }
      },
      oneditclose: function () {
        if (typeof this.__stopHueConnectionWait === 'function') {
          try { this.__stopHueConnectionWait(); } catch (error) { /* empty */ }
          this.__stopHueConnectionWait = null;
        }
        if (typeof this.__stopHueLocateSession === 'function') {
          try { this.__stopHueLocateSession(); } catch (error) { /* empty */ }
        }
        if (typeof this.__cleanupNodeRemovalListener === 'function') {
          try { RED.events.removeListener('nodes:remove', this.__cleanupNodeRemovalListener); } catch (error) { /* empty */ }
          this.__cleanupNodeRemovalListener = null;
        }
        this.__stopHueLocateSession = null;
        this.__hueLocateActive = false;
        this.__locateSessionInfo = null;
      },
      oneditresize: function (size) {
        //var height = size.height;
        //$('.editor-tray-content').css({ "width": "2700px" });
      }
    });

    function rgbHex(red, green, blue, alpha) {
      const toHex = (red, green, blue, alpha) => ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
      const parseCssRgbString = (input) => {
        const parts = input.replace(/rgba?\(([^)]+)\)/, '$1').split(/[,\s/]+/).filter(Boolean);
        if (parts.length < 3) {
          return;
        }

        const parseValue = (value, max) => {
          value = value.trim();

          if (value.endsWith('%')) {
            return Math.min(Number.parseFloat(value) * max / 100, max);
          }

          return Math.min(Number.parseFloat(value), max);
        };

        const red = parseValue(parts[0], 255);
        const green = parseValue(parts[1], 255);
        const blue = parseValue(parts[2], 255);
        let alpha;

        if (parts.length === 4) {
          alpha = parseValue(parts[3], 1);
        }

        return [red, green, blue, alpha];
      };

      let isPercent = (red + (alpha || '')).toString().includes('%');

      if (typeof red === 'string' && !green) { // Single string parameter.
        const parsed = parseCssRgbString(red);
        if (!parsed) {
          throw new TypeError('Invalid or unsupported color format.');
        }

        isPercent = false;
        [red, green, blue, alpha] = parsed;
      } else if (alpha !== undefined) {
        alpha = Number.parseFloat(alpha);
      }

      if (typeof red !== 'number'
        || typeof green !== 'number'
        || typeof blue !== 'number'
        || red > 255
        || green > 255
        || blue > 255
      ) {
        throw new TypeError('Expected three numbers below 256');
      }

      if (typeof alpha === 'number') {
        if (!isPercent && alpha >= 0 && alpha <= 1) {
          alpha = Math.round(255 * alpha);
        } else if (isPercent && alpha >= 0 && alpha <= 100) {
          alpha = Math.round(255 * alpha / 100);
        } else {
          throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
        }

        alpha = (alpha | 1 << 8).toString(16).slice(1); // eslint-disable-line no-mixed-operators
      } else {
        alpha = '';
      }

      return toHex(red, green, blue, alpha);
    }
  }())
