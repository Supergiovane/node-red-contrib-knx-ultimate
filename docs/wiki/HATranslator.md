---
layout: wiki
title: "HATranslator"
lang: en
permalink: /wiki/HATranslator
---
## Upgrade to KNX Ultimate 8

Version 7 adds a compact **Upgrade to v8** button at the top of every node editor. It backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Read the full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> This dedicated node remains compatible with existing flows. For new flows use [KNX Utility](/node-red-contrib-knx-ultimate/wiki/KNX-Utility) and select **Home Assistant Translator**. Its editor provides bulk conversion of all compatible legacy utility nodes across every flow and subflow, with a single Undo and manual Deploy.

Home Assistant Translator has one input and one output and does not require a KNX gateway. Choose the message property to translate (for example `payload` or `data.new_state.state`) and edit the `source:true` / `source:false` mappings, such as `open:true` and `closed:false`. It sends the translated boolean in `msg.payload`; connect its output to KNX Device when a bus write is needed.

This node translates the input msg to valid true/false values.

It can translate an input payload, to a true/false boolean values.

Each row in the text box, represents a translation command. 

You can add your own translation row.

|Property|Description|
|--|--|
| Name | The node name. |
| Input | The input msg property to be evaluated and translated. |
| Translate | Add, delete or edit your own translation command. The row's translation command must be **input string from HA:KNX value** (_KNX value_ as true or false). For example: <code>open:true</code> <code>closed:false</code>. |
