---
layout: wiki
title: "HUE Motion area"
lang: en
permalink: /wiki/HUE%20Motion%20area
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

The Hue Motion Area node listens to MotionAware area motion events (Hue Bridge Pro) and mirrors the aggregated detected/not detected state to KNX or your Node-RED flow.

Start typing in the GA field (name or Group Address) to link the KNX GA; suggestions appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used. |
| HUE Bridge | Select the Hue Bridge Pro to be used. |
| HUE Area | MotionAware area (convenience or security) to monitor (autocomplete while typing). |
| Read status at startup | On startup/reconnect, read the current value and send it to KNX (default: yes). |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA for the area motion state (boolean). Recommended DPT: <b>1.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output pin stays enabled so MotionAware events still reach your flow. |

### Outputs

1. Standard output  
   : `msg.payload` (boolean): `true` when motion is detected in the area, otherwise `false`.

### Details

`msg.payload` carries the latest MotionAware area motion status (aggregated from the underlying sensors).
