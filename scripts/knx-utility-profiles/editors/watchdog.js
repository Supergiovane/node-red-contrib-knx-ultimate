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
