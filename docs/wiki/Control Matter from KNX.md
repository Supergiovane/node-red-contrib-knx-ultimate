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
| Other endpoints | Plugs, On/Off actuators, covers, thermostats, fans, environmental/contact/occupancy sensors, battery, power and energy endpoints use the multi-purpose mapped profile. The dedicated **Mappings** tab contains only mappings backed by clusters, attributes and commands advertised by that endpoint; leave a GA empty to disable it. |
| Light controls | For light endpoints, the same light UI is used: relative DIM (DPT `3.007`), brightness %, RGB/HSV, tunable white, switch-on brightness/temperature, day/night lighting, min/max dim level and dim speed. Unsupported sections are hidden. |
| Sensors | Sensor endpoints expose their measurement/status GA only when supported: temperature, humidity, illuminance, occupancy, contact and battery. |
| Read at startup | Publishes the cached Matter value at deploy/startup or when the device reconnects. |
| Update local state from KNX write | Updates the local Matter/KNX cache when a telegram is written on a configured KNX GA. |
| Node Input/Output PINs | Shows Node-RED input/output pins. Input accepts boolean payloads and Matter-style `msg.payload` or `msg.on.on`; output emits state updates. |

## Behaviour

The node keeps a local cache from Matter updates and KNX writes, answers KNX read requests from that cache, and can emit/read values at startup. Only the configured group addresses are listened to, so unrelated KNX traffic is ignored.
