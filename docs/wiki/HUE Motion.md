---
layout: wiki
title: "HUE Motion"
lang: en
permalink: /wiki/HUE%20Motion
---
This node listens to a Hue motion sensor and mirrors the events to KNX and/or your Node-RED flow.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type. Hit the refresh button next to "Hue sensor” to reload the device list from the bridge if you add new sensors.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway that receives the motion updates (required before KNX mapping fields appear). |
| HUE Bridge | Hue bridge to query. |
| HUE Sensor | Hue motion sensor (supports autocomplete and refresh). |

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
