---
layout: wiki
title: "HUE Camera motion"
lang: en
permalink: /wiki/HUE%20Camera%20motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Camera%20motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Camera%20motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Camera%20motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Camera%20motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Camera%20motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Camera%20motion)

The Hue Camera Motion node listens to Philips Hue camera motion services and mirrors the detected/not detected state to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Sensor | Hue camera motion sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read the current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA for camera motion (boolean). Recommended DPT: <b>1.001</b> |

### Outputs

1. Standard output
   : `msg.payload` (boolean): `true` when motion is detected; otherwise `false`

### Details

`msg.payload` carries the latest motion status reported by the Hue camera service.
