---
layout: wiki
title: "HATranslator"
lang: zh-CN
permalink: /wiki/zh-CN-HATranslator
---

<!-- KNX_UTILITY_LEGACY_NOTICE -->
> 此专用节点仍兼容现有流程。新流程请使用 [KNX Utility](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNX-Utility) 并选择 **Home Assistant Translator**。其编辑器可批量转换所有流程和子流程中的全部兼容旧版工具节点，支持一次撤销及手动部署。

Home Assistant Translator 有一个输入和一个输出，无需 KNX 网关。选择要转换的消息属性（如 `payload` 或 `data.new_state.state`），并编辑 `来源:true` / `来源:false` 映射，例如 `open:true` 和 `closed:false`。转换后的布尔值通过 `msg.payload` 输出；如需写入总线，请将输出连接到 KNX Device。

此节点将输入msg转换为有效的true/false值。

它可以将输入有效载荷转换为true /false布尔值。

文本框中的每一行代表一个翻译命令。

您可以添加自己的翻译行。

|属性|描述|
| - | - |
|名称|节点名称。|
|输入|要评估和翻译的输入MSG属性。|
|翻译|添加，删除或编辑自己的翻译命令。该行的翻译命令必须是\*\*输入字符串，来自ha：knx value \*\*（_knx valu&#x65;_&#x4E3A;true或false）。例如：<code> open：true </code> <code>封闭：false </code>。|
