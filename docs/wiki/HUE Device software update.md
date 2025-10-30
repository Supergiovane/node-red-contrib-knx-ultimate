---
layout: wiki
title: "HUE Device software update"
lang: en
permalink: /wiki/HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)

This node monitors whether a selected HUE device has a software update available and publishes the status to KNX.

Start typing the name or group address of your KNX device in the GA field, the avaiable devices start showing up while
you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Device | HUE device to monitor for software updates (autocomplete while typing).|

**Mapping**

| Property | Description |
|--|--|
| Status | KNX GA reflecting update status. _true_ if an update is available/ready/being installed, otherwise _false_. |
| Read status at startup | Read current status at startup/reconnection and emit to KNX (default "yes”). |

### Outputs

1. Standard output
   : payload (boolean): update flag.
   : status (string): one of **no\_update, update\_pending, ready\_to\_install, installing** .
