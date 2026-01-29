---
layout: wiki
title: "HUE Device software update"
lang: en
permalink: /wiki/HUE%20Device%20software%20update
---
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
