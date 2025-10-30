🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
# Garage Door configuration
The **KNX Garage** node drives a motorised door using dedicated group addresses for direct commands, toggle impulses, hold-open / disable logic and safety sensors. It can optionally re-close the door after a timeout, emit movement / obstruction indicators and report events to the Node-RED flow.
## Group addresses
| Purpose | Property | Notes |
| -- | -- | -- |
| Direct command | `Command GA` (`gaCommand`) | Boolean GA: `true` opens, `false` closes. Default DPT 1.001. |
| Toggle impulse | `Impulse GA` (`gaImpulse`) | Rising edge toggles the door (default DPT 1.017). Used automatically if no direct command GA is supplied. |
| Hold-open override | `Hold-open GA` (`gaHoldOpen`) | When `true` the door remains open and the auto re-close timer is cancelled. |
| Disable node | `Disable GA` (`gaDisable`) | Blocks any command sent by the node while `true` (maintenance/manual operation). |
| Photocell sensor | `Photocell GA` (`gaPhotocell`) | Should go `true` when the beam is interrupted; the node reopens and raises obstruction. |
| Movement indicator | `Moving GA` (`gaMoving`) | Optional. Pulsed when the node commands movement so other devices can follow the state. |
| Obstruction flag | `Obstruction GA` (`gaObstruction`) | Mirrors the obstruction state for supervision or alarms. |
All addresses accept custom DPTs if different datatypes are required.
## Automatic re-close
* Enable **Auto re-close** to start a timer whenever the door becomes open.
* The countdown is cancelled while hold-open or disable are active.
* When the timer expires the node sends the close command (or impulse) and emits an `auto-close` event.
## Flow example
```javascript
// Open the door
msg.payload = 'open';
return msg;
```
```javascript
// Close the door
msg.payload = 'close';
return msg;
```
```javascript
// Toggle the door state
msg.payload = 'toggle';
return msg;
```
## Safety handling
* A photocell `true` during closing immediately triggers an open command and sets the obstruction flag.
* External writes to the obstruction GA update the internal state so dashboards stay in sync.
* Movement pulses can be consumed by lighting, ventilation or alarm logic.
## Flow interaction
* Injecting `msg.payload` with `true`, `false`, `'open'`, `'close'` or `'toggle'` controls the door from the flow.
* With **Emit events** active the node outputs structured messages:
```
{
  topic: <configured topic or command GA>,
  event: 'open' | 'close' | 'toggle' | 'auto-close' | 'obstruction' | 'disabled' | 'hold-open',
  state: 'open' | 'closed' | 'opening' | 'closing',
  disabled: <boolean>,
  holdOpen: <boolean>,
  obstruction: <boolean>
}
```
These events are useful for dashboards, logging or custom automations around the garage door.
