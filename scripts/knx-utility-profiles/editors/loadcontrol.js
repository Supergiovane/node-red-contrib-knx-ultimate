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
