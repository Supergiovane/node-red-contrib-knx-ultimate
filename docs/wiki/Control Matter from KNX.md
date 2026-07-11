---
layout: wiki
title: "Control Matter from KNX"
lang: en
permalink: /wiki/Control%20Matter%20from%20KNX
---
# Matter Light/Outlet (BETA)

> This node is in **BETA**: behaviour can change while the Matter implementation is refined.

This node controls a Matter light or outlet and maps the supported Matter capabilities to KNX group addresses.

## Configuration

|Field|Description|
|--|--|
| KNX GW | KNX gateway used to write and answer the configured group addresses. It can be left empty when only Node-RED output is needed. |
| Matter controller | Matter controller configuration node where the device has been commissioned. |
| Matter Light/Outlet | Matter light or outlet selected from commissioned devices. The UI hides dimming, color or tunable-white sections when the selected endpoint does not expose those capabilities. |
| Switch | On/Off command and status group addresses, usually DPT `1.001`. |
| Dim | Brightness commands and status are available only for endpoints exposing `LevelControl`; percent values use DPT `5.001`. |
| Tunable White | Color temperature controls are available only for endpoints exposing the required Matter color-temperature capability. |
| RGB/HSV | RGB/HSV controls are available only for endpoints exposing Matter color capabilities. |
| Read at startup | Publishes the cached Matter value at deploy/startup or when the device reconnects. |
| Node Input/Output PINs | Shows Node-RED input/output pins. Input accepts boolean payloads and Matter-style `msg.payload` or `msg.on.on`; output emits state updates. |

## Behaviour

The node keeps a local cache from Matter updates and KNX writes, answers KNX read requests from that cache, and can emit/read values at startup.
