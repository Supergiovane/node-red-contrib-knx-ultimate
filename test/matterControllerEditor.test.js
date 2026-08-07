const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('Matter Controller editor flow-input section', () => {
  const projectRoot = path.resolve(__dirname, '..')
  const editor = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateMatterControllerDevice.html'), 'utf8')
  const knxEditor = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimate.html'), 'utf8')

  it('places the inline help below the node PIN selector instead of in a tab or modal', () => {
    expect(editor).not.to.include('href="#tabs-input"')
    expect(editor).not.to.include('id="tabs-input"')
    expect(editor).to.match(/id="node-input-enableNodePINS"[\s\S]*id="matter-flow-input-help"/)
    expect(editor).not.to.include('id="matter-input-help-button"')
    expect(editor).not.to.include('id="matter-input-help-dialog"')
  })

  it('shows the flow-input section only when a device and its flow PINs are enabled', () => {
    expect(editor).to.include('const knxSelected = hasKnxServerSelected()')
    expect(editor).to.include("setMatterTabVisible('tabs-mapped', !isUniversal && knxSelected && isMapped)")
    expect(editor).to.include("const showInputHelp = !isUniversal && hasHueDevice && $pinSelect.val() === 'yes'")
    expect(editor).to.include('$inputHelpPanel.toggle(showInputHelp)')
    expect(editor).to.include("$pinSelect.on('change.knxUltimateMatterControllerDevice', updateTabsVisibility)")
    expect(editor).to.include('const shouldShowTabs = !isUniversalMode() && hueDeviceSelected && hasVisibleTab')
  })

  it('opens the complete Matter device list when the populated picker is clicked', () => {
    expect(editor).to.include('mousedown.knxUltimateMatterControllerDevicePicker')
    expect(editor).to.include('if (!matterDevicePickerMouseDown)')
    expect(editor).to.include("setTimeout(() => $(input).autocomplete('search', ''), 0)")
    expect(editor).not.to.include("$deviceNameInput.autocomplete('search', `${$deviceNameInput.val()}exactmatch`)")
  })

  it('keeps the complete imported GA list open when the populated KNXUltimate topic field is clicked', () => {
    const blockStart = knxEditor.indexOf('$("#node-input-topic").autocomplete({')
    const blockEnd = knxEditor.indexOf('.autocomplete("instance")._renderItem', blockStart)
    const topicAutocomplete = knxEditor.slice(blockStart, blockEnd)

    expect(blockStart).to.be.greaterThan(-1)
    expect(blockEnd).to.be.greaterThan(blockStart)
    expect(topicAutocomplete).to.include('mousedown.knxUltimateTopicPicker')
    expect(topicAutocomplete).to.include('if (!topicPickerMouseDown)')
    expect(topicAutocomplete).to.include('setTimeout(function () {')
    expect(topicAutocomplete).to.include("$(input).autocomplete('search', '')")
    expect(topicAutocomplete).not.to.include("$(this).val() + 'exactmatch'")
  })

  it('keeps the section label and documentation aligned in every supported locale', () => {
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    const oldButtonLabels = {
      en: 'click **Supported input messages**',
      it: 'premi **Messaggi di input supportati**',
      de: 'auf **Unterstützte Eingangsnachrichten**',
      fr: "sur **Messages d'entrée pris en charge**",
      es: 'pulsa **Mensajes de entrada compatibles**',
      'zh-CN': '点击 **支持的输入消息**'
    }

    locales.forEach((locale) => {
      const messages = require(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateMatterControllerDevice.json'))
      expect(messages.knxUltimateMatterControllerDevice.input_help_label, `${locale}:section label`).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateMatterControllerDevice.input_help_light_hint, `${locale}:light hint`).to.be.a('string').and.not.equal('')

      const help = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateMatterControllerDevice.html'), 'utf8')
      const wikiName = locale === 'en' ? 'Control Matter from KNX.md' : `${locale}-Control Matter from KNX.md`
      const wiki = fs.readFileSync(path.join(projectRoot, 'docs/wiki', wikiName), 'utf8')
      expect(help, `${locale}:help`).to.include('{function,value}')
      expect(wiki, `${locale}:wiki`).to.include('{function,value}')
      expect(help, `${locale}:light flow input`).to.include('msg.dimming')
      expect(wiki, `${locale}:light flow input`).to.include('msg.dimming')
      expect(help, `${locale}:old help button`).not.to.include(oldButtonLabels[locale])
      expect(wiki, `${locale}:old wiki button`).not.to.include(oldButtonLabels[locale])
    })
  })

  it('shows capability-filtered, runtime-compatible flow messages for Matter lights', () => {
    expect(editor).to.include('const isMatterLight = !caps.profile')
    expect(editor).to.include('msg.on = { on: true }')
    expect(editor).to.include('msg.dimming = { brightness: 50 }')
    expect(editor).to.include('msg.color_temperature = { mirek: 370 }')
    expect(editor).to.include('msg.color = { xy: { x: 0.675, y: 0.322 } }')
    expect(editor).to.include("$('#matter-input-help-advanced-details').toggle(!isMatterLight)")
  })

  it('ships a safe semantic-input example without creating a new Matter fabric', () => {
    const examplePath = path.join(projectRoot, 'examples', 'Matter Controller - Semantic Flow Input.json')
    const flow = JSON.parse(fs.readFileSync(examplePath, 'utf8'))
    const controller = flow.find((node) => node.type === 'knxUltimateMatterControllerDevice')
    const injects = flow.filter((node) => node.type === 'inject')
    const functions = injects.map((node) => JSON.parse(node.props[0].v).function)

    expect(flow.some((node) => node.type === 'matter-config')).to.equal(false)
    expect(controller).to.include({
      serverMatter: '',
      matterNodeId: '',
      enableNodePINS: 'yes',
      inputs: 1,
      outputs: 1
    })
    expect(injects).to.have.length(7)
    expect(injects.every((node) => node.once === false)).to.equal(true)
    expect(functions).to.include.members(['onoff', 'level', 'position', 'setpoint', 'temperature', 'identify'])
  })
})
