---
layout: wiki
title: "HUE Device software update"
lang: en
permalink: /wiki/HUE%20Device%20software%20update
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

This node monitors whether a selected Hue device has a software update available and publishes the status to KNX.

Start typing the name or group address of your KNX device in the GA field, the avaiable devices start showing up while
you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue device | Hue device to monitor for software updates (autocomplete while typing).|

**Mapping**

| Property | Description |
|--|--|
| Status | KNX GA reflecting update status. _true_ if an update is available/ready/being installed, otherwise _false_. |
| Read status at startup | Read current status at startup/reconnection and emit to KNX (default "yes”). |

### Outputs

1. Standard output
   : payload (boolean): update flag.
   : status (string): one of **no\_update, update\_pending, ready\_to\_install, installing** .
