---
layout: wiki
title: "HUE Light sensor"
lang: en
permalink: /wiki/HUE%20Light%20sensor
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

This node reads lux events from a Hue Light Sensor and maps them to KNX.

It emits the ambient illuminance (lux) each time it changes. Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Light Sensor | Hue Light Sensor to use (autocomplete while typing).|
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
