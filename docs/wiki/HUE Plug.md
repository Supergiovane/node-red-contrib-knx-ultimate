---
layout: wiki
title: "HUE Plug"
lang: en
permalink: /wiki/HUE%20Plug/
---
# Hue Plug / Outlet

## Overview

The Hue Plug node links a Philips Hue smart plug (service `plug`) with KNX group addresses so you can control power and track the state directly from the BUS.

- Supports **on/off control ** and**status feedback** .
- Optional mapping of the Hue `power_state` (on / standby).
- Can expose Node-RED input/output pins to forward Hue events to flows or send advanced API payloads.

## Configuration

|Field|Description|
|--|--|
| KNX GW | KNX gateway used for telegrams |
| HUE Bridge | Configured Hue bridge |
| Name | Select the Hue plug from the autocomplete list |
| Control | KNX GA for on/off commands (boolean DPT) |
| Status | GA for the on/off feedback coming from Hue |
| Power state | Optional GA mirroring Hue `power_state` (boolean/text) |
| Read status at startup | When enabled, the node emits the current plug state on deploy/connection |
| Node I/O pins | Enable Node-RED input/output pins. Input expects Hue API payloads (e.g. `{ on: { on: true } }`). Output forwards every Hue event. |

## KNX Mapping Tips

- Use a boolean datapoint (e.g. DPT 1.001) for both command and status.
- If you expose `power_state`, map it to a boolean GA (true = `on`, false = `standby`).
- For read requests (`GroupValue_Read`) the node returns the last cached Hue value.

## Flow Integration

When _Node I/O pins_ are enabled:

- **Input:** send Hue v2 payloads to perform advanced actions (e.g. `msg.on = { on: true }`).
- **Output:** receive an event object `{ payload: boolean, on, power_state, rawEvent }` whenever Hue reports a change.

## Hue API Reference

The node uses `/resource/plug/{id}` over HTTPS. Status changes are delivered via the Hue event stream and cached for KNX read responses.
