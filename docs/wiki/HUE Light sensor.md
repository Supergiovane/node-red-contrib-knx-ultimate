---
layout: wiki
title: "HUE Light sensor"
lang: en
permalink: /wiki/HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)

This node reads lux events from a HUE Light Sensor and maps them to KNX.

It emits the ambient illuminance (lux) each time it changes. Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Sensor | HUE Light Sensor to use (autocomplete while typing).|
| Read status at startup | Read the status at startup and emit the event to the KNX bus at startup/reconnection. (Default "no")|

**Mapping**

| Property | Description |
|--|--|
| Lux | KNX GA that receives the lux value. |

### Outputs

1. Standard output
   : payload (number): current lux value.

### Details

`msg.payload` carries the numeric lux value. Use it for custom logic if needed.
