RED.nodes.registerType('knxUltimateAutoResponder', {
  category: 'KNX Ultimate',
  color: '#C7E9C0',
  defaults: {
    server: { type: 'knxUltimate-config', required: true },
    name: { value: 'Auto responder', required: false },
    commandText: {
      value: '[]',
      required: false,
      validate: function (value) {
        try {
          const entries = JSON.parse(value)
          return Array.isArray(entries) && entries.every((entry) => (
            entry && typeof entry === 'object' &&
                            typeof entry.ga === 'string' && entry.ga.trim() !== '' &&
                            Object.prototype.hasOwnProperty.call(entry, 'default')
          ))
        } catch (error) { return false }
      }
    }
  },
  inputs: 0,
  outputs: 0,
  icon: 'node-knx-icon.svg',
  label: function () {
    return (this.name || 'KNX Auto Responder')
  },
  paletteLabel: 'KNX Auto Responder',
	        oneditprepare: function () {
	            // Go to the help panel
	            try {
	                RED.sidebar.show('help')
	            } catch (error) { }

	            const node = this

	            $('#node-input-commandText').typedInput({
	                type: 'json',
	                types: ['json']
	            })

	            try {
	                if (node.commandText !== undefined) {
	                    $('#node-input-commandText').typedInput('value', node.commandText)
	                }
	            } catch (error) { }
	        },
	        oneditsave: function () {
	            // Return to the info tab
	            try {
	                RED.sidebar.show('info')
	            } catch (error) { }

	            try {
	                this.commandText = $('#node-input-commandText').typedInput('value')
	            } catch (error) { }
	        },
  oneditcancel: function () {
    // Return to the info tab
    try {
      RED.sidebar.show('info')
    } catch (error) { }
  }
})
