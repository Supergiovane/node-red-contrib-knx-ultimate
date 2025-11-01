---
layout: wiki
title: "HUE Zigbee connectivity"
lang: en
permalink: /wiki/HUE%20Zigbee%20connectivity/
---
This node retrieves the Zigbee connectivity status from a HUE device and exposes it to KNX.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the status. |
| HUE Bridge | HUE Bridge to query. |
| HUE Sensor | HUE sensor/device providing the Zigbee connectivity info. Autocomplete while typing. |

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
