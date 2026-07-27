const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('Matter Controller editor flow-input tab', () => {
  const projectRoot = path.resolve(__dirname, '..')
  const editor = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateMatterControllerDevice.html'), 'utf8')

  it('uses an inline editor tab instead of a modal help button', () => {
    expect(editor).to.include('href="#tabs-input"')
    expect(editor).to.include('id="tabs-input"')
    expect(editor).to.include("setMatterTabVisible('tabs-input', !isUniversal && hasHueDevice")
    expect(editor).not.to.include('id="matter-input-help-button"')
    expect(editor).not.to.include('id="matter-input-help-dialog"')
  })

  it('keeps the flow-input tab available without a KNX gateway', () => {
    expect(editor).to.include('const knxSelected = hasKnxServerSelected()')
    expect(editor).to.include("setMatterTabVisible('tabs-mapped', !isUniversal && knxSelected && isMapped)")
    expect(editor).to.include("setMatterTabVisible('tabs-input', !isUniversal && hasHueDevice && (isMapped || isDoorLock))")
    expect(editor).to.include('const shouldShowTabs = !isUniversalMode() && hueDeviceSelected && hasVisibleTab')
  })

  it('keeps the tab label and documentation aligned in every supported locale', () => {
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
      expect(messages.knxUltimateMatterControllerDevice.input_help_label, `${locale}:tab label`).to.be.a('string').and.not.equal('')

      const help = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateMatterControllerDevice.html'), 'utf8')
      const wikiName = locale === 'en' ? 'Control Matter from KNX.md' : `${locale}-Control Matter from KNX.md`
      const wiki = fs.readFileSync(path.join(projectRoot, 'docs/wiki', wikiName), 'utf8')
      expect(help, `${locale}:help`).to.include('{function,value}')
      expect(wiki, `${locale}:wiki`).to.include('{function,value}')
      expect(help, `${locale}:old help button`).not.to.include(oldButtonLabels[locale])
      expect(wiki, `${locale}:old wiki button`).not.to.include(oldButtonLabels[locale])
    })
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
