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
