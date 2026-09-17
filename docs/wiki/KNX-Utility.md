---
layout: wiki
title: "KNX Utility"
lang: en
permalink: /wiki/KNX-Utility
translation_key: "KNX-Utility"
---
# KNX Utility

**KNX Utility** combines eleven KNX helper functions in one palette node. Select a **Function** to display its settings, icon and flow ports. **KNX Device (KNXUltimate)** remains the main node for sending and receiving KNX telegrams.

## Eleven functions, one node

| Function and settings reference | Purpose | Inputs / outputs |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | Report alerted devices individually, together or as the most recent alert. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | Answer KNX group read requests using configured or previously received values. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/DateTime-Configuration) | Send the current date and time using DPT 19.001, 11.001 and 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | Monitor the gateway or a KNX device and report connection problems. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | Share KNX values through the configured Node-RED global context store. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | Record bus telegrams as ETS-compatible XML and count traffic. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration) | Control timed staircase lighting with status, override and pre-warning options. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | Manage garage commands, impulse control, safety inputs and automatic closing. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | Recall, record and store scenes with configurable group addresses and values. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | Shed and restore configured loads according to power consumption and limits. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) | Translate Home Assistant state strings to boolean values with a configurable input property and mapping table. | 1 / 1 |

The table shows the flow ports for each function. AutoResponder and Global Context work directly with the bus and context. DateTime uses scheduled sends and its canvas button; it has no flow input or output.

Home Assistant Translator has one input and one output and does not require a KNX gateway. Choose the message property to translate (for example `payload` or `data.new_state.state`) and edit the `source:true` / `source:false` mappings, such as `open:true` and `closed:false`. It sends the translated boolean in `msg.payload`; connect its output to KNX Device when a bus write is needed.

## Configure a Utility node

1. Drag **KNX Utility** from the palette into your flow.
2. Choose the **Function**, select the KNX gateway where required, and fill in the settings shown for that function.
3. Save the node and check its input/output connections. Press **Deploy** when you are ready to activate it.

Changing the function in the editor previews its settings. **Cancel** keeps the previously saved configuration. Use the links in the table for the function-specific settings and examples; those pages remain available as the dedicated-node reference.

## Upgrade from version 7

Convert the old separate nodes while **KNX Ultimate 7** is installed, then Deploy before upgrading. The conversion keeps IDs, settings and wires and provides a flow backup and Undo. Version 8 does not load the removed node types.

[Upgrade from version 7]({{ '/wiki/Migration-8' | relative_url }})
