---
layout: wiki
title: "HATranslator"
lang: en
permalink: /wiki/HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)

This node translates the input msg to valid true/false values.

It can translate an input payload, to a true/false boolean values.

Each row in the text box, represents a translation command. 

You can add your own translation row.

|Property|Description|
|--|--|
| Name | The node name. |
| Input | The input msg property to be evaluated and translated. |
| Translate | Add, delete or edit your own translation command. The row's translation command must be **input string from HA:KNX value** (_KNX value_ as true or false). For example: <code>open:true</code> <code>closed:false</code>. |
