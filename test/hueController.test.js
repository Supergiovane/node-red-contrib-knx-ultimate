const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const {
  RUNTIME_MODULES,
  captureRuntimeConstructor,
  normalizeControllerType
} = require('../nodes/utils/hueControllerProfileAdapter')
const hueControllerProfiles = require('../resources/hueControllerProfiles')
const hueControllerMigrationDialog = require('../resources/hueControllerMigrationDialog')
const {
  CONFIG_NODE_REFERENCE_FIELDS,
  LEGACY_NODE_PROFILES,
  copyTextToClipboard,
  convertLegacyHueFlow,
  convertLegacyHueFlowJson,
  isLegacyHueNode
} = require('../resources/hueControllerMigration')

describe('Unified HUE Controller', () => {
  const projectRoot = path.resolve(__dirname, '..')
  const supportedTypes = [
    'light',
    'plug',
    'button',
    'relative_rotary',
    'motion',
    'area_motion',
    'camera_motion',
    'contact',
    'light_level',
    'temperature',
    'humidity',
    'scene',
    'device_power',
    'zigbee_connectivity',
    'device_software_update'
  ]

  it('registers one controller alongside every dedicated Hue runtime', () => {
    const pkg = require('../package.json')
    const nodeKeys = Object.keys(pkg['node-red'].nodes)
    expect(nodeKeys).to.include('knxUltimateHueController')
    expect(nodeKeys).to.include('knxUltimateHueLight')
    expect(nodeKeys).to.include('knxUltimateHueCameraMotion')

    let registration
    require('../nodes/knxUltimateHueController')({
      nodes: {
        registerType: (type, constructor) => { registration = { type, constructor } }
      }
    })
    expect(registration.type).to.equal('knxUltimateHueController')
    expect(registration.constructor).to.be.a('function')
  })

  it('maps every supported function to a private runtime without loading a legacy node', () => {
    const RED = {
      nodes: {
        registerType: () => {}
      }
    }

    expect(Object.keys(RUNTIME_MODULES)).to.have.members(supportedTypes)
    supportedTypes.forEach((controllerType) => {
      expect(RUNTIME_MODULES[controllerType], controllerType).to.match(/^\.\/hueControllerProfiles\/runtime\//)
      expect(RUNTIME_MODULES[controllerType], controllerType).not.to.include('knxUltimateHue')
      expect(captureRuntimeConstructor(RED, controllerType), controllerType).to.be.a('function')
    })
  })

  it('builds the private editor bundle only from canonical Controller sources', () => {
    const { profiles, locales } = require('../scripts/hue-controller-profiles/catalog')
    const privateRoot = path.join(projectRoot, 'scripts/hue-controller-profiles')
    const generator = fs.readFileSync(path.join(projectRoot, 'scripts/generate-hue-controller-profiles.js'), 'utf8')
    const pkg = require('../package.json')

    expect(Object.keys(profiles)).to.have.members(supportedTypes)
    expect(locales).to.deep.equal(['en', 'it', 'de', 'fr', 'es', 'zh-CN'])
    expect(generator).to.include("const privateSourceRoot = path.join(__dirname, 'hue-controller-profiles')")
    expect(generator).not.to.include('runtimeOutputDirectory')
    expect(generator).not.to.include('legacyEditorPath')
    expect(generator).not.to.include('legacyRuntimePath')
    expect(pkg.scripts.test).to.include('hue-controller:check')

    supportedTypes.forEach((controllerType) => {
      expect(fs.existsSync(path.join(privateRoot, 'editors', `${controllerType}.js`)), `${controllerType} editor source`).to.equal(true)
      expect(fs.existsSync(path.join(privateRoot, 'templates', `${controllerType}.html`)), `${controllerType} template source`).to.equal(true)
      expect(fs.existsSync(path.join(projectRoot, 'nodes/utils/hueControllerProfiles/runtime', `${controllerType}.js`)), `${controllerType} runtime source`).to.equal(true)
      locales.forEach((locale) => {
        expect(fs.existsSync(path.join(privateRoot, 'locales', locale, `${controllerType}.json`)), `${controllerType} ${locale} locale source`).to.equal(true)
      })
    })
  })

  it('registers complete config selectors and profile defaults without legacy editor registrations', () => {
    const editorPath = path.join(projectRoot, 'nodes/knxUltimateHueController.html')
    const editor = fs.readFileSync(editorPath, 'utf8')
    const registrationScript = [...editor.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .find((match) => !/\bsrc\s*=/.test(match[1]) && match[2].includes("registerType('knxUltimateHueController'"))
    expect(registrationScript, 'controller registration script').not.to.equal(undefined)

    let registeredDefinition
    const RED = {
      nodes: {
        registerType: (type, definition) => {
          expect(type).to.equal('knxUltimateHueController')
          registeredDefinition = definition
        },
        node: () => undefined
      },
      _: (key) => key,
      settings: { lang: 'en' }
    }
    vm.runInNewContext(registrationScript[2], {
      RED,
      window: { KNXUltimateHueControllerProfiles: hueControllerProfiles },
      console,
      setTimeout,
      clearTimeout
    }, { filename: `${editorPath}#controller-registration` })

    expect(registeredDefinition).to.be.an('object')
    expect(registeredDefinition.defaults.server).to.deep.include({
      type: 'knxUltimate-config',
      required: false
    })
    expect(registeredDefinition.defaults.serverHue).to.deep.include({
      type: 'hue-config',
      required: true
    })
    expect(registeredDefinition.defaults).to.include.keys('hueDevice', 'inputs', 'outputs')
  })

  it('embeds every private editor template, definition, and supported locale', () => {
    expect(Object.keys(hueControllerProfiles.PROFILE_TYPES)).to.have.members(supportedTypes)
    const RED = {
      nodes: { node: () => undefined },
      _: (key) => key,
      settings: { lang: 'it' }
    }

    supportedTypes.forEach((controllerType) => {
      const definition = hueControllerProfiles.getDefinition(controllerType, RED)
      const template = hueControllerProfiles.getTemplate(controllerType)
      expect(definition.defaults, `${controllerType} defaults`).to.include.keys('server', 'serverHue')
      expect(definition.defaults.server.type, `${controllerType} KNX config`).to.equal('knxUltimate-config')
      expect(definition.defaults.serverHue.type, `${controllerType} Hue config`).to.equal('hue-config')
      expect(template, `${controllerType} template`).to.be.a('string').and.include('node-input-hueDevice')
      expect(definition._('common.knx_gw'), `${controllerType} Italian translation`).to.equal('Gateway KNX')
    })
  })

  it('converts pasted legacy Hue flow JSON while reusing referenced config nodes by default', () => {
    const source = [
      { id: 'tab-1', type: 'tab', label: 'Hue flow' },
      {
        id: 'legacy-light',
        type: 'knxUltimateHueLight',
        z: 'tab-1',
        server: 'knx-config',
        serverHue: 'hue-config',
        hueDevice: 'light-id#grouped_light',
        GALightSwitch: '1/2/3',
        enableNodePINS: 'yes',
        x: 240,
        y: 120,
        wires: [['debug-1']]
      },
      {
        id: 'legacy-button',
        type: 'knxUltimateHueButton',
        z: 'tab-1',
        serverHue: 'hue-config',
        hueDevice: 'button-id#button',
        x: 240,
        y: 220,
        wires: [['debug-1']]
      },
      { id: 'debug-1', type: 'debug', z: 'tab-1', x: 500, y: 180, wires: [] },
      { id: 'knx-config', type: 'knxUltimate-config', name: 'Secure KNX' },
      { id: 'hue-config', type: 'hue-config', name: 'Hue Bridge' },
      { id: 'unused-hue-config', type: 'hue-config', name: 'Unrelated Hue Bridge' }
    ]

    const result = convertLegacyHueFlow(source)
    expect(result.convertedCount).to.equal(2)
    expect(result.convertedByType).to.deep.equal({
      knxUltimateHueLight: 1,
      knxUltimateHueButton: 1
    })
    expect(source[1].type).to.equal('knxUltimateHueLight')
    expect(result.flow[1]).to.include({
      id: 'legacy-light',
      type: 'knxUltimateHueController',
      hueControllerType: 'light',
      server: 'knx-config',
      serverHue: 'hue-config',
      hueDevice: 'light-id#grouped_light',
      GALightSwitch: '1/2/3',
      inputs: 1,
      outputs: 1,
      x: 240,
      y: 120
    })
    expect(result.flow[1].wires).to.deep.equal([['debug-1']])
    expect(result.flow[2]).to.include({
      id: 'legacy-button',
      type: 'knxUltimateHueController',
      hueControllerType: 'button',
      inputs: 0,
      outputs: 1
    })
    expect(result.flow[2].wires).to.deep.equal([['debug-1']])
    expect(result.omittedConfigCount).to.equal(2)
    expect(result.omittedConfigByType).to.deep.equal({
      'knxUltimate-config': 1,
      'hue-config': 1
    })
    expect(result.flow.slice(3)).to.deep.equal([source[3], source[6]])
    expect(result.flow.some((node) => node.id === 'knx-config')).to.equal(false)
    expect(result.flow.some((node) => node.id === 'hue-config')).to.equal(false)
    expect(source).to.have.length(7)
  })

  it('can include config nodes for a different Node-RED installation without inventing credentials', () => {
    const source = [
      {
        id: 'legacy-light',
        type: 'knxUltimateHueLight',
        server: 'knx-config',
        serverHue: 'hue-config',
        wires: []
      },
      { id: 'knx-config', type: 'knxUltimate-config', name: 'KNX' },
      { id: 'hue-config', type: 'hue-config', name: 'Hue' }
    ]

    const result = convertLegacyHueFlow(source, { reuseConfigNodes: false })
    expect(result.omittedConfigCount).to.equal(0)
    expect(result.flow.slice(1)).to.deep.equal(source.slice(1))
    expect(result.flow[0]).to.include({
      type: 'knxUltimateHueController',
      server: 'knx-config',
      serverHue: 'hue-config'
    })
  })

  it('does not remove config nodes when the pasted flow has nothing to convert', () => {
    const source = [{ id: 'hue-config', type: 'hue-config', name: 'Hue' }]
    const result = convertLegacyHueFlow(source)
    expect(result.convertedCount).to.equal(0)
    expect(result.omittedConfigCount).to.equal(0)
    expect(result.flow).to.deep.equal(source)
  })

  it('covers every legacy Hue type and emits formatted pasteable JSON', () => {
    expect(CONFIG_NODE_REFERENCE_FIELDS).to.deep.equal({
      'knxUltimate-config': 'server',
      'hue-config': 'serverHue'
    })
    expect(Object.values(LEGACY_NODE_PROFILES).map((profile) => profile.controllerType)).to.have.members(supportedTypes)
    const source = Object.keys(LEGACY_NODE_PROFILES).map((type, index) => ({
      id: `legacy-${index}`,
      type,
      z: 'tab-1',
      enableNodePINS: index % 2 === 0 ? 'yes' : 'no',
      wires: []
    }))
    const result = convertLegacyHueFlowJson(JSON.stringify(source))
    expect(result.convertedCount).to.equal(supportedTypes.length)
    expect(result.json).to.equal(JSON.stringify(result.flow, null, 2))
    expect(result.flow.every((node) => node.type === 'knxUltimateHueController')).to.equal(true)
  })

  it('classifies legacy Hue nodes without treating the unified Controller as legacy', () => {
    Object.keys(LEGACY_NODE_PROFILES).forEach((type) => {
      expect(isLegacyHueNode({ type }), type).to.equal(true)
    })
    expect(isLegacyHueNode({ type: 'knxUltimateHueController' })).to.equal(false)
    expect(isLegacyHueNode({ type: 'debug' })).to.equal(false)
    expect(isLegacyHueNode(null)).to.equal(false)
  })

  it('rejects empty, malformed, and non-array migration input', () => {
    expect(() => convertLegacyHueFlowJson('')).to.throw('Paste a Node-RED flow')
    expect(() => convertLegacyHueFlowJson('{bad json')).to.throw()
    expect(() => convertLegacyHueFlowJson('{"type":"knxUltimateHueLight"}')).to.throw('JSON array')
  })

  it('copies converted JSON with the asynchronous Clipboard API', async () => {
    let copiedText
    const result = await copyTextToClipboard('[{"type":"tab"}]', {
      navigator: {
        clipboard: {
          writeText: async (value) => { copiedText = value }
        }
      },
      document: {
        execCommand: () => { throw new Error('fallback must not run') }
      }
    })

    expect(result).to.equal(true)
    expect(copiedText).to.equal('[{"type":"tab"}]')
  })

  it('falls back to a real temporary textarea when Clipboard API access is denied', async () => {
    const calls = []
    const body = {
      appendChild: (element) => {
        calls.push('append')
        element.parentNode = body
      },
      removeChild: (element) => {
        calls.push('remove')
        element.parentNode = null
      }
    }
    const temporary = {
      style: {},
      setAttribute: () => calls.push('attribute'),
      focus: () => calls.push('focus'),
      select: () => calls.push('select'),
      setSelectionRange: (start, end) => calls.push(`range:${start}:${end}`)
    }
    const result = await copyTextToClipboard('converted flow', {
      navigator: {
        clipboard: {
          writeText: async () => { throw new Error('permission denied') }
        }
      },
      document: {
        body,
        createElement: (tagName) => {
          expect(tagName).to.equal('textarea')
          return temporary
        },
        execCommand: (command) => {
          calls.push(command)
          return true
        }
      }
    })

    expect(result).to.equal(true)
    expect(temporary.value).to.equal('converted flow')
    expect(calls).to.include.members(['append', 'focus', 'select', 'range:0:14', 'copy', 'remove'])
    expect(calls.indexOf('remove')).to.be.greaterThan(calls.indexOf('copy'))
  })

  it('reports clipboard failure after cleaning up the temporary textarea', async () => {
    let removed = false
    const body = {
      appendChild: (element) => { element.parentNode = body },
      removeChild: (element) => {
        removed = true
        element.parentNode = null
      }
    }
    const temporary = {
      style: {},
      setAttribute: () => {},
      focus: () => {},
      select: () => {},
      setSelectionRange: () => {}
    }

    let failure
    try {
      await copyTextToClipboard('converted flow', {
        navigator: {},
        document: {
          body,
          createElement: () => temporary,
          execCommand: () => false
        }
      })
    } catch (error) {
      failure = error
    }
    expect(failure).to.be.an('error')
    expect(removed).to.equal(true)
  })

  it('boots the unchanged Hue Light path through the unified node', () => {
    let Controller
    const handlers = {}
    const hueClients = []
    const knxClients = []
    const knxServer = {
      addClient: (node) => knxClients.push(node),
      removeClient: () => {},
      sendKNXTelegramToKNXEngine: () => {}
    }
    const hueServer = {
      linkStatus: 'connected',
      addClient: (node) => hueClients.push(node),
      removeClient: () => {},
      hueManager: {
        writeHueQueueAdd: () => {},
        deleteHueQueue: () => {}
      },
      getAllLightsBelongingToTheGroup: async () => []
    }
    const RED = {
      nodes: {
        registerType: (_type, constructor) => { Controller = constructor },
        createNode: (node) => {
          node.on = (event, handler) => { handlers[event] = handler }
          node.status = () => {}
          node.error = () => {}
          node.send = () => {}
        },
        getNode: (id) => id === 'knx' ? knxServer : (id === 'hue' ? hueServer : undefined)
      },
      util: { cloneMessage: (msg) => ({ ...msg }) },
      log: { debug: () => {}, error: () => {} }
    }
    require('../nodes/knxUltimateHueController')(RED)

    const node = new Controller({
      server: 'knx',
      serverHue: 'hue',
      hueControllerType: 'light',
      hueDevice: 'light-id#light',
      colorAtSwitchOnDayTime: '{"kelvin":3000,"brightness":100}',
      colorAtSwitchOnNightTime: '{"kelvin":2700,"brightness":20}'
    })

    expect(node.hueControllerType).to.equal('light')
    expect(node.handleSend).to.be.a('function')
    expect(node.handleSendHUE).to.be.a('function')
    expect(handlers.close).to.be.a('function')
    expect(hueClients).to.deep.equal([node])
    expect(knxClients).to.deep.equal([node])
  })

  it('preserves the saved function and safely falls back to a light', () => {
    expect(normalizeControllerType({ hueControllerType: 'temperature' })).to.equal('temperature')
    expect(normalizeControllerType({ hueDevice: 'resource-id#grouped_light' })).to.equal('light')
    expect(normalizeControllerType({ hueDevice: 'resource-id#plug' })).to.equal('plug')
    expect(normalizeControllerType({ hueControllerType: 'unknown' })).to.equal('light')
  })

  it('keeps configuration-node selectors fixed and the device editor profile-driven', () => {
    const editor = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateHueController.html'), 'utf8')
    expect(editor).to.include('id="node-input-server"')
    expect(editor).to.include('id="node-input-serverHue"')
    expect(editor).to.include('id="node-input-hueControllerType"')
    expect(editor).to.include('id="node-input-hueControllerType" style="width:33.333%;"')
    expect(editor).to.include("definition.oneditprepare.call(legacyContext)")
    expect(editor).to.include("definition.oneditsave.call(legacyContext || this)")
    expect(editor).to.include("$profileContent.find('#node-input-server, #node-input-serverHue')")
    expect(editor).to.include('translateProfileEditor($container, controllerType, profile.nodeType)')
    expect(editor).to.include('node-red-contrib-knx-ultimate/${nodeType}:${translationKey}')
    expect(editor).to.include('resources/node-red-contrib-knx-ultimate/hueControllerProfiles.js')
    expect(editor).to.include("server: { value: '', type: 'knxUltimate-config', required: false }")
    expect(editor).to.include("serverHue: { value: '', type: 'hue-config', required: true }")
    expect(editor).to.include('profileBundle.getDefinition(controllerType, RED)')
    expect(editor).to.include('profileBundle.getTemplate(controllerType)')
    expect(editor).to.include('focusProfileHelp(controllerType)')
    expect(editor).to.include('document.getElementById(anchorId)')
    expect(editor).not.to.include('RED.nodes.getType')
    expect(editor).not.to.include('script[data-template-name=')
    expect(editor).to.include("controllerType === 'light'")
    expect(editor).to.include("$container.toggleClass('hue-controller-light-profile', controllerType === 'light')")
    expect(editor).not.to.include('data-hue-controller-temporary')
    expect(editor).not.to.include("$container.find('#waitWindow').hide()")
    expect(editor).not.to.include("$container.find('#mainWindow').show()")
    expect(editor).to.include("const KNX_EMPTY_SERVER_VALUES = new Set(['', 'none', '_add_', '__none__'])")
    expect(editor).to.include('KNX_EMPTY_SERVER_VALUES.has(normalizedServerValue)')
    expect(editor).to.include("$container.toggleClass('hue-controller-no-knx', knxDisabled)")
    expect(editor).to.include('#hue-controller-profile-editor.hue-controller-no-knx .hue-knx-section')
    expect(editor).to.include('#hue-controller-profile-editor.hue-controller-light-profile.hue-controller-no-knx #tabs')
    expect(editor).to.include("$container.find('select[id^=\"node-input-dpt\"]')")
    expect(editor).to.include("addClass('hue-controller-knx-mapping-row')")
    expect(editor).to.include('#hue-controller-profile-editor .hue-controller-knx-mapping-row')
    expect(editor).to.include('flex-wrap: nowrap !important;')
    expect(editor).to.include('width: 105px !important;')
    expect(editor).to.include('width: 115px !important;')
    expect(editor).to.include('input[type="text"][id^="node-input-name"]')
    expect(editor).to.include("change.knxUltimateHueControllerKnxVisibility")
    expect(editor).to.include("const TUTORIALS_URL = 'https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E'")
    expect(editor).to.include('resources/node-red-contrib-knx-ultimate/hueControllerMigration.js')
    expect(editor).to.include('resources/node-red-contrib-knx-ultimate/hueControllerMigrationDialog.js')
    expect(editor).to.include('id="hue-controller-migrate-legacy-flow"')
    expect(editor).to.include('#hue-controller-migrate-legacy-flow.red-ui-button')
    expect(editor).to.include('background: #d97706 !important;')
    expect(editor).to.include('outline: 3px solid #fbbf24;')
    expect(editor).to.include('migrationApi.convertLegacyHueFlowJson')
    expect(editor).to.include('migrationApi.copyTextToClipboard')
    expect(editor).not.to.include('RED.clipboard.copyText')
    expect(editor).to.include('outputElement.setSelectionRange(0, convertedJson.length)')
    expect(editor).to.include("reuseConfigNodes: $reuseConfigs.prop('checked')")
    expect(editor).to.include('editorContainsLegacyHueNodes')
    expect(editor).to.include("typeof RED.nodes.eachNode !== 'function'")
    expect(editor).to.include('migrationApi.isLegacyHueNode(node)')
    expect(editor).to.include("$('#hue-controller-migrate-legacy-flow-row').toggle(hasLegacyHueNodes)")
    expect(editor).to.include('id="hue-controller-migrate-legacy-flow-row" style="display:none;')
    expect(editor).not.to.include('RED.nodes.createExportableNodeSet')
    expect(editor).to.include('$profileContent.find(`a[href="${TUTORIALS_URL}"]`)')
    expect(editor).to.include("$container.find('.form-tips').remove()")
    expect(editor).not.to.match(/class=["'][^"']*\bform-tips\b/)
    const templateStart = editor.indexOf('<script type="text/html" data-template-name="knxUltimateHueController">')
    const gatewayField = editor.indexOf('id="node-input-server"', templateStart)
    const tutorialLink = editor.indexOf('PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E', templateStart)
    expect(tutorialLink).to.be.greaterThan(templateStart)
    expect(tutorialLink).to.be.lessThan(gatewayField)
    expect(editor).to.include('catalogDefaults: {')
    expect(editor).to.include('prepareProfileValues(nextType, nextDefinition)')
    expect(editor).to.include('profileDrafts[controllerNode.hueControllerType] = draft')
    expect(editor).not.to.include('legacyContext.type = profile.nodeType')
    supportedTypes.forEach((controllerType) => {
      expect(editor, controllerType).to.include(`${controllerType}: { nodeType:`)
      expect(editor, controllerType).to.include(`value="${controllerType}"`)
    })
  })

  it('loads light capabilities from the persisted Hue bridge during Controller bootstrap', () => {
    const privateLightEditor = fs.readFileSync(
      path.join(projectRoot, 'scripts/hue-controller-profiles/editors/light.js'),
      'utf8'
    )
    const generatedProfiles = fs.readFileSync(
      path.join(projectRoot, 'resources/hueControllerProfiles.js'),
      'utf8'
    )
    const legacyLightEditor = fs.readFileSync(
      path.join(projectRoot, 'nodes/knxUltimateHueLight.html'),
      'utf8'
    )

    // The outer Controller intentionally uses `_ADD_` as a short-lived
    // bootstrap sentinel. Capability discovery must bypass that DOM value and
    // use the actual persisted hue-config reference instead.
    expect(privateLightEditor).to.include('const capabilityServerId = resolveHueServerValue({ allowStored: true })')
    expect(privateLightEditor).to.include('serverId=${encodeURIComponent(capabilityServerId)}')
    expect(privateLightEditor).not.to.include('knxUltimateGetLightObject?id=" + initialHueDeviceRaw.split("#")[0] + "&serverId=" + $("#node-input-serverHue").val()')
    expect(generatedProfiles).to.include('const capabilityServerId = resolveHueServerValue({ allowStored: true })')

    // This correction belongs only to HUE Controller's private Light editor.
    expect(legacyLightEditor).not.to.include('const capabilityServerId = resolveHueServerValue({ allowStored: true })')
  })

  it('shows a bounded, cancellable Hue Bridge readiness wait in the Light profile', () => {
    const privateLightEditor = fs.readFileSync(
      path.join(projectRoot, 'scripts/hue-controller-profiles/editors/light.js'),
      'utf8'
    )
    const privateLightTemplate = fs.readFileSync(
      path.join(projectRoot, 'scripts/hue-controller-profiles/templates/light.html'),
      'utf8'
    )

    expect(privateLightTemplate).to.include('id="waitWindow"')
    expect(privateLightTemplate).to.include('fa-hourglass-start fa-spin-pulse')
    expect(privateLightTemplate).to.include('knxUltimateHueLight.connection_wait')
    expect(privateLightEditor).to.include('const HUE_CONNECTION_POLL_MS = 500')
    expect(privateLightEditor).to.include('const HUE_CONNECTION_MAX_ATTEMPTS = 20')
    expect(privateLightEditor).to.include('startHueConnectionWait()')
    expect(privateLightEditor).to.include('finishHueConnectionTimeout()')
    expect(privateLightEditor).to.include('node.__stopHueConnectionWait = stopHueConnectionWait')
    expect(privateLightEditor).to.include("this.__stopHueConnectionWait = null")
    expect(privateLightEditor).not.to.include('this.timerWaitBackEnd')
    ;['en', 'it', 'de', 'fr', 'es', 'zh-CN'].forEach((locale) => {
      const translations = require(path.join(
        projectRoot,
        'scripts/hue-controller-profiles/locales',
        locale,
        'light.json'
      ))
      expect(translations.knxUltimateHueLight.connection_wait, `${locale} wait label`).to.be.a('string').and.not.equal('')
      expect(translations.knxUltimateHueLight.connection_timeout, `${locale} timeout label`).to.be.a('string').and.not.equal('')
    })
  })

  it('exposes the unified node and its configuration references to the KNX AI Flow Builder', () => {
    const catalog = require('../nodes/knxUltimateAI').__test.buildKnxAiPackageNodeCatalog()
    const controller = catalog.find((entry) => entry.type === 'knxUltimateHueController')
    expect(controller).to.include({
      paletteLabel: 'HUE Controller',
      category: 'KNX Ultimate HUE',
      inputs: 0,
      outputs: 0
    })
    expect(controller.fields.server).to.deep.include({ isConfig: true, configType: 'knxUltimate-config' })
    expect(controller.fields.serverHue).to.deep.include({ isConfig: true, configType: 'hue-config' })
    expect(controller.fields).to.have.keys(
      'server',
      'serverHue',
      'name',
      'hueControllerType',
      'hueDevice',
      'enableNodePINS',
      'inputs',
      'outputs'
    )
  })

  it('keeps dedicated Hue nodes registered but hides them from the palette as deprecated', () => {
    const hueEditors = fs.readdirSync(path.join(projectRoot, 'nodes'))
      .filter((file) => /^knxUltimateHue(?!Controller).*\.html$/.test(file))
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    const legacyWikiNames = [
      'HUE Light.md',
      'HUE Plug.md',
      'HUE Button.md',
      'HUE Tapdial.md',
      'HUE Motion.md',
      'HUE Motion area.md',
      'HUE Camera motion.md',
      'HUE Contact sensor.md',
      'HUE Light sensor.md',
      'HUE Temperature sensor.md',
      'HUE Humidity sensor.md',
      'HUE Scene.md',
      'HUE Battery.md',
      'HUE Zigbee connectivity.md',
      'HUE Device software update.md'
    ]

    expect(hueEditors).to.have.length(15)
    hueEditors.forEach((file) => {
      const html = fs.readFileSync(path.join(projectRoot, 'nodes', file), 'utf8')
      expect(html, `${file} hidden palette category`).to.match(/category:\s*['"]deprecated['"]/)
      expect(html, `${file} legacy color`).to.match(/color:\s*['"]#E7E9F6['"]/)
      expect(html, `${file} palette`).to.match(/paletteLabel:\s*['"][^'"]+ \(deprecated\)['"]/)
      const functionLabelStart = html.indexOf('label: function')
      const methodLabelStart = html.indexOf('label()')
      const labelStart = functionLabelStart >= 0 ? functionLabelStart : methodLabelStart
      const paletteStart = html.indexOf('paletteLabel:', labelStart)
      expect(labelStart, `${file} label function`).to.be.at.least(0)
      expect(paletteStart, `${file} palette after label`).to.be.greaterThan(labelStart)
      expect(html.slice(labelStart, paletteStart), `${file} canvas label`).to.include('(deprecated)')
      const nodeType = path.basename(file, '.html')
      const templateStart = html.indexOf(`<script type="text/html" data-template-name="${nodeType}">`)
      const noticeStart = html.indexOf('class="form-row hue-legacy-controller-notice"', templateStart)
      const migrationActionStart = html.indexOf('class="form-row hue-legacy-migration-action"', templateStart)
      const tutorialStart = html.indexOf('PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E', templateStart)
      expect(templateStart, `${file} editor template`).to.be.at.least(0)
      expect(noticeStart, `${file} legacy notice`).to.be.greaterThan(templateStart)
      expect(migrationActionStart, `${file} migration action`).to.be.greaterThan(noticeStart)
      expect(tutorialStart, `${file} tutorial link`).to.be.greaterThan(migrationActionStart)
      expect(html.slice(noticeStart, migrationActionStart), `${file} localized notice`).to.include(
        'node-red-contrib-knx-ultimate/knxUltimateHueController:knxUltimateHueController.legacy_node_notice'
      )
      expect(html.slice(migrationActionStart, tutorialStart), `${file} shared migration button`).to.include('class="red-ui-button hue-legacy-migrate-flow"')
      expect((html.match(/class="red-ui-button hue-legacy-migrate-flow"/g) || []), `${file} single migration button`).to.have.length(1)

      locales.forEach((locale) => {
        const localizedHelp = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, file), 'utf8')
        expect(localizedHelp, `${locale}/${file} help`).to.include('(deprecated)')
      })
    })

    locales.forEach((locale) => {
      legacyWikiNames.forEach((wikiName) => {
        const localizedWikiName = locale === 'en' ? wikiName : `${locale}-${wikiName}`
        const localizedWiki = fs.readFileSync(path.join(projectRoot, 'docs/wiki', localizedWikiName), 'utf8')
        expect(localizedWiki, `${locale}/${wikiName} documentation`).to.include('(deprecated)')
      })
    })

    const controller = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateHueController.html'), 'utf8')
    expect(controller).to.match(/category:\s*['"]KNX Ultimate HUE['"]/)
    expect(controller).to.match(/color:\s*['"]#C0C7E9['"]/)
    expect(controller).to.include("paletteLabel: 'HUE Controller'")
    expect(controller).not.to.match(/paletteLabel:\s*['"]HUE Controller \(deprecated\)['"]/)
    expect(controller).to.include("$profileContent.find('.hue-legacy-controller-notice').remove()")
    expect(hueControllerMigrationDialog).to.have.keys('installLegacyButton', 'open')
    const sharedDialog = fs.readFileSync(path.join(projectRoot, 'resources/hueControllerMigrationDialog.js'), 'utf8')
    expect(sharedDialog).to.include("const BUTTON_SELECTOR = '.hue-legacy-migrate-flow'")
    expect(sharedDialog).to.include('migrationApi.convertLegacyHueFlowJson')
    expect(sharedDialog).to.include('migrationApi.copyTextToClipboard')
    expect(sharedDialog).not.to.include('RED.nodes.eachNode')
  })

  it('ships help, editor strings, and documentation in every supported language', () => {
    const locales = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    const wikiMenu = require('../scripts/wiki-menu.json')
    const wikiNavigation = require('../docs/_data/wiki-nav.json')
    const hueMenu = wikiMenu.sections.find((section) => section.key === 'hue')

    expect(hueMenu.items.map((item) => item.page)).to.deep.equal([
      'HUE Bridge configuration',
      'HUE Controller'
    ])

    locales.forEach((locale) => {
      const messages = require(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateHueController.json'))
      expect(messages.common, `${locale} common labels`).to.include.keys('knx_gw', 'hue_bridge')
      expect(messages.knxUltimateHueController.device_function, locale).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateHueController.legacy_node_notice, `${locale} legacy notice`).to.be.a('string').and.not.equal('')
      expect(messages.knxUltimateHueController, `${locale} migration labels`).to.include.keys(
        'migration_button',
        'migration_title',
        'migration_privacy',
        'migration_credentials_notice',
        'migration_reuse_configs',
        'migration_reuse_configs_help',
        'migration_input',
        'migration_convert',
        'migration_copy',
        'migration_copy_failed',
        'migration_output',
        'migration_summary',
        'migration_summary_reused',
        'migration_configs_included_warning',
        'migration_invalid'
      )
      expect(Object.keys(messages.knxUltimateHueController.types), locale).to.have.members(supportedTypes)
      expect(fs.existsSync(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateHueController.html')), locale).to.equal(true)
      const wikiName = locale === 'en' ? 'HUE Controller.md' : `${locale}-HUE Controller.md`
      expect(fs.existsSync(path.join(projectRoot, 'docs/wiki', wikiName)), locale).to.equal(true)
      const localizedHelp = fs.readFileSync(path.join(projectRoot, 'nodes/locales', locale, 'knxUltimateHueController.html'), 'utf8')
      const localizedWiki = fs.readFileSync(path.join(projectRoot, 'docs/wiki', wikiName), 'utf8')
      const homepage = fs.readFileSync(path.join(projectRoot, 'docs/_includes/homepage', `${locale}.html`), 'utf8')
      const hueNavigation = wikiNavigation[locale].find((section) => section.title === 'HUE')
      const permalinkPrefix = locale === 'en' ? '' : `${locale}-`
      expect(localizedHelp.toLowerCase(), `${locale} help KNX none`).to.include('none')
      expect(localizedWiki.toLowerCase(), `${locale} wiki KNX none`).to.include('none')
      expect(localizedHelp, `${locale} help light capabilities`).to.include('<code>dimming</code>')
      expect(localizedHelp, `${locale} help colour capabilities`).to.include('<code>color</code>')
      expect(localizedWiki, `${locale} docs light capabilities`).to.include('`dimming`')
      expect(localizedWiki, `${locale} docs colour capabilities`).to.include('`color`')
      expect(localizedHelp, `${locale} help bounded Hue wait`).to.match(/500[^\n<]*/)
      expect(localizedHelp, `${locale} help Hue timeout`).to.include('10')
      expect(localizedWiki, `${locale} docs bounded Hue wait`).to.match(/500[^\n]*/)
      expect(localizedWiki, `${locale} docs Hue timeout`).to.include('10')
      expect(localizedWiki, `${locale} docs front matter`).to.match(new RegExp(
        `^---\\nlayout: wiki\\ntitle: "HUE Controller"\\nlang: ${locale}\\npermalink: /wiki/${permalinkPrefix}HUE%20Controller\\n---\\n`
      ))
      expect(localizedWiki, `${locale} docs overview`).to.include('data-hue-controller-overview="hero"')
      expect(homepage, `${locale} homepage Controller card`).to.include('data-docs-node="hue-controller"')
      expect((homepage.match(/data-docs-node="hue-controller"/g) || []), `${locale} homepage single Controller card`).to.have.length(1)
      expect(homepage, `${locale} homepage legacy Hue links`).not.to.match(
        /\/wiki\/(?:it-|de-|fr-|es-|zh-CN-)?HUE%20(?:Light|Battery|Button|Contact|Device|Humidity|Motion|Plug|Camera|Scene|Tapdial|Temperature|Zigbee)/
      )
      expect(hueNavigation.items.map((item) => item.label), `${locale} HUE navigation`).to.deep.equal([
        'Bridge',
        'HUE Controller'
      ])
      expect(localizedHelp, `${locale} help wrapper`).to.match(
        /<script\b[^>]*data-help-name="knxUltimateHueController"[^>]*>[\s\S]*<\/script>/i
      )
      const helpProfiles = localizedHelp
        .split('<!-- HUE_CONTROLLER_PROFILE_HELP_START -->')[1]
        .split('<!-- HUE_CONTROLLER_PROFILE_HELP_END -->')[0]
      const docsProfiles = localizedWiki
        .split('<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->')[1]
        .split('<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->')[0]
      expect(helpProfiles, `${locale} copied legacy notices`).not.to.include('(deprecated)')
      expect(docsProfiles, `${locale} copied legacy notices`).not.to.include('(deprecated)')
      supportedTypes.forEach((controllerType) => {
        expect(helpProfiles, `${locale} help ${controllerType}`).to.include(
          `data-hue-controller-type="${controllerType}"`
        )
        expect(helpProfiles, `${locale} help link ${controllerType}`).to.include(
          `#hue-controller-help-${controllerType}`
        )
        expect(docsProfiles, `${locale} docs ${controllerType}`).to.include(
          `data-hue-controller-type="${controllerType}"`
        )
        expect(docsProfiles, `${locale} docs link ${controllerType}`).to.include(
          `#hue-controller-docs-${controllerType}`
        )
      })
    })

    const canonicalHelp = fs.readFileSync(path.join(projectRoot, 'nodes/knxUltimateHueController.html'), 'utf8')
    expect((canonicalHelp.match(/data-hue-controller-type=/g) || []), 'canonical profile help').to.have.length(15)
  })
})
