---
layout: wiki
title: "Matter-Bridge"
lang: en
permalink: /wiki/Matter-Bridge
---
# Expose KNX to Matter (BETA)

> This node is in **BETA**: it works, but details may still change between releases.

## Overview

Each Expose KNX to Matter node exposes **one KNX device as a Matter device**: the paired controllers (Alexa, Google Home, Apple Home...) see it, with the name you typed, ready for app and voice control. Point it to a **Matter Bridge** configuration node (the actual bridge, paired once - the pairing QR code lives there) and add as many device nodes as you want, anywhere in your flows.

This is the opposite direction of the *Matter Device* node: there KNX controls a Matter device, here the Matter controllers control KNX.

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
| Thermostat (heating) | Current temperature GA, Setpoint command/status GA (DPT 9.001) |
| Fan / Ventilation | Fan speed % command/status GA (DPT 5.001) |
| Sensors (temperature, humidity, light, occupancy, contact) | One status GA each |
| Smoke/CO alarm | Smoke alarm status GA + optional CO alarm status GA (DPT 1.005): critical notifications on the phone |
| Water leak detector | Leak status GA (DPT 1.005) |
| Air quality sensor (CO2) | CO2 status GA in ppm (DPT 9.008); the air quality class (good/fair/moderate/poor...) is derived automatically |
| Robot vacuum | **Flow-only**: no group addresses. Enable the node PINs: assistant commands ("start cleaning", pause/resume/go home) arrive on the output as `rvcmode`/`rvccommand`; report the state back with `msg.payload = { function: "rvcstate", value: "running"|"docked"|"charging"|"paused"|"error" }` and the mode with `function: "rvcmode", value: "cleaning"|"idle"` |

- **Command GA**: written to the KNX bus when the assistant sends a command.
- **Status GA**: read from the bus to keep the Matter attributes (and the apps) updated.

## Advanced compatibility

These options are hidden unless they apply to the selected type. Dimmable devices can ignore the brightness command that some controllers send immediately after `On`. Covers can optimistically update the Matter position after a command, then correct it when the KNX status GA reports the real position.

## Node PINs

If you enable the node input/output PINs:

- **Input**: update the Matter state from the flow, without the KNX bus: `msg.payload = { function: "onoff", value: true }` (`function` is one of `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `fanspeed`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Useful to expose flow-computed values (e.g. a virtual sensor) to Alexa & Co.
- **Output**: every command received from a Matter controller is forwarded to the flow: `msg.topic` = device name, `msg.payload` = value, `msg.matter` = the raw command. A device without command GAs becomes a **flow-only device**.

## Notes

- The Matter identity of the device is tied to this node: deleting the node and creating a new one makes the apps see a brand-new device.
- Added/renamed/removed device nodes are picked up by the paired controllers within seconds, without re-pairing the bridge.
