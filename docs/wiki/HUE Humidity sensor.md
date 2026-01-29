---
layout: wiki
title: "HUE Humidity sensor"
lang: en
permalink: /wiki/HUE%20Humidity%20sensor
---
This node reads relative humidity (%) from a Hue humidity sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Sensor | Hue humidity sensor (autocomplete while typing) |
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
