---
layout: wiki
title: "HUE Humidity sensor"
lang: en
permalink: /wiki/HUE%20Humidity%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Humidity%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Humidity%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Humidity%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Humidity%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Humidity%20sensor)

This node reads relative humidity (%) from a HUE humidity sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Sensor | HUE humidity sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Humidity | KNX GA for relative humidity %. Recommended DPT: <b>9.007</b> |

### Outputs

1. Standard output
   : `msg.payload` (number): current relative humidity in %

### Details

`msg.payload` carries the numeric humidity value (percentage).
