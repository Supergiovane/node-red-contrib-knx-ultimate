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
| Node Input/Output PINs | Shows Node-RED input/output pins. For mapped endpoints, Matter selectors belong directly to `msg`: `msg.clusterId` plus `msg.attribute` reads an attribute and emits its value as `msg.payload`; `msg.requestFromRemote = true` forces a device read. Add `msg.value` to write an attribute, or use `msg.clusterId`, `msg.command` and `msg.args` for a command. Numeric attribute ID `0` is valid. Door Lock accepts boolean `msg.payload` (`true` lock, `false` unlock). The selection is preserved when the editor is reopened. |

## Behaviour

The node keeps a local cache from Matter updates and KNX writes, answers KNX read requests from that cache, and can emit/read values at startup. Only the configured group addresses are listened to, so unrelated KNX traffic is ignored.
