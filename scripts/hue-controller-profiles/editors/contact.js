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
