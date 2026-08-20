/* eslint-disable */
// GENERATED FILE — do not edit directly.
// Canonical sources: scripts/hue-controller-profiles/
// Rebuild with: npm run hue-controller:generate
//
// This bundle is deliberately self-contained. It does not import, query or
// require any deprecated Hue node, editor template or localization namespace.
(function (root, factory) {
  // UMD-style export: Node-RED receives the browser global, while unit tests can
  // require the same artifact through CommonJS without maintaining a test copy.
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateHueControllerProfiles = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  // Values on the left are persisted in hueControllerType. Values on the
  // right are private editor/translation namespace identifiers, not registry
  // lookups. Keeping them preserves all existing field and i18n contracts.
  const PROFILE_TYPES = Object.freeze(  {
    "light": "knxUltimateHueLight",
    "plug": "knxUltimateHuePlug",
    "button": "knxUltimateHueButton",
    "relative_rotary": "knxUltimateHueTapDial",
    "motion": "knxUltimateHueMotion",
    "area_motion": "knxUltimateHueAreaMotion",
    "camera_motion": "knxUltimateHueCameraMotion",
    "contact": "knxUltimateHueContactSensor",
    "light_level": "knxUltimateHueLightSensor",
    "temperature": "knxUltimateHueTemperatureSensor",
    "humidity": "knxUltimateHueHumiditySensor",
    "scene": "knxUltimateHueScene",
    "device_power": "knxUltimateHueBattery",
    "zigbee_connectivity": "knxUltimateHueZigbeeConnectivity",
    "device_software_update": "knxUltimateHuedevice_software_update"
  })

  // Factories are the private copies of the mature editor definitions. They are
  // inert until getDefinition() asks for one of them.
  const PROFILE_FACTORIES = {
    "light": function (RED) {
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
    },
    "plug": function (RED) {
      // Canonical private editor profile for HUE Controller: plug.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $serverInput = null;
          let $enablePinsSelect = null;
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $readStatusRow = null;
          let cachedDevices = [];
          let previousPins = 'no';

          const KNX_EMPTY_VALUES = new Set(['', 'none', '_ADD_', '__NONE__']);

          const detachHandlers = () => {
            if ($serverInput) {
              $serverInput.off('.knxUltimateHuePlug');
            }
            $('#node-input-serverHue').off('.knxUltimateHuePlug');
            $('.hue-refresh-devices').off('.knxUltimateHuePlug');
          };

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueLightVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'no';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          RED.nodes.registerType('knxUltimateHuePlug', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },

              namePlugSwitch: { value: '' },
              GAPlugSwitch: { value: '' },
              dptPlugSwitch: { value: '' },

              namePlugState: { value: '' },
              GAPlugState: { value: '' },
              dptPlugState: { value: '' },

              namePlugPowerState: { value: '' },
              GAPlugPowerState: { value: '' },
              dptPlugPowerState: { value: '' },

              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'no' },

              outputs: { value: 0 },
              inputs: { value: 0 },

              hueDevice: { value: '' },
              hueDeviceObject: { value: {} },
            },
            inputs: 0,
            outputs: 0,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Plug/Outlet'} (deprecated)`;
            },
            paletteLabel: 'Hue Plug/Outlet (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;

              const ensureConfigSelection = (selector) => {
                if ($(selector).val() !== '_ADD_') return;
                try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
              };
              ['#node-input-serverHue'].forEach(ensureConfigSelection);
              ensureVerticalTabsStyle();

              $tabs = $('#tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $serverInput = $('#node-input-server');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $readStatusRow = $('#node-input-readStatusAtStartup').closest('.form-row');

              cachedDevices = [];
              previousPins = normalizePinsValue(node.enableNodePINS);

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const hasHueBridgeSelected = () => {
                const val = $('#node-input-serverHue').val();
                return val && val !== '_ADD_';
              };
              const updateTabsVisibility = () => {
                if (hasHueBridgeSelected()) {
                  $tabs.show();
                  $tabs.tabs('refresh');
                  $requiresBridgeElems.show();
                } else {
                  $tabs.hide();
                  $requiresBridgeElems.hide();
                }
              };
              updateTabsVisibility();

              const resolveKNXServerValue = () => {
                const domValue = $serverInput ? $serverInput.val() : undefined;
                if (domValue !== undefined && domValue !== null) return domValue;
                return node.server;
              };

              const hasKNXServerSelected = () => {
                const val = resolveKNXServerValue();
                if (val === undefined || val === null) return false;
                if (typeof val === 'string' && KNX_EMPTY_VALUES.has(val)) return false;
                if (val === false) return false;
                return Boolean(val);
              };

              $enablePinsSelect.val(previousPins);

              const updateKNXVisibility = () => {
              if (hasKNXServerSelected()) {
                $knxSections.show();
                $readStatusRow.show();
                $enablePinsSelect.prop('disabled', false);
                const desiredPins = 'no';
                if ($enablePinsSelect.val() !== desiredPins) {
                  $enablePinsSelect.val(desiredPins).trigger('change');
                }
                previousPins = desiredPins;
                  getDPT('1.', '#node-input-dptPlugSwitch');
                  getDPT('1.', '#node-input-dptPlugState');
                  getDPT('1.', '#node-input-dptPlugPowerState');
              } else {
                $knxSections.hide();
                $readStatusRow.hide();
                previousPins = normalizePinsValue(node.enableNodePINS);
                $enablePinsSelect.val('yes');
                  $enablePinsSelect.prop('disabled', true);
                  $enablePinsSelect.trigger('change');
                }
              };

              $('#node-input-enableNodePINS').on('change', function () {
                const val = $(this).val();
                node.enableNodePINS = val;
                node.outputs = val === 'yes' ? 1 : 0;
                node.inputs = val === 'yes' ? 1 : 0;
                if (hasKNXServerSelected()) {
                  previousPins = val;
                }
                if (val === 'yes') {
                  $('#node-input-enableNodePINS').closest('.form-row').find('.form-tips').show();
                } else {
                  $('#node-input-enableNodePINS').closest('.form-row').find('.form-tips').hide();
                }
              });

              updateKNXVisibility();
              $serverInput.on('change.knxUltimateHuePlug', () => {
                updateKNXVisibility();
              });

              const oNodeServer = () => RED.nodes.node($('#node-input-server').val());
              const oNodeServerHue = () => RED.nodes.node($('#node-input-serverHue').val());

              function getDPT(prefix, destinationSelector) {
                const $destination = $(destinationSelector);
                $destination.empty();
                const serverId = $('#node-input-server').val();
                if (!serverId || serverId === '_ADD_') {
                  return;
                }
                $.getJSON(`knxUltimateDpts?serverId=${serverId}`, (data) => {
                  data.forEach((dpt) => {
                    if (dpt.value.startsWith(prefix)) {
                      $destination.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                    }
                  });
                  if (node[destinationSelector.replace('#node-input-', '')]) {
                    $destination.val(node[destinationSelector.replace('#node-input-', '')]).trigger('change');
                  }
                });
              }

              function getGroupAddress($sourceWidget, $nameWidget, $dptWidget, dptPrefixes) {
                $sourceWidget.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const server = oNodeServer();
                    if (!server) { response([]); return; }
                    $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                      response($.map(data, (value) => {
                        const search = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                        for (let i = 0; i < dptPrefixes.length; i += 1) {
                          if (htmlUtilsfullCSVSearch(search, `${request.term} ${dptPrefixes[i]}`)) {
                            return {
                              label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                              value: value.ga,
                            };
                          }
                        }
                        return null;
                      }));
                    });
                  },
                  select(event, ui) {
                    let sDevName = ui.item.label.split('#')[1].trim();
                    try {
                      sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                    } catch (error) { /* empty */ }
                    $nameWidget.val(sDevName);
                    const optVal = $dptWidget.find(`option:contains('${ui.item.label.split('#')[2].trim()}')`).attr('value');
                    if (optVal !== undefined && optVal !== null) {
                      $dptWidget.val(optVal).trigger('change');
                    } else {
                      $dptWidget.trigger('change');
                    }
                  },
                }).focus(function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
                try {
                  const server = oNodeServer();
                  if (server && server.id) KNX_enableSecureFormatting($sourceWidget, server.id);
                } catch (error) { /* empty */ }
              }

              getDPT('1.', '#node-input-dptPlugSwitch');
              getDPT('1.', '#node-input-dptPlugState');
              getDPT('1.', '#node-input-dptPlugPowerState');

              getGroupAddress($('#node-input-GAPlugSwitch'), $('#node-input-namePlugSwitch'), $('#node-input-dptPlugSwitch'), ['1.']);
              getGroupAddress($('#node-input-GAPlugState'), $('#node-input-namePlugState'), $('#node-input-dptPlugState'), ['1.']);
              getGroupAddress($('#node-input-GAPlugPowerState'), $('#node-input-namePlugPowerState'), $('#node-input-dptPlugPowerState'), ['1.']);

              const $deviceName = $('#node-input-name');
              const $refreshButton = $('.hue-refresh-devices');
              const $loadingIndicator = $('.hue-devices-loading');
              cachedDevices = [];

              function filterDevices(devices, term) {
                const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
                return $.map(devices, (value) => {
                  const sSearch = value.name;
                  if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                    return {
                      hueDevice: value.id,
                      hueType: value.type || value.deviceObject?.type || 'plug',
                      value: value.name,
                    };
                  }
                  return null;
                });
              }

              function fetchDevices(hueServer, term, response, { forceRefresh = false } = {}) {
                if (!hueServer) { response([]); return; }
                if (!forceRefresh && cachedDevices.length > 0) {
                  response(filterDevices(cachedDevices, term));
                  return;
                }
                $loadingIndicator.show();
                const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
                $.getJSON(`KNXUltimateGetResourcesHUE?rtype=plug&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
                  const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : (Array.isArray(data?.resources) ? data.resources : []));
                  cachedDevices = listCandidates.map((value) => {
                    if (value.deviceObject) return value;
                    const name = value.metadata?.name || value.name || '';
                    const type = value.type || value.rtype || value.resource_type || (value.deviceObject?.type);
                    return {
                      id: value.id || value.rid,
                      name,
                      type: type,
                      deviceObject: value,
                    };
                  });
                  response(filterDevices(cachedDevices, term));
                }).always(() => {
                  $loadingIndicator.hide();
                }).fail(() => {
                  cachedDevices = [];
                  response([]);
                });
              }

              $deviceName.autocomplete({
                minLength: 0,
                source(request, response) {
                  const hueServer = oNodeServerHue();
                  if (!hueServer) { response([]); return; }
                  fetchDevices(hueServer, request.term, response);
                },
                select(event, ui) {
                  const hueType = ui.item.hueType || 'plug';
                  $('#node-input-hueDevice').val(`${ui.item.hueDevice}#${hueType}`);
                },
              }).focus(function () {
                $(this).autocomplete('search', `${$(this).val()}exactmatch`);
              });

              $refreshButton.on('click.knxUltimateHuePlug', () => {
                cachedDevices = [];
                const hueServer = oNodeServerHue();
                if (!hueServer) return;
                fetchDevices(hueServer, '', () => {
                  $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                }, { forceRefresh: true });
              });

              $('#node-input-serverHue').on('change.knxUltimateHuePlug', () => {
                cachedDevices = [];
                updateTabsVisibility();
                $loadingIndicator.hide();
              });

              $('#node-input-readStatusAtStartup').val(node.readStatusAtStartup || 'yes');
              $('#node-input-enableNodePINS').val(normalizePinsValue(node.enableNodePINS || 'no')).trigger('change');
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              const pinsSelection = $('#node-input-enableNodePINS').val();
              this.enableNodePINS = normalizePinsValue(pinsSelection);
              this.outputs = this.enableNodePINS === 'yes' ? 1 : 0;
              this.inputs = this.enableNodePINS === 'yes' ? 1 : 0;
              cachedDevices = [];
            },
            oneditcancel() {
              detachHandlers();
              cachedDevices = [];
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
            },
          });
        }());
    },
    "button": function (RED) {
      // Canonical private editor profile for HUE Controller: button.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let ui = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const coerceBool = (value, defaultValue = false) => {
            if (value === undefined || value === null) return defaultValue;
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value !== 0;
            if (typeof value === 'string') {
              const cleaned = value.trim().toLowerCase();
              if (cleaned === '' || cleaned === '0' || cleaned === 'false' || cleaned === 'no' || cleaned === 'off') return false;
              if (cleaned === '1' || cleaned === 'true' || cleaned === 'yes' || cleaned === 'on') return true;
            }
            return Boolean(value);
          };

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueButtonVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueButtonVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueButton');
            $('#node-input-serverHue').off('.knxUltimateHueButton');
            if (ui?.deviceName) {
              ui.deviceName.off('.knxUltimateHueButton');
              if (ui.deviceName.data('ui-autocomplete')) {
                try { ui.deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if (ui?.refreshButton) {
              ui.refreshButton.off('.knxUltimateHueButton');
            }
            if (ui?.toggleCheckbox) {
              ui.toggleCheckbox.off('.knxUltimateHueButton');
            }
            const autocompleteTargets = [ui?.gaShortRelease, ui?.gaShortReleaseStatus, ui?.gaRepeat];
            autocompleteTargets.forEach(($input) => {
              if ($input) {
                $input.off('.knxUltimateHueButton');
                if ($input.data('ui-autocomplete')) {
                  try { $input.autocomplete('destroy'); } catch (error) { /* empty */ }
                }
              }
            });
            if (ui?.switchSendInput && ui.switchSendInput.data('typedInput')) {
              try { ui.switchSendInput.typedInput('destroy'); } catch (error) { /* empty */ }
            }
            if (ui?.dimSendInput && ui.dimSendInput.data('typedInput')) {
              try { ui.dimSendInput.typedInput('destroy'); } catch (error) { /* empty */ }
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!ui?.deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                ui.deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueButton:knxUltimateHueButton.no_devices');
            showingNoDevicesPlaceholder = true;
            ui.deviceName.attr('placeholder', message);
            if ((ui.deviceName.val() || '').trim() === '') {
              ui.deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if (ui?.loadingIndicator) ui.loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=button&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => {
                if (value.deviceObject) return value;
                return {
                  id: value.id || value.rid,
                  name: value.name || value.metadata?.name || '',
                  deviceObject: value,
                };
              });
              if (currentNode) currentNode._cachedButtonDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if (ui?.loadingIndicator) ui.loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedButtonDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDptOptions = (serverId, nodeRef) => {
            if (!ui?.dptShortRelease || !ui?.dptShortReleaseStatus || !ui?.dptRepeat) return;
            ui.dptShortRelease.empty();
            ui.dptShortReleaseStatus.empty();
            ui.dptRepeat.empty();
            const validId = resolveServerId(serverId);
            if (!validId) {
              return;
            }
            $.getJSON(`knxUltimateDpts?serverId=${validId}`, (data) => {
              const referenceNode = nodeRef || currentNode || {};
              const targetShort = referenceNode.dptshort_release || '1.001';
              const targetShortStatus = referenceNode.dptshort_releaseStatus || referenceNode.dptshort_release || '1.001';
              const targetRepeat = referenceNode.dptrepeat || '3.007';
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  const option = $('<option></option>').attr('value', dpt.value).text(dpt.text);
                  const optionStatus = option.clone();
                  ui.dptShortRelease.append(option);
                  ui.dptShortReleaseStatus.append(optionStatus);
                }
                if (dpt.value.startsWith('3.007')) {
                  ui.dptRepeat.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              if (ui.dptShortRelease.children().length) {
                ui.dptShortRelease.val(targetShort);
              }
              if (ui.dptShortReleaseStatus.children().length) {
                ui.dptShortReleaseStatus.val(targetShortStatus);
              }
              if (ui.dptRepeat.children().length) {
                ui.dptRepeat.val(targetRepeat);
              }
            });
          };

          const attachGroupAddressAutocomplete = ({ $input, $name, $dptSelect, filterFn }) => {
            if (!$input || !$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const rawValue = $('#node-input-server').val();
                const serverId = resolveServerId(rawValue === undefined ? (currentNode ? currentNode.server : null) : rawValue);
                const server = serverId ? RED.nodes.node(serverId) : null;
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (filterFn && !filterFn(value)) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($name) $name.val(sDevName);
                if ($dptSelect) {
                  const dptLabel = ui.item.label.split('#')[2]?.trim();
                  const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                  if (optVal !== undefined && optVal !== null) {
                    $dptSelect.val(optVal).trigger('change');
                  } else {
                    $dptSelect.trigger('change');
                  }
                }
              },
            });
            $input.on('focus.knxUltimateHueButton', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            try {
              const serverId = resolveServerId($('#node-input-server').val() || (currentNode ? currentNode.server : null));
              const server = serverId ? RED.nodes.node(serverId) : null;
              if (server && server.id) KNX_enableSecureFormatting($input, server.id);
            } catch (error) { /* empty */ }
          };

          const hasKNXServerSelected = () => {
            let domValue = $('#node-input-server').val();
            if (domValue === undefined && currentNode) domValue = currentNode.server;
            const knxServerId = resolveServerId(domValue);
            return Boolean(knxServerId);
          };

          const updateToggleSections = () => {
            const toggled = ui?.toggleCheckbox ? ui.toggleCheckbox.is(':checked') : false;
            if (ui?.statusRows) {
              if (toggled) {
                ui.statusRows.show();
              } else {
                ui.statusRows.hide();
              }
            }
            if (ui?.fixedValueSection) {
              if (toggled) {
                ui.fixedValueSection.hide();
              } else {
                ui.fixedValueSection.show();
              }
            }
          };

          const updateTabsVisibility = () => {
            if (!ui?.tabs) return;
            const hueDomValue = $('#node-input-serverHue').val();
            const hueServerId = resolveServerId(hueDomValue === undefined ? (currentNode ? currentNode.serverHue : null) : hueDomValue);
            const knxSelected = hasKNXServerSelected();
            if (hueServerId) {
              ui.requiresBridgeElems?.show();
            } else {
              ui.requiresBridgeElems?.hide();
            }
            if (hueServerId && knxSelected) {
              ui.tabs.show();
              ui.tabs.tabs('refresh');
            } else {
              ui.tabs.hide();
            }
            if (ui?.outputInfo) {
              if (knxSelected) {
                ui.outputInfo.hide();
              } else {
                ui.outputInfo.show();
              }
            }
          };

          const updateKNXVisibility = () => {
            const knxSelected = hasKNXServerSelected();
            if (knxSelected) {
              ui?.knxSections?.show();
            } else {
              ui?.knxSections?.hide();
            }
            updateTabsVisibility();
          };

          RED.nodes.registerType('knxUltimateHueButton', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              nameDim: { value: '' },
              GArepeat: { value: '' },
              dptrepeat: { value: '3.007' },
              nameshort_release: { value: '' },
              GAshort_release: { value: '' },
              dptshort_release: { value: '1.001' },
              nameshort_releaseStatus: { value: '' },
              GAshort_releaseStatus: { value: '' },
              dptshort_releaseStatus: { value: '1.001' },
              toggleValues: { value: true },
              hueDevice: { value: '' },
              switchSend: { value: true },
              dimSend: { value: 'up' },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Button'} (deprecated)`;
            },
            paletteLabel: 'Hue Button (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              ui = {
                tabs: $('#hue-button-tabs'),
                requiresBridgeElems: $('.hue-requires-bridge'),
                knxSections: $('.hue-knx-section'),
                deviceName: $('#node-input-name'),
                refreshButton: $('.hue-refresh-devices'),
                loadingIndicator: $('.hue-devices-loading'),
                outputInfo: $('.hue-output-info'),
                toggleCheckbox: $('#node-input-toggleValues'),
                statusRows: $('.hue-status-row'),
                fixedValueSection: $('.hue-fixed-values'),
                switchSendInput: $('#node-input-switchSend'),
                dimSendInput: $('#node-input-dimSend'),
                dptShortRelease: $('#node-input-dptshort_release'),
                dptShortReleaseStatus: $('#node-input-dptshort_releaseStatus'),
                dptRepeat: $('#node-input-dptrepeat'),
                gaShortRelease: $('#node-input-GAshort_release'),
                gaShortReleaseStatus: $('#node-input-GAshort_releaseStatus'),
                gaRepeat: $('#node-input-GArepeat'),
              };

              cachedDevices = Array.isArray(node._cachedButtonDevices) ? node._cachedButtonDevices : [];
              node._cachedButtonDevices = cachedDevices;

              defaultDevicePlaceholder = ui.deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              ui.tabs.addClass('hue-vertical-tabs');
              ui.tabs.tabs();
              ui.tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDptOptions(initialServerId, node);

              attachGroupAddressAutocomplete({
                $input: ui.gaShortRelease,
                $name: $('#node-input-nameshort_release'),
                $dptSelect: ui.dptShortRelease,
                filterFn: (value) => value.dpt && value.dpt.startsWith('1.'),
              });
              attachGroupAddressAutocomplete({
                $input: ui.gaShortReleaseStatus,
                $name: $('#node-input-nameshort_releaseStatus'),
                $dptSelect: ui.dptShortReleaseStatus,
                filterFn: (value) => value.dpt && value.dpt.startsWith('1.'),
              });
              attachGroupAddressAutocomplete({
                $input: ui.gaRepeat,
                $name: $('#node-input-nameDim'),
                $dptSelect: ui.dptRepeat,
                filterFn: (value) => value.dpt && value.dpt.startsWith('3.007'),
              });

              if (ui.switchSendInput) {
                ui.switchSendInput.typedInput({
                  type: 'bool',
                  types: ['bool'],
                });
                const initialSwitch = coerceBool(node.switchSend, true);
                ui.switchSendInput.typedInput('value', initialSwitch ? 'true' : 'false');
              }

              if (ui.dimSendInput) {
                ui.dimSendInput.typedInput({
                  type: 'direction',
                  types: [{
                    value: 'direction',
                    options: [
                      { value: 'up', label: RED._('node-red-contrib-knx-ultimate/knxUltimateHueButton:knxUltimateHueButton.dim_up') || 'Up' },
                      { value: 'down', label: RED._('node-red-contrib-knx-ultimate/knxUltimateHueButton:knxUltimateHueButton.dim_down') || 'Down' },
                      { value: 'stop', label: RED._('node-red-contrib-knx-ultimate/knxUltimateHueButton:knxUltimateHueButton.dim_stop') || 'Stop' },
                    ],
                  }],
                });
                const initialDim = typeof node.dimSend === 'string' ? node.dimSend : 'up';
                ui.dimSendInput.typedInput('value', initialDim || 'up');
              }

              // If the stored value is missing/legacy, default to false so UI matches runtime truthiness.
              const initialToggle = coerceBool(node.toggleValues, false);
              if (ui.toggleCheckbox) {
                ui.toggleCheckbox.prop('checked', initialToggle);
                ui.toggleCheckbox.on('change.knxUltimateHueButton', () => {
                  updateToggleSections();
                });
              }
              updateToggleSections();

              if (ui.deviceName) {
                ui.deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueDomValue = $('#node-input-serverHue').val();
                    const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                    const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                ui.deviceName.on('focus.knxUltimateHueButton', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if (ui.refreshButton) {
                ui.refreshButton.on('click.knxUltimateHueButton', () => {
                  cachedDevices = [];
                  node._cachedButtonDevices = cachedDevices;
                  const hueDomValue = $('#node-input-serverHue').val();
                  const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                  const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if (ui?.deviceName) {
                      ui.deviceName.autocomplete('search', `${ui.deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              $('#node-input-server').on('change.knxUltimateHueButton', function () {
                const serverId = $(this).val();
                loadDptOptions(serverId, node);
                updateKNXVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueButton', function () {
                const hueServerId = resolveServerId($(this).val());
                cachedDevices = [];
                node._cachedButtonDevices = cachedDevices;
                if (ui?.loadingIndicator) ui.loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if (ui?.deviceName) {
                  ui.deviceName.attr('placeholder', defaultDevicePlaceholder);
                }
                if (!hueServerId) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKNXVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              // Persist values explicitly because typedInput/checkbox widgets are not always serialised reliably by Node-RED.
              this.toggleValues = ui?.toggleCheckbox ? ui.toggleCheckbox.is(':checked') : coerceBool(this.toggleValues, false);
              const switchSendRaw = ui?.switchSendInput ? ui.switchSendInput.typedInput('value') : this.switchSend;
              this.switchSend = (switchSendRaw === true || String(switchSendRaw).toLowerCase() === 'true') ? 'true' : 'false';
              if (ui?.dimSendInput) {
                const dimRaw = ui.dimSendInput.typedInput('value');
                this.dimSend = typeof dimRaw === 'string' && dimRaw !== '' ? dimRaw : (this.dimSend || 'up');
              }
              detachHandlers();
              cachedDevices = [];
              this._cachedButtonDevices = [];
              currentNode = null;
              ui = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedButtonDevices = [];
              currentNode = null;
              ui = null;
            },
          });
        }());
    },
    "relative_rotary": function (RED) {
      // Canonical private editor profile for HUE Controller: relative_rotary.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);
          const ALLOWED_DPT_PREFIXES = ['3.007', '5.001', '232.600'];

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueTapDialVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueTapDialVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueTapDial');
            $('#node-input-serverHue').off('.knxUltimateHueTapDial');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueTapDial');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueTapDial');
            }
            const $gaInput = $('#node-input-GArepeat');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHueTapDial');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueTapDial');
            }
            if ($tabs && $tabs.data('ui-tabs')) {
              try { $tabs.tabs('destroy'); } catch (error) { /* empty */ }
            }
          };

          const ensureConfigSelection = (selector) => {
            const $select = $(selector);
            if (!$select.length) return;
            if ($select.val() !== '_ADD_') return;
            try { $select.prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value === 'no' ? 'no' : 'yes';
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            const noDevicesText = RED._('node-red-contrib-knx-ultimate/knxUltimateHueTapDial:knxUltimateHueTapDial.no_devices');
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
                showingNoDevicesPlaceholder = false;
              }
              return;
            }
            if (!showingNoDevicesPlaceholder) {
              $deviceName.attr('placeholder', noDevicesText);
              showingNoDevicesPlaceholder = true;
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim().toLowerCase();
            return devices
              .filter((value) => (value.name || '').toLowerCase().includes(cleaned))
              .map((value) => ({ hueDevice: value.id, value: value.name }));
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(false);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=relative_rotary&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
              }));
              if (currentNode) currentNode._cachedTapDialDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedTapDialDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (ALLOWED_DPT_PREFIXES.some((prefix) => dpt.value.startsWith(prefix))) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const target = nodeRef?.dptrepeat && nodeRef.dptrepeat !== ''
                ? nodeRef.dptrepeat
                : ($dptSelect.children().first().attr('value') || '3.007');
              $dptSelect.val(target);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GArepeat');
            const $nameWidget = $('#node-input-namerepeat');
            if (!$input.length) return;
            if ($input.data('ui-autocomplete')) {
              try { $input.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt) return;
                    if (!ALLOWED_DPT_PREFIXES.some((prefix) => value.dpt.startsWith(prefix))) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueTapDial', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) {
              try { KNX_enableSecureFormatting($input, server.id); } catch (error) { /* empty */ }
            }
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if ($requiresBridgeElems) {
              if (hueSelected) {
                $requiresBridgeElems.show();
              } else {
                $requiresBridgeElems.hide();
              }
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if ($knxSections) {
              if (knxSelected) {
                $knxSections.show();
              } else {
                $knxSections.hide();
              }
            }
            updateTabsVisibility();
          };

          const updatePinsState = () => {
            if (!currentNode || !$enablePinsSelect) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

          RED.nodes.registerType('knxUltimateHueTapDial', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namerepeat: { value: '' },
              GArepeat: { value: '' },
              dptrepeat: { value: '3.007' },
              hueDevice: { value: '' },
              enableNodePINS: { value: 'yes' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueTapDial:knxUltimateHueTapDial.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Tap Dial (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-tapdial-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptrepeat');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedTapDialDevices) ? node._cachedTapDialDevices : [];
              node._cachedTapDialDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                    updateTabsVisibility();
                  },
                });
                $deviceName.on('focus.knxUltimateHueTapDial', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueTapDial', () => {
                  cachedDevices = [];
                  node._cachedTapDialDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueTapDial', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueTapDial', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueTapDial', () => {
                cachedDevices = [];
                node._cachedTapDialDevices = cachedDevices;
                if ($deviceName) {
                  $deviceName.val('');
                  $('#node-input-hueDevice').val('');
                  applyNoDevicesPlaceholder(false);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedTapDialDevices = cachedDevices;
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedTapDialDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "motion": function (RED) {
      // Canonical private editor profile for HUE Controller: motion.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueMotionVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueMotionVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueMotion');
            $('#node-input-serverHue').off('.knxUltimateHueMotion');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueMotion');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueMotion');
            }
            const $gaInput = $('#node-input-GAmotion');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHueMotion');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueMotion');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueMotion:knxUltimateHueMotion.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=motion&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
                deviceObject: value.deviceObject || value,
              }));
              if (currentNode) currentNode._cachedMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dptmotion || '1.001';
              if ($dptSelect.children().length) $dptSelect.val(targetDpt);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAmotion');
            const $nameWidget = $('#node-input-namemotion');
            if (!$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('1.')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueMotion', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) KNX_enableSecureFormatting($input, server.id);
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if (hueSelected) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

          RED.nodes.registerType('knxUltimateHueMotion', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namemotion: { value: '' },
              GAmotion: { value: '' },
              dptmotion: { value: '1.001' },
              enableNodePINS: { value: 'yes' },
              hueDevice: { value: '' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueMotion:knxUltimateHueMotion.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Motion (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-motion-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptmotion');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedMotionDevices) ? node._cachedMotionDevices : [];
              node._cachedMotionDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueMotion', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueMotion', () => {
                  cachedDevices = [];
                  node._cachedMotionDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueMotion', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueMotion', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueMotion', function () {
                cachedDevices = [];
                node._cachedMotionDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedMotionDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedMotionDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "area_motion": function (RED) {
      // Canonical private editor profile for HUE Controller: area_motion.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $readStatusRow = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;
          let $outputInfo = null;
          let $enablePinsSelect = null;
          let previousPinsSelection = null;
          let forcedPinsSelection = false;
          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueAreaMotionVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueAreaMotionVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueAreaMotion');
            $('#node-input-serverHue').off('.knxUltimateHueAreaMotion');
            $('.hue-refresh-devices').off('.knxUltimateHueAreaMotion');
            const $gaInput = $('#node-input-GAareaMotion');
            $gaInput.off('.knxUltimateHueAreaMotion');
            if ($gaInput.data('ui-autocomplete')) {
              try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueAreaMotion');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueAreaMotion');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'no';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueAreaMotion:knxUltimateHueAreaMotion.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value
                };
              }
              return null;
            });
          };

          const loadDPTOptions = (serverId, node) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const validId = resolveServerId(serverId);
            if (!validId) {
              return;
            }
            $.getJSON(`knxUltimateDpts?serverId=${validId}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = node || currentNode || {};
              const targetDpt = (referenceNode.dptAreaMotion && referenceNode.dptAreaMotion !== '') ? referenceNode.dptAreaMotion : '1.001';
              if (targetDpt) {
                $dptSelect.val(targetDpt);
              }
            });
          };

          const hasKNXServerSelected = () => {
            let domValue = $('#node-input-server').val();
            if (domValue === undefined) {
              domValue = currentNode ? currentNode.server : null;
            }
            const knxServerId = resolveServerId(domValue);
            return Boolean(knxServerId);
          };

          const getGroupAddress = ($sourceWidget, $nameWidget, $dptWidget) => {
            $sourceWidget.off('.knxUltimateHueAreaMotion');
            $sourceWidget.autocomplete({
              minLength: 0,
              source(request, response) {
                const serverId = $('#node-input-server').val();
                const knxServerId = resolveServerId(serverId);
                if (!knxServerId) { response([]); return; }
                const server = RED.nodes.node(knxServerId);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  response($.map(data, (value) => {
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, `${request.term} 1.`)) {
                      return {
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga
                      };
                    }
                    return null;
                  }));
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1].trim();
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                $nameWidget.val(sDevName);
                const optVal = $dptWidget.find(`option:contains('${ui.item.label.split('#')[2].trim()}')`).attr('value');
                if (optVal !== undefined && optVal !== null) {
                  $dptWidget.val(optVal).trigger('change');
                } else {
                  $dptWidget.trigger('change');
                }
              }
            });
            $sourceWidget.on('focus.knxUltimateHueAreaMotion', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            try {
              const serverId = $('#node-input-server').val();
              const server = RED.nodes.node(serverId);
              if (server && server.id) KNX_enableSecureFormatting($sourceWidget, server.id);
            } catch (error) { /* empty */ }
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=area_motion&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => {
                if (value.deviceObject) return value;
                return {
                  id: value.id || value.rid,
                  name: value.name || value.metadata?.name || '',
                  deviceObject: value
                };
              });
              if (currentNode) currentNode._cachedAreaMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedAreaMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueServerId = resolveServerId($('#node-input-serverHue').val());
            const knxSelected = hasKNXServerSelected();
            if (hueServerId) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }

            if (hueServerId && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }

            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKNXVisibility = () => {
            const knxSelected = hasKNXServerSelected();
            if (knxSelected) {
              $knxSections.show();
              if ($readStatusRow) $readStatusRow.show();
              if ($enablePinsSelect) {
                $enablePinsSelect.prop('disabled', false);
                const baseSelection = previousPinsSelection || normalizePinsValue(currentNode ? currentNode.enableNodePINS : $enablePinsSelect.val() || 'yes');
                $enablePinsSelect.val(baseSelection);
                if (currentNode) {
                  currentNode.enableNodePINS = baseSelection;
                  currentNode.outputs = baseSelection === 'yes' ? 1 : 0;
                }
                previousPinsSelection = null;
              }
              forcedPinsSelection = false;
            } else {
              $knxSections.hide();
              if ($readStatusRow) $readStatusRow.hide();
              if ($enablePinsSelect) {
                if (!forcedPinsSelection) {
                  previousPinsSelection = normalizePinsValue($enablePinsSelect.val() || (currentNode ? currentNode.enableNodePINS : 'yes'));
                }
                $enablePinsSelect.val('yes').prop('disabled', true);
              }
              if (currentNode) {
                currentNode.enableNodePINS = 'yes';
                currentNode.outputs = 1;
              }
              forcedPinsSelection = true;
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            updateTabsVisibility();
          };

          RED.nodes.registerType('knxUltimateHueAreaMotion', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },

              nameAreaMotion: { value: '' },
              GAareaMotion: { value: '' },
              dptAreaMotion: { value: '' },
              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'yes' },

              hueDevice: { value: '' },
              outputs: { value: 1 }
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueAreaMotion:knxUltimateHueAreaMotion.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Motion Area (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#tabsAreaMotion');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptAreaMotion');
              $outputInfo = $('.hue-output-info');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $readStatusRow = $('#row-readStatusAtStartup');

              cachedDevices = Array.isArray(node._cachedAreaMotionDevices) ? node._cachedAreaMotionDevices : [];
              node._cachedAreaMotionDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              getGroupAddress($('#node-input-GAareaMotion'), $('#node-input-nameAreaMotion'), $dptSelect);

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServerId = resolveServerId($('#node-input-serverHue').val());
                    if (!hueServerId) { response([]); return; }
                    const hueServer = RED.nodes.node(hueServerId);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  }
                });
                $deviceName.on('focus.knxUltimateHueAreaMotion', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueAreaMotion', () => {
                  cachedDevices = [];
                  node._cachedAreaMotionDevices = cachedDevices;
                  const hueServerId = resolveServerId($('#node-input-serverHue').val());
                  if (!hueServerId) return;
                  const hueServer = RED.nodes.node(hueServerId);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueAreaMotion', function () {
                  const val = normalizePinsValue($(this).val());
                  node.enableNodePINS = val;
                  node.outputs = val === 'yes' ? 1 : 0;
                });
              }

              $('#node-input-server').on('change.knxUltimateHueAreaMotion', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                getGroupAddress($('#node-input-GAareaMotion'), $('#node-input-nameAreaMotion'), $dptSelect);
                updateKNXVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueAreaMotion', function () {
                cachedDevices = [];
                node._cachedAreaMotionDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!resolveServerId($('#node-input-serverHue').val())) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKNXVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedAreaMotionDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedAreaMotionDevices = [];
              currentNode = null;
            }
          });
        }());
    },
    "camera_motion": function (RED) {
      // Canonical private editor profile for HUE Controller: camera_motion.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $readStatusRow = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;
          let $outputInfo = null;
          let $enablePinsSelect = null;
          let previousPinsSelection = null;
          let forcedPinsSelection = false;
          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueLightVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
        $('#node-input-server').off('.knxUltimateHueCameraMotion');
            $('#node-input-serverHue').off('.knxUltimateHueCameraMotion');
            $('.hue-refresh-devices').off('.knxUltimateHueCameraMotion');
            const $gaInput = $('#node-input-GAcameraMotion');
            $gaInput.off('.knxUltimateHueCameraMotion');
            if ($gaInput.data('ui-autocomplete')) {
              try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueCameraMotion');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueCameraMotion');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'no';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueCameraMotion:knxUltimateHueCameraMotion.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const loadDPTOptions = (serverId, node) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const validId = resolveServerId(serverId);
            if (!validId) {
              return;
            }
            $.getJSON(`knxUltimateDpts?serverId=${validId}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = node || currentNode || {};
              const targetDpt = (referenceNode.dptCameraMotion && referenceNode.dptCameraMotion !== '') ? referenceNode.dptCameraMotion : '1.001';
              if (targetDpt) {
                $dptSelect.val(targetDpt);
              }
            });
          };

          const hasKNXServerSelected = () => {
            let domValue = $('#node-input-server').val();
            if (domValue === undefined) {
              domValue = currentNode ? currentNode.server : null;
            }
            const knxServerId = resolveServerId(domValue);
            return Boolean(knxServerId);
          };

          const getGroupAddress = ($sourceWidget, $nameWidget, $dptWidget) => {
            $sourceWidget.off('.knxUltimateHueCameraMotion');
            $sourceWidget.autocomplete({
              minLength: 0,
              source(request, response) {
                const serverId = $('#node-input-server').val();
                const knxServerId = resolveServerId(serverId);
                if (!knxServerId) { response([]); return; }
                const server = RED.nodes.node(knxServerId);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  response($.map(data, (value) => {
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, `${request.term} 1.`)) {
                      return {
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      };
                    }
                    return null;
                  }));
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1].trim();
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                $nameWidget.val(sDevName);
                const optVal = $dptWidget.find(`option:contains('${ui.item.label.split('#')[2].trim()}')`).attr('value');
                if (optVal !== undefined && optVal !== null) {
                  $dptWidget.val(optVal).trigger('change');
                } else {
                  $dptWidget.trigger('change');
                }
              },
            });
            $sourceWidget.on('focus.knxUltimateHueCameraMotion', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            try {
              const serverId = $('#node-input-server').val();
              const server = RED.nodes.node(serverId);
              if (server && server.id) KNX_enableSecureFormatting($sourceWidget, server.id);
            } catch (error) { /* empty */ }
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=camera_motion&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => {
                if (value.deviceObject) return value;
                return {
                  id: value.id || value.rid,
                  name: value.name || value.metadata?.name || '',
                  deviceObject: value,
                };
              });
              if (currentNode) currentNode._cachedCameraMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedCameraMotionDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueServerId = resolveServerId($('#node-input-serverHue').val());
            const knxSelected = hasKNXServerSelected();
            if (hueServerId) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }

            if (hueServerId && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }

            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKNXVisibility = () => {
            const knxSelected = hasKNXServerSelected();
            if (knxSelected) {
              $knxSections.show();
              if ($readStatusRow) $readStatusRow.show();
              if ($enablePinsSelect) {
                $enablePinsSelect.prop('disabled', false);
                const baseSelection = previousPinsSelection || normalizePinsValue(currentNode ? currentNode.enableNodePINS : $enablePinsSelect.val() || 'yes');
                $enablePinsSelect.val(baseSelection);
                if (currentNode) {
                  currentNode.enableNodePINS = baseSelection;
                  currentNode.outputs = baseSelection === 'yes' ? 1 : 0;
                }
                previousPinsSelection = null;
              }
              forcedPinsSelection = false;
            } else {
              $knxSections.hide();
              if ($readStatusRow) $readStatusRow.hide();
              if ($enablePinsSelect) {
                if (!forcedPinsSelection) {
                  previousPinsSelection = normalizePinsValue($enablePinsSelect.val() || (currentNode ? currentNode.enableNodePINS : 'yes'));
                }
                $enablePinsSelect.val('yes').prop('disabled', true);
              }
              if (currentNode) {
                currentNode.enableNodePINS = 'yes';
                currentNode.outputs = 1;
              }
              forcedPinsSelection = true;
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            updateTabsVisibility();
          };

          RED.nodes.registerType('knxUltimateHueCameraMotion', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },

              nameCameraMotion: { value: '' },
              GAcameraMotion: { value: '' },
              dptCameraMotion: { value: '' },
              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'yes' },

              hueDevice: { value: '' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Camera Motion'} (deprecated)`;
            },
            paletteLabel: 'Hue Camera Motion (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $readStatusRow = $('#node-input-readStatusAtStartup').closest('.form-row');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptCameraMotion');
              $outputInfo = $('.hue-output-info');
              $enablePinsSelect = $('#node-input-enableNodePINS');

              cachedDevices = Array.isArray(node._cachedCameraMotionDevices) ? node._cachedCameraMotionDevices : [];
              node._cachedCameraMotionDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);

              const $gaInput = $('#node-input-GAcameraMotion');
              const $nameInput = $('#node-input-nameCameraMotion');
              getGroupAddress($gaInput, $nameInput, $dptSelect);

              if ($deviceName) {
                $deviceName.off('.knxUltimateHueCameraMotion');
              }
              $deviceName.autocomplete({
                minLength: 0,
                source(request, response) {
                    const hueDomValue = $('#node-input-serverHue').val();
                    const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                  const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                  if (!hueServer) { response([]); return; }
                  fetchDevices(hueServer, request.term, response);
                },
                select(event, ui) {
                  $('#node-input-hueDevice').val(ui.item.hueDevice);
                },
              });
              $deviceName.on('focus.knxUltimateHueCameraMotion', function () {
                $(this).autocomplete('search', `${$(this).val()}exactmatch`);
              });

              $refreshButton.on('click.knxUltimateHueCameraMotion', () => {
                cachedDevices = [];
                node._cachedCameraMotionDevices = cachedDevices;
                const hueDomValue = $('#node-input-serverHue').val();
                const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                if (!hueServer) return;
                fetchDevices(hueServer, '', () => {
                  $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                }, { forceRefresh: true });
              });

              $('#node-input-server').on('change.knxUltimateHueCameraMotion', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                updateKNXVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueCameraMotion', function () {
                const hueServerId = resolveServerId($(this).val());
                cachedDevices = [];
                node._cachedCameraMotionDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hueServerId) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              $('#node-input-readStatusAtStartup').val(node.readStatusAtStartup || 'yes');
              if ($enablePinsSelect) {
                const initialPins = normalizePinsValue(node.enableNodePINS || 'yes');
                $enablePinsSelect.val(initialPins);
                $enablePinsSelect.on('change.knxUltimateHueCameraMotion', function () {
                  const val = normalizePinsValue($(this).val());
                  node.enableNodePINS = val;
                  node.outputs = val === 'yes' ? 1 : 0;
                });
                $enablePinsSelect.trigger('change');
              }

              updateKNXVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const knxSelected = hasKNXServerSelected();
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              if (!knxSelected) {
                this.enableNodePINS = 'yes';
                this.outputs = 1;
              } else {
                this.enableNodePINS = pinsSelection;
                this.outputs = pinsSelection === 'yes' ? 1 : 0;
              }
              this._cachedCameraMotionDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedCameraMotionDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "contact": function (RED) {
      // Canonical private editor profile for HUE Controller: contact.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;
          let $outputInfo = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);
          const DEVICE_PLACEHOLDER_KEY = 'node-red-contrib-knx-ultimate/knxUltimateHueContactSensor:knxUltimateHueContactSensor.placeholders.device';
          const NO_DEVICES_KEY = 'node-red-contrib-knx-ultimate/knxUltimateHueContactSensor:knxUltimateHueContactSensor.no_devices';

          const translateOrEmpty = (key) => {
            try {
              if (!key) return '';
              const translated = RED._(key);
              if (!translated) return '';
              const baseKey = key.includes(':') ? key.split(':')[1] : key;
              if (translated === key || translated === baseKey) return '';
              return translated;
            } catch (error) {
              return '';
            }
          };

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueContactVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueContactVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueContactSensor');
            $('#node-input-serverHue').off('.knxUltimateHueContactSensor');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueContactSensor');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueContactSensor');
            }
            const $gaInput = $('#node-input-GAcontact');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHueContactSensor');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const translated = translateOrEmpty(NO_DEVICES_KEY);
            const fallback = translateOrEmpty(DEVICE_PLACEHOLDER_KEY) || defaultDevicePlaceholder;
            if (fallback && !defaultDevicePlaceholder) defaultDevicePlaceholder = fallback;
            const message = translated || fallback || '';
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const getKnxServer = (allowFallback = true) => {
            const rawVal = $('#node-input-server').val();
            const resolved = resolveServerId(rawVal);
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const rawVal = $('#node-input-serverHue').val();
            const resolved = resolveServerId(rawVal);
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=contact&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => {
                if (value.deviceObject) return value;
                return {
                  id: value.id || value.rid,
                  name: value.name || value.metadata?.name || '',
                  deviceObject: value,
                };
              });
              if (currentNode) currentNode._cachedContactDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedContactDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverId, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const resolved = resolveServerId(serverId);
            const server = resolved ? RED.nodes.node(resolved) : getKnxServer(false);
            if (!server) {
              return;
            }
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dptcontact || '1.019';
              if ($dptSelect.children().length) {
                $dptSelect.val(targetDpt);
              }
            });
          };

          const attachGroupAddressAutocomplete = ($input, $nameWidget) => {
            if (!$input || !$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('1.')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueContactSensor', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            try {
              const server = getKnxServer(false);
              if (server && server.id) KNX_enableSecureFormatting($input, server.id);
            } catch (error) { /* empty */ }
          };

          const hasKNXServerSelected = () => hasKnxSelection();

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueServer = getHueServer(false);
            const knxSelected = hasKNXServerSelected();
            if (hueServer) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueServer && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
          };

          const updateKNXVisibility = () => {
            const knxSelected = hasKNXServerSelected();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          RED.nodes.registerType('knxUltimateHueContactSensor', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namecontact: { value: '' },
              GAcontact: { value: '' },
              dptcontact: { value: '1.019' },
              hueDevice: { value: '' },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Contact Sensor'} (deprecated)`;
            },
            paletteLabel: 'Hue Contact Sensor (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-contact-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $outputInfo = $('.hue-output-info');
              $dptSelect = $('#node-input-dptcontact');

              cachedDevices = Array.isArray(node._cachedContactDevices) ? node._cachedContactDevices : [];
              node._cachedContactDevices = cachedDevices;

              defaultDevicePlaceholder = translateOrEmpty(DEVICE_PLACEHOLDER_KEY) || $deviceName.attr('placeholder') || '';
              if ($deviceName && defaultDevicePlaceholder) {
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);

              attachGroupAddressAutocomplete($('#node-input-GAcontact'), $('#node-input-namecontact'));

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueContactSensor', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueContactSensor', () => {
                  cachedDevices = [];
                  node._cachedContactDevices = cachedDevices;
                    const hueDomValue = $('#node-input-serverHue').val();
                    const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                  const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              $('#node-input-server').on('change.knxUltimateHueContactSensor', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                updateKNXVisibility();
              });

             $('#node-input-serverHue').on('change.knxUltimateHueContactSensor', function () {
                cachedDevices = [];
                node._cachedContactDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) {
                  const resolvedDefault = translateOrEmpty(DEVICE_PLACEHOLDER_KEY) || defaultDevicePlaceholder;
                  if (resolvedDefault) {
                    defaultDevicePlaceholder = resolvedDefault;
                    $deviceName.attr('placeholder', resolvedDefault);
                  }
                }
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKNXVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedContactDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedContactDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "light_level": function (RED) {
      // Canonical private editor profile for HUE Controller: light_level.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $readStatusSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueLightSensorVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueLightSensor');
            $('#node-input-serverHue').off('.knxUltimateHueLightSensor');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueLightSensor');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) $refreshButton.off('.knxUltimateHueLightSensor');
            const $gaInput = $('#node-input-GAlightsensor');
            if ($gaInput.length && $gaInput.data('ui-autocomplete')) {
              try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            if ($enablePinsSelect) $enablePinsSelect.off('.knxUltimateHueLightSensor');
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueLightSensor:knxUltimateHueLightSensor.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') $deviceName.val('');
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=light_level&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
                deviceObject: value.deviceObject || value,
              }));
              if (currentNode) currentNode._cachedLightDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedLightDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('9.004')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dptlightsensor || '9.004';
              if ($dptSelect.children().length) $dptSelect.val(targetDpt);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAlightsensor');
            const $nameWidget = $('#node-input-namelightsensor');
            if (!$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('9.004')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueLightSensor', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) KNX_enableSecureFormatting($input, server.id);
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if (hueSelected) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

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
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Light Sensor'} (deprecated)`;
            },
            paletteLabel: 'Hue Light Sensor (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-light-sensor-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptlightsensor');
              $readStatusSelect = $('#node-input-readStatusAtStartup');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedLightDevices) ? node._cachedLightDevices : [];
              node._cachedLightDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);

              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueLightSensor', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueLightSensor', () => {
                  cachedDevices = [];
                  node._cachedLightDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($readStatusSelect) {
                $readStatusSelect.val(node.readStatusAtStartup || 'yes');
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueLightSensor', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueLightSensor', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueLightSensor', function () {
                cachedDevices = [];
                node._cachedLightDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedLightDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedLightDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "temperature": function (RED) {
      // Canonical private editor profile for HUE Controller: temperature.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $readStatusSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueTemperatureTabsStyle').length) return;
            const style = `
              <style id="knxUltimateHueTemperatureTabsStyle">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueTemperatureSensor');
            $('#node-input-serverHue').off('.knxUltimateHueTemperatureSensor');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueTemperatureSensor');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) $refreshButton.off('.knxUltimateHueTemperatureSensor');
            const $gaInput = $('#node-input-GAtemperaturesensor');
            if ($gaInput.length && $gaInput.data('ui-autocomplete')) {
              try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            if ($enablePinsSelect) $enablePinsSelect.off('.knxUltimateHueTemperatureSensor');
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueTemperatureSensor:knxUltimateHueTemperatureSensor.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') $deviceName.val('');
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=temperature&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
                deviceObject: value.deviceObject || value,
              }));
              if (currentNode) currentNode._cachedTemperatureDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedTemperatureDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('9.001')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dpttemperaturesensor || '9.001';
              if ($dptSelect.children().length) $dptSelect.val(targetDpt);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAtemperaturesensor');
            const $nameWidget = $('#node-input-nametemperaturesensor');
            if (!$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('9.001')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueTemperatureSensor', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) KNX_enableSecureFormatting($input, server.id);
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if (hueSelected) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

          RED.nodes.registerType('knxUltimateHueTemperatureSensor', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              nametemperaturesensor: { value: '' },
              GAtemperaturesensor: { value: '' },
              dpttemperaturesensor: { value: '9.001' },
              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'yes' },
              hueDevice: { value: '' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueTemperatureSensor:knxUltimateHueTemperatureSensor.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Temperature Sensor (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-temperature-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dpttemperaturesensor');
              $readStatusSelect = $('#node-input-readStatusAtStartup');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedTemperatureDevices) ? node._cachedTemperatureDevices : [];
              node._cachedTemperatureDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);

              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueTemperatureSensor', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueTemperatureSensor', () => {
                  cachedDevices = [];
                  node._cachedTemperatureDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($readStatusSelect) {
                $readStatusSelect.val(node.readStatusAtStartup || 'yes');
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueTemperatureSensor', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueTemperatureSensor', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueTemperatureSensor', function () {
                cachedDevices = [];
                node._cachedTemperatureDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedTemperatureDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedTemperatureDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "humidity": function (RED) {
      // Canonical private editor profile for HUE Controller: humidity.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $readStatusRow = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;
          let $outputInfo = null;
          let $enablePinsSelect = null;
          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueLightVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueHumiditySensor');
            $('#node-input-serverHue').off('.knxUltimateHueHumiditySensor');
            $('.hue-refresh-devices').off('.knxUltimateHueHumiditySensor');
            const $gaInput = $('#node-input-GAhumiditysensor');
            $gaInput.off('.knxUltimateHueHumiditySensor');
            if ($gaInput.data('ui-autocomplete')) {
              try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueHumiditySensor');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueHumiditySensor');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'no';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueHumiditySensor:knxUltimateHueHumiditySensor.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const loadDPTOptions = (serverId, node) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const validId = resolveServerId(serverId);
            if (!validId) {
              return;
            }
            $.getJSON(`knxUltimateDpts?serverId=${validId}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('9.007')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = node || currentNode || {};
              const targetDpt = (referenceNode.dpthumiditysensor && referenceNode.dpthumiditysensor !== '') ? referenceNode.dpthumiditysensor : '9.007';
              if (targetDpt) {
                $dptSelect.val(targetDpt);
              }
            });
          };

          const hasKNXServerSelected = () => {
            let domValue = $('#node-input-server').val();
            if (domValue === undefined) {
              domValue = currentNode ? currentNode.server : null;
            }
            const knxServerId = resolveServerId(domValue);
            return Boolean(knxServerId);
          };

          const getGroupAddress = ($sourceWidget, $nameWidget, $dptWidget) => {
            $sourceWidget.off('.knxUltimateHueHumiditySensor');
            $sourceWidget.autocomplete({
              minLength: 0,
              source(request, response) {
                const serverId = $('#node-input-server').val();
                const knxServerId = resolveServerId(serverId);
                if (!knxServerId) { response([]); return; }
                const server = RED.nodes.node(knxServerId);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  response($.map(data, (value) => {
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, `${request.term} 9.007`)) {
                      return {
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      };
                    }
                    return null;
                  }));
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1].trim();
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                $nameWidget.val(sDevName);
                const optVal = $dptWidget.find(`option:contains('${ui.item.label.split('#')[2].trim()}')`).attr('value');
                if (optVal !== undefined && optVal !== null) {
                  $dptWidget.val(optVal).trigger('change');
                } else {
                  $dptWidget.trigger('change');
                }
              },
            });
            $sourceWidget.on('focus.knxUltimateHueHumiditySensor', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            try {
              const serverId = $('#node-input-server').val();
              const server = RED.nodes.node(serverId);
              if (server && server.id) KNX_enableSecureFormatting($sourceWidget, server.id);
            } catch (error) { /* empty */ }
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=humidity&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => {
                if (value.deviceObject) return value;
                return {
                  id: value.id || value.rid,
                  name: value.name || value.metadata?.name || '',
                  deviceObject: value,
                };
              });
              if (currentNode) currentNode._cachedHumidityDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedHumidityDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueServerId = resolveServerId($('#node-input-serverHue').val());
            const knxSelected = hasKNXServerSelected();
            if (hueServerId) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }

            if (hueServerId && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }

            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKNXVisibility = () => {
            const knxSelected = hasKNXServerSelected();
            if (knxSelected) {
              $knxSections.show();
              if ($readStatusRow) $readStatusRow.show();
            } else {
              $knxSections.hide();
              if ($readStatusRow) $readStatusRow.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            updateTabsVisibility();
          };

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
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || 'Hue Humidity Sensor'} (deprecated)`;
            },
            paletteLabel: 'Hue Humidity Sensor (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $readStatusRow = $('#node-input-readStatusAtStartup').closest('.form-row');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dpthumiditysensor');
              $outputInfo = $('.hue-output-info');
              $enablePinsSelect = $('#node-input-enableNodePINS');

              cachedDevices = Array.isArray(node._cachedHumidityDevices) ? node._cachedHumidityDevices : [];
              node._cachedHumidityDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);

              const $gaInput = $('#node-input-GAhumiditysensor');
              const $nameInput = $('#node-input-namehumiditysensor');
              getGroupAddress($gaInput, $nameInput, $dptSelect);

              if ($deviceName) {
                $deviceName.off('.knxUltimateHueHumiditySensor');
              }
              $deviceName.autocomplete({
                minLength: 0,
                source(request, response) {
                  const hueDomValue = $('#node-input-serverHue').val();
                  const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                  const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                  if (!hueServer) { response([]); return; }
                  fetchDevices(hueServer, request.term, response);
                },
                select(event, ui) {
                  $('#node-input-hueDevice').val(ui.item.hueDevice);
                },
              });
              $deviceName.on('focus.knxUltimateHueHumiditySensor', function () {
                $(this).autocomplete('search', `${$(this).val()}exactmatch`);
              });

              $refreshButton.on('click.knxUltimateHueHumiditySensor', () => {
                cachedDevices = [];
                node._cachedHumidityDevices = cachedDevices;
                const hueDomValue = $('#node-input-serverHue').val();
                const hueServerId = resolveServerId(hueDomValue === undefined ? node.serverHue : hueDomValue);
                const hueServer = hueServerId ? RED.nodes.node(hueServerId) : null;
                if (!hueServer) return;
                fetchDevices(hueServer, '', () => {
                  $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                }, { forceRefresh: true });
              });

              $('#node-input-server').on('change.knxUltimateHueHumiditySensor', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                updateKNXVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueHumiditySensor', function () {
                const hueServerId = resolveServerId($(this).val());
                cachedDevices = [];
                node._cachedHumidityDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hueServerId) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              $('#node-input-readStatusAtStartup').val(node.readStatusAtStartup || 'yes');
              if ($enablePinsSelect) {
                const initialPins = normalizePinsValue(node.enableNodePINS || 'yes');
                $enablePinsSelect.val(initialPins);
                $enablePinsSelect.on('change.knxUltimateHueHumiditySensor', function () {
                  const val = normalizePinsValue($(this).val());
                  node.enableNodePINS = val;
                  node.outputs = val === 'yes' ? 1 : 0;
                });
                $enablePinsSelect.trigger('change');
              }

              updateKNXVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedHumidityDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedHumidityDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "scene": function (RED) {
      // Canonical private editor profile for HUE Controller: scene.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let $modeHiddenInput = null;
          let $dptSceneSelect = null;
          let $dptSceneStatusSelect = null;
          let $dptSceneMultiSelect = null;
          let $sceneValueRow = null;
          let cachedScenes = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueSceneVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueSceneVerticalTabs">
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
                .hue-vertical-tabs .node-input-rule-container-row {
                  align-items: stretch;
                }
                .hue-vertical-tabs #node-input-rule-container {
                  width: 100%;
                  min-height: 200px;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueScene');
            $('#node-input-serverHue').off('.knxUltimateHueScene');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueScene');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueScene');
            }
            ['#node-input-GAscene', '#node-input-GAsceneStatus', '#node-input-GAsceneMulti'].forEach((selector) => {
              const $input = $(selector);
              if ($input.length) {
                $input.off('.knxUltimateHueScene');
                if ($input.data('ui-autocomplete')) {
                  try { $input.autocomplete('destroy'); } catch (error) { /* empty */ }
                }
              }
            });
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueScene');
            }
            if ($tabs && $tabs.data('ui-tabs')) {
              try { $tabs.tabs('destroy'); } catch (error) { /* empty */ }
            }
          };

          const ensureConfigSelection = (selector) => {
            const $select = $(selector);
            if (!$select.length) return;
            if ($select.val() !== '_ADD_') return;
            try { $select.prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null) return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value === 'no' ? 'no' : 'yes';
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            const noDevicesText = RED._('node-red-contrib-knx-ultimate/knxUltimateHueScene:knxUltimateHueScene.no_scenes');
            if (!hasDevices) {
              if (!showingNoDevicesPlaceholder) {
                $deviceName.attr('placeholder', noDevicesText);
                showingNoDevicesPlaceholder = true;
              }
            } else if (showingNoDevicesPlaceholder) {
              $deviceName.attr('placeholder', defaultDevicePlaceholder);
              showingNoDevicesPlaceholder = false;
            }
          };

          const filterScenes = (list, term) => {
            const matcher = (term || '').replace(/exactmatch/gi, '').trim().toLowerCase();
            return list
              .filter((item) => (item.name || '').toLowerCase().includes(matcher))
              .map((item) => ({
                hueDevice: item.id,
                value: item.name,
              }));
          };

          const fetchScenes = (hueServer, term, reply, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(false);
              reply([]);
              return;
            }
            if (!forceRefresh && cachedScenes.length > 0) {
              applyNoDevicesPlaceholder(cachedScenes.length > 0);
              reply(filterScenes(cachedScenes, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=scene&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const devices = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedScenes = devices.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
              }));
              if (currentNode) currentNode._cachedSceneDevices = cachedScenes;
              applyNoDevicesPlaceholder(cachedScenes.length > 0);
              reply(filterScenes(cachedScenes, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedScenes = [];
              if (currentNode) currentNode._cachedSceneDevices = cachedScenes;
              applyNoDevicesPlaceholder(false);
              reply([]);
            });
          };

          const populateSceneValues = (node) => {
            const $valSelect = $('#node-input-valscene');
            if (!$valSelect.length) return;
            $valSelect.empty();
            for (let index = 1; index <= 64; index += 1) {
              $valSelect.append($('<option></option>').attr('value', index).text(`Scene ${index}`));
            }
            const target = node?.valscene || '1';
            $valSelect.val(target);
          };

          const toggleSceneValueVisibility = () => {
            if (!$dptSceneSelect || !$sceneValueRow) return;
            const current = $dptSceneSelect.val();
            if (!current) {
              $sceneValueRow.hide();
              return;
            }
            if (current.startsWith('1.')) {
              $sceneValueRow.hide();
            } else {
              $sceneValueRow.show();
            }
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            const selects = [
              { element: $dptSceneSelect, filter: (value) => value.startsWith('1.') || value.startsWith('18.'), target: nodeRef?.dptscene },
              { element: $dptSceneStatusSelect, filter: (value) => value.startsWith('1.'), target: nodeRef?.dptsceneStatus },
              { element: $dptSceneMultiSelect, filter: (value) => value.startsWith('18.'), target: nodeRef?.dptsceneMulti },
            ];
            selects.forEach(({ element }) => { if (element) element.empty(); });
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                selects.forEach(({ element, filter }) => {
                  if (!element || !filter(dpt.value)) return;
                  element.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                });
              });
              selects.forEach(({ element, target }) => {
                if (!element || !element.children().length) return;
                const resolved = target && target !== '' ? target : element.children().first().attr('value');
                if (resolved !== undefined) element.val(resolved);
              });
              toggleSceneValueVisibility();
            });
          };

          const setupKnxAutocomplete = (options) => {
            const {
              inputSelector,
              nameSelector,
              dptSelector,
              allowedPrefixes,
            } = options;
            const $input = $(inputSelector);
            if (!$input.length) return;
            const $name = nameSelector ? $(nameSelector) : null;
            const $dptSelect = dptSelector ? $(dptSelector) : null;
            if ($input.data('ui-autocomplete')) {
              try { $input.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) {
                  response([]);
                  return;
                }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt) return;
                    if (Array.isArray(allowedPrefixes) && !allowedPrefixes.some((prefix) => value.dpt.startsWith(prefix))) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                if ($name) {
                  let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                  try {
                    sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                  } catch (error) { /* empty */ }
                  $name.val(sDevName);
                }
                if ($dptSelect) {
                  const dptLabel = ui.item.label.split('#')[2]?.trim();
                  const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                  if (optVal !== undefined && optVal !== null) {
                    $dptSelect.val(optVal).trigger('change');
                  } else {
                    $dptSelect.trigger('change');
                  }
                }
              },
            });
            $input.on('focus.knxUltimateHueScene', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) {
              try { KNX_enableSecureFormatting($input, server.id); } catch (error) { /* empty */ }
            }
          };

          const setupEditableList = (node) => {
            const $list = $('#node-input-rule-container');
            if (!$list.length) return;
            if ($list.data('editableList')) {
              try { $list.editableList('destroy'); } catch (error) { /* empty */ }
            }
            const resizeRule = () => { /* empty */ };
            $list.editableList({
              addButton: true,
              removable: true,
              sortable: true,
              scrollOnAdd: true,
              addItem(container, i, opt) {
                if (!opt.hasOwnProperty('r')) opt.r = {};
                const rule = opt.r;
                const row = $('<div class="form-row"/>').appendTo(container);
                const rowRuleKNXSceneNumber = $('<select/>', {
                  class: 'rowRuleKNXSceneNumber',
                  style: 'width:25%; margin-left:5px; text-align:left;',
                }).appendTo(row);
                const rowRuleHUESceneName = $('<input/>', {
                  class: 'rowRuleHUESceneName',
                  type: 'text',
                  placeholder: RED._('node-red-contrib-knx-ultimate/knxUltimateHueScene:knxUltimateHueScene.multi_scene_placeholder'),
                  style: 'width:45%; margin-left:5px; text-align:left;',
                }).appendTo(row);
                const rowRuleHUESceneID = $('<input/>', {
                  class: 'rowRuleHUESceneID',
                  type: 'hidden',
                }).appendTo(row);
                const rowRuleRecallAs = $('<select/>', {
                  class: 'rowRuleRecallAs',
                  style: 'width:25%; margin-left:5px; text-align:left;',
                }).appendTo(row);
                const finalspan = $('<span/>').appendTo(row);
                finalspan.append('<span class="node-input-rule-index"></span> ');

                for (let index = 1; index <= 64; index += 1) {
                  rowRuleKNXSceneNumber.append(
                    $('<option></option>')
                      .val(index)
                      .text(node._('knxUltimateHueScene.knx_scene_n') + index.toString()),
                  );
                }
                rowRuleRecallAs.append(
                  $('<option></option>').val('active').text(node._('knxUltimateHueScene.recall_active')),
                );
                rowRuleRecallAs.append(
                  $('<option></option>').val('dynamic_palette').text(node._('knxUltimateHueScene.recall_dynamic')),
                );
                rowRuleRecallAs.append(
                  $('<option></option>').val('static').text(node._('knxUltimateHueScene.recall_static')),
                );

                rowRuleKNXSceneNumber.val(rule.rowRuleKNXSceneNumber);
                rowRuleRecallAs.val(rule.rowRuleRecallAs);
                rowRuleHUESceneName.val(rule.rowRuleHUESceneName);
                rowRuleHUESceneID.val(rule.rowRuleHUESceneID);

                rowRuleHUESceneName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchScenes(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    rowRuleHUESceneID.val(ui.item.hueDevice);
                  },
                });
                rowRuleHUESceneName.on('focus.knxUltimateHueScene', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              },
              removeItem() {},
              resizeItem: resizeRule,
              sortItems() {},
            });

            $list.editableList('empty');
            if (Array.isArray(node.rules)) {
              node.rules.forEach((rule, index) => {
                $list.editableList('addItem', { r: rule, i: index });
              });
            }
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if ($requiresBridgeElems) {
              if (hueSelected) {
                $requiresBridgeElems.show();
              } else {
                $requiresBridgeElems.hide();
              }
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if ($knxSections) {
              if (knxSelected) {
                $knxSections.show();
              } else {
                $knxSections.hide();
              }
            }
            updateTabsVisibility();
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
            currentNode.inputs = currentNode.outputs;
          };

          RED.nodes.registerType('knxUltimateHueScene', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namescene: { value: '' },
              GAscene: { value: '' },
              dptscene: { value: '' },
              valscene: { value: '1' },
              namesceneStatus: { value: '' },
              GAsceneStatus: { value: '' },
              dptsceneStatus: { value: '' },
              enableNodePINS: { value: 'no' },
              outputs: { value: 0 },
              inputs: { value: 0 },
              hueDevice: { value: '' },
              hueSceneRecallType: { value: 'active' },
              GAsceneMulti: { value: '' },
              namesceneMulti: { value: '' },
              dptsceneMulti: { value: '' },
              rules: { value: [{ t: 'eq', v: '', vt: 'str' }] },
              selectedModeTabNumber: { value: 0 },
            },
            inputs: 0,
            outputs: 0,
            icon: 'node-hue-icon.svg',
            label() {
              let nodeLabel = this.name;
              if (Number(this.selectedModeTabNumber) === 0) nodeLabel = this.name || this.namescene || 'Hue Scene';
              if (Number(this.selectedModeTabNumber) === 1) nodeLabel = this.namesceneMulti || this.name || 'Hue Scene';
              return `${nodeLabel || 'Hue Scene'} (deprecated)`;
            },
            paletteLabel: 'Hue Scene (deprecated)',
            oneditprepare() {
              const node = this;
              try {
                onEditPrepareCore.call(node);
              } catch (error) {
                try {
                  console.error('knxUltimateHueScene oneditprepare error', error);
                  RED.notify(`Hue Scene editor error: ${error.message || error}`, { type: 'error', timeout: 8000 });
                } catch (notifyError) {
                  console.error('knxUltimateHueScene notify failure', notifyError);
                }
                throw error;
              }
            },
            oneditsave() {
              try { onEditSaveCore.call(this); } catch (error) {
                console.error('knxUltimateHueScene oneditsave error', error);
                throw error;
              }
            },
            oneditcancel() {
              try { onEditCancelCore.call(this); } catch (error) {
                console.error('knxUltimateHueScene oneditcancel error', error);
                throw error;
              }
            },
            oneditresize() {},
          });

          function onEditPrepareCore() {
            const node = this;
            try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
            currentNode = node;

            ensureConfigSelection('#node-input-serverHue');
            ensureVerticalTabsStyle();

            $tabs = $('#hue-scene-tabs');
            $requiresBridgeElems = $('.hue-requires-bridge');
            $knxSections = $('.hue-knx-section');
            $deviceName = $('#node-input-name');
            $refreshButton = $('.hue-refresh-devices');
            $loadingIndicator = $('.hue-devices-loading');
            $enablePinsSelect = $('#node-input-enableNodePINS');
            $outputInfo = $('.hue-output-info');
            $modeHiddenInput = $('#node-input-selectedModeTabNumber');
            $dptSceneSelect = $('#node-input-dptscene');
            $dptSceneStatusSelect = $('#node-input-dptsceneStatus');
            $dptSceneMultiSelect = $('#node-input-dptsceneMulti');
            $sceneValueRow = $('#divValScene');

            cachedScenes = Array.isArray(node._cachedSceneDevices) ? node._cachedSceneDevices : [];
            node._cachedSceneDevices = cachedScenes;

            defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
            showingNoDevicesPlaceholder = false;
            applyNoDevicesPlaceholder(cachedScenes.length > 0);

            populateSceneValues(node);

            $tabs.addClass('hue-vertical-tabs');
            const initialTab = Number(node.selectedModeTabNumber || 0);
            if ($modeHiddenInput) {
              $modeHiddenInput.val(Number.isNaN(initialTab) ? 0 : initialTab);
            }
            $tabs.tabs({
              activate(event, ui) {
                const index = ui.newTab.index();
                if ($modeHiddenInput) $modeHiddenInput.val(index);
                node.selectedModeTabNumber = index;
              },
              active: Number.isNaN(initialTab) ? 0 : initialTab,
            });
            $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

            $('#node-input-hueSceneRecallType').val(node.hueSceneRecallType || 'active');

            const initialServerDomValue = $('#node-input-server').val();
            const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
            loadDPTOptions(initialServerId, node);

            setupKnxAutocomplete({
              inputSelector: '#node-input-GAscene',
              nameSelector: '#node-input-namescene',
              dptSelector: '#node-input-dptscene',
              allowedPrefixes: ['1.', '18.'],
            });
            setupKnxAutocomplete({
              inputSelector: '#node-input-GAsceneStatus',
              nameSelector: '#node-input-namesceneStatus',
              dptSelector: '#node-input-dptsceneStatus',
              allowedPrefixes: ['1.'],
            });
            setupKnxAutocomplete({
              inputSelector: '#node-input-GAsceneMulti',
              nameSelector: '#node-input-namesceneMulti',
              dptSelector: '#node-input-dptsceneMulti',
              allowedPrefixes: ['18.'],
            });

            $('#node-input-dptscene').on('change.knxUltimateHueScene', toggleSceneValueVisibility);
            toggleSceneValueVisibility();

            setupEditableList(node);

            if ($deviceName) {
              $deviceName.autocomplete({
                minLength: 0,
                source(request, response) {
                  const hueServer = getHueServer(false);
                  if (!hueServer) { response([]); return; }
                  fetchScenes(hueServer, request.term, response);
                },
                select(event, ui) {
                  $('#node-input-hueDevice').val(ui.item.hueDevice);
                  updateTabsVisibility();
                },
              });
              $deviceName.on('focus.knxUltimateHueScene', function () {
                $(this).autocomplete('search', `${$(this).val()}exactmatch`);
              });
            }

            if ($refreshButton) {
              $refreshButton.on('click.knxUltimateHueScene', () => {
                cachedScenes = [];
                if (currentNode) currentNode._cachedSceneDevices = cachedScenes;
                const hueServer = getHueServer(false);
                if (!hueServer) return;
                fetchScenes(hueServer, '', () => {
                  if ($deviceName) {
                    $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                  }
                }, { forceRefresh: true });
              });
            }

            if ($enablePinsSelect) {
              $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
              $enablePinsSelect.on('change.knxUltimateHueScene', updatePinsState);
              updatePinsState();
            }

            $('#node-input-server').on('change.knxUltimateHueScene', function () {
              const serverId = $(this).val();
              loadDPTOptions(serverId, node);
              setupKnxAutocomplete({
                inputSelector: '#node-input-GAscene',
                nameSelector: '#node-input-namescene',
                dptSelector: '#node-input-dptscene',
                allowedPrefixes: ['1.', '18.'],
              });
              setupKnxAutocomplete({
                inputSelector: '#node-input-GAsceneStatus',
                nameSelector: '#node-input-namesceneStatus',
                dptSelector: '#node-input-dptsceneStatus',
                allowedPrefixes: ['1.'],
              });
              setupKnxAutocomplete({
                inputSelector: '#node-input-GAsceneMulti',
                nameSelector: '#node-input-namesceneMulti',
                dptSelector: '#node-input-dptsceneMulti',
                allowedPrefixes: ['18.'],
              });
              updateKnxVisibility();
            });

            $('#node-input-serverHue').on('change.knxUltimateHueScene', () => {
              cachedScenes = [];
              if (currentNode) currentNode._cachedSceneDevices = cachedScenes;
              if ($deviceName) {
                $deviceName.val('');
                $('#node-input-hueDevice').val('');
                applyNoDevicesPlaceholder(false);
              }
              updateTabsVisibility();
            });

            updateKnxVisibility();
          }

          function onEditSaveCore() {
            try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
            detachHandlers();
            cachedScenes = cachedScenes || [];
            const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'no';
            this.enableNodePINS = pinsSelection;
            this.outputs = pinsSelection === 'yes' ? 1 : 0;
            this.inputs = this.outputs;
            this._cachedSceneDevices = cachedScenes;
            if ($modeHiddenInput) {
              const idx = parseInt($modeHiddenInput.val(), 10);
              this.selectedModeTabNumber = Number.isNaN(idx) ? 0 : idx;
            }
            const self = this;
            const rules = $('#node-input-rule-container').editableList('items');
            self.rules = [];
            rules.each(function () {
              const rule = $(this);
              const rowRuleKNXSceneNumber = rule.find('.rowRuleKNXSceneNumber').val();
              const rowRuleHUESceneName = rule.find('.rowRuleHUESceneName').val();
              const rowRuleHUESceneID = rule.find('.rowRuleHUESceneID').val();
              const rowRuleRecallAs = rule.find('.rowRuleRecallAs').val();
              self.rules.push({
                rowRuleKNXSceneNumber,
                rowRuleHUESceneName,
                rowRuleHUESceneID,
                rowRuleRecallAs,
              });
            });
            currentNode = null;
          }

          function onEditCancelCore() {
            try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
            detachHandlers();
            cachedScenes = [];
            if (currentNode) currentNode._cachedSceneDevices = cachedScenes;
            currentNode = null;
          }
        }());
    },
    "device_power": function (RED) {
      // Canonical private editor profile for HUE Controller: device_power.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $readStatusSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueBatteryVerticalTabs').length) return;
            const style = `
              <style id="knxUltimateHueBatteryVerticalTabs">
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueBattery');
            $('#node-input-serverHue').off('.knxUltimateHueBattery');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueBattery');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueBattery');
            }
            const $gaInput = $('#node-input-GAbatterysensor');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHueBattery');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueBattery');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueBattery:knxUltimateHueBattery.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=device_power&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
                deviceObject: value.deviceObject || value,
              }));
              if (currentNode) currentNode._cachedBatteryDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedBatteryDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('5.001')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dptbatterysensor || '5.001';
              if ($dptSelect.children().length) $dptSelect.val(targetDpt);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAbatterysensor');
            const $nameWidget = $('#node-input-namebatterysensor');
            if (!$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('5.001')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueBattery', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) KNX_enableSecureFormatting($input, server.id);
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if (hueSelected) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

          RED.nodes.registerType('knxUltimateHueBattery', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namebatterysensor: { value: '' },
              GAbatterysensor: { value: '' },
              dptbatterysensor: { value: '5.001' },
              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'yes' },
              hueDevice: { value: '' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueBattery:knxUltimateHueBattery.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Battery Sensor (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-battery-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptbatterysensor');
              $readStatusSelect = $('#node-input-readStatusAtStartup');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedBatteryDevices) ? node._cachedBatteryDevices : [];
              node._cachedBatteryDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueBattery', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueBattery', () => {
                  cachedDevices = [];
                  node._cachedBatteryDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($readStatusSelect) {
                $readStatusSelect.val(node.readStatusAtStartup || 'yes');
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueBattery', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueBattery', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueBattery', function () {
                cachedDevices = [];
                node._cachedBatteryDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedBatteryDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedBatteryDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "zigbee_connectivity": function (RED) {
      // Canonical private editor profile for HUE Controller: zigbee_connectivity.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $readStatusSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHueLightVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHueZigbeeConnectivity');
            $('#node-input-serverHue').off('.knxUltimateHueZigbeeConnectivity');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHueZigbeeConnectivity');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHueZigbeeConnectivity');
            }
            const $gaInput = $('#node-input-GAzigbeeconnectivity');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHueZigbeeConnectivity');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHueZigbeeConnectivity');
            }
          };

          const ensureConfigSelection = (selector) => {
            if ($(selector).val() !== '_ADD_') return;
            try { $(selector).prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value;
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                showingNoDevicesPlaceholder = false;
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
              }
              return;
            }
            const message = RED._('node-red-contrib-knx-ultimate/knxUltimateHueZigbeeConnectivity:knxUltimateHueZigbeeConnectivity.no_devices');
            showingNoDevicesPlaceholder = true;
            $deviceName.attr('placeholder', message);
            if (($deviceName.val() || '').trim() === '') {
              $deviceName.val('');
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim();
            return $.map(devices, (value) => {
              const sSearch = value.name;
              if (cleaned === '' || htmlUtilsfullCSVSearch(sSearch, cleaned)) {
                return {
                  hueDevice: value.id,
                  value: value.name,
                  deviceObject: value.deviceObject || value,
                };
              }
              return null;
            });
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(true);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=zigbee_connectivity&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
                deviceObject: value.deviceObject || value,
              }));
              if (currentNode) currentNode._cachedZigbeeDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedZigbeeDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const referenceNode = nodeRef || currentNode || {};
              const targetDpt = referenceNode.dptzigbeeconnectivity || '1.001';
              if ($dptSelect.children().length) $dptSelect.val(targetDpt);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAzigbeeconnectivity');
            const $nameWidget = $('#node-input-namezigbeeconnectivity');
            if (!$input.length) return;
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('1.')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHueZigbeeConnectivity', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) KNX_enableSecureFormatting($input, server.id);
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if (knxSelected) {
              $knxSections.show();
            } else {
              $knxSections.hide();
            }
            updateTabsVisibility();
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if (hueSelected) {
              $requiresBridgeElems.show();
            } else {
              $requiresBridgeElems.hide();
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

          RED.nodes.registerType('knxUltimateHueZigbeeConnectivity', {
            category: 'KNX Ultimate HUE (Legacy)',
            color: '#E7E9F6',
            defaults: {
              server: { type: 'knxUltimate-config', required: false },
              serverHue: { type: 'hue-config', required: true },
              name: { value: '' },
              namezigbeeconnectivity: { value: '' },
              GAzigbeeconnectivity: { value: '' },
              dptzigbeeconnectivity: { value: '1.001' },
              readStatusAtStartup: { value: 'yes' },
              enableNodePINS: { value: 'yes' },
              hueDevice: { value: '' },
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHueZigbeeConnectivity:knxUltimateHueZigbeeConnectivity.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Zigbee Connectivity (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-zigbee-connectivity-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptzigbeeconnectivity');
              $readStatusSelect = $('#node-input-readStatusAtStartup');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedZigbeeDevices) ? node._cachedZigbeeDevices : [];
              node._cachedZigbeeDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                  },
                });
                $deviceName.on('focus.knxUltimateHueZigbeeConnectivity', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHueZigbeeConnectivity', () => {
                  cachedDevices = [];
                  node._cachedZigbeeDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($readStatusSelect) {
                $readStatusSelect.val(node.readStatusAtStartup || 'yes');
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHueZigbeeConnectivity', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHueZigbeeConnectivity', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHueZigbeeConnectivity', function () {
                cachedDevices = [];
                node._cachedZigbeeDevices = cachedDevices;
                if ($loadingIndicator) $loadingIndicator.hide();
                showingNoDevicesPlaceholder = false;
                if ($deviceName) $deviceName.attr('placeholder', defaultDevicePlaceholder);
                if (!hasHueSelection()) {
                  applyNoDevicesPlaceholder(true);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedZigbeeDevices = [];
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedZigbeeDevices = [];
              currentNode = null;
            },
          });
        }());
    },
    "device_software_update": function (RED) {
      // Canonical private editor profile for HUE Controller: device_software_update.
      // This source is captured into a private definition; it never registers a palette node.
      (function () {
          let $tabs = null;
          let $requiresBridgeElems = null;
          let $knxSections = null;
          let $deviceName = null;
          let $refreshButton = null;
          let $loadingIndicator = null;
          let $dptSelect = null;
          let $readStatusSelect = null;
          let $enablePinsSelect = null;
          let $outputInfo = null;
          let cachedDevices = [];
          let defaultDevicePlaceholder = '';
          let showingNoDevicesPlaceholder = false;
          let currentNode = null;

          const EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__', '__null__', 'null', 'undefined']);

          const ensureVerticalTabsStyle = () => {
            if ($('#knxUltimateHuedeviceSoftwareUpdateVerticalTabs').length) return;
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
              </style>`;
            $('head').append(style);
          };

          const detachHandlers = () => {
            $('#node-input-server').off('.knxUltimateHuedeviceSWUpdate');
            $('#node-input-serverHue').off('.knxUltimateHuedeviceSWUpdate');
            if ($deviceName) {
              $deviceName.off('.knxUltimateHuedeviceSWUpdate');
              if ($deviceName.data('ui-autocomplete')) {
                try { $deviceName.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($refreshButton) {
              $refreshButton.off('.knxUltimateHuedeviceSWUpdate');
            }
            const $gaInput = $('#node-input-GAdevice_software_update');
            if ($gaInput.length) {
              $gaInput.off('.knxUltimateHuedeviceSWUpdate');
              if ($gaInput.data('ui-autocomplete')) {
                try { $gaInput.autocomplete('destroy'); } catch (error) { /* empty */ }
              }
            }
            if ($enablePinsSelect) {
              $enablePinsSelect.off('.knxUltimateHuedeviceSWUpdate');
            }
            if ($tabs && $tabs.data('ui-tabs')) {
              try { $tabs.tabs('destroy'); } catch (error) { /* empty */ }
            }
          };

          const ensureConfigSelection = (selector) => {
            const $select = $(selector);
            if (!$select.length) return;
            if ($select.val() !== '_ADD_') return;
            try { $select.prop('selectedIndex', 0); } catch (error) { /* empty */ }
          };

          const resolveServerId = (value) => {
            if (value === undefined || value === null) return null;
            if (value === false) return null;
            if (typeof value === 'string') {
              const trimmed = value.trim();
              if (trimmed === '') return null;
              if (EMPTY_SERVER_VALUES.has(trimmed.toLowerCase())) return null;
              return trimmed;
            }
            const asString = String(value).trim();
            if (asString === '' || EMPTY_SERVER_VALUES.has(asString.toLowerCase())) return null;
            return value;
          };

          const getKnxServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.server : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const getHueServer = (allowFallback = true) => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return RED.nodes.node(resolved);
            if (!allowFallback) return null;
            const fallback = resolveServerId(currentNode ? currentNode.serverHue : null);
            return fallback ? RED.nodes.node(fallback) : null;
          };

          const hasKnxSelection = () => {
            const resolved = resolveServerId($('#node-input-server').val());
            if (resolved) return true;
            if ($('#node-input-server').length) return false;
            return resolveServerId(currentNode ? currentNode.server : null) !== null;
          };

          const hasHueSelection = () => {
            const resolved = resolveServerId($('#node-input-serverHue').val());
            if (resolved) return true;
            if ($('#node-input-serverHue').length) return false;
            return resolveServerId(currentNode ? currentNode.serverHue : null) !== null;
          };

          const normalizePinsValue = (value) => {
            if (value === undefined || value === null || value === '') return 'yes';
            if (value === true || value === 'true') return 'yes';
            if (value === false || value === 'false') return 'no';
            return value === 'no' ? 'no' : 'yes';
          };

          const applyNoDevicesPlaceholder = (hasDevices) => {
            if (!$deviceName) return;
            const noDevicesText = RED._('node-red-contrib-knx-ultimate/knxUltimateHuedevice_software_update:knxUltimateHuedevice_software_update.no_devices');
            if (hasDevices) {
              if (showingNoDevicesPlaceholder) {
                $deviceName.attr('placeholder', defaultDevicePlaceholder);
                showingNoDevicesPlaceholder = false;
              }
              return;
            }
            if (!showingNoDevicesPlaceholder) {
              $deviceName.attr('placeholder', noDevicesText);
              showingNoDevicesPlaceholder = true;
            }
          };

          const filterDevices = (devices, term) => {
            const cleaned = (term || '').replace(/exactmatch/gi, '').trim().toLowerCase();
            return devices
              .filter((value) => (value.name || '').toLowerCase().includes(cleaned))
              .map((value) => ({ hueDevice: value.id, value: value.name }));
          };

          const fetchDevices = (hueServer, term, response, { forceRefresh = false } = {}) => {
            if (!hueServer) {
              applyNoDevicesPlaceholder(false);
              response([]);
              return;
            }
            if (!forceRefresh && cachedDevices.length > 0) {
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
              return;
            }
            if ($loadingIndicator) $loadingIndicator.show();
            const refreshQuery = forceRefresh ? '&forceRefresh=1' : '';
            $.getJSON(`KNXUltimateGetResourcesHUE?rtype=device_software_update&serverId=${encodeURIComponent(hueServer.id)}${refreshQuery}&_=${Date.now()}`, (data) => {
              const listCandidates = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
              cachedDevices = listCandidates.map((value) => ({
                id: value.id || value.rid,
                name: value.name || value.metadata?.name || '',
              }));
              if (currentNode) currentNode._cachedSoftwareUpdateDevices = cachedDevices;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);
              response(filterDevices(cachedDevices, term));
            }).always(() => {
              if ($loadingIndicator) $loadingIndicator.hide();
            }).fail(() => {
              cachedDevices = [];
              if (currentNode) currentNode._cachedSoftwareUpdateDevices = cachedDevices;
              applyNoDevicesPlaceholder(false);
              response([]);
            });
          };

          const loadDPTOptions = (serverCandidate, nodeRef) => {
            if (!$dptSelect) return;
            $dptSelect.empty();
            const server = (() => {
              const resolved = resolveServerId(serverCandidate);
              if (resolved) return RED.nodes.node(resolved);
              return getKnxServer(false);
            })();
            if (!server) return;
            $.getJSON(`knxUltimateDpts?serverId=${server.id}`, (data) => {
              data.forEach((dpt) => {
                if (dpt.value.startsWith('1.')) {
                  $dptSelect.append($('<option></option>').attr('value', dpt.value).text(dpt.text));
                }
              });
              const target = nodeRef?.dptdevice_software_update && nodeRef.dptdevice_software_update !== ''
                ? nodeRef.dptdevice_software_update
                : ($dptSelect.children().first().attr('value') || '1.001');
              $dptSelect.val(target);
            });
          };

          const attachGroupAddressAutocomplete = () => {
            const $input = $('#node-input-GAdevice_software_update');
            const $nameWidget = $('#node-input-namedevice_software_update');
            if (!$input.length) return;
            if ($input.data('ui-autocomplete')) {
              try { $input.autocomplete('destroy'); } catch (error) { /* empty */ }
            }
            $input.autocomplete({
              minLength: 0,
              source(request, response) {
                const server = getKnxServer(false);
                if (!server) { response([]); return; }
                $.getJSON(`knxUltimatecsv?nodeID=${server.id}`, (data) => {
                  const matches = [];
                  data.forEach((value) => {
                    if (!value.dpt || !value.dpt.startsWith('1.')) return;
                    const sSearch = `${value.ga} (${value.devicename}) DPT${value.dpt}`;
                    if (htmlUtilsfullCSVSearch(sSearch, request.term)) {
                      matches.push({
                        label: `${value.ga} # ${value.devicename} # ${value.dpt}`,
                        value: value.ga,
                      });
                    }
                  });
                  response(matches);
                });
              },
              select(event, ui) {
                let sDevName = ui.item.label.split('#')[1]?.trim() || '';
                try {
                  sDevName = sDevName.substr(sDevName.indexOf(')') + 1).trim();
                } catch (error) { /* empty */ }
                if ($nameWidget) $nameWidget.val(sDevName);
                const dptLabel = ui.item.label.split('#')[2]?.trim();
                const optVal = dptLabel ? $dptSelect.find(`option:contains('${dptLabel}')`).attr('value') : undefined;
                if (optVal !== undefined && optVal !== null) {
                  $dptSelect.val(optVal).trigger('change');
                } else {
                  $dptSelect.trigger('change');
                }
              },
            });
            $input.on('focus.knxUltimateHuedeviceSWUpdate', function () {
              $(this).autocomplete('search', `${$(this).val()}exactmatch`);
            });
            const server = getKnxServer(false);
            if (server && server.id) {
              try { KNX_enableSecureFormatting($input, server.id); } catch (error) { /* empty */ }
            }
          };

          const updateTabsVisibility = () => {
            if (!$tabs) return;
            const hueSelected = hasHueSelection();
            const knxSelected = hasKnxSelection();
            if ($requiresBridgeElems) {
              if (hueSelected) {
                $requiresBridgeElems.show();
              } else {
                $requiresBridgeElems.hide();
              }
            }
            if (hueSelected && knxSelected) {
              $tabs.show();
              $tabs.tabs('refresh');
            } else {
              $tabs.hide();
            }
            if ($outputInfo) {
              if (knxSelected) {
                $outputInfo.hide();
              } else {
                $outputInfo.show();
              }
            }
            if ($enablePinsSelect && $enablePinsSelect.length) {
              const desiredPins = knxSelected ? 'no' : 'yes';
              if ($enablePinsSelect.val() !== desiredPins) {
                $enablePinsSelect.val(desiredPins).trigger('change');
              }
            }
          };

          const updateKnxVisibility = () => {
            const knxSelected = hasKnxSelection();
            if ($knxSections) {
              if (knxSelected) {
                $knxSections.show();
              } else {
                $knxSections.hide();
              }
            }
            updateTabsVisibility();
          };

          const updatePinsState = () => {
            if (!$enablePinsSelect || !currentNode) return;
            const val = normalizePinsValue($enablePinsSelect.val());
            currentNode.enableNodePINS = val;
            currentNode.outputs = val === 'yes' ? 1 : 0;
          };

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
              outputs: { value: 1 },
            },
            inputs: 0,
            outputs: 1,
            icon: 'node-hue-icon.svg',
            label() {
              return `${this.name || RED._('node-red-contrib-knx-ultimate/knxUltimateHuedevice_software_update:knxUltimateHuedevice_software_update.paletteLabel')} (deprecated)`;
            },
            paletteLabel: 'Hue Software Update (deprecated)',
            oneditprepare() {
              try { RED.sidebar.show('help'); } catch (error) { /* empty */ }
              const node = this;
              currentNode = node;

              ensureConfigSelection('#node-input-serverHue');
              ensureVerticalTabsStyle();

              $tabs = $('#hue-device-sw-tabs');
              $requiresBridgeElems = $('.hue-requires-bridge');
              $knxSections = $('.hue-knx-section');
              $deviceName = $('#node-input-name');
              $refreshButton = $('.hue-refresh-devices');
              $loadingIndicator = $('.hue-devices-loading');
              $dptSelect = $('#node-input-dptdevice_software_update');
              $readStatusSelect = $('#node-input-readStatusAtStartup');
              $enablePinsSelect = $('#node-input-enableNodePINS');
              $outputInfo = $('.hue-output-info');

              cachedDevices = Array.isArray(node._cachedSoftwareUpdateDevices) ? node._cachedSoftwareUpdateDevices : [];
              node._cachedSoftwareUpdateDevices = cachedDevices;

              defaultDevicePlaceholder = $deviceName.attr('placeholder') || '';
              showingNoDevicesPlaceholder = false;
              applyNoDevicesPlaceholder(cachedDevices.length > 0);

              $tabs.addClass('hue-vertical-tabs');
              $tabs.tabs();
              $tabs.find('li').removeClass('ui-corner-top').addClass('ui-corner-left');

              const initialServerDomValue = $('#node-input-server').val();
              const initialServerId = initialServerDomValue === undefined ? node.server : initialServerDomValue;
              loadDPTOptions(initialServerId, node);
              attachGroupAddressAutocomplete();

              if ($deviceName) {
                $deviceName.autocomplete({
                  minLength: 0,
                  source(request, response) {
                    const hueServer = getHueServer(false);
                    if (!hueServer) { response([]); return; }
                    fetchDevices(hueServer, request.term, response);
                  },
                  select(event, ui) {
                    $('#node-input-hueDevice').val(ui.item.hueDevice);
                    updateTabsVisibility();
                  },
                });
                $deviceName.on('focus.knxUltimateHuedeviceSWUpdate', function () {
                  $(this).autocomplete('search', `${$(this).val()}exactmatch`);
                });
              }

              if ($refreshButton) {
                $refreshButton.on('click.knxUltimateHuedeviceSWUpdate', () => {
                  cachedDevices = [];
                  node._cachedSoftwareUpdateDevices = cachedDevices;
                  const hueServer = getHueServer(false);
                  if (!hueServer) return;
                  fetchDevices(hueServer, '', () => {
                    if ($deviceName) {
                      $deviceName.autocomplete('search', `${$deviceName.val()}exactmatch`);
                    }
                  }, { forceRefresh: true });
                });
              }

              if ($readStatusSelect) {
                $readStatusSelect.val(node.readStatusAtStartup || 'yes');
              }

              if ($enablePinsSelect) {
                $enablePinsSelect.val(normalizePinsValue(node.enableNodePINS));
                $enablePinsSelect.on('change.knxUltimateHuedeviceSWUpdate', updatePinsState);
                updatePinsState();
              }

              $('#node-input-server').on('change.knxUltimateHuedeviceSWUpdate', function () {
                const serverId = $(this).val();
                loadDPTOptions(serverId, node);
                attachGroupAddressAutocomplete();
                updateKnxVisibility();
              });

              $('#node-input-serverHue').on('change.knxUltimateHuedeviceSWUpdate', () => {
                cachedDevices = [];
                node._cachedSoftwareUpdateDevices = cachedDevices;
                if ($deviceName) {
                  $deviceName.val('');
                  $('#node-input-hueDevice').val('');
                  applyNoDevicesPlaceholder(false);
                }
                updateTabsVisibility();
              });

              updateKnxVisibility();
            },
            oneditsave() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              const pinsSelection = $enablePinsSelect ? normalizePinsValue($enablePinsSelect.val()) : 'yes';
              this.enableNodePINS = pinsSelection;
              this.outputs = pinsSelection === 'yes' ? 1 : 0;
              this._cachedSoftwareUpdateDevices = cachedDevices;
              currentNode = null;
            },
            oneditcancel() {
              try { RED.sidebar.show('info'); } catch (error) { /* empty */ }
              detachHandlers();
              cachedDevices = [];
              this._cachedSoftwareUpdateDevices = [];
              currentNode = null;
            },
          });
        }());
    }
  }

  // Form fragments are mounted inside #hue-controller-profile-editor. The two
  // config-node fields remain owned by the outer Controller template.
  const PROFILE_TEMPLATES = {
    "light": "<!-- Canonical private HUE Controller template: light. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div id=\"waitWindow\">\n    <br/><br/>\n    <p align=\"center\">\n      <i class=\"fa-solid fa-hourglass-start fa-spin-pulse fa-2x\"></i><br/><br/>\n      <span data-i18n=\"knxUltimateHueLight.connection_wait\"></span>\n    </p>\n  </div>\n  <div  id=\"mainWindow\" hidden>\n    <div class=\"form-row\">\n      <b><span data-i18n=\"knxUltimateHueLight.title\"></span></b>&nbsp&nbsp<span style=\"color:red\" &nbsp &nbsp<i class=\"fa fa-youtube\"></i></span>&nbsp<a\n        target=\"_blank\" href=\"https://youtu.be/jjEUI1J8bkA\"><u><span data-i18n=\"common.youtube_sample\"></span></u></a>\n      <br />\n      <br />\n      <label for=\"node-input-server\">\n        <img\n          src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\"></img>\n        <span data-i18n=\"common.knx_gw\"></span>\n      </label>\n      <input type=\"text\" id=\"node-input-server\" />\n    </div>\n\n    <div class=\"form-row\">\n      <label for=\"node-input-serverHue\">\n        <img\n          src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\" />\n        <span data-i18n=\"common.hue_bridge\"></span>\n      </label>\n      <input type=\"text\" id=\"node-input-serverHue\" />\n    </div>\n\n    <br />\n    <p>\n      <b><span data-i18n=\"common.philips_hue\"></span></b>\n    </p>\n\n    <div class=\"form-row\">\n      <label for=\"node-input-name\">\n        <i class=\"fa fa-play-circle\"></i> <span data-i18n=\"common.name\"></span>\n      </label>\n      <input type=\"text\" id=\"node-input-name\" placeholder=\"Enter your hue device name\"\n        style=\"flex:1 1 240px; min-width:240px; max-width:240px;\" />\n      <button type=\"button\" class=\"red-ui-button hue-refresh-devices\"\n        style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\" title=\"Refresh Hue devices\">\n        <i class=\"fa fa-sync\"></i>\n      </button>\n      <button type=\"button\" class=\"red-ui-button hue-locate-device\"\n        style=\"margin-left:6px; color:#ff9800; border-color:#ff9800;\" title=\"Locate selected Hue device\">\n        <i class=\"fa fa-play\"></i>\n      </button>\n      <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n        <i class=\"fa fa-circle-notch fa-spin\"></i>\n      </span>\n      <input type=\"hidden\" id=\"node-input-hueDevice\" />\n    </div>\n\n    <br />\n\n    <div id=\"tabs\" style=\"display:none; width: 900px;\">\n      <ul>\n        <li><a href=\"#tabs-1\"><i class=\"fa-solid fa-toggle-on\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.switch\"></span></a></li>\n        <li><a href=\"#tabs-2\"><i class=\"fa-solid fa-arrow-up-wide-short\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.dim\"></span></a></li>\n        <li><a href=\"#tabs-3\"><i class=\"fa-solid fa-temperature-quarter\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.tunable_white\"></span></a></li>\n        <li><a href=\"#tabs-4\"><i class=\"fa-solid fa-palette\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.rgb_hsv\"></span></a></li>\n        <li><a href=\"#tabs-5\"><i class=\"fa-solid fa-heart-circle-check\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.effects\"></span></a></li>\n        <li><a href=\"#tabs-6\"><i class=\"fa-solid fa-code-merge\"></i> <span data-i18n=\"knxUltimateHueLight.tabs.behaviour\"></span></a></li>\n      </ul>\n      <div id=\"tabs-1\">\n        <p>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightSwitch\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> <span data-i18n=\"knxUltimateHueLight.control\"></span></label>\n\n          <label for=\"node-input-GALightSwitch\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightSwitch\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightSwitch\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightSwitch\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightSwitch\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightSwitch\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightState\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueLight.status\"></span></label>\n\n          <label for=\"node-input-GALightState\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightState\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightState\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightState\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightState\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightState\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        </p>\n      </div>\n      <div id=\"tabs-2\">\n        <p>\n          <img src=\"resources/node-red-contrib-knx-ultimate/dim.png\" style=\"width: 900px;\">\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightDIM\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control dim</label>\n\n          <label for=\"node-input-GALightDIM\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightDIM\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightDIM\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightDIM\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightDIM\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightDIM\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightBrightness\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control\n            %</label>\n\n          <label for=\"node-input-GALightBrightness\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightBrightness\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightBrightness\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightBrightness\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightBrightness\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightBrightness\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightBrightnessState\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status %</label>\n\n          <label for=\"node-input-GALightBrightnessState\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightBrightnessState\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightBrightnessState\"\n            style=\"width:40px; margin-left: 0px; text-align: right;\">DPT</label>\n          <select id=\"node-input-dptLightBrightnessState\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightBrightnessState\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightBrightnessState\"\n            style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-dimSpeed\" style=\"width:260px\">\n            <i class=\"fa fa-bolt\"></i> Dim Speed (ms)\n          </label>\n          <input type=\"text\" id=\"node-input-dimSpeed\" placeholder='Default is 5000' style=\"width:210px\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-minDimLevelLight\" style=\"width:260px;\">\n            <i class=\"fa fa-clone\"></i> Min Dim Brightness\n          </label>\n          <select id=\"node-input-minDimLevelLight\">\n            <option value=\"useHueLightLevel\" data-i18n=\"knxUltimateHueLight.use_min_brightness\"></option>\n          </select>\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-maxDimLevelLight\" style=\"width:260px;\">\n            <i class=\"fa fa-clone\"></i> Max Dim Brightness\n          </label>\n          <select id=\"node-input-maxDimLevelLight\"></select>\n        </div>\n        </p>\n      </div>\n      <div id=\"tabs-3\">\n        <p>\n          <img src=\"resources/node-red-contrib-knx-ultimate/tunablewhite.png\" style=\"width: 900px;\">\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightKelvinDIM\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control dim</label>\n\n          <label for=\"node-input-GALightKelvinDIM\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightKelvinDIM\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightKelvinDIM\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightKelvinDIM\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightKelvinDIM\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightKelvinDIM\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightKelvinPercentage\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control\n            %</label>\n\n          <label for=\"node-input-GALightKelvinPercentage\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightKelvinPercentage\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightKelvinPercentage\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightKelvinPercentage\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightKelvinPercentage\"\n            style=\"width:50px; margin-left: 0px; text-align: right;\">Name</label>\n          <input type=\"text\" id=\"node-input-nameLightKelvinPercentage\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightKelvinPercentageState\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status\n            %</label>\n\n          <label for=\"node-input-GALightKelvinPercentageState\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightKelvinPercentageState\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightKelvinPercentageState\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightKelvinPercentageState\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightKelvinPercentageState\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightKelvinPercentageState\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightKelvin\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control\n            Kelvin</label>\n\n          <label for=\"node-input-GALightKelvin\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightKelvin\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightKelvin\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightKelvin\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightKelvin\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightKelvin\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightKelvinState\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status\n            Kelvin</label>\n          <label for=\"node-input-GALightKelvinState\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightKelvinState\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightKelvinState\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightKelvinState\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightKelvinState\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightKelvinState\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label style=\"width:170px\" for=\"node-input-invertDimTunableWhiteDirection\">\n            <i class=\"fa fa-shuffle\"></i> Invert dim direction\n          </label>\n          <input type=\"checkbox\" id=\"node-input-invertDimTunableWhiteDirection\"\n            style=\"display:inline-block; width:auto; vertical-align:top;\" />\n        </div>\n        </p>\n      </div>\n      <div id=\"tabs-4\">\n        <p>\n          <img src=\"resources/node-red-contrib-knx-ultimate/rgb.png\" style=\"width: 900px;\">\n          <p><b> RGB section</b></p>\n          <div class=\"form-row\">\n          <label for=\"node-input-nameLightColor\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control rgb</label>\n\n          <label for=\"node-input-GALightColor\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightColor\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightColor\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightColor\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightColor\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightColor\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightColorState\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status rgb</label>\n\n          <label for=\"node-input-GALightColorState\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightColorState\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightColorState\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightColorState\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightColorState\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightColorState\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n\n        <p><b> HSV section</b></p>\n        <!-- // HSV Color change\n        // nameLightHSV_H_DIM: { value: \"\" },\n        // GALightHSV_H_DIM: { value: \"\" },\n        // dptLightHSV_H_DIM: { value: \"\" }, -->\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightHSV_H_DIM\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control H dim</label>\n\n          <label for=\"node-input-GALightHSV_H_DIM\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightHSV_H_DIM\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightHSV_H_DIM\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightHSV_H_DIM\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightHSV_H_DIM\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightHSV_H_DIM\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightHSV_H_State\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status H %</label>\n\n          <label for=\"node-input-GALightHSV_H_State\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightHSV_H_State\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightHSV_H_State\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightHSV_H_State\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightHSV_H_State\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightHSV_H_State\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n\n        <!-- // HSV Saturation change\n        nameLightHSV_S_DIM: { value: \"\" },\n        GALightHSV_S_DIM: { value: \"\" },\n        dptLightHSV_S_DIM: { value: \"\" },\n        nameLightHSV_S_State: { value: \"\" },\n        GALightHSV_S_State: { value: \"\" },\n        dptLightHSV_S_State: { value: \"\" }, -->\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightHSV_S_DIM\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Control S dim</label>\n\n          <label for=\"node-input-GALightHSV_S_DIM\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightHSV_S_DIM\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightHSV_S_DIM\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightHSV_S_DIM\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightHSV_S_DIM\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightHSV_S_DIM\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightHSV_S_State\" style=\"width:110px;\"><i class=\"fa fa-question-circle\"></i> Status S %</label>\n\n          <label for=\"node-input-GALightHSV_S_State\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightHSV_S_State\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightHSV_S_State\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightHSV_S_State\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightHSV_S_State\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightHSV_S_State\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n\n        <!-- // HSV V Brightness change\n        nameLightHSV_V_DIM: { value: \"\" },\n        GALightHSV_V_DIM: { value: \"\" },\n        dptLightHSV_V_DIM: { value: \"\" },\n        nameLightHSV_V_State: { value: \"\" },\n        GALightHSV_V_State: { value: \"\" },\n        dptLightHSV_V_State: { value: \"\" }, -->\n        <div class=\"form-row\">\n          <label for=\"node-input-HSVDimSpeed\" style=\"width:260px\">\n            <i class=\"fa fa-bolt\"></i> Dim Speed (ms)\n          </label>\n          <input type=\"text\" id=\"node-input-HSVDimSpeed\" placeholder='Default is 5000' style=\"width:210px\">\n        </div>\n\n        </p>\n      </div>\n      <div id=\"tabs-5\">\n        <p>\n        <div class=\"form-tips\" style=\"margin-bottom:6px;\">\n          <i class=\"fa fa-circle-info\" style=\"color:forestgreen; margin-right:4px;\"></i>\n          <span data-i18n=\"knxUltimateHueLight.effect_base_label\"></span>\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-nameLightBlink\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Blink</label>\n\n          <label for=\"node-input-GALightBlink\" style=\"width:20px;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-GALightState\"></span></label>\n          <input type=\"text\" id=\"node-input-GALightBlink\" placeholder=\"Ex: 1/1/1\"\n            style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n          <label for=\"node-input-dptLightBlink\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n          <select id=\"node-input-dptLightBlink\" style=\"width:140px;\"></select>\n\n          <label for=\"node-input-nameLightBlink\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n              data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n          <input type=\"text\" id=\"node-input-nameLightBlink\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n        </div>\n\n        <div id=\"divColorCycle\">\n          <div class=\"form-row\">\n            <label for=\"node-input-nameLightColorCycle\" style=\"width:110px;\"><i class=\"fa fa-play-circle-o\"></i> Color\n              Cycle</label>\n\n            <label for=\"node-input-GALightColorCycle\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n            <input type=\"text\" id=\"node-input-GALightColorCycle\" placeholder=\"Ex: 1/1/1\"\n              style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n            <label for=\"node-input-dptLightColorCycle\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n            <select id=\"node-input-dptLightColorCycle\" style=\"width:140px;\"></select>\n\n            <label for=\"node-input-nameLightColorCycle\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n                data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n            <input type=\"text\" id=\"node-input-nameLightColorCycle\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n          </div>\n        </div>\n\n        <hr style=\"margin:12px 0;\">\n\n        <div id=\"divHueEffectsContainer\">\n          <div class=\"form-tips\" style=\"margin-bottom:6px;\">\n            <i class=\"fa fa-circle-info\" style=\"color:forestgreen; margin-right:4px;\"></i>\n            <span data-i18n=\"knxUltimateHueLight.effect_native_label\"></span>\n          </div>\n          <div id=\"divHueEffectsNoSupport\" class=\"form-tips\" data-i18n=\"knxUltimateHueLight.effect_not_supported\" style=\"display:none;\"></div>\n          <div id=\"divHueEffectsContent\" style=\"display:none;\">\n            <div class=\"form-row\">\n              <label for=\"node-input-nameLightEffect\" style=\"width:110px;\"><i class=\"fa fa-wand-magic-sparkles\"></i> <span data-i18n=\"knxUltimateHueLight.effect_command\"></span></label>\n\n              <label for=\"node-input-GALightEffect\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n              <input type=\"text\" id=\"node-input-GALightEffect\" placeholder=\"Ex: 1/1/1\"\n                style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n              <label for=\"node-input-dptLightEffect\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n              <select id=\"node-input-dptLightEffect\" style=\"width:140px;\"></select>\n\n              <label for=\"node-input-nameLightEffect\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n                  data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n              <input type=\"text\" id=\"node-input-nameLightEffect\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n            </div>\n\n            <div class=\"form-row\">\n              <label for=\"node-input-nameLightEffectStatus\" style=\"width:110px;\"><i class=\"fa fa-circle-info\"></i> <span data-i18n=\"knxUltimateHueLight.effect_status\"></span></label>\n\n              <label for=\"node-input-GALightEffectStatus\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n              <input type=\"text\" id=\"node-input-GALightEffectStatus\" placeholder=\"Ex: 1/1/1\"\n                style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n              <label for=\"node-input-dptLightEffectStatus\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n              <select id=\"node-input-dptLightEffectStatus\" style=\"width:140px;\"></select>\n\n              <label for=\"node-input-nameLightEffectStatus\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n                  data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n              <input type=\"text\" id=\"node-input-nameLightEffectStatus\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n            </div>\n\n            <div class=\"form-row\" id=\"divEffectMappings\">\n              <label style=\"width:110px;\"><i class=\"fa fa-list-check\"></i> <span data-i18n=\"knxUltimateHueLight.effect_mapping\"></span></label>\n              <div style=\"margin-left:5px; width: calc(100% - 120px);\">\n                <input type=\"hidden\" id=\"node-input-effectRules\">\n                <ol id=\"node-input-effect-rule-container\" style=\"margin:0; padding:0;\"></ol>\n                <div style=\"margin-top:5px;\">\n                  <button type=\"button\" id=\"node-input-effect-autofill\" class=\"red-ui-button\"><span data-i18n=\"knxUltimateHueLight.effect_autofill\"></span></button>\n                </div>\n                <div class=\"form-tips\">\n                  <i class=\"fa fa-circle-info\" style=\"color:forestgreen; margin-right:4px;\"></i>\n                  <span data-i18n=\"knxUltimateHueLight.effect_tip\"></span>\n                </div>\n                <div class=\"form-tips\">\n                  <i class=\"fa fa-circle-info\" style=\"color:forestgreen; margin-right:4px;\"></i>\n                  <span data-i18n=\"knxUltimateHueLight.effect_tip_status\"></span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n        </p>\n      </div>\n      <div id=\"tabs-6\">\n        <p>\n        <div class=\"form-row\">\n          <label style=\"width:260px;\" for=\"node-input-readStatusAtStartup\"><i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueLight.read_status_startup\"></span></label>\n          <select id=\"node-input-readStatusAtStartup\">\n            <option value=\"no\" data-i18n=\"knxUltimateHueLight.opt_no\"></option>\n            <option value=\"yes\" data-i18n=\"knxUltimateHueLight.opt_yes_emit\"></option>\n          </select>\n        </div>\n        <div class=\"form-row\" id=\"divUpdateKNXBrightnessStatusOnHUEOnOff\">\n          <label style=\"width:260px;\" for=\"node-input-updateKNXBrightnessStatusOnHUEOnOff\">\n            <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueLight.knx_brightness_status\"></span>\n          </label>\n          <select id=\"node-input-updateKNXBrightnessStatusOnHUEOnOff\">\n            <option value=\"onhueoff\" data-i18n=\"knxUltimateHueLight.knx_brightness_onhueoff\"></option>\n            <option value=\"no\" data-i18n=\"knxUltimateHueLight.knx_brightness_no\"></option>\n          </select>\n        </div>\n        <div class=\"form-row\">\n          <label style=\"width:260px;\" for=\"node-input-updateLocalStateFromKNXWrite\">\n            <i class=\"fa fa-database\"></i> <span data-i18n=\"knxUltimateHueLight.update_local_state_from_knx_write\"></span>\n          </label>\n          <input type=\"checkbox\" id=\"node-input-updateLocalStateFromKNXWrite\" style=\"display:inline-block; width:auto; vertical-align:top;\" />\n        </div>\n        <div class=\"form-tips\" style=\"margin-left:260px;\" data-i18n=\"knxUltimateHueLight.update_local_state_from_knx_write_hint\"></div><br/>\n        <div id =\"divBehaviourBrightness\">\n          <div class=\"form-row\">\n            <label for=\"node-input-specifySwitchOnBrightness\" style=\"width:260px;\">\n              <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueLight.switch_on_behaviour\"></span>\n            </label>\n            <select id=\"node-input-specifySwitchOnBrightness\">\n              <option value=\"no\" data-i18n=\"knxUltimateHueLight.none\"></option>\n              <option value=\"temperature\" data-i18n=\"knxUltimateHueLight.select_temperature_brightness\"></option>\n              <option value=\"yes\" data-i18n=\"knxUltimateHueLight.select_color\"></option>\n            </select>\n          </div>\n\n          <div class=\"form-row\" id=\"divColorsAtSwitchOn\">\n            <label for=\"node-input-colorAtSwitchOnDayTime\" style=\"width:260px\">\n            </label>\n            <input type=\"hidden\" id=\"node-input-colorAtSwitchOnDayTime\">\n            <input type=\"color\" id=\"colorPickerDay\" style=\"width:260px\">\n            <button id=\"getColorAtSwitchOnDayTimeButton\" type=\"button\" class=\"red-ui-button\"><span data-i18n=\"knxUltimateHueLight.get_current\"></span></button>\n          </div>\n          <div class=\"form-row\" id=\"divTemperatureAtSwitchOn\" hidden>\n            <label for=\"node-input-colorAtSwitchOnDayTime\" style=\"width:260px\">\n            </label>\n            <select style=\"width:12%;\" id=\"comboTemperatureAtSwitchOn\"></select>\n            <select  style=\"width:25%;\" id=\"comboBrightnessAtSwitchOn\"></select>\n          </div>\n\n          <div id=\"divCCSBoxAtNightLighting\">\n            <div class=\"form-row\">\n              <label for=\"node-input-enableDayNightLighting\" style=\"width:260px;\">\n                <i class=\"fa fa-clone\"></i> <span data-i18n=\"knxUltimateHueLight.night_lighting\"></span>\n              </label>\n              <select id=\"node-input-enableDayNightLighting\">\n                <option value=\"no\" data-i18n=\"knxUltimateHueLight.no_night_lighting\"></option>\n                <!-- <option value=\"temperature\">Select temperature and brightness</option>\n                <option value=\"yes\">Select color</option> -->\n              </select>\n            </div>\n\n            <div id=\"divEnableDayNightLighting\">\n\n              <div class=\"form-row\" id=\"divColorsAtSwitchOnNightTime\">\n                <label for=\"node-input-colorAtSwitchOnNightTime\" style=\"width:260px\"></label>\n                <input type=\"hidden\" id=\"node-input-colorAtSwitchOnNightTime\">\n                <input type=\"color\" id=\"colorPickerNight\" style=\"width:260px\">\n                <button id=\"getColorAtSwitchOnNightTimeButton\" type=\"button\" class=\"red-ui-button\"><span data-i18n=\"knxUltimateHueLight.get_current\"></span></button>\n              </div>\n              <div class=\"form-row\" id=\"divTemperatureAtSwitchOnNightTime\" hidden>\n                <label for=\"node-input-colorAtSwitchOnNightTime\" style=\"width:260px\"></label>\n                <select style=\"width:25%;\" id=\"comboTemperatureAtSwitchOnNightTime\"></select>\n                <select style=\"width:25%;\" id=\"comboBrightnessAtSwitchOnNightTime\"></select>\n              </div>\n\n              <div class=\"form-row\">\n                <label for=\"node-input-nameDaylightSensor\" style=\"width:110px;\"><i class=\"fa fa-clock-o\"></i>\n                  <span data-i18n=\"knxUltimateHueLight.day_night\"></span></label>\n                <label for=\"node-input-GADaylightSensor\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n                <input type=\"text\" id=\"node-input-GADaylightSensor\" placeholder=\"Ex: 1/1/1\"\n                  style=\"width:70px;margin-left: 5px; text-align: left;\">\n\n                <label for=\"node-input-dptDaylightSensor\" style=\"width:40px; margin-left: 0px; text-align: right;\"><span data-i18n=\"common.dpt\"></span></label>\n                <select id=\"node-input-dptDaylightSensor\" style=\"width:140px;\"></select>\n\n                <label for=\"node-input-nameDaylightSensor\" style=\"width:50px; margin-left: 0px; text-align: right;\"><span\n                    data-i18n=\"knxUltimateHueLight.node-input-name\"></span></label>\n                <input type=\"text\" id=\"node-input-nameDaylightSensor\" style=\"width:190px;margin-left: 5px; text-align: left;\">\n              </div>\n              <div class=\"form-row\">\n                <label style=\"width:170px\" for=\"node-input-invertDayNight\">\n                  <i class=\"fa fa-shuffle\"></i> <span data-i18n=\"knxUltimateHueLight.invert_day_night\"></span>\n                </label>\n                <input type=\"checkbox\" id=\"node-input-invertDayNight\"\n                  style=\"display:inline-block; width:auto; vertical-align:top;\" />\n              </div>\n              <div class=\"form-row\">\n                <label for=\"node-input-restoreDayMode\" style=\"width:260px;\">\n                  <i class=\"fa fa-circle\"></i> <span data-i18n=\"knxUltimateHueLight.override_night_mode\"></span>\n                </label>\n                <select id=\"node-input-restoreDayMode\">\n                  <option value=\"no\" data-i18n=\"knxUltimateHueLight.override_no\"></option>\n                  <option value=\"setDayByFastSwitchLightSingle\" data-i18n=\"knxUltimateHueLight.override_set_day_fast_this\"></option>\n                  <option value=\"setDayByFastSwitchLightALL\" data-i18n=\"knxUltimateHueLight.override_set_day_fast_all\"></option>\n                </select>\n              </div>\n            </div>\n          </div>\n          <br/>\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-enableNodePINS\" style=\"width:260px;\">\n            <i class=\"fa fa-circle\"></i> <span data-i18n=\"knxUltimateHueLight.node_pins\"></span>\n          </label>\n          <select id=\"node-input-enableNodePINS\">\n            <option value=\"no\" data-i18n=\"knxUltimateHueLight.node_pins_hide\"></option>\n            <option value=\"yes\" data-i18n=\"knxUltimateHueLight.node_pins_show\"></option>\n          </select>\n        </div>\n        </p>\n      </div>\n    </div>\n  </div>\n<br />",
    "plug": "<!-- Canonical private HUE Controller template: plug. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"common.name\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue plug name\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"tabs\">\n    <ul>\n      <li><a href=\"#tabs-1\"><i class=\"fa-solid fa-toggle-on\"></i> <span data-i18n=\"knxUltimateHuePlug.tabs.switch\"></span></a></li>\n      <li><a href=\"#tabs-2\"><i class=\"fa-solid fa-gear\"></i> <span data-i18n=\"knxUltimateHuePlug.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"tabs-1\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHuePlug.switch_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-namePlugSwitch\" style=\"width:120px;\">\n          <i class=\"fa fa-play-circle\"></i> <span data-i18n=\"knxUltimateHuePlug.switch_control\"></span>\n        </label>\n        <label for=\"node-input-GAPlugSwitch\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAPlugSwitch\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptPlugSwitch\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptPlugSwitch\" style=\"width:140px;\"></select>\n        <label for=\"node-input-namePlugSwitch\" style=\"width:60px; text-align:right;\"><span data-i18n=\"knxUltimateHuePlug.node-input-name\"></span></label>\n        <input type=\"text\" id=\"node-input-namePlugSwitch\" style=\"width:200px; text-align:left;\">\n      </div>\n\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-namePlugState\" style=\"width:120px;\">\n          <i class=\"fa fa-circle-info\"></i> <span data-i18n=\"knxUltimateHuePlug.switch_status\"></span>\n        </label>\n        <label for=\"node-input-GAPlugState\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAPlugState\" placeholder=\"1/1/2\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptPlugState\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptPlugState\" style=\"width:140px;\"></select>\n        <label for=\"node-input-namePlugState\" style=\"width:60px; text-align:right;\"><span data-i18n=\"knxUltimateHuePlug.node-input-name\"></span></label>\n        <input type=\"text\" id=\"node-input-namePlugState\" style=\"width:200px; text-align:left;\">\n      </div>\n\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHuePlug.power_state_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-namePlugPowerState\" style=\"width:120px;\">\n          <i class=\"fa fa-bolt\"></i> <span data-i18n=\"knxUltimateHuePlug.power_state\"></span>\n        </label>\n        <label for=\"node-input-GAPlugPowerState\" style=\"width:20px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAPlugPowerState\" placeholder=\"1/1/3\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptPlugPowerState\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptPlugPowerState\" style=\"width:140px;\"></select>\n        <label for=\"node-input-namePlugPowerState\" style=\"width:60px; text-align:right;\"><span data-i18n=\"knxUltimateHuePlug.node-input-name\"></span></label>\n        <input type=\"text\" id=\"node-input-namePlugPowerState\" style=\"width:200px; text-align:left;\">\n      </div>\n    </div>\n\n    <div id=\"tabs-2\">\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHuePlug.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:120px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHuePlug.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHuePlug.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHuePlug.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:120px;\">\n          <option value=\"no\" data-i18n=\"knxUltimateHuePlug.node_pins_hide\"></option>\n          <option value=\"yes\" data-i18n=\"knxUltimateHuePlug.node_pins_show\"></option>\n        </select>\n        <div class=\"form-tips hue-form-tip\" style=\"margin-left:4px; display:none;\">\n          <i class=\"fa fa-circle-info\"></i>\n          <span data-i18n=\"knxUltimateHuePlug.node_pins_help\"></span>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "button": "<!-- Canonical private HUE Controller template: button. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueButton.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue button\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-button-tabs\">\n    <ul>\n      <li><a href=\"#hue-button-tab-switch\"><i class=\"fa fa-toggle-on\"></i> <span data-i18n=\"knxUltimateHueButton.tabs.switch\"></span></a></li>\n      <li><a href=\"#hue-button-tab-dim\"><i class=\"fa fa-sun\"></i> <span data-i18n=\"knxUltimateHueButton.tabs.dim\"></span></a></li>\n      <li><a href=\"#hue-button-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueButton.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-button-tab-switch\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueButton.switch_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAshort_release\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAshort_release\" style=\"width:80px; text-align:left;\" placeholder=\"1/1/1\">\n        <label for=\"node-input-dptshort_release\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptshort_release\" style=\"width:120px;\"></select>\n        <label for=\"node-input-nameshort_release\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nameshort_release\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Switch action\">\n      </div>\n      <div class=\"form-row hue-knx-section hue-status-row\">\n        <label for=\"node-input-GAshort_releaseStatus\" style=\"width:70px;\"><span data-i18n=\"knxUltimateHueButton.switch_status\"></span></label>\n        <input type=\"text\" id=\"node-input-GAshort_releaseStatus\" style=\"width:80px; text-align:left;\" placeholder=\"1/1/2\">\n        <label for=\"node-input-dptshort_releaseStatus\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptshort_releaseStatus\" style=\"width:120px;\"></select>\n        <label for=\"node-input-nameshort_releaseStatus\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nameshort_releaseStatus\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Switch status\">\n      </div>\n    </div>\n\n    <div id=\"hue-button-tab-dim\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueButton.dim_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GArepeat\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GArepeat\" style=\"width:80px; text-align:left;\" placeholder=\"1/1/3\">\n        <label for=\"node-input-dptrepeat\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptrepeat\" style=\"width:120px;\"></select>\n        <label for=\"node-input-nameDim\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nameDim\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Dim action\">\n      </div>\n    </div>\n\n    <div id=\"hue-button-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueButton.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <input type=\"checkbox\" id=\"node-input-toggleValues\" style=\"width:auto;\">\n        <label for=\"node-input-toggleValues\" style=\"flex:1 1 auto;\">\n          <span data-i18n=\"knxUltimateHueButton.toggle_values\"></span>\n        </label>\n      </div>\n      <div class=\"form-row hue-status-row\" style=\"margin-left:24px;\">\n        <span data-i18n=\"knxUltimateHueButton.toggle_values_hint\"></span>\n      </div>\n      <div class=\"hue-fixed-values\" style=\"margin-top:8px;\">\n        <div class=\"form-row\">\n          <label for=\"node-input-switchSend\" style=\"width:130px;\"><span data-i18n=\"knxUltimateHueButton.switch_send\"></span></label>\n          <input type=\"text\" id=\"node-input-switchSend\" style=\"width:160px;\">\n        </div>\n        <div class=\"form-row\">\n          <label for=\"node-input-dimSend\" style=\"width:130px;\"><span data-i18n=\"knxUltimateHueButton.dim_send\"></span></label>\n          <input type=\"text\" id=\"node-input-dimSend\" style=\"width:160px;\">\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueButton.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "relative_rotary": "<!-- Canonical private HUE Controller template: relative_rotary. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-rotate-right\"></i> <span data-i18n=\"knxUltimateHueTapDial.hue_device\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue Tap dial\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-tapdial-tabs\">\n    <ul>\n      <li><a href=\"#hue-tapdial-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueTapDial.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-tapdial-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueTapDial.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-tapdial-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueTapDial.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GArepeat\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GArepeat\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptrepeat\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptrepeat\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namerepeat\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namerepeat\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Rotation\">\n      </div>\n    </div>\n\n    <div id=\"hue-tapdial-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueTapDial.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueTapDial.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueTapDial.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueTapDial.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueTapDial.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "motion": "<!-- Canonical private HUE Controller template: motion. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-person-running\"></i> <span data-i18n=\"knxUltimateHueMotion.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue motion sensor\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-motion-tabs\">\n    <ul>\n      <li><a href=\"#hue-motion-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueMotion.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-motion-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueMotion.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-motion-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueMotion.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAmotion\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAmotion\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptmotion\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptmotion\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namemotion\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namemotion\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Motion state\">\n      </div>\n    </div>\n\n    <div id=\"hue-motion-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueMotion.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueMotion.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueMotion.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueMotion.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueMotion.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "area_motion": "<!-- Canonical private HUE Controller template: area_motion. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueAreaMotion.hue_area\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue motion area\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"tabsAreaMotion\">\n    <ul>\n      <li><a href=\"#tabsAreaMotion-1\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueAreaMotion.tabs.motion\"></span></a></li>\n      <li><a href=\"#tabsAreaMotion-2\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueAreaMotion.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"tabsAreaMotion-1\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueAreaMotion.motion_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAareaMotion\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAareaMotion\" placeholder=\"1/1/1\" style=\"width:70px; text-align:left;\">\n        <label for=\"node-input-dptAreaMotion\" style=\"width:32px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptAreaMotion\" style=\"width:110px;\"></select>\n        <label for=\"node-input-nameAreaMotion\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nameAreaMotion\" style=\"flex:1 1 100px; min-width:100px; max-width:100%; text-align:left;\" placeholder=\"Area occupancy\">\n      </div>\n    </div>\n\n    <div id=\"tabsAreaMotion-2\">\n      <div id=\"row-readStatusAtStartup\" class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueAreaMotion.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueAreaMotion.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueAreaMotion.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueAreaMotion.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"no\" data-i18n=\"knxUltimateHueAreaMotion.node_pins_hide\"></option>\n          <option value=\"yes\" data-i18n=\"knxUltimateHueAreaMotion.node_pins_show\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueAreaMotion.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "camera_motion": "<!-- Canonical private HUE Controller template: camera_motion. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueCameraMotion.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue camera motion\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"tabs\">\n    <ul>\n      <li><a href=\"#tabs-1\"><i class=\"fa fa-video\"></i> <span data-i18n=\"knxUltimateHueCameraMotion.tabs.motion\"></span></a></li>\n      <li><a href=\"#tabs-2\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueCameraMotion.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"tabs-1\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueCameraMotion.motion_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAcameraMotion\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAcameraMotion\" placeholder=\"1/1/1\" style=\"width:70px; text-align:left;\">\n        <label for=\"node-input-dptCameraMotion\" style=\"width:32px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptCameraMotion\" style=\"width:110px;\"></select>\n        <label for=\"node-input-nameCameraMotion\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nameCameraMotion\" style=\"flex:1 1 100px; min-width:100px; max-width:100%; text-align:left;\" placeholder=\"Motion hallway\">\n      </div>\n    </div>\n\n    <div id=\"tabs-2\">\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueCameraMotion.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueCameraMotion.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueCameraMotion.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueCameraMotion.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"no\" data-i18n=\"knxUltimateHueCameraMotion.node_pins_hide\"></option>\n          <option value=\"yes\" data-i18n=\"knxUltimateHueCameraMotion.node_pins_show\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueCameraMotion.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "contact": "<!-- Canonical private HUE Controller template: contact. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueContactSensor.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue contact sensor\" data-i18n=\"[placeholder]node-red-contrib-knx-ultimate/knxUltimateHueContactSensor:knxUltimateHueContactSensor.placeholders.device\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-contact-tabs\">\n    <ul>\n      <li><a href=\"#hue-contact-tab-mapping\"><i class=\"fa fa-door-open\"></i> <span data-i18n=\"knxUltimateHueContactSensor.tabs.mapping\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-contact-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueContactSensor.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAcontact\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAcontact\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptcontact\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptcontact\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namecontact\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namecontact\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Contact GA\" data-i18n=\"[placeholder]node-red-contrib-knx-ultimate/knxUltimateHueContactSensor:knxUltimateHueContactSensor.placeholders.contact_ga\">\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueContactSensor.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "light_level": "<!-- Canonical private HUE Controller template: light_level. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueLightSensor.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue light sensor\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-light-sensor-tabs\">\n    <ul>\n      <li><a href=\"#hue-light-sensor-tab-mapping\"><i class=\"fa fa-sun\"></i> <span data-i18n=\"knxUltimateHueLightSensor.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-light-sensor-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueLightSensor.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-light-sensor-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueLightSensor.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAlightsensor\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAlightsensor\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptlightsensor\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptlightsensor\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namelightsensor\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namelightsensor\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Light level\">\n      </div>\n    </div>\n\n    <div id=\"hue-light-sensor-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueLightSensor.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueLightSensor.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueLightSensor.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueLightSensor.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueLightSensor.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueLightSensor.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueLightSensor.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueLightSensor.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "temperature": "<!-- Canonical private HUE Controller template: temperature. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-temperature-half\"></i> <span data-i18n=\"knxUltimateHueTemperatureSensor.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue temperature sensor\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-temperature-tabs\">\n    <ul>\n      <li><a href=\"#hue-temperature-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueTemperatureSensor.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-temperature-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueTemperatureSensor.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-temperature-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueTemperatureSensor.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAtemperaturesensor\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAtemperaturesensor\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dpttemperaturesensor\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dpttemperaturesensor\" style=\"width:130px;\"></select>\n        <label for=\"node-input-nametemperaturesensor\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-nametemperaturesensor\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Temperature\">\n      </div>\n    </div>\n\n    <div id=\"hue-temperature-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueTemperatureSensor.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueTemperatureSensor.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueTemperatureSensor.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueTemperatureSensor.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueTemperatureSensor.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueTemperatureSensor.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueTemperatureSensor.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueTemperatureSensor.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "humidity": "<!-- Canonical private HUE Controller template: humidity. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tag\"></i> <span data-i18n=\"knxUltimateHueHumiditySensor.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue humidity sensor\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"tabs\">\n    <ul>\n      <li><a href=\"#tabs-1\"><i class=\"fa fa-tint\"></i> <span data-i18n=\"knxUltimateHueHumiditySensor.tabs.humidity\"></span></a></li>\n      <li><a href=\"#tabs-2\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueHumiditySensor.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"tabs-1\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueHumiditySensor.humidity_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAhumiditysensor\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAhumiditysensor\" placeholder=\"2/2/1\" style=\"width:70px; text-align:left;\">\n        <label for=\"node-input-dpthumiditysensor\" style=\"width:32px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dpthumiditysensor\" style=\"width:110px;\"></select>\n        <label for=\"node-input-namehumiditysensor\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namehumiditysensor\" style=\"flex:1 1 100px; min-width:100px; max-width:100%; text-align:left;\" placeholder=\"Humidity hall\">\n      </div>\n    </div>\n\n    <div id=\"tabs-2\">\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueHumiditySensor.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueHumiditySensor.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueHumiditySensor.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueHumiditySensor.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"no\" data-i18n=\"knxUltimateHueHumiditySensor.node_pins_hide\"></option>\n          <option value=\"yes\" data-i18n=\"knxUltimateHueHumiditySensor.node_pins_show\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueHumiditySensor.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "scene": "<!-- Canonical private HUE Controller template: scene. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <input type=\"hidden\" id=\"node-input-selectedModeTabNumber\">\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-play-circle\"></i> <span data-i18n=\"knxUltimateHueScene.hue_scene\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue scene\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-scene-tabs\">\n    <ul>\n      <li><a href=\"#hue-scene-tab-single\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueScene.tabs.single\"></span></a></li>\n      <li><a href=\"#hue-scene-tab-multi\"><i class=\"fa fa-list\"></i> <span data-i18n=\"knxUltimateHueScene.tabs.multi\"></span></a></li>\n      <li><a href=\"#hue-scene-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueScene.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-scene-tab-single\">\n      <div class=\"form-tips hue-form-tip hue-requires-bridge\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueScene.single_info\"></span>\n      </div>\n      <div class=\"form-row hue-requires-bridge\">\n        <label for=\"node-input-hueSceneRecallType\" style=\"width:220px;\">\n          <i class=\"fa fa-bolt\"></i> <span data-i18n=\"knxUltimateHueScene.recall_as\"></span>\n        </label>\n        <select id=\"node-input-hueSceneRecallType\" style=\"width:200px;\">\n          <option value=\"active\" data-i18n=\"knxUltimateHueScene.recall_active\"></option>\n          <option value=\"dynamic_palette\" data-i18n=\"knxUltimateHueScene.recall_dynamic\"></option>\n          <option value=\"static\" data-i18n=\"knxUltimateHueScene.recall_static\"></option>\n        </select>\n      </div>\n\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueScene.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAscene\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAscene\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptscene\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptscene\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namescene\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namescene\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Scene recall\">\n      </div>\n      <div class=\"form-row hue-knx-section\" id=\"divValScene\" style=\"display:none;\">\n        <label for=\"node-input-valscene\" style=\"width:70px;\">#</label>\n        <select id=\"node-input-valscene\" style=\"width:130px;\"></select>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAsceneStatus\" style=\"width:70px;\"><span data-i18n=\"knxUltimateHueScene.status_ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAsceneStatus\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptsceneStatus\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptsceneStatus\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namesceneStatus\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namesceneStatus\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Scene status\">\n      </div>\n    </div>\n\n    <div id=\"hue-scene-tab-multi\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueScene.multi_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAsceneMulti\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAsceneMulti\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptsceneMulti\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptsceneMulti\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namesceneMulti\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namesceneMulti\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Multi-scene\">\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label style=\"width:100%;\"><i class=\"fa fa-code-fork\"></i> <span data-i18n=\"knxUltimateHueScene.scene_selector\"></span></label>\n      </div>\n      <div class=\"form-row hue-knx-section node-input-rule-container-row\">\n        <ol id=\"node-input-rule-container\"></ol>\n      </div>\n    </div>\n\n    <div id=\"hue-scene-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueScene.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueScene.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueScene.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueScene.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueScene.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "device_power": "<!-- Canonical private HUE Controller template: device_power. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-battery-half\"></i> <span data-i18n=\"knxUltimateHueBattery.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue battery sensor\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-battery-tabs\">\n    <ul>\n      <li><a href=\"#hue-battery-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueBattery.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-battery-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueBattery.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-battery-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueBattery.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAbatterysensor\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAbatterysensor\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptbatterysensor\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptbatterysensor\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namebatterysensor\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namebatterysensor\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Battery level\">\n      </div>\n    </div>\n\n    <div id=\"hue-battery-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueBattery.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueBattery.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueBattery.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueBattery.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueBattery.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueBattery.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueBattery.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueBattery.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "zigbee_connectivity": "<!-- Canonical private HUE Controller template: zigbee_connectivity. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-tower-broadcast\"></i> <span data-i18n=\"knxUltimateHueZigbeeConnectivity.hue_sensor\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue zigbee connectivity\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-zigbee-connectivity-tabs\">\n    <ul>\n      <li><a href=\"#hue-zigbee-connectivity-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHueZigbeeConnectivity.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-zigbee-connectivity-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHueZigbeeConnectivity.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-zigbee-connectivity-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueZigbeeConnectivity.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAzigbeeconnectivity\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAzigbeeconnectivity\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptzigbeeconnectivity\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptzigbeeconnectivity\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namezigbeeconnectivity\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namezigbeeconnectivity\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Connectivity state\">\n      </div>\n    </div>\n\n    <div id=\"hue-zigbee-connectivity-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHueZigbeeConnectivity.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHueZigbeeConnectivity.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueZigbeeConnectivity.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueZigbeeConnectivity.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHueZigbeeConnectivity.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHueZigbeeConnectivity.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHueZigbeeConnectivity.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHueZigbeeConnectivity.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">",
    "device_software_update": "<!-- Canonical private HUE Controller template: device_software_update. -->\n<div class=\"form-row hue-legacy-controller-notice\" role=\"note\" style=\"box-sizing:border-box; padding:10px 12px; margin-bottom:14px; border-left:4px solid #d79b00; background:#fff8df; color:#4d3a00;\">\n    <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\" style=\"color:#a15c00; margin-right:6px;\"></i>\n    <span data-i18n=\"node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice\"></span>\n  </div>\n  <div class=\"form-row\" style=\"margin-bottom:10px;\">\n    <span style=\"color:#ff0000\"><i class=\"fa fa-youtube\"></i></span>&nbsp;<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E\"><b>KNX-Ultimate video tutorials (YouTube playlist)</b></a>\n  </div>\n  <div class=\"form-row\">\n    <label for=\"node-input-server\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKnRFWHRDcmVhdGlvbiBUaW1lAEZyIDYgQXVnIDIwMTAgMjE6NTI6MTkgKzAxMDD84aS8AAAAB3RJTUUH3gYYCicNV+4WIQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAACUSURBVHjaY2CgFZg5c+Z/ZEyWAZ8+f/6/ZsWs/xoamqMGkGrA6Wla/1+fVARjEBuGsSoGmY4eZSCNL59d/g8DIDbIAHR14OgFGQByKjIGKX5+6/T///8gGMQGiV1+/B0Fg70GIkD+RMYgxf/O5/7//2MSmAZhkBi6OrgB6Bg5DGB4ajr3f2xqsYYLSDE2THJUDg0AAAqyDVd4tp4YAAAAAElFTkSuQmCC\" />\n      <span data-i18n=\"common.knx_gw\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-server\">\n  </div>\n\n  <div class=\"form-row\">\n    <label for=\"node-input-serverHue\">\n      <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAABFUlEQVQ4EZWSsWoCQRCG1yiENEFEi6QSkjqWWoqFoBYJ+Br6JHkMn8Iibd4ihQpaJIhWNkry/ZtdGZY78Qa+m39nZ+dm9s4550awglNBluS/gVtAX6KgDclf68w2OThgfR9iT/jnoEv4TtByDThWTCDKW4SSZTf/zj9/eZbN+izTDuKGimu0vPF8B/YN8aC8LmcOj/AAn9CFTEs70Js/oGqy79C69bqJ5XbQI2kGO5N8QL9D08S8zBtBF5ZaVsznpCMoqJnVdjTpb1Db0fwIWmQV6BLXzFOYgA6/gDVfQN9bBWp2J2hdWDPoBV5FrKnAJutHikk/CHHR8i7x4iG7qQ720IYvu3GFbpHjx3pFrOFYkA354z/5bkK826phyAAAAABJRU5ErkJggg==\"/>\n      <span data-i18n=\"common.hue_bridge\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-serverHue\">\n  </div>\n\n  <div class=\"form-row hue-requires-bridge\">\n    <label for=\"node-input-name\">\n      <i class=\"fa fa-microchip\"></i> <span data-i18n=\"knxUltimateHuedevice_software_update.hue_device\"></span>\n    </label>\n    <input type=\"text\" id=\"node-input-name\" placeholder=\"Hue device\" style=\"flex:1 1 240px; min-width:240px; max-width:240px;\">\n    <button type=\"button\" class=\"red-ui-button hue-refresh-devices\" style=\"margin-left:6px; color:#1b7d33; border-color:#1b7d33;\">\n      <i class=\"fa fa-sync\"></i>\n    </button>\n    <span class=\"hue-devices-loading\" style=\"margin-left:6px; display:none; color:#1b7d33;\">\n      <i class=\"fa fa-circle-notch fa-spin\"></i>\n    </span>\n  </div>\n\n  <div id=\"hue-device-sw-tabs\">\n    <ul>\n      <li><a href=\"#hue-device-sw-tab-mapping\"><i class=\"fa fa-map\"></i> <span data-i18n=\"knxUltimateHuedevice_software_update.tabs.mapping\"></span></a></li>\n      <li><a href=\"#hue-device-sw-tab-behaviour\"><i class=\"fa fa-gear\"></i> <span data-i18n=\"knxUltimateHuedevice_software_update.tabs.behaviour\"></span></a></li>\n    </ul>\n\n    <div id=\"hue-device-sw-tab-mapping\">\n      <div class=\"form-tips hue-form-tip hue-knx-section\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHuedevice_software_update.mapping_info\"></span>\n      </div>\n      <div class=\"form-row hue-knx-section\">\n        <label for=\"node-input-GAdevice_software_update\" style=\"width:70px;\"><span data-i18n=\"common.ga\"></span></label>\n        <input type=\"text\" id=\"node-input-GAdevice_software_update\" placeholder=\"1/1/1\" style=\"width:80px; text-align:left;\">\n        <label for=\"node-input-dptdevice_software_update\" style=\"width:40px; text-align:right;\"><span data-i18n=\"common.dpt\"></span></label>\n        <select id=\"node-input-dptdevice_software_update\" style=\"width:130px;\"></select>\n        <label for=\"node-input-namedevice_software_update\" style=\"width:50px; text-align:right;\"><span data-i18n=\"common.name\"></span></label>\n        <input type=\"text\" id=\"node-input-namedevice_software_update\" style=\"flex:1 1 140px; min-width:120px; text-align:left;\" placeholder=\"Update status\">\n      </div>\n    </div>\n\n    <div id=\"hue-device-sw-tab-behaviour\">\n      <div class=\"form-tips hue-form-tip\">\n        <i class=\"fa fa-circle-info\"></i>\n        <span data-i18n=\"knxUltimateHuedevice_software_update.behaviour_info\"></span>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-readStatusAtStartup\" style=\"width:220px;\">\n          <i class=\"fa fa-question-circle\"></i> <span data-i18n=\"knxUltimateHuedevice_software_update.read_status_startup\"></span>\n        </label>\n        <select id=\"node-input-readStatusAtStartup\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHuedevice_software_update.opt_yes_emit\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHuedevice_software_update.opt_no\"></option>\n        </select>\n      </div>\n      <div class=\"form-row\">\n        <label for=\"node-input-enableNodePINS\" style=\"width:220px;\">\n          <i class=\"fa fa-code\"></i> <span data-i18n=\"knxUltimateHuedevice_software_update.node_pins\"></span>\n        </label>\n        <select id=\"node-input-enableNodePINS\" style=\"width:200px;\">\n          <option value=\"yes\" data-i18n=\"knxUltimateHuedevice_software_update.node_pins_show\"></option>\n          <option value=\"no\" data-i18n=\"knxUltimateHuedevice_software_update.node_pins_hide\"></option>\n        </select>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-tips hue-form-tip hue-output-info\" style=\"display:none;\">\n    <i class=\"fa fa-circle-info\"></i>\n    <span data-i18n=\"knxUltimateHuedevice_software_update.output_info\"></span>\n  </div>\n\n  <input type=\"hidden\" id=\"node-input-hueDevice\">"
  }

  // All supported locales travel with the Controller. The bundle therefore
  // keeps working after the legacy locale files and node types are removed.
  const PROFILE_TRANSLATIONS = {"en":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"Hue node","node-input-name":"Name","node-input-nameLightSwitch":"Switch (bit)","node-input-GALightSwitch":"GA","node-input-dptLightSwitch":"dpt","node-input-nameLightState":"State (bit)","node-input-GALightState":"GA","node-input-dptLightState":"dpt","node-input-hueLight":"Hue light","paletteLabel":"Hue Light/Outlet","no_devices":"No Hue devices found. Click refresh after pairing a new light.","tabs":{"switch":"Switch","dim":"Dim","tunable_white":"Tunable white","rgb_hsv":"RGB/HSV","effects":"Effects","behaviour":"Behaviour"},"control":"Control","status":"Status","night_lighting":"Night Lighting","no_night_lighting":"No night lighting","get_current":"Get current","get_again":"Get again","wait":"Wait...","connection_wait":"Waiting for the Hue Bridge to finish connecting...","connection_timeout":"The Hue Bridge is not ready yet. Check its configuration, deploy and retry.","editor_init_error":"HUE editor error during {{stage}}: {{error}}","locate_no_bridge":"Select a Hue bridge first","locate_no_device":"Select a Hue device first","locate_success":"Locate command sent","locate_started":"Locate mode started. Press again to stop (auto-stops after 10 minutes).","locate_stopped":"Locate mode stopped.","locate_start_title":"Locate selected Hue device","locate_stop_title":"Stop locate mode","locate_error":"Unable to locate Hue device","day_night":"Day/Night","invert_day_night":"Invert day/night value","override_night_mode":"Force day mode","override_no":"No","override_set_day_fast_this":"Switch to DAY mode by rapid switching the light off then on (this light only)","override_set_day_fast_all":"Switch to DAY mode by rapid switching the light off then on (apply to ALL light nodes)","node_pins":"Node Input/Output PINs","node_pins_hide":"Hide","node_pins_show":"Show node input/output PINs","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","knx_brightness_status":"KNX Brightness Status","knx_brightness_onhueoff":"When Hue light is Off send 0%. When Hue On, restore previous value (Default KNX behaviour)","knx_brightness_no":"Leave as is (default Hue behaviour)","update_local_state_from_knx_write":"Update local cached Hue state from KNX bus writes","update_local_state_from_knx_write_hint":"Enabled: faster local reactions and consistent immediate KNX read responses. Disabled: keep the cache aligned only with real Hue bridge events.","use_min_brightness":"Use minimum brightness specified in the Hue light","k_suffix":"K","temp_desc_2200":"(start of Philips White Ambiance lights range)","temp_desc_2700":"(warm white, intimate, cozy, personal, for living rooms)","temp_desc_3000":"(soft white, warm, calming, for bathrooms and kitchens)","temp_desc_3500_day":"(neutral white, balanced, friendly, inviting, for office spaces and retail)","temp_desc_3500_night":"(not recommended for night time - neutral white, for office spaces and retail)","temp_desc_4100_day":"(cool white, precise, clean, focused, for garages and grocery stores)","temp_desc_4100_night":"(not recommended for night time - cool white, precise, clean, focused, for garages and grocery stores)","temp_desc_5000_day":"(bright white, vibrant, crisp, for warehouses, sports stadiums and healthcare)","temp_desc_5000_night":"(not recommended for night time - bright white, vibrant, crisp, for warehouses, sports stadiums and healthcare)","temp_desc_6500_day":"(daylight, alert, energetic, for indoor agriculture)","temp_desc_6500_night":"(not recommended for night time - daylight, alert, energetic, for indoor agriculture)","switch_on_behaviour":"Switch on behaviour","none":"None","switch_off":"(Switch Off)","select_color":"Select color","select_temperature_brightness":"Select temperature and brightness","select_brightness":"Select brightness","effect_command":"Effect command","effect_status":"Effect status","effect_mapping":"Mappings","effect_autofill":"Fill with available effects","effect_tip":"Provide KNX value / Hue effect pairs. When the incoming KNX payload matches the value, the selected effect is applied to the light.","effect_tip_status":"If a status group address is configured, the current Hue effect is emitted using the mapped KNX value or the effect name.","effect_not_supported":"This light does not expose Hue effects.","effect_knx_value_placeholder":"Value to match","effect_base_label":"Non-Hue basic effects","effect_native_label":"Hue native effects"},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"Hue Plug/Outlet","paletteLabel":"Hue Plug/Outlet","tabs":{"switch":"Switch","behaviour":"Behaviour"},"node-input-name":"Name","switch_info":"Link your KNX switch address to control the Hue plug on/off state.","switch_control":"Control","switch_status":"Status","power_state":"Power state","power_state_info":"Optional. Track the Hue-reported power state (on/standby) on a KNX group address.","read_status_startup":"Read status at startup","opt_yes_emit":"Yes, and emit KNX telegrams.","opt_no":"No","node_pins":"Node Input/Output PINs","node_pins_hide":"Hide","node_pins_show":"Show node input/output PINs","node_pins_help":"Enable Node-RED input/output pins to send custom Hue API payloads or forward events to your flow."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Hue Button","hue_sensor":"Hue Button","no_devices":"No Hue buttons available","tabs":{"switch":"Switch","dim":"Dim","behaviour":"Behaviour"},"switch_info":"Link the KNX group address triggered by short presses.","switch_status":"Status GA","dim_info":"Configure the KNX dimming GA that handles repeat events during long presses.","behaviour_info":"Select whether events toggle values automatically or send fixed payloads.","toggle_values":"Toggle values on each event","toggle_values_hint":"Enable to alternate true/false and dim up/down; disable to send fixed payloads defined below.","switch_send":"Switch payload","dim_send":"Dim payload","dim_up":"Up","dim_down":"Down","dim_stop":"Stop","output_info":"No KNX gateway selected. Events are still emitted on the Node-RED output pin."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"Hue Tap Dial node (rotary)","paletteLabel":"Hue Tap Dial","hue_device":"Hue Tap Dial","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Link the Hue Tap Dial rotation events to a KNX group address.","behaviour_info":"Decide whether the Node-RED output pin should remain visible when KNX delivery is disabled.","node_pins":"Node input/output pins","node_pins_hide":"Hide pins","node_pins_show":"Show node input/output pins","output_info":"Without a KNX gateway the flow output stays enabled so Hue events continue to reach Node-RED.","no_devices":"No Hue Tap Dial devices found. Use the refresh icon after pairing a new dial."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueMotion":{"paletteLabel":"Hue Motion","hue_sensor":"Hue motion sensor","no_devices":"No motion sensors available","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Link the KNX group address that should receive the motion detected state.","behaviour_info":"Toggle the Node-RED output pin when you want to process Hue motion events in a flow without KNX.","node_pins":"Node output pin","node_pins_show":"Show Node-RED output pin","node_pins_hide":"Hide","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue motion events are still emitted to your flow."}},"knxUltimateHueAreaMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueAreaMotion":{"paletteLabel":"Hue Motion Area","heading":"Hue Motion Area node","hue_area":"Hue Motion Area","no_devices":"No MotionAware areas available","tabs":{"motion":"Motion","behaviour":"Behaviour"},"node_pins":"Node output pin","node_pins_hide":"Hide","node_pins_show":"Show Node-RED output pin","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, MotionAware area motion events are still emitted to your flow.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","motion_info":"Link your KNX group address to receive the aggregated motion state for this MotionAware area."}},"knxUltimateHueCameraMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueCameraMotion":{"paletteLabel":"Hue Camera Motion","heading":"Hue Camera Motion node","hue_sensor":"Hue Camera Motion","no_devices":"No camera motion devices available","tabs":{"motion":"Motion","behaviour":"Behaviour"},"node_pins":"Node output pin","node_pins_hide":"Hide","node_pins_show":"Show Node-RED output pin","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue camera motion events are still emitted to your flow.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","motion_info":"Link your KNX motion group address to receive the detected/not detected state."}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Hue Contact Sensor","hue_sensor":"Hue Contact Sensor","no_devices":"No Hue contact sensors available","placeholders":{"device":"Hue contact sensor","contact_ga":"Contact GA name"},"tabs":{"mapping":"Mapping"},"mapping_info":"Link the KNX GA that should receive contact state updates.","output_info":"No KNX gateway selected. Contact events are still emitted on the Node-RED output pin."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"Hue Light Sensor node","paletteLabel":"Hue Light Sensor","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Hue Temperature Sensor","hue_sensor":"Hue temperature sensor","no_devices":"No temperature sensors available","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Link the KNX group address that should emit the temperature value.","behaviour_info":"Configure how the sensor reads at startup and whether to expose the Node-RED output pin.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","node_pins":"Node output pin","node_pins_show":"Show Node-RED output pin","node_pins_hide":"Hide","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue temperature values are still emitted to your flow."}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Hue Humidity Sensor","heading":"Hue Humidity Sensor node","hue_sensor":"Hue Sensor","no_devices":"No devices available","tabs":{"humidity":"Humidity","behaviour":"Behaviour"},"humidity_info":"Link your KNX humidity group address to receive the relative humidity (%).","node_pins":"Node output pin","node_pins_hide":"Hide","node_pins_show":"Show Node-RED output pin","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue events are still emitted to your flow.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"Hue Scene node","paletteLabel":"Hue Scene","hue_scene":"Hue Scene","recall_as":"Recall as","recall_active":"Recall as Active","recall_dynamic":"Recall as Dynamic","recall_static":"Recall as Static","recall":"Recall","status":"Status","scene_selector":"Scene selector","knx_scene_n":"KNX Scene n.","node_pins":"Node input/output pins","node_pins_hide":"Hide pins","node_pins_show":"Show node input/output pins","tabs":{"single":"Single scene","multi":"Multi scene","behaviour":"Behaviour"},"single_info":"Select the Hue scene and choose how it should be recalled when the KNX address is triggered.","mapping_info":"Map the KNX addresses that recall the scene or report its current state.","multi_info":"Associate KNX scene numbers with Hue scenes. Each rule recalls a different Hue scene.","behaviour_info":"Decide whether the Node-RED output pin should remain visible when KNX delivery is disabled.","status_ga":"Status GA","output_info":"Without a KNX gateway the flow output stays enabled so Hue events continue to reach Node-RED.","no_scenes":"No Hue scenes found. Use the refresh icon after adding new scenes.","multi_scene_placeholder":"Hue scene name"},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}},"knxUltimateHueBattery":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueBattery":{"paletteLabel":"Hue Battery Sensor","hue_sensor":"Hue battery sensor","no_devices":"No battery devices available","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Link the KNX group address that should emit the battery percentage.","behaviour_info":"Configure how the sensor behaves at startup and whether to expose the Node-RED output pin.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","node_pins":"Node output pin","node_pins_show":"Show Node-RED output pin","node_pins_hide":"Hide","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue battery events are still emitted to your flow."}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Hue Zigbee Connectivity","hue_sensor":"Hue zigbee connectivity","no_devices":"No zigbee connectivity devices available","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Link the KNX group address that should reflect the Zigbee connectivity state.","behaviour_info":"Choose whether to read the connectivity state at startup and expose the Node-RED output pin.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams.","node_pins":"Node output pin","node_pins_show":"Show Node-RED output pin","node_pins_hide":"Hide","output_info":"No KNX gateway selected. When the Node-RED output pin is enabled, Hue connectivity events are still emitted to your flow."}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Hue Software Update","hue_device":"Hue device","tabs":{"mapping":"Mapping","behaviour":"Behaviour"},"mapping_info":"Map the KNX address that reports the software-update status.","behaviour_info":"Control startup reads and the Node-RED output pin visibility.","node_pins":"Node input/output pins","node_pins_hide":"Hide pins","node_pins_show":"Show node input/output pins","output_info":"Without a KNX gateway the flow output stays enabled so Hue events continue to reach Node-RED.","no_devices":"No Hue devices found. Use the refresh icon after adding a new device.","read_status_startup":"Read status at startup","opt_no":"No","opt_yes_emit":"Yes, and emit KNX telegrams."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"Youtube sample","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Read"}}},"it":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"Nodo HUE","node-input-name":"Nome","node-input-nameLightSwitch":"Switch (bit)","node-input-GALightSwitch":"GA","node-input-dptLightSwitch":"dpt","node-input-nameLightState":"Stato (bit)","node-input-GALightState":"GA","node-input-dptLightState":"dpt","node-input-hueLight":"Luce HUE","paletteLabel":"Hue Luce/Prese","no_devices":"Nessuna luce Hue trovata. Usa il refresh dopo aver associato una nuova luce.","tabs":{"switch":"On/Off","dim":"Dimmer","tunable_white":"Bianco regolabile","rgb_hsv":"RGB/HSV","effects":"Effetti","behaviour":"Comportamento"},"control":"Comando","status":"Stato","night_lighting":"Illuminazione notturna","no_night_lighting":"Nessuna illuminazione notturna","get_current":"Ottieni corrente","get_again":"Ottieni di nuovo","wait":"Attendere...","connection_wait":"Attendo che Hue Bridge completi la connessione...","connection_timeout":"Hue Bridge non è ancora pronto. Controlla la configurazione, fai il deploy e riprova.","editor_init_error":"Errore dell'editor HUE durante {{stage}}: {{error}}","locate_no_bridge":"Seleziona prima un bridge Hue","locate_no_device":"Seleziona prima un dispositivo Hue","locate_success":"Comando di localizzazione inviato","locate_started":"Modalità di localizzazione avviata. Premi di nuovo per fermarla (si ferma automaticamente dopo 10 minuti).","locate_stopped":"Modalità di localizzazione terminata.","locate_start_title":"Localizza il dispositivo Hue selezionato","locate_stop_title":"Ferma la modalità di localizzazione","locate_error":"Impossibile localizzare il dispositivo Hue","day_night":"Giorno/Notte","invert_day_night":"Inverti valore giorno/notte","override_night_mode":"Forza modalità diurna","override_no":"No","override_set_day_fast_this":"Passa a GIORNO spegnendo e riaccendendo velocemente (solo questa luce)","override_set_day_fast_all":"Passa a GIORNO spegnendo e riaccendendo velocemente (tutte le luci)","node_pins":"PIN di Input/Output del nodo","node_pins_hide":"Nascondi","node_pins_show":"Mostra PIN di input/output","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","knx_brightness_status":"Stato luminosità KNX","knx_brightness_onhueoff":"Se la luce HUE è spenta invia 0%. Se è accesa, ripristina il valore precedente (Comportamento KNX predefinito)","knx_brightness_no":"Lascia invariato (comportamento HUE predefinito)","update_local_state_from_knx_write":"Aggiorna lo stato HUE locale in cache dai write provenienti dal bus KNX","update_local_state_from_knx_write_hint":"Abilitato: reazioni locali piu rapide e risposte immediate ai read KNX piu coerenti. Disabilitato: la cache si aggiorna solo dagli eventi reali del bridge Hue.","use_min_brightness":"Usa la luminosità minima specificata nella luce HUE","k_suffix":"K","temp_desc_2200":"(inizio della gamma Philips White Ambiance)","temp_desc_2700":"(bianco caldo, intimo, accogliente, personale, per soggiorni)","temp_desc_3000":"(bianco tenue, caldo, rilassante, per bagni e cucine)","temp_desc_3500_day":"(bianco neutro, equilibrato, amichevole, invitante, per uffici e negozi)","temp_desc_3500_night":"(sconsigliato di notte - bianco neutro, per uffici e negozi)","temp_desc_4100_day":"(bianco freddo, preciso, pulito, focalizzato, per garage e supermercati)","temp_desc_4100_night":"(sconsigliato di notte - bianco freddo, preciso, pulito, focalizzato, per garage e supermercati)","temp_desc_5000_day":"(bianco brillante, vivace, nitido, per magazzini, stadi e sanità)","temp_desc_5000_night":"(sconsigliato di notte - bianco brillante, vivace, nitido, per magazzini, stadi e sanità)","temp_desc_6500_day":"(luce diurna, allerta, energizzante, per agricoltura indoor)","temp_desc_6500_night":"(sconsigliato di notte - luce diurna, allerta, energizzante, per agricoltura indoor)","switch_on_behaviour":"Comportamento all'accensione","none":"Nessuno","switch_off":"(Spegni)","select_color":"Seleziona colore","select_temperature_brightness":"Seleziona temperatura e luminosità","select_brightness":"Seleziona luminosità","effect_command":"Comando effetti","effect_status":"Stato effetti","effect_mapping":"Associazioni","effect_autofill":"Compila con gli effetti disponibili","effect_tip":"Definisci le coppie valore KNX / effetto Hue. Quando il valore KNX ricevuto coincide, viene attivato l'effetto selezionato.","effect_tip_status":"Se configuri lo stato, il nodo invierà su KNX l'effetto corrente (valore associato o nome).","effect_not_supported":"Questa lampada non espone effetti Hue.","effect_knx_value_placeholder":"Valore da confrontare","effect_base_label":"Effetti base non HUE","effect_native_label":"Effetti nativi HUE"},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"Presa/Plug HUE","paletteLabel":"Hue Plug/Outlet","tabs":{"switch":"On/Off","behaviour":"Comportamento"},"node-input-name":"Nome","switch_info":"Collega l'indirizzo KNX per comandare accensione e spegnimento della presa Hue.","switch_control":"Comando","switch_status":"Stato","power_state":"Power state","power_state_info":"Opzionale. Traccia lo stato di alimentazione restituito da Hue (on/standby) su un indirizzo KNX.","read_status_startup":"Leggi stato all'avvio","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","opt_no":"No","node_pins":"PIN di Input/Output del nodo","node_pins_hide":"Nascondi","node_pins_show":"Mostra PIN di input/output","node_pins_help":"Abilita i pin di input/output per inviare payload Hue personalizzati o propagare gli eventi al flow."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Pulsante Hue","hue_sensor":"Pulsante Hue","no_devices":"Nessun pulsante Hue disponibile","tabs":{"switch":"Interruttore","dim":"Dimmer","behaviour":"Comportamento"},"switch_info":"Collega la GA KNX attivata da una pressione breve.","switch_status":"GA stato","dim_info":"Configura la GA KNX per il dimming durante le pressioni prolungate.","behaviour_info":"Scegli se alternare automaticamente i valori o inviare payload fissi.","toggle_values":"Alterna i valori ad ogni evento","toggle_values_hint":"Abilitando alterni true/false e direzioni di dimmer; disabilitando invii i payload fissi definiti sotto.","switch_send":"Payload interruttore","dim_send":"Payload dimmer","dim_up":"Su","dim_down":"Giù","dim_stop":"Stop","output_info":"Nessun gateway KNX selezionato. Gli eventi vengono comunque emessi sul pin di output di Node-RED."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"Nodo Hue Tap Dial (rotary)","paletteLabel":"Hue Tap Dial","hue_device":"Hue Tap Dial","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Collega gli eventi di rotazione del Tap Dial alle GA KNX.","behaviour_info":"Decidi se mantenere visibile il pin di output di Node-RED quando la consegna KNX è disattivata.","node_pins":"PIN di input/output del nodo","node_pins_hide":"Nascondi PIN","node_pins_show":"Mostra i PIN di input/output","output_info":"Senza gateway KNX l'uscita verso il flow rimane attiva per ricevere gli eventi Hue.","no_devices":"Nessun dispositivo Hue Tap Dial trovato. Usa l'icona di aggiornamento dopo averne associato uno nuovo."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueMotion":{"paletteLabel":"Sensore movimento Hue","hue_sensor":"Sensore movimento Hue","no_devices":"Nessun sensore di movimento disponibile","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Collega l'indirizzo di gruppo KNX che deve ricevere lo stato di movimento rilevato.","behaviour_info":"Gestisci il pin di uscita Node-RED quando vuoi elaborare gli eventi di movimento Hue senza KNX.","node_pins":"Pin di uscita del nodo","node_pins_show":"Mostra il pin di uscita Node-RED","node_pins_hide":"Nascondi","output_info":"Nessun gateway KNX selezionato. Quando il pin di uscita Node-RED è abilitato, gli eventi di movimento Hue continuano ad essere inviati al flow."}},"knxUltimateHueAreaMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueAreaMotion":{"paletteLabel":"Area movimento Hue","heading":"Nodo Area movimento Hue","hue_area":"Area movimento Hue (MotionAware)","no_devices":"Nessuna area MotionAware disponibile","tabs":{"motion":"Movimento","behaviour":"Comportamento"},"node_pins":"Pin di uscita del nodo","node_pins_hide":"Nascondi","node_pins_show":"Mostra il pin di uscita Node-RED","output_info":"Nessun gateway KNX selezionato. Quando il pin di uscita Node-RED è abilitato, gli eventi di movimento dell'area MotionAware continuano ad essere inviati al flow.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","motion_info":"Collega l'indirizzo di gruppo KNX che deve ricevere lo stato di movimento aggregato per quest'area MotionAware."}},"knxUltimateHueCameraMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueCameraMotion":{"paletteLabel":"Motion camera Hue","heading":"Nodo motion camera HUE","hue_sensor":"Motion camera HUE","no_devices":"Nessuna camera motion disponibile","tabs":{"motion":"Movimento","behaviour":"Comportamento"},"node_pins":"Pin di output","node_pins_hide":"Nascondi","node_pins_show":"Mostra il pin di output Node-RED","output_info":"Nessun gateway KNX selezionato. Se il pin di output Node-RED è abilitato, gli eventi motion della Hue vengono comunque inviati al flow.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","motion_info":"Collega il GA KNX per ricevere lo stato di movimento (rilevato/non rilevato)."}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Sensore contatto Hue","hue_sensor":"Sensore contatto Hue","no_devices":"Nessun sensore contatto Hue disponibile","placeholders":{"device":"Sensore contatto Hue","contact_ga":"Nome GA contatto"},"tabs":{"mapping":"Associazione"},"mapping_info":"Collega la GA KNX che deve ricevere lo stato del contatto.","output_info":"Nessun gateway KNX selezionato. Gli eventi vengono comunque emessi sul pin di output di Node-RED."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"Nodo Sensore Luce HUE","paletteLabel":"Sensore luce Hue","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Sensore temperatura Hue","hue_sensor":"Sensore temperatura Hue","no_devices":"Nessun sensore di temperatura disponibile","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Collega l'indirizzo di gruppo KNX che deve inviare il valore di temperatura.","behaviour_info":"Configura il comportamento all'avvio e la visibilità del pin di uscita Node-RED.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","node_pins":"Pin di uscita del nodo","node_pins_show":"Mostra il pin di uscita Node-RED","node_pins_hide":"Nascondi","output_info":"Nessun gateway KNX selezionato. Quando il pin di uscita Node-RED è abilitato, il sensore temperatura Hue continuerà a inviare i valori nel flow."}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Sensore umidità Hue","heading":"Nodo sensore umidità HUE","hue_sensor":"Sensore HUE","no_devices":"Non ci sono apparecchi da visualizzare","tabs":{"humidity":"Umidità","behaviour":"Comportamento"},"humidity_info":"Collega il GA KNX per ricevere la misura di umidità relativa (%).","node_pins":"Pin di output","node_pins_hide":"Nascondi","node_pins_show":"Mostra il pin di output Node-RED","output_info":"Nessun gateway KNX selezionato. Se il pin di output Node-RED è abilitato, gli eventi Hue vengono comunque inviati al flow.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"Nodo Scena HUE","paletteLabel":"Hue Scena","hue_scene":"Scena HUE","recall_as":"Richiama come","recall_active":"Richiama come Attiva","recall_dynamic":"Richiama come Dinamica","recall_static":"Richiama come Statica","recall":"Richiama","status":"Stato","scene_selector":"Selettore scena","knx_scene_n":"Scena KNX n.","node_pins":"PIN di input/output del nodo","node_pins_hide":"Nascondi PIN","node_pins_show":"Mostra i PIN di input/output","tabs":{"single":"Scena singola","multi":"Multi scena","behaviour":"Comportamento"},"single_info":"Seleziona la scena Hue e scegli come richiamarla quando viene attivato l'indirizzo KNX.","mapping_info":"Mappa gli indirizzi KNX che richiamano la scena o ne riportano lo stato attuale.","multi_info":"Associa i numeri scena KNX alle scene Hue. Ogni regola richiama una scena diversa.","behaviour_info":"Decidi se mantenere visibile il pin di output di Node-RED quando la consegna KNX è disattivata.","status_ga":"GA stato","output_info":"Senza gateway KNX l'uscita verso il flow rimane attiva per continuare a ricevere gli eventi Hue.","no_scenes":"Nessuna scena Hue trovata. Usa l'icona di aggiornamento dopo averne aggiunte di nuove.","multi_scene_placeholder":"Nome scena Hue"},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}},"knxUltimateHueBattery":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueBattery":{"paletteLabel":"Sensore batteria Hue","hue_sensor":"Sensore batteria Hue","no_devices":"Nessun dispositivo batteria disponibile","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Collega l'indirizzo di gruppo KNX che deve inviare la percentuale della batteria.","behaviour_info":"Configura il comportamento all'avvio e la visibilità del pin di uscita Node-RED.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","node_pins":"Pin di uscita del nodo","node_pins_show":"Mostra il pin di uscita Node-RED","node_pins_hide":"Nascondi","output_info":"Nessun gateway KNX selezionato. Quando il pin di uscita Node-RED è abilitato, il sensore batteria Hue continuerà a inviare eventi nel flow."}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Connettività Zigbee Hue","hue_sensor":"Connettività Zigbee Hue","no_devices":"Nessun dispositivo di connettività Zigbee disponibile","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Collega l'indirizzo di gruppo KNX che deve rappresentare lo stato della connettività Zigbee.","behaviour_info":"Decidi se leggere lo stato all'avvio e se mantenere visibile il pin di uscita Node-RED.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX.","node_pins":"Pin di uscita del nodo","node_pins_show":"Mostra il pin di uscita Node-RED","node_pins_hide":"Nascondi","output_info":"Nessun gateway KNX selezionato. Quando il pin di uscita Node-RED è abilitato, gli eventi di connettività Hue continuano a essere inviati nel flow."}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Aggiornamento software Hue","hue_device":"Dispositivo Hue","tabs":{"mapping":"Mappatura","behaviour":"Comportamento"},"mapping_info":"Mappa la GA KNX che segnala lo stato dell'aggiornamento software.","behaviour_info":"Configura la lettura all'avvio e la visibilità del pin di output di Node-RED.","node_pins":"PIN di input/output del nodo","node_pins_hide":"Nascondi PIN","node_pins_show":"Mostra i PIN di input/output","output_info":"Senza gateway KNX l'uscita verso il flow rimane attiva per continuare a ricevere gli eventi Hue.","no_devices":"Nessun dispositivo Hue trovato. Usa l'icona di aggiornamento dopo averne aggiunto uno nuovo.","read_status_startup":"Leggi lo stato all'avvio","opt_no":"No","opt_yes_emit":"Sì, ed emetti i telegrammi KNX."},"common":{"ga":"GA","dpt":"DPT","name":"Nome","youtube_sample":"Esempio YouTube","knx_gw":"Gateway KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Leggi"}}},"de":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"HUE node","node-input-name":"Name","node-input-nameLightSwitch":"Switch (bit)","node-input-GALightSwitch":"GA","node-input-dptLightSwitch":"dpt","node-input-nameLightState":"State (bit)","node-input-GALightState":"GA","node-input-dptLightState":"dpt","node-input-hueLight":"HUE light","paletteLabel":"Hue Licht/Steckdose","no_devices":"Keine Hue-Leuchten gefunden. Verwenden Sie das Refresh-Symbol, nachdem eine neue Lampe gekoppelt wurde.","tabs":{"switch":"Schalten","dim":"Dimmen","tunable_white":"Einstellbares Weiß","rgb_hsv":"RGB/HSV","effects":"Effekte","behaviour":"Verhalten"},"control":"Steuerung","status":"Status","night_lighting":"Nachtbeleuchtung","no_night_lighting":"Keine Nachtbeleuchtung","get_current":"Aktuellen Wert holen","get_again":"Erneut holen","wait":"Bitte warten...","connection_wait":"Warten, bis die Hue Bridge die Verbindung hergestellt hat...","connection_timeout":"Die Hue Bridge ist noch nicht bereit. Konfiguration prüfen, deployen und erneut versuchen.","editor_init_error":"Fehler im HUE-Editor während {{stage}}: {{error}}","locate_no_bridge":"Bitte zuerst eine Hue-Bridge auswählen","locate_no_device":"Bitte zuerst ein Hue-Gerät auswählen","locate_success":"Locate-Befehl gesendet","locate_started":"Locate-Modus gestartet. Nochmal drücken, um zu stoppen (automatisch nach 10 Minuten).","locate_stopped":"Locate-Modus beendet.","locate_start_title":"Ausgewähltes Hue-Gerät lokalisieren","locate_stop_title":"Locate-Modus beenden","locate_error":"Hue-Gerät konnte nicht lokalisiert werden","day_night":"Tag/Nacht","invert_day_night":"Tag/Nacht-Wert invertieren","override_night_mode":"Tagmodus erzwingen","override_no":"Nein","override_set_day_fast_this":"In den TAG-Modus wechseln durch schnelles Aus/Ein (nur dieses Licht)","override_set_day_fast_all":"In den TAG-Modus wechseln durch schnelles Aus/Ein (alle Lichter)","node_pins":"Node Ein-/Ausgangs-PINs","node_pins_hide":"Ausblenden","node_pins_show":"Ein-/Ausgangs-PINs anzeigen","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","knx_brightness_status":"KNX Helligkeitsstatus","knx_brightness_onhueoff":"Wenn HUE aus: 0% senden. Wenn HUE an: vorherigen Wert wiederherstellen (Standard KNX Verhalten)","knx_brightness_no":"Unverändert lassen (Standard HUE Verhalten)","update_local_state_from_knx_write":"Lokalen Hue-Cache durch KNX-Bus-Schreibtelegramme aktualisieren","update_local_state_from_knx_write_hint":"Aktiviert: schnellere lokale Reaktionen und konsistentere sofortige KNX-Leseantworten. Deaktiviert: Cache nur durch echte Hue-Bridge-Ereignisse aktualisieren.","use_min_brightness":"Minimale Helligkeit der HUE Lampe verwenden","k_suffix":"K","temp_desc_2200":"(Beginn der Philips White Ambiance Reihe)","temp_desc_2700":"(Warmweiß, intim, gemütlich, persönlich, für Wohnzimmer)","temp_desc_3000":"(Softweiß, warm, beruhigend, für Bad und Küche)","temp_desc_3500_day":"(Neutralweiß, ausgewogen, freundlich, einladend, für Büros und Einzelhandel)","temp_desc_3500_night":"(für Nacht nicht empfohlen – Neutralweiß, für Büros und Einzelhandel)","temp_desc_4100_day":"(Kaltweiß, präzise, sauber, fokussiert, für Garagen und Supermärkte)","temp_desc_4100_night":"(für Nacht nicht empfohlen – Kaltweiß, präzise, sauber, fokussiert, für Garagen und Supermärkte)","temp_desc_5000_day":"(Hellweiß, lebhaft, klar, für Lager, Stadien und Gesundheitswesen)","temp_desc_5000_night":"(für Nacht nicht empfohlen – Hellweiß, lebhaft, klar, für Lager, Stadien und Gesundheitswesen)","temp_desc_6500_day":"(Tageslicht, wach, energiegeladen, für Indoor-Landwirtschaft)","temp_desc_6500_night":"(für Nacht nicht empfohlen – Tageslicht, wach, energiegeladen, für Indoor-Landwirtschaft)","switch_on_behaviour":"Verhalten beim Einschalten","none":"Kein","switch_off":"(Ausschalten)","select_color":"Farbe auswählen","select_temperature_brightness":"Temperatur und Helligkeit auswählen","select_brightness":"Helligkeit auswählen","effect_command":"Effekt-Befehl","effect_status":"Effekt-Status","effect_mapping":"Zuordnungen","effect_autofill":"Mit verfügbaren Effekten füllen","effect_tip":"Hinterlege KNX-Wert/Hue-Effekt-Paare. Bei passendem KNX-Wert wird der ausgewählte Effekt ausgelöst.","effect_tip_status":"Ist eine Status-GA gesetzt, sendet der Knoten den aktuellen Effekt (zugeordneter Wert oder Name) auf den KNX-Bus.","effect_not_supported":"Diese Leuchte stellt keine Hue-Effekte bereit.","effect_knx_value_placeholder":"Abzugleichender Wert","effect_base_label":"Nicht-Hue-Basiseffekte","effect_native_label":"Hue-native Effekte"},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"HUE Steckdose","paletteLabel":"Hue Plug/Outlet","tabs":{"switch":"Schalten","behaviour":"Verhalten"},"node-input-name":"Name","switch_info":"Verknüpfe die KNX-Schaltadresse mit dem Ein/Aus-Zustand der Hue-Steckdose.","switch_control":"Befehl","switch_status":"Status","power_state":"Power state","power_state_info":"Optional. Übertrage den von Hue gemeldeten Leistungszustand (on/standby) auf eine KNX-Gruppenadresse.","read_status_startup":"Status beim Start lesen","opt_yes_emit":"Ja, und KNX-Telegramme senden.","opt_no":"Nein","node_pins":"Node Ein-/Ausgangs-PINs","node_pins_hide":"Ausblenden","node_pins_show":"Ein-/Ausgangs-PINs anzeigen","node_pins_help":"Aktiviere die Node-RED Ein-/Ausgänge, um eigene Hue-Payloads zu senden oder Ereignisse in den Flow weiterzugeben."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Hue-Taster","hue_sensor":"Hue-Taster","no_devices":"Keine Hue-Taster verfügbar","tabs":{"switch":"Schalten","dim":"Dimmen","behaviour":"Verhalten"},"switch_info":"Verknüpfen Sie die KNX-GA für kurze Tastendrücke.","switch_status":"Status-GA","dim_info":"Konfigurieren Sie die KNX-GA für Dimmen bei langen Tastendrücken.","behaviour_info":"Legen Sie fest, ob Werte automatisch toggeln oder feste Payloads gesendet werden.","toggle_values":"Werte bei jedem Ereignis toggeln","toggle_values_hint":"Aktiviert: wechselt zwischen true/false bzw. Dimmen hoch/runter; deaktiviert: sendet feste Payloads.","switch_send":"Schalt-Payload","dim_send":"Dim-Payload","dim_up":"Rauf","dim_down":"Runter","dim_stop":"Stopp","output_info":"Kein KNX-Gateway ausgewählt. Ereignisse werden trotzdem am Node-RED-Ausgang ausgegeben."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"Hue Tap Dial Knoten (Drehregler)","paletteLabel":"Hue Tap Dial","hue_device":"Hue Tap Dial","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Verknüpfen Sie die Drehereignisse des Tap Dial mit einer KNX-Gruppenadresse.","behaviour_info":"Bestimmen Sie, ob der Node-RED-Ausgang sichtbar bleibt, wenn keine KNX-Zuordnung aktiv ist.","node_pins":"Node-Ein-/Ausgangspins","node_pins_hide":"Pins ausblenden","node_pins_show":"Ein-/Ausgangspins anzeigen","output_info":"Ohne KNX-Gateway bleibt der Flow-Ausgang aktiv, damit Hue-Ereignisse weiterhin Node-RED erreichen.","no_devices":"Kein Hue Tap Dial gefunden. Verwenden Sie das Aktualisierungssymbol, nachdem ein neuer Dial gekoppelt wurde."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueMotion":{"paletteLabel":"Hue Bewegungssensor","hue_sensor":"Hue-Bewegungssensor","no_devices":"Keine Bewegungssensoren verfügbar","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Verknüpfen Sie die KNX-Gruppenadresse, die den Bewegungszustand erhalten soll.","behaviour_info":"Steuern Sie den Node-RED-Ausgangspin, wenn Sie Hue-Bewegungsereignisse ohne KNX weiterverarbeiten möchten.","node_pins":"Node-Ausgangspin","node_pins_show":"Node-RED-Ausgangspin anzeigen","node_pins_hide":"Ausblenden","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgangspin aktiviert ist, werden Hue-Bewegungsereignisse weiterhin an Ihren Flow gesendet."}},"knxUltimateHueAreaMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueAreaMotion":{"paletteLabel":"Hue Bewegungsbereich","heading":"Hue Bewegungsbereich-Node","hue_area":"Hue Bewegungsbereich (MotionAware)","no_devices":"Keine MotionAware-Bereiche verfügbar","tabs":{"motion":"Bewegung","behaviour":"Verhalten"},"node_pins":"Node-Ausgangspin","node_pins_hide":"Ausblenden","node_pins_show":"Node-RED-Ausgangspin anzeigen","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgangspin aktiviert ist, werden MotionAware-Bereichsbewegungen weiterhin an Ihren Flow gesendet.","read_status_startup":"Status beim Start auslesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","motion_info":"Verknüpfen Sie die KNX-Gruppenadresse, die den aggregierten Bewegungszustand für diesen MotionAware-Bereich erhalten soll."}},"knxUltimateHueCameraMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube Beispiel","knx_gw":"KNX Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueCameraMotion":{"paletteLabel":"Hue Kamerabewegung","heading":"HUE Kamerabewegungs-Knoten","hue_sensor":"HUE Kamerabewegung","no_devices":"Keine Kamera-Motion-Geräte verfügbar","tabs":{"motion":"Bewegung","behaviour":"Verhalten"},"node_pins":"Node-RED-Ausgang","node_pins_hide":"Ausblenden","node_pins_show":"Node-RED-Ausgang anzeigen","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgang aktiviert ist, werden Hue-Kamerabewegungsereignisse weiterhin in den Flow gesendet.","read_status_startup":"Status beim Start auslesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","motion_info":"Verknüpfen Sie die KNX-Gruppenadresse, um den Bewegungsstatus (erkannt/nicht erkannt) zu erhalten."}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Hue-Kontaktsensor","hue_sensor":"Hue-Kontaktsensor","no_devices":"Keine Hue-Kontaktsensoren verfügbar","placeholders":{"device":"Hue-Kontaktsensor","contact_ga":"Kontakt-GA-Name"},"tabs":{"mapping":"Zuordnung"},"mapping_info":"Verknüpfen Sie die KNX-GA, die den Kontaktzustand erhalten soll.","output_info":"Kein KNX-Gateway ausgewählt. Ereignisse werden trotzdem am Node-RED-Ausgang ausgegeben."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"Hue Lichtsensor Knoten","paletteLabel":"Hue Lichtsensor","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Hue Temperatursensor","hue_sensor":"Hue-Temperatursensor","no_devices":"Keine Temperatursensoren verfügbar","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Verknüpfen Sie die KNX-Gruppenadresse, die den Temperaturwert senden soll.","behaviour_info":"Konfigurieren Sie das Verhalten beim Start und die Sichtbarkeit des Node-RED-Ausgangspins.","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","node_pins":"Node-Ausgangspin","node_pins_show":"Node-RED-Ausgangspin anzeigen","node_pins_hide":"Ausblenden","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgangspin aktiviert ist, sendet der Hue-Temperatursensor weiterhin Werte an Ihren Flow."}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Hue Luftfeuchtigkeitssensor","heading":"HUE Luftfeuchtigkeitssensor","hue_sensor":"HUE Sensor","no_devices":"Keine Geräte verfügbar","tabs":{"humidity":"Luftfeuchtigkeit","behaviour":"Verhalten"},"humidity_info":"Verknüpfen Sie die KNX-Gruppenadresse, um die relative Luftfeuchtigkeit (%) zu erhalten.","node_pins":"Node-RED-Ausgang","node_pins_hide":"Ausblenden","node_pins_show":"Node-RED-Ausgang anzeigen","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgang aktiviert ist, werden Hue-Ereignisse weiterhin in den Flow gesendet.","read_status_startup":"Status beim Start auslesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube Beispiel","knx_gw":"KNX Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"Hue Szenen-Knoten","paletteLabel":"Hue Szene","hue_scene":"HUE Szene","recall_as":"Abrufen als","recall_active":"Als Aktiv abrufen","recall_dynamic":"Als Dynamisch abrufen","recall_static":"Als Statisch abrufen","recall":"Abrufen","status":"Status","scene_selector":"Szenenwähler","knx_scene_n":"KNX Szene Nr.","node_pins":"Node-Ein-/Ausgangspins","node_pins_hide":"Pins ausblenden","node_pins_show":"Ein-/Ausgangspins anzeigen","tabs":{"single":"Einzelszene","multi":"Mehrfachszene","behaviour":"Verhalten"},"single_info":"Wählen Sie die Hue-Szene und legen Sie fest, wie sie bei einem KNX-Telegramm aufgerufen wird.","mapping_info":"Ordnen Sie die KNX-Gruppenadressen zu, die die Szene auslösen oder ihren Status melden.","multi_info":"Verknüpfen Sie KNX-Szenennummern mit Hue-Szenen. Jede Regel ruft eine andere Szene auf.","behaviour_info":"Bestimmen Sie, ob der Node-RED-Ausgang sichtbar bleibt, wenn keine KNX-Zuordnung aktiv ist.","status_ga":"Status-GA","output_info":"Ohne KNX-Gateway bleibt der Flow-Ausgang aktiv, damit Hue-Ereignisse weiterhin Node-RED erreichen.","no_scenes":"Keine Hue-Szenen gefunden. Verwenden Sie das Aktualisierungssymbol, nachdem neue Szenen hinzugefügt wurden.","multi_scene_placeholder":"Hue-Szenenname"},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}},"knxUltimateHueBattery":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueBattery":{"paletteLabel":"Hue Batteriesensor","hue_sensor":"Hue-Batteriesensor","no_devices":"Keine Batteriesensoren verfügbar","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Verknüpfen Sie die KNX-Gruppenadresse, die den Batteriestand ausgeben soll.","behaviour_info":"Konfigurieren Sie das Verhalten beim Start sowie die Sichtbarkeit des Node-RED-Ausgangspins.","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","node_pins":"Node-Ausgangspin","node_pins_show":"Node-RED-Ausgangspin anzeigen","node_pins_hide":"Ausblenden","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgangspin aktiviert ist, sendet der Hue-Batteriesensor weiterhin Ereignisse in Ihren Flow."}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Hue Zigbee-Konnektivität","hue_sensor":"Hue-Zigbee-Konnektivität","no_devices":"Keine Zigbee-Konnektivitätsgeräte verfügbar","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Verknüpfen Sie die KNX-Gruppenadresse, die den Zigbee-Konnektivitätsstatus abbilden soll.","behaviour_info":"Bestimmen Sie, ob der Status beim Start gelesen wird und ob der Node-RED-Ausgangspin sichtbar bleibt.","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden.","node_pins":"Node-Ausgangspin","node_pins_show":"Node-RED-Ausgangspin anzeigen","node_pins_hide":"Ausblenden","output_info":"Kein KNX-Gateway ausgewählt. Wenn der Node-RED-Ausgangpin aktiviert ist, werden Hue-Konnektivitätsereignisse weiterhin an Ihren Flow gesendet."}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Hue Softwareaktualisierung","hue_device":"Hue-Gerät","tabs":{"mapping":"Zuordnung","behaviour":"Verhalten"},"mapping_info":"Ordnen Sie die KNX-Gruppenadresse zu, die den Update-Status meldet.","behaviour_info":"Konfigurieren Sie den Start-Scan und die Sichtbarkeit des Node-RED-Ausgangs.","node_pins":"Node-Ein-/Ausgangspins","node_pins_hide":"Pins ausblenden","node_pins_show":"Ein-/Ausgangspins anzeigen","output_info":"Ohne KNX-Gateway bleibt der Flow-Ausgang aktiv, damit Hue-Ereignisse weiterhin Node-RED erreichen.","no_devices":"Kein Hue-Gerät gefunden. Verwenden Sie das Aktualisierungssymbol, nachdem ein neues Gerät hinzugefügt wurde.","read_status_startup":"Status beim Start lesen","opt_no":"Nein","opt_yes_emit":"Ja, und KNX-Telegramme senden."},"common":{"ga":"GA","dpt":"DPT","name":"Name","youtube_sample":"YouTube-Beispiel","knx_gw":"KNX-Gateway","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lesen"}}},"fr":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"Nœud","node-input-name":"Nom","node-input-nameLightSwitch":"Commutateur (bit)","node-input-GALightSwitch":"Géorgie","node-input-dptLightSwitch":"dpt","node-input-nameLightState":"État (bit)","node-input-GALightState":"Géorgie","node-input-dptLightState":"dpt","node-input-hueLight":"Lueur","paletteLabel":"Hue Lumière / sortie","no_devices":"Aucun dispositif de teinte trouvé. Cliquez sur Actualiser après avoir jumelé une nouvelle lumière.","tabs":{"switch":"Changer","dim":"Faible","tunable_white":"White à réglage réglable","rgb_hsv":"RVB / HSV","effects":"Effets","behaviour":"Comportement"},"control":"Contrôle","status":"Statut","night_lighting":"Éclairage nocturne","no_night_lighting":"Pas d'éclairage de nuit","get_current":"Prendre le courant","get_again":"Remonter","wait":"Attendez...","connection_wait":"Attente de la fin de la connexion du Hue Bridge...","connection_timeout":"Le Hue Bridge n'est pas encore prêt. Vérifiez sa configuration, déployez puis réessayez.","editor_init_error":"Erreur de l'éditeur HUE pendant {{stage}} : {{error}}","day_night":"Jour / nuit","invert_day_night":"Valeur de jour / nuit inversée","override_night_mode":"Forcer le mode jour","override_no":"Non","override_set_day_fast_this":"Passez au mode jour en éteignant rapidement la lumière (cette lumière uniquement)","override_set_day_fast_all":"Passer au mode jour en éteignant rapidement la lumière (appliquer sur tous les nœuds lumineux)","node_pins":"Broches d'entrée / sortie de nœud","node_pins_hide":"Cacher","node_pins_show":"Afficher les broches d'entrée / sortie du nœud","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","knx_brightness_status":"Statut de luminosité de KNX","knx_brightness_onhueoff":"Lorsque Hue Light est éteint, envoyez 0%. Lorsque Hue On, restaurez la valeur précédente (comportement KNX par défaut)","knx_brightness_no":"Laisser tel quel (comportement de teinte par défaut)","update_local_state_from_knx_write":"Mettre à jour l'état Hue local en cache à partir des écritures du bus KNX","update_local_state_from_knx_write_hint":"Active: reactions locales plus rapides et reponses immediates de lecture KNX plus coherentes. Desactive: le cache ne suit que les evenements reels du bridge Hue.","use_min_brightness":"Utilisez une luminosité minimale spécifiée dans la lumière des teintes","k_suffix":"K","temp_desc_2200":"(Début de la gamme Philips White Ambiance Lights)","temp_desc_2700":"(blanc chaud, intime, confortable, personnel, pour les salons)","temp_desc_3000":"(blanc doux, chaud, apaisant, pour les salles de bains et les cuisines)","temp_desc_3500_day":"(Blanc neutre, équilibré, amical, accueillant, pour les espaces de bureau et le commerce de détail)","temp_desc_3500_night":"(Non recommandé pour la nuit - blanc neutre, pour les espaces de bureau et la vente au détail)","temp_desc_4100_day":"(blanc frais, précis, propre, concentré, pour les garages et les épiceries)","temp_desc_4100_night":"(Non recommandé pour la nuit - blanc frais, précis, propre, concentré, pour les garages et les épiceries)","temp_desc_5000_day":"(blanc brillant, vibrant, croustillant, pour les entrepôts, les stades sportifs et les soins de santé)","temp_desc_5000_night":"(Non recommandé pour la nuit - blanc brillant, vibrant, croustillant, pour les entrepôts, les stades sportifs et les soins de santé)","temp_desc_6500_day":"(lumière du jour, alerte, énergique, pour l'agriculture intérieure)","temp_desc_6500_night":"(Non recommandé pour la nuit - lumière du jour, alerte, énergique, pour l'agriculture intérieure)","switch_on_behaviour":"Activer le comportement","none":"Aucun","switch_off":"(Éteindre)","select_color":"Sélectionner la couleur","select_temperature_brightness":"Sélectionnez la température et la luminosité","select_brightness":"Sélectionner la luminosité","effect_command":"Commande d'effet","effect_status":"État de l'effet","effect_mapping":"Mappages","effect_autofill":"Remplissez les effets disponibles","effect_tip":"Fournir des paires d'effets KNX Valeur / Hue. Lorsque la charge utile KNX entrante correspond à la valeur, l'effet sélectionné est appliqué à la lumière.","effect_tip_status":"Si une adresse de groupe d'état est configurée, l'effet de teinte actuel est émis en utilisant la valeur KNX mappée ou le nom d'effet.","effect_not_supported":"Cette lumière n'expose pas les effets de la teinte.","effect_knx_value_placeholder":"Valeur à correspondre","effect_base_label":"Effets de base non-hers","effect_native_label":"Effets natifs de la teinte"},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"Plug / prise Hue","paletteLabel":"Plug / prise Hue","tabs":{"switch":"Changer","behaviour":"Comportement"},"node-input-name":"Nom","switch_info":"Reliez votre adresse de commutation KNX pour contrôler l'état de la fiche Hue.","switch_control":"Contrôle","switch_status":"Statut","power_state":"État de puissance","power_state_info":"Facultatif. Suivez l'état de puissance signalé par Hue (ON / STANDBY) sur une adresse de groupe KNX.","read_status_startup":"Lire l'état au démarrage","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","opt_no":"Non","node_pins":"Broches d'entrée / sortie de nœud","node_pins_hide":"Cacher","node_pins_show":"Afficher les broches d'entrée / sortie du nœud","node_pins_help":"Activez les broches d'entrée / sortie de Node-Red pour envoyer des charges utiles API Hue personnalisées ou des événements transférés à votre flux."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Bouton de teinte","hue_sensor":"Bouton de teinte","no_devices":"Pas de boutons Hue disponibles","tabs":{"switch":"Changer","dim":"Faible","behaviour":"Comportement"},"switch_info":"Lienz l'adresse du groupe KNX déclenché par des pressions courtes.","switch_status":"Statut GA","dim_info":"Configurez le KNX Dimming GA qui gère les événements répétés pendant les presses longues.","behaviour_info":"Sélectionnez si les événements basculent automatiquement les valeurs ou envoient des charges utiles fixes.","toggle_values":"Basculer les valeurs sur chaque événement","toggle_values_hint":"Activer d'alterner True / False et Dim Up / Down; Désactiver pour envoyer des charges utiles fixes définies ci-dessous.","switch_send":"Commutation de la charge utile","dim_send":"La charge utile","dim_up":"En haut","dim_down":"Vers le bas","dim_stop":"Arrêt","output_info":"Aucune passerelle KNX sélectionnée. Les événements sont toujours émis sur la broche de sortie du nœud-rouge."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"Nœud de cadran à robinet (Rotary)","paletteLabel":"Cadran du robinet","hue_device":"Cadran du robinet","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"Liez les événements de rotation de la cadran de la pointe de teinte à une adresse de groupe KNX.","behaviour_info":"Décidez si la broche de sortie du nœud-rouge doit rester visible lorsque la livraison KNX est désactivée.","node_pins":"Broches d'entrée / sortie de nœud","node_pins_hide":"Cacher les broches","node_pins_show":"Afficher les broches d'entrée / sortie du nœud","output_info":"Sans une passerelle KNX, la sortie de débit reste activée, de sorte que les événements de teinte continuent d'atteindre le nœud-rouge.","no_devices":"Pas de dispositifs de numérotation Hue Tap trouvés. Utilisez l'icône de rafraîchissement après le coupage d'un nouveau cadran."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueMotion":{"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"},"knxUltimateHueMotion":{"paletteLabel":"Mouvement de la teinte","hue_sensor":"Capteur de mouvement de la teinte","no_devices":"Aucun capteur de mouvement disponible","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"Lier l'adresse du groupe KNX qui devrait recevoir l'état détecté de la motion.","behaviour_info":"Basculez la broche de sortie du nœud-rouge lorsque vous souhaitez traiter les événements de mouvement de la teinte dans un flux sans KNX.","node_pins":"Broche de sortie du nœud","node_pins_show":"Afficher la broche de sortie du nœud-rouge","node_pins_hide":"Cacher","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les événements de mouvement Hue sont toujours émis dans votre flux."}},"knxUltimateHueAreaMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Nom","youtube_sample":"Exemple YouTube","knx_gw":"Passerelle KNX","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"Lire"},"knxUltimateHueAreaMotion":{"paletteLabel":"Zone de mouvement Hue","heading":"Nœud Zone de mouvement Hue","hue_area":"Zone de mouvement Hue (MotionAware)","no_devices":"Aucune zone MotionAware disponible","tabs":{"motion":"Mouvement","behaviour":"Comportement"},"node_pins":"Broche de sortie du nœud","node_pins_hide":"Masquer","node_pins_show":"Afficher la broche de sortie Node-RED","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie Node-RED est activée, les événements de mouvement de la zone MotionAware sont toujours envoyés vers votre flow.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettre des télégrammes KNX.","motion_info":"Liez l'adresse de groupe KNX qui doit recevoir l'état de mouvement agrégé pour cette zone MotionAware."}},"knxUltimateHueCameraMotion":{"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"},"knxUltimateHueCameraMotion":{"paletteLabel":"Motion de la caméra Hue","heading":"Node de mouvement de la caméra Hue","hue_sensor":"Motion de la caméra Hue","no_devices":"Aucun dispositif de mouvement de la caméra disponible","tabs":{"motion":"Mouvement","behaviour":"Comportement"},"node_pins":"Broche de sortie du nœud","node_pins_hide":"Cacher","node_pins_show":"Afficher la broche de sortie du nœud-rouge","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les événements de mouvement de la caméra Hue sont toujours émis dans votre flux.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","motion_info":"Reliez votre adresse de groupe KNX Motion pour recevoir l'état détecté / non détecté."}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Capteur de contact de la teinte","hue_sensor":"Capteur de contact de la teinte","no_devices":"Pas de capteurs de contact Hue disponibles","placeholders":{"device":"Capteur de contact Hue","contact_ga":"Nom GA contact"},"tabs":{"mapping":"Cartographie"},"mapping_info":"Lien du KNX GA qui devrait recevoir des mises à jour d'état de contact.","output_info":"Aucune passerelle KNX sélectionnée. Les événements de contact sont toujours émis sur la broche de sortie du nœud-rouge."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"Nœud de capteur de lumière","paletteLabel":"Capteur de lumière","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Capteur de température de teinte","hue_sensor":"Capteur de température de teinte","no_devices":"Aucun capteur de température disponible","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"Reliez l'adresse du groupe KNX qui devrait émettre la valeur de la température.","behaviour_info":"Configurez comment le capteur se lit au démarrage et s'il faut exposer la broche de sortie rouge-rouge.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","node_pins":"Broche de sortie du nœud","node_pins_show":"Afficher la broche de sortie du nœud-rouge","node_pins_hide":"Cacher","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les valeurs de température des teintes sont toujours émises à votre débit."}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Capteur d'humidité de la teinte","heading":"Nœud de capteur d'humidité de la teinte","hue_sensor":"Capteur de teinte","no_devices":"Aucun appareil disponible","tabs":{"humidity":"Humidité","behaviour":"Comportement"},"humidity_info":"Reliez votre adresse de groupe d'humidité KNX pour recevoir l'humidité relative (%).","node_pins":"Broche de sortie du nœud","node_pins_hide":"Cacher","node_pins_show":"Afficher la broche de sortie du nœud-rouge","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les événements Hue sont toujours émis dans votre flux.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"Node de la scène de la teinte","paletteLabel":"Scène de teinte","hue_scene":"Scène de teinte","recall_as":"Rappeler comme","recall_active":"Rappel comme actif","recall_dynamic":"Rappel comme dynamique","recall_static":"Rappel comme statique","recall":"Rappel","status":"Statut","scene_selector":"Sélecteur de scène","knx_scene_n":"Scène KNX n.","node_pins":"Broches d'entrée / sortie de nœud","node_pins_hide":"Cacher les broches","node_pins_show":"Afficher les broches d'entrée / sortie du nœud","tabs":{"single":"Scène unique","multi":"Multicolatage","behaviour":"Comportement"},"single_info":"Sélectionnez la scène Hue et choisissez comment elle doit être rappelée lorsque l'adresse KNX est déclenchée.","mapping_info":"Carte les adresses KNX qui rappellent la scène ou signalent son état actuel.","multi_info":"Associez les numéros de scène KNX aux scènes de teinte. Chaque règle rappelle une scène de teinte différente.","behaviour_info":"Décidez si la broche de sortie du nœud-rouge doit rester visible lorsque la livraison KNX est désactivée.","status_ga":"Statut GA","output_info":"Sans une passerelle KNX, la sortie de débit reste activée, de sorte que les événements de teinte continuent d'atteindre le nœud-rouge.","no_scenes":"Pas de scènes de teintes trouvées. Utilisez l'icône d'actualisation après l'ajout de nouvelles scènes.","multi_scene_placeholder":"Nom de la scène Hue"},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}},"knxUltimateHueBattery":{"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"},"knxUltimateHueBattery":{"paletteLabel":"Capteur de batterie de teintes","hue_sensor":"Capteur de batterie de teintes","no_devices":"Aucun dispositif de batterie disponible","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"Reliez l'adresse du groupe KNX qui devrait émettre le pourcentage de batterie.","behaviour_info":"Configurez comment le capteur se comporte au démarrage et s'il faut exposer la broche de sortie rouge-rouge.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","node_pins":"Broche de sortie du nœud","node_pins_show":"Afficher la broche de sortie du nœud-rouge","node_pins_hide":"Cacher","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les événements de batterie de teintes sont toujours émis dans votre flux."}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Connectivité Hue Zigbee","hue_sensor":"Connectivité Hue Zigbee","no_devices":"Aucun dispositif de connectivité Zigbee disponible","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"LIEND L'adresse du groupe KNX qui devrait refléter l'état de connectivité Zigbee.","behaviour_info":"Choisissez s'il faut lire l'état de connectivité au démarrage et exposer la broche de sortie rouge-rouge.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX.","node_pins":"Broche de sortie du nœud","node_pins_show":"Afficher la broche de sortie du nœud-rouge","node_pins_hide":"Cacher","output_info":"Aucune passerelle KNX sélectionnée. Lorsque la broche de sortie du nœud-rouge est activée, les événements de connectivité Hue sont toujours émis dans votre flux."}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Mise à jour du logiciel Hue","hue_device":"Dispositif","tabs":{"mapping":"Cartographie","behaviour":"Comportement"},"mapping_info":"Carte à l'adresse KNX qui rapporte l'état de mise à jour logiciel.","behaviour_info":"Les lectures de démarrage de contrôle et la visibilité de la broche de sortie du nœud-rouge.","node_pins":"Broches d'entrée / sortie de nœud","node_pins_hide":"Cacher les broches","node_pins_show":"Afficher les broches d'entrée / sortie du nœud","output_info":"Sans une passerelle KNX, la sortie de débit reste activée, de sorte que les événements de teinte continuent d'atteindre le nœud-rouge.","no_devices":"Aucun dispositif de teinte trouvé. Utilisez l'icône de rafraîchissement après avoir ajouté un nouvel appareil.","read_status_startup":"Lire l'état au démarrage","opt_no":"Non","opt_yes_emit":"Oui, et émettez des télégrammes KNX."},"common":{"ga":"Géorgie","dpt":"Dpt","name":"Nom","youtube_sample":"Échantillon YouTube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Hue Philips","read":"Lire"}}},"es":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"Nodo de tono","node-input-name":"Nombre","node-input-nameLightSwitch":"Interruptor (bit)","node-input-GALightSwitch":"Georgia","node-input-dptLightSwitch":"DPT","node-input-nameLightState":"Estado (bit)","node-input-GALightState":"Georgia","node-input-dptLightState":"DPT","node-input-hueLight":"Luz de tono","paletteLabel":"Luz de tono/salida","no_devices":"No se encontraron dispositivos de tono. Haga clic en Actualizar después de combinar una nueva luz.","tabs":{"switch":"Cambiar","dim":"Oscuro","tunable_white":"Blanco sintonizable","rgb_hsv":"RGB/HSV","effects":"Efectos","behaviour":"Comportamiento"},"control":"Control","status":"Estado","night_lighting":"Iluminación nocturna","no_night_lighting":"Sin iluminación nocturna","get_current":"Obtener","get_again":"Volver a","wait":"Esperar...","connection_wait":"Esperando a que Hue Bridge termine de conectarse...","connection_timeout":"Hue Bridge todavía no está listo. Comprueba su configuración, despliega y vuelve a intentarlo.","editor_init_error":"Error del editor HUE durante {{stage}}: {{error}}","locate_no_bridge":"Seleccione primero un bridge Hue","locate_no_device":"Seleccione primero un dispositivo Hue","locate_success":"Comando de localización enviado","locate_started":"Modo de localización iniciado. Pulsa de nuevo para detenerlo (se detiene automáticamente tras 10 minutos).","locate_stopped":"Modo de localización detenido.","locate_start_title":"Localizar el dispositivo Hue seleccionado","locate_stop_title":"Detener el modo de localización","locate_error":"No se pudo localizar el dispositivo Hue","day_night":"Día/noche","invert_day_night":"Invertir el valor de día/noche","override_night_mode":"Forzar el modo diurno","override_no":"No","override_set_day_fast_this":"Cambie al modo de día apagando rápidamente la luz y luego (solo esta luz)","override_set_day_fast_all":"Cambie al modo de día apagando rápidamente la luz y luego (aplique a todos los nodos de luz)","node_pins":"Pasadores de entrada/salida del nodo","node_pins_hide":"Esconder","node_pins_show":"Mostrar pines de entrada/salida del nodo","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","knx_brightness_status":"Estado de brillo KNX","knx_brightness_onhueoff":"Cuando la luz del tono está apagada, envíe 0%. Cuando se enciende, restaure el valor anterior (comportamiento de KNX predeterminado)","knx_brightness_no":"Salir como está (comportamiento de tono predeterminado)","update_local_state_from_knx_write":"Actualizar el estado local en caché de Hue a partir de escrituras del bus KNX","update_local_state_from_knx_write_hint":"Activado: reacciones locales mas rapidas y respuestas inmediatas de lectura KNX mas coherentes. Desactivado: la cache se actualiza solo con eventos reales del bridge Hue.","use_min_brightness":"Use brillo mínimo especificado en la luz del tono","k_suffix":"K","temp_desc_2200":"(Inicio de Philips White Ambiance Lights Range)","temp_desc_2700":"(Cálido blanco, íntimo, acogedor, personal, para salas de estar)","temp_desc_3000":"(Blanco suave, cálido, calmante, para baños y cocinas)","temp_desc_3500_day":"(Blanco neutral, equilibrado, amigable, acogedor, para espacios de oficina y venta minorista)","temp_desc_3500_night":"(No se recomienda para la noche: blanco neutral, para espacios de oficina y venta minorista)","temp_desc_4100_day":"(COOL WHITE, PRECISE, CLIME, COMENTADO, PARA GARAJES Y TIENTES DE GRATOS)","temp_desc_4100_night":"(No se recomienda para la noche: blanco frío, preciso, limpio, enfocado, para garajes y supermercados)","temp_desc_5000_day":"(blanco brillante, vibrante, crujiente, para almacenes, estadios deportivos y atención médica)","temp_desc_5000_night":"(No se recomienda para la noche: blanco brillante, vibrante, nítido, para almacenes, estadios deportivos y atención médica)","temp_desc_6500_day":"(Día, alerta, enérgica, para la agricultura interior)","temp_desc_6500_night":"(No se recomienda para la noche: luz del día, alerta, enérgica, para la agricultura interior)","switch_on_behaviour":"Encender el comportamiento","none":"Ninguno","switch_off":"(Desconectar)","select_color":"Seleccionar color","select_temperature_brightness":"Seleccionar temperatura y brillo","select_brightness":"Seleccionar brillo","effect_command":"Comando de efecto","effect_status":"Estado del efecto","effect_mapping":"Mapeos","effect_autofill":"Llenar con los efectos disponibles","effect_tip":"Proporcione pares de valor KNX / Effect Hue. Cuando la carga útil de KNX entrante coincide con el valor, el efecto seleccionado se aplica a la luz.","effect_tip_status":"Si se configura una dirección de grupo de estado, el efecto de tono actual se emite utilizando el valor KNX asignado o el nombre del efecto.","effect_not_supported":"Esta luz no expone los efectos del tono.","effect_knx_value_placeholder":"Valor para coincidir","effect_base_label":"Efectos básicos no suyos","effect_native_label":"Efectos nativos de tono"},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"Hue Plug/salida","paletteLabel":"Hue Plug/salida","tabs":{"switch":"Cambiar","behaviour":"Comportamiento"},"node-input-name":"Nombre","switch_info":"Enlace su dirección de interruptor KNX para controlar el estado/apagado del enchufe del tono.","switch_control":"Control","switch_status":"Estado","power_state":"Estado de poder","power_state_info":"Opcional. Realice un seguimiento del estado de energía informado por el tono (en/espera) en una dirección de grupo KNX.","read_status_startup":"Estado de lectura en el inicio","opt_yes_emit":"Sí, y emitir telegramas KNX.","opt_no":"No","node_pins":"Pasadores de entrada/salida del nodo","node_pins_hide":"Esconder","node_pins_show":"Mostrar pines de entrada/salida del nodo","node_pins_help":"Habilite los pines de entrada/salida de Node-Red para enviar cargas útiles de API de HUE personalizadas o eventos reenviados a su flujo."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Botón de tono","hue_sensor":"Botón de tono","no_devices":"No hay botones de Hue disponibles","tabs":{"switch":"Cambiar","dim":"Oscuro","behaviour":"Comportamiento"},"switch_info":"Enlace la dirección de grupo KNX activada por prensas cortas.","switch_status":"Estado GA","dim_info":"Configure el KNX Dimming GA que maneja eventos repetidos durante prensas largas.","behaviour_info":"Seleccione si los eventos alternan los valores automáticamente o envían cargas útiles fijas.","toggle_values":"Alternar los valores en cada evento","toggle_values_hint":"Habilitar para alternar verdadero/falso y atenuar/abajo; Deshabilite enviar cargas útiles fijas definidas a continuación.","switch_send":"Cambiar de carga","dim_send":"Carga útil","dim_up":"Arriba","dim_down":"Abajo","dim_stop":"Detener","output_info":"No se seleccionó KNX Gateway. Los eventos todavía se emiten en el pin de salida de nodo-rojo."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"Nodo de marcado de toque de tono (rotativo)","paletteLabel":"Dial de tono de tono","hue_device":"Dial de tono de tono","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Enlace los eventos de rotación del dial de tono de tono a una dirección de grupo KNX.","behaviour_info":"Decida si el pin de salida de red de nodo debe permanecer visible cuando la entrega KNX está deshabilitada.","node_pins":"Pasadores de entrada/salida del nodo","node_pins_hide":"Esconderse","node_pins_show":"Mostrar pines de entrada/salida del nodo","output_info":"Sin una puerta de enlace KNX, la salida del flujo permanece habilitada para que los eventos de tono continúen alcanzando el nodo-rojo.","no_devices":"No se encuentran dispositivos de marcación de toque de tono. Use el icono de actualización después de combinar un nuevo dial."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueMotion":{"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"},"knxUltimateHueMotion":{"paletteLabel":"Moción de tonos","hue_sensor":"Sensor de movimiento de tono","no_devices":"No hay sensores de movimiento disponibles","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Enlace la dirección del grupo KNX que debe recibir el estado detectado de la moción.","behaviour_info":"Alterne el pin de salida de rojo nodo cuando desee procesar eventos de movimiento de tono en un flujo sin KNX.","node_pins":"Pin de salida de nodo","node_pins_show":"Mostrar pin de salida de nodo-rojo","node_pins_hide":"Esconder","output_info":"No se seleccionó KNX Gateway. Cuando el PIN de salida de Node-Red está habilitado, los eventos de movimiento de Hue todavía se emiten a su flujo."}},"knxUltimateHueAreaMotion":{"common":{"ga":"GA","dpt":"DPT","name":"Nombre","youtube_sample":"Ejemplo de YouTube","knx_gw":"Pasarela KNX","hue_bridge":"Puente Hue","philips_hue":"Philips HUE","read":"Leer"},"knxUltimateHueAreaMotion":{"paletteLabel":"Área de movimiento Hue","heading":"Nodo Área de movimiento Hue","hue_area":"Área de movimiento Hue (MotionAware)","no_devices":"No hay áreas MotionAware disponibles","tabs":{"motion":"Movimiento","behaviour":"Comportamiento"},"node_pins":"Pin de salida del nodo","node_pins_hide":"Ocultar","node_pins_show":"Mostrar pin de salida de Node-RED","output_info":"No se ha seleccionado pasarela KNX. Cuando el pin de salida de Node-RED está habilitado, los eventos de movimiento del área MotionAware siguen enviándose al flujo.","read_status_startup":"Leer estado al inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","motion_info":"Enlace la dirección de grupo KNX que debe recibir el estado de movimiento agregado de esta área MotionAware."}},"knxUltimateHueCameraMotion":{"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"},"knxUltimateHueCameraMotion":{"paletteLabel":"Movimiento de la cámara de tono","heading":"Nodo de movimiento de la cámara del tono","hue_sensor":"Movimiento de la cámara de tono","no_devices":"No hay dispositivos de movimiento de cámara disponibles","tabs":{"motion":"Movimiento","behaviour":"Comportamiento"},"node_pins":"Pin de salida de nodo","node_pins_hide":"Esconder","node_pins_show":"Mostrar pin de salida de nodo-rojo","output_info":"No se seleccionó KNX Gateway. Cuando se habilita el PIN de salida de Node-Red, los eventos de movimiento de la cámara HUE todavía se emiten a su flujo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","motion_info":"Enlace su dirección de grupo de movimiento KNX para recibir el estado detectado/no detectado."}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Sensor de contacto de tono","hue_sensor":"Sensor de contacto de tono","no_devices":"No hay sensores de contacto de Hue disponibles","placeholders":{"device":"Sensor de contacto Hue","contact_ga":"Nombre GA de contacto"},"tabs":{"mapping":"Cartografía"},"mapping_info":"Enlace el KNX GA que debe recibir actualizaciones de estado de contacto.","output_info":"No se seleccionó KNX Gateway. Los eventos de contacto todavía se emiten en el pin de salida de nodo-rojo."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"Nodo del sensor de luz de tono","paletteLabel":"Sensor de luz de tono","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Sensor de temperatura del tono","hue_sensor":"Sensor de temperatura del tono","no_devices":"No hay sensores de temperatura disponibles","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Enlace la dirección del grupo KNX que debe emitir el valor de temperatura.","behaviour_info":"Configure cómo se lee el sensor al inicio y si expone el pin de salida de nodo-rojo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","node_pins":"Pin de salida de nodo","node_pins_show":"Mostrar pin de salida de nodo-rojo","node_pins_hide":"Esconder","output_info":"No se seleccionó KNX Gateway. Cuando se habilita el pin de salida de nodo-rojo, los valores de temperatura del tono todavía se emiten a su flujo."}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Sensor de humedad de tono","heading":"Nodo del sensor de humedad del tono","hue_sensor":"Sensor de tono","no_devices":"No hay dispositivos disponibles","tabs":{"humidity":"Humedad","behaviour":"Comportamiento"},"humidity_info":"Enlace su dirección de grupo de humedad KNX para recibir la humedad relativa (%).","node_pins":"Pin de salida de nodo","node_pins_hide":"Esconder","node_pins_show":"Mostrar pin de salida de nodo-rojo","output_info":"No se seleccionó KNX Gateway. Cuando el PIN de salida de Node-Red está habilitado, los eventos de HUE todavía se emiten a su flujo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"Nodo de escena de tono","paletteLabel":"Escena de tono","hue_scene":"Escena de tono","recall_as":"Recordar como","recall_active":"Recuerde como activo","recall_dynamic":"Recordar como dinámico","recall_static":"Recordar como estática","recall":"Recordar","status":"Estado","scene_selector":"Selector de escenas","knx_scene_n":"Escena knx n.","node_pins":"Pasadores de entrada/salida del nodo","node_pins_hide":"Esconderse","node_pins_show":"Mostrar pines de entrada/salida del nodo","tabs":{"single":"Escena individual","multi":"Múltiple escena","behaviour":"Comportamiento"},"single_info":"Seleccione la escena del tono y elija cómo se debe recuperar cuando se active la dirección KNX.","mapping_info":"Mapee las direcciones KNX que recuerdan la escena o informan su estado actual.","multi_info":"Asociar números de escena KNX con escenas de tono. Cada regla recuerda una escena de tono diferente.","behaviour_info":"Decida si el pin de salida de red de nodo debe permanecer visible cuando la entrega KNX está deshabilitada.","status_ga":"Estado GA","output_info":"Sin una puerta de enlace KNX, la salida del flujo permanece habilitada para que los eventos de tono continúen alcanzando el nodo-rojo.","no_scenes":"No se encontraron escenas de tono. Use el icono de actualización después de agregar nuevas escenas.","multi_scene_placeholder":"Nombre de la escena del tono"},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}},"knxUltimateHueBattery":{"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"},"knxUltimateHueBattery":{"paletteLabel":"Sensor de batería de tono","hue_sensor":"Sensor de batería de tono","no_devices":"No hay dispositivos de batería disponibles","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Enlace la dirección del grupo KNX que debe emitir el porcentaje de batería.","behaviour_info":"Configure cómo se comporta el sensor al inicio y si se debe exponer el pin de salida de nodo-rojo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","node_pins":"Pin de salida de nodo","node_pins_show":"Mostrar pin de salida de nodo-rojo","node_pins_hide":"Esconder","output_info":"No se seleccionó KNX Gateway. Cuando se habilita el pin de salida de red de nodo, los eventos de batería de Hue todavía se emiten a su flujo."}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Conectividad de tono zigbee","hue_sensor":"Conectividad de tono zigbee","no_devices":"No hay dispositivos de conectividad Zigbee disponibles","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Enlace la dirección del grupo KNX que debe reflejar el estado de conectividad Zigbee.","behaviour_info":"Elija si lee el estado de conectividad al inicio y exponga el pin de salida de nodo-rojo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX.","node_pins":"Pin de salida de nodo","node_pins_show":"Mostrar pin de salida de nodo-rojo","node_pins_hide":"Esconder","output_info":"No se seleccionó KNX Gateway. Cuando el PIN de salida de Node-Red está habilitado, los eventos de conectividad de HUE todavía se emiten a su flujo."}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Actualización de software de Hue","hue_device":"Dispositivo para tonos","tabs":{"mapping":"Cartografía","behaviour":"Comportamiento"},"mapping_info":"Mapee la dirección KNX que informa el estado de actualización de software.","behaviour_info":"Controle las lecturas de inicio y la visibilidad del pin de salida del nodo-rojo.","node_pins":"Pasadores de entrada/salida del nodo","node_pins_hide":"Esconderse","node_pins_show":"Mostrar pines de entrada/salida del nodo","output_info":"Sin una puerta de enlace KNX, la salida del flujo permanece habilitada para que los eventos de tono continúen alcanzando el nodo-rojo.","no_devices":"No se encontraron dispositivos de tono. Use el icono de actualización después de agregar un nuevo dispositivo.","read_status_startup":"Estado de lectura en el inicio","opt_no":"No","opt_yes_emit":"Sí, y emitir telegramas KNX."},"common":{"ga":"Georgia","dpt":"DPT","name":"Nombre","youtube_sample":"Muestra de youtube","knx_gw":"KNX GW","hue_bridge":"Hue Bridge","philips_hue":"Tono Philips","read":"Leer"}}},"zh-CN":{"knxUltimateHueLight":{"knxUltimateHueLight":{"title":"HUE node","node-input-name":"Name","node-input-nameLightSwitch":"Switch (bit)","node-input-GALightSwitch":"GA","node-input-dptLightSwitch":"dpt","node-input-nameLightState":"State (bit)","node-input-GALightState":"GA","node-input-dptLightState":"dpt","node-input-hueLight":"HUE light","paletteLabel":"Hue 灯/插座","no_devices":"未找到 Hue 灯。配对新灯后请点击刷新图标。","tabs":{"switch":"开关","dim":"调光","tunable_white":"可调白光","rgb_hsv":"RGB/HSV","effects":"效果","behaviour":"行为"},"control":"控制","status":"状态","night_lighting":"夜间照明","no_night_lighting":"无夜间照明","get_current":"获取当前","get_again":"再次获取","wait":"请稍候...","connection_wait":"正在等待 Hue Bridge 完成连接...","connection_timeout":"Hue Bridge 尚未就绪。请检查配置、部署后重试。","editor_init_error":"HUE 编辑器在 {{stage}} 阶段出错：{{error}}","day_night":"昼/夜","invert_day_night":"反转昼/夜值","override_night_mode":"强制日间模式","override_no":"否","override_set_day_fast_this":"快速关开切换到白天模式（仅此灯）","override_set_day_fast_all":"快速关开切换到白天模式（应用于所有灯）","node_pins":"节点输入/输出引脚","node_pins_hide":"隐藏","node_pins_show":"显示输入/输出引脚","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。","knx_brightness_status":"KNX 亮度状态","knx_brightness_onhueoff":"当 HUE 灯关闭时发送 0%。当 HUE 打开时恢复先前值（默认 KNX 行为）","knx_brightness_no":"保持不变（默认 HUE 行为）","update_local_state_from_knx_write":"根据 KNX 总线写入更新本地缓存的 Hue 状态","update_local_state_from_knx_write_hint":"启用：本地响应更快，KNX 即时读回更一致。禁用：缓存只根据 Hue 网关的真实事件更新。","use_min_brightness":"使用 HUE 灯中设置的最小亮度","k_suffix":"K","temp_desc_2200":"（飞利浦 White Ambiance 系列起始）","temp_desc_2700":"（暖白，温馨、舒适、私密，适合客厅）","temp_desc_3000":"（柔和白，温暖、平静，适合浴室和厨房）","temp_desc_3500_day":"（中性白，均衡、友好、亲切，适合办公室和零售）","temp_desc_3500_night":"（夜间不推荐——中性白，适合办公室和零售）","temp_desc_4100_day":"（冷白，精准、干净、聚焦，适合车库和超市）","temp_desc_4100_night":"（夜间不推荐——冷白，精准、干净、聚焦，适合车库和超市）","temp_desc_5000_day":"（明亮白，鲜明、清晰，适合仓库、体育场和医疗）","temp_desc_5000_night":"（夜间不推荐——明亮白，鲜明、清晰，适合仓库、体育场和医疗）","temp_desc_6500_day":"（日光，警觉、充满活力，适合室内农业）","temp_desc_6500_night":"（夜间不推荐——日光，警觉、充满活力，适合室内农业）","switch_on_behaviour":"开灯行为","none":"无","switch_off":"(关)","select_color":"选择颜色","select_temperature_brightness":"选择色温和亮度","select_brightness":"选择亮度","effect_command":"效果命令","effect_status":"效果状态","effect_mapping":"映射","effect_autofill":"填充可用效果","effect_tip":"配置 KNX 数值与 Hue 效果对，收到匹配的 KNX 数值时触发对应效果。","effect_tip_status":"若配置状态组地址，将把当前效果（映射值或效果名称）发送到 KNX。","effect_not_supported":"该灯具不支持 Hue 效果。","effect_knx_value_placeholder":"匹配值","effect_base_label":"非 Hue 基础效果","effect_native_label":"Hue 原生效果"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}},"knxUltimateHuePlug":{"knxUltimateHuePlug":{"title":"HUE 插座","paletteLabel":"Hue Plug/Outlet","tabs":{"switch":"开关","behaviour":"行为"},"node-input-name":"名称","switch_info":"把 KNX 的开关地址映射到 Hue 插座的开/关状态。","switch_control":"控制","switch_status":"状态","power_state":"电源状态","power_state_info":"可选：跟踪 Hue 返回的电源状态（on/standby），并写入 KNX 组地址。","read_status_startup":"启动时读取状态","opt_yes_emit":"是，并发送 KNX 电报。","opt_no":"否","node_pins":"节点输入/输出引脚","node_pins_hide":"隐藏","node_pins_show":"显示输入/输出引脚","node_pins_help":"启用 Node-RED 输入/输出引脚，以便发送自定义 Hue 载荷或将事件转发到 Flow。"},"common":{"ga":"组地址","dpt":"DPT","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"读取"}},"knxUltimateHueButton":{"knxUltimateHueButton":{"paletteLabel":"Hue 按钮","hue_sensor":"Hue 按钮","no_devices":"没有可用的 Hue 按钮","tabs":{"switch":"开关","dim":"调光","behaviour":"行为"},"switch_info":"关联短按触发的 KNX 组地址。","switch_status":"状态 GA","dim_info":"配置长按调光时使用的 KNX 组地址。","behaviour_info":"选择事件是自动切换数值还是发送固定负载。","toggle_values":"每次事件切换数值","toggle_values_hint":"启用后在 true/false 与调光方向之间切换；禁用后发送下方定义的固定负载。","switch_send":"开关负载","dim_send":"调光负载","dim_up":"增亮","dim_down":"变暗","dim_stop":"停止","output_info":"未选择 KNX 网关。事件仍会通过 Node-RED 输出引脚发送。"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}},"knxUltimateHueTapDial":{"knxUltimateHueTapDial":{"title":"HUE 旋钮节点","paletteLabel":"Hue 旋钮开关","hue_device":"Hue Tap Dial","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"将 Tap Dial 的旋转事件映射到 KNX 组地址。","behaviour_info":"决定在停用 KNX 传输时是否仍显示 Node-RED 输出引脚。","node_pins":"节点输入/输出引脚","node_pins_hide":"隐藏引脚","node_pins_show":"显示节点输入/输出引脚","output_info":"没有 KNX 网关时仍保持向流程输出，以继续接收 Hue 事件。","no_devices":"未发现 Hue Tap Dial。配对新旋钮后请点击刷新图标。"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}},"knxUltimateHueMotion":{"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"},"knxUltimateHueMotion":{"paletteLabel":"Hue 人体传感器","hue_sensor":"Hue 人体传感器","no_devices":"没有可用的运动传感器","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"关联应接收运动检测状态的 KNX 组地址。","behaviour_info":"当没有 KNX 时，可通过此设置决定是否保留 Node-RED 输出引脚以处理 Hue 运动事件。","node_pins":"节点输出引脚","node_pins_show":"显示 Node-RED 输出引脚","node_pins_hide":"隐藏","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 运动事件仍会发送到流程中。"}},"knxUltimateHueAreaMotion":{"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"},"knxUltimateHueAreaMotion":{"paletteLabel":"Hue 区域人体传感器","heading":"Hue 区域人体传感器节点","hue_area":"Hue 区域人体传感器（MotionAware）","no_devices":"没有可用的 MotionAware 区域","tabs":{"motion":"运动","behaviour":"行为"},"node_pins":"节点输出引脚","node_pins_hide":"隐藏","node_pins_show":"显示 Node-RED 输出引脚","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，MotionAware 区域的运动事件仍会发送到流程中。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。","motion_info":"关联应接收该 MotionAware 区域聚合运动状态的 KNX 组地址。"}},"knxUltimateHueCameraMotion":{"common":{"ga":"GA","dpt":"DPT","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"读取"},"knxUltimateHueCameraMotion":{"paletteLabel":"Hue 摄像头运动","heading":"HUE 摄像头运动节点","hue_sensor":"HUE 摄像头运动","no_devices":"没有可用的摄像头运动设备","tabs":{"motion":"运动","behaviour":"行为"},"node_pins":"输出引脚","node_pins_hide":"隐藏","node_pins_show":"显示 Node-RED 输出引脚","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 摄像头运动事件仍会发送到流程中。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 报文。","motion_info":"关联 KNX 组地址，以接收运动检测状态（有/无）。"}},"knxUltimateHueContactSensor":{"knxUltimateHueContactSensor":{"paletteLabel":"Hue 接触传感器","hue_sensor":"Hue 接触传感器","no_devices":"没有可用的 Hue 接触传感器","placeholders":{"device":"Hue 接触传感器","contact_ga":"接触 GA 名称"},"tabs":{"mapping":"映射"},"mapping_info":"关联接触状态要写入的 KNX 组地址。","output_info":"未选择 KNX 网关。事件仍会通过 Node-RED 输出引脚发送。"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}},"knxUltimateHueLightSensor":{"knxUltimateHueLightSensor":{"title":"HUE 光照传感器节点","paletteLabel":"Hue 光照传感器","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。"}},"knxUltimateHueTemperatureSensor":{"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"},"knxUltimateHueTemperatureSensor":{"paletteLabel":"Hue 温度传感器","hue_sensor":"Hue 温度传感器","no_devices":"没有可用的温度传感器","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"关联应发送温度值的 KNX 组地址。","behaviour_info":"配置启动行为以及是否显示 Node-RED 输出引脚。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。","node_pins":"节点输出引脚","node_pins_show":"显示 Node-RED 输出引脚","node_pins_hide":"隐藏","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 温度值仍会发送到流程中。"}},"knxUltimateHueHumiditySensor":{"knxUltimateHueHumiditySensor":{"paletteLabel":"Hue 湿度传感器","heading":"HUE 湿度传感器节点","hue_sensor":"HUE 传感器","no_devices":"没有可用的设备","tabs":{"humidity":"湿度","behaviour":"行为"},"humidity_info":"关联 KNX 组地址以接收相对湿度 (%)。","node_pins":"输出引脚","node_pins_hide":"隐藏","node_pins_show":"显示 Node-RED 输出引脚","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 事件仍会发送到流程中。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 报文。"},"common":{"ga":"GA","dpt":"DPT","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"Philips HUE","read":"读取"}},"knxUltimateHueScene":{"knxUltimateHueScene":{"title":"HUE 场景节点","paletteLabel":"Hue 场景","hue_scene":"HUE 场景","recall_as":"调用方式","recall_active":"以“激活”调用","recall_dynamic":"以“动态”调用","recall_static":"以“静态”调用","recall":"调用","status":"状态","scene_selector":"场景选择器","knx_scene_n":"KNX 场景第","node_pins":"节点输入/输出引脚","node_pins_hide":"隐藏引脚","node_pins_show":"显示节点输入/输出引脚","tabs":{"single":"单个场景","multi":"多场景","behaviour":"行为"},"single_info":"选择要使用的 Hue 场景，并定义收到 KNX 命令时的调度方式。","mapping_info":"配置用于调用场景或反馈状态的 KNX 组地址。","multi_info":"将 KNX 场景号与 Hue 场景关联，每条规则对应一个不同的 Hue 场景。","behaviour_info":"决定在禁用 KNX 映射时是否仍显示 Node-RED 输出引脚。","status_ga":"状态 GA","output_info":"没有 KNX 网关时仍保持向流程输出，以继续接收 Hue 事件。","no_scenes":"未找到 Hue 场景。添加新场景后请点击刷新图标。","multi_scene_placeholder":"Hue 场景名称"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}},"knxUltimateHueBattery":{"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"},"knxUltimateHueBattery":{"paletteLabel":"Hue 电池传感器","hue_sensor":"Hue 电池传感器","no_devices":"没有可用的电池设备","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"关联应发送电池百分比的 KNX 组地址。","behaviour_info":"配置启动时的行为以及是否显示 Node-RED 输出引脚。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。","node_pins":"节点输出引脚","node_pins_show":"显示 Node-RED 输出引脚","node_pins_hide":"隐藏","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 电池传感器仍会向流程发送事件。"}},"knxUltimateHueZigbeeConnectivity":{"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"},"knxUltimateHueZigbeeConnectivity":{"paletteLabel":"Hue Zigbee 连接","hue_sensor":"Hue Zigbee 连接","no_devices":"没有可用的 Zigbee 连接设备","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"关联应表示 Zigbee 连接状态的 KNX 组地址。","behaviour_info":"配置启动时是否读取状态，以及是否显示 Node-RED 输出引脚。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。","node_pins":"节点输出引脚","node_pins_show":"显示 Node-RED 输出引脚","node_pins_hide":"隐藏","output_info":"未选择 KNX 网关。启用 Node-RED 输出引脚后，Hue 连接事件仍会发送到流程中。"}},"knxUltimateHuedevice_software_update":{"knxUltimateHuedevice_software_update":{"paletteLabel":"Hue 软件更新","hue_device":"Hue 设备","tabs":{"mapping":"映射","behaviour":"行为"},"mapping_info":"映射用于报告软件更新状态的 KNX 组地址。","behaviour_info":"配置启动时读取以及 Node-RED 输出引脚的可见性。","node_pins":"节点输入/输出引脚","node_pins_hide":"隐藏引脚","node_pins_show":"显示节点输入/输出引脚","output_info":"没有 KNX 网关时仍保持向流程输出，以继续接收 Hue 事件。","no_devices":"未找到 Hue 设备。添加新设备后请点击刷新图标。","read_status_startup":"启动时读取状态","opt_no":"否","opt_yes_emit":"是，并发送 KNX 电报。"},"common":{"ga":"组地址","dpt":"数据点类型","name":"名称","youtube_sample":"YouTube 示例","knx_gw":"KNX 网关","hue_bridge":"Hue Bridge","philips_hue":"飞利浦 HUE","read":"读取"}}}}

  // Editor definitions contain closure state. Cache one definition per profile
  // and RED editor instance, matching Node-RED's normal registration lifetime.
  // WeakMap prevents a discarded test/editor RED object from being retained.
  const definitionCaches = new WeakMap()

  const normalizeControllerType = (controllerType) => (
    Object.prototype.hasOwnProperty.call(PROFILE_TYPES, controllerType) ? controllerType : 'light'
  )

  const normalizeLocale = (locale) => {
    const value = String(locale || '').trim()
    if (!value) return 'en'
    if (/^zh(?:[-_]|$)/i.test(value)) return 'zh-CN'
    const shortLocale = value.split(/[-_]/)[0].toLowerCase()
    return Object.prototype.hasOwnProperty.call(PROFILE_TRANSLATIONS, shortLocale) ? shortLocale : 'en'
  }

  const currentLocale = (RED) => {
    // RED.settings is preferred. The DOM and browser language fallbacks cover
    // editor versions that do not expose the current language in settings.
    const candidates = [
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

  const translationLookup = (controllerType, key, RED, replacements) => {
    let selectedType = normalizeControllerType(controllerType)
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

  const translate = (controllerType, key, RED, replacements) => {
    const translated = translationLookup(controllerType, key, RED, replacements)
    if (translated !== undefined) return translated
    // Unknown keys may belong to Node-RED itself or the outer Controller. Only
    // those keys are allowed to fall through to the real editor translator.
    if (RED && typeof RED._ === 'function') {
      try { return RED._(key, replacements) } catch (error) { /* use the key below */ }
    }
    return key
  }

  const createDefinition = (controllerType, RED) => {
    const selectedType = normalizeControllerType(controllerType)
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
    if (!capturedDefinition) throw new Error('Unable to load HUE Controller editor profile: ' + selectedType)

    // Node-RED normally attaches a scoped translator while registering a type.
    // Because registration is captured, attach the equivalent private resolver.
    capturedDefinition._ = (key, replacements) => translate(selectedType, key, RED, replacements)
    return capturedDefinition
  }

  const getDefinition = (controllerType, RED) => {
    const selectedType = normalizeControllerType(controllerType)
    let cache = definitionCaches.get(RED)
    if (!cache) {
      cache = new Map()
      definitionCaches.set(RED, cache)
    }
    if (!cache.has(selectedType)) cache.set(selectedType, createDefinition(selectedType, RED))
    return cache.get(selectedType)
  }

  const getTemplate = (controllerType) => PROFILE_TEMPLATES[normalizeControllerType(controllerType)]

  // Expose only the narrow API consumed by knxUltimateHueController.html and
  // tests. The implementation tables remain private and cannot be mutated.
  return Object.freeze({
    PROFILE_TYPES,
    createDefinition,
    getDefinition,
    getTemplate,
    normalizeControllerType,
    translate
  })
}))
