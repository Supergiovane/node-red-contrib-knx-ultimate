---
layout: wiki
title: "HUE Contact sensor"
lang: en
permalink: /wiki/HUE%20Contact%20sensor
---
> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

This node forwards events from a Hue contact sensor and maps them to KNX group addresses.

Start typing in the GA field, the name or group address of your KNX device, the avaiable devices start showing up while you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Contact Sensor | Hue contact sensor to be used (autocomplete while typing).|

| Property | Description |
|--|--|
| Contact | When the contact opens/closes, send KNX value: _true_ on active/open, otherwise _false_. |

### Outputs

1. Standard output
   : payload (boolean) : the standard output of the command.

### Details

`msg.payload` carries the raw Hue event (boolean/object). Use it for custom logic if needed.
