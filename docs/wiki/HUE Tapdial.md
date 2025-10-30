---
layout: wiki
title: "HUE Tapdial"
lang: en
permalink: /wiki/HUE%20Tapdial
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Tapdial) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Tapdial) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Tapdial) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Tapdial) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Tapdial) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Tapdial)

The **Hue Tap Dial** node maps the rotary service of the Hue Tap Dial to KNX and forwards the raw Hue events to your flow. Use the refresh icon beside the device field after pairing a new dial on the bridge.

### Tabs

- **Mapping** - select the KNX GA and DPT used for the rotation events. Supported datapoints: DPT 3.007 (relative dim), DPT 5.001 (absolute level 0‑100 %) and DPT 232.600 (vendor colour control).
- **Behaviour** - show or hide the Node-RED output pin. When no KNX gateway is configured the output is kept enabled so Hue events still reach the flow.

### General settings

|Property|Description|
|--|--|
| KNX GW | KNX gateway used for GA autocomplete. |
| HUE Bridge | Hue bridge hosting the Tap Dial. |
| Hue Tap Dial | Rotary device to control (autocomplete; refresh button reloads the list). |

### Mapping tab

|Property|Description|
|--|--|
| Rotate GA | KNX GA receiving rotation events (supports DPT 3.007, 5.001, 232.600). |
| Name | Friendly label for the GA. |

### Outputs

|#|Port|Payload|
|--|--|--|
|1|Standard output|`msg.payload` (object) Raw Hue event emitted by the Tap Dial.|

> ℹ️ KNX-specific widgets appear only after selecting a KNX gateway; the Mapping tab stays hidden until both the bridge and the gateway are configured.
