---
layout: wiki
title: "HUE Motion"
lang: en
permalink: /wiki/HUE%20Motion
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

This node listens to a Hue motion sensor and mirrors the events to KNX and/or your Node-RED flow.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type. Hit the refresh button next to "Hue sensor” to reload the device list from the bridge if you add new sensors.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway that receives the motion updates (required before KNX mapping fields appear). |
| Hue Bridge | Hue Bridge to query. |
| Hue motion sensor | Hue motion sensor (supports autocomplete and refresh). |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA that receives `true` when motion is detected and `false` when the area is clear. Recommended DPT: <b>1.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output pin stays enabled so Hue motion events still reach your flow. |

> ℹ️ KNX widgets remain hidden until you select a KNX gateway, making it easy to use the node purely as a Hue → Node-RED listener.

### Output

1. Standard output — `msg.payload` (boolean)
   : `true` on motion, `false` when motion ends.
