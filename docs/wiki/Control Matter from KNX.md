---
layout: wiki
title: "Control Matter from KNX"
lang: en
permalink: /wiki/Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> This node is in **BETA**: behaviour can change while the Matter implementation is refined.

This node controls a commissioned Matter endpoint from KNX. Select the Matter device and the editor detects its capabilities, then shows only the KNX mappings that make sense for that endpoint.

It replaces the unpublished per-device Matter controller nodes and keeps the full light UI when the selected endpoint is a light.

## Configuration

|Field|Description|
|--|--|
| KNX GW | KNX gateway used to write and answer the configured group addresses. It can be left empty when only Node-RED output is needed. |
| Matter controller | Matter controller configuration node where the device has been commissioned. |
| Matter device | Matter endpoint selected from commissioned devices. The UI is rebuilt from its real capabilities. |
| Switch / Plug / Light On-Off | On/Off command and status group addresses, usually DPT `1.001`. |
| Door Lock | A DPT `1.xxx` command GA invokes `lockDoor` for `true` and `unlockDoor` for `false`; a separate status GA receives only unambiguous Locked/Unlocked states. If the endpoint requires it, store the remote-operation PIN in the credential field. Commands not advertised by the endpoint are rejected. |
| Other endpoints | Window Covering, Thermostat, Fan and Switch endpoints use dedicated capability-selected profiles; Switch events such as initial/long/multi-press are exposed on the optional flow output. Plugs, On/Off actuators, sensors, battery, power and energy use the generic mapped fallback. The **Mappings** tab contains only functions advertised by the endpoint; leave a GA empty to disable it. |
| Light controls | For light endpoints, the same light UI is used: relative DIM (DPT `3.007`), brightness %, RGB/HSV, tunable white, switch-on brightness/temperature, day/night lighting, min/max dim level and dim speed. Unsupported sections are hidden. |
| Sensors | Sensor endpoints expose their measurement/status GA only when supported: temperature, humidity, illuminance, occupancy, contact and battery. |
| Read at startup | Publishes the cached Matter value at deploy/startup or when the device reconnects. |
| Update local state from KNX write | Updates the local Matter/KNX cache when a telegram is written on a configured KNX GA. |
| Node Input/Output PINs | Shows Node-RED input/output pins. Non-light endpoints accept the simple `{function,value}` contract and the existing advanced Matter selectors. The selection is preserved when the editor is reopened. |

## Flow input messages

Open the **Flow input** tab after selecting a non-light endpoint. The tab is generated from the endpoint's advertised structure and shows copyable simple examples, the selected Endpoint ID, every readable/writable attribute and every accepted command. It remains available when the node is used only by a flow without a KNX gateway.

Use `msg.payload = {function:"position",value:35}` to write in human units. Omit `value` to read a supported state, for example `{function:"temperature"}`; the result is emitted in `msg.payload`, with raw Matter details in `msg.matter`. Depending on the endpoint, functions can include `onoff`, `level`, `position`, `tiltposition`, `open`, `close`, `stop`, `setpoint`, `coolingsetpoint`, `currenttemp`, `fanspeed`, sensor readings and `identify`. Door Lock accepts `{function:"lock",value:true|false}`.

Existing flows remain compatible. Advanced messages still use top-level `msg.clusterId` with `msg.command`/`msg.args`, or `msg.attribute` with optional `msg.value`; `msg.requestFromRemote = true` forces a device read. Node ID and Endpoint ID are already selected by the node, although `msg.endpointId` can override the latter.

## Behaviour

The node keeps a local cache from Matter updates and KNX writes, answers KNX read requests from that cache, and can emit/read values at startup. Only the configured group addresses are listened to, so unrelated KNX traffic is ignored.

Commands are scheduled in a separate ordered lane for each commissioned device. An offline, timing-out or removed device therefore cannot delay other Matter devices that use the same KNX group address. A node that still references a removed device rejects the command immediately and shows **Device no longer commissioned** in red; select a valid Matter device or remove the stale Controller node.

An unavailable-device error is latched: further KNX and flow commands are ignored and cannot overwrite the red status. The node resumes automatically as soon as that Matter device reports `connected`; opening the node editor also clears the latch to allow a manual retry.
