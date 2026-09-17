---
layout: wiki
title: "HATranslator"
lang: en
permalink: /wiki/HATranslator
translation_key: "HATranslator"
---

> In version 8, use **KNX Utility** and select **Home Assistant Translator**. The settings below describe this function. The old separate node is no longer included.
>
> [KNX Utility]({{ '/wiki/KNX-Utility' | relative_url }}) · [Upgrade from version 7]({{ '/wiki/Migration-8' | relative_url }})


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
