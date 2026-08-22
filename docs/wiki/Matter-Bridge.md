---
layout: wiki
title: "Matter-Bridge"
lang: en
permalink: /wiki/Matter-Bridge
---
# Expose KNX to Matter

<div data-matter-bridge-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#073b3a 0%,#087f78 54%,#21b8a6 100%);box-shadow:0 14px 30px rgba(7,59,58,0.25);color:#f2fffd;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#c9fff7;">Matter bridge · KNX devices · Voice assistants</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Expose KNX to the Matter ecosystem.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f2fffd;">Each node turns one KNX or flow-backed function into a native Matter endpoint for Alexa, Google Home, Apple Home and other controllers. Pair the bridge once, then grow it device by device.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">19</strong><span style="font-size:0.76rem;color:#ddfffa;">Matter device profiles</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Pair once</strong><span style="font-size:0.76rem;color:#ddfffa;">one bridge QR code</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Live endpoints</strong><span style="font-size:0.76rem;color:#ddfffa;">no ordinary restart</span></div>
  </div>
</div>

## Nineteen profiles, one bridge

| Area | Matter profiles |
|---|---|
| **Lighting & power** | On/Off light, plug, dimmable light, RGB light and tunable-white light. |
| **Climate & environment** | Temperature, humidity, illuminance, air quality, thermostat, room air conditioner and fan. |
| **Presence & safety** | Occupancy, contact, door lock, smoke/CO and water-leak detection. |
| **Movement & automation** | Window covering and flow-driven robot vacuum. |

## Start in four steps

1. Configure and deploy one **Matter Bridge** configuration node.
2. Add an **Expose KNX to Matter** node for each device or virtual function.
3. Choose its profile, name and KNX group addresses, or enable flow-only PINs.
4. Pair the bridge QR code with the desired Matter controller; later endpoints reconcile live.

> Changing a device profile after pairing changes its Matter endpoint structure and may require re-pairing or a new exposed device.

## Technical overview

Each Expose KNX to Matter node exposes **one KNX device as a Matter device**: the paired controllers (Alexa, Google Home, Apple Home...) see it, with the name you typed, ready for app and voice control. Point it to a **Matter Bridge** configuration node (the actual bridge, paired once - the pairing QR code lives there) and add as many device nodes as you want, anywhere in your flows.

This is the opposite direction of the *Matter Device* node: there KNX controls a Matter device, here the Matter controllers control KNX.

Changing the device type after the bridge has been paired changes the Matter endpoint structure. Controllers may keep the old endpoint as unreachable; in that case reset/re-pair the bridge or create a new exposed device.

## Configuration

|Field|Description|
|--|--|
| Matter bridge | The Matter Bridge configuration node this device belongs to |
| KNX GW | KNX gateway used for telegrams. **Optional**: without it the device runs in flow-only mode via the node PINs. Auto-selected when your project has only one gateway |
| Name | What Alexa & Co. show and use for voice commands |
| Device type | The Matter device type (see below); it drives which group address fields appear |
| Read status at startup | Sends a `GroupValue_Read` to the status GAs at startup, so the Matter attributes are populated |

## Device types and group addresses

|Type|Group addresses|
|--|--|
| On/Off light, Plug | On/Off command GA, On/Off status GA (DPT 1.001) |
| Dimmable light | + Dimming % command/status GA (DPT 5.001) |
| RGB color light | + RGB color command/status GA (DPT 232.600). The Matter color (hue/saturation or XY, from the app color wheel) is converted to/from the KNX RGB triplet |
| Tunable white light | + Color temperature command/status GA in Kelvin (DPT 7.600) |
| Cover / Shutter | Up/Down (DPT 1.008), Stop (DPT 1.017), Position % command/status (DPT 5.001), optional position inversion |
| Thermostat (heating and/or cooling) | Current temperature GA, Setpoint command/status GA (DPT 9.001). Optionally add a Cooling setpoint command/status GA to also expose a Cool mode (dual-setpoint) |
| Room air conditioner | One Matter device combining On/Off (DPT 1.001), current temperature and heating/cooling setpoints (DPT 9.001), and fan speed % (DPT 5.001) command/status GAs |
| Fan / Ventilation | Fan speed % command/status GA (DPT 5.001) |
| Door lock | Lock/Unlock command GA and Locked/Unlocked status GA (DPT 1.001; `true` = locked) |
| Sensors (temperature, humidity, light, occupancy, contact) | One status GA each |
| Smoke/CO alarm | Smoke alarm status GA + optional CO alarm status GA (DPT 1.005): critical notifications on the phone |
| Water leak detector | Leak status GA (DPT 1.005) |
| Air quality sensor (CO2) | CO2 status GA in ppm (DPT 9.008); the air quality class (good/fair/moderate/poor...) is derived automatically |
| Robot vacuum | **Flow-only**: no group addresses. Enable the node PINs: assistant commands ("start cleaning", pause/resume/go home) arrive on the output as `rvcmode`/`rvccommand`; report the state back with `msg.payload = { function: "rvcstate", value: "running"|"docked"|"charging"|"paused"|"error" }` and the mode with `function: "rvcmode", value: "cleaning"|"idle"` |

- **Command GA**: written to the KNX bus when the assistant sends a command.
- **Status GA**: read from the bus to keep the Matter attributes (and the apps) updated.

## Advanced compatibility

These options are hidden unless they apply to the selected type. Dimmable devices can ignore the brightness command that some controllers send immediately after `On`. For covers, **Swap Open / Close** reverses both the binary KNX command and percentage direction. **Cover slider debounce** coalesces rapid intermediate targets before writing to KNX: `0` uses adaptive windows (400 ms for the first command, 150 ms for subsequent commands); `1`–`5000` forces one fixed window. Covers can also optimistically update the Matter position after a command, then correct it when the KNX status GA reports the real position.

## Node PINs

If you enable the node input/output PINs:

- **Input**: update the Matter state from the flow, without the KNX bus: `msg.payload = { function: "onoff", value: true }` (`function` is one of `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `coolingsetpoint`, `fanspeed`, `lock`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Useful to expose flow-computed values (e.g. a virtual sensor) to Alexa & Co.
- **Output**: every command received from a Matter controller is forwarded to the flow: `msg.topic` = device name, `msg.payload` = value, `msg.matter` = the raw command. A device without command GAs becomes a **flow-only device**.

## Notes

- The Matter identity of the device is tied to this node: deleting the node and creating a new one makes the apps see a brand-new device.
- Added/renamed/removed device nodes are picked up by the paired controllers within seconds, without re-pairing the bridge.
