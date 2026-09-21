---
layout: wiki
title: "HUE Battery"
lang: en
permalink: /wiki/HUE%20Battery
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

This node exposes the battery level of a Hue device to KNX and raises an event whenever the value changes.

Start typing the KNX device name or Group Address in the GA field; matching entries appear while you type. Use the refresh icon next to <q>Hue sensor</q> to reload the list from the Hue bridge after adding new devices.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the battery level (required before KNX mapping fields appear). |
| Hue Bridge | Hue Bridge that hosts the device. |
| Hue battery sensor | Hue device/sensor providing the battery level (supports autocomplete and refresh). |

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
