---
layout: wiki
title: "HUE Temperature sensor"
lang: en
permalink: /wiki/HUE%20Temperature%20sensor/
---
This node reads temperature (°C) from a HUE temperature sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| HUE Bridge | Select the HUE Bridge to be used |
| HUE Sensor | HUE temperature sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Temp | KNX GA for temperature in Celsius. Recommended DPT: <b>9.001</b> |

### Outputs

1. Standard output
   : `msg.payload` (number): current temperature in °C

### Details

`msg.payload` carries the numeric temperature value.
