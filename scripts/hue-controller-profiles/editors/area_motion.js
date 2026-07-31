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
