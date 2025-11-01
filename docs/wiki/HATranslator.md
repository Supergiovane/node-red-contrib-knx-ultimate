---
layout: wiki
title: "HATranslator"
lang: en
permalink: /wiki/HATranslator/
---
This node translates the input msg to valid true/false values.

It can translate an input payload, to a true/false boolean values.

Each row in the text box, represents a translation command. 

You can add your own translation row.

|Property|Description|
|--|--|
| Name | The node name. |
| Input | The input msg property to be evaluated and translated. |
| Translate | Add, delete or edit your own translation command. The row's translation command must be **input string from HA:KNX value** (_KNX value_ as true or false). For example: <code>open:true</code> <code>closed:false</code>. |
