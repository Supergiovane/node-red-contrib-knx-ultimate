'use strict'
// Live end-to-end test of the multimodal Light node, driven ENTIRELY over KNX.
//
// It talks ONLY to the KNX bus. Node-RED must be running with a Light node
// configured for your test device (engine = Hue OR Matter) and wired to the same
// group addresses as config.local.json. This harness:
//   1. writes the command GAs in a scripted sequence (on / dim / kelvin / colour / off)
//      -> you VISUALLY verify the real lamp reacts;
//   2. listens on the state GAs and prints the feedback telegrams the node sends back.
//
// Because it only speaks KNX, the SAME harness validates both the Hue and the Matter
// engine (Node-RED does the ecosystem work), with no Matter storage conflicts.
//
// Usage:
//   node test/integration/knxLightTest.js           # run the scripted sequence + listen
//   node test/integration/knxLightTest.js --listen  # only listen to state GAs (no commands)

const { loadConfig } = require('./lib/loadConfig')
const { connect, decode } = require('./lib/knxBus')

const cfg = loadConfig()
const L = cfg.light
const T = cfg.test || {}
const listenOnly = process.argv.includes('--listen')

// Two KNXnet/IP tunnels to the same gateway often can't see each other's telegrams
// (tunnel-to-tunnel isolation), so a second TUNNEL client next to Node-RED sees
// nothing. --multicast switches this harness to KNXnet/IP Routing, which shares the
// bus with Node-RED's tunnel (requires the gateway to support routing).
const useMulticast = process.argv.includes('--multicast')
const knxConn = useMulticast
  ? { ...cfg.knx, hostProtocol: 'Multicast', ipAddr: cfg.knx.multicastAddr || '224.0.23.12' }
  : cfg.knx

const stepDelay = T.stepDelayMs || 4000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ts = () => new Date().toLocaleTimeString()

// Map every configured state GA to a label + dpt, so incoming feedback is decoded.
const stateGAs = [
  { ga: L.GALightState, dpt: L.dptLightState, label: 'On/Off state' },
  { ga: L.GALightBrightnessState, dpt: L.dptLightBrightnessState, label: 'Brightness state' },
  { ga: L.GALightKelvinState, dpt: L.dptLightKelvinState, label: 'Kelvin state' },
  { ga: L.GALightColorState, dpt: L.dptLightColorState, label: 'Colour state' }
].filter((s) => s.ga)

const feedbackSeen = new Set()

// Our own KNX physical address: telegrams with this src are our own echoes and must
// NOT be counted as node feedback (fixes the false On/Off "received" when a command GA
// doubles as the state GA).
const ourPhysAddr = cfg.knx.physAddr || '15.15.250'

// Every GA the node touches — used to detect that Node-RED is actually on the bus.
const allGAs = new Set([
  L.GALightSwitch, L.GALightBrightness, L.GALightKelvin, L.GALightColor,
  L.GALightState, L.GALightBrightnessState, L.GALightKelvinState, L.GALightColorState
].filter(Boolean))

let nodeSeen = false // set once we hear ANY telegram from Node-RED (src != ours)

function onTelegram ({ evt, dest, src, raw }) {
  const fromNode = src && src !== ourPhysAddr && allGAs.has(dest)
  if (fromNode) nodeSeen = true
  if (evt === 'GroupValue_Read') return
  const match = stateGAs.find((s) => s.ga === dest)
  if (!match || !fromNode) return // only genuine node-originated telegrams are feedback
  feedbackSeen.add(match.label)
  console.log(`\x1b[34m[${ts()}] FEEDBACK  ${match.label.padEnd(18)} ${dest} = ${JSON.stringify(decode(raw, match.dpt))}  (src ${src})\x1b[0m`)
}

let client

// Readiness handshake (KNX-only): probe the state GAs with read requests until the
// Node-RED Light node answers. The node only replies once it is deployed AND its Hue
// device is synced, so this waits for "both KNX and Hue connected" before we command.
async function waitForNode () {
  const timeoutMs = T.readyTimeoutMs || 30000
  const probeGAs = (stateGAs.length ? stateGAs.map((s) => s.ga) : [L.GALightSwitch]).filter(Boolean)
  const deadline = Date.now() + timeoutMs
  console.log(`\nWaiting for the Node-RED Light node (KNX + Hue) to be ready — probing ${probeGAs.join(', ')} ...`)
  while (Date.now() < deadline && !nodeSeen) {
    probeGAs.forEach((ga) => { try { client.read(ga) } catch (error) { /* empty */ } })
    await sleep(2500)
  }
  return nodeSeen
}

async function writeCmd (ga, dpt, payload, human) {
  if (!ga) { console.log(`\x1b[90m  (skip: ${human} — no GA configured)\x1b[0m`); return }
  console.log(`\x1b[33m[${ts()}] COMMAND   ${human}  ->  ${ga} = ${JSON.stringify(payload)} [${dpt}]\x1b[0m`)
  client.write(ga, payload, dpt)
  await sleep(stepDelay)
}

async function runSequence () {
  console.log('\n=== Scripted sequence — WATCH THE LAMP ===\n')
  await writeCmd(L.GALightSwitch, L.dptLightSwitch, true, 'Switch ON (lamp should turn on)')
  await writeCmd(L.GALightBrightness, L.dptLightBrightness, T.dimLowPct || 30, `Dim to ${T.dimLowPct || 30}%`)
  await writeCmd(L.GALightBrightness, L.dptLightBrightness, 100, 'Dim to 100%')
  await writeCmd(L.GALightKelvin, L.dptLightKelvin, T.warmKelvin || 2700, `Warm white ${T.warmKelvin || 2700}K`)
  await writeCmd(L.GALightKelvin, L.dptLightKelvin, T.coldKelvin || 6000, `Cold white ${T.coldKelvin || 6000}K`)
  await writeCmd(L.GALightColor, L.dptLightColor, { red: 255, green: 0, blue: 0 }, 'Colour RED')
  await writeCmd(L.GALightColor, L.dptLightColor, { red: 0, green: 0, blue: 255 }, 'Colour BLUE')
  await writeCmd(L.GALightSwitch, L.dptLightSwitch, false, 'Switch OFF (lamp should turn off)')

  console.log('\nWaiting a few seconds for trailing feedback...')
  await sleep(6000)

  console.log('\n=== Summary ===')
  if (stateGAs.length === 0) {
    console.log('  No state GAs configured, so no feedback was expected.')
  } else {
    stateGAs.forEach((s) => {
      const ok = feedbackSeen.has(s.label)
      console.log(`  ${ok ? '\x1b[32m✔' : '\x1b[31m✗'} ${s.label} (${s.ga})\x1b[0m ${ok ? 'received' : 'NOT received'}`)
    })
  }
  console.log('')
}

console.log(`KNX ${useMulticast ? 'ROUTING (multicast)' : 'TUNNEL'}:`, knxConn.ipAddr, '| listening state GAs:', stateGAs.map((s) => s.ga).join(', ') || '(none)')
if (listenOnly) console.log('Mode: LISTEN ONLY (no commands will be sent)')
if (!useMulticast) console.log('Tip: if nothing moves while Node-RED runs on the same gateway, retry with:  npm run avviaquesto-itest:knxbus -- --multicast')

// Watchdog: if we never connect, don't hang forever.
const watchdog = setTimeout(() => {
  console.error('\n[KNX] Could not connect within 15s. Check knx.ipAddr/hostProtocol, the network, or a busy tunnel slot (Node-RED may hold the only tunnel — try hostProtocol "Multicast").')
  process.exit(1)
}, 15000)

client = connect(knxConn, {
  onTelegram,
  onConnected: async () => {
    clearTimeout(watchdog)
    if (listenOnly) { console.log('Listening for feedback telegrams... (Ctrl+C to exit)'); return }
    await sleep(500)
    const ready = await waitForNode()
    if (!ready) {
      console.error('\n\x1b[31m✗ Node-RED Light node NOT detected on the bus.\x1b[0m Commands not sent.')
      console.error('  This harness needs to SHARE the KNX bus with Node-RED. It cannot when:')
      console.error('   - the gateway is a tunnelling-only interface (a second tunnel/multicast is isolated), or')
      console.error('   - Node-RED runs on another host and the gateway does not bridge the two connections.')
      console.error('  In those setups (very common), test with the FLOW instead: press the inject')
      console.error('  buttons in the imported flow.local.json inside Node-RED and watch the lamp + debug.')
      console.error('  The harness works when it can share the bus (e.g. a real KNXnet/IP Router with routing on).')
      try { client.Disconnect() } catch (error) { /* empty */ }
      setTimeout(() => process.exit(1), 500)
      return
    }
    console.log('\x1b[32m✔ Node is ready.\x1b[0m Starting the command sequence.')
    try { await runSequence() } catch (error) { console.error('Sequence error:', error.message) }
    console.log('Disconnecting...')
    try { client.Disconnect() } catch (error) { /* empty */ }
    setTimeout(() => process.exit(0), 500)
  }
})

process.on('SIGINT', () => {
  console.log('\nDisconnecting...')
  try { client.Disconnect() } catch (error) { /* empty */ }
  process.exit(0)
})
