---
layout: wiki
title: "HUE Battery"
lang: en
permalink: /wiki/HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)

This node exposes the battery level of a Hue device to KNX and raises an event whenever the value changes.

Start typing the KNX device name or Group Address in the GA field; matching entries appear while you type. Use the refresh icon next to <q>Hue sensor</q> to reload the list from the Hue bridge after adding new devices.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the battery level (required before KNX mapping fields appear). |
| HUE Bridge | Hue bridge that hosts the device. |
| HUE Sensor | Hue device/sensor providing the battery level (supports autocomplete and refresh). |

**Mapping**

|Property|Description|
|--|--|
| Level | KNX GA for the battery percentage (0-100%). Recommended DPT: <b>5.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Read status at startup | On deploy/reconnect read the current battery value and publish it to KNX. Default: "yes”. |
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output stays enabled so Hue events continue to reach the flow. |

> ℹ️ KNX mapping widgets remain hidden until a KNX gateway is selected. This keeps the editor tidy when the node is used only to forward Hue events into Node-RED.
