---
layout: wiki
title: "HUE Camera motion"
lang: en
permalink: /wiki/HUE%20Camera%20motion
---
> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The orange migration button converts all legacy HUE nodes locally; afterwards it opens an editable email draft and the donation page in a new browser window. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK.

The Hue Camera Motion node listens to Philips Hue camera motion services and mirrors the detected/not detected state to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Camera Motion | Hue camera motion sensor (autocomplete while typing) |
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
