---
layout: wiki
title: "Getting started"
lang: en
permalink: /wiki/Getting-Started
translation_key: "Getting-Started"
---

# Getting started

For a new installation, follow the steps below. If your flows already use KNX Ultimate 7, complete the upgrade guide first.

> [Upgrade from version 7]({{ '/wiki/Migration-8' | relative_url }})

Requires Node.js 20.18.1 or newer and Node-RED 3.1.1 or newer.

1. In Node-RED, open **Manage palette → Install** and install `node-red-contrib-knx-ultimate`. Restart Node-RED.

2. Drag **KNX Device** into a flow. Add a gateway configuration and enter the address and connection settings of your KNX interface. Import your ETS group addresses if available.

3. Choose a group address from your installation and its datapoint. For an on/off command, use the matching boolean datapoint, such as `1.001`.

4. Connect an **Inject** node with a boolean `msg.payload` (`true` or `false`) to KNX Device. Connect KNX Device to **Debug** to inspect received telegrams.

5. Review the chosen address and press **Deploy**. Use Inject to send the command. Enable **React to response** to see replies to read requests.

## Read a value from the bus

Enable the manual button in KNX Device. Its actions are **Toggle boolean**, **Send KNX Read** (second item) and **Write custom value**. Choose Read and click the button to request the configured address. This button action is not available in universal mode. From a flow, you can also send `msg.readstatus = true`.

[KNX Device]({{ '/wiki/Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/Gateway-configuration' | relative_url }}) · [Examples]({{ '/wiki/-SamplesHome' | relative_url }})

## Video tutorials

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
