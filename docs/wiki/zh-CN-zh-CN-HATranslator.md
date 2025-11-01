---
layout: wiki
title: "zh-CN-HATranslator"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HATranslator/
---
---

<p>此节点将输入msg转换为有效的true/false值。<p>

它可以将输入有效载荷转换为true /false布尔值。<br />
文本框中的每一行代表一个翻译命令。<br/>
您可以添加自己的翻译行。<br/>

|属性|描述|
| - | - |
|名称|节点名称。|
|输入|要评估和翻译的输入MSG属性。|
|翻译|添加，删除或编辑自己的翻译命令。该行的翻译命令必须是\*\*输入字符串，来自ha：knx value \*\*（_knx valu&#x65;_&#x4E3A;true或false）。例如：<code> open：true </code> <code>封闭：false </code>。|

<br/>
