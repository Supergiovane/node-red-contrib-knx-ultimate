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
