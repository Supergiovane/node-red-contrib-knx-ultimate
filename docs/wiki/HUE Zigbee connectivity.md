---
layout: wiki
title: "HUE Zigbee connectivity"
lang: en
permalink: /wiki/HUE%20Zigbee%20connectivity
---
> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The orange migration button converts all legacy HUE nodes locally; afterwards it opens an editable email draft and the donation page in a new browser window. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK.

This node retrieves the Zigbee connectivity status from a Hue device and exposes it to KNX.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the status. |
| Hue Bridge | Hue Bridge to query. |
| Hue zigbee connectivity | Hue sensor/device providing the Zigbee connectivity info. Autocomplete while typing. |

**Mapping**

|Property|Description|
|--|--|
| Status | KNX Group Address that reflects Zigbee connectivity. Becomes _true_ when connected, otherwise _false_. |
| Read status at startup | Reads current status at editor start/reconnection and emits to KNX. Default: "yes”. |

### Outputs

1. Standard output
   : payload (boolean): connectivity state.

### Details

`msg.payload` carries the boolean state (true/false).\
`msg.status` contains a textual status: one of **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .
