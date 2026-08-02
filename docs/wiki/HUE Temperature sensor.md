---
layout: wiki
title: "HUE Temperature sensor"
lang: en
permalink: /wiki/HUE%20Temperature%20sensor
---
> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The orange migration button converts all legacy HUE nodes locally; afterwards it opens an editable email draft and the donation page in a new browser window. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK.

This node reads temperature (°C) from a Hue temperature sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue temperature sensor | Hue temperature sensor (autocomplete while typing) |
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
