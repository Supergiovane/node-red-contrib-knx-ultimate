'use strict'
// Builds the Node-RED test flow (nodes array) + a manifest, from a loaded config.
// Shared by buildTestFlow.js (writes flow.local.json for manual import) and
// nodeRedLiveTest.mjs (spawns Node-RED and drives it).

function buildFlow (cfg, { debugConsole = false } = {}) {
  const L = cfg.light
  const H = cfg.hue
  const T = cfg.test || {}

  const KNX_CFG = 'itest_knx_cfg'
  const HUE_CFG = 'itest_hue_cfg'
  const TAB = 'itest_tab'
  const nodes = []
  const injects = [] // ordered manifest: { id, name }
  let seq = 0
  const nid = (base) => `itest_${base}_${seq++}`

  nodes.push({ id: TAB, type: 'tab', label: 'KNX-Ultimate • Light live test', disabled: false, info: 'Auto-generated from config.local.json.' })

  // KNX gateway config node (full defaults + overrides)
  nodes.push({
    id: KNX_CFG, type: 'knxUltimate-config',
    host: cfg.knx.ipAddr, port: cfg.knx.ipPort || 3671, physAddr: cfg.knx.physAddr || '15.15.250',
    hostProtocol: cfg.knx.hostProtocol || 'TunnelUDP',
    suppressACKRequest: false, csv: '', KNXEthInterface: 'Auto', KNXEthInterfaceManuallyInput: '',
    stopETSImportIfNoDatapoint: 'fake', loglevel: 'error', name: 'KNX iTest GW',
    delaybetweentelegrams: 25, ignoreTelegramsWithRepeatedFlag: false, keyringFileXML: '',
    knxSecureSelected: false, secureCredentialsMode: 'keyring', tunnelIASelection: 'Auto',
    tunnelIA: '', tunnelInterfaceIndividualAddress: '', tunnelUserPassword: '', tunnelUserId: '',
    autoReconnect: 'yes', enableFlowBubbles: false, statusUpdateThrottle: '0',
    statusDateTimeFormat: 'legacy', statusDateTimeCustom: 'DD MMM HH:mm', statusDateTimeLocale: '',
    serialPortPath: '/dev/ttyAMA0', serialBaudRate: 19200, serialDataBits: 8, serialStopBits: 1,
    serialParity: 'even', serialRtscts: false, serialDtr: true, serialTimeout: 1200, isKBERRY: true
  })

  // Hue bridge config node (credentials inline — kept for manual import; the live
  // runner strips them into a separate credentials file).
  const hueCredentials = { username: H.username || '', clientkey: H.clientkey || '' }
  nodes.push({
    id: HUE_CFG, type: 'hue-config',
    host: H.host, bridgeid: H.bridgeid || '', name: 'Hue iTest Bridge',
    credentials: { ...hueCredentials }
  })

  // Device under test: the Hue Light node (engine = hue)
  const hueDevice = `${H.deviceId}${H.grouped ? '#grouped_light' : '#light'}`
  nodes.push({
    id: nid('huelight'), type: 'knxUltimateHueLight', z: TAB,
    server: KNX_CFG, serverHue: HUE_CFG, engine: 'hue',
    serverMatter: '', matterNodeId: '', matterEndpointId: 1,
    name: H.deviceName || 'Test Hue Light', hueDevice,
    nameLightSwitch: '', GALightSwitch: L.GALightSwitch, dptLightSwitch: L.dptLightSwitch,
    nameLightDIM: '', GALightDIM: '', dptLightDIM: '',
    nameLightBrightness: '', GALightBrightness: L.GALightBrightness, dptLightBrightness: L.dptLightBrightness,
    nameLightKelvin: '', GALightKelvin: L.GALightKelvin, dptLightKelvin: L.dptLightKelvin,
    nameLightColor: '', GALightColor: L.GALightColor, dptLightColor: L.dptLightColor,
    nameLightState: '', GALightState: L.GALightState, dptLightState: L.dptLightState,
    nameLightBrightnessState: '', GALightBrightnessState: L.GALightBrightnessState, dptLightBrightnessState: L.dptLightBrightnessState,
    nameLightKelvinState: '', GALightKelvinState: L.GALightKelvinState, dptLightKelvinState: L.dptLightKelvinState,
    nameLightColorState: '', GALightColorState: L.GALightColorState, dptLightColorState: L.dptLightColorState,
    specifySwitchOnBrightness: 'temperature', specifySwitchOnBrightnessNightTime: 'no',
    enableDayNightLighting: 'no', restoreDayMode: 'no',
    colorAtSwitchOnDayTime: '{"kelvin":3000,"brightness":100}',
    colorAtSwitchOnNightTime: '{"kelvin":2700,"brightness":20}',
    readStatusAtStartup: 'yes', dimSpeed: 5000, HSVDimSpeed: 5000,
    updateLocalStateFromKNXWrite: false,
    x: 470, y: 80, wires: [[]]
  })

  let yInj = 160
  function addInject (name, payload, payloadType, targetKnxId) {
    const id = nid('inj')
    nodes.push({
      id, type: 'inject', z: TAB, name,
      props: [{ p: 'payload' }], repeat: '', crontab: '', once: false, onceDelay: 0.1,
      topic: '', payload, payloadType, x: 160, y: yInj, wires: [[targetKnxId]]
    })
    injects.push({ id, name })
    yInj += 45
  }

  function addKnx (name, ga, dpt, x, y, wires) {
    const id = nid('knx')
    nodes.push({
      id, type: 'knxUltimate', z: TAB, server: KNX_CFG, name,
      topic: ga, outputtopic: '', dpt, initialread: 0,
      notifyreadrequest: false, notifyresponse: false, notifywrite: true,
      outputtype: 'write', inputRBE: 'false', outputRBE: 'false', passthrough: 'no',
      listenallga: '', x, y, wires: [wires || []]
    })
    return id
  }

  function addDebug (name, x, y) {
    const id = nid('dbg')
    nodes.push({
      id, type: 'debug', z: TAB, name, active: true, tosidebar: true, console: debugConsole,
      tostatus: true, complete: 'payload', targetType: 'msg', statusVal: 'payload', statusType: 'auto',
      x, y, wires: []
    })
    return id
  }

  const cmdEcho = addDebug('KNX echo (commands)', 900, 120)
  const knxSwitch = addKnx('CMD Switch', L.GALightSwitch, L.dptLightSwitch, 470, 160, [cmdEcho])
  addInject('Switch ON', 'true', 'bool', knxSwitch)

  if (L.GALightBrightness) {
    const knxBri = addKnx('CMD Brightness', L.GALightBrightness, L.dptLightBrightness, 470, 250, [cmdEcho])
    addInject(`Dim ${T.dimLowPct || 30}%`, String(T.dimLowPct || 30), 'num', knxBri)
    addInject('Dim 100%', '100', 'num', knxBri)
  }
  if (L.GALightKelvin) {
    const knxK = addKnx('CMD Kelvin', L.GALightKelvin, L.dptLightKelvin, 470, 340, [cmdEcho])
    addInject(`Warm ${T.warmKelvin || 2700}K`, String(T.warmKelvin || 2700), 'num', knxK)
    addInject(`Cold ${T.coldKelvin || 6000}K`, String(T.coldKelvin || 6000), 'num', knxK)
  }
  if (L.GALightColor) {
    const knxC = addKnx('CMD Colour', L.GALightColor, L.dptLightColor, 470, 430, [cmdEcho])
    addInject('Colour RED', JSON.stringify({ red: 255, green: 0, blue: 0 }), 'json', knxC)
    addInject('Colour BLUE', JSON.stringify({ red: 0, green: 0, blue: 255 }), 'json', knxC)
  }
  // Switch OFF last, on the switch GA node
  addInject('Switch OFF', 'false', 'bool', knxSwitch)

  // Feedback: KNX-in nodes on the state GAs -> debugs
  let yFb = 520
  const stateGAs = [
    { ga: L.GALightBrightnessState, dpt: L.dptLightBrightnessState, label: 'FB Brightness' },
    { ga: L.GALightKelvinState, dpt: L.dptLightKelvinState, label: 'FB Kelvin' },
    { ga: L.GALightColorState, dpt: L.dptLightColorState, label: 'FB Colour' }
  ]
  if (L.GALightState && L.GALightState !== L.GALightSwitch) {
    stateGAs.unshift({ ga: L.GALightState, dpt: L.dptLightState, label: 'FB On/Off' })
  }
  const feedbackLabels = []
  stateGAs.filter((s) => s.ga).forEach((s) => {
    const dbg = addDebug(s.label, 900, yFb)
    addKnx(s.label, s.ga, s.dpt, 470, yFb, [dbg])
    feedbackLabels.push(s.label)
    yFb += 60
  })

  return { nodes, injects, feedbackLabels, tab: TAB, knxConfigId: KNX_CFG, hueConfigId: HUE_CFG, hueCredentials, hueDevice }
}

// Matter variant: same inject/KNX/debug scaffold, but the device under test is the
// knxUltimateMatterLight node. IMPORTANT: matter-config derives its storage instance
// from ITS OWN node id (knxultimate-matter-<id>), so to open an ALREADY COMMISSIONED
// fabric the generated config node must reuse the production config node id
// (pass it via matterConfigId).
function buildMatterFlow (cfg, { debugConsole = false, matterConfigId = 'itest_matter_cfg' } = {}) {
  const L = cfg.light
  const M = cfg.matter || {}
  const T = cfg.test || {}

  const KNX_CFG = 'itest_knx_cfg'
  const MATTER_CFG = matterConfigId
  const TAB = 'itest_mtab'
  const nodes = []
  const injects = []
  let seq = 0
  const nid = (base) => `itestm_${base}_${seq++}`

  nodes.push({ id: TAB, type: 'tab', label: 'KNX-Ultimate • Matter Light live test', disabled: false, info: 'Auto-generated from config.local.json.' })

  nodes.push({
    id: KNX_CFG, type: 'knxUltimate-config',
    host: cfg.knx.ipAddr, port: cfg.knx.ipPort || 3671, physAddr: cfg.knx.physAddr || '15.15.250',
    hostProtocol: cfg.knx.hostProtocol || 'TunnelUDP',
    suppressACKRequest: false, csv: '', KNXEthInterface: 'Auto', KNXEthInterfaceManuallyInput: '',
    stopETSImportIfNoDatapoint: 'fake', loglevel: 'error', name: 'KNX iTest GW',
    delaybetweentelegrams: 25, ignoreTelegramsWithRepeatedFlag: false, keyringFileXML: '',
    knxSecureSelected: false, secureCredentialsMode: 'keyring', tunnelIASelection: 'Auto',
    tunnelIA: '', tunnelInterfaceIndividualAddress: '', tunnelUserPassword: '', tunnelUserId: '',
    autoReconnect: 'yes', enableFlowBubbles: false, statusUpdateThrottle: '0',
    statusDateTimeFormat: 'legacy', statusDateTimeCustom: 'DD MMM HH:mm', statusDateTimeLocale: '',
    serialPortPath: '/dev/ttyAMA0', serialBaudRate: 19200, serialDataBits: 8, serialStopBits: 1,
    serialParity: 'even', serialRtscts: false, serialDtr: true, serialTimeout: 1200, isKBERRY: true
  })

  nodes.push({
    id: MATTER_CFG, type: 'matter-config',
    name: 'Matter iTest Controller',
    fabricLabel: M.fabricLabel || 'KNX-Ultimate'
  })

  // Device under test: the Matter Light node (Hue-born UI/logic, Matter engine)
  nodes.push({
    id: nid('matterlight'), type: 'knxUltimateMatterLight', z: TAB,
    server: KNX_CFG, serverMatter: MATTER_CFG,
    matterNodeId: String(M.nodeId || ''), matterEndpointId: Number(M.endpointId || 1),
    name: M.deviceName || 'Test Matter Light',
    nameLightSwitch: '', GALightSwitch: L.GALightSwitch, dptLightSwitch: L.dptLightSwitch,
    nameLightState: '', GALightState: L.GALightState, dptLightState: L.dptLightState,
    nameLightDIM: '', GALightDIM: '', dptLightDIM: '',
    nameLightBrightness: '', GALightBrightness: L.GALightBrightness, dptLightBrightness: L.dptLightBrightness,
    nameLightBrightnessState: '', GALightBrightnessState: L.GALightBrightnessState, dptLightBrightnessState: L.dptLightBrightnessState,
    nameLightKelvin: '', GALightKelvin: L.GALightKelvin, dptLightKelvin: L.dptLightKelvin,
    nameLightKelvinState: '', GALightKelvinState: L.GALightKelvinState, dptLightKelvinState: L.dptLightKelvinState,
    nameLightColor: '', GALightColor: L.GALightColor, dptLightColor: L.dptLightColor,
    nameLightColorState: '', GALightColorState: L.GALightColorState, dptLightColorState: L.dptLightColorState,
    specifySwitchOnBrightness: 'temperature', specifySwitchOnBrightnessNightTime: 'no',
    enableDayNightLighting: 'no', restoreDayMode: 'no',
    colorAtSwitchOnDayTime: '{"kelvin":3000,"brightness":100}',
    colorAtSwitchOnNightTime: '{"kelvin":2700,"brightness":20}',
    readStatusAtStartup: 'yes', dimSpeed: 5000, HSVDimSpeed: 5000,
    minDimLevelLight: 10, maxDimLevelLight: 100,
    updateKNXBrightnessStatusOnHUEOnOff: 'onhueoff',
    updateLocalStateFromKNXWrite: true, enableNodePINS: 'no',
    x: 470, y: 80, wires: [[]]
  })

  let yInj = 160
  function addInject (name, payload, payloadType, targetKnxId) {
    const id = nid('inj')
    nodes.push({
      id, type: 'inject', z: TAB, name,
      props: [{ p: 'payload' }], repeat: '', crontab: '', once: false, onceDelay: 0.1,
      topic: '', payload, payloadType, x: 160, y: yInj, wires: [[targetKnxId]]
    })
    injects.push({ id, name })
    yInj += 45
  }
  function addKnx (name, ga, dpt, x, y, wires) {
    const id = nid('knx')
    nodes.push({
      id, type: 'knxUltimate', z: TAB, server: KNX_CFG, name,
      topic: ga, outputtopic: '', dpt, initialread: 0,
      notifyreadrequest: false, notifyresponse: false, notifywrite: true,
      outputtype: 'write', inputRBE: 'false', outputRBE: 'false', passthrough: 'no',
      listenallga: '', x, y, wires: [wires || []]
    })
    return id
  }
  function addDebug (name, x, y) {
    const id = nid('dbg')
    nodes.push({
      id, type: 'debug', z: TAB, name, active: true, tosidebar: true, console: debugConsole,
      tostatus: true, complete: 'payload', targetType: 'msg', statusVal: 'payload', statusType: 'auto',
      x, y, wires: []
    })
    return id
  }

  const cmdEcho = addDebug('KNX echo (commands)', 900, 120)
  const knxSwitch = addKnx('CMD Switch', L.GALightSwitch, L.dptLightSwitch, 470, 160, [cmdEcho])
  addInject('Switch ON', 'true', 'bool', knxSwitch)
  if (L.GALightBrightness) {
    const knxBri = addKnx('CMD Brightness', L.GALightBrightness, L.dptLightBrightness, 470, 250, [cmdEcho])
    addInject(`Dim ${T.dimLowPct || 30}%`, String(T.dimLowPct || 30), 'num', knxBri)
    addInject('Dim 100%', '100', 'num', knxBri)
  }
  if (L.GALightKelvin) {
    const knxK = addKnx('CMD Kelvin', L.GALightKelvin, L.dptLightKelvin, 470, 340, [cmdEcho])
    addInject(`Warm ${T.warmKelvin || 2700}K`, String(T.warmKelvin || 2700), 'num', knxK)
    addInject(`Cold ${T.coldKelvin || 6000}K`, String(T.coldKelvin || 6000), 'num', knxK)
  }
  if (L.GALightColor) {
    const knxC = addKnx('CMD Colour', L.GALightColor, L.dptLightColor, 470, 430, [cmdEcho])
    addInject('Colour RED', JSON.stringify({ red: 255, green: 0, blue: 0 }), 'json', knxC)
    addInject('Colour BLUE', JSON.stringify({ red: 0, green: 0, blue: 255 }), 'json', knxC)
  }
  addInject('Switch OFF', 'false', 'bool', knxSwitch)

  let yFb = 520
  const stateGAs = [
    { ga: L.GALightBrightnessState, dpt: L.dptLightBrightnessState, label: 'FB Brightness' },
    { ga: L.GALightKelvinState, dpt: L.dptLightKelvinState, label: 'FB Kelvin' },
    { ga: L.GALightColorState, dpt: L.dptLightColorState, label: 'FB Colour' }
  ]
  if (L.GALightState && L.GALightState !== L.GALightSwitch) {
    stateGAs.unshift({ ga: L.GALightState, dpt: L.dptLightState, label: 'FB On/Off' })
  }
  const feedbackLabels = []
  stateGAs.filter((s) => s.ga).forEach((s) => {
    const dbg = addDebug(s.label, 900, yFb)
    addKnx(s.label, s.ga, s.dpt, 470, yFb, [dbg])
    feedbackLabels.push(s.label)
    yFb += 60
  })

  return { nodes, injects, feedbackLabels, tab: TAB, knxConfigId: KNX_CFG, matterConfigId: MATTER_CFG }
}

module.exports = { buildFlow, buildMatterFlow }
