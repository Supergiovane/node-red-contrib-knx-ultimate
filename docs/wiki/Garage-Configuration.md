---
layout: wiki
title: "Garage-Configuration"
lang: en
permalink: /wiki/Garage-Configuration
---
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
