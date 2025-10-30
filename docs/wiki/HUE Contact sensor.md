---
layout: wiki
title: "HUE Contact sensor"
lang: en
permalink: /wiki/HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)

This node forwards events from a HUE contact sensor and maps them to KNX group addresses.

Start typing in the GA field, the name or group address of your KNX device, the avaiable devices start showing up while you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Sensor | HUE contact sensor to be used (autocomplete while typing).|

| Property | Description |
|--|--|
| Contact | When the contact opens/closes, send KNX value: _true_ on active/open, otherwise _false_. |

### Outputs

1. Standard output
   : payload (boolean) : the standard output of the command.

### Details

`msg.payload` carries the raw HUE event (boolean/object). Use it for custom logic if needed.
