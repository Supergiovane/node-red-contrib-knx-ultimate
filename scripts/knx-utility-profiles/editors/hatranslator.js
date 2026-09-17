const defaultTranslations = 'on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false'

RED.nodes.registerType('knxUltimateHATranslator', {
  category: 'KNX Ultimate',
  defaults: {
    name: { value: '' },
    payloadPropName: { value: 'payload', required: false },
    haTranslationTable: { value: defaultTranslations, required: false }
  },
  inputs: 1,
  outputs: 1,
  icon: 'node-ha-icon.svg',
  label: function () { return this.name || 'HA -> KNX' },
  color: '#AED6F1',
  paletteLabel: 'Home Assistant translator',
  oneditprepare: function () {
    this.editor = RED.editor.createEditor({
      id: 'node-input-editorcommandText',
      mode: 'ace/mode/text',
      value: this.haTranslationTable === undefined || this.haTranslationTable === null ? defaultTranslations : this.haTranslationTable
    })
  },
  oneditsave: function () {
    // The Utility collects drafts before switching function. Cleanup is a
    // separate step, so repeated collection must leave Ace usable.
    if (this.editor) this.haTranslationTable = this.editor.getValue()
  },
  oneditresize: function () {
    if (this.editor) this.editor.resize()
  },
  oneditcancel: function () {
    // Called for both Done and Cancel, and whenever the profile unmounts.
    // Clear the reference first so cleanup remains idempotent.
    const editor = this.editor
    delete this.editor
    if (editor) editor.destroy()
  }
})
