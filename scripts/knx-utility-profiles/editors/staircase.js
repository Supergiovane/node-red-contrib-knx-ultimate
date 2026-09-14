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
